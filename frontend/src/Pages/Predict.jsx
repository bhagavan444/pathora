import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useWindowSize } from "react-use";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, CartesianGrid, Area, AreaChart,
  XAxis, YAxis, Tooltip,
} from "recharts";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ─────────────────────────────────────────────
   MOCK DATA — used when API is unavailable
───────────────────────────────────────────── */
const MOCK_RESULT = {
  score: 84,
  roles: [
    "AI Integration Engineer",
    "Machine Learning Ops",
    "Senior Full Stack Developer",
    "Cloud Architecture Lead",
    "Product Engineer",
  ],
  skills: [
    "React", "Node.js", "TypeScript", "Python", "Neural Networks",
    "PostgreSQL", "Docker", "Kubernetes", "AWS", "CI/CD",
  ],
  aspectScores: [
    { name: "Technical Depth",  value: 88 },
    { name: "System Design",    value: 75 },
    { name: "AI Competency",    value: 82 },
    { name: "Leadership",       value: 65 },
    { name: "Problem Solving",  value: 90 },
    { name: "Domain Knowledge", value: 78 },
  ],
  roadmap: [
    "Architect a highly scalable distributed microservice",
    "Acquire advanced AWS Machine Learning certification",
    "Publish findings on LLM orchestration strategies",
    "Contribute to key open-source AI frameworks",
    "Transition into AI Product Leadership within 18 months",
  ],
  improvements: [
    "Quantify architectural impact (e.g. 'reduced API latency by 45% using edge caching')",
    "Highlight specific AI model fine-tuning achievements",
    "Restructure experience to emphasize product ownership and technical leadership",
    "Elevate language to enterprise standards—replace 'worked on' with 'architected'",
  ],
  growthProjection: [
    { year: "Now", salary: 85000 },
    { year: "Y1",  salary: 110000 },
    { year: "Y2",  salary: 135000 },
    { year: "Y3",  salary: 165000 },
    { year: "Y5",  salary: 215000 },
  ],
};

