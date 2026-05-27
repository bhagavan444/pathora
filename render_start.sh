#!/usr/bin/env bash
echo "Changing to backend directory..."
cd backend

echo "Starting Uvicorn..."
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
