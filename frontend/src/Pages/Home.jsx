import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Home.css";
import { DOMAINS, ROADMAP_STEPS, CAREER_FEATURES, SUCCESS_STORIES, INDUSTRIES, COMPARISON } from "./HomeData";
import { RevealSection, RevealDiv, AnimatedCounter, CinematicUniverseCore, TechMarquee } from "./HomeComponents";
import Footer from '../components/Footer';
import { motion } from "framer-motion";
import { useIntelligenceStore } from '../store/intelligenceStore';

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileRef = useRef(null);
  const user = typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem("user_profile") || "null") : null;
  
  const selectedDomain = useIntelligenceStore((state) => state.currentDomain);
  const setSelectedDomain = useIntelligenceStore((state) => state.setDomain);
  
  const selectedSkills = useIntelligenceStore((state) => state.verifiedSkills);
  const setSelectedSkills = useIntelligenceStore((state) => state.setVerifiedSkills);
  const toggleVerifiedSkill = useIntelligenceStore((state) => state.toggleVerifiedSkill);
  
  const resume = useIntelligenceStore((state) => state.resumeData);
  const setResumeState = useIntelligenceStore((state) => state.setResumeData);
  
  const [careerScore, setCareerScore] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    let s = 0; if (resume) s += 35;
    s += Math.min(selectedSkills.length * 10, 35);
    if (user) s += 30; setCareerScore(s);
  }, [resume, selectedSkills, user]);

  useEffect(() => {
    if (location.hash === "#roadmap") {
      setTimeout(() => {
        const el = document.getElementById("roadmap");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    }
  }, [location.hash, location.pathname]);

  const toggleSkill = (skill) => toggleVerifiedSkill(skill);
  const handleGetStarted = () => { if (user) { navigate("/predict"); } else { setShowLoginPrompt(true); setTimeout(() => navigate("/login"), 2500); } };
  const pct = Math.round((selectedSkills.length / DOMAINS[selectedDomain].length) * 100);

  return (
    <div className="home-wrap">
      <div className="grid-bg" />

      {/* ═══ HERO ═══ */}
      <section className="hero-sec">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 2 }}
          style={{ position:"absolute",top:"8%",left:"-10%",width:"50vw",height:"50vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(129,140,248,.08) 0%,transparent 65%)",filter:"blur(70px)",pointerEvents:"none" }} 
        />
        <div className="hero-grid">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="hero-badge">
              <span className="hero-badge-tag">AI-POWERED</span>
              <span style={{ fontSize:12,color:"rgba(0,0,0,0.6)",fontWeight:600 }}>Career Intelligence Platform</span>
            </div>
            <h1 className="hero-h1">
              Accelerate Your Engineering Career With <em>Precision.</em>
            </h1>
            <p className="hero-sub">
              Pathora uses Gemini AI to analyze your resume and deliver personalized engineering roadmaps, precise ATS scoring, and interactive career mentorship. Built exclusively for modern engineers.
            </p>
            <div className="hero-ctas">
              <button className="btn-glass-primary" onClick={handleGetStarted}>Analyze My Career Path</button>
              <button className="btn-glass-outline" onClick={() => navigate("/quiz")}>Explore Assessments</button>
            </div>
            <div className="trust-row">
              {["Gemini AI Chat","PDF Resume Parsing","Predictive Roadmaps"].map(t => (
                <div key={t} className="trust-item">
                  <div className="trust-check">✓</div>
                  <span style={{ fontSize:13,color:"var(--tm)",fontWeight:500 }}>{t}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <CinematicUniverseCore />
          </motion.div>
        </div>
      </section>

      {/* ═══ TECH MARQUEE ═══ */}
      <RevealDiv className="marquee-bar"><TechMarquee /></RevealDiv>

      {/* ═══ METRICS ═══ */}
      <RevealSection className="sec">
        <div className="sec-inner" style={{ textAlign:"center" }}>
          <div className="sec-head">
            <div className="sec-tag" style={{ color:"var(--accent)" }}>Proven Performance</div>
            <h2 className="sec-title">The Intelligence Engine<span style={{ color:"var(--ts)" }}> For Modern Engineers</span></h2>
          </div>
          <div className="metrics-grid">
            <AnimatedCounter end={6} label="Supported Career Domains" suffix="" />
            <AnimatedCounter end={94} label="ATS Parsing Accuracy" suffix="%" />
            <AnimatedCounter end={5} label="Roadmap Stages" suffix="" />
          </div>
        </div>
      </RevealSection>

      {/* ═══ CAREER READINESS ═══ */}
      <RevealSection className="sec" style={{ borderTop:"1px solid rgba(0,0,0,.06)" }}>
        <div className="readiness-wrap">
          <div className="sec-head">
            <div className="sec-tag" style={{ color:"var(--accent2)" }}>Your Trajectory</div>
            <h2 className="sec-title">Career Readiness Dashboard</h2>
            <p className="sec-desc">Real-time assessment of your technical skills, personalized growth trajectory, and industry alignment.</p>
          </div>
          <div className="readiness-bar"><div className="readiness-fill" style={{ width:`${careerScore}%` }} /></div>
          <div className="readiness-score">{careerScore}%</div>
          <p style={{ textAlign:"center",fontSize:14,color:"var(--tm)" }}>
            {careerScore === 0
              ? "Upload your resume and select skills above to calculate your readiness score."
              : careerScore < 35
              ? "Early stage — upload your resume and mark skills to improve your score."
              : careerScore < 65
              ? "Building momentum — continue adding verified skills to strengthen your profile."
              : "Strong foundation — head to the Predict page for your full ATS analysis."}
          </p>
        </div>
      </RevealSection>

      {/* ═══ SKILL GAP SIMULATOR ═══ */}
      <RevealSection className="sec">
        <div className="sec-inner">
          <div className="sec-head">
            <div className="sec-tag" style={{ color:"var(--accent3)" }}>Interactive Assessment</div>
            <h2 className="sec-title">Skill Gap Analysis</h2>
            <p className="sec-desc">Select your target engineering domain to test your baseline knowledge and identify the critical technical skills missing from your portfolio.</p>
          </div>
          <div className="sim-box">
            <div style={{ marginBottom:32 }}>
              <label style={{ display:"block",fontSize:13,fontWeight:600,color:"var(--tm)",marginBottom:12,fontFamily:"var(--mono)",letterSpacing:".08em",textTransform:"uppercase" }}>Select Career Domain</label>
              <select className="sim-select" value={selectedDomain} onChange={e => { setSelectedDomain(e.target.value); setSelectedSkills([]); }}>
                {Object.keys(DOMAINS).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="sim-info">
              <div><div style={{ fontSize:12,color:"var(--tm)",marginBottom:4,fontFamily:"var(--mono)" }}>Available Skills</div><div style={{ fontSize:20,fontWeight:700,color:"var(--tp)" }}>{DOMAINS[selectedDomain].length} skills</div></div>
              <div style={{ textAlign:"right" }}><div style={{ fontSize:12,color:"var(--tm)",marginBottom:4,fontFamily:"var(--mono)" }}>Your Skills</div><div style={{ fontSize:20,fontWeight:700,color:"var(--accent)" }}>{selectedSkills.length} selected</div></div>
            </div>
            <div className="skills-grid">
              {DOMAINS[selectedDomain].map(skill => {
                const sel = selectedSkills.includes(skill.name);
                return (
                  <button key={skill.name} className={`skill-btn${sel ? " active" : ""}`} onClick={() => toggleSkill(skill.name)}>
                    {sel && <div style={{ position:"absolute",top:4,right:4,width:20,height:20,borderRadius:"50%",background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#fff",animation:"scaleIn .3s ease" }}>✓</div>}
                    <i className={skill.icon} style={{ fontSize:24,opacity:sel?1:.6,transition:"opacity .3s" }} />
                    <span style={{ flex:1,textAlign:"left" }}>{skill.name}</span>
                  </button>
                );
              })}
            </div>
            <div className="coverage-box">
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
                <div>
                  <span style={{ fontSize:14,fontWeight:700,color:"var(--tp)" }}>Skill Coverage Progress</span>
                  <div style={{ fontSize:12,color:"var(--tm)",marginTop:4 }}>
                    {selectedSkills.length === 0 ? "Start by selecting skills you already know"
                      : selectedSkills.length === DOMAINS[selectedDomain].length ? "🎉 You've mastered all skills!"
                      : `${DOMAINS[selectedDomain].length - selectedSkills.length} skills remaining`}
                  </div>
                </div>
                <div style={{ fontSize:28,fontWeight:800,color:"var(--accent)" }}>{pct}%</div>
              </div>
              <div className="cov-bar"><div className="cov-fill" style={{ width:`${pct}%` }} /></div>
              <div className="level-row">
                {[{level:"Beginner",min:0,max:25,color:"#f87171"},{level:"Intermediate",min:26,max:50,color:"#fbbf24"},{level:"Advanced",min:51,max:75,color:"#3b82f6"},{level:"Expert",min:76,max:100,color:"#34d399"}].map(({level,min,max,color}) => {
                  const active = pct >= min && pct <= max;
                  return (
                    <div key={level} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:6,opacity:active?1:.4,transition:"opacity .3s" }}>
                      <div className="level-dot" style={{ background:color,border:active?`3px solid ${color}40`:"none",boxShadow:active?`0 0 12px ${color}60`:"none",animation:active?"pulse 2s infinite":"none" }} />
                      <span style={{ fontSize:11,fontWeight:active?700:500,color:active?"var(--tp)":"var(--tm)",fontFamily:"var(--mono)" }}>{level}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            {selectedSkills.length > 0 && selectedSkills.length < DOMAINS[selectedDomain].length && (
              <div className="missing-alert">
                <div style={{ fontSize:14,fontWeight:600,color:"#f87171",marginBottom:8 }}>📋 Missing Skills for {selectedDomain}</div>
                <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
                  {DOMAINS[selectedDomain].filter(s => !selectedSkills.includes(s.name)).slice(0,8).map(s => (
                    <div key={s.name} style={{ padding:"6px 12px",background:"rgba(248,113,113,.08)",border:"1px solid rgba(248,113,113,.2)",borderRadius:8,fontSize:12,color:"#f87171",display:"flex",alignItems:"center",gap:6 }}>
                      <i className={s.icon} style={{ fontSize:14 }} />{s.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {selectedSkills.length === DOMAINS[selectedDomain].length && (
              <div className="expert-badge">
                <div style={{ fontSize:32,marginBottom:8 }}>🏆</div>
                <div style={{ fontSize:18,fontWeight:700,color:"var(--success)",marginBottom:4 }}>Domain Expert!</div>
                <div style={{ fontSize:14,color:"var(--ts)" }}>You've mastered all skills in {selectedDomain}</div>
              </div>
            )}
          </div>
        </div>
      </RevealSection>

      {/* ═══ PREDICT ENGINE ═══ */}
      <RevealSection className="sec" style={{ borderTop:"1px solid rgba(0,0,0,.06)" }}>
        <div style={{ maxWidth:1100,margin:"0 auto" }}>
          <div className="sec-head">
            <div className="sec-tag" style={{ color:"var(--success)" }}>AI Engine Core</div>
            <h2 className="sec-title">AI Resume Analysis</h2>
            <p className="sec-desc" style={{ marginBottom: 40, marginTop: -10 }}>Upload your resume in PDF format to generate an ATS match score and personalized roadmap powered by Gemini 2.5.</p>
          </div>
          <div className="resume-drop" onClick={() => fileRef.current?.click()}>
            <div style={{ width:60,height:60,borderRadius:"50%",background:"rgba(129,140,248,.1)",border:"1px solid rgba(129,140,248,.2)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:28 }}>🧠</div>
            <h3 style={{ fontSize:20,fontWeight:600,color:"var(--tp)",marginBottom:8 }}>{resume ? resume.name : "Upload Academic Profile (PDF/JSON)"}</h3>
            <p style={{ fontSize:14,color:"var(--tm)" }}>Drop your file to let our ML models forecast your ideal career path</p>
          </div>
          <input ref={fileRef} type="file" hidden accept=".pdf,.docx,.json" onChange={e => {
            if(e.target.files?.[0]) {
              setResumeState({ name: e.target.files[0].name, size: e.target.files[0].size });
            } else {
              setResumeState(null);
            }
          }} />
          {resume && (
            <div className="resume-results">
              {[
                {label:"Resume Detected",value:resume.name?.split(".")[0] || "Your Resume",color:"var(--tp)"},
                {label:"File Ready",value:"✓ PDF Loaded",color:"var(--success)"},
                {label:"Next Step",value:"Go to Predict →",color:"var(--accent)"}
              ].map(({label,value,color}) => (
                <div key={label} className="resume-card" onClick={() => label === "Next Step" && navigate("/predict")} style={{ cursor: label === "Next Step" ? "pointer" : "default" }}>
                  <div style={{ fontSize:13,color:"var(--tm)",fontWeight:600,marginBottom:8 }}>{label}</div>
                  <div style={{ fontSize:label === "Resume Detected" ? 16 : 24,fontWeight:700,color,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </RevealSection>

      {/* ═══ CAREER ROADMAP ═══ */}
      <RevealSection className="sec" id="roadmap">
        <div className="sec-inner">
          <div className="sec-head">
            <div className="sec-tag" style={{ color:"var(--warning)" }}>How It Works</div>
            <h2 className="sec-title">From Resume to Roadmap<br/>in 5 Steps</h2>
          </div>
          <div className="roadmap-wrap">
            <div className="roadmap-line" />
            <div className="roadmap-flex">
              {ROADMAP_STEPS.map((s, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  key={s.step} 
                  className="roadmap-step"
                >
                  <div className="roadmap-dot">{i+1}</div>
                  <div style={{ fontSize:14,fontWeight:600,color:"var(--tp)",textAlign:"center",maxWidth:120 }}>{s.step}</div>
                  <div style={{ fontSize:11,color:"var(--tm)",textAlign:"center",maxWidth:130,marginTop:6 }}>{s.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </RevealSection>

      {/* ═══ CAREER FEATURES ═══ */}
      <RevealSection className="sec" style={{ borderTop:"1px solid rgba(0,0,0,.06)" }}>
        <div className="sec-inner">
          <div className="sec-head">
            <div className="sec-tag" style={{ color:"var(--accent)" }}>The Core Platform</div>
            <h2 className="sec-title">The Complete Career<br/>Intelligence Platform</h2>
            <p className="sec-desc">From initial career discovery to your final technical placement, we provide comprehensive end-to-end guidance powered by our advanced AI core.</p>
          </div>
          <div className="features-grid">
            {CAREER_FEATURES.map((f, i) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                key={f.title} 
                className="g feature-card"
              >
                <div className="feature-icon" style={{ background:`${f.color}15`,border:`1px solid ${f.color}25` }}>{f.icon}</div>
                <h3 style={{ fontSize:20,fontWeight:700,color:"var(--tp)",marginBottom:12 }}>{f.title}</h3>
                <p style={{ fontSize:14,color:"var(--ts)",lineHeight:1.7 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ═══ SUCCESS STORIES ═══ */}
      <RevealSection className="sec" style={{ overflow:"hidden" }}>
        <div style={{ position:"absolute",top:"10%",right:"-5%",width:"40vw",height:"40vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(103,232,249,.05) 0%,transparent 70%)",filter:"blur(60px)",pointerEvents:"none" }} />
        <div className="sec-inner">
          <div className="sec-head">
            <div className="sec-tag" style={{ color:"var(--success)" }}>Student Reviews</div>
            <h2 className="sec-title">What Engineers Are Saying</h2>
            <p className="sec-desc">Real feedback from students who used Pathora to identify skill gaps, improve their ATS scores, and land technical roles.</p>
          </div>
          <div className="stories-grid">
            {SUCCESS_STORIES.map((s, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                key={s.name} 
                className="g story-card"
              >
                <div style={{ display:"flex",alignItems:"center",gap:16,marginBottom:20 }}>
                  <div className="story-avatar">{s.initials}</div>
                  <div>
                    <h4 style={{ fontSize:17,fontWeight:700,color:"var(--tp)",marginBottom:4 }}>{s.name}</h4>
                    <p style={{ fontSize:13,color:"var(--tm)" }}>{s.role}</p>
                  </div>
                </div>
                <div style={{ display:"flex",gap:4,marginBottom:16 }}>
                  {[...Array(s.rating)].map((_,i) => <span key={i} style={{ color:"var(--warning)",fontSize:16 }}>⭐</span>)}
                </div>
                <p style={{ fontSize:14,color:"var(--ts)",lineHeight:1.7,fontStyle:"italic" }}>"{s.story}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ═══ INDUSTRIES ═══ */}
      <RevealSection className="sec" style={{ borderTop:"1px solid rgba(0,0,0,.06)" }}>
        <div className="sec-inner">
          <div className="sec-head">
            <div className="sec-tag" style={{ color:"var(--accent3)" }}>Covered Domains</div>
            <h2 className="sec-title">6 Engineering Tracks,<br/>Fully Mapped</h2>
            <p className="sec-desc">Each domain contains a verified skill checklist. Select your track and the platform highlights your gaps and builds your roadmap accordingly.</p>
          </div>
          <div className="industries-grid">
            {INDUSTRIES.map((ind, i) => (
              <motion.div 
                initial={{ opacity: 0, rotate: -8, scale: 0.9 }}
                whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                key={ind.name} 
                className="g industry-card"
                onClick={() => navigate("/predict")}
                style={{ cursor: "pointer" }}
              >
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16 }}>
                  <i className={ind.icon} style={{ fontSize:32,opacity:.8 }} />
                  <div style={{ padding:"4px 10px",borderRadius:8,background:"rgba(52,211,153,.1)",border:"1px solid rgba(52,211,153,.2)",fontSize:11,fontWeight:700,color:"var(--success)" }}>{ind.growth}</div>
                </div>
                <h4 style={{ fontSize:18,fontWeight:700,color:"var(--tp)",marginBottom:8 }}>{ind.name}</h4>
                <p style={{ fontSize:13,color:"var(--tm)" }}>{ind.jobs}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ═══ COMPARISON TABLE ═══ */}
      <RevealSection className="sec">
        <div style={{ maxWidth:1000,margin:"0 auto" }}>
          <div className="sec-head">
            <div className="sec-tag" style={{ color:"var(--accent2)" }}>The Evolution</div>
            <h2 className="sec-title">Pathora vs<br/>Traditional Platforms</h2>
          </div>
          <div className="compare-table">
            <div className="compare-header">
              <div style={{ fontSize:13,fontWeight:700,color:"var(--tm)",textTransform:"uppercase",letterSpacing:".08em" }}>Feature</div>
              <div style={{ fontSize:13,fontWeight:700,color:"var(--tm)",textTransform:"uppercase",letterSpacing:".08em",textAlign:"center" }}>Traditional</div>
              <div style={{ fontSize:13,fontWeight:700,color:"var(--accent)",textTransform:"uppercase",letterSpacing:".08em",textAlign:"center" }}>Pathora</div>
            </div>
            {COMPARISON.map((row, i) => (
              <div key={row.feature} className="compare-row" style={{ borderBottom:i<COMPARISON.length-1?"1px solid var(--gbr)":"none" }}>
                <div style={{ fontSize:15,fontWeight:600,color:"var(--tp)" }}>{row.feature}</div>
                <div style={{ fontSize:14,color:"var(--tm)",textAlign:"center" }}>{row.traditional}</div>
                <div style={{ fontSize:14,color:"var(--accent)",textAlign:"center",fontWeight:600 }}>{row.pathora}</div>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ═══ CTA ═══ */}
      <RevealSection className="cta-sec">
        <div className="cta-bg" />
        <div className="cta-glow" />
        <div style={{ position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(0,0,0,.015) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.015) 1px,transparent 1px)",backgroundSize:"60px 60px" }} />
        <div className="cta-inner">
          <div style={{ fontSize:12,fontFamily:"var(--mono)",fontWeight:700,letterSpacing:".16em",color:"var(--tm)",marginBottom:20,textTransform:"uppercase",display:"flex",alignItems:"center",justifyContent:"center",gap:12 }}>
            <div style={{ width:24,height:1,background:"rgba(0,0,0,.2)" }} /> Ready to Start <div style={{ width:24,height:1,background:"rgba(0,0,0,.2)" }} />
          </div>
          <h2 style={{ fontFamily:"var(--display)",fontSize:"clamp(36px,5vw,64px)",fontWeight:400,fontStyle:"italic",color:"var(--tp)",marginBottom:20,lineHeight:1.12 }}>
            Accelerate Your Engineering<br/>
            <span style={{ background:"linear-gradient(120deg,#818cf8,#a78bfa,#818cf8)",backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",animation:"gradShift 4s ease infinite" }}>Career</span> Today
          </h2>
          <p style={{ fontSize:17,color:"var(--ts)",maxWidth:560,margin:"0 auto 40px",lineHeight:1.7 }}>
            Join the network of aspiring engineers using our intelligence platform to excel in the tech industry.
          </p>
          <button className="cta-btn" onClick={handleGetStarted}>Launch Your Career Path</button>
        </div>
      </RevealSection>

      {/* ═══ FOOTER ═══ */}
      <Footer />

      {/* ═══ LOGIN PROMPT ═══ */}
      {showLoginPrompt && (
        <div className="login-overlay">
          <div className="gs login-modal">
            <div style={{ width:60,height:60,borderRadius:"50%",background:"rgba(129,140,248,.12)",border:"1px solid rgba(129,140,248,.2)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:28 }}>🔐</div>
            <h3 style={{ fontSize:24,fontWeight:700,color:"var(--tp)",marginBottom:12 }}>Login Required</h3>
            <p style={{ fontSize:15,color:"var(--ts)",lineHeight:1.6,marginBottom:8 }}>To access personalized predictions and resume analysis, please log in first.</p>
            <p style={{ fontSize:14,color:"var(--accent)",fontWeight:600 }}>Redirecting you to login page...</p>
          </div>
        </div>
      )}
    </div>
  );
}