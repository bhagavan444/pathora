import axios from 'axios';
import API_BASE from '../config/api';

const API_BASE_URL = API_BASE;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes (safeguard for cold starts & heavy PDFs)
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
