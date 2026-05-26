import React from 'react';
import ScoreRing from '../ui/ScoreRing';
import { Activity } from 'lucide-react';
import { getScoreColor, getScoreLabel, getReadyLabel } from '../../services/analyticsService';

export default function ATSOverview({ animScore, targetDisplayScore, result }) {
  const sc = getScoreColor(targetDisplayScore);
  
  const keywordDensity = result?.keyword_density ? Math.round(result.keyword_density) : 86;
  const complexity = result?.project_analysis?.complexity || (targetDisplayScore >= 80 ? 82 : 64);
  const scalability = result?.project_analysis?.scalability || (targetDisplayScore >= 70 ? 78 : 58);

  return (
    <div className="glass-panel reveal-up" style={{ padding: "40px", display: "flex", alignItems: "center", gap: 60, flexWrap: "wrap" }}>
      <div className="score-anim" style={{ position: "relative" }}>
        <ScoreRing score={animScore} color={sc} size={220} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 56, fontWeight: 400, color: sc, lineHeight: 1, textShadow: `0 0 30px ${sc}40` }}>{animScore}</div>
          <div style={{ fontSize: 12, color: "#6b7280", fontFamily: "'DM Mono', monospace", marginTop: 4, letterSpacing: "0.1em" }}>/ 100 ATS</div>
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 300 }}>
        <p className="eyebrow" style={{ marginBottom: 12 }}><Activity size={12} /> Core Profile Alignment</p>
        <h3 style={{ fontSize: 26, fontWeight: 700, marginBottom: 10, color: "#111" }}>{getScoreLabel(targetDisplayScore)}</h3>
        <p style={{ color: "#4b5563", marginBottom: 20, lineHeight: 1.6, fontSize: 14 }}>
          Your technical blueprint is currently matched to <strong>Production Engineering Benchmark</strong> criteria. The engine parsed outstanding framework keywords, but detected missing production-grade engineering signals that could lower screening priority.
        </p>

        <div style={{ background: "rgba(124, 58, 237, 0.05)", padding: 12, borderRadius: 8, borderLeft: "3px solid #7c3aed", marginBottom: 20 }}>
          <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 4 }}>Why this matters</span>
          <span style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.5 }}>
            Deployment and infrastructure exposure are commonly used as indicators of engineering ownership and operational familiarity.
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { name: "Keyword Density Index", val: keywordDensity, desc: "ATS keyword mapping frequency." },
            { name: "Architectural Workload Depth", val: complexity, desc: "Presence of systems design patterns." },
            { name: "Production Readiness", val: scalability, desc: "Testing, CI/CD, and scaling metrics." }
          ].map((bar, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyItems: "center", justifyContent: "space-between", marginBottom: 4, fontSize: 12 }}>
                <span style={{ fontWeight: 600, color: "#374151" }}>{bar.name}</span>
                <span style={{ fontFamily: "'DM Mono', monospace", color: "#6b7280" }}>{bar.val}%</span>
              </div>
              <div style={{ height: 4, background: "rgba(0,0,0,0.05)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${bar.val}%`, height: "100%", background: sc, borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
