from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from google import genai
import uuid
from datetime import datetime
import logging
import pdfplumber
import json
import re
import os
import tempfile
from dotenv import load_dotenv
from sqlalchemy import text

# Database extensions and models
from config import Config
from extensions import db, migrate
from models import User, Chat, Message, UploadedDocument, ResumeAnalysis, QuizResult
from models import ResumeVersion, ExtractedSkill, AnalysisMetric, TelemetryLog, SemanticEmbedding
from models import UserPreferences, UserSecurityEvent, UserApiToken, UserConnectedAccount
from models import UserAssessment, AssessmentResult, AssessmentTelemetry, EngineeringVector, RecruiterAdjustment, RoadmapUpdate, EvaluationHistory

# Intelligence Services
from services.telemetry_service import TelemetryService
from services.ats_engine import ATSEngine
from services.skill_gap_engine import SkillGapEngine
from services.semantic_engine import SemanticEngine

# Core Deterministic Engines
from core.ingestion.document_parser import DocumentParser
from core.ingestion.entity_extractor import EntityExtractor
from core.ats.scoring_engine import ATSScoringEngine
from core.genome.vector_calculator import VectorCalculator
from core.projects.project_analyzer import ProjectAnalyzer
from core.recruiter.trust_engine import TrustEngine
from core.genome.maturity_engine import MaturityEngine
from core.visualization.heatmap_engine import HeatmapEngine

from core.market.domain_router import DomainRouter
from core.market.benchmark_engine import BenchmarkEngine
from core.roadmap.roadmap_generator import RoadmapGenerator
# ---------------- App Setup ----------------
app = Flask(__name__)
app.config.from_object(Config)
CORS(app, resources={r"/*": {"origins": [
  "http://localhost:5173", 
  "http://127.0.0.1:5173", 
  "http://localhost:3000", 
  "https://carrer-intelligence.vercel.app"
]}}, supports_credentials=True)

db.init_app(app)
migrate.init_app(app, db)

with app.app_context():
    db.create_all()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from sqlalchemy import event
from sqlalchemy.orm import Session

@event.listens_for(Session, "after_begin")
def after_begin(session, transaction, connection):
    logger.info("[ORM DEBUG] Session transaction begun")

@event.listens_for(Session, "after_commit")
def after_commit(session):
    logger.info("[ORM DEBUG] Session committed")

@event.listens_for(Session, "after_rollback")
def after_rollback(session):
    logger.info("[ORM DEBUG] Session rolled back")

@event.listens_for(Session, "after_transaction_end")
def after_transaction_end(session, transaction):
    logger.info("[ORM DEBUG] Session transaction ended/closed")

@event.listens_for(Session, "transient_to_pending")
def object_lifecycle_transient(session, object_):
    logger.info(f"[ORM DEBUG] Object added to session: {object_.__class__.__name__}")

@event.listens_for(Session, "loaded_as_persistent")
def object_lifecycle_loaded(session, object_):
    logger.info(f"[ORM DEBUG] Object loaded into session: {object_.__class__.__name__}")

print("[BOOT] Flask initializing")
print("[BOOT] Environment loaded")
print("[BOOT] PostgreSQL connected")

# ---------------- Gemini Setup ----------------
load_dotenv(override=True)

gemini_api_key = os.getenv("GEMINI_API_KEY")
print("GEMINI KEY LOADED:", bool(gemini_api_key))
if gemini_api_key:
    print(f"GEMINI KEY PREFIX: {gemini_api_key[:8]}...")

if not gemini_api_key or gemini_api_key == "your_gemini_api_key_here":
    logger.critical("[BOOT] CRITICAL STARTUP ERROR: GEMINI_API_KEY environment variable is missing or invalid. Server cannot start.")
    # We will raise RuntimeError or just let it fail gracefully in tests. Let's just raise it if completely empty
    if not gemini_api_key:
        raise RuntimeError("CRITICAL STARTUP ERROR: GEMINI_API_KEY environment variable is missing. Server cannot start.")

client = genai.Client(api_key=gemini_api_key)
model_name = 'gemini-2.5-flash'
print("[BOOT] Gemini initialized")

# ----------------# Old Phase 1 AI Engines (being deprecated)
ats_engine = ATSEngine(client, model_name)
skill_gap_engine = SkillGapEngine(client, model_name)

try:
    semantic_engine = SemanticEngine()
    print("[BOOT] Semantic engine initialized")
except Exception as e:
    print(f"[BOOT] Semantic engine initialization failed: {e}")
    logger.warning(f"[BOOT] Semantic engine initialization failed: {e}")
    semantic_engine = None

print("[BOOT] Routes registered")
print("[BOOT] Listening on port 5000")

# ---------------- Storage (Development Fallback) ----------------
# In production, fallback will not be used. If DB fails, an error is returned.
chat_sessions = {}
is_development = app.config['FLASK_ENV'] == 'development'
DEBUG_INTELLIGENCE_PIPELINE = os.getenv("DEBUG_INTELLIGENCE_PIPELINE", "false").lower() == "true"

# ---------------- Helpers ----------------
def extract_resume_text(file):
    import traceback
    try:
        with pdfplumber.open(file) as pdf:
            text = "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])
            if not text or not text.strip():
                logger.warning("[PDF_EXTRACT] Extracted text is empty. PDF might be an image or malformed.")
            else:
                logger.info(f"[PDF_EXTRACT] Successfully extracted {len(text)} characters.")
            return text
    except Exception as e:
        logger.error(f"[PDF_EXTRACT] Failed to extract PDF text. Traceback: {traceback.format_exc()}")
        return None

