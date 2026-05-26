import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true
});

export const safeArr = (v) => (Array.isArray(v) ? v : []);

export const uploadResumeDocument = async (file) => {
  const fd = new FormData();
  fd.append("files", file);
  const uploadRes = await apiClient.post(`/api/v1/documents/upload`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return uploadRes.data.documents[0].doc_id;
};

// analyzeResume via SSE is now handled directly in useResumeAnalysis.js hook.
