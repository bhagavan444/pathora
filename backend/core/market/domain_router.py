import re

class DomainRouter:
    """
    Routes raw user string domains into standardized templates.
    """
    
    KEYWORD_MAP = {
        "software_engineer": ["software", "swe", "frontend", "backend", "full stack", "fullstack", "web", "sde", "developer", "programmer"],
        "aiml_engineer": ["ai", "ml", "artificial intelligence", "machine learning", "data science", "nlp", "computer vision", "llm"],
        "data_analyst": ["data analyst", "data analytics", "business intelligence", "bi", "data reporting"],
        "devops_engineer": ["devops", "sre", "site reliability", "platform engineer", "infrastructure"],
        "cybersecurity": ["cybersecurity", "security", "infosec", "penetration", "soc analyst", "ethical hacker"],
        "mechanical_engineer": ["mechanical", "mech", "automotive", "aerospace", "hvac", "manufacturing"],
        "mba_business": ["mba", "business", "manager", "product manager", "pm", "strategy", "finance", "marketing"],
    }
    
    @classmethod
    def route_domain(cls, target_role: str) -> str:
        """
        Takes a raw target role string from the user and returns the standard key for role_templates.
        """
        role_lower = target_role.lower().strip()
        
        # Match using keywords
        for standard_key, keywords in cls.KEYWORD_MAP.items():
            for kw in keywords:
                if kw in role_lower:
                    return standard_key
                    
        return "software_engineer" # Default fallback for tech-heavy platform
