import uuid

from fastapi import APIRouter, UploadFile, File

from app.services.pdf_parser import extract_pdf_with_metadata
from app.services.hybrid_retriever import build_indexes

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    file_id = str(uuid.uuid4())
    file_path = f"temp_{file_id}.pdf"

    with open(file_path, "wb") as f:
        f.write(await file.read())

    documents = extract_pdf_with_metadata(file_path)
    build_indexes(documents)

    return {"message": "PDF processed with hybrid index"}
