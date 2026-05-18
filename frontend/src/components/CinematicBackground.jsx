import React from "react";

const CinematicBackground = () => {
  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 0,
      pointerEvents: "none",
      overflow: "hidden",
      backgroundColor: "#f0f0ee"
    }}>
      {/* 
        Video Background 
        GPU-optimized rendering using transform-gpu
      */}
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          transform: "translateZ(0)",
          opacity: 1
        }}
      >
        <source 
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4" 
          type="video/mp4" 
        />
      </video>

      {/* OVERLAY SYSTEM */}
      
      {/* 1. Soft white gradient haze */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.05), transparent)",
        mixBlendMode: "overlay"
      }}></div>
      
      {/* 2. Light gray editorial gradient */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "linear-gradient(to top right, rgba(107,114,128,0.05), transparent, rgba(156,163,175,0.05))"
      }}></div>
      
      {/* 3. Radial vignette overlay (very subtle) */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.03) 100%)"
      }}></div>
      
      {/* 4. Ultra-light glass blur layer */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
        backgroundColor: "rgba(255,255,255,0.05)"
      }}></div>
      
      {/* 5. Very faint AI particle atmosphere (simulated with faint violet gradient) */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "linear-gradient(to bottom left, rgba(139,92,246,0.05), transparent, transparent)",
        mixBlendMode: "screen"
      }}></div>
      
      {/* 6. Soft cinematic lighting reflections */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "linear-gradient(to top, rgba(255,255,255,0.1), transparent, transparent)"
      }}></div>
    </div>
  );
};

export default CinematicBackground;
