import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LiquidGlassFooter } from "./HomeComponents";
import "./Home.css";

const SIDEBAR = [
  {
    section: "Getting Started",
    items: ["Introduction", "Quick Start", "Authentication", "Rate Limits"]
  },
  {
    section: "Evaluation API",
    items: ["Resume Upload", "Parse Endpoint", "Heuristic Scoring", "Telemetry Payloads"]
  },
  {
    section: "Intelligence Engines",
    items: ["Vector Mapping", "Recruiter Trust", "Maturity Radar", "Gap Analysis"]
  },
  {
    section: "Infrastructure",
    items: ["SSE Telemetry", "Webhooks", "Error Codes", "SDK Reference"]
  }
];

const DOCS_CONTENT = {
  "Introduction": {
    title: "Introduction",
    subtitle: "Pathora Evaluation Infrastructure — API Reference v2.4",
    blocks: [
      {
        type: "text",
        content: "Pathora exposes a deterministic evaluation API that accepts structured resume data and returns scored engineering maturity telemetry. All endpoints return JSON payloads with consistent schema versioning."
      },
      {
        type: "code",
        label: "Base URL",
        language: "bash",
        content: "https://api.pathora.dev/v2"
      },
      {
        type: "text",
        content: "Authentication is handled via Bearer tokens issued through the developer console. All requests must include the Authorization header."
      },
      {
        type: "code",
        label: "Authentication Header",
        language: "bash",
        content: 'curl -X POST https://api.pathora.dev/v2/evaluate \\\n  -H "Authorization: Bearer pk_live_xxxxxxxx" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"resume_url": "https://..."}\''
      }
    ]
  },
  "Resume Upload": {
    title: "Resume Upload",
    subtitle: "POST /v2/ingest",
    blocks: [
      {
        type: "text",
        content: "Upload a resume document (PDF, DOCX) for deterministic parsing. The ingestion engine extracts structured metadata, skill vectors, and deployment signals."
      },
      {
        type: "code",
        label: "Request Schema",
        language: "json",
        content: '{\n  "file": "<base64_encoded_document>",\n  "format": "pdf",\n  "options": {\n    "extract_projects": true,\n    "map_infrastructure": true,\n    "recruiter_mode": false\n  }\n}'
      },
      {
        type: "code",
        label: "Response Payload",
        language: "json",
        content: '{\n  "id": "eval_8x7k2m",\n  "status": "parsed",\n  "entities": 47,\n  "vectors": 5,\n  "latency_ms": 142,\n  "next": "/v2/evaluate/eval_8x7k2m"\n}'
      }
    ]
  },
  "Heuristic Scoring": {
    title: "Heuristic Scoring",
    subtitle: "POST /v2/evaluate/{id}/score",
    blocks: [
      {
        type: "text",
        content: "Triggers the deterministic heuristic engine on a parsed resume. Returns a weighted score object across 5 engineering dimensions with recruiter trust mapping."
      },
      {
        type: "code",
        label: "Response Payload",
        language: "json",
        content: '{\n  "evaluation_id": "eval_8x7k2m",\n  "scores": {\n    "architecture": 0.87,\n    "deployment": 0.72,\n    "testing": 0.91,\n    "infrastructure": 0.68,\n    "communication": 0.83\n  },\n  "recruiter_trust": 0.81,\n  "maturity_level": "senior",\n  "gaps": ["kubernetes", "load-testing"]\n}'
      }
    ]
  }
};

export default function Docs() {
  const [active, setActive] = useState("Introduction");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const content = DOCS_CONTENT[active] || DOCS_CONTENT["Introduction"];

  return (
    <div className="home-wrap">
      <div className="grid-bg" style={{ opacity: 0.4 }} />

      <div style={{ display: "flex", paddingTop: 90, minHeight: "100vh", maxWidth: 1400, margin: "0 auto", width: "100%" }}>
        
        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{
            width: 260, minWidth: 260, padding: "40px 24px", borderRight: "1px solid rgba(0,0,0,0.06)",
            background: "rgba(255,255,255,0.4)", backdropFilter: "blur(16px)",
            position: "sticky", top: 90, height: "calc(100vh - 90px)", overflowY: "auto"
          }}
        >
          <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--accent)", letterSpacing: ".1em", marginBottom: 24, fontWeight: 700 }}>
            DOCUMENTATION
          </div>
          {SIDEBAR.map(s => (
            <div key={s.section} style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 10, fontFamily: "var(--mono)", color: "var(--tm)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 12, fontWeight: 700 }}>
                {s.section}
              </div>
              {s.items.map(item => (
                <div
                  key={item}
                  onClick={() => setActive(item)}
                  style={{
                    fontSize: 13, padding: "8px 12px", borderRadius: 8, cursor: "pointer",
                    color: active === item ? "var(--accent)" : "var(--ts)",
                    background: active === item ? "rgba(129, 140, 248, 0.08)" : "transparent",
                    fontWeight: active === item ? 600 : 400,
                    transition: "all 0.2s", marginBottom: 2
                  }}
                  onMouseEnter={e => { if (active !== item) e.currentTarget.style.background = "rgba(0,0,0,0.02)"; }}
                  onMouseLeave={e => { if (active !== item) e.currentTarget.style.background = "transparent"; }}
                >
                  {item}
                </div>
              ))}
            </div>
          ))}
        </motion.aside>

        {/* Content */}
        <motion.main
          key={active}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
          style={{ flex: 1, padding: "40px 60px", maxWidth: 800 }}
        >
          <div style={{ marginBottom: 40 }}>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: "var(--tp)", marginBottom: 8, letterSpacing: "-0.02em" }}>
              {content.title}
            </h1>
            <div style={{ fontSize: 14, fontFamily: "var(--mono)", color: "var(--tm)" }}>
              {content.subtitle}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {content.blocks.map((block, i) => (
              <div key={i}>
                {block.type === "text" ? (
                  <p style={{ fontSize: 15, color: "var(--ts)", lineHeight: 1.8 }}>{block.content}</p>
                ) : (
                  <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)" }}>
                    {block.label && (
                      <div style={{ padding: "10px 20px", background: "rgba(0,0,0,0.03)", borderBottom: "1px solid rgba(0,0,0,0.06)", fontSize: 11, fontFamily: "var(--mono)", color: "var(--tm)", letterSpacing: ".05em", fontWeight: 600 }}>
                        {block.label}
                      </div>
                    )}
                    <pre style={{
                      padding: "20px 24px", background: "rgba(5, 8, 22, 0.95)", color: "rgba(255,255,255,0.85)",
                      fontSize: 13, fontFamily: "var(--mono)", lineHeight: 1.7, margin: 0, overflowX: "auto"
                    }}>
                      {block.content}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          {!DOCS_CONTENT[active] && (
            <div style={{ padding: 40, textAlign: "center", color: "var(--tm)", fontFamily: "var(--mono)", fontSize: 13 }}>
              Documentation for <strong>{active}</strong> is under active development.
              <br />This section will be available in the next infrastructure release.
            </div>
          )}
        </motion.main>
      </div>

      <LiquidGlassFooter />
    </div>
  );
}
