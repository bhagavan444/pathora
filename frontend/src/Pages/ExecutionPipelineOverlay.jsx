import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./ExecutionPipelineOverlay.css";
import { X, Activity } from "lucide-react";

const STAGES = [
  { id: 1, name: "Resume Ingestion", desc: "PDF/DOCX structural parsing", logs: ["Allocating secure container...", "PDF/DOCX uploaded to memory", "Structural parsing initialized", "Extracting raw text blocks...", "Ingestion complete."] },
  { id: 2, name: "Document Segmentation", desc: "Contextual boundary mapping", logs: ["Extracting sections based on semantic layout...", "Parsing education boundary nodes...", "Parsing project boundary nodes...", "Parsing skills & certifications...", "Segmentation finalized."] },
  { id: 3, name: "Entity Extraction", desc: "Technology & signal detection", logs: ["Initializing NLP entity matcher...", "Identifying deployed technologies...", "Parsing action verbs and impact metrics...", "Deployment signals detected.", "Entity mapping complete."] },
  { id: 4, name: "ATS Heuristic Engine", desc: "Keyword & density analysis", logs: ["Computing ATS heuristic vectors...", "Keyword density analysis running...", "Quantified impact detection activated...", "Formatting heuristics applied.", "ATS probability matrix generated."] },
  { id: 5, name: "Engineering Genome", desc: "Vector correlation mapping", logs: ["Mapping frontend capability vectors...", "Mapping backend capability vectors...", "Cloud & infrastructure vectors correlated...", "Engineering genome sequence locked."] },
  { id: 6, name: "Recruiter Trust Engine", desc: "Credibility & readiness scoring", logs: ["Calculating recruiter credibility scoring...", "Production readiness evaluated...", "Deployment signal consistency checked...", "Recruiter heuristic confidence mapped."] },
  { id: 7, name: "Market Benchmark Engine", desc: "Maturity & percentile ranking", logs: ["Fetching global engineering baselines...", "Percentile positioning calculated.", "Benchmark comparison running...", "Maturity estimation finalized."] },
  { id: 8, name: "Roadmap Graph Gen", desc: "Dependency graph traversal", logs: ["Initializing dependency graph traversal...", "Infrastructure skill sequencing computed...", "Optimal progression path generated."] },
  { id: 9, name: "Final Payload Hydration", desc: "Deterministic response finalized", logs: ["Compiling deterministic evaluation payload...", "Dashboard hydration complete.", "Pipeline execution finished successfully."] }
];

export default function ExecutionPipelineOverlay({ onClose }) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [logs, setLogs] = useState([]);
  const [metrics, setMetrics] = useState({
    latency: "14ms",
    confidence: "0.00",
    vectors: "0"
  });
  
  const terminalRef = useRef(null);

  useEffect(() => {
    let isCancelled = false;

    const runPipeline = async () => {
      // Small initial delay
      await new Promise(r => setTimeout(r, 600));

      let totalLatency = 14;
      let vectorCount = 0;

      for (let i = 0; i < STAGES.length; i++) {
        if (isCancelled) break;
        setCurrentStageIndex(i);
        const stage = STAGES[i];

        // Update confidence mock based on stage
        setMetrics(m => ({ ...m, confidence: (0.5 + (i * 0.05)).toFixed(2) }));

        for (let log of stage.logs) {
          if (isCancelled) break;
          const delay = 300 + Math.random() * 500;
          await new Promise(r => setTimeout(r, delay));
          if (isCancelled) break;
          
          const stepLatency = Math.floor(Math.random() * 30 + 10);
          totalLatency += stepLatency;
          vectorCount += Math.floor(Math.random() * 15 + 5);

          setMetrics(m => ({
            ...m,
            latency: `${totalLatency}ms`,
            vectors: vectorCount.toString()
          }));

          const now = new Date();
          const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;

          setLogs(prev => [...prev, {
            time: timeString,
            prefix: `[${stage.name.toUpperCase().substring(0,8)}]`,
            msg: log,
            latency: `+${stepLatency}ms`
          }]);
        }
      }
      
      if (!isCancelled) {
        setCurrentStageIndex(STAGES.length); // All done
        setMetrics(m => ({ ...m, confidence: "0.98" }));
      }
    };
    
    runPipeline();
    return () => { isCancelled = true; };
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  return ReactDOM.createPortal(
    <div className="pipeline-overlay-wrap">
      <motion.div 
        className="pipeline-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div 
        className="pipeline-modal"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="pipeline-header">
          <div className="pipeline-title">
            <Activity size={16} color="var(--accent)" />
            <span className="pipeline-title-text">Evaluation Pipeline Orchestrator</span>
          </div>
          <button className="pipeline-close" onClick={onClose}><X size={16} /></button>
        </div>
        
        <div className="pipeline-body">
          {/* Sidebar Timeline */}
          <div className="pipeline-sidebar">
            <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "rgba(255,255,255,0.4)", marginBottom: 24, letterSpacing: "0.1em" }}>
              EXECUTION STAGES
            </div>
            {STAGES.map((stage, idx) => {
              const isActive = idx === currentStageIndex;
              const isDone = idx < currentStageIndex;
              
              return (
                <div key={stage.id} className={`pipeline-stage ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                  {idx !== STAGES.length - 1 && <div className="stage-line" />}
                  <div className="stage-indicator">
                    {isDone ? '✓' : isActive ? <div style={{width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 1.5s infinite'}} /> : (idx + 1)}
                  </div>
                  <div className="stage-content">
                    <h4>{stage.name}</h4>
                    <p>{stage.desc}</p>
                    {isActive && (
                      <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{ fontSize: 10, color: "var(--accent)", fontFamily: "var(--mono)", marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{width: 4, height: 4, background: 'var(--accent)', borderRadius: '50%'}} /> PROCESSING
                      </motion.div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Content */}
          <div className="pipeline-main">
            {/* Metrics */}
            <div className="pipeline-metrics">
              <div className="metric-card">
                <div className="metric-lbl">TOTAL LATENCY</div>
                <div className="metric-val">{metrics.latency}</div>
              </div>
              <div className="metric-card">
                <div className="metric-lbl">VECTORS MAPPED</div>
                <div className="metric-val purple">{metrics.vectors}</div>
              </div>
              <div className="metric-card">
                <div className="metric-lbl">HEURISTIC CONFIDENCE</div>
                <div className="metric-val green">{metrics.confidence}</div>
              </div>
            </div>

            {/* Terminal Logs */}
            <div className="pipeline-terminal" ref={terminalRef}>
              <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "rgba(255,255,255,0.4)", marginBottom: 12, letterSpacing: "0.1em" }}>
                LIVE TELEMETRY STREAM
              </div>
              <AnimatePresence initial={false}>
                {logs.map((log, idx) => (
                  <motion.div 
                    key={idx} 
                    className="log-entry"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="log-time">{log.time}</span>
                    <span className="log-prefix">{log.prefix}</span>
                    <span className="log-msg">{log.msg}</span>
                    <span className="log-latency">{log.latency}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {currentStageIndex < STAGES.length && (
                <div className="log-entry" style={{ opacity: 0.5, marginTop: 12 }}>
                  <span className="log-time">--:--:--.---</span>
                  <span className="log-prefix" style={{color: 'rgba(255,255,255,0.3)'}}>[AWAITING]</span>
                  <span className="log-msg">...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
