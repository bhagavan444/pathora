from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import traceback
import logging
import sys
import os

# Ensure backend root is in Python path for core/* imports
backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

logger = logging.getLogger(__name__)
router = APIRouter()

# Import the REAL engines using the CORRECT paths (matching flask_app.py)
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

class ResumeAnalysisRequest(BaseModel):
    doc_id: str
    target_role: str = "Software Engineer"

@router.post("/analyze")
async def analyze_resume(request: ResumeAnalysisRequest):
    """
    Real Intelligence Engine. Runs all core deterministic engines
    and returns a flat JSON payload for the frontend.
    """
    try:
        # Fetch resume text from DB via Flask app context
        resume_raw_text = None
        try:
            from flask_app import app as flask_app_instance
            from models import ResumeVersion
            from extensions import db

            with flask_app_instance.app_context():
                resume = ResumeVersion.query.get(request.doc_id)
                if resume:
                    resume_raw_text = resume.raw_text
                    logger.info(f"[FASTAPI] Resume fetched from DB: {request.doc_id}")
        except Exception as db_err:
            logger.warning(f"[FASTAPI] DB fetch failed: {db_err}")

        if not resume_raw_text:
            return JSONResponse(status_code=404, content={
                "error": f"Resume not found for doc_id: {request.doc_id}"
            })

        target_role = request.target_role

        # ── PIPELINE START ──────────────────────────────────────────────
        # 1. Document Parsing
        sections = DocumentParser.parse_sections(resume_raw_text)

        # 2. Entity Extraction
        extracted_skills = EntityExtractor.extract_skills(resume_raw_text)
        metrics = EntityExtractor.extract_metrics(resume_raw_text)
        verb_counts = EntityExtractor.count_action_verbs(resume_raw_text)

        # 3. Domain Routing
        try:
            domain_key = DomainRouter.route_domain(target_role)
        except Exception:
            domain_key = "generic"

        # 4. ATS Scoring
        ats_result = ATSScoringEngine.compute_score(
            sections, extracted_skills, metrics, verb_counts, domain_key
        )

        # 5. Engineering Credibility Engines
        project_metrics = ProjectAnalyzer.compute_complexity(
            sections, extracted_skills, domain_key
        )
        links = EntityExtractor.extract_links(resume_raw_text)
        recruiter_metrics = TrustEngine.compute_trust(
            sections, metrics, links, domain_key
        )
        maturity_metrics = MaturityEngine.compute_maturity(
            project_metrics.get("architecture_signals", []),
            project_metrics.get("project_complexity_index", 50),
            domain_key
        )
        heatmap_metrics = HeatmapEngine.generate_heatmap(
            sections, metrics, verb_counts
        )

        # 6. Genome Vectors
        genome_result = VectorCalculator.compute_vectors(extracted_skills)

        # 7. Roadmap & Benchmarking
        skill_gap = RoadmapGenerator.generate_roadmap(extracted_skills, domain_key)
        benchmark_metrics = BenchmarkEngine.compute_market_percentile(
            domain_key,
            ats_result.get("ats_score", 50),
            project_metrics.get("project_complexity_index", 50),
            maturity_metrics.get("engineering_maturity_index", 50),
            len(metrics)
        )
        # ── PIPELINE END ────────────────────────────────────────────────

        # Build flat payload (exactly what frontend expects)
        final_payload = {
            # Top-level flat keys for Predict.jsx KPI cards
            "ats_score": ats_result.get("ats_score", 0),
            "recruiter_trust_score": recruiter_metrics.get("recruiter_trust_score", 0),
            "project_complexity_score": project_metrics.get("project_complexity_index", 0),
            "engineering_maturity_score": maturity_metrics.get("engineering_maturity_index", 0),
            "keyword_density": ats_result.get("keyword_density", 0.0),
            "project_tier": project_metrics.get("complexity_tier", "Unknown"),
            "engineering_level": maturity_metrics.get("maturity_level", "Unknown"),
            "telemetry": {
                "vectors_mapped": len(extracted_skills),
                "confidence": recruiter_metrics.get("confidence_score", 0.94)
            },

            # Full nested objects for sub-components (radar charts, heatmaps, etc.)
            "recruiter_metrics": recruiter_metrics,
            "project_metrics": project_metrics,
            "maturity_metrics": maturity_metrics,
            "benchmark_metrics": benchmark_metrics,
            "heatmap": heatmap_metrics,
            "aspect_scores": genome_result.get("aspect_scores", []),
            "matched_skills": skill_gap.get("core_skills_matched", []) or extracted_skills,
            "missing_skills": skill_gap.get("missing_skills", []),
            "improvement_suggestions": skill_gap.get("roadmap", []),
            "roadmap": skill_gap.get("roadmap", []),
            "domain_applied": domain_key,
            "recruiter_insights": {
                "concerns": [],
                "standouts": [
                    recruiter_metrics.get("standout_factor", ""),
                    f"Maturity: {maturity_metrics.get('maturity_level', 'Unknown')}"
                ]
            }
        }

        logger.info(f"[FASTAPI] Pipeline complete. ATS={final_payload['ats_score']}, "
                     f"Trust={final_payload['recruiter_trust_score']}, "
                     f"Complexity={final_payload['project_complexity_score']}")

        return JSONResponse(content=final_payload)

    except Exception as e:
        logger.error(f"[FASTAPI_PIPELINE_ERROR] {traceback.format_exc()}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e), "traceback": traceback.format_exc()}
        )
