import React, { useEffect, useRef, useState } from "react";
import { TECH_STACK, FOOTER_COLS } from "./HomeData";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

/* ── Glass Style Helpers ── */
const glass = (extra = {}) => ({
  background: "rgba(255,255,255,0.65)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.8)",
  boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
  borderRadius: 20,
  ...extra,
});

const glassStrong = (extra = {}) => ({
  background: "rgba(255,255,255,0.4)",
  backdropFilter: "blur(30px)",
  WebkitBackdropFilter: "blur(30px)",
  border: "1px solid rgba(255, 255, 255, 0.8)",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
  borderRadius: 24,
  ...extra,
});

/* ── Scroll Reveal Hook ── */
export function RevealSection({ children, className, style, delay = 0 }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.section>
  );
}

export function RevealDiv({ children, className, style, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ── Animated Counter ── */
export function AnimatedCounter({ end, label, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && !started) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started) return;
    let cur = 0;
    const step = Math.ceil(end / 50);
    const t = setInterval(() => {
      cur += step;
      if (cur >= end) { cur = end; clearInterval(t); }
      setCount(cur);
    }, 30);
    return () => clearInterval(t);
  }, [started, end]);
  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div style={{
        fontSize: "clamp(36px,5vw,52px)", fontWeight: 800, fontFamily: "var(--sans)",
        background: "linear-gradient(135deg, #818cf8, #a78bfa, #67e8f9)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        marginBottom: 8,
      }}>{count}{suffix}</div>
      <div style={{ fontSize: 13, color: "var(--tm)", fontWeight: 500, letterSpacing: ".02em" }}>{label}</div>
    </div>
  );
}

/* ── Backend Live Terminal ── */
export function BackendLiveTerminal() {
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 500, marginLeft: "auto", height: "100%", minHeight: 380, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Background blurs */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ position: "absolute", width: 400, height: 400, background: "radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 60%)", filter: "blur(50px)", borderRadius: "50%" }} 
      />
      
      {/* Terminal container */}
      <div style={{
        position: "absolute", inset: 0,
        background: "#050816",
        border: "1px solid rgba(255, 255, 255, 0.15)", borderRadius: 16,
        boxShadow: "0 30px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        overflow: "hidden", display: "flex", flexDirection: "column"
      }}>
        {/* Terminal Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#eab308" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e" }} />
          </div>
          <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "rgba(255, 255, 255, 0.5)", fontWeight: 600, letterSpacing: ".1em" }}>api.pathora.dev / evaluation_engine</div>
        </div>

        {/* Terminal Body */}
        <div style={{ flex: 1, padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10, overflow: "hidden", position: "relative" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 10, color: "var(--accent)", fontFamily: "var(--mono)", fontWeight: 700, marginBottom: 4, letterSpacing: ".1em" }}>PIPELINE WORKERS</div>
              <div style={{ fontSize: 36, color: "#fff", fontFamily: "var(--mono)", fontWeight: 600, lineHeight: 1 }}>
                12<motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8, repeatType: "mirror" }}>.</motion.span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
               <div style={{ textAlign: "right" }}>
                 <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", fontFamily: "var(--mono)" }}>LATENCY</div>
                 <div style={{ fontSize: 14, color: "var(--success)", fontFamily: "var(--mono)", fontWeight: 600 }}>24ms</div>
               </div>
               <div style={{ textAlign: "right" }}>
                 <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", fontFamily: "var(--mono)" }}>CONFIDENCE</div>
                 <div style={{ fontSize: 14, color: "#fff", fontFamily: "var(--mono)", fontWeight: 600 }}>0.98</div>
               </div>
            </div>
          </div>

          {/* Logs */}
          <div style={{ flex: 1, fontFamily: "var(--mono)", fontSize: 11, color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.8, position: "relative" }}>
            <motion.div
              animate={{ y: [0, -100] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              style={{ display: "flex", flexDirection: "column", gap: 4 }}
            >
              {[
                { status: "OK", step: "EXTRACT", msg: "Parsing resume structure...", time: "0ms" },
                { status: "OK", step: "ANALYZE", msg: "Extracting engineering entities...", time: "12ms" },
                { status: "OK", step: "COMPUTE", msg: "Computing ATS heuristics...", time: "24ms" },
                { status: "OK", step: "MAP", msg: "Mapping engineering vectors...", time: "42ms" },
                { status: "OK", step: "EVAL", msg: "Computing recruiter trust...", time: "58ms" },
                { status: "OK", step: "GRAPH", msg: "Building roadmap graph...", time: "84ms" },
                { status: "OK", step: "DONE", msg: "Finalizing deterministic payload...", time: "112ms" },
                { status: "WAIT", step: "IDLE", msg: "Awaiting next evaluation cycle...", time: "-" }
              ].map((log, i) => (
                <div key={i} style={{ display: "flex", gap: 12 }}>
                  <span style={{ color: log.status === "OK" ? "var(--success)" : "rgba(255,255,255,0.4)" }}>[{log.status}]</span>
                  <span style={{ color: "var(--accent2)", width: 55 }}>{log.step}</span>
                  <span style={{ flex: 1 }}>{log.msg}</span>
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>{log.time}</span>
                </div>
              ))}
            </motion.div>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60, background: "linear-gradient(transparent, #050816)", zIndex: 1 }} />
          </div>

        </div>
      </div>
    </div>
  );
}

