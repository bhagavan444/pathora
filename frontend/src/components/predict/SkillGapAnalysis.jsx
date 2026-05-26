import React, { useState } from 'react';
import { Activity, Sliders } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

export default function SkillGapAnalysis({ result, upgrades, onToggleUpgrade }) {
  const evolutionOptions = [
    { id: "kubernetes", label: "+ Add Kubernetes & DevOps", desc: "Simulates orchestration, deployment readiness." },
    { id: "aws", label: "+ Add AWS Cloud Infrastructure", desc: "Signals foundational compliance and cloud infra best practices." },
    { id: "redis", label: "+ Add Redis & Caching", desc: "Simulates backend optimization capabilities." },
    { id: "cicd", label: "+ Add CI/CD Pipeline Automation", desc: "Simulates full production automation." },
    { id: "quantifiedMetrics", label: "+ Inject Quantifiable Engineering Outcomes", desc: "Converts 'developed UI features' to 'boosted user engagement by 18%'." },
    { id: "distributedSystems", label: "+ Add Distributed Systems & Microservices", desc: "Simulates sharding, kafka, and scale architecture." }
  ];

  const radarData = result?.aspect_scores?.map(item => ({
    subject: item.name,
    user: item.value,
    market: 80,
    fullMark: 100
  })) || [
    { subject: 'No Data', user: 0, market: 0, fullMark: 100 }
  ];

  const matchedSkills = result?.matched_skills || result?.skills || [];
  const missingSkills = result?.missing_skills || [];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
      <div className="glass-panel" style={{ padding: 32 }}>
        <div style={{ display: "flex", justifyItems: "center", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <p className="eyebrow"><Activity size={12} /> Skill Intelligence</p>
            <h4 style={{ fontSize: 20, fontWeight: 700, color: "#111", marginTop: 4 }}>Skill Gap Analysis</h4>
          </div>
          <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", background: "rgba(16, 185, 129, 0.1)", color: "#10b981", padding: "3px 8px", borderRadius: 6, fontWeight: 500 }}>GAP DECODING</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 32, alignItems: "center" }}>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={70} data={radarData}>
                <PolarGrid stroke="rgba(0,0,0,0.06)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#4b5563", fontSize: 10, fontFamily: "'DM Mono', monospace" }} />
                <Radar name="My Profile" dataKey="user" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.12} strokeWidth={2} />
                <Radar name="Market Standard" dataKey="market" stroke="#10b981" fill="#10b981" fillOpacity={0.06} strokeWidth={1.5} />
                <Legend verticalAlign="bottom" height={24} iconSize={8} wrapperStyle={{ fontSize: 10, fontFamily: "'DM Mono', monospace" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#6b7280", textTransform: "uppercase", marginBottom: 8 }}>Primary Gaps Detected</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {missingSkills.map((sk, i) => (
                <span key={i} className="skill-tag skill-tag-gap">{sk}</span>
              ))}
            </div>

            <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#6b7280", textTransform: "uppercase", marginBottom: 8 }}>Strong Matches</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {matchedSkills.slice(0, 5).map((sk, i) => (
                <span key={i} className="skill-tag skill-tag-core">{sk}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <p className="eyebrow"><Sliders size={12} /> Evolution Panel</p>
            <h4 style={{ fontSize: 22, fontWeight: 700, color: "#111", marginTop: 4 }}>Profile Evolution Simulator</h4>
          </div>
          <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", background: "rgba(124, 58, 237, 0.1)", color: "#7c3aed", padding: "3px 8px", borderRadius: 6, fontWeight: 500 }}>VIRTUAL SANDBOX</span>
        </div>

        <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.5, marginBottom: 24 }}>
          Check upgrades to simulate profile improvements and dynamically morph your recruiter competitiveness coefficients.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {evolutionOptions.map((up) => {
            const isChecked = upgrades?.[up.id] || false;
            return (
              <label key={up.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: 14, background: isChecked ? "rgba(124, 58, 237, 0.05)" : "rgba(255,255,255,0.4)", border: isChecked ? "1px solid rgba(124, 58, 237, 0.2)" : "1px solid rgba(0,0,0,0.05)", borderRadius: 12, cursor: "pointer", transition: "all 0.2s" }}>
                <input type="checkbox" className="sim-checkbox" checked={isChecked} onChange={() => onToggleUpgrade(up.id)} style={{ marginTop: 3, accentColor: "#7c3aed", width: 16, height: 16 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: isChecked ? "#7c3aed" : "#374151" }}>{up.label}</div>
                  <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{up.desc}</div>
                </div>
              </label>
            );
          })}
        </div>
      </div>
      
      <div className="glass-panel" style={{ padding: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <p className="eyebrow"><Activity size={12} /> Trajectory Engine</p>
            <h4 style={{ fontSize: 22, fontWeight: 700, color: "#111", marginTop: 4 }}>Deterministic Progression Roadmap</h4>
          </div>
          <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", background: "rgba(16, 185, 129, 0.1)", color: "#10b981", padding: "3px 8px", borderRadius: 6, fontWeight: 500 }}>DAG SEQUENCE</span>
        </div>

        <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.5, marginBottom: 24 }}>
          This sequence is deterministically generated by analyzing your parsed skills against dependency graph prerequisites for your target domain.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {result?.roadmap?.length > 0 ? result.roadmap.map((step, idx) => (
            <div key={idx} style={{ padding: 16, background: "rgba(255, 255, 255, 0.6)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111", marginBottom: 4 }}>{step.phase}</div>
              <div style={{ fontSize: 12, color: "#4b5563", marginBottom: 12 }}>{step.focus}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {step.skills.map((sk, i) => (
                  <span key={i} className="skill-tag skill-tag-gap">{sk}</span>
                ))}
              </div>
            </div>
          )) : (
            <div style={{ padding: 16, background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: 12, color: "#059669", fontSize: 13, fontWeight: 500 }}>
              No critical prerequisite gaps detected. You meet the core requirements for this tier.
            </div>
          )}
        </div>
        
        {result?.project_recommendations?.length > 0 && (
            <div style={{ marginTop: 24, padding: 16, background: "rgba(59, 130, 246, 0.05)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: 12 }}>
                <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#2563eb", textTransform: "uppercase", marginBottom: 8, fontWeight: "bold" }}>Suggested Architecture Project</div>
                {result.project_recommendations.map((rec, i) => (
                    <div key={i} style={{ fontSize: 13, color: "#1e3a8a", fontWeight: 500 }}>{rec}</div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
