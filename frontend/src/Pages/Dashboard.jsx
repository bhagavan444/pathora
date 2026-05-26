import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Shield, Activity, Database, GitMerge, Cpu, Search, CheckCircle } from 'lucide-react';
import Footer from '../components/Footer';
import './Dashboard.css';

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  // Simulate streaming logs
  useEffect(() => {
    const initialLogs = [
      { id: 1, time: '14:02:01', module: '[ATS ENGINE]', msg: 'Heuristic scan initialized', icon: Search },
      { id: 2, time: '14:02:14', module: '[VECTOR CORE]', msg: 'Mapping frontend competencies', icon: Database },
      { id: 3, time: '14:02:22', module: '[DAG ORCHESTRATOR]', msg: 'Generating engineering roadmap DAG', icon: GitMerge },
    ];
    setLogs(initialLogs);

    const newLogs = [
      { time: '14:03:10', module: '[RECRUITER ENGINE]', msg: 'Trust coefficient updated (Confidence: 94%)', icon: Shield },
      { time: '14:03:45', module: '[PARSER]', msg: 'Resume structure indexed', icon: Terminal },
      { time: '14:04:12', module: '[EVAL]', msg: 'Production readiness computed', icon: CheckCircle },
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < newLogs.length) {
        setLogs(prev => [{ id: Date.now(), ...newLogs[i] }, ...prev]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const topMetrics = [
    { label: 'Recruiter Trust Score', value: '94', unit: '%', status: 'active', meta: 'HEURISTIC: HIGH CONFIDENCE' },
    { label: 'Engineering Maturity Index', value: '8.4', unit: '/10', status: 'active', meta: 'VECTOR MAP: DENSE' },
    { label: 'Production Readiness', value: 'A-', unit: 'GRADE', status: 'success', meta: 'LATENCY: 42ms' },
  ];

  const recentEvals = [
    { title: 'Frontend Architecture Analysis', meta: 'DAG: 42 Nodes', status: 'success', statusText: 'COMPLETED' },
    { title: 'System Design Competency Mapping', meta: 'Vectors: 1,024', status: 'processing', statusText: 'INDEXING' },
    { title: 'Heuristic Scoring Cycle', meta: 'Trust Eng: v2.4', status: 'success', statusText: 'VERIFIED' },
  ];

  return (
    <div className="dashboard-wrap">
      <div className="grid-bg"></div>
      
      <motion.div 
        className="dash-inner"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="dash-header">
          <h1 className="dash-title">Infrastructure Intelligence</h1>
          <p className="dash-subtitle">Real-time evaluation pipeline & telemetry orchestration</p>
        </motion.div>

        {/* TOP: Infrastructure Status Grid */}
        <motion.div variants={itemVariants} className="top-grid">
          {topMetrics.map((metric, idx) => (
            <div key={idx} className="dash-card">
              <div className="dash-card-header">
                <span className="dash-card-title">{metric.label}</span>
                <div className={`dash-status-dot ${metric.status === 'success' ? 'success' : 'active'}`}></div>
              </div>
              <div className="metric-value">
                {metric.value} <span className="metric-unit">{metric.unit}</span>
              </div>
              <div className="metric-meta">
                <div className="metric-meta-item">
                  <Activity size={10} />
                  <span>{metric.meta}</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* CENTER: Engineering Intelligence Visualization & RIGHT: Operational Event Stream */}
        <div className="main-grid">
          <motion.div variants={itemVariants} className="dash-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="dash-card-header">
              <span className="dash-card-title">Engineering Vector Radar</span>
              <div className="metric-meta-item"><Cpu size={12}/> <span>LIVE MAPPING</span></div>
            </div>
            
            <div className="viz-container">
              {/* Simulated Radar Visualizer */}
              <div className="radar-circle" style={{ width: '200px', height: '200px' }}></div>
              <div className="radar-circle" style={{ width: '140px', height: '140px' }}></div>
              <div className="radar-circle" style={{ width: '80px', height: '80px' }}></div>
              <div className="radar-sweep"></div>
              
              {/* Simulated nodes being mapped */}
              {[...Array(6)].map((_, i) => (
                <motion.div 
                  key={i}
                  className="dag-node"
                  style={{ 
                    left: `${Math.random() * 60 + 20}%`, 
                    top: `${Math.random() * 60 + 20}%` 
                  }}
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 2 + Math.random() * 2, repeat: Infinity }}
                />
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Orchestration Logs</span>
              <div className="metric-meta-item"><Terminal size={12}/> <span>STREAMING</span></div>
            </div>
            
            <div className="log-stream">
              {logs.map(log => (
                <motion.div 
                  key={log.id} 
                  className="log-item"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <span className="log-time">{log.time}</span>
                  <span className="log-module">{log.module}</span>
                  <span className="log-msg">{log.msg}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* BOTTOM: Infrastructure Activity Feed */}
        <motion.div variants={itemVariants} className="dash-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="dash-card-header" style={{ padding: '24px 24px 0 24px', marginBottom: '12px' }}>
            <span className="dash-card-title">Recent Evaluations</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {recentEvals.map((evalItem, idx) => (
              <div key={idx} className="feed-item">
                <div>
                  <h4 className="feed-title">{evalItem.title}</h4>
                  <span className="feed-meta">{evalItem.meta}</span>
                </div>
                <div className={`feed-status ${evalItem.status}`}>
                  {evalItem.statusText}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
      
      <div style={{ marginTop: '60px' }}>
        <Footer />
      </div>
    </div>
  );
}
