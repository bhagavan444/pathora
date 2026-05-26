import re
import spacy

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    # If not downloaded, download it
    import subprocess
    subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
    nlp = spacy.load("en_core_web_sm")

class EntityExtractor:
    """
    Uses NLP and Regex to extract specific entities from resume text.
    """
    
    COMMON_SKILLS = set([
        "python", "java", "c++", "c", "javascript", "typescript", "react", "angular", "vue",
        "node.js", "nodejs", "express", "django", "flask", "spring", "aws", "azure", "gcp",
        "docker", "kubernetes", "sql", "mysql", "postgresql", "mongodb", "redis", "html", "css",
        "git", "linux", "machine learning", "deep learning", "tensorflow", "pytorch", "pandas",
        "scikit-learn", "numpy", "power bi", "tableau", "excel", "agile", "scrum", "jira",
        "ci/cd", "jenkins", "github actions", "rest", "graphql", "go", "rust", "ruby"
    ])
    
    LEADERSHIP_VERBS = set([
        "managed", "led", "directed", "oversaw", "mentored", "coordinated", "spearheaded",
        "architected", "drove", "founded", "built"
    ])
    
    @staticmethod
    def extract_links(text: str) -> list:
        # Basic regex for URLs
        url_pattern = r'https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+'
        return list(set(re.findall(url_pattern, text)))
        
    @staticmethod
    def extract_skills(text: str) -> list:
        """
        Extracts known skills based on a predefined dictionary.
        A more advanced implementation could use a custom NER model.
        """
        text_lower = text.lower()
        extracted = []
        for skill in EntityExtractor.COMMON_SKILLS:
            # Word boundary regex to avoid partial matches
            if re.search(r'\b' + re.escape(skill) + r'\b', text_lower):
                extracted.append(skill.title() if len(skill) > 3 else skill.upper())
        return extracted
        
    @staticmethod
    def extract_metrics(text: str) -> list:
        """
        Finds sentences or clauses containing numbers, percentages, or dollar amounts.
        """
        doc = nlp(text)
        metrics = []
        for sent in doc.sents:
            sent_str = sent.text
            if re.search(r'\d+%|\$\d+|\d+x', sent_str) or any(ent.label_ in ["PERCENT", "MONEY", "CARDINAL"] for ent in sent.ents):
                metrics.append(sent_str.strip())
        return metrics

    @staticmethod
    def count_action_verbs(text: str) -> dict:
        """
        Counts occurrences of strong action verbs and leadership verbs.
        """
        doc = nlp(text)
        action_verbs = 0
        leadership_verbs = 0
        
        for token in doc:
            if token.pos_ == "VERB" and token.dep_ == "ROOT":
                action_verbs += 1
                if token.lemma_.lower() in EntityExtractor.LEADERSHIP_VERBS:
                    leadership_verbs += 1
                    
        return {
            "action_verbs": action_verbs,
            "leadership_verbs": leadership_verbs
        }