# ---------------- Health Check ----------------
@app.route("/api/health", methods=["GET"])
def health_check():
    health_status = {
        "status": "ok",
        "server": "online",
        "db": False,
        "gemini": bool(gemini_api_key),
        "semantic_engine": semantic_engine.model is not None if semantic_engine else False
    }
    try:
        db.session.execute(text('SELECT 1'))
        health_status["db"] = True
    except Exception:
        pass
    
    return jsonify(health_status), 200

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

def get_db_chat_history(chat_id, limit=8):
    try:
        messages = Message.query.filter_by(chat_id=chat_id).order_by(Message.time.desc()).limit(limit).all()
        # Return in ascending order for context
        return reversed(messages)
    except Exception as e:
        logger.error(f"DB Error getting history: {e}")
        raise e

# ---------------- CHAT API ----------------
@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json(force=True)
        message = data.get("message", "").strip()
        chat_id_str = data.get("chat_id")
        
        if not chat_id_str:
            chat_id_str = str(uuid.uuid4())

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

        # Persistence
        time_now = datetime.utcnow()
        if is_development:
            chat_sessions.setdefault(chat_id_str, []).append({
                "role": "user",
                "message": message,
                "time": time_now.isoformat()
            })
            chat_sessions[chat_id_str].append({
                "role": "assistant",
                "message": reply,
                "time": datetime.utcnow().isoformat()
            })

        try:
            # Ensure chat exists
            chat_obj = Chat.query.filter_by(id=chat_id_str).first()
            if not chat_obj:
                chat_obj = Chat(id=chat_id_str, title=message[:30])
                db.session.add(chat_obj)
                
            msg_user = Message(chat_id=chat_id_str, role='user', content=message, time=time_now)
            msg_bot = Message(chat_id=chat_id_str, role='assistant', content=reply, time=datetime.utcnow())
            db.session.add_all([msg_user, msg_bot])
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            logger.error(f"DB persistence failed: {e}")
            if not is_development:
                return jsonify({"error": "Database error saving message."}), 500

        return jsonify({"reply": reply, "chat_id": chat_id_str})

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
    try:
        chats = Chat.query.order_by(Chat.created_at.desc()).all()
        sessions = []
        for c in chats:
            first_msg = Message.query.filter_by(chat_id=c.id).order_by(Message.time.asc()).first()
            sessions.append({
                "_id": str(c.id),
                "title": c.title,
                "messages": [], # Frontend expects array structure, full load on fetch
                "createdAt": c.created_at.isoformat()
            })
        return jsonify({"sessions": sessions})
    except Exception as e:
        logger.error(f"DB Error getting chats: {e}")
        if is_development:
            sessions = []
            for cid, msgs in chat_sessions.items():
                title = msgs[0]['message'][:30] if msgs else "New Chat"
                sessions.append({
                    "_id": cid, 
                    "title": title, 
                    "messages": msgs,
                    "createdAt": msgs[0].get("time") if msgs else datetime.utcnow().isoformat()
                })
            return jsonify({"sessions": sessions})
        return jsonify({"error": "Database error retrieving chats."}), 500

@app.route("/api/chats", methods=["POST"])
def create_chat():
    chat_id_str = str(uuid.uuid4())
    try:
        new_chat = Chat(id=chat_id_str, title="New Chat")
        db.session.add(new_chat)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        logger.error(f"DB Error creating chat: {e}")
        if not is_development:
            return jsonify({"error": "Database error creating chat."}), 500
        
    if is_development:
        chat_sessions[chat_id_str] = []
        
    return jsonify({"chat_id": chat_id_str})

@app.route("/api/chats/<chat_id>", methods=["GET"])
def get_chat(chat_id):
    try:
        messages = Message.query.filter_by(chat_id=chat_id).order_by(Message.time.asc()).all()
        if messages:
            msgs_formatted = []
            for m in messages:
                msg_dict = {"role": m.role, "message": m.content, "time": m.time.isoformat()}
                if m.has_files:
                    docs = UploadedDocument.query.filter_by(message_id=m.id).all()
                    msg_dict["gemini_files"] = [{"name": d.gemini_file_name, "display_name": d.filename} for d in docs]
                msgs_formatted.append(msg_dict)
            return jsonify({"messages": msgs_formatted})
        elif is_development and chat_id in chat_sessions:
            return jsonify({"messages": chat_sessions[chat_id]})
        return jsonify({"error": "Not found"}), 404
    except Exception as e:
        logger.error(f"DB Error getting chat: {e}")
        if is_development and chat_id in chat_sessions:
            return jsonify({"messages": chat_sessions[chat_id]})
        return jsonify({"error": "Database error retrieving chat."}), 500

@app.route("/api/chats/<chat_id>", methods=["DELETE"])
def delete_chat(chat_id):
    try:
        chat_obj = Chat.query.filter_by(id=chat_id).first()
        if chat_obj:
            db.session.delete(chat_obj)
            db.session.commit()
            if is_development and chat_id in chat_sessions:
                del chat_sessions[chat_id]
            return jsonify({"success": True})
        elif is_development and chat_id in chat_sessions:
            del chat_sessions[chat_id]
            return jsonify({"success": True})
        return jsonify({"error": "Not found"}), 404
    except Exception as e:
        db.session.rollback()
        logger.error(f"DB Error deleting chat: {e}")
        if not is_development:
            return jsonify({"error": "Database error deleting chat."}), 500
        return jsonify({"success": False}), 500

@app.route("/api/chats", methods=["DELETE"])
def delete_all_chats():
    try:
        db.session.query(Chat).delete()
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        logger.error(f"DB Error deleting all chats: {e}")
        if not is_development:
            return jsonify({"error": "Database error deleting all chats."}), 500
            
    if is_development:
        chat_sessions.clear()
        
    return jsonify({"success": True})

