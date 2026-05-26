import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Copy, Terminal, Zap, ExternalLink } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import { LiquidGlassFooter } from "./HomeComponents.jsx";

export default function Subscription() {
  const navigate = useNavigate();
  const [tier, setTier] = useState("Explorer");
  const [apiToken, setApiToken] = useState("");
  const [copied, setCopied] = useState(false);
  const [invoiceId, setInvoiceId] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedTier = localStorage.getItem("pathora_tier");
    const storedToken = localStorage.getItem("pathora_api_token");
    if (storedTier) setTier(storedTier);
    if (storedToken) setApiToken(storedToken);
    
    // Generate fake invoice ID
    setInvoiceId(`INV-${Math.random().toString(36).substring(2,8).toUpperCase()}-${new Date().getFullYear()}`);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "var(--bg)", paddingTop: 120, paddingBottom: 60, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center" }}>
        
        {/* Ambient background */}
        <div style={{ position: "absolute", top: -100, left: -100, width: 600, height: 600, background: "radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 60%)", filter: "blur(60px)", pointerEvents: "none" }} />
        
        <div style={{ width: "100%", maxWidth: 640, padding: "0 24px", position: "relative", zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(24px)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 24, padding: 48, boxShadow: "0 24px 64px rgba(0,0,0,0.04)" }}>
            
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle2 size={32} color="#10b981" />
              </div>
            </div>
            
            <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "var(--display)", textAlign: "center", marginBottom: 8, color: "var(--tp)", letterSpacing: "-0.04em" }}>Infrastructure Activated</h1>
            <p style={{ fontSize: 14, color: "var(--ts)", textAlign: "center", marginBottom: 40 }}>Your {tier} compute node has been successfully provisioned.</p>

            <div style={{ background: "rgba(0,0,0,0.02)", borderRadius: 16, padding: 24, marginBottom: 32, border: "1px dashed rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--tm)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700, marginBottom: 16 }}>Deployment Receipt</div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "var(--ts)" }}>Invoice ID</span>
                  <span style={{ fontSize: 13, fontFamily: "var(--mono)", color: "var(--tp)", fontWeight: 600 }}>{invoiceId}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "var(--ts)" }}>Active Tier</span>
                  <span style={{ fontSize: 13, fontFamily: "var(--mono)", color: "var(--tp)", fontWeight: 600 }}>{tier}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "var(--ts)" }}>Orchestration Level</span>
                  <span style={{ fontSize: 13, fontFamily: "var(--mono)", color: "var(--tp)", fontWeight: 600 }}>Production</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "var(--ts)" }}>Activation Region</span>
                  <span style={{ fontSize: 13, fontFamily: "var(--mono)", color: "var(--tp)", fontWeight: 600 }}>US-East-1a</span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 40 }}>
              <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--tm)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700, marginBottom: 12 }}>API Access Token</div>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1, background: "#0a0a0c", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)" }}>
                  <code style={{ fontSize: 13, fontFamily: "var(--mono)", color: "#34d399", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{apiToken}</code>
                </div>
                <button onClick={handleCopy} style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ts)", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background="rgba(0,0,0,0.08)"} onMouseLeave={e => e.currentTarget.style.background="rgba(0,0,0,0.04)"}>
                  {copied ? <CheckCircle2 size={16} color="#10b981" /> : <Copy size={16} />}
                </button>
              </div>
              <p style={{ fontSize: 12, color: "var(--ts)", marginTop: 8 }}>Keep this token secure. It grants full access to your evaluation pipelines.</p>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => navigate("/console")} style={{ flex: 1, padding: "14px", background: "#0f0f0f", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 600, fontFamily: "var(--sans)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.3s" }} onMouseEnter={e => e.target.style.background = "#1a1a1a"} onMouseLeave={e => e.target.style.background = "#0f0f0f"}>
                <Terminal size={16} /> Enter Console
              </button>
              <button onClick={() => navigate("/billing")} style={{ flex: 1, padding: "14px", background: "transparent", color: "var(--tp)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 12, fontSize: 14, fontWeight: 600, fontFamily: "var(--sans)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.3s" }} onMouseEnter={e => e.target.style.background = "rgba(0,0,0,0.03)"} onMouseLeave={e => e.target.style.background = "transparent"}>
                <ExternalLink size={16} /> View Billing
              </button>
            </div>

          </motion.div>
        </div>
      </div>
      <LiquidGlassFooter />
    </>
  );
}
