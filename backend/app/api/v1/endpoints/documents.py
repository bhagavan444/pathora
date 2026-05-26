from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
import uuid
import io
import logging

logger = logging.getLogger("documents_endpoint")

router = APIRouter()

# === IN-MEMORY RESUME STORE ===
# Stores doc_id -> extracted resume text (no DB dependency needed for the prediction pipeline)
_resume_store: dict[str, str] = {}

def get_resume_text(doc_id: str) -> str | None:
    return _resume_store.get(doc_id)

def _extract_pdf_text(content: bytes) -> str:
    """Extract text from PDF bytes using pdfplumber."""
    import pdfplumber
    text_parts = []
    try:
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            for page in pdf.pages:
                t = page.extract_text()
                if t:
                    text_parts.append(t.strip())
    except Exception as e:
        logger.warning(f"pdfplumber extraction failed: {e}")
    return "\n".join(text_parts)

SUPPORTED_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "text/markdown",
    "application/json",
]

@router.post("/upload")
async def upload_document(files: List[UploadFile] = File(...)):
    """
    Upload one or more documents. Extracts text synchronously and stores
    it in the in-memory resume store keyed by a generated doc_id.
    Returns doc_ids the analyze endpoint can use immediately.
    """
    uploaded_docs = []

    for file in files:
        if not file.filename:
            continue

        content = await file.read()
        content_type = file.content_type or ""

        # Infer type from extension if content_type is missing/octet-stream
        if "pdf" in file.filename.lower() or "pdf" in content_type:
            extracted_text = _extract_pdf_text(content)
        elif "plain" in content_type or file.filename.endswith(".txt"):
            try:
                extracted_text = content.decode("utf-8", errors="ignore")
            except Exception:
                extracted_text = ""
        else:
            # Attempt PDF extraction as fallback (many browsers send octet-stream for PDFs)
            extracted_text = _extract_pdf_text(content)
            if not extracted_text:
                try:
                    extracted_text = content.decode("utf-8", errors="ignore")
                except Exception:
                    extracted_text = ""

        if not extracted_text.strip():
            raise HTTPException(
                status_code=400,
                detail=f"Could not extract text from '{file.filename}'. File may be scanned, encrypted, or empty."
            )

        doc_id = str(uuid.uuid4())
        _resume_store[doc_id] = extracted_text
        logger.info(f"[UPLOAD] '{file.filename}' → doc_id={doc_id}, chars={len(extracted_text)}")

        uploaded_docs.append({
            "doc_id": doc_id,
            "filename": file.filename,
            "status": "ready",
            "chars_extracted": len(extracted_text)
        })

    return {
        "message": "Files received successfully.",
        "documents": uploaded_docs
    }
