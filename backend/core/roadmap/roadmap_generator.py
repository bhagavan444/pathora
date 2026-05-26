from core.roadmap.dependency_graph import DependencyGraph
from core.market.role_templates import RoleTemplates

class RoadmapGenerator:
    """
    Generates a deterministic roadmap by comparing extracted skills to Role Templates and DAG prerequisites.
    """
    
    @staticmethod
    def generate_roadmap(extracted_skills: list, domain_key: str = "generic") -> dict:
        template = RoleTemplates.get_template(domain_key)
        
        extracted_lower = {s.lower() for s in extracted_skills}
        
        expected_core = set(template.get("core_skills", []))
        expected_infra = set(template.get("infrastructure_skills", []))
        
        # 1. Direct missing skills
        missing_core = list(expected_core - extracted_lower)
        missing_infra = list(expected_infra - extracted_lower)
        
        # 2. Check DAG prerequisites for the expected skills
        all_expected = expected_core.union(expected_infra)
        required_prereqs = set(DependencyGraph.resolve_all_prerequisites(list(all_expected)))
        
        missing_prereqs = list(required_prereqs - extracted_lower - all_expected)
        
        # 3. Compile Roadmap steps (Deterministic progression)
        roadmap_steps = []
        
        if missing_prereqs:
            roadmap_steps.append({
                "phase": "Phase 1: Foundational Prerequisites",
                "focus": "Establish the base layer required for your target role.",
                "skills": sorted(missing_prereqs)[:5] # Top 5
            })
            
        if missing_core:
            roadmap_steps.append({
                "phase": f"Phase 2: Core {domain_key.replace('_', ' ').title()} Capabilities",
                "focus": "Master the primary technologies expected in this domain.",
                "skills": sorted(missing_core)[:5]
            })
            
        if missing_infra and template["type"] == "TECH":
            roadmap_steps.append({
                "phase": "Phase 3: Production & Infrastructure Readiness",
                "focus": "Learn deployment, CI/CD, and scaling technologies.",
                "skills": sorted(missing_infra)[:5]
            })
            
        # 4. Project Recommendations based on Maturity
        project_recs = []
        if template["type"] == "TECH":
            if missing_infra:
                project_recs.append("Build and deploy a full-stack application using Docker and CI/CD.")
            else:
                project_recs.append("Build a distributed microservice architecture with telemetry and load balancing.")
        elif template["type"] == "NON_TECH":
            project_recs.append("Create a data-driven business strategy report with quantified impact metrics.")
            
        return {
            "missing_skills": missing_core + missing_infra,
            "core_skills_matched": list(expected_core.intersection(extracted_lower)),
            "roadmap": roadmap_steps,
            "project_recommendations": project_recs,
            "readiness": ["Focus on quantifiable metrics", "Prepare architecture diagrams for interview"] if not missing_core else ["Needs significant skill development"],
            "career_trajectory": ["Target Junior Roles"] if missing_core else ["Target Mid-Level Roles", "Target Senior Roles (if leadership proven)"]
        }
