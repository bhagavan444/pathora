import React, { useRef, useEffect } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';

export default function AnalysisTimeline() {
  const { terminalLogs } = useTelemetry();
  const terminalEndRef = useRef(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs]);

  return (
    <div className="glass-panel" style={{
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      padding: 20,
      fontFamily: "'DM Mono', monospace",
      fontSize: 12,
      color: "#374151",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
      height: 280,
      display: "flex",
      flexDirection: "column",
      position: "relative",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #f3f4f6",
        paddingBottom: 12,
        marginBottom: 12,
        color: "#6b7280",
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.05em"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <TerminalIcon size={14} style={{ color: "#7c3aed" }} />
          <span style={{ fontWeight: 600 }}>SYSTEM TELEMETRY : PIPELINE ACTIVE</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444" }} />
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fbbf24" }} />
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
        </div>
      </div>

      <div className="custom-scroll" style={{
        flex: 1,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        paddingRight: 6,
        zIndex: 2,
      }}>
        {terminalLogs.map((log, index) => {
          let color = "#4b5563"; // default gray
          if (log.includes("[WARN]")) color = "#ea580c";
          else if (log.includes("[CRITICAL]")) color = "#dc2626";
          else if (log.includes("[METRIC]")) color = "#059669";
          else if (log.includes("[PROCESSING]")) color = "#4f46e5";

          return (
            <div key={index} style={{ color, wordBreak: "break-all", lineHeight: 1.4 }}>
              {log}
            </div>
          );
        })}
        {terminalLogs.length === 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#9ca3af", fontStyle: "italic" }}>
                <span>Awaiting telemetry payload...</span>
            </div>
        )}
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}
