import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RevealSection, LiquidGlassFooter } from "./HomeComponents";
import "./Home.css";

export default function Contact() {
  const [formState, setFormState] = useState("idle");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormState("transmitting");
    setTimeout(() => setFormState("success"), 1500);
  };

  return (
    <div className="home-wrap">
      <div className="grid-bg" />

      <section className="hero-sec" style={{ paddingTop: "140px", paddingBottom: "60px", minHeight: "auto", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto" }}>
          <div className="hero-badge" style={{ margin: "0 auto 24px" }}>
            <span className="hero-badge-tag">SECURE COMMUNICATION</span>
          </div>
          <h1 className="hero-h1" style={{ maxWidth: "100%", margin: "0 auto 24px" }}>
            Network <em>Access.</em>
          </h1>
          <p className="hero-sub" style={{ margin: "0 auto 40px", maxWidth: 650 }}>
            Establish a direct connection with Pathora engineering, research, and support nodes. All transmissions are encrypted and routed via priority infrastructure.
          </p>
        </motion.div>
      </section>

      <RevealSection className="sec" style={{ paddingTop: 0 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 60 }}>
          
          {/* Left: SLA & Nodes */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--tm)", letterSpacing: ".1em", marginBottom: 16 }}>ROUTING DIRECTORY</div>
            
            {[
              { title: "Enterprise Inquiry", desc: "For scaling evaluation engines across organizations.", sla: "< 2 Hrs SLA", color: "var(--accent)" },
              { title: "Research Collaboration", desc: "Connect with our deterministic modeling architects.", sla: "< 12 Hrs SLA", color: "var(--accent2)" },
              { title: "Infrastructure Support", desc: "Report telemetry anomalies or API integration faults.", sla: "< 1 Hr SLA", color: "var(--success)" }
            ].map((node) => (
              <div key={node.title} style={{ 
                padding: 24, background: "rgba(255,255,255,0.6)", backdropFilter: "blur(20px)", 
                borderRadius: 16, border: "1px solid rgba(0,0,0,0.06)", display: "flex", gap: 20 
              }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: node.color, marginTop: 6, boxShadow: `0 0 12px ${node.color}` }} />
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "var(--tp)" }}>{node.title}</div>
                    <div style={{ fontSize: 10, fontFamily: "var(--mono)", background: "rgba(0,0,0,0.04)", padding: "4px 8px", borderRadius: 100 }}>{node.sla}</div>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--ts)", lineHeight: 1.5 }}>{node.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Contact Form */}
          <div style={{ 
            background: "#fff", borderRadius: 24, padding: 40, border: "1px solid rgba(0,0,0,0.08)", 
            boxShadow: "0 20px 40px rgba(0,0,0,0.03)", position: "relative", overflow: "hidden" 
          }}>
            <AnimatePresence mode="wait">
              {formState === "idle" ? (
                <motion.form key="form" onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: 16 }}>
                    <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--tp)", letterSpacing: ".1em" }}>SECURE TRANSMISSION</div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)" }} />
                      <span style={{ fontSize: 10, fontFamily: "var(--mono)", color: "var(--success)" }}>ENCRYPTED</span>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <label style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--tm)" }}>NODE IDENTITY</label>
                      <input type="text" required placeholder="Name" style={{ padding: "14px 16px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.1)", outline: "none", fontSize: 14, fontFamily: "var(--mono)" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <label style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--tm)" }}>RETURN VECTOR</label>
                      <input type="email" required placeholder="Email" style={{ padding: "14px 16px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.1)", outline: "none", fontSize: 14, fontFamily: "var(--mono)" }} />
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <label style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--tm)" }}>ROUTING PATH</label>
                    <select style={{ padding: "14px 16px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.1)", outline: "none", fontSize: 14, fontFamily: "var(--mono)", appearance: "none" }}>
                      <option>Enterprise Inquiry</option>
                      <option>Research Collaboration</option>
                      <option>Infrastructure Support</option>
                    </select>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <label style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--tm)" }}>PAYLOAD</label>
                    <textarea required placeholder="Transmit your request details..." rows={5} style={{ padding: "14px 16px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.1)", outline: "none", fontSize: 14, fontFamily: "var(--sans)", resize: "none" }} />
                  </div>

                  <button type="submit" className="btn-glass-primary" style={{ justifyContent: "center", padding: "16px", marginTop: 8 }}>
                    Transmit Payload
                  </button>
                </motion.form>
              ) : formState === "transmitting" ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid rgba(129, 140, 248, 0.2)", borderTopColor: "var(--accent)", animation: "spin 1s linear infinite" }} />
                  <div style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--accent)", letterSpacing: ".1em" }}>ROUTING PAYLOAD...</div>
                </motion.div>
              ) : (
                <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, textAlign: "center" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(52, 211, 153, 0.1)", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 8 }}>
                    ✓
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 600, color: "var(--tp)" }}>Transmission Verified</h3>
                  <p style={{ fontSize: 14, color: "var(--ts)", lineHeight: 1.5, maxWidth: 300 }}>
                    Payload successfully routed to Pathora network nodes. Awaiting SLA response protocol.
                  </p>
                  <button className="btn-glass-outline" onClick={() => setFormState("idle")} style={{ marginTop: 24 }}>
                    New Transmission
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </RevealSection>

      <LiquidGlassFooter />
    </div>
  );
}