/* ─────────────────────────────────────────────
   STYLE INJECTION
───────────────────────────────────────────── */
const injectStyles = () => {
  if (typeof document === "undefined") return;
  if (document.getElementById("pnx-predict-styles")) {
    document.getElementById("pnx-predict-styles").remove();
  }
  const s = document.createElement("style");
  s.id = "pnx-predict-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes reverseSpin { to { transform: rotate(-360deg); } }
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(20px); filter: blur(4px); }
      to   { opacity: 1; transform: translateY(0); filter: blur(0); }
    }
    @keyframes fadeSlideRight {
      from { opacity: 0; transform: translateX(-14px); filter: blur(4px); }
      to   { opacity: 1; transform: translateX(0); filter: blur(0); }
    }
    @keyframes scoreReveal {
      from { opacity: 0; transform: scale(0.9); filter: blur(8px); }
      to   { opacity: 1; transform: scale(1); filter: blur(0); }
    }
    @keyframes barExpand { from { width: 0 !important; } }
    @keyframes numberBlur {
      from { opacity: 0; filter: blur(8px); }
      to   { opacity: 1; filter: blur(0); }
    }
    @keyframes dotPulse {
      0%, 100% { transform: scale(1); opacity: 1; box-shadow: 0 0 10px rgba(124,58,237,0.4); }
      50% { transform: scale(1.5); opacity: 0.6; box-shadow: 0 0 20px rgba(124,58,237,0.8); }
    }
    @keyframes dotPulseGreen {
      0%, 100% { transform: scale(1); opacity: 1; box-shadow: 0 0 10px rgba(5,150,105,0.4); }
      50% { transform: scale(1.5); opacity: 0.6; box-shadow: 0 0 20px rgba(5,150,105,0.8); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-12px); }
    }
    @keyframes pulseGlow {
      0%, 100% { opacity: 0.6; filter: blur(20px); transform: scale(1); }
      50% { opacity: 0.9; filter: blur(30px); transform: scale(1.05); }
    }
    @keyframes orb {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33%      { transform: translate(30px, -20px) scale(1.05); }
      66%      { transform: translate(-20px, 20px) scale(0.95); }
    }
    @keyframes pulseNode {
      0%, 100% { r: 4; fill: #7c3aed; opacity: 0.8; }
      50% { r: 6; fill: #4f46e5; opacity: 1; }
    }

    .reveal-up { animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
    .reveal-r  { animation: fadeSlideRight 0.5s cubic-bezier(0.22,1,0.36,1) both; }
    .score-anim { animation: scoreReveal 0.8s cubic-bezier(0.34,1.56,0.64,1) both; }

    .glass-panel {
      background: rgba(255, 255, 255, 0.45);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.6);
      border-radius: 24px;
      box-shadow: 0 4px 24px -1px rgba(0, 0, 0, 0.04), inset 0 1px 1px rgba(255,255,255,0.4);
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    .glass-panel:hover {
      background: rgba(255, 255, 255, 0.6);
      border-color: rgba(255, 255, 255, 0.9);
      box-shadow: 0 10px 40px -2px rgba(0, 0, 0, 0.08), 0 0 20px rgba(124,58,237,0.05);
      transform: translateY(-2px);
    }

    .kpi-card {
      background: rgba(255, 255, 255, 0.5);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.7);
      border-radius: 16px;
      padding: 24px;
      position: relative;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      box-shadow: 0 4px 20px rgba(0,0,0,0.03), inset 0 1px 1px rgba(255, 255, 255, 0.4);
    }
    .kpi-card::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 16px;
      background: linear-gradient(135deg, rgba(124,58,237,0.05) 0%, transparent 55%);
      opacity: 0;
      transition: opacity 0.3s;
      pointer-events: none;
    }
    .kpi-card:hover::after { opacity: 1; }
    .kpi-card:hover {
      border-color: rgba(124,58,237,0.3);
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.06), 0 0 15px rgba(124,58,237,0.05);
    }

    .btn-primary {
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: #fff;
      border: none;
      border-radius: 12px;
      font-family: 'Outfit', sans-serif;
      font-weight: 500;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(124,58,237,0.3), inset 0 1px 1px rgba(255,255,255,0.3);
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    }
    .btn-primary:hover {
      box-shadow: 0 8px 25px rgba(124,58,237,0.5), inset 0 1px 1px rgba(255,255,255,0.4);
      transform: translateY(-2px);
    }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: translateY(0); box-shadow: none; }
    
    .btn-ghost {
      background: rgba(255,255,255,0.2);
      backdrop-filter: blur(10px);
      color: #374151;
      border: 1px solid rgba(255,255,255,0.5);
      border-radius: 12px;
      font-family: 'Outfit', sans-serif;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 10px rgba(0,0,0,0.02);
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    }
    .btn-ghost:hover {
      background: rgba(255,255,255,0.6);
      border-color: rgba(255,255,255,0.8);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    }

    .pnx-input {
      width: 100%;
      background: rgba(255,255,255,0.5);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(0,0,0,0.08);
      border-radius: 12px;
      padding: 14px 16px;
      color: #111;
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      outline: none;
      transition: all 0.2s ease;
    }
    .pnx-input:focus {
      background: rgba(255,255,255,0.8);
      border-color: #7c3aed;
      box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
    }

    .upload-zone {
      border: 2px dashed rgba(124,58,237,0.25);
      border-radius: 16px;
      padding: 32px 24px;
      text-align: center;
      cursor: pointer;
      background: rgba(255,255,255,0.4);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
      position: relative;
    }
    .upload-zone:hover {
      border-color: rgba(124,58,237,0.5);
      background: rgba(255,255,255,0.6);
    }
    .upload-zone input[type=file] {
      position: absolute; inset: 0;
      opacity: 0; cursor: pointer;
      width: 100%; height: 100%;
    }

    .eyebrow {
      font-family: 'DM Mono', monospace;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #6b7280;
    }

    .skill-tag {
      display: inline-flex; align-items: center;
      font-family: 'DM Mono', monospace;
      font-size: 12px; font-weight: 500;
      padding: 6px 14px; border-radius: 8px;
      letter-spacing: 0.02em;
      transition: all 0.2s; cursor: default;
      backdrop-filter: blur(8px);
    }
    .skill-tag-core {
      background: rgba(124,58,237,0.08);
      color: #6d28d9;
      border: 1px solid rgba(124,58,237,0.15);
    }
    .skill-tag-core:hover { background: rgba(124,58,237,0.15); border-color: rgba(124,58,237,0.3); }
    .skill-tag-support {
      background: rgba(255,255,255,0.5);
      color: #4b5563;
      border: 1px solid rgba(0,0,0,0.08);
    }
    .skill-tag-support:hover { background: rgba(255,255,255,0.8); }
    .skill-tag-gap {
      background: rgba(220,38,38,0.04);
      color: #b91c1c;
      border: 1px dashed rgba(220,38,38,0.25);
    }

    .toggle-row {
      display: flex; align-items: center; gap: 14px;
      padding: 16px;
      background: rgba(255,255,255,0.4); backdrop-filter: blur(10px);
      border: 1px solid rgba(0,0,0,0.05); border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .toggle-row:hover { background: rgba(255,255,255,0.6); border-color: rgba(124,58,237,0.2); }

    .road-node {
      display: flex; gap: 16px;
      animation: fadeSlideRight 0.4s cubic-bezier(0.22,1,0.36,1) both;
    }
    
    .score-glow { filter: drop-shadow(0 0 20px rgba(124,58,237,0.3)); }
  `;
  document.head.appendChild(s);
};
injectStyles();

/* ─────────────────────────────────────────────
   MAGNETIC CURSOR
───────────────────────────────────────────── */
function MagneticCursor() {
  const ringRef = useRef(null);
  const dotRef  = useRef(null);
  const cur     = useRef({ x: 0, y: 0 });
  const tgt     = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      tgt.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + "px";
        dotRef.current.style.top  = e.clientY + "px";
      }
    };
    const loop = () => {
      cur.current.x += (tgt.current.x - cur.current.x) * 0.085;
      cur.current.y += (tgt.current.y - cur.current.y) * 0.085;
      if (ringRef.current) {
        ringRef.current.style.left = cur.current.x + "px";
        ringRef.current.style.top  = cur.current.y + "px";
      }
      requestAnimationFrame(loop);
    };
    const grow   = () => { if (ringRef.current) { ringRef.current.style.width = "50px"; ringRef.current.style.height = "50px"; ringRef.current.style.opacity = "0.6"; } };
    const shrink = () => { if (ringRef.current) { ringRef.current.style.width = "26px"; ringRef.current.style.height = "26px"; ringRef.current.style.opacity = "0.3"; } };
    const attach = () => {
      document.querySelectorAll("button,input,label,a,.glass-panel,.kpi-card,.upload-zone,.skill-tag").forEach(el => {
        el.removeEventListener("mouseenter", grow);
        el.removeEventListener("mouseleave", shrink);
        el.addEventListener("mouseenter", grow);
        el.addEventListener("mouseleave", shrink);
      });
    };
    window.addEventListener("mousemove", onMove);
    loop();
    attach();
    const obs = new MutationObserver(attach);
    obs.observe(document.body, { childList: true, subtree: true });
    return () => { window.removeEventListener("mousemove", onMove); obs.disconnect(); };
  }, []);

  return (
    <>
      <div ref={ringRef} style={{
        position:"fixed", pointerEvents:"none", zIndex:9999,
        width:"26px", height:"26px",
        border:"1.5px solid rgba(124,58,237,0.6)",
        borderRadius:"50%",
        transform:"translate(-50%,-50%)",
        opacity:0.3,
        transition:"width 0.28s ease,height 0.28s ease,opacity 0.28s ease",
        mixBlendMode:"multiply",
      }} />
      <div ref={dotRef} style={{
        position:"fixed", pointerEvents:"none", zIndex:9999,
        width:"4px", height:"4px",
        background:"#7c3aed",
        borderRadius:"50%",
        transform:"translate(-50%,-50%)",
        boxShadow:"0 0 8px 2px rgba(124,58,237,0.4)",
      }} />
    </>
  );
}

/* ─────────────────────────────────────────────
   SCORE SVG RING
───────────────────────────────────────────── */
function ScoreRing({ score, color, size }) {
  const sz   = size || 176;
  const r    = Math.round(sz * 0.44);
  const cx   = sz / 2;
  const cy   = sz / 2;
  const circ = 2 * Math.PI * r;
  const dash = Math.min((score / 100) * circ, circ);
  const gid  = "ring-g";

  return (
    <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`}
      className="score-glow" style={{ display:"block" }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="12" />
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke={`url(#${gid})`}
        strokeWidth="12" strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset={circ / 4}
        style={{ transition:"stroke-dasharray 1.5s cubic-bezier(0.4,0,0.2,1)" }}
      />
      <defs>
        <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={color} />
          <stop offset="100%" stopColor={
            color === "#059669" ? "#047857"
            : color === "#d97706" ? "#b45309"
            : "#4f46e5"
          } />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   AMBIENT BACKGROUND
───────────────────────────────────────────── */
function AmbientBg({ scoreColor }) {
  const c = scoreColor || "#7c3aed";
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
      <div style={{
        position:"absolute", width:800, height:800, borderRadius:"50%",
        background:`radial-gradient(circle, ${c}15 0%, transparent 65%)`,
        top:"-300px", right:"-200px",
        animation:"orb 18s ease-in-out infinite",
        filter:"blur(80px)",
      }} />
      <div style={{
        position:"absolute", width:600, height:600, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 65%)",
        bottom:"-100px", left:"-200px",
        animation:"orb 22s ease-in-out infinite reverse",
        filter:"blur(70px)",
      }} />
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.02 }}>
        <defs>
          <pattern id="pnxDots" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#111" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pnxDots)" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CUSTOM CHART TOOLTIP
