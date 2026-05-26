import { useState, useMemo } from 'react';

export function useProfileSimulator(originalResult) {
  const [upgrades, setUpgrades] = useState({
    kubernetes: false,
    aws: false,
    redis: false,
    cicd: false,
    quantifiedMetrics: false,
    distributedSystems: false
  });

  const toggleUpgrade = (id) => {
    setUpgrades(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const simulatedResult = useMemo(() => {
    if (!originalResult) return null;

    // Deep copy to avoid mutating original
    const sim = JSON.parse(JSON.stringify(originalResult));

    let atsBoost = 0;
    let trustBoost = 0;
    let complexityBoost = 0;
    let maturityBoost = 0;
    
    // Simulate Deterministic Additions
    if (upgrades.kubernetes) {
        atsBoost += 3;
        maturityBoost += 8;
        complexityBoost += 6;
        sim.aspect_scores.forEach(s => { if (s.name.includes("DevOps")) s.value = Math.min(100, s.value + 15); });
        sim.skills = [...(sim.skills || []), "Kubernetes"];
    }
    
    if (upgrades.aws) {
        atsBoost += 4;
        maturityBoost += 5;
        complexityBoost += 5;
        sim.aspect_scores.forEach(s => { if (s.name.includes("Cloud")) s.value = Math.min(100, s.value + 20); });
        sim.skills = [...(sim.skills || []), "AWS"];
    }
    
    if (upgrades.redis) {
        atsBoost += 2;
        maturityBoost += 4;
        complexityBoost += 5;
        sim.aspect_scores.forEach(s => { if (s.name.includes("Backend")) s.value = Math.min(100, s.value + 10); });
        sim.skills = [...(sim.skills || []), "Redis"];
    }
    
    if (upgrades.cicd) {
        atsBoost += 4;
        maturityBoost += 10;
        trustBoost += 5;
        sim.skills = [...(sim.skills || []), "CI/CD"];
    }
    
    if (upgrades.quantifiedMetrics) {
        trustBoost += 15;
        atsBoost += 2;
        if (sim.recruiter_insights && sim.recruiter_insights.concerns) {
            sim.recruiter_insights.concerns = sim.recruiter_insights.concerns.filter(c => !c.toLowerCase().includes("quantified"));
        }
        if (sim.recruiter_metrics) {
            sim.recruiter_metrics.explanations = [
                ...(sim.recruiter_metrics.explanations || []), 
                "Added highly quantified business impact metrics."
            ];
        }
    }
    
    if (upgrades.distributedSystems) {
        complexityBoost += 12;
        maturityBoost += 15;
        trustBoost += 5;
        sim.skills = [...(sim.skills || []), "Microservices", "Kafka"];
    }

    // Apply Boosts (Capped at 99 for realism unless truly 100)
    sim.ats_score = Math.min(99, (sim.ats_score || 0) + atsBoost);
    
    if (sim.recruiter_metrics) {
        sim.recruiter_metrics.recruiter_trust_score = Math.min(99, (sim.recruiter_metrics.recruiter_trust_score || 0) + trustBoost);
        sim.recruiter_metrics.interview_probability = Math.min(95, (sim.recruiter_metrics.interview_probability || 0) + Math.floor(trustBoost * 0.8));
    }
    
    if (sim.maturity_metrics) {
        sim.maturity_metrics.engineering_maturity_index = Math.min(99, (sim.maturity_metrics.engineering_maturity_index || 0) + maturityBoost);
        
        // Update level name based on new score
        if (sim.maturity_metrics.engineering_maturity_index >= 70) {
            sim.maturity_metrics.maturity_level = "Senior / Architectural";
        } else if (sim.maturity_metrics.engineering_maturity_index >= 35) {
            sim.maturity_metrics.maturity_level = "Mid-Level / Independent";
        }
    }
    
    if (sim.project_metrics) {
        sim.project_metrics.project_complexity_index = Math.min(99, (sim.project_metrics.project_complexity_index || 0) + complexityBoost);
        
        if (sim.project_metrics.project_complexity_index >= 75) {
            sim.project_metrics.complexity_tier = "Advanced (Distributed / Production-Grade)";
        } else if (sim.project_metrics.project_complexity_index >= 45) {
            sim.project_metrics.complexity_tier = "Intermediate (Full-Stack / Integrated)";
        }
    }

    // Recompute Benchmark Tier based on simulated changes
    if (sim.benchmark_metrics) {
        const overallScore = ((sim.ats_score || 0) + (sim.project_metrics?.project_complexity_index || 0) + (sim.maturity_metrics?.engineering_maturity_index || 0)) / 3;
        
        if (overallScore >= 85) {
            sim.benchmark_metrics.comparison = "Elite Leadership Tier";
            sim.benchmark_metrics.percentile = Math.max(90, Math.min(99, sim.benchmark_metrics.percentile + 10));
        } else if (overallScore >= 65) {
            sim.benchmark_metrics.comparison = "Highly Competitive";
            sim.benchmark_metrics.percentile = Math.max(70, Math.min(89, sim.benchmark_metrics.percentile + 8));
        } else if (overallScore >= 40) {
            sim.benchmark_metrics.comparison = "Intermediate Foundation";
            sim.benchmark_metrics.percentile = Math.max(40, Math.min(69, sim.benchmark_metrics.percentile + 5));
        } else {
            sim.benchmark_metrics.comparison = "Low ATS Readiness";
        }
    }

    return sim;
  }, [originalResult, upgrades]);

  return { upgrades, toggleUpgrade, simulatedResult };
}
