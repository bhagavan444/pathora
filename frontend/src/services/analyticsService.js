export const getScoreColor = (s) =>
  s >= 80 ? "#059669" : s >= 60 ? "#d97706" : "#4f46e5";

export const getScoreLabel = (s) =>
  s >= 80 ? "Optimal Alignment" : s >= 60 ? "Moderate Alignment" : "Calibration Needed";

export const getReadyLabel = (s) =>
  s >= 80 ? "Enterprise Ready" : s >= 60 ? "Industry Ready" : "Development Phase";

export const safeArr = (v) => (Array.isArray(v) ? v : []);
