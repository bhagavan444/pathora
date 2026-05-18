from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from google import genai
import uuid
from datetime import datetime
import logging
import pdfplumber
import json
import re

# ---------------- App Setup ----------------
app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ---------------- Gemini Setup ----------------
import os
from dotenv import load_dotenv

load_dotenv()

gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key:
    raise RuntimeError("CRITICAL STARTUP ERROR: GEMINI_API_KEY environment variable is missing. Server cannot start.")

client = genai.Client(api_key=gemini_api_key)
model_name = 'gemini-2.5-flash'

# ---------------- Storage ----------------
chat_sessions = {}

# ---------------- Helpers ----------------
def extract_resume_text(file):
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text.strip()


def safe_json_extract(text):
    """
    Extract valid JSON block from Gemini response safely
    """
    try:
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            return json.loads(match.group())
    except Exception:
        pass
    return None


# ---------------- CHAT API (UNCHANGED) ----------------
@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json(force=True)
        message = data.get("message", "").strip()
        chat_id = data.get("chat_id", str(uuid.uuid4()))

        if not message:
            return jsonify({"reply": "Message cannot be empty"}), 400

        prompt = (
            "You are a career guidance assistant.\n"
            "Explain topics clearly in your OWN words.\n"
            "Do NOT quote textbooks or copyrighted content.\n\n"
            f"User: {message}"
        )

        response = client.models.generate_content(
            model=model_name,
            contents=prompt
        )

        reply = "Please rephrase your question."

        if response and response.text:
            reply = response.text

        chat_sessions.setdefault(chat_id, []).append({
            "role": "user",
            "message": message,
            "time": datetime.now().isoformat()
        })
        chat_sessions[chat_id].append({
            "role": "assistant",
            "message": reply,
            "time": datetime.now().isoformat()
        })

        return jsonify({"reply": reply, "chat_id": chat_id})

    except Exception as e:
        error_str = str(e)
        logger.exception(f"Chat error: {error_str}")

        if "429" in error_str or "ResourceExhausted" in error_str or "RESOURCE_EXHAUSTED" in error_str:
            return jsonify({
                "reply": "AI usage limit reached. Please wait a minute and try again."
            }), 429
        if "403" in error_str or "PERMISSION_DENIED" in error_str:
            return jsonify({"reply": "AI service authentication error. Check API key."}), 403
        if "404" in error_str or "NOT_FOUND" in error_str:
            return jsonify({"reply": f"Model '{model_name}' not found. Contact support."}), 500

        return jsonify({"reply": "I encountered an issue generating a response. Please try again."}), 500


@app.route("/api/chats", methods=["GET"])
def get_chats():
    sessions = []
    for cid, msgs in chat_sessions.items():
        title = msgs[0]['message'][:30] if msgs else "New Chat"
        sessions.append({
            "_id": cid, 
            "title": title, 
            "messages": msgs,
            "createdAt": msgs[0].get("time") if msgs else datetime.now().isoformat()
        })
    return jsonify({"sessions": sessions})

@app.route("/api/chats", methods=["POST"])
def create_chat():
    chat_id = str(uuid.uuid4())
    chat_sessions[chat_id] = []
    return jsonify({"chat_id": chat_id})

@app.route("/api/chats/<chat_id>", methods=["GET"])
def get_chat(chat_id):
    if chat_id in chat_sessions:
        return jsonify({"messages": chat_sessions[chat_id]})
    return jsonify({"error": "Not found"}), 404

@app.route("/api/chats/<chat_id>", methods=["DELETE"])
def delete_chat(chat_id):
    if chat_id in chat_sessions:
        del chat_sessions[chat_id]
        return jsonify({"success": True})
    return jsonify({"error": "Not found"}), 404

@app.route("/api/chats", methods=["DELETE"])
def delete_all_chats():
    chat_sessions.clear()
    return jsonify({"success": True})

import os
import tempfile

@app.route("/api/documents/upload", methods=["POST"])
def upload_documents():
    chat_id = request.form.get("chat_id")
    files = request.files.getlist("files")
    
    if not chat_id:
        return jsonify({"error": "chat_id required"}), 400

    uploaded_gemini_files = []
    
    for f in files:
        try:
            # Determine extension
            ext = os.path.splitext(f.filename)[1]
            if not ext:
                ext = ".txt"
                
            with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
                f.save(tmp.name)
                # Upload to Gemini natively (handles OCR for Image PDFs, Docs, Images, etc.)
                g_file = client.files.upload(file=tmp.name, config={'display_name': f.filename})
                uploaded_gemini_files.append({"name": g_file.name, "display_name": f.filename})
            os.remove(tmp.name)
        except Exception as e:
            logger.error(f"Failed to upload {f.filename} to Gemini: {e}")
    
    if uploaded_gemini_files:
        chat_sessions.setdefault(chat_id, []).append({
            "role": "user",
            "message": "[SYSTEM ALERT: User attached files]",
            "gemini_files": uploaded_gemini_files,
            "time": datetime.now().isoformat()
        })
        
    return jsonify({"status": "processing_started", "message": "Files received successfully."})

