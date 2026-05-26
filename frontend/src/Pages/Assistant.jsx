import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LiquidGlassFooter } from "./HomeComponents";
import "./Home.css";

export default function Assistant() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "system",
      text: "Intelligence Copilot initialized. Evaluation models synchronized. Ready to analyze deployment signals, architecture capability, and recruiter heuristics.",
      time: new Date().toLocaleTimeString()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = { role: "user", text: input, time: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "system",
        text: "Analyzing vector paths... Deterministic response mapping generated. You should focus on increasing test coverage and highlighting CI/CD deployment pipelines to optimize recruiter confidence scoring.",
        time: new Date().toLocaleTimeString()
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="home-wrap" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="grid-bg" style={{ opacity: 0.5 }} />

      <div style={{ flex: 1, display: "flex", paddingTop: 100, paddingBottom: 40, paddingLeft: "clamp(20px, 4vw, 60px)", paddingRight: "clamp(20px, 4vw, 60px)", maxWidth: 1600, margin: "0 auto", width: "100%", gap: 40, alignItems: "stretch" }}>
        
        {/* LEFT: Main Chat Console */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
          style={{ flex: 2, display: "flex", flexDirection: "column", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(24px)", borderRadius: 24, border: "1px solid rgba(0,0,0,0.06)", overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,0.03), inset 0 0 20px rgba(255,255,255,0.5)" }}
        >
          <div style={{ padding: "20px 30px", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.4)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", animation: "pulse 2s infinite", boxShadow: "0 0 12px var(--accent)" }} />
              <div style={{ fontSize: 13, fontFamily: "var(--mono)", fontWeight: 600, letterSpacing: ".05em", color: "var(--tp)" }}>
                Engineering Copilot Session
              </div>
            </div>
            <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--tm)", background: "rgba(0,0,0,0.04)", padding: "4px 10px", borderRadius: 100 }}>
              Model: Deterministic Engine v2.4
            </div>
          </div>

          <div style={{ flex: 1, padding: "30px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 24 }}>
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start", gap: 6 }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 4px" }}>
                    {msg.role === "system" && <i className="devicon-bash-plain" style={{ fontSize: 12, color: "var(--accent)" }} />}
                    <span style={{ fontSize: 10, fontFamily: "var(--mono)", color: "var(--tm)", textTransform: "uppercase" }}>
                      {msg.role === "user" ? "Client Node" : "Intelligence Copilot"} • {msg.time}
                    </span>
                  </div>
                  <div style={{ 
                    maxWidth: "80%", padding: "16px 20px", borderRadius: 16, fontSize: 14, lineHeight: 1.6, color: "var(--tp)",
                    background: msg.role === "user" ? "rgba(129, 140, 248, 0.1)" : "rgba(255,255,255,0.8)",
                    border: msg.role === "user" ? "1px solid rgba(129, 140, 248, 0.2)" : "1px solid rgba(0,0,0,0.04)",
                    borderBottomRightRadius: msg.role === "user" ? 4 : 16,
                    borderBottomLeftRadius: msg.role === "system" ? 4 : 16,
                    fontFamily: msg.role === "system" ? "var(--mono)" : "var(--sans)",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.01)"
                  }}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: 6, padding: "16px 24px", background: "rgba(255,255,255,0.8)", borderRadius: 16, alignSelf: "flex-start", border: "1px solid rgba(0,0,0,0.04)" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--tm)", animation: "pulse 1s infinite" }} />
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--tm)", animation: "pulse 1s infinite 0.2s" }} />
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--tm)", animation: "pulse 1s infinite 0.4s" }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div style={{ padding: "20px 30px", borderTop: "1px solid rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.4)" }}>
            <form onSubmit={handleSend} style={{ display: "flex", gap: 12, position: "relative" }}>
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Query deterministic capabilities or architecture heuristics..." 
                style={{ flex: 1, padding: "16px 20px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.08)", background: "#fff", fontSize: 14, fontFamily: "var(--mono)", outline: "none", boxShadow: "inset 0 2px 6px rgba(0,0,0,0.02)" }}
              />
              <button type="submit" className="btn-glass-primary" style={{ padding: "0 24px", borderRadius: 12 }}>
                Transmit
              </button>
            </form>
          </div>
        </motion.div>

        {/* RIGHT: Telemetry & Recommendations */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24, minWidth: 320 }}
        >
          {/* Telemetry Stream */}
          <div style={{ background: "rgba(5, 8, 22, 0.9)", backdropFilter: "blur(20px)", borderRadius: 20, padding: 24, color: "#fff", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ fontSize: 10, fontFamily: "var(--mono)", color: "rgba(255,255,255,0.4)", letterSpacing: ".1em", marginBottom: 16 }}>LIVE TELEMETRY</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Vector Load Latency", val: "14ms", color: "var(--success)" },
                { label: "Recruiter Trust Heuristic", val: "Active", color: "var(--accent)" },
                { label: "Architecture Scan", val: "Idle", color: "rgba(255,255,255,0.5)" }
              ].map(t => (
                <div key={t.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 8 }}>
                  <span style={{ fontSize: 12, fontFamily: "var(--mono)", color: "rgba(255,255,255,0.7)" }}>{t.label}</span>
                  <span style={{ fontSize: 12, fontFamily: "var(--mono)", color: t.color, fontWeight: 600 }}>{t.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(20px)", borderRadius: 20, padding: 24, border: "1px solid rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 10, fontFamily: "var(--mono)", color: "var(--tm)", letterSpacing: ".1em", marginBottom: 16 }}>ARCHITECTURE RECOMMENDATIONS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: "#fff", padding: 16, borderRadius: 12, border: "1px solid rgba(0,0,0,0.04)", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--tp)", marginBottom: 4 }}>Migrate to Kubernetes</div>
                <div style={{ fontSize: 12, color: "var(--ts)", lineHeight: 1.5 }}>Your profile shows heavy Docker usage. Mapping k8s orchestration will increase recruiter trust by 18%.</div>
              </div>
              <div style={{ background: "#fff", padding: 16, borderRadius: 12, border: "1px solid rgba(0,0,0,0.04)", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--tp)", marginBottom: 4 }}>Quantify CI/CD Impacts</div>
                <div style={{ fontSize: 12, color: "var(--ts)", lineHeight: 1.5 }}>Missing deterministic latency metrics in project 2. Add build-time reduction percentages.</div>
              </div>
            </div>
          </div>

        </motion.div>
      </div>

      <LiquidGlassFooter />
    </div>
  );
}
