import React from 'react';

export default function AmbientBg({ scoreColor }) {
  const c = scoreColor || "#7c3aed";
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
      <div style={{
        position:"absolute", width:900, height:900, borderRadius:"50%",
        background:`radial-gradient(circle, ${c}12 0%, transparent 60%)`,
        top:"-300px", right:"-200px",
        animation:"orb 20s ease-in-out infinite",
        transform: "translateZ(0)"
      }} />
      <div style={{
        position:"absolute", width:700, height:700, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 60%)",
        bottom:"-150px", left:"-150px",
        animation:"orb 25s ease-in-out infinite reverse",
        transform: "translateZ(0)"
      }} />
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.015 }}>
        <defs>
          <pattern id="pnxDots" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#111" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pnxDots)" />
      </svg>
    </div>
  );
}
