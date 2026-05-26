from core.market.role_templates import RoleTemplates

class MaturityEngine:
    """
    Evaluates engineering maturity based on the co-occurrence of technologies and architecture skills.
    """
    
    @staticmethod
    def compute_maturity(arch_signals: dict, project_complexity: int, domain_key: str = "generic") -> dict:
        """
        Uses the categorized architectural signals to determine engineering maturity depth.
        """
        template = RoleTemplates.get_template(domain_key)
        explanations = []
        
        db_count = len(arch_signals["databases"])
        deploy_count = len(arch_signals["deployment"])
        orch_count = len(arch_signals["orchestration"])
        telemetry_count = len(arch_signals["telemetry"])
        ci_cd_count = len(arch_signals["ci_cd"])
        
        # 1. Systems Thinking
        systems_thinking = 0
        if db_count > 0 and deploy_count > 0:
            systems_thinking += 40
            explanations.append("Systems Thinking: Found full-stack integration (Databases + Deployment).")
            if ci_cd_count > 0: 
                systems_thinking += 20
                explanations.append("Systems Thinking: CI/CD automation detected.")
            if telemetry_count > 0: 
                systems_thinking += 20
                explanations.append("Systems Thinking: Telemetry/Monitoring detected.")
            if orch_count > 0: 
                systems_thinking += 20
                explanations.append("Systems Thinking: Distributed orchestration detected.")
        else:
            systems_thinking = min(30, (db_count + deploy_count) * 15)
            if template["type"] == "TECH" and systems_thinking < 20:
                explanations.append("Systems Thinking: Lacking end-to-end integration signals.")
            
        # 2. Infrastructure Readiness
        infra_readiness = min(100, (deploy_count * 20) + (ci_cd_count * 25) + (telemetry_count * 15))
        
        # 3. Overall Engineering Maturity Index
        if template["type"] == "NON_TECH":
            maturity_index = min(100, project_complexity * 1.5)
            level = "N/A (Business/Strategy Focus)"
            explanations.append(f"Domain '{domain_key}' relies on project complexity rather than technical infra readiness.")
        else:
            maturity_index = (project_complexity * 0.4) + (systems_thinking * 0.3) + (infra_readiness * 0.3)
            maturity_index = int(max(0, min(100, maturity_index)))
            
            if maturity_index < 35:
                level = "Junior / Foundational"
            elif maturity_index < 70:
                level = "Mid-Level / Independent"
            else:
                level = "Senior / Architectural"
            
        return {
            "engineering_maturity_index": int(maturity_index),
            "systems_thinking_score": int(systems_thinking),
            "infrastructure_readiness": int(infra_readiness),
            "maturity_level": level,
            "explanations": explanations
        }
