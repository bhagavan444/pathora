import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useWindowSize } from 'react-use';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, Sparkles, RefreshCw, Eye, Cpu, TrendingUp, Globe } from 'lucide-react';

import Footer from '../components/Footer';
import MagneticCursor from '../components/ui/MagneticCursor';
import AmbientBg from '../components/ui/AmbientBg';
import { useResumeAnalysis } from '../hooks/useResumeAnalysis';
import { TelemetryProvider } from '../context/TelemetryContext';

import PredictErrorBoundary from '../components/predict/PredictErrorBoundary';
import ResumeUpload from '../components/predict/ResumeUpload';
import ATSOverviewComponent from '../components/predict/ATSOverview';
import RecruiterInsightsComponent from '../components/predict/RecruiterInsights';
import CareerGenomeComponent from '../components/predict/CareerGenome';
import DashboardMetricsComponent from '../components/predict/DashboardMetrics';
import SkillGapAnalysisComponent from '../components/predict/SkillGapAnalysis';
import SalaryProjectionComponent from '../components/predict/SalaryProjection';
import AnalysisTimelineComponent from '../components/predict/AnalysisTimeline';
import { getReadyLabel, getScoreColor } from '../services/analyticsService';
import { useProfileSimulator } from '../hooks/useProfileSimulator';

// Memoize heavy components to prevent layout thrashing during streaming and animations
const ATSOverview = React.memo(ATSOverviewComponent);
const RecruiterInsights = React.memo(RecruiterInsightsComponent);
const CareerGenome = React.memo(CareerGenomeComponent);
const DashboardMetrics = React.memo(DashboardMetricsComponent);
const SkillGapAnalysis = React.memo(SkillGapAnalysisComponent);
const SalaryProjection = React.memo(SalaryProjectionComponent);
const AnalysisTimeline = React.memo(AnalysisTimelineComponent);

import './Predict.css';

export default function Predict() {
  return (
    <PredictErrorBoundary>
      <TelemetryProvider>
        <PredictOrchestrator />
      </TelemetryProvider>
    </PredictErrorBoundary>
  );
}

