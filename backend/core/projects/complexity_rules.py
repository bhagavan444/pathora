import re

class ComplexityRules:
    """
    Static heuristics for project complexity, penalized smells, and architecture signals.
    """
    
    TUTORIAL_SMELLS = [
        r"\btodo app\b", r"\bcalculator\b", r"\btic tac toe\b", r"\bweather app\b",
        r"\bweather clone\b", r"\bnetflix clone\b", r"\bspotify clone\b",
        r"\bdeveloped a website\b", r"\bbasic crud\b", r"\bdemo\b", r"\bportfolio\b"
    ]
    
    ARCHITECTURE_SIGNALS = {
        "deployment": ["aws", "azure", "gcp", "docker", "kubernetes", "heroku", "vercel", "netlify", "ecs", "ec2", "s3", "lambda"],
        "databases": ["postgresql", "mysql", "mongodb", "redis", "dynamodb", "cassandra", "elastic"],
        "orchestration": ["kafka", "rabbitmq", "celery", "graphql", "grpc", "microservices"],
        "telemetry": ["datadog", "new relic", "prometheus", "grafana", "elk", "sentry"],
        "auth": ["jwt", "oauth", "auth0", "cognito", "rbac", "sso"],
        "ci_cd": ["jenkins", "github actions", "gitlab ci", "circleci", "travis"]
    }
    
    @staticmethod
    def count_tutorial_smells(text: str) -> int:
        count = 0
        text_lower = text.lower()
        for smell in ComplexityRules.TUTORIAL_SMELLS:
            if re.search(smell, text_lower):
                count += 1
        return count
        
    @staticmethod
    def extract_architecture_signals(skills: list, raw_text: str) -> dict:
        """
        Categorizes skills and text mentions into architectural layers.
        """
        found = {
            "deployment": [],
            "databases": [],
            "orchestration": [],
            "telemetry": [],
            "auth": [],
            "ci_cd": []
        }
        
        combined_text = (raw_text + " " + " ".join(skills)).lower()
        
        for category, signals in ComplexityRules.ARCHITECTURE_SIGNALS.items():
            for sig in signals:
                if re.search(r'\b' + re.escape(sig) + r'\b', combined_text):
                    if sig not in found[category]:
                        found[category].append(sig)
                        
        return found
