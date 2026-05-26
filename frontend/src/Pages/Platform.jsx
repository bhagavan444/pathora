import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { RevealSection, LiquidGlassFooter } from "./HomeComponents";
import "./Home.css";

export default function Platform() {
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
          style={{ position:"absolute",top:"10%",left:"50%",transform:"translateX(-50%)",width:"70vw",height:"70vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(52, 211, 153, 0.05) 0%,transparent 60%)", filter: "blur(60px)", pointerEvents:"none", zIndex: 0 }} 
        />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto" }}>
          <div className="hero-badge" style={{ margin: "0 auto 24px" }}>
            <span className="hero-badge-tag">SYSTEM ARCHITECTURE</span>
          </div>
          <h1 className="hero-h1" style={{ maxWidth: "100%", margin: "0 auto 24px" }}>
            Engineering Intelligence <em>Operating System.</em>
          </h1>
          <p className="hero-sub" style={{ margin: "0 auto 40px", maxWidth: 650 }}>
            Pathora is not a resume parser. It is a distributed deterministic scoring engine designed to orchestrate telemetry from raw profile data, mapping it directly into recruiter trust heuristics.
          </p>
        </motion.div>
      </section>

      {/* Architecture Graphic */}
      <RevealSection className="sec" style={{ paddingTop: 0 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ 
            background: "rgba(5, 8, 22, 0.9)", backdropFilter: "blur(24px)", borderRadius: 24, padding: "60px", 
            border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 40px 100px rgba(0,0,0,0.3)",
            display: "flex", flexDirection: "column", gap: 60, position: "relative", overflow: "hidden"
          }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
            
            {/* Orchestration Layer */}
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--accent)", letterSpacing: ".1em", marginBottom: 16 }}>LAYER 01 : DATA INGESTION</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
                {["PDF Structured Parsing", "Semantic Boundary Map", "Metadata Extraction"].map(t => (
                  <div key={t} style={{ background: "rgba(255,255,255,0.05)", padding: 24, borderRadius: 16, border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 14, fontWeight: 600 }}>
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Deterministic Pipeline */}
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--success)", letterSpacing: ".1em", marginBottom: 16 }}>LAYER 02 : DETERMINISTIC ENGINES</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
                {["NLP Entity Resolution", "ATS Heuristic Scoring", "Recruiter Trust Mapping", "Deployment Signal Analysis"].map((t, i) => (
                  <div key={t} style={{ background: "rgba(52, 211, 153, 0.05)", padding: 24, borderRadius: 16, border: "1px solid rgba(52, 211, 153, 0.2)", color: "#fff", fontSize: 14, fontWeight: 600 }}>
                    <div style={{ fontSize: 10, fontFamily: "var(--mono)", color: "var(--success)", marginBottom: 8 }}>ENGINE 0{i+1}</div>
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Output */}
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--accent2)", letterSpacing: ".1em", marginBottom: 16 }}>LAYER 03 : TELEMETRY ORCHESTRATION</div>
              <div style={{ background: "linear-gradient(135deg, rgba(167, 139, 250, 0.1), rgba(129, 140, 248, 0.1))", padding: 32, borderRadius: 16, border: "1px solid rgba(167, 139, 250, 0.3)", color: "#fff", textAlign: "center" }}>
                <h3 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12 }}>Deterministic Evaluation Payload</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", maxWidth: 500, margin: "0 auto" }}>The finalized JSON telemetry object containing perfectly weighted recruiter heuristic scores and actionable skill gap recommendations.</p>
              </div>
            </div>

          </div>
        </div>
      </RevealSection>

      <LiquidGlassFooter />
    </div>
  );
}
