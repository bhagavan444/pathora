import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useIntelligenceStore = create(
  persist(
    (set, get) => ({
      // ─── Document Upload State ───
      resumeData: null, // Basic file metadata
      resumeAnalysis: null, // Full analysis from backend
      isAnalyzing: false,

      // ─── Recruiter & ATS Intelligence ───
      recruiterMetrics: {
        score: 0,
        percentile: 0,
        roles: [],
        matchedSkills: [],
        missingSkills: [],
        standouts: [],
        concerns: [],
        salaryForecast: ''
      },

      // ─── Career Roadmap & Domain State ───
      roadmap: [],
      currentDomain: 'Software Engineering',
      verifiedSkills: [],

      // ─── AI Assistant Context Memory ───
      assistantMemory: {
        sessionContext: '',
        lastQuery: ''
      },

      // ─── Actions ───
      setResumeData: (data) => set({ resumeData: data }),
      
      setResumeAnalysis: (analysis) => set((state) => ({ 
        resumeAnalysis: analysis,
        recruiterMetrics: {
          ...state.recruiterMetrics,
          score: analysis.ats_score || state.recruiterMetrics.score,
          matchedSkills: analysis.matched_skills || state.recruiterMetrics.matchedSkills,
          missingSkills: analysis.missing_skills || state.recruiterMetrics.missingSkills,
          salaryForecast: analysis.salary_forecast_range || state.recruiterMetrics.salaryForecast,
          roles: analysis.top_roles || state.recruiterMetrics.roles,
        }
      })),
      
      setAnalyzing: (status) => set({ isAnalyzing: status }),
      
      updateRecruiterMetrics: (metrics) => set((state) => ({
        recruiterMetrics: { ...state.recruiterMetrics, ...metrics }
      })),

      setRoadmap: (roadmap) => set({ roadmap }),
      setDomain: (domain) => set({ currentDomain: domain }),
      
      toggleVerifiedSkill: (skill) => set((state) => {
        const skills = state.verifiedSkills;
        return {
          verifiedSkills: skills.includes(skill)
            ? skills.filter(s => s !== skill)
            : [...skills, skill]
        };
      }),

      setVerifiedSkills: (skills) => set({ verifiedSkills: skills }),

      updateAssistantMemory: (memoryUpdate) => set((state) => ({
        assistantMemory: { ...state.assistantMemory, ...memoryUpdate }
      })),

      resetIntelligence: () => set({
        resumeData: null,
        resumeAnalysis: null,
        recruiterMetrics: { score: 0, percentile: 0, roles: [], matchedSkills: [], missingSkills: [], standouts: [], concerns: [], salaryForecast: '' },
        roadmap: [],
        verifiedSkills: [],
        assistantMemory: { sessionContext: '', lastQuery: '' }
      })
    }),
    {
      name: 'pathora-intelligence-storage',
      // Persist meaningful state to keep context across page reloads
      partialize: (state) => ({
        resumeAnalysis: state.resumeAnalysis,
        recruiterMetrics: state.recruiterMetrics,
        roadmap: state.roadmap,
        currentDomain: state.currentDomain,
        verifiedSkills: state.verifiedSkills,
        assistantMemory: state.assistantMemory
      })
    }
  )
);
