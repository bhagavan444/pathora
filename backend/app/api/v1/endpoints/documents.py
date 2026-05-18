from fastapi import APIRouter, UploadFile, File, BackgroundTasks, HTTPException
from typing import List
import uuid
import mimetypes
from app.worker.tasks import process_document

router = APIRouter()

SUPPORTED_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", # DOCX
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", # PPTX
    "text/csv",
    "application/zip",
    "text/markdown",
    "application/json",
    "image/jpeg",
    "image/png"
]

@router.post("/upload")
async def upload_document(
    files: List[UploadFile] = File(...)
):
    """
    Enterprise multi-file document intelligence pipeline.
    Handles massive files concurrently and offloads to Celery/Redis for GPU-ready OCR and extraction.
    """
    uploaded_docs = []
    
    for file in files:
        if not file.filename:
            continue
            
        content_type = file.content_type
        if content_type not in SUPPORTED_TYPES:
            # Attempt to guess
            guess, _ = mimetypes.guess_type(file.filename)
            if guess not in SUPPORTED_TYPES:
                raise HTTPException(status_code=400, detail=f"Unsupported file type: {content_type}")
                
        doc_id = str(uuid.uuid4())
        
        # In a real system, we'd stream the file directly to S3/Cloud Storage here.
        # For local execution, we'll read bytes to pass to Celery or save locally.
        content = await file.read()
        
        # Dispatch to robust Celery background worker
        process_document.delay(doc_id, file.filename, content_type, content)
        
        uploaded_docs.append({"doc_id": doc_id, "filename": file.filename, "status": "queued_for_intelligence"})
        
    return {"message": "Files queued successfully in distributed processing pipeline.", "documents": uploaded_docs}
