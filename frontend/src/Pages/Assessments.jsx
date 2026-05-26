import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { RevealSection, LiquidGlassFooter } from "./HomeComponents";
import "./Home.css";

const ASSESSMENTS = [
  {
    title: "AI Engineering Assessment",
    desc: "Evaluates model architecture decisions, training pipeline maturity, and production inference deployment readiness.",
    complexity: "Advanced",
    duration: "45 min",
    vectors: 24,
    score: 92,
    color: "var(--accent)"
  },
  {
    title: "Backend Architecture Assessment",
    desc: "Measures API design quality, database schema maturity, caching strategies, and distributed systems understanding.",
    complexity: "Intermediate",
    duration: "35 min",
    vectors: 18,
    score: 88,
    color: "var(--accent2)"
  },
  {
    title: "DevOps Readiness Assessment",
    desc: "Analyzes CI/CD pipeline sophistication, infrastructure-as-code proficiency, and observability stack coverage.",
    complexity: "Advanced",
    duration: "40 min",
    vectors: 21,
    score: 85,
    color: "var(--success)"
  },
  {
    title: "System Design Intelligence",
    desc: "Tests capacity planning, fault tolerance modeling, and distributed architecture scaling decision frameworks.",
    complexity: "Expert",
    duration: "60 min",
    vectors: 32,
    score: 94,
    color: "#f59e0b"
  },
  {
    title: "Recruiter Heuristic Evaluation",
    desc: "Measures how effectively your profile communicates technical depth to automated screening systems and human reviewers.",
    complexity: "Baseline",
    duration: "20 min",
    vectors: 12,
    score: 78,
    color: "#818cf8"
  },
  {
    title: "Production Readiness Audit",
    desc: "Comprehensive evaluation of monitoring, alerting, SLO definition, incident response, and deployment rollback capabilities.",
    complexity: "Advanced",
    duration: "50 min",
    vectors: 28,
    score: 90,
    color: "#67e8f9"
  }
];

export default function Assessments() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="home-wrap">
      <div className="grid-bg" />

      {/* Hero */}
      <section className="hero-sec" style={{ paddingTop: "140px", paddingBottom: "60px", minHeight: "auto", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}
          style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: "60vw", height: "60vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(52, 211, 153, 0.06) 0%, transparent 60%)", filter: "blur(60px)", pointerEvents: "none", zIndex: 0 }}
        />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto" }}>
          <div className="hero-badge" style={{ margin: "0 auto 24px" }}>
            <span className="hero-badge-tag">EVALUATION SYSTEMS</span>
          </div>
          <h1 className="hero-h1" style={{ maxWidth: "100%", margin: "0 auto 24px" }}>
            Engineering Evaluation <em>Systems.</em>
          </h1>
          <p className="hero-sub" style={{ margin: "0 auto 40px", maxWidth: 650 }}>
            Six deterministic assessment engines designed to benchmark engineering maturity across architecture, deployment, and recruiter trust dimensions.
          </p>
        </motion.div>
      </section>

      {/* Assessment Grid */}
      <RevealSection className="sec" style={{ paddingTop: 0 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 24 }}>
            {ASSESSMENTS.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{
                  background: "rgba(255,255,255,0.7)", backdropFilter: "blur(20px)",
                  borderRadius: 24, padding: 32, border: "1px solid rgba(0,0,0,0.06)",
                  display: "flex", flexDirection: "column", cursor: "pointer",
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.02), inset 0 0 20px rgba(255,255,255,0.5)"
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.06)`; e.currentTarget.style.borderColor = a.color; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.02), inset 0 0 20px rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)"; }}
              >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: a.color, boxShadow: `0 0 12px ${a.color}`, marginTop: 4 }} />
                  <div style={{ fontSize: 10, fontFamily: "var(--mono)", padding: "4px 10px", background: "rgba(0,0,0,0.04)", borderRadius: 100, color: "var(--tm)", fontWeight: 600, letterSpacing: ".05em" }}>
                    {a.complexity}
                  </div>
                </div>

                <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--tp)", marginBottom: 10 }}>{a.title}</h3>
                <p style={{ fontSize: 13, color: "var(--ts)", lineHeight: 1.6, marginBottom: 24, flex: 1 }}>{a.desc}</p>

                {/* Telemetry Row */}
                <div style={{ display: "flex", gap: 0, borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 16 }}>
                  {[
                    { lbl: "Vectors", val: a.vectors },
                    { lbl: "Duration", val: a.duration },
                    { lbl: "Benchmark", val: `${a.score}%` }
                  ].map(m => (
                    <div key={m.lbl} style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "var(--tp)", marginBottom: 2 }}>{m.val}</div>
                      <div style={{ fontSize: 10, fontFamily: "var(--mono)", color: "var(--tm)", textTransform: "uppercase", letterSpacing: ".05em" }}>{m.lbl}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 60 }}>
            <button className="btn-glass-primary" onClick={() => navigate("/predict")} style={{ padding: "16px 40px" }}>
              Begin Evaluation Sequence
            </button>
          </div>
        </div>
      </RevealSection>

      <LiquidGlassFooter />
    </div>
  );
}
