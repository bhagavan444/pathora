import sys
import traceback

def create_app():
    try:
        from a2wsgi import ASGIMiddleware
        from app.main import app as fastapi_app
        return ASGIMiddleware(fastapi_app)
    except Exception as e:
        print("CRITICAL ERROR BOOTING APP:", e, file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        raise

app = create_app()

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    # Run uvicorn directly if executed as a script
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)
