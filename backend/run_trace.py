import os
# Mock env var before importing app
os.environ["DEBUG_INTELLIGENCE_PIPELINE"] = "true"
os.environ["FLASK_ENV"] = "development"
os.environ["GEMINI_API_KEY"] = "mock_key_for_test"

from flask_app import app, db
from models import ResumeVersion
import json
import logging

logging.basicConfig(level=logging.DEBUG)

def run_trace():
    client = app.test_client()
    
    with app.app_context():
        # Clean DB for test
        db.create_all()
        
        # 1. Upload mock PDF
        print("\n--- STAGE 1: UPLOAD ---")
        # Creating a mock PDF file (just a text file masquerading as PDF)
        with open("test.pdf", "w") as f:
            f.write("This is a dummy PDF with Python React skills.")
            
        with open("test.pdf", "rb") as f:
            data = {'files': f}
            res = client.post('/api/v1/documents/upload', data=data)
            
        print(f"Upload Status: {res.status_code}")
        print(f"Upload Response: {res.data.decode('utf-8')}")
        
        if res.status_code != 200:
            print("FAILED AT UPLOAD STAGE")
            return
            
        upload_json = json.loads(res.data)
        doc_id = upload_json['documents'][0]['doc_id']
        
        # 2. Analyze Stream
        print("\n--- STAGE 2: ANALYZE STREAM ---")
        payload = {
            "doc_id": doc_id,
            "target_role": "Software Engineer"
        }
        
        res = client.post('/api/v1/resume/analyze/stream', json=payload)
        print(f"Stream Status: {res.status_code}")
        
        if res.status_code != 200:
            print(f"FAILED AT STREAM SETUP: {res.data.decode('utf-8')}")
            return
            
        print("Stream chunks:")
        try:
            for chunk in res.iter_encoded():
                print(chunk.decode('utf-8'))
        except Exception as e:
            print(f"Exception during stream iteration: {e}")

if __name__ == "__main__":
    run_trace()
