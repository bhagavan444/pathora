import { useState } from 'react';
import { uploadResumeDocument } from '../services/predictService';
import { useIntelligenceStore } from '../store/intelligenceStore';
import { useTelemetry } from '../context/TelemetryContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export function useResumeAnalysis() {
  const [status, setStatus] = useState('idle'); // idle, uploading, parsing, analyzing, success, error
  const [errorMsg, setErrorMsg] = useState('');
  
  const globalResume = useIntelligenceStore(state => state.resumeData);
  const setGlobalResume = useIntelligenceStore(state => state.setResumeData);
  const globalDomain = useIntelligenceStore(state => state.currentDomain);
  const setGlobalDomain = useIntelligenceStore(state => state.setDomain);
  const globalAnalysis = useIntelligenceStore(state => state.resumeAnalysis);
  const setGlobalAnalysis = useIntelligenceStore(state => state.setResumeAnalysis);

  const [resumeFile, setResumeFile] = useState(globalResume);
  const [domain, setDomain] = useState(globalDomain || "");
  const [interest, setInterest] = useState("");
  const [useAI, setUseAI] = useState(true);
  const [result, setResult] = useState(globalAnalysis);
  
  const [targetDisplayScore, setTargetDisplayScore] = useState(globalAnalysis ? globalAnalysis.ats_score : 0);
  const [targetDisplayCallback, setTargetDisplayCallback] = useState(globalAnalysis?.competitiveness?.interviewProbability || 0);

  const { addLog, setRealTimeMetrics } = useTelemetry();

  const handleFile = (f) => {
    setResumeFile(f);
    setResult(null);
    setStatus('idle');
    setErrorMsg('');
    if (f) {
      addLog(`File payload registered: "${f.name}" (${(f.size/1024).toFixed(1)} KB).`, "IO");
    }
  };

  const submit = async () => {
    if (!resumeFile) {
      setErrorMsg("Please select a resume file first.");
      return;
    }
    setErrorMsg("");
    
    try {
      setStatus('uploading');
      addLog(`Initializing document upload stream...`, "PIPELINE");
      
      const docId = await uploadResumeDocument(resumeFile);
      addLog(`Document uploaded successfully. ID: ${docId}. Starting Backend Engines...`, "PIPELINE");
      
      setStatus('analyzing');
      
      const response = await fetch(`${API_BASE_URL}/api/v1/resume/analyze/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ doc_id: docId, target_role: domain || "General Tech Role" })
      });
      
      if (!response.ok) {
          if (response.status === 404) {
              throw new Error(`[API_ROUTE_NOT_FOUND] POST /api/v1/resume/analyze/stream returned 404. Ensure your frontend is talking to the local backend (http://localhost:5000) and not a stale production endpoint.`);
          }
          let errData;
          try { errData = await response.json(); } catch(e) {}
          const errMsg = errData?.error || errData?.message || `HTTP Error ${response.status}`;
          throw new Error(`[SETUP_FAILED] ${errMsg}`);
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      
      let done = false;
      let finalRes = null;
      let accumulatedLatency = 0;
      
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n\n');
          for (const line of lines) {
            const cleanLine = line.trim();
            if (cleanLine.startsWith('data: ')) {
              const dataStr = cleanLine.substring(6);
              if (dataStr === '[DONE]') break;
              try {
                const data = JSON.parse(dataStr);
                if (data.event === 'telemetry') {
                  addLog(data.log, "BACKEND");
                  if (data.metric && data.metric.duration) {
                     accumulatedLatency += data.metric.duration;
                     setRealTimeMetrics({
                       latency: accumulatedLatency,
                       drift: 0.012, // Standard heuristic for now
                       resolution: 98.4
                     });
                  }
                } else if (data.event === 'complete') {
                  finalRes = data.payload;
                } else if (data.event === 'error') {
                  addLog(`[PIPELINE_ERROR] Stage: ${data.payload?.stage} | ${data.payload?.message}`, "ERROR");
                  throw new Error(`[${data.payload?.stage?.toUpperCase() || 'BACKEND'}] ${data.payload?.message || 'Pipeline crashed'}`);
                }
              } catch (e) {
                // Throw explicit backend errors immediately, otherwise ignore partial chunk parse errors
                if (e.message.includes("[PIPELINE_ERROR]") || e.message.includes("[")) {
                    throw e;
                }
              }
            }
          }
        }
      }
      
      if (!finalRes) throw new Error("Backend did not return final payload.");
      
      // Update Real Intelligence Context
      setResult(finalRes);
      setGlobalAnalysis(finalRes);
      setGlobalResume(resumeFile);
      setGlobalDomain(domain);
      setTargetDisplayScore(finalRes.ats_score || 0);
      setTargetDisplayCallback(finalRes.competitiveness?.interviewProbability || 0);
      setStatus('success');
      addLog(`Analysis pipeline complete. ATS Score finalized at ${finalRes.ats_score}.`, "SUCCESS");

    } catch (err) {
      console.error("Pipeline Error:", err);
      
      let finalMessage = err.message || "Backend intelligence engine failed.";
      let errorType = "SERVER_CRASH";
      
      // Specifically target network disconnects
      if (err.message === "Network Error" || err.message === "Failed to fetch") {
          errorType = "BACKEND_OFFLINE_OR_CORS";
          finalMessage = "Network connection failed. Ensure the Flask server is running locally on port 5000 and CORS is allowing the connection.";
      } else if (err.message.includes("API_ROUTE_NOT_FOUND")) {
          errorType = "PROXY_FAILURE";
      }

      addLog(`Backend pipeline crashed: [${errorType}] ${finalMessage}`, "ERROR");
      setErrorMsg(`[${errorType}] ${finalMessage}`);
      setStatus('error');
    }
  };

  const reset = () => {
    setResult(null);
    setStatus('idle');
  };

  return {
    status,
    errorMsg,
    resumeFile,
    handleFile,
    domain,
    setDomain,
    interest,
    setInterest,
    useAI,
    setUseAI,
    result,
    targetDisplayScore,
    setTargetDisplayScore,
    targetDisplayCallback,
    setTargetDisplayCallback,
    submit,
    reset
  };
}
