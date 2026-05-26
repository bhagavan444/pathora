import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from core.market.domain_router import DomainRouter
from core.market.benchmark_engine import BenchmarkEngine
from core.ats.scoring_engine import ATSScoringEngine
from core.projects.project_analyzer import ProjectAnalyzer
from core.genome.maturity_engine import MaturityEngine
import json

def run_tests():
    print("--- Running Domain Intelligence Tests ---")
    
    # 1. Test Domain Routing
    print("\n[1] Testing Domain Router")
    assert DomainRouter.route_domain("Full Stack Developer") == "software_engineer"
    assert DomainRouter.route_domain("Product Manager") == "mba_business"
    assert DomainRouter.route_domain("Machine Learning Researcher") == "aiml_engineer"
    print("Domain Routing: PASSED")
    
    # 2. Test Non-Tech Penalty Bypassing
    print("\n[2] Testing MBA Business Profile (Non-Tech)")
    mba_domain = "mba_business"
    mba_skills = ["strategy", "agile", "excel", "financial modeling", "scrum"]
    mba_sections = {"projects": "Created financial models that increased revenue by 20%."}
    
    mba_proj = ProjectAnalyzer.compute_complexity(mba_sections, mba_skills, mba_domain)
    # MBA should NOT be penalized for lacking orchestration or deployment
    assert "N/A" in mba_proj["complexity_tier"]
    
    mba_maturity = MaturityEngine.compute_maturity({"databases":[],"deployment":[],"orchestration":[],"telemetry":[],"ci_cd":[]}, mba_proj["project_complexity_index"], mba_domain)
    assert mba_maturity["maturity_level"] == "N/A (Business/Strategy Focus)"
    print("MBA Evaluation: PASSED")
    
    # 3. Test Tech Profile Evaluation
    print("\n[3] Testing Software Engineering Profile (Tech)")
    tech_domain = "software_engineer"
    tech_skills = ["python", "react", "docker", "kubernetes", "aws", "postgresql"]
    tech_sections = {"projects": "Built a scalable microservices backend. Deployed to AWS with CI/CD and Docker. Managed postgresql database."}
    
    tech_proj = ProjectAnalyzer.compute_complexity(tech_sections, tech_skills, tech_domain)
    assert tech_proj["complexity_tier"] == "Advanced (Distributed / Production-Grade)"
    
    tech_maturity = MaturityEngine.compute_maturity(tech_proj["architecture_signals"], tech_proj["project_complexity_index"], tech_domain)
    assert "Senior" in tech_maturity["maturity_level"] or "Mid-Level" in tech_maturity["maturity_level"]
    print("Tech Evaluation: PASSED")
    
    # 4. Test Benchmark Engine
    print("\n[4] Testing Benchmark Engine")
    bench = BenchmarkEngine.compute_market_percentile(tech_domain, 80, tech_proj["project_complexity_index"], tech_maturity["engineering_maturity_index"], 5)
    print(f"Tech Benchmark: {json.dumps(bench, indent=2)}")
    assert bench["percentile"] > 80
    print("Benchmark Engine: PASSED")
    
    print("\n--- All Tests Passed ---")

if __name__ == "__main__":
    run_tests()
