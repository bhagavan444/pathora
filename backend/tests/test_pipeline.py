import sys
import os

# Ensure backend root is in path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.ingestion.document_parser import DocumentParser
from core.ingestion.entity_extractor import EntityExtractor
from core.ats.scoring_engine import ATSScoringEngine
from core.genome.vector_calculator import VectorCalculator

sample_resume = """
John Doe
johndoe@example.com | https://github.com/johndoe

Summary
Passionate Full Stack Engineer with 4 years of experience building scalable applications.

Education
B.Tech in Computer Science, University of Tech
Graduated 2022

Technical Skills
Python, Java, React, Docker, AWS, PostgreSQL, HTML, CSS, JavaScript, Node.js

Experience
Software Engineer at TechCorp
- Architected a microservices backend in Python and Flask.
- Improved database performance by 40% leading to $50,000 cost savings.
- Led a team of 3 developers to deliver the project on time.

Projects
E-commerce Platform
Built a full-stack platform using React, Node.js, and MongoDB.
Deployed on AWS ECS using Docker.
"""

def test_pipeline():
    print("--- 1. Document Parsing ---")
    sections = DocumentParser.parse_sections(sample_resume)
    print(f"Parsed sections: {list(sections.keys())}")
    print(f"Skills section length: {len(sections['skills'])} chars")
    
    print("\n--- 2. Entity Extraction ---")
    skills = EntityExtractor.extract_skills(sample_resume)
    metrics = EntityExtractor.extract_metrics(sample_resume)
    verbs = EntityExtractor.count_action_verbs(sample_resume)
    print(f"Skills ({len(skills)}): {skills}")
    print(f"Metrics ({len(metrics)}): {metrics}")
    print(f"Verb Counts: {verbs}")
    
    print("\n--- 3. ATS Scoring ---")
    ats = ATSScoringEngine.compute_score(sections, skills, metrics, verbs)
    print(f"ATS Score: {ats['ats_score']}")
    print(f"Breakdown: {ats['breakdown']}")
    
    print("\n--- 4. Engineering Genome ---")
    vectors = VectorCalculator.compute_vectors(skills)
    print(f"Vectors: {vectors['aspect_scores']}")
    print(f"Project Analysis: {vectors['project_analysis']}")
    
    print("\nPipeline Test Completed Successfully!")

if __name__ == "__main__":
    test_pipeline()
