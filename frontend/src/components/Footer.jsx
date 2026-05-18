import React from 'react';

const Footer = () => (
  <footer style={{
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderTop: "1px solid rgba(255,255,255,0.4)",
    padding: "80px 40px 40px",
    color: "#4b5563",
    marginTop: 100,
    position: "relative",
    zIndex: 10
  }}>
    <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 60, marginBottom: 60 }}>
      <div style={{ gridColumn: "span 2" }}>
         <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#7c3aed", boxShadow: "0 0 15px rgba(124,58,237,0.4)" }} />
            <span style={{ fontSize: 20, fontWeight: 700, color: "#111", letterSpacing: "0.08em", fontFamily: "'Outfit', sans-serif" }}>PATHORA</span>
         </div>
         <p style={{ fontSize: 15, lineHeight: 1.6, maxWidth: 320, marginBottom: 30, color: "#4b5563" }}>
           Enterprise-grade career intelligence system powered by advanced neural analysis.
         </p>
         <div style={{ display: "flex", gap: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.3s", color: "#374151" }}>𝕏</div>
            <div style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.3s", color: "#374151" }}>in</div>
            <div style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.3s", color: "#374151" }}>gh</div>
         </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
         <span style={{ color: "#111", fontWeight: 600, marginBottom: 10, letterSpacing: "0.02em" }}>Platform</span>
         <a href="#" style={{ color: "#4b5563", textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}>AI Analysis</a>
         <a href="#" style={{ color: "#4b5563", textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}>Career Mapping</a>
         <a href="#" style={{ color: "#4b5563", textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}>Resume Intelligence</a>
         <a href="#" style={{ color: "#4b5563", textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}>Dashboard</a>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
         <span style={{ color: "#111", fontWeight: 600, marginBottom: 10, letterSpacing: "0.02em" }}>Resources</span>
         <a href="#" style={{ color: "#4b5563", textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}>Documentation</a>
         <a href="#" style={{ color: "#4b5563", textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}>Blog</a>
         <a href="#" style={{ color: "#4b5563", textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}>Community</a>
         <a href="#" style={{ color: "#4b5563", textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}>Support</a>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
         <span style={{ color: "#111", fontWeight: 600, marginBottom: 10, letterSpacing: "0.02em" }}>Contact</span>
         <a href="#" style={{ color: "#4b5563", textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}>Email Us</a>
         <a href="#" style={{ color: "#4b5563", textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}>GitHub</a>
         <a href="#" style={{ color: "#4b5563", textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}>Privacy Policy</a>
         <a href="#" style={{ color: "#4b5563", textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}>Terms of Service</a>
      </div>
    </div>
    <div style={{ maxWidth: 1240, margin: "0 auto", borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: 30, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
       <span style={{ fontSize: 13, color: "#6b7280" }}>© 2026 Pathora Inc. All rights reserved.</span>
       <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.6)", padding: "6px 14px", borderRadius: 20, border: "1px solid rgba(0,0,0,0.05)" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#059669", boxShadow: "0 0 10px rgba(5,150,105,0.4)", animation: "dotPulseGreen 2s infinite" }} />
          <span style={{ fontSize: 12, color: "#374151", fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>All Systems Operational</span>
       </div>
    </div>
  </footer>
);

export default Footer;
