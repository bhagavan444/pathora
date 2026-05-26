import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, X, User, Cpu, 
  Settings, LogOut, LayoutDashboard,
  Brain, CreditCard, Terminal, ChevronDown
} from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export default function Navbar({ handleLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showTelemetryPopup, setShowTelemetryPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const profileRef = useRef(null);
  const telemetryRef = useRef(null);
  const moreMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll listener
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

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfileMenu(false);
      if (telemetryRef.current && !telemetryRef.current.contains(e.target)) setShowTelemetryPopup(false);
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) setShowMoreMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset menus on route navigation
  useEffect(() => {
    setMenuOpen(false);
    setShowMoreMenu(false);
    setShowProfileMenu(false);
  }, [location.pathname]);

  const handlePredictClick = (e) => {
    if (!user) {
      e.preventDefault();
      setShowLoginPopup(true);
      setTimeout(() => setShowLoginPopup(false), 3000);
    }
  };

  const executeLogout = () => {
    if (handleLogout) handleLogout();
    setShowProfileMenu(false);
    navigate("/");
  };

  const TOP_NAV = [
    { label: "Home", to: "/" },
    { label: "Predict", to: "/predict", isPredict: true },
    { label: "Quiz", to: "/quiz" },
    { label: "Pathora Bot", to: "/chat" }
  ];

  const DROPDOWN_SECTIONS = [
    {
      title: "Features & Utilities",
      items: [
        { label: "Platform", to: "/platform" },
        { label: "Dashboard", to: "/dashboard" },
        { label: "Pricing Plans", to: "/plans" },
        { label: "Settings", to: "/settings" },
        { label: "Admin Panel", to: "/admin" }
      ]
    },
    {
      title: "Resources",
      items: [
        { label: "Docs", to: "/docs" },
        { label: "Research", to: "/research" },
        { label: "Resources", to: "/resources" }
      ]
    },
    {
      title: "Organization",
      items: [
        { label: "About Us", to: "/about" },
        { label: "Careers", to: "/careers" },
        { label: "Contact", to: "/contact" },
        { label: "Client Portal", to: "/login" }
      ]
    },
    {
      title: "Legal",
      items: [
        { label: "Privacy", to: "/privacy" },
        { label: "Terms", to: "/terms" }
      ]
    }
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Mono:wght@300;400;500;600&display=swap');

        /* ═══ PREMIUM AI INFRASTRUCTURE NAVBAR ═══ */
        .pnx-nav-wrapper {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 99999;
          display: flex;
          justify-content: center;
          padding: 10px 24px;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
          will-change: transform;
          background: transparent;
          border-bottom: 1px solid transparent;
        }
        .pnx-nav-wrapper.scrolled {
          padding: 4px 24px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(32px) saturate(120%);
          -webkit-backdrop-filter: blur(32px) saturate(120%);
          border-bottom: 1px solid rgba(0, 0, 0, 0.03);
          box-shadow: 0 4px 24px rgba(0,0,0,0.02);
        }

        .pnx-nav-container {
          pointer-events: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: 1100px;
          height: 40px;
          position: relative;
        }

        .pnx-nav-wrapper.scrolled .pnx-nav-container {
          height: 32px;
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
          font-weight: 300;
          color: #0f0f0f;
          letter-spacing: -0.02em;
        }
        .pnx-brand-sans {
          font-family: 'Outfit', sans-serif;
          font-size: 1.05rem;
          font-weight: 300;
          color: #0f0f0f;
          letter-spacing: 0.02em;
          margin-left: 2px;
        }
        .pnx-brand-sub {
          font-family: 'DM Mono', monospace;
          font-size: 6.5px;
          font-weight: 400;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(124, 58, 237, 0.6);
          margin-top: 5px;
        }

        /* ─── CENTER NAVIGATION PILLS ─── */
        .pnx-nav-links {
          display: flex;
          align-items: center;
          gap: 28px;
          position: relative;
        }
        
        @media (max-width: 1100px) {
          .pnx-nav-links { display: none; }
        }

        .pnx-nav-item {
          padding: 4px 0;
          color: rgba(15, 15, 15, 0.45);
          text-decoration: none;
          font-size: 0.78rem;
          font-weight: 300;
          font-family: 'Outfit', sans-serif;
          letter-spacing: 0.06em;
          position: relative;
          transition: color 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .pnx-nav-item:hover {
          color: rgba(15, 15, 15, 0.95);
          transform: translateY(-0.5px);
        }

        .pnx-nav-item.active {
          color: #0f0f0f !important;
          font-weight: 500;
        }

        .pnx-hover-bg {
          position: absolute;
          bottom: -4px;
          left: 0;
          right: 0;
          height: 1px;
          background: rgba(0, 0, 0, 0.08);
          border-radius: 2px;
          z-index: -1;
        }

        .pnx-active-bg {
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 1.5px;
          background: linear-gradient(90deg, transparent, rgba(15, 15, 15, 0.8), transparent);
          border-radius: 2px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
          z-index: -1;
        }

        /* ─── MORE DROPDOWN ─── */
        .pnx-more-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: -20px;
          left: auto;
          transform: none;
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(48px) saturate(200%);
          -webkit-backdrop-filter: blur(48px) saturate(200%);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 14px;
          padding: 16px 20px;
          width: max-content;
          display: flex;
          gap: 24px;
          box-shadow: 0 12px 32px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.5);
          z-index: 1000;
        }
        
        .pnx-more-col {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .pnx-more-header {
          font-size: 9px;
          font-family: 'DM Mono', monospace;
          color: rgba(15,15,15,0.4);
          text-transform: uppercase;
          letter-spacing: .08em;
          margin-bottom: 6px;
          font-weight: 600;
        }

        .pnx-more-link {
          font-size: 12.5px;
          color: rgba(15,15,15,0.65);
          text-decoration: none;
          font-family: 'Outfit', sans-serif;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 8px;
          border-radius: 6px;
          margin-left: -8px;
        }
        .pnx-more-link:hover {
          color: rgba(15,15,15,0.95);
          background: rgba(0,0,0,0.03);
          transform: translateX(1px);
        }
        .pnx-more-link.active {
          color: #0f0f0f;
          font-weight: 500;
          background: rgba(0,0,0,0.02);
        }

        /* ─── RIGHT SECTION ─── */
        .pnx-right-section {
          display: flex;
          align-items: center;
          gap: 10px;
        }

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
          transition: all 0.3s;
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

        .pnx-telemetry-text {
          font-family: 'DM Mono', monospace;
          font-size: 8.5px;
          color: rgba(15, 15, 15, 0.6);
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .pnx-telemetry-popup {
          position: absolute;
          top: calc(100% + 12px);
          right: 80px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(28px) saturate(180%);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 16px;
          padding: 16px;
          width: 240px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
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
          transition: all 0.3s;
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.5), 0 2px 8px rgba(0,0,0,0.02);
        }
        .pnx-profile-avatar:hover {
          background: rgba(255, 255, 255, 0.8);
          border-color: rgba(124, 58, 237, 0.25);
          color: #7c3aed;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.08);
        }

        .pnx-profile-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(32px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 16px;
          padding: 6px;
          min-width: 200px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          box-shadow: 0 24px 64px -12px rgba(0, 0, 0, 0.08);
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
          text-decoration: none;
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

        /* ─── MOBILE SYSTEM ─── */
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
        @media (max-width: 1100px) {
          .pnx-mobile-toggle { display: flex; }
        }

        .pnx-mobile-sheet {
          position: fixed;
          top: 0; right: 0; bottom: 0;
          width: 300px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(32px) saturate(180%);
          border-left: 1px solid rgba(0, 0, 0, 0.06);
          box-shadow: -10px 0 40px rgba(0, 0, 0, 0.05);
          z-index: 10000;
          padding: 80px 24px 24px;
          display: flex;
          flex-direction: column;
          gap: 32px;
          overflow-y: auto;
        }
        
        .pnx-mobile-close {
          position: absolute;
          top: 24px;
          right: 24px;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--ts);
        }

        .pnx-mobile-nav-col {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .pnx-mobile-link {
          font-size: 18px;
          font-weight: 500;
          color: var(--tp);
          text-decoration: none;
          font-family: 'Outfit', sans-serif;
        }

        .pnx-mobile-acc-header {
          font-size: 11px;
          font-family: 'DM Mono', monospace;
          color: var(--tm, rgba(0,0,0,0.4));
          text-transform: uppercase;
          letter-spacing: .1em;
          margin-bottom: 12px;
          margin-top: 24px;
          font-weight: 600;
        }

        .pnx-mobile-acc-item {
          font-size: 15px;
          color: var(--ts, rgba(0,0,0,0.6));
          text-decoration: none;
          font-family: 'Outfit', sans-serif;
          margin-bottom: 16px;
          display: block;
        }

        .pnx-login-popup {
          position: fixed;
          top: 80px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(15, 15, 15, 0.9);
          backdrop-filter: blur(12px);
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
          {/* LEFT: Branding */}
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

          {/* CENTER: Navigation tabs */}
          <nav className="pnx-nav-links">
            {TOP_NAV.map((item, idx) => {
              const isActive = location.pathname === item.to || (item.to !== "/" && location.pathname.startsWith(item.to));
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={item.isPredict ? handlePredictClick : undefined}
                  className={`pnx-nav-item ${isActive ? "active" : ""}`}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {hoveredIndex === idx && <motion.div layoutId="hoverTabBackground" className="pnx-hover-bg" transition={{ type: "spring", stiffness: 450, damping: 30 }} />}
                  {isActive && <motion.div layoutId="activeTabBackground" className="pnx-active-bg" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                  <span style={{ position: "relative", zIndex: 2 }}>{item.label}</span>
                </Link>
              );
            })}
            
            {/* MORE DROPDOWN TRIGGER */}
            <div 
              className={`pnx-nav-item`}
              ref={moreMenuRef}
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              style={{ display: "flex", gap: 4 }}
            >
              <span style={{ position: "relative", zIndex: 2 }}>More</span>
              <ChevronDown size={14} style={{ opacity: 0.5 }} />
              
              <AnimatePresence>
                {showMoreMenu && (
                  <motion.div
                    className="pnx-more-dropdown"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {DROPDOWN_SECTIONS.map((section) => (
                      <div key={section.title} className="pnx-more-col">
                        <div className="pnx-more-header">{section.title}</div>
                        {section.items.map(link => {
                          const isLinkActive = location.pathname === link.to;
                          return (
                            <Link 
                              key={link.label} 
                              to={link.to} 
                              className={`pnx-more-link ${isLinkActive ? "active" : ""}`}
                              onClick={(e) => {
                                if(link.isPredict) handlePredictClick(e);
                                setShowMoreMenu(false);
                              }}
                            >
                              {link.label}
                            </Link>
                          );
                        })}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* RIGHT: Diagnostics & Profile */}
          <div className="pnx-right-section">
            <div className="pnx-telemetry-badge" onClick={() => setShowTelemetryPopup(!showTelemetryPopup)} ref={telemetryRef}>
              <div className="pnx-telemetry-dot">
                <div className="pnx-telemetry-pulse" />
              </div>
              <span className="pnx-telemetry-text">SYSTEM OPERATIONAL</span>
            </div>

            <AnimatePresence>
              {showTelemetryPopup && (
                <motion.div
                  className="pnx-telemetry-popup"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
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
                {user ? <User size={15} strokeWidth={2} /> : <User size={15} strokeWidth={2} />}
              </motion.div>
              
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    className="pnx-profile-dropdown"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {user ? (
                      <>
                        <div className="pnx-dropdown-item" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: 8, cursor: 'default', pointerEvents: 'none' }}>
                          <span style={{ fontSize: '0.62rem', letterSpacing: '0.04em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.38)', fontWeight: 600 }}>
                            {user.email}
                          </span>
                        </div>
                        <Link to="/dashboard" className="pnx-dropdown-item"><LayoutDashboard size={14} /> Dashboard</Link>
                        <Link to="/settings" className="pnx-dropdown-item"><Settings size={14} /> Preferences</Link>
                        <div className="pnx-dropdown-item logout" onClick={executeLogout} style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                          <LogOut size={14} /> Log out
                        </div>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="pnx-dropdown-item" style={{ background: 'rgba(139, 92, 246, 0.08)', color: '#8b5cf6', fontWeight: 600 }}>
                          <User size={14} /> Sign In
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button className="pnx-mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showLoginPopup && (
          <motion.div
            className="pnx-login-popup"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
          >
            Authentication required to unlock predictions.
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE SLIDE DRAWER */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div 
              style={{
                position: "fixed", inset: 0, background: "rgba(10, 10, 14, 0.4)",
                backdropFilter: "blur(4px)", zIndex: 9998, pointerEvents: "auto"
              }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="pnx-mobile-sheet"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
            >
              <button className="pnx-mobile-close" onClick={() => setMenuOpen(false)}>
                <X size={24} />
              </button>

              <div className="pnx-mobile-nav-col">
                {TOP_NAV.map(item => (
                  <Link key={item.label} to={item.to} className="pnx-mobile-link" onClick={(e) => {
                    if(item.isPredict) handlePredictClick(e);
                    setMenuOpen(false);
                  }}>
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="pnx-mobile-acc-group">
                {DROPDOWN_SECTIONS.map(section => (
                  <div key={section.title}>
                    <div className="pnx-mobile-acc-header">{section.title}</div>
                    {section.items.map(link => (
                      <Link key={link.label} to={link.to} className="pnx-mobile-acc-item" onClick={(e) => {
                        if(link.isPredict) handlePredictClick(e);
                        setMenuOpen(false);
                      }}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}