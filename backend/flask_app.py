"""
This file previously contained the legacy Flask application.
It has been replaced with an ASGI-to-WSGI adapter.

Render's configuration is currently set to boot 'flask_app:app' via Gunicorn.
Instead of forcing you to change Render settings, this script intercepts
that WSGI start command and automatically binds it to the modern FastAPI backend.
"""

from a2wsgi import ASGIMiddleware
from app.main import app as fastapi_app

# Gunicorn looks for this 'app' variable. 
# We wrap FastAPI (ASGI) into a WSGI-compatible interface so Render boots it seamlessly.
app = ASGIMiddleware(fastapi_app)
