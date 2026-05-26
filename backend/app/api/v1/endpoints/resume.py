from fastapi import APIRouter
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel
import traceback
import logging
import json
import sys
import os

# Ensure backend root is in Python path for core/* imports
backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

logger = logging.getLogger(__name__)
router = APIRouter()

# Import the in-memory resume store from documents endpoint
from app.api.v1.endpoints.documents import get_resume_text

# Import the REAL deterministic engines
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


def _run_analysis_pipeline(doc_id: str, target_role: str) -> dict:
    """
    Full deterministic resume analysis pipeline.
    Fetches resume text from the in-memory store (populated by /documents/upload),
    runs all engines, and returns a flat JSON payload.
    """
    # ── STEP 0: Fetch resume text ───────────────────────────────────
    resume_raw_text = get_resume_text(doc_id)

    if not resume_raw_text:
        logger.warning(f"[RESUME] No text found in memory for {doc_id}")

    if not resume_raw_text:
        raise ValueError(f"Resume not found for doc_id: {doc_id}. Upload may have failed or expired.")

    logger.info(f"[PIPELINE] Starting analysis for doc_id={doc_id}, chars={len(resume_raw_text)}, role={target_role}")

    # ── STEP 1: Document Parsing ────────────────────────────────────
    sections = DocumentParser.parse_sections(resume_raw_text)

    # ── STEP 2: Entity Extraction ───────────────────────────────────
    extracted_skills = EntityExtractor.extract_skills(resume_raw_text)
    metrics = EntityExtractor.extract_metrics(resume_raw_text)
    verb_counts = EntityExtractor.count_action_verbs(resume_raw_text)

    # ── STEP 3: Domain Routing ──────────────────────────────────────
    try:
        domain_key = DomainRouter.route_domain(target_role)
    except Exception:
        domain_key = "generic"

    # ── STEP 4: ATS Scoring ─────────────────────────────────────────
    ats_result = ATSScoringEngine.compute_score(
        sections, extracted_skills, metrics, verb_counts, domain_key
    )

    # ── STEP 5: Engineering Credibility Engines ─────────────────────
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

    # ── STEP 6: Genome Vectors ──────────────────────────────────────
    genome_result = VectorCalculator.compute_vectors(extracted_skills)

    # ── STEP 7: Roadmap & Benchmarking ──────────────────────────────
    skill_gap = RoadmapGenerator.generate_roadmap(extracted_skills, domain_key)
    benchmark_metrics = BenchmarkEngine.compute_market_percentile(
        domain_key,
        ats_result.get("ats_score", 50),
        project_metrics.get("project_complexity_index", 50),
        maturity_metrics.get("engineering_maturity_index", 50),
        len(metrics)
    )

    # ── FINAL PAYLOAD ───────────────────────────────────────────────
    # Flat structure — EXACTLY what Predict.jsx expects
    final_payload = {
        "ats_score": int(ats_result.get("ats_score", 0) or 0),
        "recruiter_trust": int(recruiter_metrics.get("recruiter_trust_score", 0) or 0),
        "project_complexity": int(project_metrics.get("project_complexity_index", 0) or 0),
        "engineering_maturity": int(maturity_metrics.get("engineering_maturity_index", 0) or 0),
        "market_percentile": int(benchmark_metrics.get("percentile", 0) if benchmark_metrics else 0),
        "project_tier": str(project_metrics.get("complexity_tier", "Unknown") if project_metrics else "Unknown"),
        "engineering_level": str(maturity_metrics.get("maturity_level", "Unknown") if maturity_metrics else "Unknown"),
        "market_comparison": str(benchmark_metrics.get("comparison", "Unknown") if benchmark_metrics else "Unknown"),
        "aspect_scores": genome_result.get("aspect_scores", []) if genome_result else [],
        "skills": list(extracted_skills) if extracted_skills else [],
        "strengths": [recruiter_metrics.get("standout_factor", "")] if recruiter_metrics and recruiter_metrics.get("standout_factor") else [],
        "weaknesses": [],
        "recommendations": list(skill_gap.get("roadmap", [])) if skill_gap else [],
        "keyword_density": float(ats_result.get("keyword_density", 0.0) or 0.0),
        "telemetry": {
            "vectors_mapped": len(extracted_skills) if extracted_skills else 0,
            "confidence": float(recruiter_metrics.get("confidence_score", 0.94) or 0.94)
        },
        "recruiter_metrics": recruiter_metrics or {},
        "project_metrics": project_metrics or {},
        "maturity_metrics": maturity_metrics or {},
        "benchmark_metrics": benchmark_metrics or {},
        "heatmap": heatmap_metrics or {},
        "matched_skills": list(skill_gap.get("core_skills_matched", [])) if skill_gap and skill_gap.get("core_skills_matched") else list(extracted_skills or []),
        "missing_skills": list(skill_gap.get("missing_skills", [])) if skill_gap else [],
        "improvement_suggestions": list(skill_gap.get("roadmap", [])) if skill_gap else [],
        "roadmap": list(skill_gap.get("roadmap", [])) if skill_gap else [],
        "domain_applied": domain_key
    }

    print("FINAL PAYLOAD:", json.dumps(final_payload, indent=2))
    logger.info(
        f"[PIPELINE] Complete. ATS={final_payload['ats_score']}, "
        f"Trust={final_payload['recruiter_trust']}, "
        f"Complexity={final_payload['project_complexity']}, "
        f"Maturity={final_payload['engineering_maturity']}, "
        f"Percentile={final_payload['market_percentile']}"
    )

    return final_payload


@router.post("/analyze")
async def analyze_resume(request: ResumeAnalysisRequest):
    """
    Synchronous analysis endpoint.
    Runs all deterministic engines and returns flat JSON.
    """
    try:
        final_payload = _run_analysis_pipeline(request.doc_id, request.target_role)
        return JSONResponse(content=final_payload)
    except ValueError as ve:
        return JSONResponse(status_code=404, content={"error": str(ve)})
    except Exception as e:
        logger.error(f"[PIPELINE_ERROR] {traceback.format_exc()}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e), "traceback": traceback.format_exc()}
        )


@router.post("/analyze/stream")
async def analyze_resume_stream(request: ResumeAnalysisRequest):
    """
    SSE stream endpoint. Emits status updates then the final analytics payload.
    """
    async def generate():
        try:
            yield f"data: {json.dumps({'status': 'analyzing'})}\n\n"
            final_payload = _run_analysis_pipeline(request.doc_id, request.target_role)
            yield f"data: {json.dumps(final_payload)}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as e:
            logger.error(f"[STREAM_ERROR] {traceback.format_exc()}")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")
