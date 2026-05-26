import React from 'react';
import { Globe, Target, Clock, AlertCircle } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

export default function DashboardMetrics({ result, targetDisplayCallback }) {
  const percentile = result.competitiveness?.percentile || 88;
  const comparison = result.competitiveness?.comparison || "Top Tier Candidate";

  const data = [];
  for (let i = 0; i <= 100; i += 2) {
    const mean = 65;
    const stdDev = 15;
    const exponent = -0.5 * Math.pow((i - mean) / stdDev, 2);
    const height = Math.round(100 * Math.exp(exponent));
    data.push({ x: i, "Candidates Density": height });
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
      
      {/* Global Talent Positioning Engine */}
      <div className="glass-panel" style={{ padding: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <p className="eyebrow" style={{ color: "#d97706" }}><AlertCircle size={12} /> Deterministic Recruiter Trust Mapping</p>
            <h4 style={{ fontSize: 22, fontWeight: 700, color: "#111", marginTop: 4 }}>Engineering Benchmark Alignment</h4>
          </div>
          <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", background: "rgba(124, 58, 237, 0.1)", color: "#7c3aed", padding: "3px 8px", borderRadius: 6, fontWeight: 500 }}>MARKET BENCHMARK</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "rgba(255, 255, 255, 0.5)", border: "1px solid rgba(0,0,0,0.05)", borderRadius: 16, padding: 18 }}>
            <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#6b7280", marginBottom: 4, textTransform: "uppercase" }}>Benchmark Tier</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#7c3aed", letterSpacing: "-0.01em", lineHeight: 1.2 }}>{comparison}</div>
            <div style={{ fontSize: 12, color: "#4b5563", marginTop: 8, fontStyle: "italic" }}>
                Compared against benchmark profiles for early-career full-stack engineering roles.
            </div>
          </div>
          
          <div style={{ background: "rgba(59, 130, 246, 0.05)", padding: 12, borderRadius: 8, borderLeft: "3px solid #3b82f6", marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#2563eb", fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 4 }}>Why this matters</span>
            <span style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.5 }}>
                Exposure to infrastructure tooling and scalable architectures typically correlates with higher operational engineering readiness.
            </span>
          </div>

          {result.benchmark_metrics?.explanations && result.benchmark_metrics.explanations.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {result.benchmark_metrics.explanations.map((exp, idx) => (
                      <div key={idx} style={{ fontSize: 12, color: "#4b5563", display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#7c3aed", marginTop: 6, flexShrink: 0 }} />
                          <span>{exp}</span>
                      </div>
                  ))}
              </div>
          )}
        </div>
      </div>

    </div>
  );
}