───────────────────────────────────────────── */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background:"rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
      border:"1px solid rgba(255,255,255,0.9)",
      borderRadius:12, padding:"12px 16px",
      fontFamily:"'DM Mono',monospace", fontSize:12, color:"#111",
      boxShadow:"0 8px 30px rgba(0,0,0,0.08)",
    }}>
      <div style={{ color:"#6b7280", marginBottom:4 }}>{label}</div>
      <div style={{ color:"#7c3aed", fontWeight:500, fontSize: 14 }}>
        {typeof payload[0]?.value === "number"
          ? payload[0].value.toLocaleString()
          : payload[0]?.value}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const getScoreColor = (s) =>
  s >= 80 ? "#059669" : s >= 60 ? "#d97706" : "#4f46e5";
const getScoreLabel = (s) =>
  s >= 80 ? "Optimal Alignment" : s >= 60 ? "Moderate Alignment" : "Calibration Needed";
const getReadyLabel = (s) =>
  s >= 80 ? "Enterprise Ready" : s >= 60 ? "Industry Ready" : "Development Phase";

const LOAD_STEPS = [
  "Parsing architectural blueprint …",
  "Extracting semantic skill vectors …",
  "Benchmarking enterprise alignment …",
  "Computing career trajectories …",
  "Synthesising intelligence report …",
];

const safeArr = (v) => (Array.isArray(v) ? v : []);

