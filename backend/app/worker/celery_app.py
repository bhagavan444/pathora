from celery import Celery
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

celery_app = None

if settings.CELERY_BROKER_URL and settings.CELERY_RESULT_BACKEND:
    celery_app = Celery(
        "ai_worker",
        broker=settings.CELERY_BROKER_URL,
        backend=settings.CELERY_RESULT_BACKEND
    )

    celery_app.conf.update(
        task_serializer="json",
        accept_content=["json"],
        result_serializer="json",
        timezone="UTC",
        enable_utc=True,
        # Acknowledge task after it has been executed
        task_acks_late=True,
        worker_prefetch_multiplier=1,
    )
    logger.info("Celery initialized successfully.")
else:
    logger.info("Celery broker URLs not found. Celery initialization skipped.")

# Optional: Auto-discover tasks in your application
# celery_app.autodiscover_tasks(["app.worker.tasks"])
