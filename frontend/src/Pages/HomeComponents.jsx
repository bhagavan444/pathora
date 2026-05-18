import React, { useEffect, useRef, useState } from "react";
import { TECH_STACK, FOOTER_COLS } from "./HomeData";

/* ── Glass Style Helpers ── */
const glass = (extra = {}) => ({
  background: "rgba(10,10,25,0.65)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 20,
  ...extra,
});

const glassStrong = (extra = {}) => ({
  background: "rgba(15, 15, 20, 0.25)",
  backdropFilter: "blur(30px)",
  WebkitBackdropFilter: "blur(30px)",
  border: "1px solid rgba(255, 255, 255, 0.05)",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
  borderRadius: 24,
  ...extra,
});

/* ── Scroll Reveal Hook ── */
export function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
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
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    
    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    // 3D points
    let points = [];
    const numPoints = 90;
    for (let i = 0; i < numPoints; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = 80 + Math.random() * 60;
      points.push({
        x0: r * Math.sin(phi) * Math.cos(theta),
        y0: r * Math.sin(phi) * Math.sin(theta),
        z0: r * Math.cos(phi),
        radius: Math.random() * 2 + 0.5,
        connections: []
      });
    }

    // Pre-calculate connections
    for (let i = 0; i < numPoints; i++) {
      for (let j = i + 1; j < numPoints; j++) {
        const dx = points[i].x0 - points[j].x0;
        const dy = points[i].y0 - points[j].y0;
        const dz = points[i].z0 - points[j].z0;
        if (Math.sqrt(dx*dx + dy*dy + dz*dz) < 60) {
          points[i].connections.push(j);
        }
      }
    }

    let time = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W(), H());
      const cx = W() / 2, cy = H() / 2;
      time += 0.0015;

      // Draw glowing central core
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 50);
      coreGrad.addColorStop(0, "rgba(167, 139, 250, 0.15)");
      coreGrad.addColorStop(1, "transparent");
      ctx.fillStyle = coreGrad;
      ctx.beginPath(); ctx.arc(cx, cy, 100, 0, Math.PI * 2); ctx.fill();

      // Rotate points
      const rotPoints = points.map(p => {
        // Rotate Y
        const x1 = p.x0 * Math.cos(time) - p.z0 * Math.sin(time);
        const z1 = p.z0 * Math.cos(time) + p.x0 * Math.sin(time);
        // Rotate X
        const y2 = p.y0 * Math.cos(time*0.5) - z1 * Math.sin(time*0.5);
        const z2 = z1 * Math.cos(time*0.5) + p.y0 * Math.sin(time*0.5);
        
        // Perspective
        const scale = 300 / (300 + z2);
        return {
          ...p,
          x: cx + x1 * scale,
          y: cy + y2 * scale,
          z: z2,
          scale
        };
      });

      // Sort by Z to draw back to front
      const sortedIndices = rotPoints.map((_, i) => i).sort((a, b) => rotPoints[b].z - rotPoints[a].z);

      ctx.lineWidth = 0.5;
      // Draw connections
      for (let i of sortedIndices) {
        const p1 = rotPoints[i];
        if (p1.z > 200) continue; 
        
        for (let j of points[i].connections) {
          const p2 = rotPoints[j];
          if (p2.z > 200) continue;
          
          const avgZ = (p1.z + p2.z) / 2;
          const alpha = Math.max(0.01, 0.15 - (avgZ + 200) / 800);
          if (alpha <= 0.01) continue; // Performance optimization
          
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
          ctx.stroke();
        }
      }

      // Draw nodes
      for (let i of sortedIndices) {
        const p = rotPoints[i];
        if (p.z > 200) continue;
        const alpha = Math.max(0.05, 0.8 - (p.z + 200) / 600);
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
        ctx.fill();
        
        // Draw tiny text for some nodes
        if (i % 7 === 0) {
          ctx.font = `${Math.max(4, 9 * p.scale)}px "JetBrains Mono"`;
          ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.8})`;
          ctx.fillText(["AI", "DATA", "SYS", "CORE", "NET"][i % 5], p.x + 5, p.y + 3);
        }
      }

      // Orbital rings
      ctx.strokeStyle = "rgba(0,0,0,0.03)";
      ctx.lineWidth = 1;
      [110, 150, 190].forEach((r, idx) => {
        ctx.beginPath();
        ctx.ellipse(cx, cy, r * (1 + Math.sin(time*2 + idx)*0.03), r * 0.25 * (1 + Math.cos(time*2 + idx)*0.03), time * 0.1 * (idx%2==0?1:-1), 0, Math.PI * 2);
        ctx.stroke();
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 440, marginLeft: "auto", height: "100%", minHeight: 380, display: "flex", alignItems: "center", justifyContent: "center", willChange: "transform" }}>
      {/* Decorative background blurs */}
      <div style={{ position: "absolute", width: 280, height: 280, background: "radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)", animation: "pulse 6s infinite" }} />
      <div style={{ position: "absolute", width: 200, height: 200, background: "radial-gradient(circle, rgba(103,232,249,0.08) 0%, transparent 70%)", animation: "pulse 6s infinite 3s" }} />
      
      {/* Glass container */}
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(255,255,255,0.2)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.4)", borderRadius: 32,
        boxShadow: "0 20px 40px rgba(0,0,0,0.05), inset 0 0 0 1px rgba(255,255,255,0.6)",
        overflow: "hidden",
        willChange: "transform"
      }}>
        {/* Top Header */}
        <div style={{ position: "absolute", top: 24, left: 28, right: 28, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 10, fontFamily: "var(--mono)", fontWeight: 700, letterSpacing: ".2em", color: "rgba(0,0,0,0.4)", textTransform: "uppercase" }}>
            The Career Universe Matrix
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 10px rgba(16,185,129,0.8)", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 10, fontFamily: "var(--mono)", fontWeight: 700, color: "rgba(0,0,0,0.6)" }}>LIVE SYNC</span>
          </div>
        </div>
        
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
        
        {/* Floating tech badges */}
        <div style={{ position: "absolute", bottom: 28, left: 28, padding: "10px 16px", background: "rgba(255,255,255,0.6)", backdropFilter: "blur(8px)", borderRadius: 100, border: "1px solid rgba(255,255,255,0.8)", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", fontSize: 11, fontFamily: "var(--mono)", fontWeight: 700, color: "#000" }}>
          1.2M+ ACTIVE NODES
        </div>
        <div style={{ position: "absolute", bottom: 28, right: 28, padding: "10px 16px", background: "rgba(255,255,255,0.6)", backdropFilter: "blur(8px)", borderRadius: 100, border: "1px solid rgba(255,255,255,0.8)", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", fontSize: 11, fontFamily: "var(--mono)", fontWeight: 700, color: "#000" }}>
          PREDICTIVE ENGINE
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
          background: `linear-gradient(${i === 0 ? "90deg" : "270deg"}, rgba(10,10,20,0.9) 0%, transparent 100%)`,
          pointerEvents: "none", ...side
        }} />
      ))}
      <div style={{ display: "flex", width: "max-content", animation: "marqueeX 40s linear infinite" }}>
        {doubled.map(({ icon, label }, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "0 32px",
            borderRight: "1px solid rgba(255,255,255,0.06)",
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
    <footer ref={ref} className="lg-reveal" style={{
      position: "relative", overflow: "hidden",
      borderTop: "1px solid rgba(255,255,255,0.06)",
    }}>
      {/* Dark glass bg */}
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(8,8,20,0.88)",
        backdropFilter: "blur(60px)", WebkitBackdropFilter: "blur(60px)",
        pointerEvents: "none",
      }} />
      {/* Grid pattern */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)",
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
          borderBottom: "1px solid rgba(255,255,255,0.06)",
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
          display: "flex", gap: 0, borderBottom: "1px solid rgba(255,255,255,0.06)", flexWrap: "wrap",
        }}>
          {[
            { lbl: "Career Paths", val: "1200+" },
            { lbl: "Success Rate", val: "90%" },
            { lbl: "Skills Tracked", val: "300+" },
            { lbl: "Active Users", val: "5000+" },
          ].map(({ lbl, val }, i) => (
            <div key={lbl} style={{
              flex: "1 1 180px", padding: "36px 24px",
              borderRight: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none",
              borderTop: "1px solid rgba(255,255,255,0.04)",
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
          gap: 40, padding: "60px 0", borderBottom: "1px solid rgba(255,255,255,0.06)",
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
    </footer>
  );
});
