import jwt
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.config import settings
import logging

logger = logging.getLogger("security")

class SecurityMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Allow openapi, docs, and health checks to bypass strict auth for now
        open_paths = ["/api/v1/openapi.json", "/docs", "/health"]
        
        if any(request.url.path.startswith(path) for path in open_paths):
            return await call_next(request)
            
        # Example JWT Validation Logic (Placeholder for strict implementation)
        # auth_header = request.headers.get("Authorization")
        # if auth_header and auth_header.startswith("Bearer "):
        #     token = auth_header.split(" ")[1]
        #     try:
        #         payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        #         request.state.user = payload
        #     except jwt.ExpiredSignatureError:
        #         return JSONResponse(status_code=401, content={"detail": "Token expired"})
        #     except jwt.PyJWTError:
        #         return JSONResponse(status_code=401, content={"detail": "Invalid token"})
        
        return await call_next(request)
