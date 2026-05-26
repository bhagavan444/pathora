from core.recruiter.recruiter_heuristics import RecruiterHeuristics
from core.market.role_templates import RoleTemplates

class TrustEngine:
    """
    Computes deterministic Recruiter Trust Score and Interview Readiness.
    """
    
    @staticmethod
    def compute_trust(sections: dict, metrics: list, links: list, domain_key: str = "generic") -> dict:
        full_text = " ".join(sections.values())
        template = RoleTemplates.get_template(domain_key)
        explanations = []
        
        # 1. Extracted Signals
        buzzword_count = RecruiterHeuristics.count_buzzwords(full_text)
        strong_verbs_count = RecruiterHeuristics.count_strong_verbs(full_text)
        metrics_count = len(metrics)
        links_count = len(links)
        
        # 2. Base Confidence
        trust_score = 50  # Start neutral
        
        # 3. Rewards
        metrics_reward = min(20, metrics_count * 4)
        if metrics_reward > 0:
            explanations.append(f"Trust increased: Found {metrics_count} quantified metrics demonstrating measurable impact.")
            
        links_reward = min(15, links_count * 5)
        if links_reward > 0:
            explanations.append(f"Trust increased: Found {links_count} external links (proof of work).")
            
        verbs_reward = min(15, strong_verbs_count * 2)
        
        trust_score += (metrics_reward + links_reward + verbs_reward)
        
        # 4. Penalties
        buzzword_penalty = buzzword_count * 5
        if buzzword_penalty > 0:
            explanations.append(f"Trust decreased: Heavy usage of generic buzzwords ({buzzword_count}) lacking contextual depth.")
            
        trust_score -= buzzword_penalty
        
        # Bound score
        trust_score = max(0, min(100, trust_score))
        
        # 5. Interview Readiness Simulation
        interview_prob = (trust_score * 0.7) + (min(30, metrics_count * 5) * 0.3)
        interview_prob = int(max(0, min(100, interview_prob)))
        
        # 6. Generate Standout Factor
        if metrics_count > 5 and trust_score > 80:
            standout = "High Quantified Impact"
        elif links_count > 2 and trust_score > 70:
            standout = "Strong External Proof (Links)"
        elif trust_score < 40:
            standout = "Vague Language / Buzzword Heavy"
        else:
            standout = "Standard Profile"
            
        return {
            "recruiter_trust_score": trust_score,
            "interview_probability": interview_prob,
            "standout_factor": standout,
            "buzzword_penalty": buzzword_penalty,
            "impact_reward": metrics_reward,
            "explanations": explanations
        }
