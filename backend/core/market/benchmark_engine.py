from .role_templates import RoleTemplates
import math

class BenchmarkEngine:
    """
    Computes deterministic percentiles and global ranking metrics based on role templates and extracted signals.
    """
    
    @classmethod
    def compute_market_percentile(cls, role_key: str, ats_score: int, complexity_score: int, maturity_score: int, metrics_count: int) -> dict:
        template = RoleTemplates.get_template(role_key)
        
        # Base percentile starts around 30 for just having a resume
        percentile = 30.0
        explanations = []
        
        # 1. ATS Baseline (up to 20%)
        ats_contrib = (ats_score / 100.0) * 20
        percentile += ats_contrib
        if ats_score > 75:
            explanations.append("Strong keyword density pushes you above the parsing filter barrier.")
            
        # 2. Complexity & Maturity (up to 30%)
        if template["type"] == "TECH":
            tech_contrib = ((complexity_score + maturity_score) / 200.0) * 30
            percentile += tech_contrib
            if complexity_score > 60:
                explanations.append("Production-grade infrastructure signals place you in the upper engineering bracket.")
        else:
            # Non-tech leans heavily on metrics and maturity (leadership)
            non_tech_contrib = (maturity_score / 100.0) * 30
            percentile += non_tech_contrib
            if maturity_score > 60:
                explanations.append("Strong leadership and cross-functional signals elevate your market standing.")
                
        # 3. Quantified Impact (up to 20%)
        metrics_contrib = min(20, metrics_count * 2.5)
        percentile += metrics_contrib
        if metrics_count == 0:
            explanations.append("Lacking quantified business metrics (revenue, scale, users). Missing top 20% tier.")
        elif metrics_count >= 5:
            explanations.append("High metric density aligns with top-tier candidate impact expectations.")
            
        # Cap at 99
        percentile = min(99.0, math.floor(percentile))
        
        # Comparison logic
        comparison = "Average Profile"
        if percentile > 85:
            comparison = "Top Tier Candidate"
        elif percentile > 70:
            comparison = "Highly Competitive"
        elif percentile > 50:
            comparison = "Market Standard"
        else:
            comparison = "Needs Improvement"
            
        return {
            "percentile": int(percentile),
            "comparison": comparison,
            "explanations": explanations
        }
