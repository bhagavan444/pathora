import { useState } from 'react';
import { uploadResumeDocument } from '../services/predictService';
import { useIntelligenceStore } from '../store/intelligenceStore';
import { useTelemetry } from '../context/TelemetryContext';

import apiClient from '../services/apiClient';

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
      addLog(`Connecting to Intelligence Engine at ${apiClient.defaults.baseURL}/api/v1/resume/analyze...`, "PIPELINE");
      
      const response = await apiClient.post("/api/v1/resume/analyze", {
        doc_id: docId,
        target_role: domain || "General Tech Role"
      });
      
      const finalRes = response.data;
      
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
          errorType = "BACKEND_OFFLINE_OR_TIMEOUT";
          finalMessage = "Network connection failed or timed out. If deployed on a serverless/free tier, the backend may still be warming up. Please try again.";
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
