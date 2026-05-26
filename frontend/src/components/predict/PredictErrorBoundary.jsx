import React, { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class PredictErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Predict UI Engine Crash:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "50vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
          background: "#0f0f0f",
          color: "#fff",
          fontFamily: "'DM Mono', monospace",
          textAlign: "center"
        }}>
          <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: 20 }} />
          <h2 style={{ fontSize: 24, marginBottom: 12 }}>Cognitive UI Engine Failure</h2>
          <p style={{ color: "#9ca3af", maxWidth: 600, marginBottom: 30, fontSize: 14 }}>
            A critical error occurred while rendering the intelligence interface.
            The error has been safely contained by the Error Boundary to prevent full application crash.
          </p>
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", padding: 16, borderRadius: 8, marginBottom: 30, color: "#fca5a5", fontSize: 12, textAlign: "left", maxWidth: 600, overflow: "auto" }}>
            {this.state.error?.toString()}
          </div>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: "#7c3aed",
              color: "#fff",
              border: "none",
              padding: "12px 24px",
              borderRadius: 8,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 600
            }}
          >
            <RefreshCw size={16} /> Restart Intelligence Engine
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default PredictErrorBoundary;
