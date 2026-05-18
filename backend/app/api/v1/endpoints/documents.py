from fastapi import APIRouter, UploadFile, File, BackgroundTasks, HTTPException
from typing import List
import uuid
import mimetypes
import logging

logger = logging.getLogger("documents_endpoint")

# Try to import process_document — gracefully handle if unavailable
try:
    from app.worker.tasks import process_document
except Exception as e:
    logger.warning(f"Document processing task import failed: {e}")
    process_document = None

router = APIRouter()

SUPPORTED_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/csv",
    "application/zip",
    "text/markdown",
    "application/json",
    "image/jpeg",
    "image/png"
]

@router.post("/upload")
async def upload_document(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...)
):
    """
    Multi-file document upload and processing pipeline.
    """
    uploaded_docs = []
    
    for file in files:
        if not file.filename:
            continue
            
        content_type = file.content_type
        if content_type not in SUPPORTED_TYPES:
            guess, _ = mimetypes.guess_type(file.filename)
            if guess not in SUPPORTED_TYPES:
                raise HTTPException(status_code=400, detail=f"Unsupported file type: {content_type}")
                
        doc_id = str(uuid.uuid4())
        content = await file.read()
        
        if process_document:
            if hasattr(process_document, "delay"):
                process_document.delay(doc_id, file.filename, content_type, content)
            else:
                background_tasks.add_task(process_document, doc_id, file.filename, content_type, content)
        else:
            logger.warning(f"Document processing unavailable for {file.filename}")
        
        uploaded_docs.append({
            "doc_id": doc_id,
            "filename": file.filename,
            "status": "queued_for_processing"
        })
        
    return {
        "message": "Files received successfully.",
        "documents": uploaded_docs
    }
