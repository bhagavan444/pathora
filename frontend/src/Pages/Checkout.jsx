import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Shield, CreditCard, ChevronLeft, Cpu, Activity, Server, Zap } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import { LiquidGlassFooter } from "./HomeComponents.jsx";

const LOG_SEQUENCE = [
  { msg: "[AUTH] Verifying orchestration credentials...", delay: 0 },
  { msg: "[OK] Initializing recruiter heuristic engine...", delay: 600 },
  { msg: "[OK] Provisioning evaluation compute node...", delay: 1200 },
  { msg: "[OK] Allocating telemetry infrastructure...", delay: 1800 },
  { msg: "[OK] Activating genome analysis vectors...", delay: 2300 },
  { msg: "[OK] Deploying deterministic ATS pipelines...", delay: 2800 },
  { msg: "[OK] Infrastructure activation complete.", delay: 3400 }
];

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const tier = searchParams.get("tier") || "Engineer";
  const isAnnual = searchParams.get("annual") === "true";

  const [isDeploying, setIsDeploying] = useState(false);
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDeploy = (e) => {
    e.preventDefault();
    setIsDeploying(true);
    
    let activeTimers = [];
    
    // Simulate logs
    LOG_SEQUENCE.forEach((log) => {
      const timer = setTimeout(() => {
        setLogs(prev => [...prev, log.msg]);
      }, log.delay);
      activeTimers.push(timer);
    });

    // Simulate progress bar
    let p = 0;
    const interval = setInterval(() => {
      p += (100 / (3400 / 50));
      if(p > 100) p = 100;
      setProgress(p);
    }, 50);
    
    // Final routing
    setTimeout(() => {
      clearInterval(interval);
      // Persist to fake backend (localStorage)
      localStorage.setItem("pathora_tier", tier);
      localStorage.setItem("pathora_subscription", JSON.stringify({
        tier,
        status: "active",
        billing: isAnnual ? "annual" : "monthly",
        activatedAt: new Date().toISOString()
      }));
      // Generate fake API token
      localStorage.setItem("pathora_api_token", `pnx_live_${Math.random().toString(36).substring(2,15)}`);
      
      navigate("/subscription");
    }, 4000);
    
    return () => {
      activeTimers.forEach(clearTimeout);
      clearInterval(interval);
    };
  };

  const price = tier === "Architect" ? (isAnnual ? 24 : 29) : (isAnnual ? 10 : 12);
  const total = isAnnual ? price * 12 : price;

  return (
    <>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "var(--bg)", paddingTop: 100, paddingBottom: 60, position: "relative", overflow: "hidden" }}>
        
        {/* Ambient background */}
        <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, background: "radial-gradient(circle, rgba(124, 58, 237, 0.05) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />
        
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
          <button onClick={() => navigate("/plans")} style={{ background: "transparent", border: "none", display: "flex", alignItems: "center", gap: 6, color: "var(--ts)", cursor: "pointer", fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500, marginBottom: 32 }}>
            <ChevronLeft size={16} /> Return to Infrastructure Tiers
          </button>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 40 }}>
            
            {/* Left: Checkout Form */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 style={{ fontSize: 24, fontWeight: 400, fontFamily: "var(--display)", marginBottom: 8, color: "var(--tp)" }}>Provision Compute Node</h1>
              <p style={{ fontSize: 13, color: "var(--ts)", marginBottom: 32 }}>Deploy your deterministic evaluation environment.</p>

              <form onSubmit={handleDeploy} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--tm)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 600 }}>Billing Details</div>
                  
                  <input required type="email" placeholder="Email Address" style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.7)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 12, fontSize: 14, fontFamily: "var(--sans)", color: "var(--tp)", outline: "none" }} />
                  <input required type="text" placeholder="Company / Organization" style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.7)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 12, fontSize: 14, fontFamily: "var(--sans)", color: "var(--tp)", outline: "none" }} />
                  
                  <select style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.7)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 12, fontSize: 14, fontFamily: "var(--sans)", color: "var(--tp)", outline: "none" }}>
                    <option>US-East (Virginia) - Main Cluster</option>
                    <option>US-West (Oregon) - Edge Node</option>
                    <option>EU-Central (Frankfurt) - Compliant Node</option>
                  </select>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 12 }}>
                  <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--tm)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 600 }}>Payment Method</div>
                  
                  <div style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 12, overflow: "hidden" }}>
                    <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid rgba(0,0,0,0.06)", padding: "12px 16px" }}>
                      <CreditCard size={18} color="var(--ts)" style={{ marginRight: 12 }} />
                      <input required type="text" placeholder="Card Number" style={{ width: "100%", background: "transparent", border: "none", fontSize: 14, fontFamily: "var(--sans)", color: "var(--tp)", outline: "none" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input required type="text" placeholder="MM / YY" style={{ width: "50%", padding: "12px 16px", background: "transparent", border: "none", borderRight: "1px solid rgba(0,0,0,0.06)", fontSize: 14, fontFamily: "var(--sans)", color: "var(--tp)", outline: "none" }} />
                      <input required type="text" placeholder="CVC" style={{ width: "50%", padding: "12px 16px", background: "transparent", border: "none", fontSize: 14, fontFamily: "var(--sans)", color: "var(--tp)", outline: "none" }} />
                    </div>
                  </div>
                </div>

                <button type="submit" style={{ width: "100%", padding: "14px", background: "#0f0f0f", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 600, fontFamily: "var(--sans)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.3s" }} onMouseEnter={e => e.target.style.background = "#1a1a1a"} onMouseLeave={e => e.target.style.background = "#0f0f0f"}>
                  <Zap size={16} /> Deploy Infrastructure
                </button>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, opacity: 0.6 }}>
                  <Shield size={12} />
                  <span style={{ fontSize: 11, fontFamily: "var(--sans)", fontWeight: 500 }}>256-bit orchestration encryption. Secure checkout.</span>
                </div>
              </form>
            </motion.div>

            {/* Right: Summary Panel */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              <div style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(24px)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 24, padding: 32, boxShadow: "0 12px 40px rgba(0,0,0,0.03)" }}>
                <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--accent)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700, marginBottom: 8 }}>
                  Tier Selected
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "var(--sans)", color: "var(--tp)", marginBottom: 24, borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: 24 }}>
                  {tier} Infrastructure
                  <span style={{ display: "block", fontSize: 13, color: "var(--ts)", fontWeight: 400, marginTop: 4 }}>
                    {isAnnual ? "Annual Billing Cycle" : "Monthly Billing Cycle"}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Cpu size={14} color="var(--tm)" /><span style={{ fontSize: 13, color: "var(--tp)" }}>Compute Limit</span></div>
                    <span style={{ fontSize: 13, fontFamily: "var(--mono)", fontWeight: 600 }}>{tier === "Architect" ? "Unlimited" : "100/mo"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Activity size={14} color="var(--tm)" /><span style={{ fontSize: 13, color: "var(--tp)" }}>Telemetry Retention</span></div>
                    <span style={{ fontSize: 13, fontFamily: "var(--mono)", fontWeight: 600 }}>{tier === "Architect" ? "1 Year" : "30 Days"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Server size={14} color="var(--tm)" /><span style={{ fontSize: 13, color: "var(--tp)" }}>Orchestration Node</span></div>
                    <span style={{ fontSize: 13, fontFamily: "var(--mono)", fontWeight: 600 }}>Dedicated</span>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 14, color: "var(--ts)" }}>Subtotal</span>
                    <span style={{ fontSize: 14, fontFamily: "var(--mono)", color: "var(--tp)" }}>${total}.00</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 14, color: "var(--ts)" }}>Infrastructure Tax (0%)</span>
                    <span style={{ fontSize: 14, fontFamily: "var(--mono)", color: "var(--tp)" }}>$0.00</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 600, color: "var(--tp)" }}>Total due today</span>
                    <span style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--mono)", color: "var(--tp)" }}>${total}.00</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <LiquidGlassFooter />

      {/* Cinematic Provisioning Overlay */}
      <AnimatePresence>
        {isDeploying && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(10, 10, 12, 0.95)", backdropFilter: "blur(24px)", zIndex: 99999, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff", padding: 24 }}
          >
            <div style={{ width: "100%", maxWidth: 600, background: "#0a0a0c", borderRadius: 16, border: "1px solid rgba(255,255,255,0.1)", padding: 32, boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 16 }}>
                <Cpu size={18} color="var(--accent)" />
                <span style={{ fontSize: 12, fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>Deploying Cluster</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, minHeight: 200, fontFamily: "var(--mono)", fontSize: 13, color: "#a1a1aa" }}>
                {logs.map((log, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                    <span style={{ color: log.includes("[AUTH]") ? "#fcd34d" : "#34d399", marginRight: 8 }}>{log.split("] ")[0]}]</span>
                    {log.split("] ")[1]}
                  </motion.div>
                ))}
              </div>

              <div style={{ marginTop: 24, height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 100, overflow: "hidden" }}>
                <motion.div 
                  style={{ height: "100%", background: "var(--accent)", width: `${progress}%` }} 
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