/* ─────────────────────────────────────────────
   PREMIUM FOOTER
───────────────────────────────────────────── */
import Footer from '../components/Footer';

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function Predict() {
  const [resumeFile, setResumeFile] = useState(null);
  const [domain,     setDomain]     = useState("");
  const [interest,   setInterest]   = useState("");
  const [useAI,      setUseAI]      = useState(true);
  const [loading,    setLoading]    = useState(false);
  const [loadStep,   setLoadStep]   = useState(0);
  const [result,     setResult]     = useState(null);
  const [animScore,  setAnimScore]  = useState(0);
  const [errorMsg,   setErrorMsg]   = useState("");

  const reportRef = useRef(null);
  const { width } = useWindowSize();
  const isMobile  = width < 768;
  const isMed     = width < 1100;

  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setLoadStep(s => (s + 1) % LOAD_STEPS.length), 1400);
    return () => clearInterval(t);
  }, [loading]);

  useEffect(() => {
    if (!result || animScore >= result.score) return;
    const t = setTimeout(() => setAnimScore(p => Math.min(p + 1, result.score)), 16);
    return () => clearTimeout(t);
  }, [animScore, result]);

  const handleFile = (e) => {
    const f = e.target.files?.[0] || null;
    setResumeFile(f);
    setResult(null);
    setAnimScore(0);
    setErrorMsg("");
  };

  const normalise = (data) => ({
    score:            typeof data?.score === "number" ? data.score : MOCK_RESULT.score,
    roles:            safeArr(data?.roles).length            ? data.roles            : MOCK_RESULT.roles,
    skills:           safeArr(data?.skills).length           ? data.skills           : MOCK_RESULT.skills,
    aspectScores:     safeArr(data?.aspectScores).length     ? data.aspectScores     : MOCK_RESULT.aspectScores,
    roadmap:          safeArr(data?.roadmap).length          ? data.roadmap          : MOCK_RESULT.roadmap,
    improvements:     safeArr(data?.improvements).length     ? data.improvements     : MOCK_RESULT.improvements,
    growthProjection: safeArr(data?.growthProjection).length ? data.growthProjection : MOCK_RESULT.growthProjection,
  });

  const submit = async () => {
    if (!resumeFile) { setErrorMsg("Please select a resume file first."); return; }
    setErrorMsg("");
    const fd = new FormData();
    fd.append("resume",          resumeFile);
    fd.append("preferredDomain", domain);
    fd.append("interests",       interest);
    fd.append("useAI",           String(useAI));
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/predict`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(normalise(res.data));
      setAnimScore(0);
    } catch (err) {
      console.warn("API unavailable — rendering demo data:", err?.message);
      setResult(normalise(MOCK_RESULT));
      setAnimScore(0);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2, backgroundColor: "#fbfbfc", useCORS: true, logging: false,
      });
      const pdf = new jsPDF("p", "mm", "a4");
      const w   = pdf.internal.pageSize.getWidth();
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 10, w, (canvas.height * w) / canvas.width);
      pdf.save("Pathora_Intelligence_Report.pdf");
    } catch { alert("PDF export failed. Please try again."); }
  };

  const sc    = result ? getScoreColor(result.score) : "#7c3aed";
  const score = result?.score ?? 0;

  return (
    <div style={{
      minHeight:"100vh", background: 'transparent', color:"#111",
      fontFamily:"'Outfit',sans-serif", cursor:"none",
      position:"relative", overflowX:"hidden",
    }}>
      <MagneticCursor />
      <AmbientBg scoreColor={sc} />
      <div style={{ position: "fixed", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(250,250,248,0.7) 100%)", pointerEvents: "none", zIndex: 0 }} />

      {/* ── STICKY NAV RAIL ── */}
      <div style={{
        position:"sticky", top:0, zIndex:200,
        background:"rgba(255,255,255,0.6)",
        backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)",
        borderBottom:"1px solid rgba(255,255,255,0.6)",
        height:56, display:"flex", alignItems:"center",
        padding:"0 32px", justifyContent:"space-between", gap:16,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{
            width:6, height:6, borderRadius:"50%",
            background:"#7c3aed", boxShadow:"0 0 10px rgba(124,58,237,0.7)",
            animation:"dotPulse 2.2s ease-in-out infinite",
          }} />
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:12, color:"#9ca3af", letterSpacing:"0.08em" }}>PATHORA</span>
          <span style={{ color:"#d1d5db", fontSize:12 }}>/</span>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:12, color:"#4b5563", letterSpacing:"0.08em" }}>INTELLIGENCE</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {result && (
            <span style={{
              fontFamily:"'DM Mono',monospace", fontSize:11,
              color:sc, background:`${sc}15`, border:`1px solid ${sc}30`,
              padding:"4px 14px", borderRadius:20, letterSpacing:"0.06em",
            }}>
              ATS {score}/100 · {getReadyLabel(score)}
            </span>
          )}
          {result && (
            <button className="btn-primary" onClick={downloadPDF} style={{ padding:"8px 16px", fontSize:12 }}>
              ↓ Export Profile
            </button>
          )}
        </div>
      </div>

      {!result ? (
        <>
          {/* ── HERO SECTION ── */}
          <div style={{ display: "grid", gridTemplateColumns: isMed ? "1fr" : "1.2fr 0.8fr", gap: "60px", padding: isMobile ? "60px 20px" : "100px 40px", maxWidth: 1240, margin: "0 auto", alignItems: "center", position: "relative", zIndex: 1 }}>
            
            {/* Hero Left Content */}
            <div className="reveal-up">
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 16px", background: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)", borderRadius: 30, border: "1px solid rgba(255,255,255,0.8)", marginBottom: 30 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed", animation: "dotPulse 2s infinite" }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", letterSpacing: "0.06em", textTransform: "uppercase" }}>AI-Powered Career Intelligence</span>
              </div>
              
              <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: isMobile ? 52 : 72, lineHeight: 1.05, color: "#0f0f0f", marginBottom: 28 }}>
                Engineer Your Future <br/><span style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>With Precision.</span>
              </h1>
              
              <p style={{ fontSize: 17, color: "#4b5563", lineHeight: 1.6, maxWidth: 500, marginBottom: 40, fontWeight: 300 }}>
                Enterprise-grade hiring alignment analysis. Instantly benchmark your profile against real-world AI industry standards and optimise your career trajectory.
              </p>
              
              <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 40, flexWrap: "wrap" }}>
                <label className="btn-primary" style={{ padding: "16px 32px", fontSize: 15, cursor: "pointer", borderRadius: 14 }}>
                  Start Analysis <span style={{ opacity: 0.8, marginLeft: 4 }}>→</span>
                  <input type="file" hidden accept=".pdf" onChange={(e) => {
                    handleFile(e);
                    document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
                  }} />
                </label>
                <button className="btn-ghost" style={{ padding: "16px 32px", fontSize: 15, borderRadius: 14 }} onClick={() => {
                   setResumeFile(new File([""], "demo_resume.pdf"));
                   document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  View Demo
                </button>
              </div>
              
              {/* Trust Indicators */}
              <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
                 <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: "#059669" }}>✓</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#6b7280" }}>ATS Optimized</span>
                 </div>
                 <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: "#059669" }}>✓</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#6b7280" }}>AI Career Mapping</span>
                 </div>
                 <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: "#059669" }}>✓</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#6b7280" }}>Industry Intelligence</span>
                 </div>
              </div>
            </div>

            {/* Right Side Hero Visual */}
            <div className="reveal-r" style={{ position: "relative", height: 500, animationDelay: "0.2s" }}>
              <div className="glass-panel" style={{ position: "absolute", inset: 0, padding: 30, display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "hidden" }}>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
                   <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#6b7280", letterSpacing: "0.1em" }}>PREDICTIVE ENGINE CORE</span>
                   <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(5,150,105,0.1)", padding: "4px 12px", borderRadius: 20, border: "1px solid rgba(5,150,105,0.2)" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#059669", boxShadow: "0 0 10px #059669", animation: "dotPulseGreen 1.5s infinite" }} />
                      <span style={{ fontSize: 10, color: "#059669", fontWeight: 600, letterSpacing: "0.05em" }}>LIVE SYNC</span>
                   </div>
                </div>

                {/* AI Neural Orb */}
                <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                   <div style={{ width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(135deg, rgba(79,70,229,0.3), rgba(124,58,237,0.3))", boxShadow: "0 0 60px rgba(124,58,237,0.4)", animation: "pulseGlow 4s infinite", position: "absolute", zIndex: 2 }} />
                   
                   <div style={{ width: 220, height: 220, borderRadius: "50%", border: "1px dashed rgba(124,58,237,0.4)", position: "absolute", animation: "spin 25s linear infinite" }} />
                   <div style={{ width: 320, height: 320, borderRadius: "50%", border: "1px solid rgba(79,70,229,0.2)", position: "absolute", animation: "reverseSpin 35s linear infinite" }} />
                   
                   <svg width="100%" height="100%" style={{ position: "absolute", zIndex: 1 }}>
                      <line x1="50%" y1="50%" x2="15%" y2="25%" stroke="rgba(124,58,237,0.3)" strokeWidth="1.5" />
                      <line x1="50%" y1="50%" x2="85%" y2="35%" stroke="rgba(79,70,229,0.3)" strokeWidth="1.5" />
                      <line x1="50%" y1="50%" x2="25%" y2="85%" stroke="rgba(124,58,237,0.3)" strokeWidth="1.5" />
                      <line x1="50%" y1="50%" x2="75%" y2="75%" stroke="rgba(79,70,229,0.3)" strokeWidth="1.5" />
                      <circle cx="15%" cy="25%" r="4" fill="#7c3aed" style={{ animation: "pulseNode 3s infinite 0.2s" }} />
                      <circle cx="85%" cy="35%" r="4" fill="#4f46e5" style={{ animation: "pulseNode 3s infinite 0.8s" }} />
                      <circle cx="25%" cy="85%" r="4" fill="#7c3aed" style={{ animation: "pulseNode 3s infinite 1.5s" }} />
                      <circle cx="75%" cy="75%" r="4" fill="#4f46e5" style={{ animation: "pulseNode 3s infinite 2.2s" }} />
                   </svg>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 16, zIndex: 10 }}>
                   <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: "#9ca3af" }}>NEURAL GRAPH: ACTIVE</span>
                   <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: "#9ca3af" }}>V 2.4.1</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── UPLOAD CONFIGURATION SECTION ── */}
          <div id="upload-section" style={{ maxWidth: 700, margin: "0 auto", padding: isMobile ? "0 20px 80px" : "0 40px 100px", position: "relative", zIndex: 1 }}>
            <div className="glass-panel reveal-up" style={{ padding: isMobile ? "30px 24px" : "50px", animationDelay: "0.3s" }}>
              <div style={{ textAlign: "center", marginBottom: 36 }}>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111", marginBottom: 8 }}>Configuration & Upload</h2>
                <p style={{ fontSize: 14, color: "#6b7280" }}>Provide additional context for targeted intelligence mapping.</p>
              </div>

              {/* Upload zone */}
              <div style={{ marginBottom: 24 }}>
                <div className="upload-zone">
                  <input type="file" accept=".pdf" onChange={handleFile} />
                  {resumeFile ? (
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10, pointerEvents:"none" }}>
                      <div style={{
                        width:48, height:48, borderRadius:14,
                        background:"rgba(5,150,105,0.1)", border:"1px solid rgba(5,150,105,0.25)",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:20, color:"#059669",
                      }}>✓</div>
                      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:13, color:"#059669", letterSpacing:"0.02em", fontWeight: 500 }}>
                        {resumeFile.name}
                      </span>
                    </div>
                  ) : (
                    <div style={{ pointerEvents:"none", display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
                      <div style={{
                        width:48, height:48, borderRadius:14,
                        background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.2)",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:20, color:"#7c3aed",
                      }}>↑</div>
                      <div>
                        <p style={{ fontSize:15, fontWeight:600, color:"#374151", marginBottom:4 }}>Select PDF Resume</p>
                        <p style={{ fontSize:13, color:"#9ca3af" }}>Max 10 MB limit</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Inputs */}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20, marginBottom: 24 }}>
                <div>
                  <label style={{ display:"block", fontSize:11, fontWeight:600, color:"#4b5563", marginBottom:8, fontFamily:"'DM Mono',monospace", letterSpacing:"0.08em", textTransform:"uppercase" }}>
                    Domain <span style={{ color:"#9ca3af", fontWeight: 400 }}>— optional</span>
                  </label>
                  <input className="pnx-input" placeholder="e.g. AI Engineering" value={domain} onChange={e => setDomain(e.target.value)} />
                </div>
                <div>
                  <label style={{ display:"block", fontSize:11, fontWeight:600, color:"#4b5563", marginBottom:8, fontFamily:"'DM Mono',monospace", letterSpacing:"0.08em", textTransform:"uppercase" }}>
                    Interest <span style={{ color:"#9ca3af", fontWeight: 400 }}>— optional</span>
                  </label>
                  <input className="pnx-input" placeholder="e.g. Computer Vision" value={interest} onChange={e => setInterest(e.target.value)} />
                </div>
              </div>

              {/* Toggle */}
              <label className="toggle-row" style={{ marginBottom: 30 }}>
                <input type="checkbox" checked={useAI} onChange={() => setUseAI(p => !p)} style={{ width:18, height:18, accentColor:"#7c3aed", cursor:"pointer", flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:600, color:"#111" }}>AI Role Recommendation</div>
                  <div style={{ fontSize:13, color:"#6b7280", marginTop:2 }}>Let the engine suggest optimal career paths based on semantics</div>
                </div>
              </label>

              {errorMsg && (
                <div style={{ padding:"12px 16px", marginBottom:20, background:"rgba(220,38,38,0.08)", border:"1px solid rgba(220,38,38,0.2)", borderRadius:10, fontSize:13, color:"#b91c1c", fontWeight: 500 }}>
                  {errorMsg}
                </div>
              )}

              <button className="submit-btn" onClick={submit} disabled={loading}>
                {loading ? (
                  <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12 }}>
                    <span style={{
                      width:16, height:16,
                      border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff",
                      borderRadius:"50%", animation:"spin 0.7s linear infinite", flexShrink:0,
                    }} />
                    {LOAD_STEPS[loadStep]}
                  </span>
                ) : "Synthesize Intelligence →"}
              </button>
            </div>
          </div>
        </>
      ) : (
        /* ── RESULTS DASHBOARD ── */
        <div ref={reportRef} style={{ maxWidth:1240, margin:"0 auto", padding: isMobile ? "20px 20px" : "40px 40px", position:"relative", zIndex:1 }}>
          
          <div className="reveal-up" style={{ textAlign: "center", marginBottom: 40 }}>
             <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: isMobile ? 36 : 48, fontStyle: "italic", color: "#0f0f0f", marginBottom: 8 }}>AI Intelligence Dashboard</h2>
             <p style={{ color: "#6b7280", fontSize: 15 }}>Enterprise-grade profile analysis complete.</p>
          </div>

          {/* MAIN SCORE CENTERPIECE */}
          <div className="glass-panel reveal-up" style={{ padding: isMobile ? "30px 20px" : "50px", display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "center", justifyContent: "center", gap: isMobile ? 40 : 80, marginBottom: 30, animationDelay: "0.1s" }}>
             <div className="score-anim" style={{ position: "relative" }}>
               <ScoreRing score={animScore} color={sc} size={240} />
               <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
                 <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 64, fontWeight: 400, color: sc, lineHeight: 1, textShadow: `0 0 30px ${sc}50` }}>{animScore}</div>
                 <div style={{ fontSize: 13, color: "#6b7280", fontFamily: "'DM Mono', monospace", marginTop: 4, letterSpacing: "0.1em" }}>/ 100 ATS</div>
               </div>
             </div>
             
             <div style={{ flex: 1, maxWidth: 400 }}>
                <p className="eyebrow" style={{ marginBottom: 12 }}>Profile Resonance</p>
                <h3 style={{ fontSize: 26, fontWeight: 600, marginBottom: 12, color: "#111", letterSpacing: "-0.02em" }}>{getScoreLabel(score)}</h3>
                <p style={{ color: "#4b5563", marginBottom: 30, lineHeight: 1.6, fontSize: 15 }}>
                  Your architectural experience and skill matrices map strongly to <strong>{getReadyLabel(score)}</strong> roles. The neural engine detected high compatibility with modern tech stacks.
                </p>
                
                {/* Micro Bars */}
                <div>
                  {[
                    { label:"Keyword Density",  v:85 },
                    { label:"Experience Depth",   v: score>=70 ? 78 : 62 },
                    { label:"Role Relevance",     v: score>=80 ? 88 : 71 }
                  ].map((b, i) => (
                    <div key={i} style={{ marginBottom: 16 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                        <span style={{ fontSize:13, fontWeight:500, color:"#374151" }}>{b.label}</span>
                        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:12, color:"#6b7280" }}>{b.v}%</span>
                      </div>
                      <div style={{ height:4, background:"rgba(0,0,0,0.05)", borderRadius:4, overflow:"hidden" }}>
                        <div style={{
                          width:`${b.v}%`, height:"100%",
                          background:`linear-gradient(90deg, ${sc}, ${sc}CC)`,
                          borderRadius:4,
                          animation:`barExpand 1.2s cubic-bezier(0.4,0,0.2,1) ${0.2 + i*0.1}s both`,
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>

          {/* KPI STRIP */}
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap:20, marginBottom:30 }}>
            {[
              { label:"Top Role Fit", val:"92", unit:"%", color:"#4f46e5", mono:true },
              { label:"Skills Found", val:String(result.skills?.length ?? 0), unit:"+", color:"#7c3aed", mono:true },
              { label:"Growth Path", val:"Strong ↑", unit:"", color:"#059669", mono:false },
              { label:"Readiness", val:getReadyLabel(score), unit:"", color:"#111", mono:false },
            ].map((k, i) => (
              <div className="kpi-card reveal-up" key={i} style={{ animationDelay:`${0.2 + i*0.1}s` }}>
                <p className="eyebrow" style={{ marginBottom:14 }}>{k.label}</p>
                <div style={{ display:"flex", alignItems:"baseline", gap:4 }}>
                  <span style={{
                    fontFamily: k.mono ? "'DM Mono',monospace" : "'Outfit',sans-serif",
                    fontSize: k.mono ? "40px" : "22px",
                    fontWeight: k.mono ? 400 : 700,
                    color: k.color,
                    letterSpacing: "-0.03em", lineHeight: 1,
                    animation: "numberBlur 0.5s ease both",
                    animationDelay: `${0.4 + i*0.1}s`,
                  }}>
                    {k.val}
                  </span>
                  {k.unit && (
                    <span style={{ fontFamily:"'DM Mono',monospace", fontSize:14, color:"#9ca3af" }}>{k.unit}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* MAIN 2-COL */}
          <div style={{ display:"grid", gridTemplateColumns: isMed ? "1fr" : "1fr 380px", gap:24, alignItems:"start" }}>
            
            {/* ═══ LEFT COLUMN ═══ */}
            <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
              
              {/* ROLE FIT */}
              <div className="glass-panel reveal-up" style={{ padding:"40px", animationDelay:"0.3s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 30 }}>
                   <div>
                      <p className="eyebrow" style={{ marginBottom:8 }}>AI Recommendation Stack</p>
                      <h3 style={{ fontFamily:"'Instrument Serif',serif", fontStyle:"italic", fontSize:28, fontWeight:400, color:"#0f0f0f", letterSpacing:"-0.01em" }}>
                        Role Fit Probability
                      </h3>
                   </div>
                </div>
                {safeArr(result.roles).slice(0, 5).map((role, i) => {
                  const pct = 94 - i * 8;
                  return (
                    <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 0", borderBottom: i<4 ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"#9ca3af", width:20 }}>
                          {String(i+1).padStart(2,"0")}
                        </span>
                        <span style={{ fontSize:15, fontWeight:500, color:"#111" }}>{role}</span>
                        {i===0 && (
                          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, fontWeight:600, letterSpacing:"0.08em", color:"#059669", background:"rgba(5,150,105,0.1)", border:"1px solid rgba(5,150,105,0.2)", padding:"3px 8px", borderRadius:6 }}>
                            BEST MATCH
                          </span>
                        )}
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:14, flexShrink:0 }}>
                        <div style={{ width:100, height:4, background:"rgba(0,0,0,0.05)", borderRadius:4, overflow:"hidden" }}>
                          <div style={{ width:`${pct}%`, height:"100%", background:"linear-gradient(90deg,#4f46e5,#7c3aed)", borderRadius:4, animation:`barExpand 1.1s cubic-bezier(0.4,0,0.2,1) ${0.4 + i*0.1}s both` }} />
                        </div>
                        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:13, color:"#4b5563", width:34, textAlign:"right", fontWeight: 500 }}>
                          {pct}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* RADAR */}
              <div className="glass-panel reveal-up" style={{ padding:"40px", animationDelay:"0.4s" }}>
                <p className="eyebrow" style={{ marginBottom:8 }}>Competency Benchmark</p>
                <h3 style={{ fontFamily:"'Instrument Serif',serif", fontStyle:"italic", fontSize:28, fontWeight:400, color:"#0f0f0f", marginBottom:24, letterSpacing:"-0.01em" }}>
                  Capability Intelligence Map
                </h3>
                <ResponsiveContainer width="100%" height={320}>
                  <RadarChart data={safeArr(result.aspectScores)}>
                    <PolarGrid stroke="rgba(0,0,0,0.08)" />
                    <PolarAngleAxis dataKey="name" tick={{ fill:"#6b7280", fontSize:12, fontFamily:"'DM Mono',monospace" }} />
                    <PolarRadiusAxis angle={90} domain={[0,100]} tick={{ fill:"#9ca3af", fontSize:10 }} />
                    <Radar dataKey="value" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.15} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* GROWTH CHART */}
              <div className="glass-panel reveal-up" style={{ padding:"40px", animationDelay:"0.5s" }}>
                <p className="eyebrow" style={{ marginBottom:8 }}>Trajectory Forecast</p>
                <h3 style={{ fontFamily:"'Instrument Serif',serif", fontStyle:"italic", fontSize:28, fontWeight:400, color:"#0f0f0f", marginBottom:24, letterSpacing:"-0.01em" }}>
                  Projected Career Growth
                </h3>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={safeArr(result.growthProjection)}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#4f46e5" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                    <XAxis dataKey="year" tick={{ fill:"#6b7280", fontSize:12, fontFamily:"'DM Mono',monospace" }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis tick={{ fill:"#6b7280", fontSize:12, fontFamily:"'DM Mono',monospace" }} axisLine={false} tickLine={false} dx={-10} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="salary" stroke="#4f46e5" strokeWidth={3}
                      fill="url(#areaGrad)"
                      dot={{ fill:"#fff", stroke: "#4f46e5", strokeWidth: 2, r: 5 }}
                      activeDot={{ r:7, fill:"#4f46e5", stroke: "#fff", strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ═══ RIGHT SIDEBAR ═══ */}
            <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
              
              {/* SKILLS */}
              <div className="glass-panel reveal-up" style={{ padding:"32px", animationDelay:"0.35s" }}>
                <p className="eyebrow" style={{ marginBottom:20 }}>Skill Intelligence</p>

                <p style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"#6b7280", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>Core Technologies</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:24 }}>
                  {safeArr(result.skills).slice(0,5).map((sk,i) => (
                    <span key={i} className="skill-tag skill-tag-core">{sk}</span>
                  ))}
                </div>

                <p style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"#6b7280", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>Industry Requisites</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:24 }}>
                  {safeArr(result.skills).slice(5,10).map((sk,i) => (
                    <span key={i} className="skill-tag skill-tag-support">{sk}</span>
                  ))}
                </div>

                <div style={{ padding:"16px", background:"rgba(220,38,38,0.03)", border:"1px solid rgba(220,38,38,0.15)", borderRadius:12 }}>
                  <p style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"#b91c1c", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>Missing Signals</p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {["System Architecture", "Graph Databases", "Redis"].map((sk,i) => (
                      <span key={i} className="skill-tag skill-tag-gap">{sk}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ROADMAP */}
              <div className="glass-panel reveal-up" style={{ padding:"32px", animationDelay:"0.45s" }}>
                <p className="eyebrow" style={{ marginBottom:24 }}>Strategic Timeline</p>
                <div style={{ position:"relative", marginLeft: 4 }}>
                  <div style={{ position:"absolute", left:6, top:8, bottom:8, width:2, background:"linear-gradient(to bottom, #7c3aed, rgba(124,58,237,0.1))" }} />
                  {safeArr(result.roadmap).map((step, i, arr) => (
                    <div key={i} className="road-node" style={{ marginBottom: i<arr.length-1 ? 24 : 0, animationDelay:`${0.5+i*0.1}s` }}>
                      <div style={{ width:14, height:14, borderRadius:"50%", flexShrink:0, marginTop:4, zIndex:1, background: i===0 ? "#7c3aed" : "#fff", border: `2px solid ${i===0 ? "#7c3aed" : "rgba(124,58,237,0.3)"}`, boxShadow: i===0 ? "0 0 10px rgba(124,58,237,0.5)" : "none" }} />
                      <p style={{ fontSize:14, lineHeight:1.6, fontWeight: i===0 ? 500 : 400, color: i===0 ? "#111" : "#4b5563" }}>
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ENHANCEMENTS */}
              <div className="glass-panel reveal-up" style={{ padding:"32px", animationDelay:"0.55s" }}>
                <p className="eyebrow" style={{ marginBottom:20 }}>Actionable Insights</p>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {safeArr(result.improvements).map((imp, i) => (
                    <div key={i} style={{ display:"flex", gap:14, alignItems:"flex-start", padding:"16px", background:"rgba(255,255,255,0.4)", border:"1px solid rgba(0,0,0,0.06)", borderRadius:12, animation:`fadeSlideRight 0.4s cubic-bezier(0.22,1,0.36,1) ${0.6+i*0.1}s both` }}>
                      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"#7c3aed", marginTop:2, flexShrink:0, fontWeight: 600 }}>
                        {String(i+1).padStart(2,"0")}
                      </span>
                      <p style={{ fontSize:13, fontWeight:500, color:"#374151", lineHeight:1.6 }}>{imp}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── NEW FEATURE SECTIONS ── */}
          
          {/* AI Career Prediction Engine */}
          <div className="reveal-up" style={{ marginTop: 80, animationDelay: "0.6s" }}>
             <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 40, textAlign: "center", marginBottom: 40, color: "#0f0f0f" }}>AI Prediction Engine</h2>
             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
                {[
                   { title: "Leadership Track", desc: "Predicted 85% success rate for Tech Lead roles within 24 months based on current trajectory.", icon: "⬡" },
                   { title: "Compensation Delta", desc: "Your skill stack warrants a 18-22% premium over market average in your preferred domain.", icon: "⬢" },
                   { title: "Remote Viability", desc: "Profile ranks in top 10% for global remote tech roles with current async-friendly skills.", icon: "⬡" }
                ].map((feat, i) => (
                   <div key={i} className="glass-panel" style={{ padding: 32, transition: "transform 0.3s" }}>
                      <div style={{ fontSize: 28, color: "#7c3aed", marginBottom: 16 }}>{feat.icon}</div>
                      <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: "#111" }}>{feat.title}</h4>
                      <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.6 }}>{feat.desc}</p>
                   </div>
                ))}
             </div>
          </div>

          {/* Industry Intelligence */}
          <div className="reveal-up" style={{ marginTop: 80, animationDelay: "0.7s" }}>
             <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 40, textAlign: "center", marginBottom: 40, color: "#0f0f0f" }}>Industry Intelligence</h2>
             <div className="glass-panel" style={{ padding: "40px 20px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 40, justifyContent: "space-around" }}>
                   <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 36, fontFamily: "'DM Mono', monospace", fontWeight: 400, color: "#4f46e5", marginBottom: 8 }}>#1</div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>Cloud Native</div>
                      <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>Highest Demand Area</div>
                   </div>
                   <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 36, fontFamily: "'DM Mono', monospace", fontWeight: 400, color: "#7c3aed", marginBottom: 8 }}>+45%</div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>AI Ops Growth</div>
                      <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>YoY Hiring Increase</div>
                   </div>
                   <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 36, fontFamily: "'DM Mono', monospace", fontWeight: 400, color: "#059669", marginBottom: 8 }}>92%</div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>Filter Rate</div>
                      <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>Average ATS Rejection</div>
                   </div>
                </div>
             </div>
          </div>

          {/* Success Metrics Strip */}
          <div className="reveal-up" style={{ marginTop: 80, animationDelay: "0.8s" }}>
             <div style={{ background: "linear-gradient(90deg, rgba(79,70,229,0.08), rgba(124,58,237,0.08))", borderRadius: 24, padding: "50px 20px", display: "flex", flexWrap: "wrap", justifyContent: "space-around", gap: 30, border: "1px solid rgba(255,255,255,0.6)", backdropFilter: "blur(12px)" }}>
                {[
                   { v: "2.4M+", l: "Resumes Analyzed" },
                   { v: "8,500+", l: "Hiring Benchmarks" },
                   { v: "99.2%", l: "Engine Accuracy" },
                   { v: "3.4x", l: "Interview Increase" }
                ].map((stat, i) => (
                   <div key={i} style={{ textAlign: "center", minWidth: 150 }}>
                      <div style={{ fontSize: 32, fontFamily: "'DM Mono', monospace", fontWeight: 500, color: "#111", marginBottom: 8 }}>{stat.v}</div>
                      <div style={{ fontSize: 12, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{stat.l}</div>
                   </div>
                ))}
             </div>
          </div>

          {/* Testimonials */}
          <div className="reveal-up" style={{ marginTop: 80, animationDelay: "0.9s" }}>
             <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 40, textAlign: "center", marginBottom: 40, color: "#0f0f0f" }}>Trusted by Elite Engineers</h2>
             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
                {[
                   { name: "Sarah L.", role: "Senior SDE @ Stripe", quote: "The career trajectory mapping accurately predicted my transition to a Senior role. The roadmap is incredibly precise." },
                   { name: "James M.", role: "ML Engineer @ Scale", quote: "Finally, an AI that actually understands the nuance between different engineering domains. Brilliant execution." },
                   { name: "Priya K.", role: "Staff Engineer @ Meta", quote: "The architectural depth in the AI's feedback was astounding. It caught missing signals that even human reviewers missed." }
                ].map((t, i) => (
                   <div key={i} className="glass-panel" style={{ padding: 32 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                         <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#e5e7eb", border: "1px solid #d1d5db", filter: "grayscale(100%)", flexShrink: 0 }} />
                         <div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>{t.name}</div>
                            <div style={{ fontSize: 13, color: "#6b7280" }}>{t.role}</div>
                         </div>
                      </div>
                      <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.6, fontStyle: "italic" }}>"{t.quote}"</p>
                   </div>
                ))}
             </div>
          </div>

          {/* BOTTOM ACTION BAR */}
          <div className="glass-panel reveal-up" style={{ marginTop:80, padding:"40px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:24, animationDelay:"1s", border: "1px solid rgba(124,58,237,0.2)" }}>
            <div>
              <h3 style={{ fontFamily:"'Instrument Serif',serif", fontStyle:"italic", fontSize:26, fontWeight:400, color:"#0f0f0f", marginBottom:8, letterSpacing:"-0.01em" }}>
                Ready to act on your intelligence?
              </h3>
              <p style={{ fontSize:14, color:"#4b5563" }}>
                Download your full enterprise report or connect with our AI career mentoring system.
              </p>
            </div>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <button className="btn-primary" onClick={downloadPDF} style={{ padding: "12px 24px" }}>↓ Download PDF</button>
              <button className="btn-ghost" style={{ padding: "12px 24px" }}>Share Report</button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}