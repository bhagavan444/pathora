import React, { useEffect, useState, useRef, memo } from "react";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  GoogleAuthProvider
} from "firebase/auth";
import { auth } from "../firebase";

const googleProvider = new GoogleAuthProvider();
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import './Login.css';
import './Home.css';

/* ================= ANIMATION COMPONENT ================= */
const FadeSection = ({ children, delay = 0, yOffset = 20, className = "" }) => {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : yOffset }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ================= MAIN LOGIN COMPONENT ================= */
export default function Login({ handleLogin }) {
  /* ================= STATE ================= */
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [currentFeature, setCurrentFeature] = useState(0);

  const navigate = useNavigate();

  const features = [
    { title: "Resume Intelligence", description: "AI-powered resume analysis and optimization" },
    { title: "Career Readiness Index", description: "Comprehensive skill assessment and gap analysis" },
    { title: "Role Matching Engine", description: "Precision matching with industry opportunities" },
    { title: "Skill Gap Analysis", description: "Identify and bridge critical skill gaps" }
  ];

  /* ================= AUTH WATCH ================= */
  useEffect(() => {
    if (!auth) {
      console.warn("[Login] Firebase auth is undefined. Skipping onAuthStateChanged listener.");
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/recommend");
    });
    return unsubscribe;
  }, [navigate]);

  /* ================= PASSWORD STRENGTH ================= */
  useEffect(() => {
    setPasswordScore(calculatePasswordScore(password));
  }, [password]);

  /* ================= FEATURE ROTATION ================= */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  /* ================= RATE LIMIT LOAD ================= */
  useEffect(() => {
    const attempts = Number(localStorage.getItem("login_attempts") || 0);
    setLoginAttempts(attempts);
  }, []);

  /* ================= HELPERS ================= */
  const resetMessages = () => {
    setErrorMsg("");
    setSuccessMsg("");
  };

  const isValidEmail = (value) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);

  function calculatePasswordScore(pw = "") {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[@#$%^&+=!]/.test(pw)) score++;
    return score;
  }

  const recordFailedAttempt = () => {
    const next = loginAttempts + 1;
    setLoginAttempts(next);
    localStorage.setItem("login_attempts", next);

    if (next >= 5) {
      setErrorMsg("Too many attempts. Please try again later.");
    } else {
      setErrorMsg(`Authentication failed. ${5 - next} attempts remaining.`);
    }
  };

  /* ================= AUTH HANDLERS ================= */
  const loginWithEmail = async () => {
    resetMessages();
    if (!auth) return setErrorMsg("Firebase auth is not initialized. Please check configuration.");
    if (!isValidEmail(email)) return setErrorMsg("Please enter a valid email address");
    if (password.length < 6) return setErrorMsg("Password must be at least 6 characters");

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("login_attempts", 0);
      if (handleLogin) handleLogin();
      navigate("/recommend");
    } catch (err) {
      recordFailedAttempt();
    } finally {
      setLoading(false);
    }
  };

  const signupWithEmail = async () => {
    resetMessages();
    if (!auth) return setErrorMsg("Firebase auth is not initialized. Please check configuration.");
    if (!termsAccepted) return setErrorMsg("Please accept the Privacy Policy to continue");
    if (!isValidEmail(email)) return setErrorMsg("Please enter a valid email address");
    if (passwordScore < 3) return setErrorMsg("Please use a stronger password");

    try {
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(cred.user);
      setSuccessMsg("Account created successfully. Verification email sent.");
      if (handleLogin) handleLogin();
      navigate("/recommend");
    } catch (err) {
      setErrorMsg(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    resetMessages();
    if (!auth) return setErrorMsg("Firebase auth is not initialized. Please check configuration.");
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      if (handleLogin) handleLogin();
      navigate("/predict");
    } catch (err) {
      recordFailedAttempt();
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!auth) return setErrorMsg("Firebase auth is not initialized. Please check configuration.");
    if (!isValidEmail(email)) return setErrorMsg("Please enter a valid email address");
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setSuccessMsg("Password reset email sent successfully.");
    } catch {
      setErrorMsg("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail("demo.pathora@gmail.com");
    setPassword("Demo@1234");
    setMode("login");
    setSuccessMsg("Demo credentials loaded");
  };

  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
  const strengthColors = ['#e2e8f0', '#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'];

  /* ================= RENDER ================= */
  return (
    <div className="login-container home-wrap">

      <div className="grid-bg" />

      {/* LEFT PANEL - BRAND SHOWCASE */}
      <div className="login-left-panel">
        <FadeSection delay={0.1}>
          <div className="login-brand">
            <div className="login-brand-dot" /> Pathora
          </div>
          
          <h1 className="login-hero-title">Engineer Your Future<br/>With Intelligence.</h1>
          <p className="login-hero-subtitle">
            Secure, AI-driven career insights aligned with elite industry standards. Access predictive metrics and capability mapping.
          </p>
        </FadeSection>

        <FadeSection delay={0.2}>
          <motion.div 
            className="login-feature-card"
            key={currentFeature}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="login-feature-label">Active Capability</div>
            <div className="login-feature-title">{features[currentFeature].title}</div>
            <div className="login-feature-desc">{features[currentFeature].description}</div>
          </motion.div>

          <div className="login-metrics-grid">
            <div className="login-metric-item">
              <div className="login-metric-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <div className="login-metric-text">ATS Optimization</div>
            </div>
            <div className="login-metric-item">
              <div className="login-metric-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div className="login-metric-text">Career Intelligence</div>
            </div>
            <div className="login-metric-item">
              <div className="login-metric-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
              <div className="login-metric-text">Global Alignment</div>
            </div>
            <div className="login-metric-item">
              <div className="login-metric-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <div className="login-metric-text">Predictive Readiness</div>
            </div>
          </div>
        </FadeSection>
      </div>

      {/* RIGHT PANEL - AUTH CARD */}
      <div className="login-right-panel">
        <FadeSection delay={0.1}>
          <div className="login-auth-card">
            
            <div className="login-auth-header">
              <h2 className="login-auth-title">Welcome to Pathora</h2>
              <p className="login-auth-subtitle">Initialize your secure session to continue.</p>
            </div>

            {/* Mode Toggle */}
            <div className="login-mode-toggle">
              <button 
                className={`login-mode-btn ${mode === 'login' ? 'active' : ''}`}
                onClick={() => { setMode("login"); resetMessages(); }}
              >
                Sign In
              </button>
              <button 
                className={`login-mode-btn ${mode === 'signup' ? 'active' : ''}`}
                onClick={() => { setMode("signup"); resetMessages(); }}
              >
                Create Account
              </button>
            </div>

                {/* Messages */}
                {errorMsg && (
                  <div className="login-alert error">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {errorMsg}
                  </div>
                )}
                {successMsg && (
                  <div className="login-alert success">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    {successMsg}
                  </div>
                )}

                {/* Email Input */}
                <div className="login-input-group">
                  <input
                    type="email"
                    id="email"
                    className="login-input"
                    placeholder=" "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                  <label htmlFor="email" className="login-label">Work Email Address</label>
                  {errorMsg && !isValidEmail(email) && email.length > 0 && (
                    <div className="login-error-text">Valid email required</div>
                  )}
                </div>

                {/* Password Input */}
                <div className="login-input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="login-input"
                    placeholder=" "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <label htmlFor="password" className="login-label">Password</label>
                  <button 
                    type="button" 
                    className="login-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    )}
                  </button>
                </div>

                {/* Password Strength Meter (Signup Only) */}
                {mode === "signup" && password.length > 0 && (
                  <div style={{ marginBottom: "1rem" }}>
                    <div className="login-strength-meter">
                      {[1, 2, 3, 4, 5].map((index) => (
                        <div 
                          key={index} 
                          className="login-strength-bar"
                          style={{ 
                            background: index <= passwordScore ? strengthColors[passwordScore] : 'rgba(0,0,0,0.1)' 
                          }}
                        />
                      ))}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginTop: "4px", color: "var(--login-muted)" }}>
                      <span style={{ color: passwordScore > 0 ? strengthColors[passwordScore] : 'inherit', fontWeight: 600 }}>
                        {strengthLabels[passwordScore]}
                      </span>
                      {passwordScore < 4 && <span>Add uppercase, number & symbol</span>}
                    </div>
                  </div>
                )}

                {/* Terms Checkbox (Signup Only) */}
                {mode === "signup" && (
                  <label className="login-checkbox-group">
                    <input 
                      type="checkbox" 
                      className="login-checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                    />
                    <span>I accept the <a className="login-link">Privacy Policy</a> & Terms.</span>
                  </label>
                )}

                {/* Forgot Password (Login Only) */}
                {mode === "login" && (
                  <a onClick={resetPassword} className="login-link login-forgot">
                    Forgot password?
                  </a>
                )}

                {/* Submit Button */}
                <button 
                  className="login-submit-btn"
                  onClick={mode === "login" ? loginWithEmail : signupWithEmail}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{animation: 'spin 1s linear infinite'}}>
                        <circle cx="12" cy="12" r="10" opacity="0.25"/>
                        <path d="M12 2a10 10 0 0 1 10 10" opacity="0.75"/>
                      </svg>
                      Processing...
                    </>
                  ) : mode === "login" ? "Initialize Session" : "Create Account"}
                </button>

                {/* Divider */}
                <div className="login-divider">OR CONTINUE WITH</div>

                {/* Google OAuth */}
                <button 
                  className="login-google-btn"
                  onClick={loginWithGoogle}
                  disabled={loading}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google Workspace
                </button>

                {/* Demo Mode Link */}
                <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                  <a onClick={fillDemoAccount} className="login-link" style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--login-muted)" }}>
                    Load Demo Credentials
                  </a>
                </div>

            {/* Trust Badges */}
            <div className="login-trust-badges">
              <div className="login-trust-badge">
                <svg className="login-trust-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                Firebase Secure Authentication
              </div>
              <div className="login-trust-badge">
                <svg className="login-trust-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                End-to-End Encrypted Protocols
              </div>
            </div>

          </div>
        </FadeSection>
      </div>

    </div>
  );
}