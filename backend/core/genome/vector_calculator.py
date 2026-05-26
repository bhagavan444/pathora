class VectorCalculator:
    """
    Computes domain-specific engineering vectors (radar chart data) based on extracted skills.
    """
    
    # Static taxonomy mapping skills to domains
    DOMAIN_TAXONOMY = {
        "Frontend": ["html", "css", "javascript", "typescript", "react", "angular", "vue"],
        "Backend": ["python", "java", "c++", "c", "node.js", "nodejs", "express", "django", "flask", "spring", "go", "rust", "ruby"],
        "Cloud_DevOps": ["aws", "azure", "gcp", "docker", "kubernetes", "ci/cd", "jenkins", "github actions", "linux"],
        "Data_AIML": ["machine learning", "deep learning", "tensorflow", "pytorch", "pandas", "scikit-learn", "numpy", "sql", "postgresql", "mongodb"],
        "Architecture": ["rest", "graphql", "agile", "scrum", "jira"]
    }
    
    @staticmethod
    def compute_vectors(skills: list) -> list:
        """
        Maps skills to domains and generates a normalized score for each domain vector.
        """
        skills_lower = [s.lower() for s in skills]
        
        vectors = []
        for domain, domain_skills in VectorCalculator.DOMAIN_TAXONOMY.items():
            matches = sum(1 for s in domain_skills if s in skills_lower)
            
            # Simple heuristic: 4 skills in a domain is considered "100% proficiency" for radar scaling
            raw_score = (matches / 4.0) * 100
            score = min(100, int(raw_score))
            
            # Clean up name for frontend (e.g. "Cloud_DevOps" -> "Cloud & DevOps")
            display_name = domain.replace("_", " & ")
            
            vectors.append({
                "name": display_name,
                "value": score
            })
            
        # Add basic project analysis object required by frontend contract
        project_analysis = {
            "complexity": min(100, len(skills) * 5),
            "scalability": min(100, len(skills) * 3)
        }
        
        return {
            "aspect_scores": vectors,
            "project_analysis": project_analysis
        }
