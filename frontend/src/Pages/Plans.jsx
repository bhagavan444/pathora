import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Footer from '../components/Footer';
import "./Plans.css";

/**
 * ================================
 * ENTERPRISE PRICING – Plans.jsx
 * ================================
 * Futuristic 2026 AI SaaS Monetization Platform
 * Cinematic Liquid Glass Design System
 */

const BASE_PLANS = [
  {
    id: "free",
    name: "Essential",
    monthly: 0,
    yearly: 0,
    badge: null,
    short: "Fundamental AI career intelligence to get started.",
    features: [
      "Unlimited basic conversations",
      "Standard AI responses",
      "Secure & private processing",
      "Mobile & desktop access",
    ],
    disabledFeatures: [
      "Neural ATS resume analysis",
      "Predictive career mapping",
      "Priority API access",
    ],
    cta: "Start Free",
    featured: false,
  },
  {
    id: "pro",
    name: "Intelligence Pro",
    monthly: 19,
    yearly: 180,
    badge: "Most Popular",
    short: "Advanced neural intelligence for serious career acceleration.",
    features: [
      "Latest Generation AI models",
      "Neural ATS resume analysis",
      "Predictive career mapping",
      "Saved conversation history",
      "Document Q&A (PDF, DOC)",
      "Priority response times",
    ],
    disabledFeatures: ["Dedicated team API", "Custom model fine-tuning"],
    cta: "Start 7-Day Trial",
    featured: true,
  },
  {
    id: "enterprise",
    name: "Enterprise Core",
    monthly: 49,
    yearly: 470,
    badge: "Maximum Power",
    short: "For teams, agencies, and power users demanding scale.",
    features: [
      "Everything in Intelligence Pro",
      "Dedicated team API access",
      "Custom model fine-tuning",
      "Bulk resume processing",
      "Advanced analytics dashboard",
      "24/7 dedicated support",
    ],
    disabledFeatures: [],
    cta: "Upgrade to Core",
    featured: false,
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah Jenkins",
    role: "Senior Data Scientist @ TechFlow",
    text: "Pathora's ATS analysis is indistinguishable from magic. It identified keyword gaps that my human reviewers missed, landing me three interviews in a week.",
    initials: "SJ"
  },
  {
    name: "Marcus Chen",
    role: "Product Manager",
    text: "The predictive career mapping feature is worth 10x the subscription price. It's like having a FAANG executive as your personal career mentor.",
    initials: "MC"
  },
  {
    name: "Elena Rostova",
    role: "Lead Designer",
    text: "As a designer, I'm extremely critical of UI. Pathora feels like an OS from 2030. Flawless execution and genuinely powerful AI.",
    initials: "ER"
  },
];

const FAQ_DATA = [
  {
    q: "How does the AI ATS analysis work?",
    a: "Our neural engine scans your resume against millions of successful job applications in your target industry, identifying missing keywords, structural flaws, and impact metrics with 98% accuracy."
  },
  {
    q: "Can I switch between monthly and yearly billing?",
    a: "Absolutely. You can upgrade to yearly billing at any time from your dashboard to lock in the 20% savings. Your existing monthly credit will be prorated."
  },
  {
    q: "Is my resume and career data kept private?",
    a: "We employ military-grade encryption and strict zero-retention policies for non-subscribers. Your data is never used to train global models without explicit opt-in."
  },
  {
    q: "Do you offer API access for staffing agencies?",
    a: "Yes, our Enterprise Core plan includes high-throughput API access for bulk resume processing and candidate matching."
  }
];

const FloatingCursor = ({ variant }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      className={`floating-cursor ${variant === 'hover' ? 'hover' : ''}`}
      style={{ left: pos.x, top: pos.y }}
    />
  );
};

