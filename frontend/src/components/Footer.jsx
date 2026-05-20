import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.pageYOffset > 400) {
        setShowScroll(true);
      } else if (showScroll && window.pageYOffset <= 400) {
        setShowScroll(false);
      }
    };
    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [showScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="footer-wrapper">
        <div className="footer-grid">
          <div className="footer-brand-col">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#000000", boxShadow: "0 0 15px rgba(0,0,0,0.4)" }} />
                <span style={{ fontSize: 20, fontWeight: 800, color: "#000000", letterSpacing: "0.08em", fontFamily: "'Outfit', sans-serif" }}>PATHORA</span>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.6, maxWidth: 320, marginBottom: 30, color: "#000000", fontWeight: 500 }}>
              The defining AI career intelligence platform of 2026. Empowering the next generation of engineers with predictive infrastructure.
            </p>
            <div style={{ display: "flex", gap: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.3s", color: "#000000", fontWeight: 700 }}>𝕏</div>
                <div style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.3s", color: "#000000", fontWeight: 700 }}>in</div>
                <div style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.3s", color: "#000000", fontWeight: 700 }}>gh</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <span style={{ color: "#000000", fontWeight: 700, marginBottom: 10, letterSpacing: "0.02em" }}>Core Platform</span>
            <Link to="/" style={{ color: "#000000", textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "opacity 0.2s" }}>Home</Link>
            <Link to="/dashboard" style={{ color: "#000000", textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "opacity 0.2s" }}>Dashboard</Link>
            <Link to="/predict" style={{ color: "#000000", textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "opacity 0.2s" }}>AI Predict</Link>
            <Link to="/chat" style={{ color: "#000000", textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "opacity 0.2s" }}>AI Assistant</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <span style={{ color: "#000000", fontWeight: 700, marginBottom: 10, letterSpacing: "0.02em" }}>Features & Utilities</span>
            <Link to="/quiz" style={{ color: "#000000", textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "opacity 0.2s" }}>Assessments</Link>
            <Link to="/plans" style={{ color: "#000000", textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "opacity 0.2s" }}>Pricing Plans</Link>
            <Link to="/settings" style={{ color: "#000000", textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "opacity 0.2s" }}>Settings</Link>
            <Link to="/admin" style={{ color: "#000000", textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "opacity 0.2s" }}>Admin Panel</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <span style={{ color: "#000000", fontWeight: 700, marginBottom: 10, letterSpacing: "0.02em" }}>Organization</span>
            <Link to="/about" style={{ color: "#000000", textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "opacity 0.2s" }}>About Us</Link>
            <Link to="/contact" style={{ color: "#000000", textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "opacity 0.2s" }}>Contact</Link>
            <Link to="/login" style={{ color: "#000000", textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "opacity 0.2s" }}>Client Portal</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span style={{ fontSize: 14, color: "#000000", fontWeight: 600 }}>© 2026 Pathora Inc. Building the future of enterprise career intelligence.</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(0,0,0,0.05)", padding: "6px 14px", borderRadius: 20, border: "1px solid rgba(0,0,0,0.1)" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#059669", boxShadow: "0 0 10px rgba(5,150,105,0.4)", animation: "dotPulseGreen 2s infinite" }} />
              <span style={{ fontSize: 13, color: "#000000", fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>AI Systems Active & Nominal</span>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <div 
        className={`footer-scroll-top ${showScroll ? 'visible' : ''}`}
        onClick={scrollToTop}
        title="Scroll to Top"
      >
        ↑
      </div>
    </>
  );
};

export default Footer;
