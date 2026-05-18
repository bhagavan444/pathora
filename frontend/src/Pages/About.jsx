import React, { useEffect, useRef, memo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Footer from '../components/Footer';
import './About.css';

// Throttled custom cursor logic
const CustomCursor = () => {
  const cursorRef = useRef(null);
  
  useEffect(() => {
    // Only apply on fine pointer devices (desktop)
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let requestRef;
    let mouse = { x: -100, y: -100 };
    let pos = { x: -100, y: -100 };
    const speed = 0.2; // Interpolation speed

    const updateMouse = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const updateLoop = () => {
      pos.x += (mouse.x - pos.x) * speed;
      pos.y += (mouse.y - pos.y) * speed;
      
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      }
      
      // Determine if hovered on an interactive element
      const target = document.elementFromPoint(mouse.x, mouse.y);
      if (target && (target.closest('button') || target.closest('a') || target.closest('.about-interactive'))) {
        cursorRef.current.classList.add('cursor-hover');
      } else if (cursorRef.current) {
        cursorRef.current.classList.remove('cursor-hover');
      }

      requestRef = requestAnimationFrame(updateLoop);
    };

    window.addEventListener("mousemove", updateMouse, { passive: true });
    requestRef = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener("mousemove", updateMouse);
      cancelAnimationFrame(requestRef);
    };
  }, []);

  return (
    <>
      <div 
        ref={cursorRef} 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary)',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'difference',
          transform: 'translate3d(-100px, -100px, 0)',
          willChange: 'transform',
          marginLeft: '-10px',
          marginTop: '-10px',
          transition: 'width 0.3s, height 0.3s, background-color 0.3s'
        }}
        className="about-custom-cursor"
      />
      <style>{`
        @media (pointer: fine) {
          .about-page-container * {
            cursor: none !important;
          }
        }
        .cursor-hover {
          width: 40px !important;
          height: 40px !important;
          margin-left: -20px !important;
          margin-top: -20px !important;
          background-color: rgba(255, 255, 255, 0.2) !important;
          backdrop-filter: blur(4px);
        }
      `}</style>
    </>
  );
};

// Reusable Section Wrapper
const FadeSection = memo(({ children, className = "", style = {} }) => (
  <motion.section 
    className={`about-section ${className}`}
    style={style}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-10%" }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.section>
));

// Reusable Metric Card
const MetricCard = memo(({ metric, label, delay = 0 }) => (
  <motion.div 
    className="about-glass-card about-interactive"
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
  >
    <div className="about-metric-value">{metric}</div>
    <div className="about-metric-label">{label}</div>
  </motion.div>
));

// Reusable Feature Card
const FeatureCard = memo(({ title, desc, features, delay = 0 }) => (
  <motion.div 
    className="about-glass-card about-interactive"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
  >
    <h3 style={{ fontSize: '1.4rem', fontWeight: '600', marginBottom: '16px', color: 'var(--primary)' }}>
      {title}
    </h3>
    <p style={{ fontSize: '1rem', color: 'var(--primary-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
      {desc}
    </p>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {features.map((feature, idx) => (
        <li key={idx} style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          fontSize: '0.9rem', 
          color: 'var(--primary-dim)', 
          marginBottom: '8px' 
        }}>
          <span style={{ color: 'var(--accent)' }}>✦</span>
          {feature}
        </li>
      ))}
    </ul>
  </motion.div>
));

