import React, { useState } from 'react';
import { Brain } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { safeArr } from '../../services/predictService';

export default function CareerGenome({ aspectScores }) {
  const [activeTrait, setActiveTrait] = useState(null);

  const genomeMetadata = {
    "Frontend": {
      desc: "Client-side architecture, UI frameworks, and state management mastery.",
      why: "Determines ability to build responsive, performant user interfaces.",
      danger: "Lack of deep component lifecycle understanding.",
      metric: "Visual Engineering"
    },
    "Backend": {
      desc: "Server-side logic, API design, and database interaction.",
      why: "Evaluates ability to build robust data layers and business logic.",
      danger: "Missing scalable architectural patterns like microservices.",
      metric: "Core Logic"
    },
    "Cloud & DevOps": {
      desc: "Infrastructure, CI/CD pipelines, containerization, and cloud services.",
      why: "Critical for deploying, scaling, and maintaining production applications.",
      danger: "Inability to push code to production environments reliably.",
      metric: "Infrastructure"
    },
    "Data & AIML": {
      desc: "Machine learning, data pipelines, and analytics databases.",
      why: "Essential for data-driven applications and AI integrations.",
      danger: "Shallow API wrapping without deep modeling knowledge.",
      metric: "Intelligence"
    },
    "Architecture": {
      desc: "System design, distributed systems, and architectural patterns.",
      why: "Measures engineering maturity and capability to design for scale.",
      danger: "Inability to structure complex systems for high availability.",
      metric: "System Design"
    }
  };

  // Add deterministic market benchmark to the radar data
  const chartData = safeArr(aspectScores).map(item => ({
      ...item,
      benchmark: 75 // Static deterministic baseline for intermediate competitive roles
  }));

  return (
    <div className="glass-panel" style={{ padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <p className="eyebrow"><Brain size={12} /> Genome Engine</p>
          <h4 style={{ fontSize: 22, fontWeight: 700, color: "#111", marginTop: 4 }}>Engineering Vector Intelligence</h4>
        </div>
        <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", background: "rgba(5, 150, 105, 0.1)", color: "#059669", padding: "3px 8px", borderRadius: 6, fontWeight: 500 }}>VECTOR MAPPING</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "center" }}>
        <div style={{ position: "relative", width: "100%", height: 280, display: "flex", alignItems: "center", justifyItems: "center" }}>
          <svg style={{ position: "absolute", width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}>
            <defs>
              <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="50%" cy="50%" r="55" fill="url(#centerGlow)" />
            <motion.circle
              cx="50%" cy="50%" r="85"
              stroke="rgba(124, 58, 237, 0.12)" strokeWidth="1" strokeDasharray="10, 8" fill="none"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "center" }}
            />
            <motion.circle
              cx="50%" cy="50%" r="115"
              stroke="rgba(99, 102, 241, 0.08)" strokeWidth="1.5" strokeDasharray="15, 12" fill="none"
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "center" }}
            />
          </svg>

          <div style={{ width: "100%", height: "100%", zIndex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData} stroke="transparent">
                <PolarGrid stroke="rgba(0,0,0,0.06)" />
                <PolarAngleAxis
                  dataKey="name"
                  tick={({ x, y, payload }) => (
                    <text
                      x={x} y={y} textAnchor="middle" fill="#4b5563" fontSize={10} fontFamily="'DM Mono', monospace" fontWeight="600"
                      cursor="pointer"
                      onClick={() => setActiveTrait(payload.value)}
                      style={{ transition: "fill 0.2s" }}
                    >
                      {payload.value}
                    </text>
                  )}
                />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: "rgba(255, 255, 255, 0.95)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 8, boxShadow: "0 10px 25px rgba(0,0,0,0.05)", fontSize: 12 }}
                  itemStyle={{ fontSize: 12, fontWeight: 600 }}
                  formatter={(value, name) => [value, name === "value" ? "Candidate Score" : "Market Benchmark"]}
                />
                <Radar name="Candidate Score" dataKey="value" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.4} strokeWidth={2.5} />
                <Radar name="Market Benchmark" dataKey="benchmark" stroke="#9ca3af" fill="transparent" strokeWidth={1.5} strokeDasharray="4 4" />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {activeTrait ? (
            <motion.div key={activeTrait} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
              style={{ background: "rgba(255, 255, 255, 0.6)", border: "1px solid rgba(124, 58, 237, 0.2)", borderRadius: 16, padding: 20, boxShadow: "0 10px 30px rgba(124, 58, 237, 0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: "#111" }}>{activeTrait}</span>
                <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", background: "#7c3aed", color: "#fff", padding: "2px 8px", borderRadius: 4, fontWeight: "bold" }}>
                  {genomeMetadata[activeTrait]?.metric}
                </span>
              </div>
              <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.5, marginBottom: 12 }}>{genomeMetadata[activeTrait]?.desc}</p>
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Why it matters</div>
                <div style={{ fontSize: 12, color: "#4b5563", lineHeight: 1.4 }}>{genomeMetadata[activeTrait]?.why}</div>
              </div>
            </motion.div>
          ) : (
            <div style={{ background: "rgba(255, 255, 255, 0.3)", border: "1px dashed rgba(0,0,0,0.08)", borderRadius: 16, padding: 30, textAlign: "center", color: "#6b7280", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <Brain size={28} style={{ color: "#c084fc", opacity: 0.8 }} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Engineering Vector Mapping Active</p>
                <p style={{ fontSize: 12, color: "#6b7280" }}>Click on any axis label of the Vector Map to trace specific engineering metrics.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