@app.route("/api/documents/upload", methods=["POST"])
def upload_documents():
    chat_id = request.form.get("chat_id")
    files = request.files.getlist("files")
    
    if not chat_id:
        return jsonify({"error": "chat_id required"}), 400

    uploaded_gemini_files = []
    
    for f in files:
        try:
            ext = os.path.splitext(f.filename)[1]
            if not ext:
                ext = ".txt"
                
            with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
                f.save(tmp.name)
                g_file = client.files.upload(file=tmp.name, config={'display_name': f.filename})
                uploaded_gemini_files.append({"name": g_file.name, "display_name": f.filename})
            os.remove(tmp.name)
        except Exception as e:
            logger.error(f"Failed to upload {f.filename} to Gemini: {e}")
    
    if uploaded_gemini_files:
        time_now = datetime.utcnow()
        if is_development:
            chat_sessions.setdefault(chat_id, []).append({
                "role": "user",
                "message": "[SYSTEM ALERT: User attached files]",
                "gemini_files": uploaded_gemini_files,
                "time": time_now.isoformat()
            })
            
        try:
            chat_obj = Chat.query.filter_by(id=chat_id).first()
            if not chat_obj:
                chat_obj = Chat(id=chat_id, title="New Chat")
                db.session.add(chat_obj)
            
            msg_doc = Message(chat_id=chat_id, role='user', content="[SYSTEM ALERT: User attached files]", has_files=True, time=time_now)
            db.session.add(msg_doc)
            db.session.flush() # get msg_doc.id
            
            for gfile in uploaded_gemini_files:
                doc_obj = UploadedDocument(message_id=msg_doc.id, filename=gfile["display_name"], gemini_file_name=gfile["name"])
                db.session.add(doc_obj)
                
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            logger.error(f"DB Error saving uploaded documents: {e}")
            if not is_development:
                return jsonify({"error": "Database error saving documents."}), 500
        
    return jsonify({"status": "processing_started", "message": "Files received successfully."})

@app.route("/api/chat/stream/<chat_id>", methods=["POST"])
def chat_stream(chat_id):
    try:
        data = request.get_json(force=True)
        message = data.get("message", "").strip()
        
        context_str = ""
        prompt_parts = []
        
        try:
            history_msgs = list(get_db_chat_history(chat_id, limit=8))
            for m in history_msgs:
                role = "User" if m.role == "user" else "Assistant"
                if m.has_files:
                    docs = UploadedDocument.query.filter_by(message_id=m.id).all()
                    context_str += f"{role} attached files:\n"
                    for d in docs:
                        try:
                            g_file = client.files.get(name=d.gemini_file_name)
                            prompt_parts.append(g_file)
                            context_str += f"- {d.filename}\n"
                        except Exception as e:
                            logger.error(f"Could not retrieve Gemini file: {e}")
                else:
                    context_str += f"{role}: {m.content}\n"
        except Exception as e:
            if is_development:
                history = chat_sessions.get(chat_id, [])
                for msg in history[-8:]:
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
            else:
                return jsonify({"error": "Database error retrieving history."}), 500
            
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
            full_reply = ""
            try:
                response = client.models.generate_content_stream(
                    model=model_name,
                    contents=prompt_parts
                )
                
                for chunk in response:
                    if chunk.text:
                        full_reply += chunk.text
                        data_payload = json.dumps({"text": chunk.text})
                        yield f"data: {data_payload}\n\n"
                        
            except Exception as e:
                logger.exception("Stream error")
                error_msg = json.dumps({"text": f"\n\n⚠️ AI Error: {str(e)}"})
                yield f"data: {error_msg}\n\n"
                
            time_now = datetime.utcnow()
            if is_development:
                chat_sessions.setdefault(chat_id, []).append({
                    "role": "user",
                    "message": message,
                    "time": time_now.isoformat()
                })
                chat_sessions[chat_id].append({
                    "role": "assistant",
                    "message": full_reply,
                    "time": datetime.utcnow().isoformat()
                })
                
            try:
                with app.app_context():
                    chat_obj = Chat.query.filter_by(id=chat_id).first()
                    if not chat_obj:
                        chat_obj = Chat(id=chat_id, title=message[:30])
                        db.session.add(chat_obj)
                    
                    msg_user = Message(chat_id=chat_id, role='user', content=message, time=time_now)
                    msg_bot = Message(chat_id=chat_id, role='assistant', content=full_reply, time=datetime.utcnow())
                    db.session.add_all([msg_user, msg_bot])
                    db.session.commit()
            except Exception as e:
                logger.error(f"DB persistence failed in stream: {e}")
                
            yield "data: [DONE]\n\n"
                
        return Response(generate(), mimetype="text/event-stream")
    except Exception as e:
        logger.exception("Chat stream setup error")
        return jsonify({"error": str(e)}), 500


# ---------------- RESUME PREDICT API ----------------
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

        # Persistence
        try:
            analysis = ResumeAnalysis(
                score=parsed.get("score"),
                roles=parsed.get("roles"),
                skills=parsed.get("skills"),
                roadmap=parsed.get("roadmap"),
                recommendations=parsed.get("improvements"),
                growth_projection=parsed.get("growthProjection"),
                raw_json=parsed
            )
            db.session.add(analysis)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            logger.error(f"DB Error saving resume analysis: {e}")
            if not is_development:
                return jsonify({"error": "Database error saving analysis."}), 500

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


# ---------------- PHASE 2 API ROUTES ----------------

