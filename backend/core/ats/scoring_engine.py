from core.market.role_templates import RoleTemplates

class ATSScoringEngine:
    """
    Computes deterministic ATS Match Score based on resume sections, skills, and metrics,
    dynamically weighted by the target domain template.
    """
    
    @staticmethod
    def compute_score(sections: dict, skills: list, metrics: list, verb_counts: dict, domain_key: str = "generic") -> dict:
        template = RoleTemplates.get_template(domain_key)
        weights = template["ats_weights"]
        
        score_breakdown = {
            "section_completeness": 0,
            "keyword_density": 0,
            "quantified_impact": 0,
            "leadership_and_verbs": 0
        }
        
        # 1. Section Completeness (Always 20 points base)
        core_sections = ["profile", "education", "experience", "skills", "projects"]
        found_core = sum(1 for sec in core_sections if len(sections.get(sec, "")) > 20)
        score_breakdown["section_completeness"] = min(20, found_core * 4)
        
        # 2. Keyword Density (Dynamic weight * 80)
        skill_count = len(skills)
        max_skills_score = 80 * weights["skills"]
        score_breakdown["keyword_density"] = min(max_skills_score, skill_count * (max_skills_score / 15))
        
        # 3. Quantified Impact (Dynamic weight * 80)
        metric_count = len(metrics)
        max_metrics_score = 80 * weights["metrics"]
        score_breakdown["quantified_impact"] = min(max_metrics_score, metric_count * (max_metrics_score / 5))
        
        # 4. Action Verbs (Dynamic weight * 80)
        action_verbs = verb_counts.get("action_verbs", 0)
        leadership = verb_counts.get("leadership_verbs", 0)
        
        max_verbs_score = 80 * weights["verbs"]
        verb_score = min(max_verbs_score * 0.7, action_verbs * 2)
        leadership_score = min(max_verbs_score * 0.3, leadership * 3)
        score_breakdown["leadership_and_verbs"] = verb_score + leadership_score
        
        total_score = sum(score_breakdown.values())
        
        if total_score > 100:
            total_score = 100
            
        return {
            "ats_score": int(total_score),
            "breakdown": score_breakdown,
            "extracted_skills": skills,
            "quantified_metrics_found": metric_count,
            "domain_applied": domain_key
        }
