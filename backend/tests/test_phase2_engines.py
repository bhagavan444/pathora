import sys
import os
import json

# Ensure backend root is in path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.ingestion.document_parser import DocumentParser
from core.ingestion.entity_extractor import EntityExtractor
from core.projects.project_analyzer import ProjectAnalyzer
from core.recruiter.trust_engine import TrustEngine
from core.genome.maturity_engine import MaturityEngine
from core.visualization.heatmap_engine import HeatmapEngine

# ----------------- CALIBRATION TEST CASES -----------------

RESUME_BEGINNER_CRUD = """
Jane Doe
jane.doe@email.com | github.com/janedoe

Summary
I am a passionate hard worker who developed a website using HTML and CSS. I am a ninja looking for an entry level job.

Skills
HTML, CSS, JavaScript, React, Python

Projects
Todo App
Developed a website todo app to track tasks using React.

Calculator
Basic calculator app using JavaScript.
"""

RESUME_INTERMEDIATE_MERN = """
John Smith
jsmith@email.com | github.com/jsmith | linkedin.com/in/jsmith

Summary
Software developer with 2 years of experience building web applications.

Skills
JavaScript, Node.js, Express, React, MongoDB, HTML, CSS, Git, Heroku

Projects
E-Commerce Store
Built an online store using React and Node.js.
Implemented authentication using JWT.
Stored data in MongoDB and deployed on Heroku.

Experience
Junior Developer at WebCorp
- Built frontend features in React.
- Fixed 20 bugs.
"""

RESUME_ADVANCED_DISTRIBUTED = """
Alex Chen
achen@email.com | github.com/achen | linkedin.com/in/achen | portfolio.dev

Summary
Backend Systems Engineer with 5 years of experience architecting scalable distributed systems.

Skills
Python, Go, Docker, Kubernetes, AWS, PostgreSQL, Redis, Kafka, Prometheus, CI/CD, React

Experience
Senior Engineer at CloudScale
- Architected a highly available microservices backend using Go and Docker.
- Deployed services to AWS Kubernetes clusters via GitHub Actions CI/CD pipelines.
- Implemented event-driven architecture using Kafka, scaling to handle 10,000 req/sec.
- Optimized PostgreSQL queries, reducing latency by 45%.
- Set up system telemetry with Prometheus and Grafana for monitoring.
- Mentored 4 junior engineers on production readiness.
"""

def run_test(name, text):
    print(f"\n==============================================")
    print(f"RUNNING CALIBRATION TEST: {name}")
    print(f"==============================================\n")
    
    sections = DocumentParser.parse_sections(text)
    skills = EntityExtractor.extract_skills(text)
    metrics = EntityExtractor.extract_metrics(text)
    verbs = EntityExtractor.count_action_verbs(text)
    links = EntityExtractor.extract_links(text)
    
    project_metrics = ProjectAnalyzer.compute_complexity(sections, skills)
    rec_metrics = TrustEngine.compute_trust(sections, metrics, links)
    maturity_metrics = MaturityEngine.compute_maturity(project_metrics["architecture_signals"], project_metrics["project_complexity_index"])
    heatmap = HeatmapEngine.generate_heatmap(sections, metrics, verbs)
    
    print("1. PROJECT COMPLEXITY ENGINE")
    print(f"Tier: {project_metrics['complexity_tier']}")
    print(f"Complexity Index: {project_metrics['project_complexity_index']}/100")
    print(f"Production Readiness: {project_metrics['production_readiness_score']}/100")
    print(f"Tutorial Smells Detected: {project_metrics['tutorial_smells_detected']}")
    
    print("\n2. RECRUITER TRUST ENGINE")
    print(f"Trust Score: {rec_metrics['recruiter_trust_score']}/100")
    print(f"Interview Prob: {rec_metrics['interview_probability']}%")
    print(f"Standout Factor: {rec_metrics['standout_factor']}")
    print(f"Buzzword Penalty: -{rec_metrics['buzzword_penalty']}")
    
    print("\n3. ENGINEERING MATURITY ENGINE")
    print(f"Maturity Level: {maturity_metrics['maturity_level']}")
    print(f"Maturity Index: {maturity_metrics['engineering_maturity_index']}/100")
    print(f"Systems Thinking: {maturity_metrics['systems_thinking_score']}/100")
    print(f"Infrastructure: {maturity_metrics['infrastructure_readiness']}/100")
    
    print("\n4. HEATMAP ATTENTION ENGINE")
    print(f"Strongest Section: {heatmap['strongest_section']}")
    print(f"Weakest Section: {heatmap['weakest_section']}")

if __name__ == "__main__":
    run_test("BEGINNER (CRUD)", RESUME_BEGINNER_CRUD)
    run_test("INTERMEDIATE (MERN)", RESUME_INTERMEDIATE_MERN)
    run_test("ADVANCED (DISTRIBUTED)", RESUME_ADVANCED_DISTRIBUTED)
