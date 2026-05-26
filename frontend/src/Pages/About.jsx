import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { RevealSection, LiquidGlassFooter } from "./HomeComponents";
import "./Home.css";

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="home-wrap">
      <div className="grid-bg" />

      {/* Hero */}
      <section className="hero-sec" style={{ paddingTop: "140px", paddingBottom: "100px", minHeight: "auto", textAlign: "center" }}>
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}
          style={{ position:"absolute",top:"10%",left:"50%",transform:"translateX(-50%)",width:"70vw",height:"70vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(129, 140, 248, 0.08) 0%,transparent 60%)", filter: "blur(60px)", pointerEvents:"none", zIndex: 0 }} 
        />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto" }}>
          <div className="hero-badge" style={{ margin: "0 auto 24px" }}>
            <span className="hero-badge-tag">INFRASTRUCTURE PHILOSOPHY</span>
          </div>
          <h1 className="hero-h1" style={{ maxWidth: "100%", margin: "0 auto 24px", letterSpacing: "-0.04em" }}>
            Engineering Intelligence <em>Infrastructure.</em>
          </h1>
          <p className="hero-sub" style={{ margin: "0 auto 40px", maxWidth: 650 }}>
            We believe that technical evaluation requires deterministic systems, not stochastic guesses. Pathora is the operating system for engineering maturity analysis.
          </p>
        </motion.div>
      </section>

      {/* Mission & Problem */}
      <RevealSection className="sec" style={{ paddingTop: 0 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", flexDirection: "column", gap: 80 }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 40 }}>
            <div>
              <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--accent)", letterSpacing: ".1em", marginBottom: 16 }}>THE PROBLEM</div>
              <h3 style={{ fontSize: 24, fontWeight: 600, color: "var(--tp)", marginBottom: 16 }}>Traditional ATS Systems Are Broken</h3>
              <p style={{ fontSize: 14, color: "var(--ts)", lineHeight: 1.7 }}>
                Current hiring infrastructure relies on superficial keyword matching or stochastic AI models that hallucinate technical competencies. They fail to understand distributed systems, architectural decisions, or true production readiness. Engineering talent is evaluated by algorithms that cannot write a single line of code.
              </p>
            </div>
            <div>
              <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--success)", letterSpacing: ".1em", marginBottom: 16 }}>THE METHODOLOGY</div>
              <h3 style={{ fontSize: 24, fontWeight: 600, color: "var(--tp)", marginBottom: 16 }}>Deterministic Evaluation</h3>
              <p style={{ fontSize: 14, color: "var(--ts)", lineHeight: 1.7 }}>
                Pathora uses a strict heuristic matrix to extract actual deployment signals, cross-referencing them against global engineering baselines. We map frontend, backend, and infrastructure capabilities predictably—generating a recruiter trust score that is 100% mathematically traceable.
              </p>
            </div>
          </div>

          <div style={{ padding: "60px", background: "rgba(255,255,255,0.6)", backdropFilter: "blur(20px)", borderRadius: 24, border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
            <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--tm)", letterSpacing: ".1em", marginBottom: 16, textAlign: "center" }}>ARCHITECTURE OVERVIEW</div>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: "var(--tp)", marginBottom: 40, textAlign: "center", letterSpacing: "-0.02em" }}>The Pathora Intelligence Engine</h2>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
              {[
                { title: "Vector Scoring", desc: "Maps engineering history onto a 5-dimensional maturity radar." },
                { title: "Heuristic Matrices", desc: "Calculates impact density and production readiness signals." },
                { title: "Recruiter Trust", desc: "Translates complex architecture into actionable screening metrics." }
              ].map(item => (
                <div key={item.title} style={{ padding: 24, background: "#fff", borderRadius: 16, border: "1px solid rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--tp)", marginBottom: 12 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: "var(--ts)", lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </RevealSection>

      {/* Stats */}
      <RevealSection className="sec" style={{ borderTop: "1px solid rgba(0,0,0,0.06)", background: "radial-gradient(circle at 50% 100%, rgba(129, 140, 248, 0.05) 0%, transparent 60%)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--accent)", letterSpacing: ".1em", marginBottom: 16 }}>INFRASTRUCTURE METRICS</div>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: "var(--tp)", marginBottom: 60, letterSpacing: "-0.02em" }}>Built for Scale</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {[
              { val: "42ms", lbl: "Avg Latency" },
              { val: "99.9%", lbl: "Accuracy" },
              { val: "1.2M", lbl: "Vectors" },
              { val: "Zero", lbl: "Hallucinations" }
            ].map(s => (
              <div key={s.lbl}>
                <div style={{ fontSize: 36, fontWeight: 700, color: "var(--tp)", marginBottom: 8, fontFamily: "var(--sans)" }}>{s.val}</div>
                <div style={{ fontSize: 12, color: "var(--tm)", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: ".05em" }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      <LiquidGlassFooter />
    </div>
  );
}