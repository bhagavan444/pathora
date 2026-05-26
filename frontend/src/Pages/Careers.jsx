import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { RevealSection, LiquidGlassFooter } from "./HomeComponents";
import "./Home.css";

const ROLES = [
  {
    title: "Senior Platform Engineer",
    team: "Infrastructure",
    location: "Remote · Global",
    type: "Full-Time",
    desc: "Design and scale the distributed evaluation pipeline. You will own the orchestration layer that processes deterministic scoring across millions of engineering profiles.",
    tags: ["Kubernetes", "Go", "gRPC", "Terraform"]
  },
  {
    title: "AI Systems Engineer",
    team: "Intelligence",
    location: "Remote · Global",
    type: "Full-Time",
    desc: "Build and maintain the heuristic evaluation models that power recruiter trust mapping. Requires deep experience with deterministic ML pipelines and production inference.",
    tags: ["Python", "PyTorch", "FastAPI", "MLOps"]
  },
  {
    title: "Frontend Infrastructure Engineer",
    team: "Experience",
    location: "Remote · Global",
    type: "Full-Time",
    desc: "Architect the telemetry visualization layer and real-time evaluation dashboards. You will push the boundaries of cinematic engineering interfaces.",
    tags: ["React", "TypeScript", "WebGL", "D3.js"]
  },
  {
    title: "Research Scientist — NLP",
    team: "Research",
    location: "Remote · Global",
    type: "Full-Time",
    desc: "Advance our structured extraction models for resume parsing and semantic boundary detection. Publish findings and integrate them into the production pipeline.",
    tags: ["Transformers", "SpaCy", "BERT", "Research"]
  },
  {
    title: "Developer Experience Engineer",
    team: "Platform",
    location: "Remote · Global",
    type: "Contract",
    desc: "Design and maintain the public API surface, SDK tooling, and developer documentation. You will define how external systems integrate with Pathora's evaluation engine.",
    tags: ["Node.js", "OpenAPI", "SDK Design", "Technical Writing"]
  }
];

export default function Careers() {
  const navigate = useNavigate();

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
          style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: "70vw", height: "70vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(167, 139, 250, 0.06) 0%, transparent 60%)", filter: "blur(60px)", pointerEvents: "none", zIndex: 0 }}
        />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto" }}>
          <div className="hero-badge" style={{ margin: "0 auto 24px" }}>
            <span className="hero-badge-tag">JOIN THE NETWORK</span>
          </div>
          <h1 className="hero-h1" style={{ maxWidth: "100%", margin: "0 auto 24px" }}>
            Build Engineering <em>Intelligence.</em>
          </h1>
          <p className="hero-sub" style={{ margin: "0 auto 40px", maxWidth: 650 }}>
            We are assembling a team of infrastructure-obsessed engineers and researchers to redefine how technical talent is evaluated. No corporate theatrics. Just systems thinking at scale.
          </p>
        </motion.div>
      </section>

      {/* Culture */}
      <RevealSection className="sec" style={{ paddingTop: 0 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24, marginBottom: 80 }}>
            {[
              { title: "Infrastructure-First", desc: "We build distributed systems, not prototypes. Every decision is production-grade." },
              { title: "Deterministic Culture", desc: "No guesswork. We measure, test, and verify. Our evaluation is 100% reproducible." },
              { title: "Research-Driven", desc: "We publish our methodology and open-source our heuristic models." },
              { title: "Remote-Native", desc: "Distributed team, asynchronous communication, deep work blocks." }
            ].map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{ padding: 28, background: "rgba(255,255,255,0.6)", backdropFilter: "blur(20px)", borderRadius: 20, border: "1px solid rgba(0,0,0,0.06)" }}
              >
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--tp)", marginBottom: 10 }}>{v.title}</div>
                <div style={{ fontSize: 13, color: "var(--ts)", lineHeight: 1.6 }}>{v.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Open Roles */}
      <RevealSection className="sec" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="sec-head" style={{ textAlign: "center" }}>
            <div className="sec-tag" style={{ color: "var(--accent)" }}>OPEN POSITIONS</div>
            <h2 className="sec-title">Active Engineering Nodes</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {ROLES.map((role, i) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                style={{
                  padding: "28px 32px", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(20px)",
                  borderRadius: 20, border: "1px solid rgba(0,0,0,0.06)",
                  cursor: "pointer", transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.02)"
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(129, 140, 248, 0.08)"; e.currentTarget.style.borderColor = "rgba(129, 140, 248, 0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.02)"; e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--tp)", marginBottom: 4 }}>{role.title}</h3>
                    <div style={{ display: "flex", gap: 16, fontSize: 12, fontFamily: "var(--mono)", color: "var(--tm)" }}>
                      <span>{role.team}</span>
                      <span>•</span>
                      <span>{role.location}</span>
                      <span>•</span>
                      <span>{role.type}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 18, color: "var(--accent)", transition: "transform 0.3s" }}>→</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--ts)", lineHeight: 1.6, marginBottom: 16 }}>{role.desc}</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {role.tags.map(t => (
                    <span key={t} style={{ fontSize: 11, fontFamily: "var(--mono)", padding: "4px 10px", background: "rgba(129, 140, 248, 0.08)", color: "var(--accent)", borderRadius: 100, fontWeight: 500 }}>{t}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 48 }}>
            <p style={{ fontSize: 13, color: "var(--tm)", fontFamily: "var(--mono)", marginBottom: 16 }}>
              Don't see your role? We are always looking for exceptional engineers.
            </p>
            <button className="btn-glass-outline" onClick={() => navigate("/contact")}>
              Open Application → Contact Node
            </button>
          </div>
        </div>
      </RevealSection>

      <LiquidGlassFooter />
    </div>
  );
}