@app.route("/api/chat/stream/<chat_id>", methods=["POST"])
def chat_stream(chat_id):
    try:
        data = request.get_json(force=True)
        message = data.get("message", "").strip()
        
        history = chat_sessions.get(chat_id, [])
        
        # Build prompt and gather any attached files
        context_str = ""
        prompt_parts = []
        
        for msg in history[-8:]:  # Include last 8 messages for context
            role = "User" if msg["role"] == "user" else "Assistant"
            if "gemini_files" in msg:
                context_str += f"{role} attached files:\n"
                for gf in msg["gemini_files"]:
                    try:
                        g_file = client.files.get(name=gf["name"])
                        prompt_parts.append(g_file)
                        context_str += f"- {gf['display_name']}\n"
                    except Exception as e:
                        logger.error(f"Could not retrieve Gemini file: {e}")
            else:
                context_str += f"{role}: {msg['message']}\n"
            
        system_prompt = (
            "You are a career guidance assistant and AI Document Analyzer.\n"
            "Explain topics clearly in your OWN words. Do NOT quote textbooks or copyrighted content.\n"
            "Analyze the attached files thoroughly if the user asks about them.\n\n"
            f"{context_str}"
            f"User: {message}\n"
            "Assistant:"
        )
        
        prompt_parts.append(system_prompt)
        
        def generate():
            try:
                # Streaming response from Gemini with Native Multimodal parts
                response = client.models.generate_content_stream(
                    model=model_name,
                    contents=prompt_parts
                )
                full_reply = ""
                for chunk in response:
                    if chunk.text:
                        full_reply += chunk.text
                        # Encode as JSON to safely transport newlines
                        data_payload = json.dumps({"text": chunk.text})
                        yield f"data: {data_payload}\n\n"
                
                # Save to sessions
                chat_sessions.setdefault(chat_id, []).append({
                    "role": "user",
                    "message": message,
                    "time": datetime.now().isoformat()
                })
                chat_sessions[chat_id].append({
                    "role": "assistant",
                    "message": full_reply,
                    "time": datetime.now().isoformat()
                })
                
                yield "data: [DONE]\n\n"
            except Exception as e:
                logger.exception("Stream error")
                error_msg = json.dumps({"text": f"\n\n⚠️ Error: {str(e)}"})
                yield f"data: {error_msg}\n\n"
                yield "data: [DONE]\n\n"
                
        return Response(generate(), mimetype="text/event-stream")
    except Exception as e:
        logger.exception("Chat stream setup error")
        return jsonify({"error": str(e)}), 500


# ---------------- RESUME PREDICT API (UPDATED) ----------------
@app.route("/predict", methods=["POST"])
def predict():
    try:
        if "resume" not in request.files:
            return jsonify({"error": "Resume file required"}), 400

        resume_file = request.files["resume"]
        preferred_domain = request.form.get("preferredDomain", "")
        interests = request.form.get("interests", "")

        resume_text = extract_resume_text(resume_file)

        if not resume_text:
            return jsonify({"error": "Unable to extract resume text"}), 400

        prompt = f"""
You are an enterprise-grade AI Resume Analysis System.

Analyze the resume content and return ONLY valid JSON.
Do NOT include explanations, markdown, or extra text.

Resume Content:
{resume_text}

Preferred Domain: {preferred_domain}
User Interests: {interests}

Return JSON strictly in this format:

{{
  "score": 0-100,
  "roles": ["Role1", "Role2"],
  "skills": ["Skill1", "Skill2"],
  "summary": {{
    "education": "Short professional summary",
    "experience": "Short professional summary"
  }},
  "aspectScores": [
    {{ "name": "Formatting", "value": 0-100 }},
    {{ "name": "Keywords", "value": 0-100 }},
    {{ "name": "Experience", "value": 0-100 }}
  ],
  "roadmap": [
    "Step 1",
    "Step 2",
    "Step 3"
  ],
  "improvements": [
    "Improvement 1",
    "Improvement 2"
  ],
  "growthProjection": [
    {{ "year": 2025, "salary": 300000 }},
    {{ "year": 2026, "salary": 420000 }}
  ]
}}
"""

        response = client.models.generate_content(
            model=model_name,
            contents=prompt
        )

        if not response or not response.text:
            return jsonify({"error": "AI did not return response"}), 500

        raw_text = response.text
        parsed = safe_json_extract(raw_text)

        if not parsed:
            logger.error("Failed to parse AI JSON")
            return jsonify({"error": "Invalid AI response format"}), 500

        return jsonify(parsed)

    except json.JSONDecodeError:
        logger.exception("JSON decode error")
        return jsonify({"error": "AI returned malformed JSON"}), 500

    except Exception as e:
        if "429" in str(e) or "ResourceExhausted" in str(e):
            return jsonify({
                "error": "AI usage limit reached. Please wait 1 minute and retry."
            }), 429

        logger.exception("Resume analysis error")
        return jsonify({"error": "Failed to analyze resume"}), 500


# ---------------- Run App ----------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)
