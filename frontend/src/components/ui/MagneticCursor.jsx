import React, { useRef, useEffect } from 'react';

export default function MagneticCursor() {
  const ringRef = useRef(null);
  const dotRef  = useRef(null);
  const cur     = useRef({ x: 0, y: 0 });
  const tgt     = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      tgt.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + "px";
        dotRef.current.style.top  = e.clientY + "px";
      }
    };
    const loop = () => {
      cur.current.x += (tgt.current.x - cur.current.x) * 0.12;
      cur.current.y += (tgt.current.y - cur.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = cur.current.x + "px";
        ringRef.current.style.top  = cur.current.y + "px";
      }
      requestAnimationFrame(loop);
    };
    const grow   = () => { if (ringRef.current) { ringRef.current.style.width = "48px"; ringRef.current.style.height = "48px"; ringRef.current.style.borderColor = "rgba(124,58,237,0.8)"; ringRef.current.style.opacity = "0.7"; } };
    const shrink = () => { if (ringRef.current) { ringRef.current.style.width = "22px"; ringRef.current.style.height = "22px"; ringRef.current.style.borderColor = "rgba(124,58,237,0.5)"; ringRef.current.style.opacity = "0.35"; } };
    const attach = () => {
      document.querySelectorAll("button,input,label,a,.glass-panel,.kpi-card,.upload-zone,.skill-tag,.sim-checkbox").forEach(el => {
        el.removeEventListener("mouseenter", grow);
        el.removeEventListener("mouseleave", shrink);
        el.addEventListener("mouseenter", grow);
        el.addEventListener("mouseleave", shrink);
      });
    };
    window.addEventListener("mousemove", onMove);
    loop();
    attach();
    const obs = new MutationObserver(attach);
    obs.observe(document.body, { childList: true, subtree: true });
    return () => { window.removeEventListener("mousemove", onMove); obs.disconnect(); };
  }, []);

  return (
    <>
      <div ref={ringRef} style={{
        position:"fixed", pointerEvents:"none", zIndex:9999,
        width:"22px", height:"22px",
        border:"1.5px solid rgba(124,58,237,0.5)",
        borderRadius:"50%",
        transform:"translate(-50%,-50%)",
        opacity:0.35,
        transition:"width 0.2s ease, height 0.2s ease, opacity 0.2s ease, border-color 0.2s ease",
        mixBlendMode:"difference",
      }} />
      <div ref={dotRef} style={{
        position:"fixed", pointerEvents:"none", zIndex:9999,
        width:"4px", height:"4px",
        background:"#7c3aed",
        borderRadius:"50%",
        transform:"translate(-50%,-50%)",
        boxShadow:"0 0 8px 2px rgba(124,58,237,0.4)",
      }} />
    </>
  );
}
