import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { RevealSection, LiquidGlassFooter } from "./HomeComponents";
import "./Home.css";

const PAPERS = [
  {
    title: "Deterministic Heuristic Matrices for Engineering Profile Evaluation",
    authors: "Pathora Research · 2025",
    abstract: "We present a deterministic scoring framework that replaces stochastic NLP-based resume parsers with reproducible heuristic matrices. Our approach achieves 99.8% consistency across repeated evaluations of identical profiles.",
    tags: ["Heuristics", "Scoring", "Reproducibility"],
    status: "Published"
  },
  {
    title: "Vector Scoring Across 5-Dimensional Engineering Maturity Space",
    authors: "Pathora Research · 2025",
    abstract: "This paper formalizes the 5-dimensional maturity radar used in Pathora's evaluation engine: architecture, deployment, testing, infrastructure, and communication. We demonstrate how weighted vector projection maps to recruiter decision patterns.",
    tags: ["Vector Spaces", "Maturity Mapping", "Evaluation"],
    status: "Published"
  },
  {
    title: "Recruiter Behavior Analysis: Automated Screening Decision Patterns",
    authors: "Pathora Research · 2026",
    abstract: "An empirical study of 12,000 recruiter screening decisions, identifying the 7 primary heuristic signals that determine whether an engineering profile advances past automated filters.",
    tags: ["Recruiter Trust", "Behavioral Analysis", "ATS"],
    status: "Preprint"
  },
  {
    title: "Deployment Signal Extraction from Unstructured Resume Data",
    authors: "Pathora Research · 2026",
    abstract: "We introduce a structured extraction pipeline that identifies production deployment evidence, CI/CD sophistication, and infrastructure scale indicators from natural language project descriptions.",
    tags: ["NLP", "Signal Extraction", "Infrastructure"],
    status: "In Review"
  },
  {
    title: "Engineering Maturity Benchmarking: A Cross-Industry Framework",
    authors: "Pathora Research · 2026",
    abstract: "A comprehensive benchmarking system that normalizes engineering maturity scores across 6 technology domains, enabling fair cross-domain comparison of technical capability.",
    tags: ["Benchmarking", "Cross-Domain", "Normalization"],
    status: "Draft"
  }
];

export default function Research() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="home-wrap">
      <div className="grid-bg" />

      {/* Hero */}
      <section className="hero-sec" style={{ paddingTop: "140px", paddingBottom: "80px", minHeight: "auto", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}
          style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: "60vw", height: "60vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(129, 140, 248, 0.06) 0%, transparent 60%)", filter: "blur(60px)", pointerEvents: "none", zIndex: 0 }}
        />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto" }}>
          <div className="hero-badge" style={{ margin: "0 auto 24px" }}>
            <span className="hero-badge-tag">RESEARCH PUBLICATIONS</span>
          </div>
          <h1 className="hero-h1" style={{ maxWidth: "100%", margin: "0 auto 24px" }}>
            Deterministic Engineering <em>Research.</em>
          </h1>
          <p className="hero-sub" style={{ margin: "0 auto 40px", maxWidth: 650 }}>
            Our methodology is transparent. Every heuristic model, scoring matrix, and evaluation pipeline is backed by published research and reproducible experimentation.
          </p>
        </motion.div>
      </section>

      {/* Papers */}
      <RevealSection className="sec" style={{ paddingTop: 0 }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {PAPERS.map((paper, i) => (
              <motion.div
                key={paper.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{
                  padding: "36px 40px", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(20px)",
                  borderRadius: 24, border: "1px solid rgba(0,0,0,0.06)",
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)", cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.02)"
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(129, 140, 248, 0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.02)"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--tm)" }}>{paper.authors}</div>
                  <div style={{
                    fontSize: 10, fontFamily: "var(--mono)", fontWeight: 600, letterSpacing: ".05em",
                    padding: "4px 10px", borderRadius: 100,
                    background: paper.status === "Published" ? "rgba(52, 211, 153, 0.1)" : "rgba(129, 140, 248, 0.1)",
                    color: paper.status === "Published" ? "var(--success)" : "var(--accent)"
                  }}>
                    {paper.status}
                  </div>
                </div>

                <h3 style={{ fontSize: 20, fontWeight: 600, color: "var(--tp)", marginBottom: 12, lineHeight: 1.3 }}>{paper.title}</h3>
                <p style={{ fontSize: 14, color: "var(--ts)", lineHeight: 1.7, marginBottom: 20 }}>{paper.abstract}</p>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {paper.tags.map(t => (
                    <span key={t} style={{
                      fontSize: 11, fontFamily: "var(--mono)", padding: "4px 10px",
                      background: "rgba(0,0,0,0.04)", borderRadius: 100, color: "var(--tm)", fontWeight: 500
                    }}>{t}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </RevealSection>

      <LiquidGlassFooter />
    </div>
  );
}
