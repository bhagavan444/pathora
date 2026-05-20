import React, { useEffect, useRef, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";

/**
 * BackgroundVideoLayer — Premium AI Infrastructure Background System
 * 
 * Architecture:
 * ┌─────────────────────────────────────────────┐
 * │  Video Layer          z-index: -20          │
 * │  Depth Gradients      z-index: -15          │
 * │  Particle System      z-index: -12          │
 * │  Gradient Overlay     z-index: -10          │
 * │  Main UI              z-index: 10+          │
 * └─────────────────────────────────────────────┘
 */

// Page-specific configuration — all unified to match home page background opacity
const PAGE_CONFIG = {
  "/": {
    videoOpacity: 0.09,
    blurAmount: 0.5,
    overlayOpacity: 0.08,
    label: "home",
  },
  "/predict": {
    videoOpacity: 0.09,
    blurAmount: 0.5,
    overlayOpacity: 0.08,
    label: "predict",
  },
  "/chat": {
    videoOpacity: 0.08,
    blurAmount: 0.8,
    overlayOpacity: 0.10,
    label: "assistant",
  },
  "/quiz": {
    videoOpacity: 0.09,
    blurAmount: 0.5,
    overlayOpacity: 0.08,
    label: "assessments",
  },
  "/plans": {
    videoOpacity: 0.09,
    blurAmount: 0.5,
    overlayOpacity: 0.08,
    label: "plans",
  },
  "/about": {
    videoOpacity: 0.09,
    blurAmount: 0.5,
    overlayOpacity: 0.08,
    label: "about",
  },
  "/contact": {
    videoOpacity: 0.09,
    blurAmount: 0.5,
    overlayOpacity: 0.08,
    label: "contact",
  },
  "/login": {
    videoOpacity: 0.09,
    blurAmount: 0.5,
    overlayOpacity: 0.08,
    label: "login",
  },
  "/admin": {
    videoOpacity: 0.09,
    blurAmount: 0.5,
    overlayOpacity: 0.08,
    label: "admin",
  },
  "/dashboard": {
    videoOpacity: 0.09,
    blurAmount: 0.5,
    overlayOpacity: 0.08,
    label: "dashboard",
  },
  "/settings": {
    videoOpacity: 0.09,
    blurAmount: 0.5,
    overlayOpacity: 0.08,
    label: "settings",
  },
};

const DEFAULT_CONFIG = {
  videoOpacity: 0.09,
  blurAmount: 0.5,
  overlayOpacity: 0.08,
  label: "default",
};

// Generate deterministic particle positions
function generateParticles(count) {
  const particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      x: (i * 37 + 13) % 100,
      y: (i * 53 + 7) % 100,
      size: 1.5 + (i % 4) * 0.8,
      duration: 15 + (i % 8) * 5,
      delay: (i % 6) * 2,
      opacity: 0.15 + (i % 5) * 0.08,
    });
  }
  return particles;
}

const PARTICLES = generateParticles(24);

