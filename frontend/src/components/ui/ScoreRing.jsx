import React from 'react';
import { motion } from 'framer-motion';

export default function ScoreRing({ score, color, size }) {
  const sz   = size || 180;
  const r    = Math.round(sz * 0.43);
  const cx   = sz / 2;
  const cy   = sz / 2;
  const circ = 2 * Math.PI * r;
  const dash = Math.min((score / 100) * circ, circ);
  const gid  = `ring-${Math.round(score)}`;

  return (
    <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`}
      className="score-glow" style={{ display:"block" }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0, 0, 0, 0.03)" strokeWidth="12" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="14" />
      <motion.circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke={`url(#${gid})`}
        strokeWidth="12" strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset={circ / 4}
        initial={{ strokeDasharray: `0 ${circ}` }}
        animate={{ strokeDasharray: `${dash} ${circ}` }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      <defs>
        <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={color} />
          <stop offset="100%" stopColor={
            color === "#059669" ? "#10b981"
            : color === "#d97706" ? "#f59e0b"
            : "#6366f1"
          } />
        </linearGradient>
      </defs>
    </svg>
  );
}