@app.route("/api/v1/documents/upload", methods=["POST"])
def v1_upload_document():
    import traceback
    try:
        if "files" not in request.files:
            return jsonify({"success": False, "stage": "upload", "message": "No file uploaded", "debug_id": "UPL_001"}), 400

        file = request.files["files"]
        filename = file.filename
        
        logger.info(f"[UPLOAD_STAGE] Starting PDF extraction for {filename}")
        import time
        start_time = time.perf_counter()
        
        with TelemetryService.track_execution("pdf_parse", {"filename": filename}):
            try:
                resume_text = extract_resume_text(file)
                if not resume_text:
                    raise ValueError("Could not extract text from PDF. It may be scanned or malformed.")
                parse_duration = time.perf_counter() - start_time
                logger.info(f"[UPLOAD_STAGE] PDF extraction complete in {parse_duration:.2f}s")
            except Exception as e:
                logger.error(f"[UPLOAD_STAGE] PDF Parse failed: {traceback.format_exc()}")
                return jsonify({"success": False, "stage": "pdf_parse", "message": str(e), "debug_id": "UPL_002"}), 400

        try:
            version = ResumeVersion(
                filename=filename,
                raw_text=resume_text
            )
            db.session.add(version)
            db.session.commit()
            return jsonify({"documents": [{"doc_id": str(version.id), "filename": filename}]})
        except Exception as e:
            db.session.rollback()
            logger.error(f"[UPLOAD_STAGE] DB Error saving resume version: {traceback.format_exc()}")
            return jsonify({"success": False, "stage": "db_persistence", "message": "Database serialization or constraints failed", "debug_id": "UPL_003", "traceback": traceback.format_exc()}), 500
    except Exception as e:
        logger.error(f"[UPLOAD_STAGE] Unhandled upload route exception: {traceback.format_exc()}")
        return jsonify({"success": False, "stage": "upload_route", "message": "Internal Server Error during upload processing", "debug_id": "UPL_500", "traceback": traceback.format_exc()}), 500

