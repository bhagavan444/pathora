import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles } from 'lucide-react';

export default function ResumeUpload({
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
  submit,
  loadStep
}) {
  const loading = status === 'uploading' || status === 'analyzing' || status === 'streaming';
  
  return (
    <div id="upload-section" style={{ maxWidth: 740, margin: "0 auto", padding: "0 20px 80px", position: "relative", zIndex: 1 }}>
      <div className="glass-panel reveal-up" style={{ padding: "30px 24px", animationDelay: "0.3s" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111", marginBottom: 8 }}>Configuration & Analysis</h2>
          <p style={{ fontSize: 14, color: "#6b7280" }}>Set target benchmarks and feed the parser models.</p>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div className="upload-zone">
            <input type="file" accept=".pdf" onChange={(e) => handleFile(e.target.files?.[0] || null)} />
            {resumeFile ? (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10, pointerEvents:"none" }}>
                <div style={{
                  width:48, height:48, borderRadius:14,
                  background:"rgba(5,150,105,0.08)", border:"1px solid rgba(5,150,105,0.25)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:20, color:"#059669",
                }}><CheckCircle2 /></div>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:13, color:"#059669", letterSpacing:"0.02em", fontWeight: 600 }}>
                  {resumeFile.name || "demo_resume.pdf (Sandbox Preset)"}
                </span>
              </div>
            ) : (
              <div style={{ pointerEvents:"none", display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
                <div style={{
                  width:48, height:48, borderRadius:14,
                  background:"rgba(124,58,237,0.08)", border:"1px solid rgba(124,58,237,0.2)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:20, color:"#7c3aed",
                }}>↑</div>
                <div>
                  <p style={{ fontSize:15, fontWeight:600, color:"#374151", marginBottom:4 }}>Drop PDF resume here or click to browse</p>
                  <p style={{ fontSize:12, color: "#9ca3af" }}>Max upload size: 10MB</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
          <div>
            <label style={{ display:"block", fontSize:11, fontWeight:600, color:"#4b5563", marginBottom:8, fontFamily:"'DM Mono',monospace", letterSpacing:"0.08em", textTransform:"uppercase" }}>
              Target Engineering Domain <span style={{ color:"#9ca3af", fontWeight: 400 }}>— optional</span>
            </label>
            <input className="pnx-input" placeholder="e.g. AI Engineering, Backend, Devops" value={domain} onChange={e => setDomain(e.target.value)} />
          </div>
          <div>
            <label style={{ display:"block", fontSize:11, fontWeight:600, color:"#4b5563", marginBottom:8, fontFamily:"'DM Mono',monospace", letterSpacing:"0.08em", textTransform:"uppercase" }}>
              Specialization Focus <span style={{ color:"#9ca3af", fontWeight: 400 }}>— optional</span>
            </label>
            <input className="pnx-input" placeholder="e.g. Distributed Architectures" value={interest} onChange={e => setInterest(e.target.value)} />
          </div>
        </div>

        <label className="toggle-row" style={{ marginBottom: 30 }}>
          <input type="checkbox" checked={useAI} onChange={() => setUseAI(p => !p)} style={{ width:18, height:18, accentColor:"#7c3aed", cursor:"pointer", flexShrink:0 }} />
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:600, color:"#111" }}>Enable Micro-Benchmark Engine</div>
            <div style={{ fontSize:13, color:"#6b7280", marginTop:2 }}>Synthesizes custom recruiter vectors based on your specific keywords</div>
          </div>
        </label>

        {errorMsg && (
          <div style={{ padding:"12px 16px", marginBottom:20, background:"rgba(220,38,38,0.08)", border:"1px solid rgba(220,38,38,0.2)", borderRadius:10, fontSize:13, color:"#b91c1c", fontWeight: 500 }}>
            {errorMsg}
          </div>
        )}

        <button className="submit-btn" onClick={submit} disabled={loading || !resumeFile}>
          {loading ? (
            <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12 }}>
              <span style={{
                width:16, height:16,
                border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff",
                borderRadius:"50%", animation:"spin 0.7s linear infinite", flexShrink:0,
              }} />
              Executing AI Engines...
            </span>
          ) : (
            <>
              <Sparkles size={16} />
              <span>Synthesize System Intelligence →</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
