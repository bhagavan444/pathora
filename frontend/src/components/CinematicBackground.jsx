import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function CinematicBackground() {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState("/");

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  // Determine configuration based on current path
  const isHome = currentPath === "/";
  const isPredict = currentPath === "/predict";
  const isChat = currentPath === "/chat";
  const isQuiz = currentPath === "/quiz";
  const isPlans = currentPath === "/plans";

  // Customize blur level: chat needs very high blur, others have medium blur
  let blurAmount = "8px";
  if (isChat) blurAmount = "32px";
  else if (isHome) blurAmount = "12px";
  else if (isPredict) blurAmount = "6px";
  else if (isQuiz) blurAmount = "8px";
  else if (isPlans) blurAmount = "10px";

  // Subtle opacity: video should be soft, not overpowering
  let videoOpacity = 0.22;
  if (isChat) videoOpacity = 0.12; // Very clean and readable
  if (isPredict) videoOpacity = 0.18;
  if (isQuiz) videoOpacity = 0.16;
  if (isPlans) videoOpacity = 0.18;

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 0,
      pointerEvents: "none",
      overflow: "hidden",
      backgroundColor: "#fcfcfa", // Clean silver-white paper tone
      transition: "background-color 0.8s ease"
    }}>
      {/* CSS Injections */}
      <style>{`
        @keyframes cb-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes cb-spin-reverse {
          from { transform: translate(-50%, -50%) rotate(360deg); }
          to { transform: translate(-50%, -50%) rotate(0deg); }
        }
        @keyframes cb-pulse {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(1.05); }
        }
        @keyframes cb-grid-pulse {
          0%, 100% { opacity: 0.02; }
          50% { opacity: 0.05; }
        }
        @keyframes cb-signal-flow-1 {
          0% { transform: translateY(-100%) translateX(10vw); opacity: 0; }
          10%, 90% { opacity: 0.15; }
          100% { transform: translateY(100vh) translateX(15vw); opacity: 0; }
        }
        @keyframes cb-signal-flow-2 {
          0% { transform: translateX(-100%) translateY(20vh); opacity: 0; }
          20%, 80% { opacity: 0.12; }
          100% { transform: translateX(100vw) translateY(25vh); opacity: 0; }
        }
        @keyframes cb-signal-flow-3 {
          0% { transform: translateY(100vh) translateX(80vw); opacity: 0; }
          10%, 90% { opacity: 0.15; }
          100% { transform: translateY(-100%) translateX(75vw); opacity: 0; }
        }
        @keyframes cb-dash-flow {
          to { stroke-dashoffset: -40; }
        }
        .cb-orbit-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          border: 1px dashed rgba(139, 92, 246, 0.08);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .cb-orbit-node {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #8b5cf6;
          box-shadow: 0 0 8px #8b5cf6;
          opacity: 0.6;
        }
      `}</style>

      {/* Dynamic Animated Atmospheric Gradients */}
      <div style={{
        position: "absolute",
        width: "120vw",
        height: "120vh",
        top: "-10%",
        left: "-10%",
        background: isHome 
          ? "radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.12) 0%, rgba(255, 255, 255, 0) 50%), radial-gradient(circle at 10% 80%, rgba(99, 102, 241, 0.08) 0%, rgba(255, 255, 255, 0) 60%)"
          : isPredict
          ? "radial-gradient(circle at 90% 10%, rgba(99, 102, 241, 0.09) 0%, rgba(255, 255, 255, 0) 45%), radial-gradient(circle at 20% 90%, rgba(139, 92, 246, 0.07) 0%, rgba(255, 255, 255, 0) 50%)"
          : isChat
          ? "radial-gradient(circle at 50% -20%, rgba(99, 102, 241, 0.06) 0%, rgba(255, 255, 255, 0) 60%), radial-gradient(circle at 50% 120%, rgba(139, 92, 246, 0.04) 0%, rgba(255, 255, 255, 0) 60%)"
          : isQuiz
          ? "radial-gradient(circle at 10% 10%, rgba(139, 92, 246, 0.08) 0%, rgba(255, 255, 255, 0) 50%), radial-gradient(circle at 90% 90%, rgba(99, 102, 241, 0.06) 0%, rgba(255, 255, 255, 0) 55%)"
          : "radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.1) 0%, rgba(255, 255, 255, 0) 50%), radial-gradient(circle at 70% 80%, rgba(99, 102, 241, 0.08) 0%, rgba(255, 255, 255, 0) 50%)",
        filter: "blur(40px)",
        animation: "cb-pulse 10s ease-in-out infinite",
        transition: "background 1s ease"
      }} />

      {/* Full-Screen Premium Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        key={currentPath} // Triggers fresh hardware surface hook if route changed
        style={{
          position: "absolute",
          top: 0, left: 0, width: "100%", height: "100%",
          objectFit: "cover",
          transform: "translate3d(0, 0, 0)", // Hard GPU acceleration layer
          backfaceVisibility: "hidden",
          opacity: videoOpacity,
          mixBlendMode: "multiply",
          filter: "grayscale(10%) contrast(95%)",
          transition: "opacity 1s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >
        <source 
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260517_222138_3e3205be-3364-417b-a64a-bfe087acbec4.mp4" 
          type="video/mp4" 
        />
      </video>

      {/* Layered Diffuse Mask & Vignette */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.2) 0%, rgba(252, 252, 250, 0.75) 80%, #fcfcfa 100%)",
        transition: "background 0.8s ease"
      }} />

      {/* ────────────────────────────────────────────────────────
          PAGE SPECIFIC ARCHITECTURAL OVERLAYS
      ──────────────────────────────────────────────────────── */}

      {/* 1. HOME PAGE OVERLAY SYSTEM */}
      {isHome && (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {/* Orbital Guidelines */}
          <div className="cb-orbit-ring" style={{ width: "35vw", height: "35vw", animation: "cb-spin 80s linear infinite" }}>
            <div className="cb-orbit-node" style={{ top: "0%", left: "50%" }} />
          </div>
          <div className="cb-orbit-ring" style={{ width: "55vw", height: "55vw", animation: "cb-spin-reverse 120s linear infinite" }}>
            <div className="cb-orbit-node" style={{ bottom: "0%", left: "50%" }} />
          </div>
          {/* Subtle slow wave */}
          <svg style={{ position: "absolute", width: "100%", height: "100%", opacity: 0.15 }}>
            <path d="M 0,200 Q 300,100 600,200 T 1200,200 T 1800,200 L 1800,1000 L 0,1000 Z" fill="none" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="1.5" />
          </svg>
        </div>
      )}

      {/* 2. PREDICT PAGE OVERLAY SYSTEM */}
      {isPredict && (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {/* Dotted analytical coordinates */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "radial-gradient(rgba(139, 92, 246, 0.08) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            animation: "cb-grid-pulse 8s ease-in-out infinite"
          }} />
          {/* Concentric Design Guides */}
          <div className="cb-orbit-ring" style={{ width: "40vw", height: "40vw", border: "1px dashed rgba(99, 102, 241, 0.06)" }} />
          <div className="cb-orbit-ring" style={{ width: "60vw", height: "60vw", border: "1px dashed rgba(99, 102, 241, 0.04)" }} />
          {/* AI Signal flow lines */}
          <div style={{
            position: "absolute", width: "2px", height: "120px",
            background: "linear-gradient(to bottom, transparent, #8b5cf6, transparent)",
            animation: "cb-signal-flow-1 12s linear infinite"
          }} />
          <div style={{
            position: "absolute", height: "2px", width: "160px",
            background: "linear-gradient(to right, transparent, #6366f1, transparent)",
            animation: "cb-signal-flow-2 15s linear infinite"
          }} />
          <div style={{
            position: "absolute", width: "2px", height: "140px",
            background: "linear-gradient(to bottom, transparent, #8b5cf6, transparent)",
            animation: "cb-signal-flow-3 10s linear infinite"
          }} />
        </div>
      )}

      {/* 3. ASSISTANT PAGE OVERLAY SYSTEM (minimalist & clean) */}
      {isChat && (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {/* Calming ambient aura */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(circle at center, transparent 30%, rgba(252, 252, 250, 0.4) 100%)"
          }} />
        </div>
      )}

      {/* 4. ASSESSMENTS PAGE OVERLAY SYSTEM */}
      {isQuiz && (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {/* Rigid structural grid */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(139, 92, 246, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }} />
          <div className="cb-orbit-ring" style={{ width: "50vw", height: "50vw", border: "1px solid rgba(139, 92, 246, 0.03)" }} />
        </div>
      )}

      {/* 5. ROADMAPS PAGE OVERLAY SYSTEM */}
      {isPlans && (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {/* Flowing Trajectory Pathways */}
          <svg style={{ position: "absolute", width: "100vw", height: "100vh", opacity: 0.4 }}>
            <path 
              d="M-50,200 C300,50 600,450 1000,200 C1300,50 1600,350 2000,150" 
              fill="none" 
              stroke="rgba(139, 92, 246, 0.15)" 
              strokeWidth="2" 
              strokeDasharray="8 8"
              style={{ animation: "cb-dash-flow 30s linear infinite" }}
            />
            <path 
              d="M-50,450 C400,250 800,600 1200,300 C1500,100 1700,500 2000,350" 
              fill="none" 
              stroke="rgba(99, 102, 241, 0.12)" 
              strokeWidth="1.5" 
              strokeDasharray="6 6"
              style={{ animation: "cb-dash-flow 25s linear infinite reverse" }}
            />
          </svg>
          {/* Soft square alignment grid */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px)",
            backgroundSize: "80px 80px"
          }} />
        </div>
      )}

      {/* Global Soft Backdrop Blur Layer */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        backdropFilter: `blur(${blurAmount})`,
        WebkitBackdropFilter: `blur(${blurAmount})`,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        transition: "backdrop-filter 0.8s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.8s ease"
      }} />
    </div>
  );
}