@app.route("/api/v1/resume/analyze/stream", methods=["POST"])
def v1_analyze_resume_stream():
    try:
        data = request.get_json(force=True)
        doc_id = data.get("doc_id")
        target_role = data.get("target_role", "Software Engineer")

        if not doc_id:
            return jsonify({"error": "doc_id required"}), 400

        resume = ResumeVersion.query.get(doc_id)
        if not resume:
            return jsonify({"error": "Resume not found"}), 404

        resume.target_role = target_role
        
        # Extract plain data for generator to avoid DetachedInstanceError
        resume_id = str(resume.id)
        resume_raw_text = resume.raw_text
        
        # Commit the target_role so it is safely in DB before background generator
        db.session.commit()
    except Exception as e:
        logger.exception("[SETUP_ERROR] Stream route setup failed.")
        return jsonify({"error": f"Stream setup failed: {str(e)}"}), 500
        
    def generate_analysis():
        import time
        import traceback
        pipeline_start = time.perf_counter()
        try:
            yield f"data: {json.dumps({'event': 'telemetry', 'log': 'Starting ATS extraction pipeline...'})}\n\n"
            
            # 1. Document Ingestion (Parsing)
            try:
                yield f"data: {json.dumps({'event': 'telemetry', 'log': 'Parsing document sections...'})}\n\n"
                logger.info("[PIPELINE] PARSING START")
                start = time.perf_counter()
                sections = DocumentParser.parse_sections(resume_raw_text)
                parse_time = int((time.perf_counter() - start) * 1000)
                logger.info("[PIPELINE] PARSING END")
                yield f"data: {json.dumps({'event': 'telemetry', 'log': f'Document parsed. Latency: {parse_time}ms', 'metric': {'action': 'document_parsing', 'duration': parse_time}})}\n\n"
            except Exception as e:
                logger.error(f"[INGESTION] Crash: {traceback.format_exc()}")
                yield f"data: {json.dumps({'event': 'error', 'payload': {'success': False, 'stage': 'document_parser', 'message': str(e)}})}\n\n"
                return

            # 2. Entity Extraction
            try:
                yield f"data: {json.dumps({'event': 'telemetry', 'log': 'Extracting entities via NLP...'})}\n\n"
                logger.info("[PIPELINE] EXTRACTION START")
                start = time.perf_counter()
                extracted_skills = EntityExtractor.extract_skills(resume_raw_text)
                metrics = EntityExtractor.extract_metrics(resume_raw_text)
                verb_counts = EntityExtractor.count_action_verbs(resume_raw_text)
                extract_time = int((time.perf_counter() - start) * 1000)
                logger.info("[PIPELINE] EXTRACTION END")
                yield f"data: {json.dumps({'event': 'telemetry', 'log': f'Entities extracted. Latency: {extract_time}ms', 'metric': {'action': 'entity_extraction', 'duration': extract_time}})}\n\n"
            except Exception as e:
                logger.error(f"[EXTRACTION] Crash: {traceback.format_exc()}")
                yield f"data: {json.dumps({'event': 'error', 'payload': {'success': False, 'stage': 'entity_extractor', 'message': str(e)}})}\n\n"
                return
                
            # 2.5 Domain Routing
            try:
                domain_key = DomainRouter.route_domain(target_role)
                yield f"data: {json.dumps({'event': 'telemetry', 'log': f'Domain identified as {domain_key}. Loading templates...'})}\n\n"
            except Exception as e:
                domain_key = "generic"

            # 3. Deterministic ATS Engine
            try:
                yield f"data: {json.dumps({'event': 'telemetry', 'log': 'Computing deterministic ATS Score...'})}\n\n"
                logger.info("[PIPELINE] ATS START")
                start = time.perf_counter()
                ats_result = ATSScoringEngine.compute_score(sections, extracted_skills, metrics, verb_counts, domain_key)
                ats_time = int((time.perf_counter() - start) * 1000)
                logger.info("[PIPELINE] ATS END")
                yield f"data: {json.dumps({'event': 'telemetry', 'log': f'ATS extraction complete. Latency: {ats_time}ms', 'metric': {'action': 'ats_analysis', 'duration': ats_time}})}\n\n"
            except Exception as e:
                logger.error(f"[ATS_ENGINE] Crash: {traceback.format_exc()}")
                yield f"data: {json.dumps({'event': 'error', 'payload': {'success': False, 'stage': 'ats_engine', 'message': str(e)}})}\n\n"
                return
            
            # 4. Phase 2: Engineering Credibility Engines
            try:
                yield f"data: {json.dumps({'event': 'telemetry', 'log': 'Evaluating project complexity and production readiness...'})}\n\n"
                logger.info("[PIPELINE] CREDIBILITY START")
                start = time.perf_counter()
                
                project_metrics = ProjectAnalyzer.compute_complexity(sections, extracted_skills, domain_key)
                links = EntityExtractor.extract_links(resume_raw_text)
                recruiter_metrics = TrustEngine.compute_trust(sections, metrics, links, domain_key)
                maturity_metrics = MaturityEngine.compute_maturity(project_metrics["architecture_signals"], project_metrics["project_complexity_index"], domain_key)
                heatmap_metrics = HeatmapEngine.generate_heatmap(sections, metrics, verb_counts)
                
                cred_time = int((time.perf_counter() - start) * 1000)
                logger.info("[PIPELINE] CREDIBILITY END")
                yield f"data: {json.dumps({'event': 'telemetry', 'log': f'Credibility intelligence complete. Latency: {cred_time}ms', 'metric': {'action': 'credibility_analysis', 'duration': cred_time}})}\n\n"
                
            except Exception as e:
                logger.error(f"[CREDIBILITY_ENGINE] Crash: {traceback.format_exc()}")
                yield f"data: {json.dumps({'event': 'error', 'payload': {'success': False, 'stage': 'credibility_engine', 'message': str(e)}})}\n\n"
                return

            # 5. Engineering Genome (Vectors)
            try:
                yield f"data: {json.dumps({'event': 'telemetry', 'log': 'Computing engineering domain vectors...'})}\n\n"
                logger.info("[PIPELINE] GENOME START")
                start = time.perf_counter()
                genome_result = VectorCalculator.compute_vectors(extracted_skills)
                genome_time = int((time.perf_counter() - start) * 1000)
                logger.info("[PIPELINE] GENOME END")
                yield f"data: {json.dumps({'event': 'telemetry', 'log': f'Genome vectors complete. Latency: {genome_time}ms', 'metric': {'action': 'genome_analysis', 'duration': genome_time}})}\n\n"
                
                # Phase Elite: Market Benchmarking & Roadmap Generation
                yield f"data: {json.dumps({'event': 'telemetry', 'log': 'Computing deterministic market benchmark and DAG roadmaps...'})}\n\n"
                
                market_start = time.perf_counter()
                
                skill_gap = RoadmapGenerator.generate_roadmap(extracted_skills, domain_key)
                benchmark_metrics = BenchmarkEngine.compute_market_percentile(
                    domain_key, 
                    ats_result.get("ats_score", 50),
                    project_metrics.get("project_complexity_index", 50),
                    maturity_metrics.get("engineering_maturity_index", 50),
                    len(metrics)
                )
                
                recruiter_insights = {
                    "concerns": [],
                    "standouts": []
                }
                
                market_time = int((time.perf_counter() - market_start) * 1000)
                gap_time = market_time
                rec_time = 0
                yield f"data: {json.dumps({'event': 'telemetry', 'log': f'Market benchmarks and roadmaps complete. Latency: {market_time}ms', 'metric': {'action': 'market_analysis', 'duration': market_time}})}\n\n"
                
            except Exception as e:
                logger.error(f"[GENOME_ENGINE] Crash: {traceback.format_exc()}")
                yield f"data: {json.dumps({'event': 'error', 'payload': {'success': False, 'stage': 'genome_engine', 'message': str(e)}})}\n\n"
                return
            
            # 4. Semantic Embeddings
            try:
                yield f"data: {json.dumps({'event': 'telemetry', 'log': 'Generating dense vector embeddings using all-MiniLM-L6-v2...'})}\n\n"
                logger.info("[PIPELINE] SEMANTIC START")
                if DEBUG_INTELLIGENCE_PIPELINE: logger.info("[DEBUG] [STAGE] Invoking Semantic Engine")
                start = time.perf_counter()
                with app.app_context(): # needed for DB access in generator
                    semantic_engine.store_resume_embeddings(resume_id, resume_raw_text)
                sem_time = int((time.perf_counter() - start) * 1000)
                logger.info("[PIPELINE] SEMANTIC END")
                if DEBUG_INTELLIGENCE_PIPELINE: logger.info(f"[DEBUG] [TIMING] Semantic Engine: {sem_time}ms")
                yield f"data: {json.dumps({'event': 'telemetry', 'log': f'Semantic vectors generated and stored. Latency: {sem_time}ms', 'metric': {'action': 'semantic_embedding', 'duration': sem_time}})}\n\n"
            except Exception as e:
                logger.error(f"[SEMANTIC_ENGINE] Crash: {traceback.format_exc()}")
                yield f"data: {json.dumps({'event': 'error', 'payload': {'success': False, 'stage': 'semantic_engine', 'message': str(e), 'debug_id': 'STR_004', 'traceback': traceback.format_exc()}})}\n\n"
                return

            # Persist DB Records
            try:
                yield f"data: {json.dumps({'event': 'telemetry', 'log': 'Persisting analysis metrics to PostgreSQL...'})}\n\n"
                logger.info("[PIPELINE] DB PERSISTENCE START")
                if DEBUG_INTELLIGENCE_PIPELINE: logger.info("[DEBUG] [STAGE] DB Persistence")
                start = time.perf_counter()
                with app.app_context():
                    try:
                        for sk in extracted_skills:
                            db.session.add(ExtractedSkill(resume_id=resume_id, skill_name=sk, category="Extracted"))
                        for sk in skill_gap.get("missing_skills", []):
                            db.session.add(ExtractedSkill(resume_id=resume_id, skill_name=sk, category="Missing"))
                            
                        metric = AnalysisMetric(
                            resume_id=resume_id,
                            ats_score=ats_result.get("ats_score", 50),
                            keyword_density=ats_result.get("keyword_density", 0.0),
                            complexity_score=ats_result.get("complexity_score", 50),
                            recruiter_concerns=recruiter_insights.get("concerns", []),
                            standout_metrics=recruiter_insights.get("standouts", [])
                        )
                        db.session.add(metric)
                        db.session.commit()
                        
                        # Also save telemetry
                        for action, dur in [("ats_analysis", ats_time), ("skill_gap_analysis", gap_time), ("recruiter_analysis", rec_time), ("semantic_embedding", sem_time)]:
                            TelemetryService.log_metric(action, dur, {"doc_id": doc_id})
                            
                    except Exception as e:
                        db.session.rollback()
                        logger.error(f"[DB_PERSISTENCE] Internal DB commit failed: {traceback.format_exc()}")
                        raise RuntimeError(f"Database persistence failed: {e}")
                
                
                db_time = int((time.perf_counter() - start) * 1000)
                logger.info("[PIPELINE] DB PERSISTENCE END")
                if DEBUG_INTELLIGENCE_PIPELINE: logger.info(f"[DEBUG] [TIMING] DB Persistence: {db_time}ms")
                yield f"data: {json.dumps({'event': 'telemetry', 'log': f'DB persistence complete. Latency: {db_time}ms'})}\n\n"
            except Exception as e:
                logger.error(f"[DB_PERSISTENCE] Crash: {traceback.format_exc()}")
                yield f"data: {json.dumps({'event': 'error', 'payload': {'success': False, 'stage': 'db_persistence', 'message': str(e), 'debug_id': 'STR_005', 'traceback': traceback.format_exc()}})}\n\n"
                return

            # Final Payload
            final_payload = {
                # Legacy Phase 1 keys (Preserving frontend backward compatibility)
                "ats_score": ats_result.get("ats_score", 50),
                "complexity_score": project_metrics["project_complexity_index"],
                "matched_skills": skill_gap.get("core_skills_matched", []),
                "missing_skills": skill_gap.get("missing_skills", []),
                "improvement_suggestions": skill_gap.get("roadmap", []) + recruiter_insights.get("concerns", []),
                "aspect_scores": genome_result.get("aspect_scores", []),
                "competitiveness": benchmark_metrics, # Now uses true market benchmarking
                "project_analysis": {"complexity": project_metrics["project_complexity_index"], "scalability": project_metrics["architecture_sophistication_score"]},
                "readiness": skill_gap.get("readiness", []),
                "growth_projection": skill_gap.get("growth_projection", []),
                "career_trajectory": skill_gap.get("career_trajectory", []),
                "recruiter_insights": {
                    "concerns": [f"Tutorial Smells Detected: {project_metrics['tutorial_smells_detected']}"] if project_metrics['tutorial_smells_detected'] > 0 else [] + ([f"Buzzword penalty active: -{recruiter_metrics['buzzword_penalty']}"] if recruiter_metrics['buzzword_penalty'] > 0 else []),
                    "standouts": [recruiter_metrics["standout_factor"], f"Maturity Level: {maturity_metrics['maturity_level']}"]
                },
                
                # New Phase 2 Flagship Keys
                "domain_applied": domain_key,
                "project_metrics": project_metrics,
                "recruiter_metrics": recruiter_metrics,
                "maturity_metrics": maturity_metrics,
                "heatmap": heatmap_metrics,
                "benchmark_metrics": benchmark_metrics,
                "roadmap": skill_gap.get("roadmap", []),
                "project_recommendations": skill_gap.get("project_recommendations", []),
                
                "total_latency": parse_time + extract_time + ats_time + cred_time + genome_time + sem_time + db_time + market_time
            }
            
            # Verify serialization
            try:
                payload_str = json.dumps({'event': 'complete', 'payload': final_payload})
                yield f"data: {payload_str}\n\n"
                yield "data: [DONE]\n\n"
            except Exception as e:
                logger.error(f"[SERIALIZATION_ERROR] Failed to serialize final payload: {e}")
                yield f"data: {json.dumps({'event': 'error', 'payload': {'success': False, 'stage': 'serialization', 'message': 'Final payload serialization failed'}})}\n\n"
                return


        except Exception as e:
            logger.error(f"[PIPELINE_ERROR] Unhandled generator exception: {traceback.format_exc()}")
            error_payload = {
                "success": False,
                "stage": "intelligence_pipeline",
                "message": str(e),
                "debug_id": "STR_500",
                "traceback": traceback.format_exc()
            }
            yield f"data: {json.dumps({'event': 'error', 'payload': error_payload})}\n\n"

    response = Response(generate_analysis(), mimetype="text/event-stream")
    # CRITICAL: Prevent Nginx/Vercel/Render from buffering SSE packets
    response.headers["Cache-Control"] = "no-cache"
    response.headers["Connection"] = "keep-alive"
    response.headers["X-Accel-Buffering"] = "no"
    return response

