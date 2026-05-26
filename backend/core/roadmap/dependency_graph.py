class DependencyGraph:
    """
    Deterministic DAG mapping skill progressions.
    """
    
    # Adjacency list: "skill": ["requires_this", "requires_this"]
    GRAPH = {
        "kubernetes": ["docker", "linux"],
        "docker": ["linux"],
        "aws": ["linux", "networking_basics"],
        "ci/cd": ["git", "bash", "linux"],
        "terraform": ["aws", "infrastructure_as_code"],
        "microservices": ["docker", "api_design"],
        "kafka": ["distributed_systems", "java/scala/python"],
        "react": ["javascript", "html", "css"],
        "pytorch": ["python", "linear_algebra", "calculus"],
        "llm_fine_tuning": ["pytorch", "transformers", "nlp"],
        "dbt": ["sql", "data_warehousing"],
        "snowflake": ["sql"],
        "ansible": ["linux", "bash", "ssh"]
    }
    
    @classmethod
    def get_prerequisites(cls, skill: str) -> list:
        return cls.GRAPH.get(skill.lower(), [])
        
    @classmethod
    def resolve_all_prerequisites(cls, target_skills: list) -> list:
        """
        Recursively resolves all prerequisites for a list of target skills.
        """
        resolved = set()
        
        def dfs(node):
            if node in resolved:
                return
            for prereq in cls.get_prerequisites(node):
                dfs(prereq)
            resolved.add(node)
            
        for skill in target_skills:
            dfs(skill.lower())
            
        return list(resolved)
