import re

class DocumentParser:
    """
    Parses raw resume text into structured sections.
    """
    
    SECTION_HEADERS = [
        "education", "experience", "work experience", "employment history",
        "projects", "skills", "technical skills", "certifications", 
        "achievements", "summary", "profile", "objective",
        "publications", "research", "volunteer"
    ]
    
    @staticmethod
    def parse_sections(raw_text: str) -> dict:
        """
        Segments raw text into a dictionary of sections.
        """
        lines = raw_text.split('\n')
        sections = {
            "profile": [],
            "education": [],
            "experience": [],
            "projects": [],
            "skills": [],
            "certifications": [],
            "achievements": [],
            "research": [],
            "misc": []
        }
        
        current_section = "profile" # Default starting section
        
        for line in lines:
            line_clean = line.strip()
            if not line_clean:
                continue
                
            # Check if line is a header
            # Typical headers are short, uppercase or title case, and match our list
            if len(line_clean) < 40:
                lower_line = line_clean.lower()
                # Remove punctuation for matching
                clean_lower = re.sub(r'[^\w\s]', '', lower_line)
                
                matched_header = None
                for header in DocumentParser.SECTION_HEADERS:
                    if header == clean_lower or clean_lower.startswith(header + " "):
                        matched_header = header
                        break
                        
                if matched_header:
                    # Map header to canonical section
                    if matched_header in ["work experience", "employment history"]:
                        current_section = "experience"
                    elif matched_header in ["technical skills"]:
                        current_section = "skills"
                    elif matched_header in ["objective", "summary"]:
                        current_section = "profile"
                    elif matched_header in ["publications"]:
                        current_section = "research"
                    elif matched_header in sections:
                        current_section = matched_header
                    else:
                        current_section = "misc"
                    continue # Skip adding the header itself to the content
            
            sections[current_section].append(line_clean)
            
        # Join lines back to strings
        for key in sections:
            sections[key] = '\n'.join(sections[key])
            
        return sections
