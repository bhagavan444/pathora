import React from 'react';
import { Target, Clock, TrendingUp, Database, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTelemetry } from '../../context/TelemetryContext';

export function TelemetryWidget() {
  const { latency, drift, resolution } = useTelemetry();

  return (
    <div className="glass-panel" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <p className="eyebrow"><Database size={12} /> Infrastructure Telemetry</p>
        <h4 style={{ fontSize: 16, fontWeight: 700, color: "#111", marginTop: 4 }}>Live Pipeline Metrics</h4>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.04)", padding: 12, borderRadius: 12, textAlign: "center" }}>
          <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: "#6b7280", textTransform: "uppercase" }}>Pipeline Latency</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#7c3aed", fontFamily: "'DM Mono', monospace", marginTop: 4 }}>{latency}ms</div>
        </div>

        <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.04)", padding: 12, borderRadius: 12, textAlign: "center" }}>
          <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: "#6b7280", textTransform: "uppercase" }}>Model Drift</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#059669", fontFamily: "'DM Mono', monospace", marginTop: 4 }}>{drift.toFixed(3)}</div>
        </div>

        <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.04)", padding: 12, borderRadius: 12, textAlign: "center" }}>
          <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: "#6b7280", textTransform: "uppercase" }}>Vector Density</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#4f46e5", fontFamily: "'DM Mono', monospace", marginTop: 4 }}>{resolution.toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
}

export default function SalaryProjection({ result }) {
  // Using backend algorithm heuristics instead of hallucinations
  const roundedCallback = result?.competitiveness?.interviewProbability || 0;
  const initialScore = result?.ats_score || 0;

  const rolesReadiness = result?.readiness || [];
  const steps = result?.career_trajectory || [];
  
  // Graceful fallback for the evolution steps mapping
  const evolutionSteps = [
    { label: "Original Upload", score: initialScore, comment: "Baseline profile parse structure.", date: "Init Step" },
    { label: "Target Optimization", score: Math.min(initialScore + 15, 96), comment: "Simulated score after bridging skill gaps.", date: "Goal" }
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
      <TelemetryWidget />

      <div className="glass-panel" style={{ padding: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <p className="eyebrow" style={{ color: "#d97706" }}><AlertCircle size={12} /> Heuristic Signals</p>
            <h4 style={{ fontSize: 22, fontWeight: 700, color: "#111", marginTop: 4 }}>Benchmark Observations</h4>
          </div>
        </div>
        <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.6, marginBottom: 24 }}>
          {result?.benchmark_metrics?.explanations?.[0] || "Profile currently lacks deployment and infrastructure signals commonly found in production engineering resumes."}
        </p>
        
        {rolesReadiness.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {rolesReadiness.map((role, i) => (
              <div key={i} style={{ background: "rgba(255, 255, 255, 0.4)", border: "1px solid rgba(0,0,0,0.04)", borderRadius: 16, padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>{role.name}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: "bold", color: role.value >= 80 ? "#059669" : role.value >= 60 ? "#d97706" : "#dc2626" }}>{role.value}% Readiness</span>
                </div>
                <div style={{ height: 6, background: "rgba(0,0,0,0.05)", borderRadius: 3, overflow: "hidden", marginBottom: 10 }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${role.value}%` }} transition={{ duration: 1, delay: 0.1 * i }} style={{ height: "100%", background: role.value >= 80 ? "#10b981" : role.value >= 60 ? "#fbbf24" : "#f87171" }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass-panel" style={{ padding: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <p className="eyebrow" style={{ color: "#d97706" }}><AlertCircle size={12} /> Heuristic Estimate</p>
            <h4 style={{ fontSize: 20, fontWeight: 700, color: "#111", marginTop: 4 }}>Career Trajectory Timeline</h4>
          </div>
        </div>
        
        {steps.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", position: "relative", paddingLeft: 12 }}>
            <div style={{ position: "absolute", left: 16, top: 12, bottom: 20, width: 2, background: "rgba(124, 58, 237, 0.15)" }} />
            {steps.map((stepStr, idx) => {
              const stepColor = idx === 0 ? "#059669" : idx === steps.length - 1 ? "#4f46e5" : "#7c3aed";
              return (
                <div key={idx} style={{ display: "flex", gap: 20, marginBottom: idx === steps.length - 1 ? 0 : 28 }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#fff", border: `2px solid ${stepColor}`, zIndex: 1, marginLeft: -2, marginTop: 18 }} />
                  <div style={{ flex: 1, padding: "16px 20px", background: "rgba(255, 255, 255, 0.5)", border: "1px solid rgba(0, 0, 0, 0.04)", borderRadius: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 6 }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>{stepStr}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ fontSize: 13, color: "#6b7280" }}>Trajectory map could not be computed for this profile.</p>
        )}
      </div>

      <div className="glass-panel" style={{ padding: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <p className="eyebrow"><TrendingUp size={12} /> Resume Evolution</p>
            <h4 style={{ fontSize: 20, fontWeight: 700, color: "#111", marginTop: 4 }}>ATS Score Optimization Arc</h4>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {evolutionSteps.map((step, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 14, background: "rgba(255, 255, 255, 0.45)", border: "1px solid rgba(0, 0, 0, 0.04)", borderRadius: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: idx === 1 ? "rgba(5, 150, 105, 0.1)" : "rgba(124, 58, 237, 0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: "bold", color: idx === 1 ? "#059669" : "#7c3aed" }}>
                  {idx + 1}
                </div>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{step.label}</span>
                  <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{step.comment}</p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, fontWeight: "bold", color: idx === 1 ? "#059669" : "#7c3aed" }}>{step.score}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
