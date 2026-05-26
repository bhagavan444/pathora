import React, { createContext, useContext, useState, useCallback } from 'react';

const TelemetryContext = createContext();

export function TelemetryProvider({ children }) {
  const [terminalLogs, setTerminalLogs] = useState([
    "System: Application initialized. Ready for document processing.",
    "Telemetry: Awaiting live backend SSE stream..."
  ]);
  const [latency, setLatency] = useState(0);
  const [drift, setDrift] = useState(0.00);
  const [resolution, setResolution] = useState(0.0);

  const addLog = useCallback((message, type = "INFO") => {
    const now = new Date();
    const timeStr = `[${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}]`;
    setTerminalLogs(prev => {
      const next = [...prev, `${timeStr} [${type}] ${message}`];
      if (next.length > 200) next.shift();
      return next;
    });
  }, []);

  const setRealTimeMetrics = useCallback((metrics) => {
    if (metrics.latency !== undefined) setLatency(metrics.latency);
    if (metrics.drift !== undefined) setDrift(metrics.drift);
    if (metrics.resolution !== undefined) setResolution(metrics.resolution);
  }, []);

  return (
    <TelemetryContext.Provider value={{
      terminalLogs,
      addLog,
      latency,
      drift,
      resolution,
      setRealTimeMetrics
    }}>
      {children}
    </TelemetryContext.Provider>
  );
}

export const useTelemetry = () => useContext(TelemetryContext);
