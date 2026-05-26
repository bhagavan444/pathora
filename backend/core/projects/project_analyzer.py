from core.projects.complexity_rules import ComplexityRules
from core.market.role_templates import RoleTemplates

class ProjectAnalyzer:
    """
    Computes absolute project depth, complexity, and production readiness.
    """
    
    @staticmethod
    def compute_complexity(sections: dict, skills: list, domain_key: str = "generic") -> dict:
        projects_text = sections.get("projects", "") + " " + sections.get("experience", "")
        template = RoleTemplates.get_template(domain_key)
        
        explanations = []
        
        # 1. Detect Tutorial Smells
        smell_count = 0
        if template.get("penalize_tutorial_smells", True):
            smell_count = ComplexityRules.count_tutorial_smells(projects_text)
            if smell_count > 0:
                explanations.append(f"Penalty applied: {smell_count} tutorial-level project naming patterns detected.")
        
        # 2. Extract Architectural Evidence
        arch_signals = ComplexityRules.extract_architecture_signals(skills, projects_text)
        
        # 3. Compute Base Points
        base_points = 20 # Start with 20 points for just having sections
        
        db_count = len(arch_signals["databases"])
        deploy_count = len(arch_signals["deployment"])
        auth_count = len(arch_signals["auth"])
        orch_count = len(arch_signals["orchestration"])
        telemetry_count = len(arch_signals["telemetry"])
        ci_cd_count = len(arch_signals["ci_cd"])
        
        score_db = min(30, db_count * 15)
        score_deploy = min(35, deploy_count * 15)
        score_auth = min(15, auth_count * 15)
        score_orch = min(20, orch_count * 20)
        score_tel = min(15, telemetry_count * 15)
        score_ci = min(15, ci_cd_count * 15)
        
        raw_complexity = base_points + score_db + score_deploy + score_auth + score_orch + score_tel + score_ci
        
        if deploy_count > 0:
            explanations.append(f"Deployment signals detected ({deploy_count}), increasing production readiness.")
        if orch_count > 0 or ci_cd_count > 0:
            explanations.append("Orchestration / CI/CD pipelines detected. Strong indicator of advanced engineering.")
            
        # Apply penalties for tutorial smells (don't push below 10 if they tried)
        penalty = smell_count * 15
        final_complexity = max(10, raw_complexity - penalty)
        
        # Cap at 100
        final_complexity = min(100, final_complexity)
        
        # 4. Production Readiness (Heavily weighted on Deploy, CI/CD, and Telemetry)
        raw_production = (score_deploy * 1.5) + (score_ci * 2) + (score_tel * 2) + (score_db * 0.5)
        production_readiness = min(100, max(0, int(raw_production)))
        
        # 5. Categorize
        if final_complexity < 40:
            tier = "Beginner (CRUD / Local)"
        elif final_complexity < 75:
            tier = "Intermediate (Deployed / Integrated)"
        else:
            tier = "Advanced (Distributed / Production-Grade)"
            
        if template["type"] == "NON_TECH":
            tier = "N/A (Non-Engineering Role)"
            explanations.append(f"Domain '{domain_key}' is non-technical; project complexity architecture signals are deprioritized.")
            
        return {
            "project_complexity_index": int(final_complexity),
            "production_readiness_score": int(production_readiness),
            "architecture_sophistication_score": int(score_orch + score_auth + (score_db * 0.5)),
            "tutorial_smells_detected": smell_count,
            "architecture_signals": arch_signals,
            "complexity_tier": tier,
            "explanations": explanations
        }
