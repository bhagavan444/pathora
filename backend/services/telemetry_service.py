import time
from contextlib import contextmanager
from models import TelemetryLog
from extensions import db
import logging

logger = logging.getLogger(__name__)

class TelemetryService:
    @staticmethod
    @contextmanager
    def track_execution(action_name: str, metadata: dict = None):
        """
        Context manager to track execution time and store in the database.
        Usage:
            with TelemetryService.track_execution('pdf_parse', {'filename': 'x.pdf'}):
                parse_pdf()
        """
        start_time = time.perf_counter()
        try:
            yield
        finally:
            end_time = time.perf_counter()
            duration_ms = (end_time - start_time) * 1000.0
            
            try:
                log = TelemetryLog(
                    action=action_name,
                    duration_ms=duration_ms,
                    metadata_json=metadata or {}
                )
                db.session.add(log)
                db.session.commit()
            except Exception as e:
                import traceback
                db.session.rollback()
                logger.error(f"[TELEMETRY] Failed to save telemetry for {action_name}: {traceback.format_exc()}")
                
    @staticmethod
    def log_metric(action_name: str, duration_ms: float, metadata: dict = None):
        """Log a specific metric manually if not using context manager"""
        try:
            log = TelemetryLog(
                action=action_name,
                duration_ms=duration_ms,
                metadata_json=metadata or {}
            )
            db.session.add(log)
            db.session.commit()
        except Exception as e:
            import traceback
            db.session.rollback()
            logger.error(f"[TELEMETRY] Failed to save manual telemetry for {action_name}: {traceback.format_exc()}")
