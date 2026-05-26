import uuid
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSONB, UUID
from extensions import db

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    firebase_uid = db.Column(db.String(128), unique=True, index=True, nullable=False)
    email = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    chats = db.relationship('Chat', backref='user', lazy=True, cascade="all, delete-orphan")
    resume_analyses = db.relationship('ResumeAnalysis', backref='user', lazy=True, cascade="all, delete-orphan")
    quiz_results = db.relationship('QuizResult', backref='user', lazy=True, cascade="all, delete-orphan")

class Chat(db.Model):
    __tablename__ = 'chats'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=True, index=True) # Optional user link
    title = db.Column(db.String(255), default="New Chat")
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    messages = db.relationship('Message', backref='chat', lazy=True, cascade="all, delete-orphan")

class Message(db.Model):
    __tablename__ = 'messages'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    chat_id = db.Column(UUID(as_uuid=True), db.ForeignKey('chats.id'), nullable=False, index=True)
    role = db.Column(db.String(50), nullable=False) # 'user' or 'assistant'
    content = db.Column(db.Text, nullable=False)
    has_files = db.Column(db.Boolean, default=False)
    time = db.Column(db.DateTime, default=datetime.utcnow, index=True) # Indexed for LIMIT 8 retrieval

    uploaded_documents = db.relationship('UploadedDocument', backref='message', lazy=True, cascade="all, delete-orphan")

class UploadedDocument(db.Model):
    __tablename__ = 'uploaded_documents'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    message_id = db.Column(UUID(as_uuid=True), db.ForeignKey('messages.id'), nullable=False, index=True)
    filename = db.Column(db.String(255), nullable=False)
    gemini_file_name = db.Column(db.String(255), nullable=False) # name property from gemini upload
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

class ResumeAnalysis(db.Model):
    __tablename__ = 'resume_analyses'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=True, index=True)
    score = db.Column(db.Integer, nullable=True)
    roles = db.Column(db.JSON, nullable=True)
    skills = db.Column(db.JSON, nullable=True)
    roadmap = db.Column(db.JSON, nullable=True)
    recommendations = db.Column(db.JSON, nullable=True)
    growth_projection = db.Column(db.JSON, nullable=True)
    raw_json = db.Column(db.JSON, nullable=False) # Keep the raw parsed AI response for flexibility
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)

class QuizResult(db.Model):
    __tablename__ = 'quiz_results'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=True, index=True)
    domain = db.Column(db.String(255), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    breakdown = db.Column(db.JSON, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)

# ---------------- PHASE 2: REAL INTELLIGENCE MODELS ----------------

class ResumeVersion(db.Model):
    __tablename__ = 'resume_versions'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=True, index=True)
    filename = db.Column(db.String(255), nullable=False)
    raw_text = db.Column(db.Text, nullable=False)
    target_role = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    skills = db.relationship('ExtractedSkill', backref='resume', lazy=True, cascade="all, delete-orphan")
    metrics = db.relationship('AnalysisMetric', backref='resume', uselist=False, cascade="all, delete-orphan")
    embeddings = db.relationship('SemanticEmbedding', backref='resume', lazy=True, cascade="all, delete-orphan")

class ExtractedSkill(db.Model):
    __tablename__ = 'extracted_skills'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id = db.Column(db.String(36), db.ForeignKey('resume_versions.id'), nullable=False, index=True)
    skill_name = db.Column(db.String(128), nullable=False, index=True)
    category = db.Column(db.String(64), nullable=True) # e.g., 'Core', 'Missing', 'Supporting'
    confidence = db.Column(db.Float, nullable=True)
    
class AnalysisMetric(db.Model):
    __tablename__ = 'analysis_metrics'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id = db.Column(db.String(36), db.ForeignKey('resume_versions.id'), nullable=False, unique=True)
    ats_score = db.Column(db.Integer, nullable=False)
    keyword_density = db.Column(db.Float, nullable=True)
    complexity_score = db.Column(db.Integer, nullable=True)
    recruiter_concerns = db.Column(db.JSON, nullable=True)
    standout_metrics = db.Column(db.JSON, nullable=True)
    
class TelemetryLog(db.Model):
    __tablename__ = 'telemetry_logs'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    action = db.Column(db.String(128), nullable=False, index=True) # e.g., 'pdf_parse', 'gemini_inference'
    duration_ms = db.Column(db.Float, nullable=False)
    metadata_json = db.Column(db.JSON, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)

