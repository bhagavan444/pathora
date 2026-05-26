import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RevealSection, LiquidGlassFooter } from "./HomeComponents";
import "./Home.css";

const TAGS = ["All", "Infrastructure", "CI/CD", "Architecture", "Cloud", "ATS", "DevOps"];

const ITEMS = [
  { title: "Distributed Resume Parsing at Scale", tag: "Infrastructure", type: "Playbook", reads: "2.4k", time: "12 min" },
  { title: "ATS Keyword Density Optimization Guide", tag: "ATS", type: "Guide", reads: "5.1k", time: "8 min" },
  { title: "Kubernetes Readiness Checklist for Engineers", tag: "DevOps", type: "Checklist", reads: "3.8k", time: "6 min" },
  { title: "Building Production CI/CD Pipelines", tag: "CI/CD", type: "Playbook", reads: "4.2k", time: "15 min" },
  { title: "System Design Interview Architecture Patterns", tag: "Architecture", type: "Guide", reads: "7.3k", time: "20 min" },
  { title: "Cloud Cost Optimization for Startups", tag: "Cloud", type: "Article", reads: "1.9k", time: "10 min" },
  { title: "Microservices vs Monolith Decision Framework", tag: "Architecture", type: "Framework", reads: "6.1k", time: "14 min" },
  { title: "Terraform Infrastructure-as-Code Patterns", tag: "DevOps", type: "Playbook", reads: "2.7k", time: "11 min" },
  { title: "Engineering Resume Quantification Methodology", tag: "ATS", type: "Research", reads: "3.4k", time: "9 min" },
];

export default function Resources() {
  const [activeTag, setActiveTag] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filtered = ITEMS.filter(item => {
    const matchTag = activeTag === "All" || item.tag === activeTag;
    const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase());
    return matchTag && matchSearch;
  });

  return (
    <div className="home-wrap">
      <div className="grid-bg" />

      {/* Hero */}
      <section className="hero-sec" style={{ paddingTop: "140px", paddingBottom: "60px", minHeight: "auto", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto" }}>
          <div className="hero-badge" style={{ margin: "0 auto 24px" }}>
            <span className="hero-badge-tag">KNOWLEDGE INFRASTRUCTURE</span>
          </div>
          <h1 className="hero-h1" style={{ maxWidth: "100%", margin: "0 auto 24px" }}>
            Engineering Intelligence <em>Knowledge Base.</em>
          </h1>
          <p className="hero-sub" style={{ margin: "0 auto 40px", maxWidth: 650 }}>
            Playbooks, frameworks, and research papers engineered for production-grade technical growth. Curated by the Pathora intelligence systems team.
          </p>
        </motion.div>
      </section>

      {/* Filter + Search */}
      <RevealSection className="sec" style={{ paddingTop: 0 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 40, flexWrap: "wrap" }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search knowledge vectors..."
              style={{
                flex: 1, minWidth: 200, padding: "14px 20px", borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.08)", background: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(12px)", fontSize: 14, fontFamily: "var(--mono)", outline: "none",
                boxShadow: "inset 0 2px 6px rgba(0,0,0,0.02)"
              }}
            />
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {TAGS.map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTag(t)}
                  style={{
                    padding: "8px 16px", borderRadius: 100, border: "1px solid",
                    borderColor: activeTag === t ? "var(--accent)" : "rgba(0,0,0,0.08)",
                    background: activeTag === t ? "rgba(129, 140, 248, 0.1)" : "rgba(255,255,255,0.6)",
                    color: activeTag === t ? "var(--accent)" : "var(--ts)",
                    fontSize: 12, fontWeight: 600, cursor: "pointer",
                    transition: "all 0.2s", fontFamily: "var(--sans)"
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                style={{
                  padding: "24px 28px", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(16px)",
                  borderRadius: 16, border: "1px solid rgba(0,0,0,0.06)", cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateX(4px)"; e.currentTarget.style.borderColor = "rgba(129, 140, 248, 0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)"; }}
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--tp)", marginBottom: 6 }}>{item.title}</h3>
                  <div style={{ display: "flex", gap: 16, fontSize: 11, fontFamily: "var(--mono)", color: "var(--tm)" }}>
                    <span style={{ padding: "2px 8px", background: "rgba(129, 140, 248, 0.08)", borderRadius: 100, color: "var(--accent)", fontWeight: 600 }}>{item.tag}</span>
                    <span>{item.type}</span>
                    <span>{item.reads} reads</span>
                    <span>{item.time} read</span>
                  </div>
                </div>
                <span style={{ fontSize: 18, color: "var(--tm)", transition: "color 0.2s" }}>→</span>
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: 60, color: "var(--tm)", fontFamily: "var(--mono)", fontSize: 13 }}>
                No knowledge vectors match current filter configuration.
              </div>
            )}
          </div>
        </div>
      </RevealSection>

      <LiquidGlassFooter />
    </div>
  );
}
