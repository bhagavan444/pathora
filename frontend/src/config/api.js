// ============================================================
// CENTRALIZED API CONFIGURATION — PATHORA
// ============================================================
// Single source of truth for all backend API routing.
// Never hardcode localhost or production URLs in components.
// ============================================================

const API_BASE = import.meta.env.VITE_API_BASE_URL
  || (import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://pathora-backend1.onrender.com");

// Log active backend target on startup (visible in browser console)
console.log(`[PATHORA] API_BASE resolved to: ${API_BASE} (mode: ${import.meta.env.MODE})`);

export default API_BASE;
