import json
import logging
import re
import time
import os
from google import genai

logger = logging.getLogger(__name__)
DEBUG_INTELLIGENCE_PIPELINE = os.getenv("DEBUG_INTELLIGENCE_PIPELINE", "false").lower() == "true"

class RecruiterAnalysisEngine:
    def __init__(self, gemini_client: genai.Client, model_name: str = 'gemini-2.5-flash'):
        self.client = gemini_client
        self.model_name = model_name

    def _safe_json_extract(self, text: str) -> dict:
        try:
            match = re.search(r"\{.*\}", text, re.DOTALL)
            if match:
                return json.loads(match.group())
        except Exception:
            pass
        return {}

    def extract_insights(self, resume_text: str) -> dict:
        """
        Scans the resume from a strict enterprise technical recruiter perspective.
        Highlights concerns like missing metrics, weak verbs, or readability issues.
        """
        if not resume_text:
            return {"concerns": [], "standouts": []}

        logger.info("[RECRUITER_ANALYSIS_ENGINE] started")
        start_time = time.perf_counter()

        prompt = f"""
        You are a strict Enterprise Technical Recruiter scanning a resume.
        Identify red flags (concerns) such as:
        - Vague statements without quantifiable metrics (e.g., "improved performance" vs "reduced latency by 40%").
        - Lack of architectural scale or missing deployment details.
        - Poor structuring.
        
        Also identify strong standout metrics (mitigators).
        
        Return ONLY valid JSON in this exact structure:
        {{
            "concerns": [
                "Lack of quantified backend telemetry metrics.",
                "Uses passive verbs like 'helped' instead of 'architected'."
            ],
            "standouts": [
                "Clear continuous integration configuration indicators.",
                "Logical progression in project ownership."
            ]
        }}
        
        Resume Content:
        {resume_text[:3000]}
        """
        
        try:
            # Added explicit 60-second timeout
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config={'http_options': {'timeout': 60000}} # 60 seconds
            )
            
            if not response or not response.text:
                raise RuntimeError("Empty response from AI model")
                
            if DEBUG_INTELLIGENCE_PIPELINE:
                logger.info(f"[DEBUG] [RECRUITER_ANALYSIS_ENGINE] RAW GEMINI RESPONSE:\n{response.text}")

            data = self._safe_json_extract(response.text)
            if not data:
                raise RuntimeError("Failed to parse valid JSON from Gemini output")
                
            logger.info(f"[RECRUITER_ANALYSIS_ENGINE] completed in {time.perf_counter() - start_time:.2f}s")
            
            return {
                "concerns": list(data.get("concerns", [])),
                "standouts": list(data.get("standouts", []))
            }
            
        except Exception as e:
            import traceback
            error_str = str(e)
            logger.error(f"[RECRUITER_ANALYSIS_ENGINE] failed: {traceback.format_exc()}")
            
            if "API_KEY_INVALID" in error_str or "API key not valid" in error_str:
                raise RuntimeError("Gemini API authentication failed. Please configure a valid GEMINI_API_KEY from Google AI Studio.")
                
            raise RuntimeError(f"Recruiter analysis failed: {error_str}")
