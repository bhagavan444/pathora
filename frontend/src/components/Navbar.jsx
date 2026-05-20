import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, X, User, Activity, Cpu, 
  Settings, LogOut, LayoutDashboard,
  Brain, CreditCard, Terminal,
  Info, Mail
} from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export default function Navbar({ handleLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showTelemetryPopup, setShowTelemetryPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const profileRef = useRef(null);
  const telemetryRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll listener for premium shrink and blur intensity updates
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Firebase auth state listener
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  // Handle outside clicks to close profile menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
      if (telemetryRef.current && !telemetryRef.current.contains(e.target)) {
        setShowTelemetryPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset menu status on route navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handlePredictClick = (e) => {
    if (!user) {
      e.preventDefault();
      setShowLoginPopup(true);
      setTimeout(() => setShowLoginPopup(false), 3000);
    }
  };

  const handleRoadmapsClick = (e) => {
    if (location.pathname === "/") {
      e.preventDefault();
      const el = document.getElementById("roadmap");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const executeLogout = () => {
    if (handleLogout) handleLogout();
    setShowProfileMenu(false);
    navigate("/");
  };

  const NAV_ITEMS = [
    { label: "Home", to: "/" },
    { label: "Predict", to: "/predict", isPredict: true },
    { label: "Assistant", to: "/chat" },
    { label: "Roadmaps", to: "/#roadmap", isRoadmap: true },
    { label: "Assessments", to: "/quiz" },
  ];

  // Do not render navbar on chat route to avoid visual collision
  if (location.pathname === "/chat") {
    return null;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

        /* ═══ PREMIUM DUAL-ENGINE AI GLASS NAVBAR ═══ */
        .pnx-nav-wrapper {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 99999;
          display: flex;
          justify-content: center;
          padding: 20px 24px;
          transition: padding 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
          will-change: transform;
        }
        .pnx-nav-wrapper.scrolled {
          padding: 10px 24px;
        }

        .pnx-nav-container {
          pointer-events: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: 1000px;
          height: 48px;
          background: rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(20px) saturate(190%);
          -webkit-backdrop-filter: blur(20px) saturate(190%);
          border-radius: 100px;
          padding: 0 6px 0 20px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 
            0 1px 2px rgba(0, 0, 0, 0.01),
            0 8px 30px -10px rgba(0, 0, 0, 0.05),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.2),
            inset 0 -1px 0 0 rgba(255, 255, 255, 0.05);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }

        .pnx-nav-wrapper.scrolled .pnx-nav-container {
          height: 44px;
          background: rgba(255, 255, 255, 0.09);
          backdrop-filter: blur(24px) saturate(200%);
          -webkit-backdrop-filter: blur(24px) saturate(200%);
          border-color: rgba(255, 255, 255, 0.22);
          box-shadow: 
            0 1px 2px rgba(0, 0, 0, 0.02),
            0 16px 40px -12px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.25),
            inset 0 -1px 0 0 rgba(255, 255, 255, 0.05);
        }

        /* Ambient glow ribbon behind the navbar */
        .pnx-nav-glow {
          position: absolute;
          top: -20px; left: 15%; right: 15%; height: 40px;
          background: radial-gradient(circle, rgba(124, 58, 237, 0.06) 0%, transparent 70%);
          filter: blur(12px);
          pointer-events: none;
          z-index: -1;
          transition: opacity 0.5s;
        }

        /* ─── BRAND LOGO / ORB ─── */
        .pnx-logo-link {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          user-select: none;
        }

        .pnx-orb-container {
          position: relative;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pnx-orb-core {
          width: 8px;
          height: 8px;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(124, 58, 237, 0.6);
          position: relative;
          z-index: 2;
        }

        /* AI Pulsing Rings */
        .pnx-orb-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 1px solid rgba(124, 58, 237, 0.3);
          border-radius: 50%;
          animation: pnxOrbPulse 2.5s infinite cubic-bezier(0.21, 0.6, 0.35, 1);
          pointer-events: none;
        }
        .pnx-orb-ring:nth-child(2) {
          animation-delay: 0.8s;
        }

        @keyframes pnxOrbPulse {
          0% { transform: scale(0.65); opacity: 0.8; }
          100% { transform: scale(2); opacity: 0; filter: blur(1px); }
        }

        .pnx-brand-typography {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }

        .pnx-brand-main {
          display: flex;
          align-items: baseline;
        }

        .pnx-brand-serif {
          font-family: 'Instrument Serif', serif;
          font-style: italic;
          font-size: 1.35rem;
          font-weight: 500;
          color: #0f0f0f;
          letter-spacing: -0.02em;
        }

        .pnx-brand-sans {
          font-family: 'Outfit', sans-serif;
          font-size: 1.05rem;
          font-weight: 600;
          color: #0f0f0f;
          letter-spacing: -0.01em;
          margin-left: -1px;
        }

        .pnx-brand-sub {
          font-family: 'DM Mono', monospace;
          font-size: 7px;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(124, 58, 237, 0.85);
          margin-top: 2px;
        }

        /* ─── CENTER NAVIGATION PILLS ─── */
        .pnx-nav-links {
          display: flex;
          align-items: center;
          gap: 2px;
          background: rgba(255, 255, 255, 0.2);
          padding: 3px;
          border-radius: 100px;
          border: 1px solid rgba(0, 0, 0, 0.02);
          position: relative;
        }
        
        @media (max-width: 1100px) {
          .pnx-nav-links { display: none; }
        }

        .pnx-nav-item {
          padding: 6px 10px;
          color: rgba(15, 15, 15, 0.45);
          text-decoration: none;
          font-size: 0.76rem;
          font-weight: 500;
          font-family: 'Outfit', sans-serif;
          letter-spacing: 0.01em;
          border-radius: 100px;
          position: relative;
          transition: color 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pnx-nav-item:hover {
          color: rgba(15, 15, 15, 0.9);
        }

        .pnx-nav-item.active {
          color: #fff !important;
        }

        .pnx-hover-bg {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.04);
          border-radius: 100px;
          z-index: -1;
        }

        .pnx-active-bg {
          position: absolute;
          inset: 0;
          background: #0f0f0f;
          border-radius: 100px;
          z-index: -1;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        /* ─── RIGHT SECTION ─── */
        .pnx-right-section {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* Telemetry dashboard pill */
        .pnx-telemetry-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 10px;
          background: rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 100px;
          cursor: pointer;
          user-select: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pnx-telemetry-badge:hover {
          background: rgba(0, 0, 0, 0.05);
          border-color: rgba(0, 0, 0, 0.12);
        }
        @media (max-width: 500px) {
          .pnx-telemetry-badge { display: none; }
        }

        .pnx-telemetry-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #8b5cf6;
          position: relative;
        }
        .pnx-telemetry-pulse {
          position: absolute;
          inset: -2px;
          border: 1px solid rgba(139, 92, 246, 0.4);
          border-radius: 50%;
          animation: pnxPurplePulse 2.5s infinite ease-out;
        }
        @keyframes pnxPurplePulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }

        .pnx-telemetry-text {
          font-family: 'DM Mono', monospace;
          font-size: 8.5px;
          color: rgba(15, 15, 15, 0.6);
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        /* Diagnostic dropdown popup */
        .pnx-telemetry-popup {
          position: absolute;
          top: calc(100% + 12px);
          right: 80px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(28px) saturate(180%);
          -webkit-backdrop-filter: blur(28px) saturate(180%);
          border: 1px solid rgba(124, 58, 237, 0.15);
          border-radius: 16px;
          padding: 16px;
          width: 240px;
          box-shadow: 
            0 0 0 0.5px rgba(0,0,0,0.02),
            0 20px 48px -10px rgba(124, 58, 237, 0.08);
          z-index: 1000;
        }

        .pnx-telemetry-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: #4b5563;
          margin-bottom: 8px;
          border-bottom: 1px dashed rgba(0,0,0,0.05);
          padding-bottom: 6px;
        }
        .pnx-telemetry-item:last-child {
          margin-bottom: 0;
          border-bottom: none;
          padding-bottom: 0;
        }

        /* Sign-in micro-button */
        .pnx-btn-signin {
          background: #0f0f0f;
          color: #fff;
          padding: 7px 18px;
          border-radius: 100px;
          font-size: 0.74rem;
          font-weight: 600;
          font-family: 'Outfit', sans-serif;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }
        .pnx-btn-signin::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }
        .pnx-btn-signin:hover {
          background: #1a1a1a;
          box-shadow: 0 6px 16px rgba(0,0,0,0.15);
          transform: translateY(-1px);
        }
        .pnx-btn-signin:hover::before {
          transform: translateX(100%);
        }
        
        @media (max-width: 1100px) {
          .pnx-btn-signin.desktop-only { display: none; }
        }

        /* Custom rounded profile capsule */
        .pnx-profile-capsule {
          position: relative;
        }

        .pnx-profile-avatar {
          width: 32px;
          height: 32px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #374151;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.5), 0 2px 8px rgba(0,0,0,0.02);
        }
        .pnx-profile-avatar:hover {
          background: rgba(255, 255, 255, 0.8);
          border-color: rgba(124, 58, 237, 0.25);
          color: #7c3aed;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.08);
        }

        /* Premium Glass dropdown menu */
        .pnx-profile-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(32px) saturate(180%);
          -webkit-backdrop-filter: blur(32px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 16px;
          padding: 6px;
          min-width: 200px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          box-shadow: 
            0 0 0 0.5px rgba(0,0,0,0.02),
            0 24px 64px -12px rgba(0, 0, 0, 0.08);
          z-index: 1000;
          transform-origin: top right;
        }

        .pnx-dropdown-item {
          padding: 10px 14px;
          color: #4b5563;
          font-size: 0.78rem;
          font-weight: 500;
          font-family: 'Outfit', sans-serif;
          cursor: pointer;
          border-radius: 10px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .pnx-dropdown-item:hover {
          background: rgba(124, 58, 237, 0.06);
          color: #7c3aed;
        }

        .pnx-dropdown-item.logout {
          color: #ef4444;
          border-top: 1px solid rgba(0,0,0,0.03);
          border-radius: 10px;
        }
        .pnx-dropdown-item.logout:hover {
          background: rgba(239, 68, 68, 0.05);
          color: #ef4444;
        }

        /* ─── MOBILE SYSTEM TOGGLE ─── */
        .pnx-mobile-toggle {
          display: none;
          width: 32px;
          height: 32px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.6);
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #374151;
          transition: all 0.3s;
        }
        .pnx-mobile-toggle:hover {
          background: rgba(255, 255, 255, 0.75);
          color: #000;
        }
        @media (max-width: 1100px) {
          .pnx-mobile-toggle { display: flex; }
        }

        /* ─── PREMIUM MOBILE SYSTEM OVERLAY (Bottom-sheet styling) ─── */
        .pnx-mobile-sheet {
          position: fixed;
          bottom: 24px; left: 16px; right: 16px;
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(32px) saturate(180%);
          -webkit-backdrop-filter: blur(32px) saturate(180%);
          border-radius: 30px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 
            0 24px 64px -8px rgba(0, 0, 0, 0.15),
            0 1px 3px rgba(0, 0, 0, 0.02);
          z-index: 10000;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .pnx-mobile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          padding-bottom: 14px;
        }

        .pnx-mobile-nav-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          max-height: 340px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .pnx-mobile-nav-card {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.5);
          border: 1px solid rgba(0, 0, 0, 0.04);
          border-radius: 18px;
          text-decoration: none;
          transition: all 0.25s;
        }
        .pnx-mobile-nav-card:hover {
          background: rgba(124, 58, 237, 0.05);
          border-color: rgba(124, 58, 237, 0.15);
        }
        .pnx-mobile-nav-card.active {
          background: linear-gradient(135deg, rgba(79, 70, 229, 0.08), rgba(124, 58, 237, 0.08));
          border-color: rgba(124, 58, 237, 0.25);
        }

        .pnx-mobile-nav-label {
          font-family: 'Outfit', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          color: #0f0f0f;
        }
        .pnx-mobile-nav-desc {
          font-family: 'Outfit', sans-serif;
          font-size: 0.65rem;
          color: #6b7280;
        }

        /* Popup Notification */
        .pnx-login-popup {
          position: fixed;
          top: 80px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(15, 15, 15, 0.9);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          color: white;
          padding: 8px 18px;
          border-radius: 100px;
          font-size: 0.76rem;
          font-family: 'Outfit', sans-serif;
          font-weight: 500;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
          z-index: 10001;
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>

      {/* Floating System-Wide Entrance */}
      <motion.div 
        className={`pnx-nav-wrapper ${scrolled ? "scrolled" : ""}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="pnx-nav-container">
          <div className="pnx-nav-glow" style={{ opacity: scrolled ? 0.4 : 0.85 }} />

          {/* LEFT: Branding & AI Pulsing Orb */}
          <Link to="/" className="pnx-logo-link">
            <div className="pnx-orb-container">
              <div className="pnx-orb-ring" />
              <div className="pnx-orb-ring" />
              <div className="pnx-orb-core" />
            </div>
            <div className="pnx-brand-typography">
              <div className="pnx-brand-main">
                <span className="pnx-brand-serif">P</span>
                <span className="pnx-brand-sans">athora</span>
              </div>
              <span className="pnx-brand-sub">Career Intelligence</span>
            </div>
          </Link>

          {/* CENTER: Navigation tabs with magnetic hover index & active layout animations */}
          <nav className="pnx-nav-links">
            {NAV_ITEMS.map((item, idx) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={item.isPredict ? handlePredictClick : (item.isRoadmap ? handleRoadmapsClick : undefined)}
                  className={`pnx-nav-item ${isActive ? "active" : ""}`}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{ position: "relative" }}
                >
                  {/* Liquid Hover Indicator */}
                  {hoveredIndex === idx && (
                    <motion.div 
                      layoutId="hoverTabBackground"
                      className="pnx-hover-bg"
                      transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    />
                  )}

                  {/* Active Selection Indicator */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabBackground"
                      className="pnx-active-bg"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span style={{ position: "relative", zIndex: 2 }}>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: Live Recruiter Status Diagnostics & Profile Dropdown */}
          <div className="pnx-right-section">
            {/* Live Recruiter Pulse Dashboard */}
            <div 
              className="pnx-telemetry-badge"
              onClick={() => setShowTelemetryPopup(!showTelemetryPopup)}
              ref={telemetryRef}
            >
              <div className="pnx-telemetry-dot">
                <div className="pnx-telemetry-pulse" />
              </div>
              <span className="pnx-telemetry-text">SYSTEM OPERATIONAL</span>
            </div>

            {/* Recruiter Telemetry Diagnostic Popover */}
            <AnimatePresence>
              {showTelemetryPopup && (
                <motion.div
                  className="pnx-telemetry-popup"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    background: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid rgba(0, 0, 0, 0.06)",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)"
                  }}
                >
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 12 }}>
                    <Cpu size={12} style={{ color: "#8b5cf6" }} />
                    <span style={{ fontSize: 9, fontWeight: 700, fontFamily: "'Outfit', sans-serif", letterSpacing: "0.05em", color: "#0f0f0f" }}>SYSTEM METRICS</span>
                  </div>
                  <div className="pnx-telemetry-item">
                    <span>API GATEWAY</span>
                    <span style={{ color: '#10b981', fontWeight: 600 }}>ONLINE</span>
                  </div>
                  <div className="pnx-telemetry-item">
                    <span>LATENCY</span>
                    <span style={{ color: '#0f0f0f', fontWeight: 600 }}>14ms</span>
                  </div>
                  <div className="pnx-telemetry-item">
                    <span>INFERENCE CORE</span>
                    <span style={{ color: '#8b5cf6', fontWeight: 600 }}>GEMINI 2.5</span>
                  </div>
                  <div className="pnx-telemetry-item" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                    <span>UPTIME SLA</span>
                    <span style={{ color: '#10b981', fontWeight: 600 }}>99.98%</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pnx-profile-capsule" ref={profileRef}>
              <motion.div 
                className="pnx-profile-avatar"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                whileHover={{ scale: 1.04, y: -0.5 }}
                whileTap={{ scale: 0.96 }}
              >
                {user ? (
                  <User size={15} strokeWidth={2} />
                ) : (
                  <Menu size={15} strokeWidth={2} />
                )}
              </motion.div>
              
              {/* Profile dropdown glass panel */}
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    className="pnx-profile-dropdown"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {user ? (
                      <>
                        <div className="pnx-dropdown-item session-info" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: 8, marginBottom: 4, cursor: 'default', pointerEvents: 'none' }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px rgba(16,185,129,0.5)' }} />
                          <span style={{ fontSize: '0.62rem', letterSpacing: '0.04em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.38)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 }}>
                            {user.email || "Active Session"}
                          </span>
                        </div>
                        <div className="pnx-dropdown-item" onClick={() => { setShowProfileMenu(false); navigate('/dashboard'); }}>
                          <LayoutDashboard size={14} />
                          <span>Dashboard</span>
                        </div>
                        <div className="pnx-dropdown-item" onClick={() => { setShowProfileMenu(false); navigate('/quiz'); }}>
                          <Brain size={14} />
                          <span>Assessments</span>
                        </div>
                        <div className="pnx-dropdown-item" onClick={() => { setShowProfileMenu(false); navigate('/plans'); }}>
                          <CreditCard size={14} />
                          <span>Plans & Pricing</span>
                        </div>
                        <div className="pnx-dropdown-item" onClick={() => { setShowProfileMenu(false); navigate('/settings'); }}>
                          <Settings size={14} />
                          <span>Preferences</span>
                        </div>
                        <div className="pnx-dropdown-item" onClick={() => { setShowProfileMenu(false); navigate('/admin'); }}>
                          <Terminal size={14} />
                          <span>Admin Console</span>
                        </div>
                        <div className="pnx-dropdown-item logout" onClick={executeLogout} style={{ borderTop: '1px solid rgba(0,0,0,0.05)', marginTop: 4, paddingTop: 8 }}>
                          <LogOut size={14} />
                          <span>Log out</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="pnx-dropdown-item session-info" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: 8, marginBottom: 4, cursor: 'default', pointerEvents: 'none' }}>
                          <span style={{ fontSize: '0.62rem', letterSpacing: '0.04em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.38)', fontWeight: 600 }}>System Console</span>
                        </div>
                        <div className="pnx-dropdown-item login-btn" onClick={() => { setShowProfileMenu(false); navigate('/login'); }} style={{ background: 'rgba(139, 92, 246, 0.08)', color: '#8b5cf6', fontWeight: 600 }}>
                          <User size={14} />
                          <span>Sign In</span>
                        </div>
                        <div className="pnx-dropdown-item" onClick={() => { setShowProfileMenu(false); navigate('/quiz'); }}>
                          <Brain size={14} />
                          <span>Assessments</span>
                        </div>
                        <div className="pnx-dropdown-item" onClick={() => { setShowProfileMenu(false); navigate('/plans'); }}>
                          <CreditCard size={14} />
                          <span>Plans & Pricing</span>
                        </div>
                        <div className="pnx-dropdown-item" onClick={() => { setShowProfileMenu(false); navigate('/dashboard'); }}>
                          <LayoutDashboard size={14} />
                          <span>Dashboard</span>
                        </div>
                        <div className="pnx-dropdown-item" onClick={() => { setShowProfileMenu(false); navigate('/settings'); }}>
                          <Settings size={14} />
                          <span>Preferences</span>
                        </div>
                        <div className="pnx-dropdown-item" onClick={() => { setShowProfileMenu(false); navigate('/admin'); }}>
                          <Terminal size={14} />
                          <span>Admin Console</span>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile diagnostic overlay toggle button */}
            <button
              className="pnx-mobile-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={menuOpen ? 'close' : 'menu'}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.25 }}
                >
                  {menuOpen ? <X size={16} strokeWidth={2.5} /> : <Menu size={16} strokeWidth={2.5} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Login requirement notifier trigger popup */}
      <AnimatePresence>
        {showLoginPopup && (
          <motion.div
            className="pnx-login-popup"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />
            Authentication required to unlock predictions.
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE CONTROL PANEL & NAVIGATION BOTTOM SHEET */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Blurred Backdrop Layer */}
            <motion.div 
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(10, 10, 14, 0.2)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                zIndex: 9998,
                pointerEvents: "auto"
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Premium Mobile Dock Panel */}
            <motion.div
              className="pnx-mobile-sheet"
              initial={{ y: 200, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 200, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
            >
              {/* Header section with diagnostics */}
              <div className="pnx-mobile-header">
                <div>
                  <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1rem', fontWeight: 700, color: '#0f0f0f' }}>Pathora System Panel</h4>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.65rem', color: '#6b7280', marginTop: 2 }}>Recruiter Intelligence Core</p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.15)', padding: '4px 10px', borderRadius: 100 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#8b5cf6', position: 'relative' }}>
                    <div className="pnx-telemetry-pulse" />
                  </div>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: '#8b5cf6', fontWeight: 'bold' }}>SYSTEM OPERATIONAL</span>
                </div>
              </div>

              {/* Segmented Navigation Cards */}
              <div className="pnx-mobile-nav-grid">
                {NAV_ITEMS.map((item) => {
                  const isActive = location.pathname === item.to;
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={(e) => {
                        setMenuOpen(false);
                        if (item.isPredict) handlePredictClick(e);
                        if (item.isRoadmap) handleRoadmapsClick(e);
                      }}
                      className={`pnx-mobile-nav-card ${isActive ? "active" : ""}`}
                    >
                      <span className="pnx-mobile-nav-label">{item.label}</span>
                      <span className="pnx-mobile-nav-desc">
                        {item.label === "Home" && "Gateway Hub"}
                        {item.label === "Predict" && "ATS Scanner"}
                        {item.label === "AI Assistant" && "Interactive Guide"}
                        {item.label === "Roadmaps" && "Trajectory Map"}
                        {item.label === "About" && "Our Mission"}
                        {item.label === "Contact" && "Get In Touch"}
                      </span>
                    </Link>
                  );
                })}

                {/* Additional Platform Features in Mobile Menu */}
                <Link to="/quiz" onClick={() => setMenuOpen(false)} className="pnx-mobile-nav-card">
                  <span className="pnx-mobile-nav-label">Quiz</span>
                  <span className="pnx-mobile-nav-desc">Assessments</span>
                </Link>
                <Link to="/plans" onClick={() => setMenuOpen(false)} className="pnx-mobile-nav-card">
                  <span className="pnx-mobile-nav-label">Plans</span>
                  <span className="pnx-mobile-nav-desc">Pricing Tier</span>
                </Link>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="pnx-mobile-nav-card">
                  <span className="pnx-mobile-nav-label">Dashboard</span>
                  <span className="pnx-mobile-nav-desc">Performance Center</span>
                </Link>
                <Link to="/settings" onClick={() => setMenuOpen(false)} className="pnx-mobile-nav-card">
                  <span className="pnx-mobile-nav-label">Settings</span>
                  <span className="pnx-mobile-nav-desc">Preferences</span>
                </Link>
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="pnx-mobile-nav-card">
                  <span className="pnx-mobile-nav-label">Admin</span>
                  <span className="pnx-mobile-nav-desc">Console Configuration</span>
                </Link>
                
                {/* Profile Card Action */}
                {user ? (
                  <div 
                    className="pnx-mobile-nav-card" 
                    onClick={() => { executeLogout(); setMenuOpen(false); }}
                    style={{ background: 'rgba(239, 68, 68, 0.04)', border: '1px solid rgba(239, 68, 68, 0.1)', gridColumn: 'span 2' }}
                  >
                    <span className="pnx-mobile-nav-label" style={{ color: '#ef4444' }}>Disconnect Session</span>
                    <span className="pnx-mobile-nav-desc">Sign Out ({user.email})</span>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="pnx-mobile-nav-card"
                    style={{ background: '#0f0f0f', borderColor: '#0f0f0f', gridColumn: 'span 2' }}
                  >
                    <span className="pnx-mobile-nav-label" style={{ color: '#fff' }}>Access Platform</span>
                    <span className="pnx-mobile-nav-desc" style={{ color: 'rgba(255,255,255,0.6)' }}>Sign In</span>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}