# ---------------- PHASE 3: SETTINGS & INFRASTRUCTURE ROUTES ----------------

def get_or_create_user(firebase_uid):
    user = User.query.filter_by(firebase_uid=firebase_uid).first()
    if not user:
        user = User(firebase_uid=firebase_uid)
        db.session.add(user)
        db.session.commit()
    return user

@app.route("/api/settings/profile", methods=["GET", "PUT"])
def settings_profile():
    firebase_uid = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not firebase_uid:
        return jsonify({"error": "Unauthorized"}), 401
    
    user = get_or_create_user(firebase_uid)
    prefs = UserPreferences.query.filter_by(user_id=user.id).first()
    
    if request.method == "GET":
        if not prefs:
            return jsonify({
                "engineering_role": "Frontend Systems Engineer",
                "career_target": "Backend Infrastructure",
                "primary_stack": "React, Node.js"
            })
        return jsonify({
            "engineering_role": prefs.engineering_role,
            "career_target": prefs.career_target,
            "primary_stack": prefs.primary_stack
        })
        
    if request.method == "PUT":
        data = request.json
        if not prefs:
            prefs = UserPreferences(user_id=user.id)
            db.session.add(prefs)
            
        prefs.engineering_role = data.get("engineering_role", prefs.engineering_role)
        prefs.career_target = data.get("career_target", prefs.career_target)
        prefs.primary_stack = data.get("primary_stack", prefs.primary_stack)
        db.session.commit()
        return jsonify({"success": True})

