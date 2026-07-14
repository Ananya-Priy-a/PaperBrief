from fastapi import HTTPException, UploadFile
from app.supabase_client import get_supabase
from app.core.config import settings


def validate_pdf_upload(file: UploadFile, file_bytes: bytes) -> None:
    # Check if file has a .pdf extension
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400, detail="Invalid file type. Only PDF is allowed."
        )

    # Check file size in MB
    max_size_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(file_bytes) > max_size_bytes:
        raise HTTPException(
            status_code=400,
            detail=f"File size exceeds limit of {settings.MAX_UPLOAD_SIZE_MB}MB.",
        )


def upload_pdf_to_storage(user_id: str, document_id: str, file_bytes: bytes) -> str:
    supabase = get_supabase()
    storage_path = f"{user_id}/{document_id}.pdf"
    supabase.storage.from_(settings.SUPABASE_STORAGE_BUCKET).upload(
        path=storage_path,
        file=file_bytes,
        file_options={"content-type": "application/pdf"},
    )
    return storage_path


def delete_pdf_from_storage(storage_path: str) -> None:
    supabase = get_supabase()
    supabase.storage.from_(settings.SUPABASE_STORAGE_BUCKET).remove([storage_path])
