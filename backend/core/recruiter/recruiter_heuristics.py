import re

class RecruiterHeuristics:
    """
    Static heuristics for simulating recruiter psychological responses to a resume.
    """
    
    NEGATIVE_SIGNALS = [
        r"\bpassionate\b", r"\bsynergy\b", r"\bhard worker\b", r"\bthought leader\b",
        r"\bdriven\b", r"\bperfectionist\b", r"\bguru\b", r"\bninja\b", r"\brockstar\b"
    ]
    
    POSITIVE_SIGNALS = [
        r"\barchitected\b", r"\bdeployed\b", r"\bscaled\b", r"\boptimized\b", 
        r"\bmentored\b", r"\bowned\b", r"\bdelivered\b", r"\bdesigned\b",
        r"\bproduction\b", r"\breduced\b", r"\bincreased\b", r"\baccelerated\b"
    ]
    
    @staticmethod
    def count_buzzwords(text: str) -> int:
        count = 0
        text_lower = text.lower()
        for word in RecruiterHeuristics.NEGATIVE_SIGNALS:
            if re.search(word, text_lower):
                count += 1
        return count

    @staticmethod
    def count_strong_verbs(text: str) -> int:
        count = 0
        text_lower = text.lower()
        for word in RecruiterHeuristics.POSITIVE_SIGNALS:
            if re.search(word, text_lower):
                count += 1
        return count