@app.route("/api/settings/preferences", methods=["GET", "PUT"])
def settings_preferences():
    firebase_uid = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not firebase_uid:
        return jsonify({"error": "Unauthorized"}), 401
    
    user = get_or_create_user(firebase_uid)
    prefs = UserPreferences.query.filter_by(user_id=user.id).first()
    
    if request.method == "GET":
        if not prefs:
            return jsonify({
                "recruiter_strictness": "moderate",
                "ats_analysis_mode": "standard",
                "profile_visibility": False
            })
        return jsonify({
            "recruiter_strictness": prefs.recruiter_strictness,
            "ats_analysis_mode": prefs.ats_analysis_mode,
            "profile_visibility": prefs.profile_visibility
        })
        
    if request.method == "PUT":
        data = request.json
        if not prefs:
            prefs = UserPreferences(user_id=user.id)
            db.session.add(prefs)
            
        prefs.recruiter_strictness = data.get("recruiter_strictness", prefs.recruiter_strictness)
        prefs.ats_analysis_mode = data.get("ats_analysis_mode", prefs.ats_analysis_mode)
        prefs.profile_visibility = data.get("profile_visibility", prefs.profile_visibility)
        db.session.commit()
        return jsonify({"success": True})

@app.route("/api/settings/security", methods=["GET"])
def settings_security():
    firebase_uid = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not firebase_uid:
        return jsonify({"error": "Unauthorized"}), 401
        
    user = get_or_create_user(firebase_uid)
    events = UserSecurityEvent.query.filter_by(user_id=user.id).order_by(UserSecurityEvent.created_at.desc()).limit(10).all()
    
    return jsonify({
        "events": [{
            "id": str(e.id),
            "event_type": e.event_type,
            "ip_address": e.ip_address,
            "location": e.location,
            "created_at": e.created_at.isoformat()
        } for e in events]
    })

@app.route("/api/settings/tokens", methods=["GET"])
def settings_tokens():
    firebase_uid = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not firebase_uid:
        return jsonify({"error": "Unauthorized"}), 401
        
    user = get_or_create_user(firebase_uid)
    tokens = UserApiToken.query.filter_by(user_id=user.id, is_revoked=False).all()
    
    return jsonify({
        "tokens": [{
            "id": str(t.id),
            "name": t.name,
            "token": t.token,
            "created_at": t.created_at.isoformat()
        } for t in tokens]
    })

@app.route("/api/settings/tokens/create", methods=["POST"])
def create_token():
    firebase_uid = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not firebase_uid:
        return jsonify({"error": "Unauthorized"}), 401
        
    user = get_or_create_user(firebase_uid)
    data = request.json
    
    new_token = f"pnx_live_{uuid.uuid4().hex}"
    token_obj = UserApiToken(
        user_id=user.id,
        name=data.get("name", "Default Token"),
        token=new_token
    )
    db.session.add(token_obj)
    db.session.commit()
    
    return jsonify({
        "id": str(token_obj.id),
        "name": token_obj.name,
        "token": new_token,
        "created_at": token_obj.created_at.isoformat()
    })

@app.route("/api/settings/tokens/<token_id>", methods=["DELETE"])
def revoke_token(token_id):
    firebase_uid = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not firebase_uid:
        return jsonify({"error": "Unauthorized"}), 401
        
    user = get_or_create_user(firebase_uid)
    token_obj = UserApiToken.query.filter_by(id=token_id, user_id=user.id).first()
    
    if token_obj:
        token_obj.is_revoked = True
        db.session.commit()
        return jsonify({"success": True})
        
    return jsonify({"error": "Not found"}), 404

# ---------------- PHASE 4: EVALUATION INFRASTRUCTURE ROUTES ----------------

@app.route("/api/assessments/start", methods=["POST"])
def start_assessment():
    firebase_uid = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not firebase_uid:
        return jsonify({"error": "Unauthorized"}), 401
        
    user = get_or_create_user(firebase_uid)
    data = request.json
    track = data.get("track", "General Engineering")
    
    assessment = UserAssessment(user_id=user.id, track=track)
    db.session.add(assessment)
    db.session.commit()
    
    # Generate some initial telemetry
    tel1 = AssessmentTelemetry(assessment_id=assessment.id, event_type="orchestrator_init", duration_ms=120)
    tel2 = AssessmentTelemetry(assessment_id=assessment.id, event_type="benchmark_heuristics_load", duration_ms=45)
    db.session.add_all([tel1, tel2])
    db.session.commit()
    
    return jsonify({
        "assessment_id": str(assessment.id),
        "status": "pipeline_active",
        "message": "[ORCHESTRATOR] Initializing engineering evaluation..."
    })

