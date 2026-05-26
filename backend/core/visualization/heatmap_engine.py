class HeatmapEngine:
    """
    Computes visual attention scores for resume sections based on their "impact density".
    """
    
    @staticmethod
    def generate_heatmap(sections: dict, metrics: list, verb_counts: dict) -> dict:
        heatmap = {}
        
        # Simple heuristic: which sections command the most attention?
        # Typically, "Experience" and "Projects" are high value, IF they have metrics.
        # "Summary" is high value if concise, low if rambling.
        
        # We will assign an "attention_score" 0-100 to each section.
        for section_name, content in sections.items():
            if not content.strip():
                continue
                
            length = len(content)
            
            # Count metrics inside this specific section
            section_metrics = sum(1 for m in metrics if m in content)
            
            # Calculate density
            if length > 0:
                metric_density = (section_metrics / length) * 1000 # scaling factor
            else:
                metric_density = 0
                
            base_attention = 30 # Default baseline
            
            if section_name in ["experience", "projects"]:
                base_attention = 50
                base_attention += (section_metrics * 15) # Heavy reward for metrics here
            elif section_name == "skills":
                base_attention = 60 # Always highly scanned
            elif section_name == "education":
                base_attention = 40
            
            # Cap at 100
            attention = min(100, int(base_attention))
            
            heatmap[section_name] = {
                "attention_score": attention,
                "length": length,
                "metrics_found": section_metrics
            }
            
        # Find strongest and weakest
        if heatmap:
            strongest = max(heatmap.items(), key=lambda x: x[1]["attention_score"])[0]
            weakest = min(heatmap.items(), key=lambda x: x[1]["attention_score"])[0]
        else:
            strongest = None
            weakest = None
            
        return {
            "section_weights": heatmap,
            "strongest_section": strongest,
            "weakest_section": weakest
        }
