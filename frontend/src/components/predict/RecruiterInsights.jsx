import React from 'react';
import { Eye, ShieldAlert, ShieldCheck, AlertTriangle, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

// Contains RecruiterIntelligenceLab and RecruiterHeatmap
export default function RecruiterInsights({ score, result }) {
  const legacyConcerns = result.recruiter_insights?.concerns || [];
  const projectExplanations = result.project_metrics?.explanations || [];
  const recruiterExplanations = result.recruiter_metrics?.explanations || [];
  const maturityExplanations = result.maturity_metrics?.explanations || [];
  
  // Combine all explanations into concerns (penalties) and standouts (rewards)
  const allExplanations = [...legacyConcerns, ...projectExplanations, ...recruiterExplanations, ...maturityExplanations];
  
  const concerns = allExplanations.filter(e => e.toLowerCase().includes("penalty") || e.toLowerCase().includes("decreased") || e.toLowerCase().includes("lacking") || e.toLowerCase().includes("smell"));
  
  const standouts = [
      ...(result.recruiter_insights?.standouts || []),
      ...allExplanations.filter(e => e.toLowerCase().includes("increased") || e.toLowerCase().includes("detected") && !e.toLowerCase().includes("smell") && !e.toLowerCase().includes("penalty"))
  ];
  
  const [activeZone, setActiveZone] = useState(null);

  const generateZones = () => {
    if (!result.heatmap?.section_weights) return [];
    
    const weights = result.heatmap.section_weights;
    const dynamicZones = [];
    
    // Always map strongest section
    const strongest = result.heatmap.strongest_section;
    if (strongest && weights[strongest]) {
        dynamicZones.push({
            id: strongest,
            name: `${strongest.toUpperCase()} (Highest Value)`,
            percentage: `${weights[strongest].attention_score}% Attention`,
            comment: `Sections containing measurable outcomes, deployment evidence, and technical impact generally receive higher recruiter screening attention. (Found ${weights[strongest].metrics_found} metrics).`,
            coordinates: { top: "25%", left: "15%", width: "70%", height: "25%", bg: "rgba(5, 150, 105, 0.15)", border: "#059669" }
        });
    }

    const weakest = result.heatmap.weakest_section;
    if (weakest && weights[weakest] && weakest !== strongest) {
        dynamicZones.push({
            id: weakest,
            name: `${weakest.toUpperCase()} (Weakest Area)`,
            percentage: `${weights[weakest].attention_score}% Attention`,
            comment: `Sections lacking measurable outcomes and deployment evidence often represent missed opportunities for technical signaling. (Found ${weights[weakest].metrics_found} metrics).`,
            coordinates: { top: "60%", left: "15%", width: "70%", height: "20%", bg: "rgba(239, 68, 68, 0.15)", border: "#ef4444" }
        });
    }

    return dynamicZones;
  };

  const zones = generateZones();

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
      <div className="glass-panel" style={{ padding: 32 }}>
        <div style={{ display: "flex", justifyItems: "center", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <p className="eyebrow"><ShieldAlert size={12} /> Audit Report</p>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: "#111", marginTop: 4 }}>Recruiter Intelligence Scan</h3>
          </div>
          <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", background: "rgba(17, 24, 39, 0.05)", color: "#111827", padding: "3px 8px", borderRadius: 6, fontWeight: 500 }}>DETERMINISTIC EVALUATION</span>
        </div>

        <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.5, marginBottom: 12 }}>
          This evaluation aggregates penalties and rewards based on detectable engineering signals.
        </p>

        <div style={{ background: "rgba(16, 185, 129, 0.05)", padding: 12, borderRadius: 8, borderLeft: "3px solid #10b981", marginBottom: 24 }}>
          <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#059669", fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 4 }}>Why this matters</span>
          <span style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.5 }}>
            Quantified outcomes and deployment evidence improve technical credibility during recruiter screening.
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {concerns.length > 0 ? (
              concerns.map((con, idx) => (
                <div key={idx} style={{ display: "flex", gap: 12, padding: "12px 16px", background: "#fff", borderLeft: "4px solid #ef4444", borderTop: "1px solid #f3f4f6", borderRight: "1px solid #f3f4f6", borderBottom: "1px solid #f3f4f6", borderRadius: 6, boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
                  <AlertTriangle size={16} style={{ color: "#dc2626", marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>IDENTIFIED PENALTY</div>
                    <p style={{ fontSize: 13, color: "#374151" }}>{con}</p>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ display: "flex", gap: 12, padding: 16, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 6 }}>
                <ShieldCheck size={18} style={{ color: "#059669", marginTop: 2, flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: "#374151" }}>No significant structural bottlenecks or technical penalties detected.</p>
              </div>
            )}

            {standouts.length > 0 && (
                <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#6b7280", textTransform: "uppercase", marginBottom: 12, letterSpacing: "0.05em" }}>Positive Detections</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {standouts.map((std, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <div style={{ width: 14, height: 14, borderRadius: "50%", background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2, flexShrink: 0 }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
                        </div>
                        <span style={{ fontSize: 13, color: "#4b5563" }}>{std}</span>
                    </div>
                    ))}
                </div>
                </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Heatmap Section */}
      <div className="glass-panel" style={{ padding: 32, position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <p className="eyebrow"><Eye size={12} /> Readability Analysis</p>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: "#111", marginTop: 4 }}>Document Abstraction Mapping</h4>
          </div>
          <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", background: "rgba(124, 58, 237, 0.1)", color: "#7c3aed", padding: "3px 8px", borderRadius: 6, fontWeight: 500 }}>DENSITY MAP</span>
        </div>

        <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.5, marginBottom: 24 }}>
          This visual represents where quantifiable metrics and action verbs are concentrated within your document structure.
        </p>

        <div style={{
          background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 24, display: "flex", flexDirection: "column", gap: 20
        }}>
          {zones.length > 0 ? zones.map(zone => (
            <div key={zone.id} style={{ display: "flex", gap: 16 }}>
                <div style={{ width: 4, borderRadius: 2, background: zone.coordinates.border }} />
                <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", fontWeight: 600, color: "#4b5563", textTransform: "uppercase" }}>Section: {zone.id}</div>
                        <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: zone.coordinates.border, fontWeight: 600 }}>{zone.percentage}</div>
                    </div>
                    {/* Simulated text lines */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <div style={{ width: "100%", height: 6, background: zone.id === result.heatmap?.strongest_section ? "rgba(16, 185, 129, 0.2)" : "#f3f4f6", borderRadius: 3 }} />
                        <div style={{ width: "85%", height: 6, background: zone.id === result.heatmap?.strongest_section ? "rgba(16, 185, 129, 0.2)" : "#f3f4f6", borderRadius: 3 }} />
                        <div style={{ width: "92%", height: 6, background: "#f3f4f6", borderRadius: 3 }} />
                    </div>
                    <div style={{ fontSize: 11, color: "#6b7280", marginTop: 8 }}>{zone.comment}</div>
                </div>
            </div>
          )) : (
              <div style={{ fontSize: 13, color: "#6b7280", fontStyle: "italic", textAlign: "center", padding: "20px 0" }}>
                  Sufficient structured data was not extracted for density mapping.
              </div>
          )}
        </div>
      </div>
    </div>
  );
}
