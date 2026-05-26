import json
import logging
import re
import time
import os
from google import genai

logger = logging.getLogger(__name__)
DEBUG_INTELLIGENCE_PIPELINE = os.getenv("DEBUG_INTELLIGENCE_PIPELINE", "false").lower() == "true"

class ATSEngine:
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

    def analyze_resume(self, resume_text: str, target_role: str) -> dict:
        """
        Analyzes the resume for ATS compatibility.
        Returns a strongly-typed normalized dictionary.
        """
        if not resume_text:
            raise ValueError("No resume text provided.")

        logger.info(f"[ATS_ENGINE] started for target role: {target_role}")
        start_time = time.perf_counter()

        prompt = f"""
        You are an enterprise Applicant Tracking System (ATS).
        Analyze the following resume for the target role: "{target_role}".
        
        Calculate the following strictly as numbers from 0 to 100:
        - ATS Match Score
        - Structural Complexity
        - Keyword Density (as a percentage representation)
        
        Also compute the following heuristic metrics based strictly on evidence in the resume:
        - Technical Depth
        - System Design
        - AI Competency
        - Leadership
        - Problem Solving
        
        Extract the explicit skills mentioned in the resume as a list of strings.
        
        Return ONLY valid JSON in this exact structure:
        {{
            "ats_score": 85,
            "complexity_score": 78,
            "keyword_density": 82,
            "extracted_skills": ["Python", "React", "Docker", "AWS"],
            "suggested_roles": ["Backend Engineer", "Full Stack Developer"],
            "aspect_scores": [
                {{"name": "Technical Depth", "value": 80}},
                {{"name": "System Design", "value": 75}},
                {{"name": "AI Competency", "value": 60}},
                {{"name": "Leadership", "value": 50}},
                {{"name": "Problem Solving", "value": 85}}
            ],
            "project_analysis": {{
                "complexity": 78,
                "scalability": 65
            }},
            "competitiveness": {{
                "percentile": 85,
                "interviewProbability": 70,
                "comparison": "Strong Candidate"
            }}
        }}
        
        Resume Content:
        {resume_text[:4000]}
        """
        
        try:
            # Added explicit 60-second timeout to prevent indefinite hanging
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config={'http_options': {'timeout': 60000}} # 60 seconds
            )
            
            if not response or not response.text:
                raise RuntimeError("Empty response from AI model")
                
            if DEBUG_INTELLIGENCE_PIPELINE:
                logger.info(f"[DEBUG] [ATS_ENGINE] RAW GEMINI RESPONSE:\n{response.text}")
                
            data = self._safe_json_extract(response.text)
            if not data:
                raise RuntimeError("Failed to parse valid JSON from Gemini output")
            
            logger.info(f"[ATS_ENGINE] completed in {time.perf_counter() - start_time:.2f}s")
            
            # Normalize and enforce schema
            return {
                "ats_score": int(data.get("ats_score", 50)),
                "complexity_score": int(data.get("complexity_score", 50)),
                "keyword_density": float(data.get("keyword_density", 50.0)),
                "extracted_skills": list(data.get("extracted_skills", [])),
                "suggested_roles": list(data.get("suggested_roles", [target_role])),
                "aspect_scores": data.get("aspect_scores", []),
                "project_analysis": data.get("project_analysis", {"complexity": 50, "scalability": 50}),
                "competitiveness": data.get("competitiveness", {"percentile": 50, "interviewProbability": 50, "comparison": "Developing Candidate"})
            }
            
        except Exception as e:
            import traceback
            error_str = str(e)
            logger.error(f"[ATS_ENGINE] analysis failed: {traceback.format_exc()}")
            
            if "API_KEY_INVALID" in error_str or "API key not valid" in error_str:
                raise RuntimeError("Gemini API authentication failed. Please configure a valid GEMINI_API_KEY from Google AI Studio.")
                
            raise RuntimeError(f"ATS analysis failed: {error_str}")