/* ── Tech Marquee ── */
export function TechMarquee() {
  const doubled = [...TECH_STACK, ...TECH_STACK];
  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      {[{ left: 0 }, { right: 0 }].map((side, i) => (
        <div key={i} style={{
          position: "absolute", top: 0, bottom: 0, width: 100, zIndex: 2,
          background: `linear-gradient(${i === 0 ? "90deg" : "270deg"}, rgba(255,255,255,0.9) 0%, transparent 100%)`,
          pointerEvents: "none", ...side
        }} />
      ))}
      <div style={{ display: "flex", width: "max-content", animation: "marqueeX 40s linear infinite" }}>
        {doubled.map(({ icon, label }, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "0 32px",
            borderRight: "1px solid rgba(0,0,0,0.06)",
          }}>
            <i className={icon} style={{ fontSize: 22, opacity: 0.7 }} />
            <span style={{ fontSize: 12, color: "var(--tm)", fontFamily: "var(--mono)", fontWeight: 600, whiteSpace: "nowrap" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Liquid Glass Footer ── */
export const LiquidGlassFooter = React.forwardRef(function LiquidGlassFooter(props, ref) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleSubscribe = () => {
    if (email && email.includes("@")) {
      setSubscribed(true);
    }
  };

  return (
      <RevealSection style={{
      position: "relative", overflow: "hidden",
      borderTop: "1px solid rgba(0,0,0,0.06)",
    }}>
      {/* Light glass bg */}
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(60px)", WebkitBackdropFilter: "blur(60px)",
        pointerEvents: "none",
      }} />
      {/* Grid pattern */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(0,0,0,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.025) 1px,transparent 1px)",
        backgroundSize: "50px 50px", pointerEvents: "none"
      }} />
      {/* Glow */}
      <div style={{
        position: "absolute", bottom: "-30%", left: "50%", transform: "translateX(-50%)",
        width: "70%", height: "60%",
        background: "radial-gradient(circle,rgba(129,140,248,0.1) 0%,transparent 70%)",
        pointerEvents: "none"
      }} />

      <div style={{ position: "relative", maxWidth: 1400, margin: "0 auto", padding: "80px clamp(20px,5vw,80px) 0" }}>
        {/* Top: Brand + Newsletter */}
        <div className="lg-footer-top" style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          flexWrap: "wrap", gap: 50, paddingBottom: 60,
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}>
          <div style={{ maxWidth: 380 }}>
            <div style={{
              fontFamily: "var(--display)", fontSize: 32, fontWeight: 400, fontStyle: "italic",
              color: "var(--tp)", marginBottom: 16,
            }}>Pathora</div>
            <p style={{ fontSize: 14, color: "var(--tm)", lineHeight: 1.7, marginBottom: 24 }}>
              Deterministic engineering intelligence infrastructure designed for technical evaluation and maturity mapping.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              {["𝕏", "⌗", "in", "◈"].map(icon => (
                <div key={icon} style={{
                  ...glass({ borderRadius: 10, width: 38, height: 38 }),
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "all .3s", fontSize: 14, color: "var(--ts)",
                }}>{icon}</div>
              ))}
            </div>
          </div>
          <div style={{ maxWidth: 420, position: "relative" }}>
            <div style={{ position: "absolute", inset: -20, backgroundImage: "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)", backgroundSize: "20px 20px", zIndex: 0, opacity: 0.5, pointerEvents: "none", maskImage: "radial-gradient(circle at center, black, transparent 70%)", WebkitMaskImage: "radial-gradient(circle at center, black, transparent 70%)" }} />
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, rgba(129, 140, 248, 0.08) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }} />
            
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: 10, fontFamily: "var(--mono)", fontWeight: 700, letterSpacing: ".16em", color: "var(--tm)", marginBottom: 12, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent)", animation: "pulse 2s infinite" }} />
                Network Uplink Active
              </div>
              <h3 style={{ fontFamily: "var(--display)", fontSize: 28, fontWeight: 400, fontStyle: "italic", color: "var(--tp)", marginBottom: 12, letterSpacing: "-0.01em" }}>
                Engineering Intelligence Dispatch
              </h3>
              <p style={{ fontSize: 13, color: "var(--ts)", lineHeight: 1.6, marginBottom: 24, maxWidth: 380 }}>
                Receive deterministic engineering intelligence reports, recruiter heuristic insights, infrastructure trends, and production-readiness research directly from the Pathora evaluation network.
              </p>
              
              <div style={{ position: "relative" }}>
                <AnimatePresence mode="wait">
                  {!subscribed ? (
                    <motion.div 
                      key="subscribe"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}
                      style={{ display: "flex", flexDirection: "column", gap: 12 }}
                    >
                      <div style={{ 
                        display: "flex", alignItems: "center", padding: "6px 6px 6px 16px", borderRadius: 100, 
                        background: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(20px)",
                        border: focused ? "1px solid rgba(129, 140, 248, 0.4)" : "1px solid rgba(0, 0, 0, 0.08)",
                        boxShadow: focused ? "0 4px 20px rgba(129, 140, 248, 0.15), inset 0 0 10px rgba(255, 255, 255, 0.5)" : "0 2px 10px rgba(0,0,0,0.02), inset 0 0 10px rgba(255,255,255,0.5)",
                        transition: "all 0.3s ease", position: "relative", overflow: "hidden"
                      }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)", marginRight: 12, boxShadow: "0 0 8px rgba(52, 211, 153, 0.8)", animation: "pulse 2s infinite" }} />
                        <input 
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => setFocused(true)}
                          onBlur={() => setFocused(false)}
                          placeholder="Enter engineering contact node..." 
                          style={{ flex: 1, background: "transparent", border: "none", color: "var(--tp)", fontSize: 13, fontFamily: "var(--mono)", outline: "none", minWidth: 120 }} 
                        />
                        <div style={{ fontSize: 9, fontFamily: "var(--mono)", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--success)", padding: "4px 8px", background: "rgba(52,211,153,0.1)", borderRadius: 100, marginRight: 8, display: "flex", alignItems: "center", gap: 4 }}>
                          Encrypted <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--success)" }}></div>
                        </div>
                        <button 
                          onClick={handleSubscribe}
                          style={{
                            padding: "10px 20px", borderRadius: 100, border: "none",
                            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                            color: "#fff", fontSize: 12, fontWeight: 600, fontFamily: "var(--sans)",
                            cursor: "pointer", transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                            boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)",
                            display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap"
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(124, 58, 237, 0.4)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(124, 58, 237, 0.3)"; }}
                        >
                          Join Network <span style={{ transition: "transform 0.3s" }}>→</span>
                        </button>
                      </div>
                      
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4, flexWrap: "wrap", gap: 8 }}>
                        <div style={{ display: "flex", gap: 12, fontSize: 10, color: "var(--tm)", fontFamily: "var(--sans)", fontWeight: 500 }}>
                          <span>• 12k+ engineers</span>
                          <span>• Weekly reports</span>
                          <span>• Signal-only</span>
                        </div>
                        <div style={{ fontSize: 9, fontFamily: "var(--mono)", color: "rgba(0,0,0,0.3)", letterSpacing: ".05em" }}>
                          pathora.dispatch.network.active
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      style={{ 
                        padding: "16px 20px", borderRadius: 16, background: "rgba(52, 211, 153, 0.08)", 
                        border: "1px solid rgba(52, 211, 153, 0.2)", display: "flex", alignItems: "center", gap: 12,
                        boxShadow: "inset 0 0 20px rgba(255,255,255,0.5)"
                      }}
                    >
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--success)", boxShadow: "0 0 12px var(--success)", animation: "pulse 2s infinite" }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--tp)", fontFamily: "var(--sans)", marginBottom: 2 }}>
                          Node successfully registered.
                        </div>
                        <div style={{ fontSize: 11, color: "var(--tm)", fontFamily: "var(--mono)" }}>
                          Secure connection established to Pathora Dispatch Network.
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="lg-footer-stats" style={{
          display: "flex", gap: 0, borderBottom: "1px solid rgba(0,0,0,0.06)", flexWrap: "wrap",
        }}>
          {[
            { lbl: "Engineering Vectors", val: "1200+" },
            { lbl: "Evaluation Accuracy", val: "99.8%" },
            { lbl: "Infrastructure Tools", val: "300+" },
            { lbl: "Profiles Processed", val: "5000+" },
          ].map(({ lbl, val }, i) => (
            <div key={lbl} style={{
              flex: "1 1 180px", padding: "36px 24px",
              borderRight: i < 3 ? "1px solid rgba(0,0,0,0.04)" : "none",
              borderTop: "1px solid rgba(0,0,0,0.04)",
            }}>
              <div style={{
                fontFamily: "var(--display)", fontSize: 40, fontWeight: 400, fontStyle: "italic",
                color: "var(--tp)", marginBottom: 6,
              }}>{val}</div>
              <div style={{ fontSize: 12, color: "var(--tm)", fontFamily: "var(--mono)" }}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* Links */}
        <div className="lg-footer-links" style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
          gap: 40, padding: "60px 0", borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}>
          {Object.entries(FOOTER_COLS).map(([section, links]) => (
            <div key={section}>
              <div style={{
                fontSize: 11, fontFamily: "var(--mono)", fontWeight: 700, letterSpacing: ".14em",
                color: "var(--tm)", marginBottom: 18, textTransform: "uppercase",
              }}>{section}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {links.map(link => (
                  <span key={link.name} style={{
                    fontSize: 14, color: "var(--ts)", cursor: "pointer", transition: "color .2s",
                  }}
                    onClick={() => { window.scrollTo(0,0); navigate(link.path); }}
                    onMouseEnter={e => e.target.style.color = "#818cf8"}
                    onMouseLeave={e => e.target.style.color = "var(--ts)"}
                  >{link.name}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="lg-footer-bottom" style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 20, padding: "32px 0",
        }}>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: "var(--tm)", fontFamily: "var(--mono)" }}>
              © {new Date().getFullYear()} Pathora
            </span>
            <span style={{ fontSize: 13, color: "var(--tm)", fontFamily: "var(--mono)" }}>
              Career Intelligence Engine
            </span>
          </div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[
              {name: "Privacy", path: "/privacy"}, 
              {name: "Terms", path: "/terms"}, 
              {name: "Security", path: "/docs"}, 
              {name: "Status", path: "/platform"}
            ].map(l => (
              <span key={l.name} style={{
                fontSize: 12, color: "var(--tm)", cursor: "pointer", fontFamily: "var(--mono)",
                transition: "color .2s",
              }}
                onClick={() => { window.scrollTo(0,0); navigate(l.path); }}
                onMouseEnter={e => e.target.style.color = "var(--ts)"}
                onMouseLeave={e => e.target.style.color = "var(--tm)"}
              >{l.name}</span>
            ))}
          </div>
        </div>
      </div>
    </RevealSection>
  );
});