function PredictOrchestrator() {
  const {
    status, errorMsg, resumeFile, handleFile, domain, setDomain,
    interest, setInterest, useAI, setUseAI, result,
    targetDisplayScore, setTargetDisplayScore,
    targetDisplayCallback, setTargetDisplayCallback,
    submit, reset, loadStep
  } = useResumeAnalysis();

  const { upgrades, toggleUpgrade, simulatedResult } = useProfileSimulator(result);
  
  // Use simulatedResult for the entire dashboard rendering when available
  const activeResult = simulatedResult || result;

  const reportRef = useRef(null);
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const isMed = width < 1100;

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2, backgroundColor: "#fbfbfc", useCORS: true, logging: false,
      });
      const pdf = new jsPDF("p", "mm", "a4");
      const w = pdf.internal.pageSize.getWidth();
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 10, w, (canvas.height * w) / canvas.width);
      pdf.save("Pathora_Recruiter_Intelligence_Report.pdf");
    } catch { alert("PDF export failed. Please try again."); }
  };

  const sc = activeResult ? getScoreColor(activeResult.ats_score || targetDisplayScore) : "#7c3aed";

  return (
    <div className="home-wrap" style={{
      minHeight: "100vh", color: "#111",
      fontFamily: "'Outfit',sans-serif", cursor: "none",
      position: "relative", overflowX: "hidden",
    }}>
      <div className="grid-bg" />
      <MagneticCursor />
      <AmbientBg scoreColor={sc} />

      <AnimatePresence>
        {(status === 'uploading' || status === 'analyzing' || status === 'streaming') && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, zIndex: 999, background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(24px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20
            }}>
            <div style={{ width: "100%", maxWidth: 640, display: "flex", flexDirection: "column", gap: 30 }}>
              <div style={{ textAlign: "center" }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} style={{ display: "inline-block", marginBottom: 20 }}>
                  <Cpu size={48} style={{ color: "#7c3aed" }} />
                </motion.div>
                <h3 style={{ fontSize: 24, fontWeight: 700, color: "#111", marginBottom: 8 }}>Stabilizing Telemetry Models</h3>
                <p style={{ fontSize: 14, color: "#6b7280" }}>Synthesizing career genome metrics & attention patterns...</p>
              </div>
              <div style={{ height: 6, background: "rgba(0,0,0,0.06)", borderRadius: 3, overflow: "hidden" }}>
                <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 3.5, ease: "easeInOut" }} style={{ height: "100%", background: "linear-gradient(90deg, #4f46e5, #7c3aed)" }} />
              </div>
              <AnalysisTimeline />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!result || status !== 'success' ? (
        <>
          <div style={{ display: "grid", gridTemplateColumns: isMed ? "1fr" : "1.2fr 0.8fr", gap: "60px", padding: isMobile ? "40px 20px" : "80px 40px 40px", maxWidth: 1240, margin: "0 auto", alignItems: "center", position: "relative", zIndex: 1 }}>
            <div className="reveal-up">
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 16px", background: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)", borderRadius: 30, border: "1px solid rgba(255,255,255,0.8)", marginBottom: 30 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed", animation: "dotPulse 2s infinite" }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#374151", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>OPERATING PLATFORM CORE</span>
              </div>
              <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: isMobile ? 52 : 72, lineHeight: 1.05, color: "#0f0f0f", marginBottom: 28 }}>
                Deterministic Engineering <br /><span style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Intelligence Platform.</span>
              </h1>
              <p style={{ fontSize: 17, color: "#4b5563", lineHeight: 1.6, maxWidth: 500, marginBottom: 40, fontWeight: 300 }}>
                Deterministic engineering evaluation for recruiter benchmarking, production readiness analysis, and technical profile optimization.
              </p>
              <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 40, flexWrap: "wrap" }}>
                <label className="btn-primary" style={{ padding: "16px 32px", fontSize: 15, cursor: "pointer", borderRadius: 14 }}>
                  Upload Engineering Resume <span style={{ opacity: 0.8, marginLeft: 4 }}>→</span>
                  <input type="file" hidden accept=".pdf" onChange={(e) => {
                    handleFile(e.target.files?.[0] || null);
                    document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
                  }} />
                </label>
                <button className="btn-ghost" style={{ padding: "16px 32px", fontSize: 15, borderRadius: 14 }} onClick={() => {
                  handleFile(new File([""], "demo_resume.pdf"));
                  document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  Load Sandbox Model
                </button>
              </div>
            </div>
            <div className="reveal-r" style={{ animationDelay: "0.2s" }}>
              <AnalysisTimeline />
            </div>
          </div>
          <ResumeUpload
            status={status} errorMsg={errorMsg} resumeFile={resumeFile} handleFile={handleFile}
            domain={domain} setDomain={setDomain} interest={interest} setInterest={setInterest}
            useAI={useAI} setUseAI={setUseAI} submit={submit} loadStep={loadStep}
          />
        </>
      ) : (
        <motion.div ref={reportRef} initial={{ opacity: 0, filter: "blur(8px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "20px 16px" : "40px 40px", position: "relative", zIndex: 1 }}>
          
          <div className="reveal-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20, marginBottom: 40, borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: 24 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", background: "rgba(124, 58, 237, 0.1)", color: "#7c3aed", padding: "4px 10px", borderRadius: 20, fontWeight: "bold" }}>SYSTEM ACTIVE</span>
                <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#6b7280" }}>COGNITIVE INTERFACE v3.2</span>
              </div>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: isMobile ? 38 : 54, fontStyle: "italic", color: "#0f0f0f", lineHeight: 1.05 }}>Engineering Intelligence Board</h2>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn-ghost" onClick={reset} style={{ padding: "12px 20px" }}>
                <RefreshCw size={14} /> Re-analyze Profile
              </button>
              <button className="btn-primary" onClick={downloadPDF} style={{ padding: "12px 20px" }}>
                ↓ Export Recruiter PDF
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 30, marginBottom: 30 }}>
            {/* Top Priority Section: ATS Score + Core KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: isMed ? "1fr" : "1.1fr 0.9fr", gap: 24, alignItems: "stretch" }}>
                <ATSOverview animScore={activeResult.ats_score || targetDisplayScore} targetDisplayScore={activeResult.ats_score || targetDisplayScore} result={activeResult} />
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    {[
                    { label: "Recruiter Trust Score", val: String(activeResult.recruiter_metrics?.recruiter_trust_score || 0), unit: "/100", color: "#4f46e5", icon: <Eye size={14} />, desc: "Credibility based on metrics & proof." },
                    { label: "Project Complexity", val: String(activeResult.project_metrics?.project_complexity_index || 0), unit: "/100", color: "#7c3aed", icon: <Cpu size={14} />, desc: `Tier: ${activeResult.project_metrics?.complexity_tier?.split('(')[0] || 'Unknown'}` },
                    { label: "Market Percentile", val: String(activeResult.benchmark_metrics?.percentile || 0), unit: "%", color: "#059669", icon: <TrendingUp size={14} />, desc: activeResult.benchmark_metrics?.comparison || "Heuristic Benchmark" },
                    { label: "Engineering Maturity", val: String(activeResult.maturity_metrics?.engineering_maturity_index || 0), unit: "/100", color: "#111827", icon: <Globe size={14} />, desc: `Level: ${activeResult.maturity_metrics?.maturity_level?.split('/')[0] || 'Unknown'}` }
                    ].map((kpi, idx) => (
                    <div className="kpi-card reveal-up" key={idx} style={{ animationDelay: `${0.1 + idx * 0.08}s`, padding: "20px 16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <p className="eyebrow">{kpi.icon} {kpi.label}</p>
                        </div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 2, marginBottom: 8 }}>
                        <span style={{ fontSize: 28, fontWeight: 700, color: kpi.color, letterSpacing: "-0.03em", lineHeight: 1 }}>{kpi.val}</span>
                        <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#9ca3af" }}>{kpi.unit}</span>
                        </div>
                        <p style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.4 }}>{kpi.desc}</p>
                    </div>
                    ))}
                </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMed ? "1fr" : "1.2fr 0.8fr", gap: 24, alignItems: "start", marginBottom: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <RecruiterInsights score={activeResult.ats_score} result={activeResult} />
              <CareerGenome aspectScores={activeResult.aspect_scores || []} />
              <DashboardMetrics result={activeResult} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <SkillGapAnalysis result={activeResult} upgrades={upgrades} onToggleUpgrade={toggleUpgrade} />
            </div>
          </div>
        </motion.div>
      )}
      <Footer />
    </div>
  );
}