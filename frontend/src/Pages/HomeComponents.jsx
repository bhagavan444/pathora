import React, { useEffect, useRef, useState } from "react";
import { TECH_STACK, FOOTER_COLS } from "./HomeData";
import { motion, AnimatePresence } from "framer-motion";

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

/* ── Cinematic Universe Core (replaces LiveOrbAnimation) ── */
export function CinematicUniverseCore() {
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 520, marginLeft: "auto", height: "100%", minHeight: 460, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Background blurs */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ position: "absolute", width: 400, height: 400, background: "radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 60%)", filter: "blur(40px)", borderRadius: "50%" }} 
      />
      
      {/* Dashboard container */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.08) 100%)",
        backdropFilter: "blur(40px) saturate(180%)", WebkitBackdropFilter: "blur(40px) saturate(180%)",
        border: "1px solid rgba(255, 255, 255, 0.35)", borderRadius: 24,
        boxShadow: "0 24px 60px -12px rgba(0, 0, 0, 0.03), inset 0 1px 0 0 rgba(255, 255, 255, 0.4)",
        overflow: "hidden", display: "flex", flexDirection: "column", padding: 24
      }}>
        {/* Top Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <motion.div 
              animate={{ opacity: [1, 0.4, 1] }} 
              transition={{ duration: 2.5, repeat: Infinity }} 
              style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 10px rgba(16,185,129,0.3)" }} 
            />
            <span style={{ fontSize: 10, fontFamily: "var(--mono)", fontWeight: 600, color: "rgba(15, 15, 15, 0.45)", letterSpacing: ".1em" }}>REAL-TIME ANALYSIS</span>
          </div>
          <div style={{ fontSize: 10, fontFamily: "var(--mono)", fontWeight: 600, color: "var(--accent)" }}>
            ENGINE_V2.5
          </div>
        </div>

        {/* Grid layout for dashboard */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, flex: 1 }}>
          
          {/* Main metric card */}
          <div style={{
            gridColumn: "1 / -1",
            background: "rgba(255, 255, 255, 0.15)",
            border: "1px solid rgba(255, 255, 255, 0.22)",
            backdropFilter: "blur(8px)",
            borderRadius: 16, padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <div>
              <div style={{ fontSize: 11, color: "rgba(15, 15, 15, 0.5)", marginBottom: 4, fontWeight: 550 }}>Career Prediction Confidence</div>
              <div style={{ fontSize: 30, fontFamily: "var(--display)", fontWeight: 700, color: "var(--tp)" }}>94.8%</div>
            </div>
            <div style={{ width: 80, height: 40, position: "relative" }}>
              {/* Mini sparkline graph */}
              <svg viewBox="0 0 100 40" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                <motion.path 
                  d="M0 30 Q20 20, 40 25 T80 15 T100 5" 
                  fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", repeatDelay: 2 }}
                />
                <motion.circle cx="100" cy="5" r="3" fill="var(--accent)" 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                />
              </svg>
            </div>
          </div>

          {/* Skill cluster visualization */}
          <div style={{
            background: "rgba(255, 255, 255, 0.12)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            backdropFilter: "blur(8px)",
            borderRadius: 16, padding: 16, display: "flex", flexDirection: "column", gap: 12
          }}>
            <div style={{ fontSize: 10, color: "rgba(15, 15, 15, 0.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em" }}>Skill Clusters</div>
            <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 24, repeat: Infinity, ease: "linear" }} style={{ width: 80, height: 80, border: "1px dashed rgba(129,140,248,0.25)", borderRadius: "50%", position: "absolute" }} />
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} style={{ width: 60, height: 60, border: "1px dashed rgba(167,139,250,0.25)", borderRadius: "50%", position: "absolute" }} />
              <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, var(--accent), var(--accent2))", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12 }}>
                <i className="devicon-react-original" />
              </div>
            </div>
          </div>

          {/* ATS Insights */}
          <div style={{
            background: "rgba(255, 255, 255, 0.12)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            backdropFilter: "blur(8px)",
            borderRadius: 16, padding: 16, display: "flex", flexDirection: "column", gap: 10
          }}>
            <div style={{ fontSize: 10, color: "rgba(15, 15, 15, 0.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em" }}>ATS Match</div>
            {[
              { label: "Frontend", val: 92 },
              { label: "Backend", val: 68 },
              { label: "DevOps", val: 45 }
            ].map(item => (
              <div key={item.label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", justifycontent: "space-between", justifyContent: "space-between", fontSize: 10, color: "rgba(15, 15, 15, 0.65)", fontWeight: 500 }}>
                  <span>{item.label}</span><span>{item.val}%</span>
                </div>
                <div style={{ height: 3, background: "rgba(0,0,0,0.04)", borderRadius: 1.5, overflow: "hidden" }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.val}%` }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    style={{ height: "100%", background: "var(--accent)" }} 
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Processing Log */}
          <div style={{
            gridColumn: "1 / -1",
            background: "rgba(255, 255, 255, 0.15)",
            border: "1px solid rgba(255, 255, 255, 0.22)",
            backdropFilter: "blur(8px)",
            borderRadius: 12, padding: 12, fontFamily: "var(--mono)", fontSize: 9, color: "rgba(15, 15, 15, 0.55)", height: 60, overflow: "hidden", position: "relative"
          }}>
            <motion.div
              animate={{ y: [0, -20, -40, -60] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{ display: "flex", flexDirection: "column", gap: 8 }}
            >
              <div>&gt; analyzing github repositories... [OK]</div>
              <div>&gt; extracting semantic keywords... [OK]</div>
              <div>&gt; mapping to industry standard... [OK]</div>
              <div>&gt; generating roadmap trajectory... [OK]</div>
              <div>&gt; calculating predictive score... [OK]</div>
              <div>&gt; finalizing analysis... [OK]</div>
            </motion.div>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 24, background: "linear-gradient(transparent, rgba(255, 255, 255, 0.95))" }} />
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
export const LiquidGlassFooter = React.forwardRef(function LiquidGlassFooter({ navigate }, ref) {
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
              AI-powered career intelligence platform designed for students and fresh graduates.
              Navigate your career journey with data-driven insights and industry-aligned roadmaps.
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
          <div style={{ maxWidth: 360 }}>
            <div style={{
              fontSize: 11, fontFamily: "var(--mono)", fontWeight: 700, letterSpacing: ".14em",
              color: "var(--tm)", marginBottom: 14, textTransform: "uppercase",
            }}>Stay Updated</div>
            <h3 style={{
              fontFamily: "var(--display)", fontSize: 26, fontWeight: 400, fontStyle: "italic",
              color: "var(--tp)", marginBottom: 12,
            }}>Career Intelligence Insights</h3>
            <p style={{ fontSize: 13, color: "var(--tm)", lineHeight: 1.6, marginBottom: 18 }}>
              Get the latest career trends, skill insights, and platform updates
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <input placeholder="your@email.com" style={{
                flex: 1, padding: "12px 16px", borderRadius: 10,
                ...glass({ background: "rgba(255,255,255,0.05)" }),
                color: "var(--tp)", fontSize: 13, fontFamily: "var(--mono)", outline: "none",
              }} />
              <button style={{
                padding: "12px 20px", borderRadius: 10, border: "none",
                background: "linear-gradient(135deg, #818cf8, #a78bfa)",
                color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .3s",
              }}>Subscribe</button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="lg-footer-stats" style={{
          display: "flex", gap: 0, borderBottom: "1px solid rgba(0,0,0,0.06)", flexWrap: "wrap",
        }}>
          {[
            { lbl: "Career Paths", val: "1200+" },
            { lbl: "Success Rate", val: "90%" },
            { lbl: "Skills Tracked", val: "300+" },
            { lbl: "Active Users", val: "5000+" },
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
                  <span key={link} style={{
                    fontSize: 14, color: "var(--ts)", cursor: "pointer", transition: "color .2s",
                  }}
                    onMouseEnter={e => e.target.style.color = "#818cf8"}
                    onMouseLeave={e => e.target.style.color = "var(--ts)"}
                  >{link}</span>
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
            {["Privacy", "Terms", "Security", "Status"].map(l => (
              <span key={l} style={{
                fontSize: 12, color: "var(--tm)", cursor: "pointer", fontFamily: "var(--mono)",
                transition: "color .2s",
              }}
                onMouseEnter={e => e.target.style.color = "var(--ts)"}
                onMouseLeave={e => e.target.style.color = "var(--tm)"}
              >{l}</span>
            ))}
          </div>
        </div>
      </div>
    </RevealSection>
  );
});
