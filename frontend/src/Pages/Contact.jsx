import React, { useState, useEffect, useRef, memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Footer from '../components/Footer';
import './Contact.css';

// ----------------------------------------------------------------------
// 1. HIGH PERFORMANCE CUSTOM CURSOR (DESKTOP ONLY)
// ----------------------------------------------------------------------
const CustomCursor = memo(() => {
  const cursorRef = useRef(null);
  const isPointerFine = useRef(
    typeof window !== "undefined" ? window.matchMedia("(pointer: fine)").matches : false
  );

  useEffect(() => {
    if (!isPointerFine.current) return;

    let cursorX = -100;
    let cursorY = -100;
    let targetX = -100;
    let targetY = -100;
    let animationFrameId;

    const onMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      
      // Expand cursor on interactive elements
      const target = e.target;
      if (cursorRef.current) {
        if (
          target.tagName.toLowerCase() === 'button' ||
          target.tagName.toLowerCase() === 'a' ||
          target.closest('button') ||
          target.closest('a') ||
          target.tagName.toLowerCase() === 'input' ||
          target.tagName.toLowerCase() === 'textarea'
        ) {
          cursorRef.current.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) scale(2.5)`;
          cursorRef.current.style.backgroundColor = "transparent";
          cursorRef.current.style.border = "1px solid var(--contact-primary)";
        } else {
          cursorRef.current.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) scale(1)`;
          cursorRef.current.style.backgroundColor = "var(--contact-primary)";
          cursorRef.current.style.border = "none";
        }
      }
    };

    const updateCursor = () => {
      cursorX += (targetX - cursorX) * 0.2; // Smooth lerp
      cursorY += (targetY - cursorY) * 0.2;

      if (cursorRef.current) {
        // Keep scale intact if it was set in mousemove
        const currentTransform = cursorRef.current.style.transform;
        const scaleMatch = currentTransform.match(/scale\(([^)]+)\)/);
        const scale = scaleMatch ? scaleMatch[0] : "scale(1)";
        
        cursorRef.current.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) ${scale}`;
      }
      animationFrameId = requestAnimationFrame(updateCursor);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    animationFrameId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!isPointerFine.current) return null;

  return (
    <div
      ref={cursorRef}
      style={{
        position: "fixed",
        top: "-8px",
        left: "-8px",
        width: "16px",
        height: "16px",
        borderRadius: "50%",
        backgroundColor: "var(--contact-primary)",
        pointerEvents: "none",
        zIndex: 9999,
        mixBlendMode: "difference",
        transition: "width 0.2s, height 0.2s, background-color 0.2s, border 0.2s",
      }}
    />
  );
});

// ----------------------------------------------------------------------
// 2. REUSABLE UI COMPONENTS
// ----------------------------------------------------------------------
const FadeSection = ({ children, delay = 0, yOffset = 20, className = "" }) => {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const SocialCard = memo(({ href, icon, name, handle }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="contact-social-card">
    {icon}
    <div>
      <div className="contact-social-name">{name}</div>
      <div className="contact-social-handle">{handle}</div>
    </div>
  </a>
));

// ----------------------------------------------------------------------
// 3. MAIN CONTACT COMPONENT
// ----------------------------------------------------------------------
function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [copiedData, setCopiedData] = useState(null);

  // Async Form Submission Handler ready for real backend integration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      // TODO: Replace with real API endpoint, e.g. axios.post('/api/contact', formData)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      // Reset success state after 3s
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      console.error("Submission failed:", error);
      setStatus("error");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedData(type);
    setTimeout(() => setCopiedData(null), 2000);
  };

  return (
    <div className="contact-page-container">
      <CustomCursor />
      <div className="contact-ambient-bg" />
      <div className="contact-grid-overlay" />

      {/* Hero Section */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "8rem 2rem 2rem", textAlign: "center" }}>
        <FadeSection yOffset={30}>
          <div className="contact-status-badge">
            <div className="contact-status-dot" />
            System Online & Accepting Opportunities
          </div>
          <h1 className="contact-hero-title">Initialize Connection</h1>
          <p className="contact-hero-subtitle" style={{ margin: "0 auto" }}>
            Secure transmission channel for enterprise collaborations, engineering opportunities, and technical inquiries.
          </p>
        </FadeSection>
      </section>

      {/* Main Grid Layout */}
      <section className="contact-main-grid">
        
        {/* Left Column - Contact Data */}
        <div>
          <FadeSection delay={0.1}>
            <div className="contact-glass-panel" style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1.5rem" }}>Communication Nodes</h2>
              
              {/* Email Node */}
              <div 
                className="contact-info-item"
                onClick={() => copyToClipboard("g.sivasatyasaibhagavan@gmail.com", "email")}
              >
                <div className="contact-info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div className="contact-info-content">
                  <h3>Primary Transmission</h3>
                  <p>g.sivasatyasaibhagavan@gmail.com</p>
                  <span style={{ fontSize: "0.8rem", color: copiedData === "email" ? "var(--contact-success)" : "var(--contact-accent)" }}>
                    {copiedData === "email" ? "✓ Copied to clipboard" : "Click to copy address"}
                  </span>
                </div>
              </div>

              {/* Phone Node */}
              <div 
                className="contact-info-item"
                onClick={() => copyToClipboard("+917569205626", "phone")}
              >
                <div className="contact-info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div className="contact-info-content">
                  <h3>Direct Channel</h3>
                  <p>+91 75692 05626</p>
                  <span style={{ fontSize: "0.8rem", color: copiedData === "phone" ? "var(--contact-success)" : "var(--contact-accent)" }}>
                    {copiedData === "phone" ? "✓ Copied to clipboard" : "Click to copy number"}
                  </span>
                </div>
              </div>

              {/* Location Node */}
              <div className="contact-info-item" style={{ cursor: "default" }}>
                <div className="contact-info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="10" r="3"></circle>
                    <path d="M12 217c-5-5-8-10-8-14a8 8 0 1 1 16 0c0 4-3 9-8 14z"></path>
                  </svg>
                </div>
                <div className="contact-info-content">
                  <h3>Operating Timezone</h3>
                  <p>IST (UTC+5:30)</p>
                  <span style={{ fontSize: "0.8rem", color: "var(--contact-dim)" }}>Available for remote collaboration</span>
                </div>
              </div>
            </div>
          </FadeSection>

          <FadeSection delay={0.2}>
            <div className="contact-glass-panel">
              <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem" }}>Global Network</h2>
              <p style={{ color: "var(--contact-dim)", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
                Connect through professional and open-source networks.
              </p>
              
              <div className="contact-social-grid">
                <SocialCard 
                  href="https://github.com/bhagavan444"
                  name="GitHub"
                  handle="@bhagavan444"
                  icon={
                    <svg viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                  }
                />
                <SocialCard 
                  href="https://linkedin.com/in/bhagavan444"
                  name="LinkedIn"
                  handle="@bhagavan444"
                  icon={
                    <svg viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  }
                />
              </div>

              <div className="contact-skill-tags">
                {["AI Infrastructure", "Machine Learning", "System Architecture", "React & Node.js", "Python", "Cloud Engineering"].map(skill => (
                  <span key={skill} className="contact-skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          </FadeSection>
        </div>

        {/* Right Column - Async Contact Form */}
        <div>
          <FadeSection delay={0.3}>
            <div className="contact-glass-panel">
              <h2 style={{ fontSize: "2rem", fontWeight: "600", marginBottom: "0.5rem" }}>Secure Message</h2>
              <p style={{ color: "var(--contact-dim)", marginBottom: "2rem" }}>
                System ready for input. Response protocol initiated within 24 hours.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="contact-form-group">
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    placeholder=" "
                    className="contact-form-input" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required 
                    disabled={status === "loading" || status === "success"}
                  />
                  <label htmlFor="name" className="contact-form-label" style={{ position: "absolute", top: "16px", left: "20px", pointerEvents: "none" }}>
                    {formData.name ? "Operator Name" : "Enter Operator Name"}
                  </label>
                </div>

                <div className="contact-form-group">
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder=" "
                    className="contact-form-input" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                    disabled={status === "loading" || status === "success"}
                  />
                  <label htmlFor="email" className="contact-form-label" style={{ position: "absolute", top: "16px", left: "20px", pointerEvents: "none" }}>
                    {formData.email ? "Return Protocol (Email)" : "Enter Return Email"}
                  </label>
                </div>

                <div className="contact-form-group">
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject" 
                    placeholder=" "
                    className="contact-form-input" 
                    value={formData.subject}
                    onChange={handleInputChange}
                    required 
                    disabled={status === "loading" || status === "success"}
                  />
                  <label htmlFor="subject" className="contact-form-label" style={{ position: "absolute", top: "16px", left: "20px", pointerEvents: "none" }}>
                    {formData.subject ? "Transmission Subject" : "Enter Subject"}
                  </label>
                </div>

                <div className="contact-form-group">
                  <textarea 
                    id="message" 
                    name="message" 
                    placeholder=" "
                    className="contact-form-input contact-form-textarea" 
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    disabled={status === "loading" || status === "success"}
                  />
                  <label htmlFor="message" className="contact-form-label" style={{ position: "absolute", top: "16px", left: "20px", pointerEvents: "none" }}>
                    {formData.message ? "Encrypted Payload" : "Enter Message Content"}
                  </label>
                </div>

                <button 
                  type="submit" 
                  className={`contact-submit-btn ${status === 'success' ? 'success' : ''}`}
                  disabled={status === "loading" || status === "success"}
                >
                  {status === "idle" && "Transmit Payload"}
                  {status === "loading" && (
                    <>
                      <div className="contact-spinner" />
                      Authenticating...
                    </>
                  )}
                  {status === "success" && "Transmission Successful"}
                  {status === "error" && "System Error - Retry"}
                </button>
              </form>
            </div>
          </FadeSection>
        </div>

      </section>

      {/* Reusable Platform Footer */}
      <Footer />
    </div>
  );
}

export default Contact;