class SemanticEmbedding(db.Model):
    __tablename__ = 'semantic_embeddings'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id = db.Column(db.String(36), db.ForeignKey('resume_versions.id'), nullable=False, index=True)
    chunk_type = db.Column(db.String(64), nullable=False) # e.g., 'experience_block', 'full_resume'
    chunk_text = db.Column(db.Text, nullable=False)
    # Stored as JSON for Phase 2 development. Will migrate to pgvector later.
    embedding_vector = db.Column(db.JSON, nullable=False)

# ---------------- PHASE 3: SETTINGS & INFRASTRUCTURE ----------------

class UserPreferences(db.Model):
    __tablename__ = 'user_preferences'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False, unique=True)
    engineering_role = db.Column(db.String(255), default="Frontend Systems Engineer")
    career_target = db.Column(db.String(255), default="Backend Infrastructure")
    primary_stack = db.Column(db.String(255), default="React, Node.js")
    recruiter_strictness = db.Column(db.String(50), default="moderate")
    ats_analysis_mode = db.Column(db.String(50), default="standard")
    profile_visibility = db.Column(db.Boolean, default=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class UserSecurityEvent(db.Model):
    __tablename__ = 'user_security_events'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False, index=True)
    event_type = db.Column(db.String(128), nullable=False) # e.g. "login", "password_change"
    ip_address = db.Column(db.String(64), nullable=True)
    location = db.Column(db.String(128), nullable=True)
    browser_signature = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)

class UserApiToken(db.Model):
    __tablename__ = 'user_api_tokens'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False, index=True)
    token = db.Column(db.String(255), unique=True, nullable=False)
    name = db.Column(db.String(128), nullable=False)
    scopes = db.Column(db.JSON, nullable=True)
    is_revoked = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class UserConnectedAccount(db.Model):
    __tablename__ = 'user_connected_accounts'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False, index=True)
    provider = db.Column(db.String(64), nullable=False) # e.g. "github", "linkedin"
    provider_user_id = db.Column(db.String(255), nullable=False)
    profile_url = db.Column(db.String(255), nullable=True)
    sync_status = db.Column(db.String(50), default="active")
    last_synced = db.Column(db.DateTime, default=datetime.utcnow)

# ---------------- PHASE 4: EVALUATION INFRASTRUCTURE ----------------

class UserAssessment(db.Model):
    __tablename__ = 'user_assessments'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False, index=True)
    track = db.Column(db.String(128), nullable=False) # e.g. "Backend Infrastructure"
    status = db.Column(db.String(50), default="in_progress") # in_progress, completed
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)

class AssessmentResult(db.Model):
    __tablename__ = 'assessment_results'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    assessment_id = db.Column(UUID(as_uuid=True), db.ForeignKey('user_assessments.id'), nullable=False, index=True)
    question_domain = db.Column(db.String(64), nullable=False)
    is_correct = db.Column(db.Boolean, nullable=False)
    weight = db.Column(db.Integer, default=1)
    latency_ms = db.Column(db.Integer, nullable=True) # Time taken to answer

class EngineeringVector(db.Model):
    __tablename__ = 'engineering_vectors'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    assessment_id = db.Column(UUID(as_uuid=True), db.ForeignKey('user_assessments.id'), nullable=False, index=True)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    vector_data = db.Column(db.JSON, nullable=False) # e.g. {"Systems Thinking": 85, "Production Readiness": 70}
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class AssessmentTelemetry(db.Model):
    __tablename__ = 'assessment_telemetry'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    assessment_id = db.Column(UUID(as_uuid=True), db.ForeignKey('user_assessments.id'), nullable=False)
    event_type = db.Column(db.String(128), nullable=False) # e.g., "orchestrator_init", "genome_engine_sync"
    duration_ms = db.Column(db.Integer, nullable=True)
    metadata_json = db.Column(db.JSON, nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class RecruiterAdjustment(db.Model):
    __tablename__ = 'recruiter_adjustments'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    assessment_id = db.Column(UUID(as_uuid=True), db.ForeignKey('user_assessments.id'), nullable=False)
    signal_type = db.Column(db.String(128), nullable=False) # e.g. "Backend Reliability Signal"
    adjustment_value = db.Column(db.Float, nullable=False) # e.g. +8.0
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class RoadmapUpdate(db.Model):
    __tablename__ = 'roadmap_updates'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    assessment_id = db.Column(UUID(as_uuid=True), db.ForeignKey('user_assessments.id'), nullable=False)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    path_nodes = db.Column(db.JSON, nullable=False) # e.g. ["Docker", "Redis", "Kubernetes"]
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class EvaluationHistory(db.Model):
    __tablename__ = 'evaluation_history'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    assessment_id = db.Column(UUID(as_uuid=True), db.ForeignKey('user_assessments.id'), nullable=False)
    overall_score = db.Column(db.Float, nullable=False)
    benchmark_percentile = db.Column(db.Float, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

