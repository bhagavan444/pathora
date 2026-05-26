import React, { useState, useEffect } from "react";
import { Terminal } from "lucide-react";

// Extremely lightweight, hardware-accelerated loader
// Follows strict "no heavy spinning animations" rule
const InfrastructureLoader = () => {
  const [dots, setDots] = useState("");
  const messages = [
    "Initializing infrastructure module",
    "Synchronizing engineering vectors",
    "Loading operational intelligence",
    "Establishing secure pipeline",
    "Warming up telemetry systems"
  ];
  
  // Pick a random message per load to feel dynamic but deterministic
  const [msg] = useState(() => messages[Math.floor(Math.random() * messages.length)]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "transparent",
        color: "rgba(0,0,0,0.6)",
        fontFamily: "'DM Mono', monospace",
        fontSize: "12px",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        willChange: "opacity",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden"
      }}
    >
      <Terminal size={18} style={{ marginBottom: "16px", color: "#8b5cf6" }} />
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <span>{msg}</span>
        <span style={{ width: "24px", textAlign: "left" }}>{dots}</span>
      </div>
    </div>
  );
};

export default InfrastructureLoader;
