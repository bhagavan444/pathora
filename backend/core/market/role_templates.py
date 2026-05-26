class RoleTemplates:
    """
    Deterministic benchmarking templates for domain-aware scoring.
    """
    TEMPLATES = {
        "software_engineer": {
            "type": "TECH",
            "core_skills": ["python", "java", "c++", "javascript", "golang", "react", "node"],
            "infrastructure_skills": ["docker", "kubernetes", "aws", "gcp", "azure", "ci/cd", "linux"],
            "architecture_signals": ["microservices", "scalable", "distributed", "api", "system design"],
            "maturity_signals": ["architected", "deployed", "optimized", "led", "mentored"],
            "ats_weights": {"skills": 0.3, "metrics": 0.4, "verbs": 0.3},
            "penalize_tutorial_smells": True,
            "requires_deployment": True
        },
        "aiml_engineer": {
            "type": "TECH",
            "core_skills": ["python", "pytorch", "tensorflow", "scikit-learn", "nlp", "llm", "transformers"],
            "infrastructure_skills": ["cuda", "mlflow", "aws sagemaker", "docker", "ray"],
            "architecture_signals": ["pipeline", "fine-tuning", "inference", "training", "rag"],
            "maturity_signals": ["deployed model", "improved accuracy", "latency reduction", "dataset"],
            "ats_weights": {"skills": 0.4, "metrics": 0.4, "verbs": 0.2},
            "penalize_tutorial_smells": True,
            "requires_deployment": True
        },
        "data_analyst": {
            "type": "TECH",
            "core_skills": ["sql", "python", "r", "tableau", "power bi", "excel", "pandas"],
            "infrastructure_skills": ["snowflake", "bigquery", "redshift", "dbt"],
            "architecture_signals": ["dashboard", "etl", "data warehouse", "reporting"],
            "maturity_signals": ["stakeholders", "insights", "revenue", "conversion"],
            "ats_weights": {"skills": 0.3, "metrics": 0.5, "verbs": 0.2},
            "penalize_tutorial_smells": False,
            "requires_deployment": False
        },
        "devops_engineer": {
            "type": "TECH",
            "core_skills": ["linux", "bash", "python", "terraform", "ansible", "kubernetes", "docker"],
            "infrastructure_skills": ["aws", "gcp", "azure", "jenkins", "gitlab ci", "argocd", "prometheus", "grafana"],
            "architecture_signals": ["infrastructure as code", "high availability", "load balancing", "failover"],
            "maturity_signals": ["uptime", "automation", "reduced deployment time", "incident response"],
            "ats_weights": {"skills": 0.5, "metrics": 0.3, "verbs": 0.2},
            "penalize_tutorial_smells": True,
            "requires_deployment": True
        },
        "cybersecurity": {
            "type": "TECH",
            "core_skills": ["linux", "python", "bash", "wireshark", "nmap", "metasploit", "siem"],
            "infrastructure_skills": ["firewalls", "ids/ips", "splunk", "aws security", "iam"],
            "architecture_signals": ["penetration testing", "vulnerability assessment", "incident response", "compliance"],
            "maturity_signals": ["mitigated", "secured", "audited", "compliance (soc2/iso)"],
            "ats_weights": {"skills": 0.4, "metrics": 0.3, "verbs": 0.3},
            "penalize_tutorial_smells": False,
            "requires_deployment": False
        },
        "mechanical_engineer": {
            "type": "CORE_ENG",
            "core_skills": ["solidworks", "autocad", "ansys", "matlab", "thermodynamics", "manufacturing"],
            "infrastructure_skills": ["cnc", "3d printing", "plc", "scada"],
            "architecture_signals": ["cad design", "finite element analysis", "prototyping"],
            "maturity_signals": ["patented", "manufactured", "cost reduction", "efficiency"],
            "ats_weights": {"skills": 0.3, "metrics": 0.4, "verbs": 0.3},
            "penalize_tutorial_smells": False,
            "requires_deployment": False
        },
        "mba_business": {
            "type": "NON_TECH",
            "core_skills": ["strategy", "agile", "scrum", "financial modeling", "market research", "p&l", "excel"],
            "infrastructure_skills": ["jira", "salesforce", "sap", "tableau"],
            "architecture_signals": ["go-to-market", "product roadmap", "cross-functional", "stakeholder management"],
            "maturity_signals": ["revenue growth", "cost savings", "market share", "led cross-functional team"],
            "ats_weights": {"skills": 0.2, "metrics": 0.6, "verbs": 0.2},
            "penalize_tutorial_smells": False,
            "requires_deployment": False
        },
        "generic": {
            "type": "GENERAL",
            "core_skills": [],
            "infrastructure_skills": [],
            "architecture_signals": [],
            "maturity_signals": [],
            "ats_weights": {"skills": 0.33, "metrics": 0.34, "verbs": 0.33},
            "penalize_tutorial_smells": False,
            "requires_deployment": False
        }
    }
    
    @classmethod
    def get_template(cls, role_key: str):
        return cls.TEMPLATES.get(role_key, cls.TEMPLATES["generic"])
