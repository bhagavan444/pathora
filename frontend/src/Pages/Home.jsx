import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { DOMAINS, ROADMAP_STEPS, CAREER_FEATURES, SUCCESS_STORIES, INDUSTRIES, COMPARISON } from "./HomeData";
import { useReveal, AnimatedCounter, CinematicUniverseCore, TechMarquee } from "./HomeComponents";
import Footer from '../components/Footer';

export default function Home() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const user = typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem("user_profile") || "null") : null;
  const [selectedDomain, setSelectedDomain] = useState("Software Engineering");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [resume, setResume] = useState(null);
  const [careerScore, setCareerScore] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const r1=useReveal(),r2=useReveal(),r3=useReveal(),r4=useReveal(),r5=useReveal(),r6=useReveal(),r7=useReveal(),r8=useReveal();

  useEffect(() => {
    let s = 0; if (resume) s += 35;
    s += Math.min(selectedSkills.length * 10, 35);
    if (user) s += 30; setCareerScore(s);
  }, [resume, selectedSkills, user]);

  const toggleSkill = (skill) => setSelectedSkills(p => p.includes(skill) ? p.filter(s => s !== skill) : [...p, skill]);
  const handleGetStarted = () => { if (user) { navigate("/predict"); } else { setShowLoginPrompt(true); setTimeout(() => navigate("/login"), 2500); } };
  const pct = Math.round((selectedSkills.length / DOMAINS[selectedDomain].length) * 100);

  return (
    <div className="home-wrap">
      <div className="grid-bg" />

      {/* ═══ HERO ═══ */}
      <section className="hero-sec">
        <div style={{ position:"absolute",top:"8%",left:"-10%",width:"50vw",height:"50vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(129,140,248,.08) 0%,transparent 65%)",filter:"blur(70px)",pointerEvents:"none",animation:"float 12s ease-in-out infinite" }} />
        <div className="hero-grid">
          <div style={{ animation:"fadeUp .8s cubic-bezier(.4,0,.2,1) both" }}>
            <div className="hero-badge">
              <span className="hero-badge-tag">THE ASCENSION PROTOCOL</span>
              <span style={{ fontSize:12,color:"rgba(0,0,0,0.6)",fontWeight:600 }}>Next-Gen Career Singularity</span>
            </div>
            <h1 className="hero-h1">
              Your Engineering Legacy Begins <em>Right Here.</em>
            </h1>
            <p className="hero-sub">
              Transcend the competition. Pathora decodes the industry matrix and maps your absolute potential, generating a flawless trajectory to secure your dream first role. Built exclusively for elite freshers.
            </p>
            <div className="hero-ctas">
              <button className="btn-glass-primary" onClick={handleGetStarted}>Analyze My Career Path</button>
              <button className="btn-glass-outline" onClick={() => navigate("/quiz")}>Take Career Assessment</button>
            </div>
            <div className="trust-row">
              {["ATS-aligned analysis","Industry standards","Role-based mapping"].map(t => (
                <div key={t} className="trust-item">
                  <div className="trust-check">✓</div>
                  <span style={{ fontSize:13,color:"var(--tm)",fontWeight:500 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ animation:"slideLeft .8s cubic-bezier(.4,0,.2,1) .15s both" }}>
            <CinematicUniverseCore />
          </div>
        </div>
      </section>

      {/* ═══ TECH MARQUEE ═══ */}
      <div ref={r1} className="lg-reveal marquee-bar"><TechMarquee /></div>

      {/* ═══ METRICS ═══ */}
      <section ref={r2} className="lg-reveal sec">
        <div className="sec-inner" style={{ textAlign:"center" }}>
          <div className="sec-head">
            <div className="sec-tag" style={{ color:"var(--accent)" }}>Proven Ascendancy</div>
            <h2 className="sec-title">The Career Nexus<span style={{ color:"var(--ts)" }}> Forging Elite Engineers</span></h2>
          </div>
          <div className="metrics-grid">
            <AnimatedCounter end={1200} label="Career Predictions" suffix="+" />
            <AnimatedCounter end={94} label="ML Accuracy Rate" suffix="%" />
            <AnimatedCounter end={300} label="Interactive Quizzes" suffix="+" />
          </div>
        </div>
      </section>

      {/* ═══ CAREER READINESS ═══ */}
      <section ref={r3} className="lg-reveal sec" style={{ borderTop:"1px solid rgba(255,255,255,.06)" }}>
        <div className="readiness-wrap">
          <div className="sec-head">
            <div className="sec-tag" style={{ color:"var(--accent2)" }}>Your Trajectory</div>
            <h2 className="sec-title">The Readiness Matrix</h2>
            <p className="sec-desc">Real-time cinematic assessment of your technical arsenal, Predict engine trajectory, and industry synchrony.</p>
          </div>
          <div className="readiness-bar"><div className="readiness-fill" style={{ width:`${careerScore}%` }} /></div>
          <div className="readiness-score">{careerScore}%</div>
          <p style={{ textAlign:"center",fontSize:14,color:"var(--tm)" }}>Aligned with industry expectations for fresher-level roles</p>
        </div>
      </section>

      {/* ═══ SKILL GAP SIMULATOR ═══ */}
      <section ref={r4} className="lg-reveal sec">
        <div className="sec-inner">
          <div className="sec-head">
            <div className="sec-tag" style={{ color:"var(--accent3)" }}>Interactive Assessment</div>
            <h2 className="sec-title">Dynamic Skill Quizzes</h2>
            <p className="sec-desc">Enter the assessment simulation. Select your target engineering domain to test your baseline and reveal the critical tech stacks missing from your arsenal.</p>
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
      </section>

      {/* ═══ PREDICT ENGINE ═══ */}
      <section ref={r5} className="lg-reveal sec" style={{ borderTop:"1px solid rgba(255,255,255,.06)" }}>
        <div style={{ maxWidth:1100,margin:"0 auto" }}>
          <div className="sec-head">
            <div className="sec-tag" style={{ color:"var(--success)" }}>Machine Learning Core</div>
            <h2 className="sec-title">Predict Engine Initialization</h2>
            <p className="sec-desc" style={{ marginBottom: 40, marginTop: -10 }}>Initialize the ML Predict sequence by providing your academic and skill dataset.</p>
          </div>
          <div className="resume-drop" onClick={() => fileRef.current?.click()}>
            <div style={{ width:60,height:60,borderRadius:"50%",background:"rgba(129,140,248,.1)",border:"1px solid rgba(129,140,248,.2)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:28 }}>🧠</div>
            <h3 style={{ fontSize:20,fontWeight:600,color:"var(--tp)",marginBottom:8 }}>{resume ? resume.name : "Upload Academic Profile (PDF/JSON)"}</h3>
            <p style={{ fontSize:14,color:"var(--tm)" }}>Drop your file to let our ML models forecast your ideal career path</p>
          </div>
          <input ref={fileRef} type="file" hidden accept=".pdf,.docx,.json" onChange={e => setResume(e.target.files?.[0] || null)} />
          {resume && (
            <div className="resume-results">
              {[{label:"Prediction Confidence",value:"94%",color:"var(--success)"},{label:"Optimal Domain",value:selectedDomain.split(" ")[0],color:"var(--accent)"},{label:"Growth Trajectory",value:`${pct}%`,color:"var(--accent2)"}].map(({label,value,color}) => (
                <div key={label} className="resume-card">
                  <div style={{ fontSize:13,color:"var(--tm)",fontWeight:600,marginBottom:8 }}>{label}</div>
                  <div style={{ fontSize:28,fontWeight:700,color }}>{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ CAREER ROADMAP ═══ */}
      <section ref={r6} className="lg-reveal sec">
        <div className="sec-inner">
          <div className="sec-head">
            <div className="sec-tag" style={{ color:"var(--warning)" }}>The Awakening</div>
            <h2 className="sec-title">The Fresher's Ascension Roadmap</h2>
          </div>
          <div className="roadmap-wrap">
            <div className="roadmap-line" />
            <div className="roadmap-flex">
              {ROADMAP_STEPS.map((s, i) => (
                <div key={s.step} className="roadmap-step" style={{ animation:`fadeUp .6s cubic-bezier(.4,0,.2,1) ${i*.1}s both` }}>
                  <div className="roadmap-dot">{i+1}</div>
                  <div style={{ fontSize:14,fontWeight:600,color:"var(--tp)",textAlign:"center",maxWidth:120 }}>{s.step}</div>
                  <div style={{ fontSize:11,color:"var(--tm)",textAlign:"center",maxWidth:130,marginTop:6 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CAREER FEATURES ═══ */}
      <section className="sec" style={{ borderTop:"1px solid rgba(255,255,255,.06)" }}>
        <div className="sec-inner">
          <div className="sec-head">
            <div className="sec-tag" style={{ color:"var(--accent)" }}>The Core Architecture</div>
            <h2 className="sec-title">The Ultimate Fresher<br/>Intelligence Platform</h2>
            <p className="sec-desc">From the genesis of career discovery to your ultimate tech placement, we provide cinematic end-to-end guidance powered by our central AI core.</p>
          </div>
          <div className="features-grid">
            {CAREER_FEATURES.map((f, i) => (
              <div key={f.title} className="g feature-card" style={{ animation:`scaleIn .6s cubic-bezier(.4,0,.2,1) ${i*.08}s both` }}>
                <div className="feature-icon" style={{ background:`${f.color}15`,border:`1px solid ${f.color}25` }}>{f.icon}</div>
                <h3 style={{ fontSize:20,fontWeight:700,color:"var(--tp)",marginBottom:12 }}>{f.title}</h3>
                <p style={{ fontSize:14,color:"var(--ts)",lineHeight:1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SUCCESS STORIES ═══ */}
      <section className="sec" style={{ overflow:"hidden" }}>
        <div style={{ position:"absolute",top:"10%",right:"-5%",width:"40vw",height:"40vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(103,232,249,.05) 0%,transparent 70%)",filter:"blur(60px)",pointerEvents:"none" }} />
        <div className="sec-inner">
          <div className="sec-head">
            <div className="sec-tag" style={{ color:"var(--success)" }}>The Hall of Heroes</div>
            <h2 className="sec-title">Chronicles of Success</h2>
          </div>
          <div className="stories-grid">
            {SUCCESS_STORIES.map((s, i) => (
              <div key={s.name} className="g story-card" style={{ animation:`slideUp .6s cubic-bezier(.4,0,.2,1) ${i*.1}s both` }}>
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INDUSTRIES ═══ */}
      <section className="sec" style={{ borderTop:"1px solid rgba(255,255,255,.06)" }}>
        <div className="sec-inner">
          <div className="sec-head">
            <div className="sec-tag" style={{ color:"var(--accent3)" }}>The Multiverse</div>
            <h2 className="sec-title">Trending Sector Universes</h2>
          </div>
          <div className="industries-grid">
            {INDUSTRIES.map((ind, i) => (
              <div key={ind.name} className="g industry-card" style={{ animation:`rotateIn .5s cubic-bezier(.4,0,.2,1) ${i*.06}s both` }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16 }}>
                  <i className={ind.icon} style={{ fontSize:32,opacity:.8 }} />
                  <div style={{ padding:"4px 10px",borderRadius:8,background:"rgba(52,211,153,.1)",border:"1px solid rgba(52,211,153,.2)",fontSize:11,fontWeight:700,color:"var(--success)" }}>{ind.growth}</div>
                </div>
                <h4 style={{ fontSize:18,fontWeight:700,color:"var(--tp)",marginBottom:8 }}>{ind.name}</h4>
                <p style={{ fontSize:13,color:"var(--tm)" }}>{ind.jobs} open positions</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMPARISON TABLE ═══ */}
      <section className="sec">
        <div style={{ maxWidth:1000,margin:"0 auto" }}>
          <div className="sec-head">
            <div className="sec-tag" style={{ color:"var(--accent2)" }}>The Paradigm Shift</div>
            <h2 className="sec-title">Pathora vs<br/>The Legacy Matrix</h2>
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
      </section>

      {/* ═══ CTA ═══ */}
      <section ref={r7} className="lg-reveal cta-sec">
        <div className="cta-bg" />
        <div className="cta-glow" />
        <div style={{ position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.015) 1px,transparent 1px)",backgroundSize:"60px 60px" }} />
        <div className="cta-inner">
          <div style={{ fontSize:12,fontFamily:"var(--mono)",fontWeight:700,letterSpacing:".16em",color:"var(--tm)",marginBottom:20,textTransform:"uppercase",display:"flex",alignItems:"center",justifyContent:"center",gap:12 }}>
            <div style={{ width:24,height:1,background:"rgba(255,255,255,.2)" }} /> Ready to Start <div style={{ width:24,height:1,background:"rgba(255,255,255,.2)" }} />
          </div>
          <h2 style={{ fontFamily:"var(--display)",fontSize:"clamp(36px,5vw,64px)",fontWeight:400,fontStyle:"italic",color:"var(--tp)",marginBottom:20,lineHeight:1.12 }}>
            Initiate Your Engineering<br/>
            <span style={{ background:"linear-gradient(120deg,#a78bfa,#c4b5fd,#a78bfa)",backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",animation:"gradShift 4s ease infinite" }}>Evolution</span> Today
          </h2>
          <p style={{ fontSize:17,color:"var(--ts)",maxWidth:560,margin:"0 auto 40px",lineHeight:1.7 }}>
            Join the elite network of aspiring engineers using the central intelligence system to dominate the tech industry.
          </p>
          <button className="cta-btn" onClick={handleGetStarted}>Launch The Career Protocol</button>
        </div>
      </section>

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