export default function BackgroundVideoLayer() {
  const location = useLocation();
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const config = PAGE_CONFIG[location.pathname] || DEFAULT_CONFIG;

  // Ensure autoplay works on mount and route change
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Autoplay blocked — silently handle
      });
    }
  }, [location.pathname]);

  const isHome = location.pathname === "/";

  return (
    <>
      {/* Keyframe animations */}
      <style>{`
        @keyframes bgv-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes bgv-dash {
          to { stroke-dashoffset: -40; }
        }
        @keyframes bgv-float {
          0%, 100% { transform: translate(0, 0); opacity: var(--p-opacity); }
          25% { transform: translate(8px, -12px); opacity: calc(var(--p-opacity) * 1.4); }
          50% { transform: translate(-4px, -20px); opacity: var(--p-opacity); }
          75% { transform: translate(12px, -8px); opacity: calc(var(--p-opacity) * 0.7); }
        }
        @keyframes bgv-drift {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.02); }
          66% { transform: translate(-20px, 15px) scale(0.98); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes bgv-breathe {
          0%, 100% { opacity: 0.06; transform: scale(1); }
          50% { opacity: 0.12; transform: scale(1.08); }
        }
        @keyframes bgv-pulse-glow {
          0%, 100% { opacity: 0.04; }
          50% { opacity: 0.09; }
        }
        @keyframes bgv-orbit-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>

      {/* ═══ LAYER 1: Video Background (z-index: -20) ═══ */}
      <div
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: -20,
          overflow: "hidden",
          pointerEvents: "none",
          userSelect: "none",
          willChange: "transform",
          transform: "translate3d(0, 0, 0)",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onCanPlay={() => setIsLoaded(true)}
          style={{
            position: "absolute",
            top: 0, left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: isLoaded ? config.videoOpacity : 0,
            filter: `blur(${config.blurAmount}px) saturate(120%) brightness(0.95) contrast(1.05)`,
            transform: "translate3d(0, 0, 0) scale(1.02)",
            backfaceVisibility: "hidden",
            willChange: "opacity, filter",
            transition: "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s ease",
          }}
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260517_222138_3e3205be-3364-417b-a64a-bfe087acbec4.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* ═══ LAYER 2: Premium Depth Gradients (z-index: -15) ═══ */}
      <div
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: -15,
          pointerEvents: "none",
          userSelect: "none",
          willChange: "transform",
          transform: "translate3d(0, 0, 0)",
        }}
      >
        {/* Cinematic vignette — subtle edge darkening for depth */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0, 0, 0, 0.08) 100%)",
          }}
        />

        {/* Breathing violet glow — top right */}
        <div
          style={{
            position: "absolute",
            top: "-15%",
            right: "-10%",
            width: "60vw",
            height: "60vw",
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.07) 0%, transparent 55%)",
            filter: "blur(60px)",
            animation: "bgv-breathe 12s ease-in-out infinite",
            willChange: "opacity, transform",
          }}
        />

        {/* Breathing indigo glow — bottom left */}
        <div
          style={{
            position: "absolute",
            bottom: "-20%",
            left: "-10%",
            width: "50vw",
            height: "50vw",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 50%)",
            filter: "blur(50px)",
            animation: "bgv-breathe 16s ease-in-out infinite 4s",
            willChange: "opacity, transform",
          }}
        />

        {/* Soft silver ambient — center */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "40%",
            width: "40vw",
            height: "40vw",
            background: "radial-gradient(circle, rgba(200, 200, 220, 0.04) 0%, transparent 50%)",
            filter: "blur(40px)",
            animation: "bgv-pulse-glow 10s ease-in-out infinite 2s",
            willChange: "opacity",
          }}
        />
      </div>

      {/* ═══ LAYER 3: Floating Computational Particles (z-index: -12) ═══ */}
      <div
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: -12,
          pointerEvents: "none",
          userSelect: "none",
          overflow: "hidden",
        }}
      >
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: p.id % 3 === 0
                ? "rgba(139, 92, 246, 0.6)"
                : p.id % 3 === 1
                ? "rgba(99, 102, 241, 0.5)"
                : "rgba(200, 200, 220, 0.4)",
              boxShadow: p.id % 4 === 0
                ? `0 0 ${p.size * 3}px rgba(139, 92, 246, 0.3)`
                : "none",
              "--p-opacity": p.opacity,
              opacity: p.opacity,
              animation: `bgv-float ${p.duration}s ease-in-out infinite ${p.delay}s`,
              willChange: "transform, opacity",
            }}
          />
        ))}
      </div>

      {/* ═══ LAYER 4: Gradient Overlay (z-index: -10) ═══ */}
      <div
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: -10,
          pointerEvents: "none",
          userSelect: "none",
          willChange: "transform",
          transform: "translate3d(0, 0, 0)",
        }}
      >
        {/* Semi-transparent white gradient — much lighter than before */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(
              170deg,
              rgba(255, 255, 255, ${config.overlayOpacity * 0.85}) 0%,
              rgba(255, 255, 255, ${config.overlayOpacity * 0.7}) 40%,
              rgba(255, 255, 255, ${config.overlayOpacity * 0.9}) 100%
            )`,
            transition: "background 0.8s ease",
          }}
        />

        {/* Ambient violet atmospheric diffusion */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              location.pathname === "/"
                ? "radial-gradient(circle at 75% 15%, rgba(139, 92, 246, 0.06) 0%, transparent 45%), radial-gradient(circle at 15% 75%, rgba(99, 102, 241, 0.04) 0%, transparent 50%)"
                : location.pathname === "/predict"
                ? "radial-gradient(circle at 85% 10%, rgba(99, 102, 241, 0.05) 0%, transparent 40%), radial-gradient(circle at 20% 85%, rgba(139, 92, 246, 0.04) 0%, transparent 45%)"
                : location.pathname === "/chat"
                ? "radial-gradient(circle at 50% 30%, rgba(99, 102, 241, 0.03) 0%, transparent 50%)"
                : location.pathname === "/quiz"
                ? "radial-gradient(circle at 10% 10%, rgba(139, 92, 246, 0.05) 0%, transparent 45%), radial-gradient(circle at 90% 90%, rgba(99, 102, 241, 0.03) 0%, transparent 50%)"
                : "radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 45%), radial-gradient(circle at 70% 80%, rgba(99, 102, 241, 0.04) 0%, transparent 45%)",
            transition: "background 1s ease",
          }}
        />

        {/* Ultra-soft noise texture layer */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.025,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Page-specific decorative overlays */}
        {location.pathname === "/" && (
          <>
            {/* Home: slow drifting orbital guides */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "55%",
                width: "30vw",
                height: "30vw",
                border: "1px dashed rgba(139, 92, 246, 0.05)",
                borderRadius: "50%",
                animation: "bgv-orbit-slow 90s linear infinite",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "55%",
                width: "50vw",
                height: "50vw",
                border: "1px dashed rgba(99, 102, 241, 0.03)",
                borderRadius: "50%",
                animation: "bgv-orbit-slow 140s linear infinite reverse",
              }}
            />
          </>
        )}

        {location.pathname === "/predict" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(rgba(139, 92, 246, 0.04) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        )}

        {location.pathname === "/quiz" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(139, 92, 246, 0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.025) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        )}

        {location.pathname === "/plans" && (
          <svg
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              opacity: 0.25,
            }}
          >
            <path
              d="M-50,200 C300,50 600,450 1000,200 C1300,50 1600,350 2000,150"
              fill="none"
              stroke="rgba(139, 92, 246, 0.08)"
              strokeWidth="1.5"
              strokeDasharray="8 8"
              style={{ animation: "bgv-dash 30s linear infinite" }}
            />
            <path
              d="M-50,450 C400,250 800,600 1200,300 C1500,100 1700,500 2000,350"
              fill="none"
              stroke="rgba(99, 102, 241, 0.06)"
              strokeWidth="1"
              strokeDasharray="6 6"
              style={{ animation: "bgv-dash 25s linear infinite reverse" }}
            />
          </svg>
        )}
      </div>
    </>
  );
}
