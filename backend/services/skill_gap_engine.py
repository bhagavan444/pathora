import json
import logging
import re
import time
import os
from google import genai

logger = logging.getLogger(__name__)
DEBUG_INTELLIGENCE_PIPELINE = os.getenv("DEBUG_INTELLIGENCE_PIPELINE", "false").lower() == "true"

class SkillGapEngine:
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

    def compute_gap(self, extracted_skills: list, target_role: str) -> dict:
        """
        Compares the candidate's skills with market standard skills for the target role.
        """
        if not extracted_skills:
            return {"missing_skills": [], "core_skills": [], "roadmap": []}
            
        logger.info(f"[SKILL_GAP_ENGINE] started for target role: {target_role}")
        start_time = time.perf_counter()

        prompt = f"""
        You are a Senior Technical Recruiter and Career Mentor.
        The candidate has these skills: {', '.join(extracted_skills)}
        The target role is: "{target_role}"
        
        Analyze what essential skills are missing for a modern production environment.
        Provide a 3-step actionable roadmap to bridge the gap.
        
        Also compute the following heuristic metrics based strictly on evidence in the resume:
        - Readiness score across various domains (0-100)
        - Career Trajectory (4 steps from current to long-term goal)
        - Experimental Growth Projection (Salary Estimate for the next 5 years based on the trajectory).
        
        Return ONLY valid JSON in this exact structure:
        {{
            "missing_skills": ["Kubernetes", "Kafka", "CI/CD"],
            "core_skills_matched": ["Python", "React"],
            "roadmap": [
                "Learn Kubernetes by deploying a containerized microservice.",
                "Implement an event-driven architecture using Kafka.",
                "Add CI/CD pipelines via GitHub Actions to existing projects."
            ],
            "readiness": [
                {{"name": "DSA Algorithms", "value": 72}},
                {{"name": "System Design", "value": 64}},
                {{"name": "Technical Communication", "value": 92}},
                {{"name": "Backend Architecture", "value": 58}},
                {{"name": "Frontend State Systems", "value": 95}}
            ],
            "career_trajectory": [
                "Software Engineer I",
                "Senior Product Engineer",
                "Infrastructure Lead",
                "Principal AI Architect"
            ],
            "growth_projection": [
                {{"year": "Now", "salary": 85000}},
                {{"year": "Y1", "salary": 112000}},
                {{"year": "Y2", "salary": 140000}},
                {{"year": "Y3", "salary": 175000}},
                {{"year": "Y5", "salary": 220000}}
            ]
        }}
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
                logger.info(f"[DEBUG] [SKILL_GAP_ENGINE] RAW GEMINI RESPONSE:\n{response.text}")
                
            data = self._safe_json_extract(response.text)
            if not data:
                raise RuntimeError("Failed to parse valid JSON from Gemini output")
                
            logger.info(f"[SKILL_GAP_ENGINE] completed in {time.perf_counter() - start_time:.2f}s")
            
            return {
                "missing_skills": list(data.get("missing_skills", [])),
                "core_skills_matched": list(data.get("core_skills_matched", extracted_skills[:3])),
                "roadmap": list(data.get("roadmap", [])),
                "readiness": data.get("readiness", []),
                "career_trajectory": data.get("career_trajectory", []),
                "growth_projection": data.get("growth_projection", [])
            }
            
        except Exception as e:
            import traceback
            error_str = str(e)
            logger.error(f"[SKILL_GAP_ENGINE] failed: {traceback.format_exc()}")
            
            if "API_KEY_INVALID" in error_str or "API key not valid" in error_str:
                raise RuntimeError("Gemini API authentication failed. Please configure a valid GEMINI_API_KEY from Google AI Studio.")
                
            raise RuntimeError(f"Skill Gap analysis failed: {error_str}")
