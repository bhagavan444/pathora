import time
import logging
import uuid
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

logger = logging.getLogger("telemetry")

class TelemetryMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        request_id = str(uuid.uuid4())
        start_time = time.perf_counter()
        
        # Attach request_id to request state for downstream use
        request.state.request_id = request_id
        
        # Log request start
        logger.info(f"Request started | id: {request_id} | method: {request.method} | path: {request.url.path}")
        
        try:
            response = await call_next(request)
            
            # Add audit headers
            response.headers["X-Request-ID"] = request_id
            
            process_time = time.perf_counter() - start_time
            logger.info(f"Request completed | id: {request_id} | status: {response.status_code} | duration: {process_time:.4f}s")
            return response
            
        except Exception as e:
            process_time = time.perf_counter() - start_time
            logger.error(f"Request failed | id: {request_id} | error: {str(e)} | duration: {process_time:.4f}s")
            raise
