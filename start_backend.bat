@echo off
echo ========================================================
echo PATHORA BACKEND BOOTSTRAP SCRIPT
echo ========================================================
echo.

cd backend

echo [1] Checking for .env file...
if not exist .env (
    echo .env missing! Creating from .env.example...
    copy .env.example .env
) else (
    echo .env found.
)

echo.
echo [2] Checking Python Virtual Environment...
if exist venv\Scripts\activate.bat (
    echo Activating venv...
    call venv\Scripts\activate.bat
) else if exist .venv\Scripts\activate.bat (
    echo Activating .venv...
    call .venv\Scripts\activate.bat
) else if exist env\Scripts\activate.bat (
    echo Activating env...
    call env\Scripts\activate.bat
) else (
    echo WARNING: No virtual environment found. Using global Python.
)

echo.
echo [3] Installing Requirements...
pip install -r requirements.txt

echo.
echo [4] Starting Flask Backend...
echo.
python flask_app.py

pause
