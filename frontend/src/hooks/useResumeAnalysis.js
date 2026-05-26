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
      
      const rawRes = response.data;
      console.log("PRODUCTION BACKEND RESPONSE:", JSON.stringify(response.data, null, 2));
      
      if (!rawRes) throw new Error("Backend did not return final payload.");

      // === STRICT PRODUCTION NORMALIZATION ===
      // Bridge between actual backend keys and what every frontend component reads.

      // Roadmap: backend sends string[] but SkillGapAnalysis expects {phase, focus, skills}[]
      const rawRoadmap = rawRes.roadmap || rawRes.recommendations || [];
      const normalizedRoadmap = Array.isArray(rawRoadmap)
        ? rawRoadmap.map((item, idx) => {
            if (typeof item === "string") {
              return { phase: `Phase ${idx + 1}`, focus: item, skills: [] };
            }
            return item; // already an object
          })
        : [];

      const normalizedData = {
          // Spread all original backend fields first
          ...rawRes,

          // === Top-level KPI cards (Predict.jsx) ===
          ats_score: rawRes.ats_score ?? 0,
          recruiter_trust: rawRes.recruiter_trust ?? 0,
          project_complexity: rawRes.project_complexity ?? 0,
          engineering_maturity: rawRes.engineering_maturity ?? 0,
          market_percentile: rawRes.market_percentile ?? 0,
          project_tier: rawRes.project_tier ?? "Unknown",
          engineering_level: rawRes.engineering_level ?? "Unknown",
          market_comparison: rawRes.market_comparison ?? "Unknown",

          // === DashboardMetrics reads result.competitiveness ===
          competitiveness: {
            percentile: rawRes.market_percentile ?? 0,
            comparison: rawRes.market_comparison ?? "Unknown",
            interviewProbability: rawRes.market_percentile ? Math.min(99, rawRes.market_percentile + 5) : 0
          },

          // === SkillGapAnalysis reads result.roadmap, result.matched_skills, result.missing_skills ===
          roadmap: normalizedRoadmap,
          matched_skills: rawRes.matched_skills || rawRes.skills || [],
          missing_skills: rawRes.missing_skills || rawRes.weaknesses || [],

          // === RecruiterInsights reads these nested objects ===
          recruiter_metrics: rawRes.recruiter_metrics || {},
          project_metrics: rawRes.project_metrics || {},
          maturity_metrics: rawRes.maturity_metrics || {},
          benchmark_metrics: rawRes.benchmark_metrics || {},
          heatmap: rawRes.heatmap || {},

          // === ATSOverview reads keyword_density ===
          keyword_density: rawRes.keyword_density ?? 0,

          // === CareerGenome reads aspect_scores ===
          aspect_scores: rawRes.aspect_scores || [],

          // === Telemetry ===
          telemetry: rawRes.telemetry || {},

          // === Legacy aliases for any sub-components still using old names ===
          strongMatches: rawRes.matched_skills || rawRes.skills || [],
          missingSkills: rawRes.missing_skills || rawRes.weaknesses || [],
          recruiterSummary: rawRes.recommendations || rawRes.improvement_suggestions || [],
          improvement_suggestions: rawRes.improvement_suggestions || rawRes.recommendations || []
      };

      const finalRes = normalizedData;
      console.log("NORMALIZED RESULT:", JSON.stringify(finalRes, null, 2));
      
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
