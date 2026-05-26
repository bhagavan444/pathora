import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Terminal, Activity, Database, Server, Zap, Cpu, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import { LiquidGlassFooter } from "./HomeComponents.jsx";

const LIVE_LOGS = [
  "GET /v1/telemetry/nodes - 200 OK (12ms)",
  "POST /v1/evaluate/orchestration - 202 ACCEPTED (4ms)",
  "[INFO] Vector mappings synchronized across US-East pool.",
  "GET /v1/recruiter/sim - 200 OK (89ms)",
  "[WARN] High latency detected on EU-Central gateway. Rerouting traffic.",
  "[INFO] Traffic successfully rerouted to US-West edge.",
  "POST /v1/evaluate/pipeline - 201 CREATED (112ms)",
  "[INFO] Genome analysis complete for profile usr_942x8v.",
  "GET /v1/health - 200 OK (2ms)",
  "[INFO] Autoscaling orchestration workers to handle load."
];

export default function Console() {
  const [logs, setLogs] = useState([]);
  const [tier, setTier] = useState("Explorer");
  const [apiRequests, setApiRequests] = useState(14023);

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedTier = localStorage.getItem("pathora_tier");
    if (storedTier) setTier(storedTier);

    let currentIndex = 0;
    const interval = setInterval(() => {
      setLogs(prev => {
        const newLogs = [...prev, LIVE_LOGS[currentIndex % LIVE_LOGS.length]];
        if (newLogs.length > 8) newLogs.shift();
        return newLogs;
      });
      setApiRequests(prev => prev + Math.floor(Math.random() * 5) + 1);
      currentIndex++;
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "var(--bg)", paddingTop: 100, paddingBottom: 60, display: "flex", flexDirection: "column" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", width: "100%", flex: 1, display: "flex", flexDirection: "column" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: "#0a0a0c", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.1)" }}>
                <Terminal size={24} color="#34d399" />
              </div>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 600, fontFamily: "var(--sans)", color: "var(--tp)" }}>Infrastructure Console</h1>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px rgba(16, 185, 129, 0.6)" }} />
                  <span style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--tm)", textTransform: "uppercase", letterSpacing: ".05em" }}>{tier} Node Active • US-East</span>
                </div>
              </div>
            </div>
            <button style={{ padding: "10px 20px", background: "transparent", color: "var(--tp)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 12, fontSize: 13, fontWeight: 600, fontFamily: "var(--sans)", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              Open Settings <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 24, flex: 1 }}>
            
            {/* Live Terminal Panel */}
            <div style={{ background: "#0a0a0c", borderRadius: 24, border: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }}>
              <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f56" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#27c93f" }} />
                <span style={{ fontSize: 11, fontFamily: "var(--mono)", color: "rgba(255,255,255,0.3)", marginLeft: 16 }}>infrastructure-node-v2.1.4</span>
              </div>
              <div style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column", gap: 12, fontFamily: "var(--mono)", fontSize: 13, color: "#a1a1aa", minHeight: 400 }}>
                {logs.map((log, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <span style={{ color: "rgba(255,255,255,0.2)" }}>{new Date().toISOString().split('T')[1].substring(0, 8)}</span>
                    <span style={{ color: log.includes("[WARN]") ? "#fcd34d" : log.includes("[INFO]") ? "#60a5fa" : "#34d399" }}>
                      {log}
                    </span>
                  </motion.div>
                ))}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto", color: "#34d399" }}>
                  <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}>_</motion.div>
                </div>
              </div>
            </div>

            {/* Live Metrics Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(24px)", borderRadius: 20, border: "1px solid rgba(0,0,0,0.06)", padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <Zap size={16} color="var(--tp)" />
                  <span style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--tm)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 600 }}>API Requests (24h)</span>
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, fontFamily: "var(--sans)", color: "var(--tp)", letterSpacing: "-0.02em" }}>
                  {apiRequests.toLocaleString()}
                </div>
              </div>

              <div style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(24px)", borderRadius: 20, border: "1px solid rgba(0,0,0,0.06)", padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <Activity size={16} color="var(--tp)" />
                  <span style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--tm)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 600 }}>P99 Latency</span>
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, fontFamily: "var(--sans)", color: "var(--tp)", letterSpacing: "-0.02em" }}>
                  12.4<span style={{ fontSize: 16, color: "var(--ts)", marginLeft: 4 }}>ms</span>
                </div>
              </div>

              <div style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(24px)", borderRadius: 20, border: "1px solid rgba(0,0,0,0.06)", padding: 24, flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <Database size={16} color="var(--tp)" />
                  <span style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--tm)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 600 }}>Pipelines</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: "var(--ts)" }}>Recruiter Scan</span>
                    <span style={{ fontSize: 12, fontFamily: "var(--mono)", color: "#10b981", fontWeight: 600 }}>ACTIVE</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: "var(--ts)" }}>Genome Gen</span>
                    <span style={{ fontSize: 12, fontFamily: "var(--mono)", color: "#10b981", fontWeight: 600 }}>ACTIVE</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: "var(--ts)" }}>Batch Exports</span>
                    <span style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--tm)", fontWeight: 600 }}>{tier === "Enterprise Infrastructure" ? "ACTIVE" : "DISABLED"}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