export default function Plans() {
  const navigate = useNavigate();

  const [billing, setBilling] = useState("monthly");
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cursorVariant, setCursorVariant] = useState("default");
  
  // Checkout State
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // AI Estimator State
  const [aiUsage, setAiUsage] = useState(50);
  
  // Testimonials State
  const [testIndex, setTestIndex] = useState(0);
  
  // FAQ State
  const [openFaq, setOpenFaq] = useState(0);

  // Auto-play testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setTestIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleCursorEnter = () => setCursorVariant("hover");
  const handleCursorLeave = () => setCursorVariant("default");

  const price = (plan) => {
    const base = billing === "monthly" ? plan.monthly : plan.yearly;
    if (promoApplied === "PATHORA2026") return Math.round(base * 0.8);
    return base;
  };

  const applyPromo = () => {
    if (promo.toUpperCase().trim() === "PATHORA2026") {
      setPromoApplied("PATHORA2026");
    } else {
      alert("Invalid promotional code.");
    }
  };

  const recommendedPlan = useMemo(() => {
    if (aiUsage < 20) return BASE_PLANS[0];
    if (aiUsage < 80) return BASE_PLANS[1];
    return BASE_PLANS[2];
  }, [aiUsage]);

  const handleSelectPlan = (plan) => {
    if (plan.id === "free") {
      navigate("/");
    } else {
      setSelectedPlan(plan);
      setShowModal(true);
    }
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate processing payment
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Successfully processed ${paymentMethod} payment for ${selectedPlan?.name}!`);
      setShowModal(false);
      
      // Reset form states
      setPaymentMethod("card");
    }, 2000);
  };

  return (
    <div className="plans-wrapper">
      <FloatingCursor variant={cursorVariant} />
      
      <div className="plans-container">
        
        {/* HERO SECTION */}
        <header className="plans-header">
          <h1 className="plans-title">
            Unlock <em>Neural Intelligence</em>
          </h1>
          <p className="plans-subtitle">
            Scale your career trajectory with our advanced AI processing models. Choose the computing tier that matches your ambition.
          </p>
        </header>

        {/* AI USAGE ESTIMATOR */}
        <section className="ai-estimator">
          <div className="estimator-header">
            <div className="estimator-title">
              <div className="estimator-icon">AI</div>
              Compute Requirements
            </div>
            <span style={{color: 'var(--text-tertiary)', fontSize: '14px'}}>Adjust to find your ideal plan</span>
          </div>
          
          <div className="estimator-slider-container">
            <input 
              type="range" 
              className="estimator-slider" 
              min="0" 
              max="100" 
              value={aiUsage}
              onChange={(e) => setAiUsage(parseInt(e.target.value))}
              onMouseEnter={handleCursorEnter}
              onMouseLeave={handleCursorLeave}
              style={{
                background: `linear-gradient(to right, var(--primary-accent) ${aiUsage}%, rgba(0,0,0,0.1) ${aiUsage}%)`
              }}
            />
          </div>
          
          <div className="estimator-metrics">
            <div className="metric">
              <div className="metric-value">{aiUsage * 10}</div>
              <div className="metric-label">Queries / Month</div>
            </div>
            <div className="metric">
              <div className="metric-value">{Math.round(aiUsage / 5)}</div>
              <div className="metric-label">Resumes Analyzed</div>
            </div>
            <div className="metric">
              <div className="metric-value">{aiUsage > 75 ? 'v4.5' : 'v3.5'}</div>
              <div className="metric-label">Model Tier</div>
            </div>
          </div>
          
          <div className="ai-recommendation">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            Pathora AI recommends the <strong>{recommendedPlan.name}</strong> plan for this workload.
          </div>
        </section>

        {/* BILLING TOGGLE & PROMO */}
        <div className="billing-toggle-wrapper">
          <div className="billing-toggle">
            <div 
              className="toggle-slider" 
              style={{
                width: '50%',
                transform: billing === 'monthly' ? 'translateX(0)' : 'translateX(100%)'
              }}
            />
            <button 
              className={`toggle-btn ${billing === 'monthly' ? 'active' : ''}`}
              onClick={() => setBilling('monthly')}
              onMouseEnter={handleCursorEnter}
              onMouseLeave={handleCursorLeave}
            >
              Monthly
            </button>
            <button 
              className={`toggle-btn ${billing === 'yearly' ? 'active' : ''}`}
              onClick={() => setBilling('yearly')}
              onMouseEnter={handleCursorEnter}
              onMouseLeave={handleCursorLeave}
            >
              Annually <span className="save-badge">Save 20%</span>
            </button>
          </div>
          
          <div className="promo-container">
            <input 
              type="text" 
              className="promo-input" 
              placeholder="Enter Promo Code"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
            />
            <button 
              className="promo-btn" 
              onClick={applyPromo}
              onMouseEnter={handleCursorEnter}
              onMouseLeave={handleCursorLeave}
            >
              Apply
            </button>
          </div>
          {promoApplied && (
             <div style={{color: 'var(--success)', marginTop: 12, fontSize: 14, fontWeight: 600}}>
               Promo code {promoApplied} applied!
             </div>
          )}
        </div>

        {/* PLANS GRID */}
        <div className="plans-grid">
          {BASE_PLANS.map((plan) => (
            <div 
              key={plan.id} 
              className={`plan-card ${plan.featured ? 'featured' : ''}`}
              style={{
                transform: recommendedPlan.id === plan.id ? 'scale(1.02)' : 'none',
                borderColor: recommendedPlan.id === plan.id ? 'var(--primary-accent)' : 'var(--glass-border)'
              }}
            >
              {plan.badge && <div className="plan-badge">{plan.badge}</div>}
              
              <div className="plan-header">
                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-desc">{plan.short}</p>
              </div>
              
              <div className="plan-price-wrapper">
                <span className="currency">$</span>
                <span className="amount">{price(plan)}</span>
                <span className="period">/ {billing === 'monthly' ? 'mo' : 'yr'}</span>
              </div>
              
              {billing === 'yearly' && plan.monthly > 0 && (
                <div className="savings-label">
                  Billed ${(price(plan)).toLocaleString()} annually
                </div>
              )}
              
              <ul className="plan-features">
                {plan.features.map((f, i) => (
                  <li key={i} className="feature-item">
                    <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
                {plan.disabledFeatures.map((f, i) => (
                  <li key={`d-${i}`} className="feature-item disabled">
                    <svg className="x-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              
              <button 
                className={`plan-cta ${plan.featured ? 'cta-primary' : 'cta-secondary'}`}
                onClick={() => handleSelectPlan(plan)}
                onMouseEnter={handleCursorEnter}
                onMouseLeave={handleCursorLeave}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FEATURE COMPARISON */}
        <section className="comparison-section">
          <h2 className="comparison-title">Comprehensive Analysis</h2>
          <div className="comparison-table-wrapper">
            <div className="compare-row compare-header">
              <div>Core Capabilities</div>
              <div style={{textAlign: 'center'}}>Essential</div>
              <div style={{textAlign: 'center', color: 'var(--primary-accent)'}}>Intelligence Pro</div>
              <div style={{textAlign: 'center'}}>Enterprise Core</div>
            </div>
            
            {[
              { label: "AI Model Generation", val1: "Standard (v3.5)", val2: "Advanced (v4.0)", val3: "Custom Fine-tuned" },
              { label: "Resume ATS Parsing", val1: "Basic", val2: "Deep Neural Scan", val3: "Batch Processing" },
              { label: "Career Trajectory Mapping", val1: "-", val2: "Included", val3: "Advanced + Industry Trends" },
              { label: "API Rate Limit", val1: "10 / day", val2: "500 / day", val3: "Unlimited" },
              { label: "Support Level", val1: "Community", val2: "Priority Email", val3: "24/7 Dedicated Agent" },
            ].map((row, i) => (
              <div className="compare-row" key={i}>
                <div className="compare-feature">
                  {row.label}
                  <svg className="compare-info-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                  </svg>
                </div>
                <div className="compare-value" data-label="Essential">{row.val1}</div>
                <div className="compare-value highlight" data-label="Pro">{row.val2}</div>
                <div className="compare-value" data-label="Enterprise">{row.val3}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ENTERPRISE CTA */}
        <section className="enterprise-section">
          <div className="enterprise-content">
            <h2>Deploy Intelligence at Scale</h2>
            <p>
              Require custom model fine-tuning, bulk candidate processing, or deep integration into your existing HR systems? Partner with our engineers to build a bespoke intelligence layer.
            </p>
            <div className="enterprise-metrics">
              <div className="ent-metric">
                <h4>99.99%</h4>
                <span>API Uptime SLA</span>
              </div>
              <div className="ent-metric">
                <h4>&lt;50ms</h4>
                <span>Inference Latency</span>
              </div>
            </div>
            <button 
              className="enterprise-cta-btn"
              onMouseEnter={handleCursorEnter}
              onMouseLeave={handleCursorLeave}
              onClick={() => window.location.href = "mailto:enterprise@pathora.ai"}
            >
              Contact Enterprise Engineering
            </button>
          </div>
          <div style={{display: 'flex', justifyContent: 'center'}}>
             {/* Abstract tech illustration */}
             <div style={{width: 300, height: 300, position: 'relative'}}>
                <div style={{position: 'absolute', inset: 20, border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', borderTopColor: 'var(--primary-accent3)', animation: 'spin 10s linear infinite'}} />
                <div style={{position: 'absolute', inset: 40, border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', borderRightColor: 'var(--primary-accent)', animation: 'spin 15s linear infinite reverse'}} />
                <div style={{position: 'absolute', inset: 60, border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', borderBottomColor: 'var(--primary-accent2)', animation: 'spin 20s linear infinite'}} />
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
             </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="testimonials-section">
          <h2 className="testimonials-title">Trusted by Industry Leaders</h2>
          <div className="testimonials-carousel">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={`testimonial-card ${i === testIndex ? 'active' : (i < testIndex ? 'prev' : '')}`}>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.initials}</div>
                  <div className="author-info">
                    <div className="author-name">{t.name}</div>
                    <div className="author-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="carousel-dots">
            {TESTIMONIALS.map((_, i) => (
              <div 
                key={i} 
                className={`dot ${i === testIndex ? 'active' : ''}`}
                onClick={() => setTestIndex(i)}
                onMouseEnter={handleCursorEnter}
                onMouseLeave={handleCursorLeave}
              />
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="faq-section">
          <h2 className="faq-title">System Inquiries</h2>
          <div className="faq-list">
            {FAQ_DATA.map((faq, i) => (
              <div key={i} className="faq-item">
                <div 
                  className="faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  onMouseEnter={handleCursorEnter}
                  onMouseLeave={handleCursorLeave}
                >
                  {faq.q}
                  <svg className={`faq-icon ${openFaq === i ? 'open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {openFaq === i && (
                  <div className="faq-a">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
      
      <Footer />

      {/* CHECKOUT MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
            
            <div className="modal-header">
              <h3>Secure Checkout</h3>
              <p className="modal-price">
                Subscribe to <strong>{selectedPlan?.name}</strong> for ${price(selectedPlan)} / {billing === 'monthly' ? 'mo' : 'yr'}
              </p>
            </div>
            
            <form className="modal-form" onSubmit={handleCheckout}>
              <div className="payment-methods">
                <div 
                  className={`payment-method ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                  onMouseEnter={handleCursorEnter}
                  onMouseLeave={handleCursorLeave}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                    <line x1="2" y1="10" x2="22" y2="10"></line>
                  </svg>
                  Card
                </div>
                <div 
                  className={`payment-method ${paymentMethod === 'paypal' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('paypal')}
                  onMouseEnter={handleCursorEnter}
                  onMouseLeave={handleCursorLeave}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 11V7a5 5 0 0110 0v4"></path>
                    <path d="M7 11v8h10v-8H7z"></path>
                  </svg>
                  PayPal
                </div>
                <div 
                  className={`payment-method ${paymentMethod === 'applepay' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('applepay')}
                  onMouseEnter={handleCursorEnter}
                  onMouseLeave={handleCursorLeave}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.843 14.86c-.526.257-1.397.643-2.186.643-.883 0-1.782-.41-2.457-1.127-.676.717-1.575 1.127-2.458 1.127-.79 0-1.66-.386-2.186-.643-.68-.33-1.077-1.082-1.077-1.848v-.812c0-.528.23-1.018.618-1.353.486-.418 1.126-.645 1.796-.645.748 0 1.488.29 2.067.828.58-.537 1.32-.828 2.068-.828.67 0 1.31.227 1.795.645.39.335.62.825.62 1.353v.812c0 .766-.398 1.517-1.078 1.848zm-1.89-6.388c-.62.457-1.442.71-2.285.71s-1.665-.253-2.285-.71c-.742-.547-1.185-1.427-1.185-2.352 0-.916.43-1.782 1.157-2.327C10.024 5.3 10.96 5 11.954 5c.995 0 1.93.3 2.6.893.727.545 1.157 1.41 1.157 2.327 0 .925-.443 1.805-1.185 2.352z"/>
                  </svg>
                  Pay
                </div>
              </div>

              {paymentMethod === 'card' && (
                <>
                  <div className="modal-input-group">
                    <label>Email Address</label>
                    <input type="email" className="modal-input" placeholder="elon@spacex.com" required />
                  </div>
                  <div className="modal-input-group">
                    <label>Card Information</label>
                    <input type="text" className="modal-input" placeholder="**** **** **** 4242" required />
                  </div>
                </>
              )}
              
              {paymentMethod === 'paypal' && (
                <div className="payment-redirect-msg">
                  <p>You will be redirected to PayPal to complete your purchase securely.</p>
                </div>
              )}

              {paymentMethod === 'applepay' && (
                <div className="payment-redirect-msg">
                  <p>Complete payment using your Apple device.</p>
                </div>
              )}

              <button 
                type="submit" 
                className={`modal-submit ${isProcessing ? 'processing' : ''}`}
                onMouseEnter={handleCursorEnter}
                onMouseLeave={handleCursorLeave}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Initialize Subscription'}
              </button>
            </form>
            
            <div className="modal-trust">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0110 0v4"></path>
              </svg>
              Secured by 256-bit Stripe Neural Encryption
            </div>
          </div>
        </div>
      )}
    </div>
  );
}