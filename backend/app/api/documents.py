import os
import uuid

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File

from app.api.deps import get_current_user
from app.services.pdf_parser import extract_pdf_with_metadata
from app.services.hybrid_retriever import build_indexes, drop_index
from app.services.storage_service import (
    validate_pdf_upload,
    upload_pdf_to_storage,
    delete_pdf_from_storage,
)
from app.services import records

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("")
async def upload_pdf(file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    user_id = user["sub"]
    file_bytes = await file.read()
    validate_pdf_upload(file, file_bytes)

    document_id = str(uuid.uuid4())
    storage_path = upload_pdf_to_storage(user_id, document_id, file_bytes)

    records.create_document_row(
        document_id=document_id,
        user_id=user_id,
        filename=file.filename,
        storage_path=storage_path,
        file_size_bytes=len(file_bytes),
    )

    temp_path = f"temp_{document_id}.pdf"
    try:
        with open(temp_path, "wb") as f:
            f.write(file_bytes)
        parsed_documents = extract_pdf_with_metadata(temp_path)
        chunk_count = build_indexes(parsed_documents, document_id=document_id)
        page_count = max((d["page"] for d in parsed_documents), default=0)
        records.update_document_status(document_id, status="ready", page_count=page_count)
    except Exception as e:
        records.update_document_status(document_id, status="failed")
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {e}")
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

    return {
        "message": "PDF processed with hybrid index",
        "document_id": document_id,
        "chunks_indexed": chunk_count,
    }


@router.get("")
async def list_documents(user: dict = Depends(get_current_user)):
    return records.list_documents(user["sub"])


@router.delete("/{document_id}")
async def delete_document(document_id: str, user: dict = Depends(get_current_user)):
    user_id = user["sub"]
    document = records.get_document(document_id, user_id)
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found.")
    try:
        delete_pdf_from_storage(document["storage_path"])
    except Exception:
        pass
    drop_index(document_id)
    records.delete_document_row(document_id, user_id)
    return {"message": "Document deleted."}