function About() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  
  return (
    <div className="about-page-container">
      <CustomCursor />
      <div className="about-ambient-glow" />

      {/* Hero Section */}
      <section className="about-section" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="about-badge">Enterprise Career Intelligence</div>
            <h1 className="about-title">
              AI-powered career infrastructure<br/>for modern organizations
            </h1>
            <p className="about-subtitle" style={{ marginBottom: '40px' }}>
              Pathora transforms fragmented career planning into quantified readiness
              indicators through advanced natural language processing and skills intelligence.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button className="about-btn-primary">View Documentation</button>
              <button className="about-btn-secondary">Contact Sales</button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Metrics */}
      <FadeSection>
        <div className="about-grid-4">
          {[
            { metric: "98.7%", label: "ATS Compatibility" },
            { metric: "15ms", label: "Avg. Analysis Latency" },
            { metric: "200K+", label: "Skills Mapped" },
            { metric: "SOC 2", label: "Type II Certified" },
          ].map((item, i) => (
            <MetricCard key={i} metric={item.metric} label={item.label} delay={i * 0.1} />
          ))}
        </div>
      </FadeSection>

      {/* Problem Statement */}
      <FadeSection>
        <div className="about-section-header">
          <div className="about-badge">The Challenge</div>
          <h2 className="about-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Career planning infrastructure is fundamentally broken
          </h2>
        </div>
        
        <div className="about-grid-2">
          {[
            { stat: "73%", desc: "of organizations lack structured career development frameworks" },
            { stat: "6.2hrs", desc: "average time spent per resume review without automation" },
            { stat: "$4.2B", desc: "annual cost of skill misalignment in US tech sector alone" },
            { stat: "41%", desc: "of professionals report unclear career progression paths" },
          ].map((item, i) => (
            <motion.div 
              key={i}
              className="about-glass-card about-interactive"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div style={{ fontSize: '2.5rem', fontWeight: '300', color: 'var(--accent)', marginBottom: '16px' }}>
                {item.stat}
              </div>
              <p style={{ color: 'var(--primary-muted)', lineHeight: '1.6' }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </FadeSection>

      {/* Solution Framework */}
      <FadeSection>
        <div className="about-section-header text-center" style={{ textAlign: 'center' }}>
          <div className="about-badge">Our Approach</div>
          <h2 className="about-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Enterprise-grade career intelligence
          </h2>
          <p className="about-subtitle" style={{ margin: '0 auto' }}>
            Built on production-scale NLP pipelines and multi-domain skills taxonomy
            with real-time ATS alignment scoring.
          </p>
        </div>

        <div className="about-grid-3">
          {[
            {
              title: "Resume Intelligence",
              desc: "NLP-powered skill extraction with contextual weighting. Parses unstructured data into structured competency graphs.",
              features: ["Multi-format parsing", "ATS keyword mapping", "Confidence scoring"],
            },
            {
              title: "Skills Graph Engine",
              desc: "Proprietary taxonomy covering 12,000+ technical and soft skills with relationship mapping.",
              features: ["Domain-specific clusters", "Prerequisite chains", "Market demand signals"],
            },
            {
              title: "Readiness Analytics",
              desc: "Quantified career readiness indicators aligned with industry hiring standards and role requirements.",
              features: ["Gap analysis", "Learning pathways", "Timeline projections"],
            },
          ].map((item, i) => (
            <FeatureCard key={i} {...item} delay={i * 0.15} />
          ))}
        </div>
      </FadeSection>

      {/* Architecture */}
      <FadeSection>
        <div className="about-section-header">
          <div className="about-badge">Technical Infrastructure</div>
          <h2 className="about-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Built for scale and reliability
          </h2>
        </div>

        <div className="about-grid-2" style={{ marginBottom: '64px' }}>
          {[
            { layer: "Frontend", stack: ["React 18", "Framer Motion", "WebSocket"], desc: "Type-safe component architecture with real-time state sync" },
            { layer: "API Layer", stack: ["Flask", "RESTful", "JSON Schema"], desc: "Stateless microservices with OpenAPI documentation" },
            { layer: "AI Pipeline", stack: ["spaCy", "Transformers", "Vector DB"], desc: "Multi-stage processing with skill entity recognition" },
            { layer: "Data Layer", stack: ["PostgreSQL", "Redis", "S3"], desc: "Normalized schema with hot-path optimization" },
          ].map((item, i) => (
            <motion.div 
              key={i}
              className="about-glass-card about-interactive"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.05em' }}>
                {item.layer}
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {item.stack.map(tech => (
                  <span key={tech} style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '0.8rem', border: '1px solid var(--border-light)' }}>
                    {tech}
                  </span>
                ))}
              </div>
              <p style={{ color: 'var(--primary-muted)', fontSize: '0.95rem' }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Interactive Architecture Visualization */}
        <div style={{ padding: '60px 40px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            {["Client Layer", "API Gateway", "Processing Engine", "Data Layer"].map((layer, i, arr) => (
              <React.Fragment key={layer}>
                <motion.div 
                  className="about-architecture-node about-interactive"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                >
                  <div style={{ fontWeight: '500', color: 'var(--primary-dim)' }}>{layer}</div>
                </motion.div>
                {i < arr.length - 1 && (
                  <div className="about-arch-line" style={{ display: typeof window !== 'undefined' && window.innerWidth < 768 ? 'none' : 'block' }}>
                    <motion.div 
                      className="about-arch-particle"
                      animate={{ x: ["-100%", "500%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </FadeSection>

      {/* Roadmap */}
      <FadeSection>
        <div className="about-section-header">
          <div className="about-badge">Product Roadmap</div>
          <h2 className="about-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Continuous innovation pipeline
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {[
            { quarter: "Q2 2026", status: "In Development", items: ["Multi-language resume parsing (Spanish, Mandarin, Hindi)", "Real-time collaborative skill mapping", "Enhanced security: E2EE for sensitive data"] },
            { quarter: "Q3 2026", status: "Planned", items: ["Role-specific interview simulation engine", "Integration with major ATS platforms (Greenhouse, Lever)", "Career trajectory forecasting models"] },
            { quarter: "Q4 2026", status: "Research", items: ["Personalized learning pathway generator", "Team composition and skill diversity analytics", "Industry benchmark comparison dashboard"] },
          ].map((phase, i) => (
            <motion.div 
              key={i}
              className="about-glass-card about-interactive"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}
            >
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '500', marginBottom: '8px' }}>{phase.quarter}</div>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.05em', fontWeight: '600' }}>{phase.status}</div>
              </div>
              <div>
                {phase.items.map((item, j) => (
                  <div key={j} style={{ position: 'relative', paddingLeft: '24px', marginBottom: '12px', color: 'var(--primary-muted)', fontSize: '0.95rem' }}>
                    <span style={{ position: 'absolute', left: 0, color: 'var(--primary-dim)' }}>•</span>
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </FadeSection>

      {/* Founder Section */}
      <FadeSection>
        <div className="about-grid-2" style={{ alignItems: 'center', gap: '64px' }}>
          <div>
            <div className="about-badge">Founded By</div>
            <h2 className="about-title" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', marginBottom: '24px' }}>
              G S S S Bhagavan
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--primary-muted)', lineHeight: '1.7', marginBottom: '32px' }}>
              Built Pathora to solve the systemic inefficiency in career infrastructure
              through structured decision-support systems and quantifiable readiness metrics.
            </p>
            
            <div className="about-glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
              <div style={{ marginBottom: '12px', color: 'var(--primary-dim)', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Background:</span> Full-stack development, NLP systems, product design
              </div>
              <div style={{ color: 'var(--primary-dim)', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Focus:</span> Enterprise AI infrastructure, career intelligence platforms
              </div>
            </div>

            <blockquote style={{ fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--primary-muted)', borderLeft: '3px solid var(--accent)', paddingLeft: '24px', margin: '0' }}>
              "Career decisions shouldn't be guesswork. We're building the infrastructure
              to make career planning as data-driven as financial planning."
            </blockquote>
          </div>

          <div className="about-glass-card" style={{ padding: '48px' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '32px' }}>
              Technical Expertise
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {[
                "React & Modern JavaScript Ecosystem",
                "Flask & Python Backend Systems",
                "NLP & Machine Learning Pipelines",
                "Enterprise UX & Design Systems",
                "ATS & Hiring System Architecture",
              ].map((skill, i) => (
                <div key={i} style={{ position: 'relative', paddingLeft: '32px', color: 'var(--primary-dim)', fontSize: '1.05rem' }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--accent)', top: '2px' }}>✦</span>
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeSection>

      {/* CTA Section */}
      <FadeSection style={{ textAlign: 'center', paddingBottom: '160px' }}>
        <h2 className="about-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '24px' }}>
          Ready to transform your<br/>career infrastructure?
        </h2>
        <p className="about-subtitle" style={{ margin: '0 auto 48px' }}>
          Join organizations building data-driven career development programs with Pathora.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="about-btn-primary">Schedule Demo</button>
          <button className="about-btn-secondary">View Documentation</button>
        </div>
      </FadeSection>

      <Footer />
    </div>
  );
}

export default About;