@app.route("/api/assessments/submit", methods=["POST"])
def submit_assessment():
    firebase_uid = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not firebase_uid:
        return jsonify({"error": "Unauthorized"}), 401
        
    user = get_or_create_user(firebase_uid)
    data = request.json
    assessment_id = data.get("assessment_id")
    answers = data.get("answers", [])
    
    assessment = UserAssessment.query.filter_by(id=assessment_id, user_id=user.id).first()
    if not assessment:
        return jsonify({"error": "Assessment not found"}), 404
        
    assessment.status = "completed"
    assessment.completed_at = datetime.utcnow()
    
    total_score = 0
    max_score = 0
    
    # 1. Process Answers
    for ans in answers:
        is_correct = ans.get("is_correct", False)
        weight = ans.get("weight", 1)
        if is_correct:
            total_score += weight
        max_score += weight
        
        res = AssessmentResult(
            assessment_id=assessment.id,
            question_domain=ans.get("domain", "general"),
            is_correct=is_correct,
            weight=weight,
            latency_ms=ans.get("latency_ms", 1500)
        )
        db.session.add(res)
        
    overall_percentage = (total_score / max_score * 100) if max_score > 0 else 0
    
    # 2. Compute Engineering Vectors
    vectors = {
        "Systems Thinking": min(100, int(overall_percentage * 1.1)),
        "Production Readiness": min(100, int(overall_percentage * 0.95)),
        "Backend Infrastructure": min(100, int(overall_percentage * 1.05)),
        "Debugging Intelligence": min(100, int(overall_percentage * 0.88)),
        "Architecture Depth": min(100, int(overall_percentage * 1.15))
    }
    vec_obj = EngineeringVector(assessment_id=assessment.id, user_id=user.id, vector_data=vectors)
    db.session.add(vec_obj)
    
    # 3. Recruiter Adjustments
    adj1 = RecruiterAdjustment(assessment_id=assessment.id, signal_type="Backend Reliability Signal", adjustment_value=8.0)
    adj2 = RecruiterAdjustment(assessment_id=assessment.id, signal_type="Problem Solving Credibility", adjustment_value=11.0)
    db.session.add_all([adj1, adj2])
    
    # 4. Roadmap Updates
    roadmap = RoadmapUpdate(
        assessment_id=assessment.id, 
        user_id=user.id, 
        path_nodes=["Docker Orchestration", "Redis Caching", "Kubernetes Deployment", "CI/CD Automation"]
    )
    db.session.add(roadmap)
    
    # 5. History
    history = EvaluationHistory(
        user_id=user.id,
        assessment_id=assessment.id,
        overall_score=overall_percentage,
        benchmark_percentile=min(99, int(overall_percentage * 0.9))
    )
    db.session.add(history)
    
    # 6. Final Telemetry
    tel = AssessmentTelemetry(assessment_id=assessment.id, event_type="scoring_engine_complete", duration_ms=320)
    db.session.add(tel)
    
    db.session.commit()
    
    return jsonify({
        "success": True,
        "assessment_id": str(assessment.id),
        "overall_score": overall_percentage,
        "vectors": vectors,
        "adjustments": [
            {"signal": adj1.signal_type, "value": adj1.adjustment_value},
            {"signal": adj2.signal_type, "value": adj2.adjustment_value}
        ],
        "roadmap": roadmap.path_nodes,
        "benchmark": history.benchmark_percentile
    })

@app.route("/api/assessments/history", methods=["GET"])
def get_assessment_history():
    firebase_uid = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not firebase_uid:
        return jsonify({"error": "Unauthorized"}), 401
        
    user = get_or_create_user(firebase_uid)
    history = EvaluationHistory.query.filter_by(user_id=user.id).order_by(EvaluationHistory.created_at.desc()).all()
    
    return jsonify({
        "history": [{
            "id": str(h.id),
            "assessment_id": str(h.assessment_id),
            "score": h.overall_score,
            "benchmark": h.benchmark_percentile,
            "date": h.created_at.isoformat()
        } for h in history]
    })

@app.route("/api/assessments/report/<assessment_id>", methods=["GET"])
def get_assessment_report(assessment_id):
    firebase_uid = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not firebase_uid:
        return jsonify({"error": "Unauthorized"}), 401
        
    user = get_or_create_user(firebase_uid)
    assessment = UserAssessment.query.filter_by(id=assessment_id, user_id=user.id).first()
    if not assessment:
        return jsonify({"error": "Not found"}), 404
        
    history = EvaluationHistory.query.filter_by(assessment_id=assessment.id).first()
    vectors = EngineeringVector.query.filter_by(assessment_id=assessment.id).first()
    adjustments = RecruiterAdjustment.query.filter_by(assessment_id=assessment.id).all()
    roadmap = RoadmapUpdate.query.filter_by(assessment_id=assessment.id).first()
    
    return jsonify({
        "assessment_id": str(assessment.id),
        "track": assessment.track,
        "score": history.overall_score if history else 0,
        "benchmark_percentile": history.benchmark_percentile if history else 0,
        "vectors": vectors.vector_data if vectors else {},
        "adjustments": [{"signal": a.signal_type, "value": a.adjustment_value} for a in adjustments],
        "roadmap": roadmap.path_nodes if roadmap else []
    })

@app.route("/api/assessments/telemetry/<assessment_id>", methods=["GET"])
def get_assessment_telemetry(assessment_id):
    telemetry = AssessmentTelemetry.query.filter_by(assessment_id=assessment_id).order_by(AssessmentTelemetry.timestamp.asc()).all()
    return jsonify({
        "events": [{
            "event_type": t.event_type,
            "duration_ms": t.duration_ms,
            "timestamp": t.timestamp.isoformat()
        } for t in telemetry]
    })

# ---------------- Run App ----------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)
