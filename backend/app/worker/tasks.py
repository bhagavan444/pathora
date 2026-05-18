import time
import logging

logger = logging.getLogger("celery_worker")

# Try to import celery app — it may not be available
celery_app = None
try:
    from app.worker.celery_app import celery_app
except Exception:
    pass

if celery_app:
    @celery_app.task(name="process_document", bind=True, max_retries=3)
    def process_document(self, doc_id: str, filename: str, content_type: str, content: bytes):
        """
        Background task to process documents via Celery.
        """
        try:
            logger.info(f"Processing {filename} ({doc_id}) [{content_type}]")
            
            extracted_text = ""
            if "pdf" in content_type:
                extracted_text = "[Extracted PDF Content]"
            elif "image" in content_type:
                extracted_text = "[Extracted OCR Text]"
            elif "openxmlformats" in content_type:
                extracted_text = "[Extracted Office Text]"
            else:
                extracted_text = "[Extracted Standard Text]"
                
            chunks = [extracted_text[i:i+500] for i in range(0, len(extracted_text), 500)]
            
            logger.info(f"Pipeline completed for {doc_id}")
            return {"status": "success", "doc_id": doc_id, "chunks_processed": len(chunks)}
            
        except Exception as exc:
            logger.error(f"Error processing document {doc_id}: {exc}")
            raise self.retry(exc=exc, countdown=2 ** self.request.retries)
else:
    def process_document(doc_id: str, filename: str, content_type: str, content: bytes):
        """
        Synchronous fallback when Celery is not available.
        """
        try:
            logger.info(f"[SYNC] Processing {filename} ({doc_id}) [{content_type}]")
            
            extracted_text = ""
            if "pdf" in content_type:
                extracted_text = "[Extracted PDF Content]"
            elif "image" in content_type:
                extracted_text = "[Extracted OCR Text]"
            elif "openxmlformats" in content_type:
                extracted_text = "[Extracted Office Text]"
            else:
                extracted_text = "[Extracted Standard Text]"
                
            chunks = [extracted_text[i:i+500] for i in range(0, len(extracted_text), 500)]
            
            logger.info(f"Pipeline completed for {doc_id}")
            return {"status": "success", "doc_id": doc_id, "chunks_processed": len(chunks)}
            
        except Exception as exc:
            logger.error(f"Error processing document {doc_id}: {exc}")
            return {"status": "error", "detail": str(exc)}
