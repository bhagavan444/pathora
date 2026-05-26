import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { RevealSection, LiquidGlassFooter } from "./HomeComponents";
import { Check, Terminal, Cpu, Activity, Zap, Server, X, ArrowRight, Lock, Shield } from "lucide-react";
import "./Home.css";

const PLANS = [
  {
    name: "Explorer",
    desc: "Baseline deterministic infrastructure for evaluating engineering profiles.",
    monthly: "Free",
    annual: "Free",
    cta: "Launch Evaluation Node",
    secondaryLinks: [{ label: "View Compute Limits", to: "#explorer-limits" }],
    features: [
      "5 evaluations / month",
      "Limited vector mapping",
      "Basic recruiter engine",
      "Standard telemetry access"
    ],
    telemetry: [
      { label: "Compute Quota", value: 20, color: "var(--tm)", active: false },
      { label: "Recruiter Engine", value: 10, color: "var(--tm)", active: false }
    ],
    statusLabel: "BASELINE NODE",
    color: "var(--tp)",
    badge: null,
    cardClass: "card-infrastructure"
  },
  {
    name: "Engineer",
    desc: "Advanced capability scoring and genome tracking for professional engineers.",
    monthly: "$12/mo",
    annual: "$10/mo",
    cta: "Upgrade Infrastructure",
    secondaryLinks: [
      { label: "Compare Engine Access", to: "/docs" },
      { label: "Preview Recruiter Intelligence", to: "/docs" }
    ],
    features: [
      "100 evaluations / month",
      "Advanced genome mapping",
      "Recruiter trust engine enabled",
      "Export system active",
      "Roadmap DAG access"
    ],
    telemetry: [
      { label: "Priority Routing", value: 60, color: "var(--accent)", active: true },
      { label: "Sim Depth: Med", value: 55, color: "var(--accent)", active: true }
    ],
    statusLabel: "PRODUCTION NODE",
    color: "var(--accent)",
    badge: "MOST DEPLOYED • Engineering Standard Tier",
    cardClass: "card-infrastructure card-cinematic-active"
  },
  {
    name: "Architect",
    desc: "Complete evaluation ecosystem with advanced orchestration compute.",
    monthly: "$29/mo",
    annual: "$24/mo",
    cta: "Deploy Intelligence Layer",
    secondaryLinks: [
      { label: "View Orchestration Capabilities", to: "/docs" },
      { label: "Explore Infrastructure APIs", to: "/docs" }
    ],
    features: [
      "Unlimited evaluations",
      "Architecture sophistication engine",
      "Production readiness engine",
      "Orchestration analytics",
      "Advanced telemetry exports"
    ],
    telemetry: [
      { label: "Distributed Access", value: 90, color: "#818cf8", active: true },
      { label: "Orch Priority: High", value: 85, color: "#818cf8", active: true }
    ],
    statusLabel: "ADVANCED CLUSTER",
    color: "var(--accent2)",
    badge: "INFRASTRUCTURE READY • Advanced Orchestration Access",
    cardClass: "card-infrastructure card-shimmer"
  },
  {
    name: "Enterprise Infrastructure",
    desc: "Distributed intelligence pipelines for teams and recruitment organizations.",
    monthly: "Custom",
    annual: "Custom",
    cta: "Contact Infrastructure Team",
    secondaryLinks: [
      { label: "Request Enterprise Demo", to: "#enterprise-demo" },
      { label: "View Organization Capabilities", to: "/docs" }
    ],
    features: [
      "Distributed recruiter pipelines",
      "Batch evaluation orchestration",
      "Dedicated infrastructure nodes",
      "Candidate telemetry pipelines",
      "SLA-backed orchestration"
    ],
    telemetry: [
      { label: "Dedicated Nodes", value: 100, color: "var(--success)", active: true },
      { label: "SLA Coverage", value: 100, color: "var(--success)", active: true }
    ],
    statusLabel: "DEDICATED CLUSTER",
    color: "var(--success)",
    badge: null,
    cardClass: "card-infrastructure"
  }
];

const TIER_ORDER = ["Explorer", "Engineer", "Architect", "Enterprise Infrastructure"];

export default function Plans() {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(true);
  const [activeTier, setActiveTier] = useState(null);
  const [showEnterpriseModal, setShowEnterpriseModal] = useState(false);
  const [showExplorerModal, setShowExplorerModal] = useState(false);
  const [enterpriseSubmitted, setEnterpriseSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const stored = localStorage.getItem("pathora_tier");
    if (stored) setActiveTier(stored);
  }, []);

  const handlePlanCTA = (plan, i) => {
    if (i === 0) {
      // Explorer — show evaluation modal
      setShowExplorerModal(true);
    } else if (i === 3) {
      // Enterprise — open consultation modal
      setShowEnterpriseModal(true);
    } else {
      // Engineer / Architect — route to checkout
      navigate(`/checkout?tier=${plan.name}&annual=${isAnnual}`);
    }
  };

  const handleLaunchExplorer = () => {
    localStorage.setItem("pathora_tier", "Explorer");
    localStorage.setItem("pathora_subscription", JSON.stringify({ tier: "Explorer", status: "active", billing: "free", activatedAt: new Date().toISOString() }));
    localStorage.setItem("pathora_api_token", `pnx_eval_${Math.random().toString(36).substring(2,15)}`);
    navigate("/subscription");
  };

  const isCurrentPlan = (planName) => activeTier === planName;
  const isDowngrade = (planName) => {
    if (!activeTier) return false;
    return TIER_ORDER.indexOf(planName) < TIER_ORDER.indexOf(activeTier);
  };

  return (
    <div className="home-wrap">
      <div className="grid-bg" />

      {/* Floating Telemetry Environment */}
      <div style={{ position: "absolute", top: 120, left: "5%", zIndex: 0, opacity: 0.7 }}>
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "rgba(255,255,255,0.4)", backdropFilter: "blur(12px)", borderRadius: 12, border: "1px solid rgba(0,0,0,0.04)" }}>
          <Activity size={12} color="var(--accent)" />
          <span style={{ fontSize: 10, fontFamily: "var(--mono)", color: "var(--tm)", fontWeight: 600 }}>LATENCY: 14ms</span>
        </motion.div>
      </div>
      <div style={{ position: "absolute", top: 180, right: "8%", zIndex: 0, opacity: 0.7 }}>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "rgba(255,255,255,0.4)", backdropFilter: "blur(12px)", borderRadius: 12, border: "1px solid rgba(0,0,0,0.04)" }}>
          <Server size={12} color="var(--success)" />
          <span style={{ fontSize: 10, fontFamily: "var(--mono)", color: "var(--tm)", fontWeight: 600 }}>ORCHESTRATION: ONLINE</span>
        </motion.div>
      </div>

      {/* Hero Section */}
      <section className="hero-sec" style={{ paddingTop: "140px", paddingBottom: "60px", minHeight: "auto", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 2 }}
          style={{ position:"absolute",top:"10%",left:"50%",transform:"translateX(-50%)",width:"60vw",height:"60vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(129,140,248,.08) 0%,transparent 60%)", filter: "blur(60px)", pointerEvents:"none", zIndex: 0 }} 
        />
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: "relative", zIndex: 1, maxWidth: 800 }}
        >
          <div className="hero-badge" style={{ margin: "0 auto 24px" }}>
            <span className="hero-badge-tag">COMPUTE ACCESS TIERS</span>
          </div>
          <h1 className="hero-h1" style={{ maxWidth: "100%", margin: "0 auto 24px", letterSpacing: "-0.04em" }}>
            Evaluation Infrastructure <em>Access.</em>
          </h1>
          <p className="hero-sub" style={{ margin: "0 auto 40px", maxWidth: 600 }}>
            Deploy deterministic engineering intelligence to evaluate, track, and benchmark technical maturity. Scale from individual profiling to enterprise orchestration.
          </p>

          {/* Billing Toggle */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginTop: 40 }}>
            <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.6)", backdropFilter: "blur(20px)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 100, padding: 4, position: "relative" }}>
              <div 
                style={{ position: "absolute", top: 4, bottom: 4, left: isAnnual ? "50%" : 4, width: "calc(50% - 4px)", background: "#fff", borderRadius: 100, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)", zIndex: 0 }}
              />
              <button 
                onClick={() => setIsAnnual(false)}
                style={{ position: "relative", zIndex: 1, width: 120, padding: "8px 0", background: "transparent", border: "none", fontSize: 13, fontWeight: 600, fontFamily: "var(--sans)", color: !isAnnual ? "var(--tp)" : "var(--tm)", cursor: "pointer", transition: "color 0.4s" }}
              >
                Monthly
              </button>
              <button 
                onClick={() => setIsAnnual(true)}
                style={{ position: "relative", zIndex: 1, width: 120, padding: "8px 0", background: "transparent", border: "none", fontSize: 13, fontWeight: 600, fontFamily: "var(--sans)", color: isAnnual ? "var(--tp)" : "var(--tm)", cursor: "pointer", transition: "color 0.4s" }}
              >
                Annually
              </button>
            </div>
            <AnimatePresence mode="wait">
              {isAnnual && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--accent)", fontWeight: 600 }}>
                  2 months infrastructure credit included
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <RevealSection className="sec" style={{ paddingTop: 0 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {PLANS.map((plan, i) => {
              const isCurrent = isCurrentPlan(plan.name);
              const isLower = isDowngrade(plan.name);
              const isShimmer = i === 2; // Architect
              return (
              <motion.div 
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={plan.cardClass}
                style={{
                  opacity: isLower ? 0.6 : 1,
                  pointerEvents: isCurrent ? "none" : "auto"
                }}
              >
                {plan.badge && (
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, background: plan.color, color: "#fff", fontSize: 9, fontWeight: 700, padding: "6px 16px", textTransform: "uppercase", letterSpacing: ".1em", textAlign: "center" }}>
                    {plan.badge}
                  </div>
                )}
                
                {isCurrent && (
                  <div style={{ position: "absolute", top: plan.badge ? 28 : 16, right: 16, display: "flex", alignItems: "center", gap: 6, background: isShimmer ? "rgba(16, 185, 129, 0.2)" : "rgba(16, 185, 129, 0.1)", padding: "4px 10px", borderRadius: 100 }}>
                    <div className="pulse-green" style={{ width: 6, height: 6, borderRadius: "50%" }} />
                    <span style={{ fontSize: 10, fontFamily: "var(--mono)", fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: ".05em" }}>Deployed</span>
                  </div>
                )}

                {i === 2 && !isCurrent && (
                   <div style={{ position: "absolute", top: plan.badge ? 28 : 16, right: 16, display: "flex", alignItems: "center", gap: 6, background: "rgba(129, 140, 248, 0.15)", padding: "4px 10px", borderRadius: 100, border: "1px solid rgba(129, 140, 248, 0.3)" }}>
                   <div className="pulse-purple" style={{ width: 6, height: 6, borderRadius: "50%" }} />
                   <span style={{ fontSize: 10, fontFamily: "var(--mono)", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: ".05em" }}>Ready</span>
                 </div>
                )}
                
                <div style={{ marginTop: plan.badge ? 24 : 0, display: "flex", flexDirection: "column", height: "100%" }}>
                  <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: isShimmer ? "rgba(255,255,255,0.6)" : "var(--tm)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12, fontWeight: 600 }}>
                    {plan.statusLabel}
                  </div>
                  <div style={{ fontSize: 36, fontFamily: "var(--sans)", fontWeight: 700, color: isShimmer ? "#fff" : "var(--tp)", marginBottom: 12, letterSpacing: "-0.04em" }}>
                    {isAnnual ? plan.annual : plan.monthly}
                  </div>
                  <div style={{ fontSize: 13, color: isShimmer ? "rgba(255,255,255,0.7)" : "var(--ts)", lineHeight: 1.6, marginBottom: 24, minHeight: 42 }}>
                    {plan.desc}
                  </div>
                  
                  {/* Telemetry Visuals */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32, padding: "16px", background: isShimmer ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.02)", borderRadius: 12, border: `1px solid ${isShimmer ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.04)"}` }}>
                    {plan.telemetry.map((t, tIdx) => (
                      <div key={tIdx}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontFamily: "var(--mono)", color: isShimmer ? "rgba(255,255,255,0.8)" : "var(--ts)", fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>
                          <span>{t.label}</span>
                          <span className={t.active ? "telemetry-pulse-animate" : ""}>{t.value}%</span>
                        </div>
                        <div className="telemetry-bar-wrap">
                          <div className="telemetry-bar-fill" style={{ width: `${t.value}%`, background: t.color, color: t.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40, flex: 1 }}>
                    {plan.features.map((f, fIdx) => {
                      const locked = isLower || (activeTier === "Explorer" && i > 0 && fIdx > 1);
                      return (
                        <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 12, opacity: locked ? 0.4 : 1 }}>
                          <div style={{ width: 16, height: 16, borderRadius: "50%", background: locked ? (isShimmer ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)") : (isShimmer ? "rgba(255,255,255,0.15)" : "rgba(129, 140, 248, 0.1)"), color: locked ? (isShimmer ? "rgba(255,255,255,0.4)" : "var(--tm)") : (isShimmer ? "#fff" : "var(--accent)"), display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
                            {locked ? <Lock size={8} strokeWidth={3} /> : <Check size={10} strokeWidth={3} />}
                          </div>
                          <span style={{ fontSize: 13, color: isShimmer ? "#fff" : "var(--tp)", fontWeight: 500 }}>{f}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {plan.secondaryLinks.map((link, lIdx) => (
                      <a key={lIdx} href={link.to} onClick={(e) => { e.preventDefault(); if(link.to === "#enterprise-demo") setShowEnterpriseModal(true); }} className="link-reveal" style={{ alignSelf: "flex-start" }}>
                        <span>{link.label}</span>
                        <ArrowRight size={12} className="link-arrow" />
                      </a>
                    ))}
                  </div>
                  
                  <button 
                    className={i === 2 || i === 1 ? "btn-glass-primary" : "btn-glass-outline"} 
                    style={{ width: "100%", justifyContent: "center", opacity: isCurrent ? 0.5 : 1, marginTop: 24, border: isShimmer ? "1px solid rgba(255,255,255,0.2)" : undefined }}
                    onClick={() => handlePlanCTA(plan, i)}
                  >
                    {isCurrent ? "Deployed Layer" : plan.cta}
                    {!(i === 2 || i === 1) && <ArrowRight size={14} className="cta-arrow" />}
                  </button>
                </div>
              </motion.div>
              );
            })}
          </div>
        </div>
      </RevealSection>

      {/* Why Upgrade Section */}
      <RevealSection className="sec" style={{ paddingTop: 0 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          <div style={{ background: "rgba(255,255,255,0.5)", backdropFilter: "blur(24px)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 24, padding: 32, position: "relative", overflow: "hidden" }}>
            <div style={{ fontSize: 10, fontFamily: "var(--mono)", color: "var(--tm)", textTransform: "uppercase", letterSpacing: ".12em", fontWeight: 700, marginBottom: 16 }}>Explorer Tier</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {["5 evaluations / month", "Basic recruiter scan", "No API access", "CSV exports only", "7-day telemetry retention"].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--tm)" }} />
                  <span style={{ fontSize: 13, color: "var(--ts)" }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: "linear-gradient(135deg, rgba(129,140,248,0.06), rgba(99,102,241,0.03))", backdropFilter: "blur(24px)", border: "1px solid rgba(129,140,248,0.15)", borderRadius: 24, padding: 32, position: "relative", overflow: "hidden" }}>
            <div style={{ fontSize: 10, fontFamily: "var(--mono)", color: "var(--accent)", textTransform: "uppercase", letterSpacing: ".12em", fontWeight: 700, marginBottom: 16 }}>Architect Tier</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {["Unlimited evaluations", "Elite recruiter trust mapping", "REST API + webhook integrations", "Orchestration depth scoring", "1-year telemetry retention"].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent)" }} />
                  <span style={{ fontSize: 13, color: "var(--tp)", fontWeight: 500 }}>{f}</span>
                </div>
              ))}
            </div>
            <button className="btn-glass-primary" style={{ marginTop: 24, width: "100%", justifyContent: "center" }} onClick={() => navigate(`/checkout?tier=Architect&annual=${isAnnual}`)}>
              Upgrade to Architect <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </RevealSection>

      {/* Enterprise Architecture scale */}
      <RevealSection className="sec" style={{ paddingTop: 0 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(24px)", borderRadius: 32, border: "1px solid rgba(0,0,0,0.06)", padding: "60px 40px", textAlign: "center", boxShadow: "0 12px 40px rgba(0,0,0,0.03)" }}>
          <h2 style={{ fontSize: 28, fontFamily: "var(--display)", fontWeight: 400, color: "var(--tp)", marginBottom: 16 }}>Built for Scalable Engineering Intelligence</h2>
          <p style={{ fontSize: 15, color: "var(--ts)", maxWidth: 600, margin: "0 auto 40px", lineHeight: 1.6 }}>
            Trusted by top universities, hiring teams, and engineering bootcamps to evaluate talent securely and deterministically at scale.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 40 }}>
            <div>
              <div style={{ fontSize: 32, fontWeight: 700, color: "var(--tp)", fontFamily: "var(--sans)", letterSpacing: "-0.04em" }}>5,000+</div>
              <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--tm)", textTransform: "uppercase", letterSpacing: ".1em", marginTop: 4 }}>Evaluations Processed</div>
            </div>
            <div>
              <div style={{ fontSize: 32, fontWeight: 700, color: "var(--accent)", fontFamily: "var(--sans)", letterSpacing: "-0.04em" }}>99.98%</div>
              <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--tm)", textTransform: "uppercase", letterSpacing: ".1em", marginTop: 4 }}>Infrastructure Uptime</div>
            </div>
            <div>
              <div style={{ fontSize: 32, fontWeight: 700, color: "var(--success)", fontFamily: "var(--sans)", letterSpacing: "-0.04em" }}>1,200+</div>
              <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--tm)", textTransform: "uppercase", letterSpacing: ".1em", marginTop: 4 }}>Engineering Vectors</div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Developer API Section */}
      <RevealSection className="sec" style={{ paddingTop: 0 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <div className="sec-tag" style={{ color: "var(--accent2)" }}>Developer Infrastructure</div>
            <h2 className="sec-title" style={{ fontSize: 32, marginBottom: 20 }}>Orchestrate pipelines via REST.</h2>
            <p className="sec-desc" style={{ fontSize: 15, marginBottom: 32 }}>
              Integrate the Pathora genome engine directly into your existing infrastructure. Access raw telemetry, trigger deterministic evaluations, and extract vector mappings with our enterprise SDK.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}><Terminal size={14} color="var(--accent)"/><span style={{ fontSize: 14, color: "var(--ts)", fontWeight: 500 }}>POST /v1/evaluate</span></div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}><Activity size={14} color="var(--accent)"/><span style={{ fontSize: 14, color: "var(--ts)", fontWeight: 500 }}>GET /v1/telemetry</span></div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}><Zap size={14} color="var(--accent)"/><span style={{ fontSize: 14, color: "var(--ts)", fontWeight: 500 }}>POST /v1/recruiter/simulate</span></div>
            </div>
            <button className="btn-glass-outline" style={{ marginTop: 40 }} onClick={() => navigate("/docs")}>View API Documentation</button>
          </div>
          <div style={{ background: "#0a0a0c", borderRadius: 24, padding: 32, boxShadow: "0 24px 64px rgba(0,0,0,0.15)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f56" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#27c93f" }} />
            </div>
            <pre style={{ margin: 0, fontFamily: "var(--mono)", fontSize: 13, color: "#a1a1aa", lineHeight: 1.6, overflowX: "auto" }}>
              <span style={{ color: "#818cf8" }}>POST</span> /v1/evaluate{"\n"}
              <span style={{ color: "#34d399" }}>Authorization:</span> Bearer pnx_live_...{"\n"}
              <span style={{ color: "#34d399" }}>Content-Type:</span> application/json{"\n\n"}
              {"{\n"}
              {"  "}<span style={{ color: "#f472b6" }}>"profile_id"</span>: <span style={{ color: "#fcd34d" }}>"usr_942x8v"</span>,{"\n"}
              {"  "}<span style={{ color: "#f472b6" }}>"engine"</span>: <span style={{ color: "#fcd34d" }}>"recruiter_trust_v2"</span>,{"\n"}
              {"  "}<span style={{ color: "#f472b6" }}>"orchestration_depth"</span>: <span style={{ color: "#fcd34d" }}>"architect"</span>,{"\n"}
              {"  "}<span style={{ color: "#f472b6" }}>"return_telemetry"</span>: <span style={{ color: "#818cf8" }}>true</span>{"\n"}
              {"}"}
            </pre>
          </div>
        </div>
      </RevealSection>

      {/* Comparison Table */}
      <RevealSection className="sec" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div className="sec-head" style={{ textAlign: "center" }}>
            <div className="sec-tag" style={{ color: "var(--accent3)" }}>Telemetry Matrices</div>
            <h2 className="sec-title">Architectural Capability Matrix</h2>
          </div>
          
          <div className="compare-table" style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(24px)", borderRadius: 24, padding: "24px 40px", boxShadow: "0 12px 40px rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)" }}>
            <div className="compare-header" style={{ gridTemplateColumns: "2.5fr 1fr 1fr 1fr 1fr", borderBottom: "1px solid rgba(0,0,0,0.08)", paddingBottom: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--tm)", textTransform: "uppercase", letterSpacing: ".1em" }}>Feature Vector</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--tm)", textTransform: "uppercase", letterSpacing: ".1em", textAlign: "center" }}>Explorer</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: ".1em", textAlign: "center" }}>Engineer</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent2)", textTransform: "uppercase", letterSpacing: ".1em", textAlign: "center" }}>Architect</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--success)", textTransform: "uppercase", letterSpacing: ".1em", textAlign: "center" }}>Enterprise</div>
            </div>
            {[
              { f: "Deterministic Parsing", e: "Basic", en: "Advanced", a: "Full", ent: "Custom Model" },
              { f: "Heatmap Intelligence", e: "-", en: "Standard", a: "Advanced", ent: "Custom" },
              { f: "Recruiter Trust Depth", e: "Basic", en: "Simulation", a: "Elite Mapping", ent: "Dedicated Logic" },
              { f: "Architecture Complexity Engine", e: "-", en: "✓", a: "✓", ent: "✓" },
              { f: "Genome Analysis Depth", e: "Limited", en: "Full Vector", a: "Continuous", ent: "Batch Pipelines" },
              { f: "SSE Telemetry Access", e: "-", en: "Standard", a: "Premium", ent: "Priority SLA" },
              { f: "Production Readiness Scoring", e: "-", en: "-", a: "✓", ent: "✓" },
              { f: "API Access", e: "-", en: "-", a: "Standard Rate", ent: "High Throughput" },
              { f: "Export Infrastructure", e: "CSV", en: "JSON / PDF", a: "Webhook Integration", ent: "Direct S3 Pipeline" },
            ].map((row, i) => (
              <div key={row.f} className="compare-row" style={{ gridTemplateColumns: "2.5fr 1fr 1fr 1fr 1fr", borderBottom: i < 8 ? "1px dashed rgba(0,0,0,0.05)" : "none", padding: "16px 0", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.015)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--tp)" }}>{row.f}</div>
                <div style={{ fontSize: 13, color: "var(--ts)", textAlign: "center", fontFamily: "var(--mono)" }}>{row.e}</div>
                <div style={{ fontSize: 13, color: "var(--accent)", textAlign: "center", fontWeight: 600, fontFamily: "var(--mono)" }}>{row.en}</div>
                <div style={{ fontSize: 13, color: "var(--accent2)", textAlign: "center", fontWeight: 600, fontFamily: "var(--mono)" }}>{row.a}</div>
                <div style={{ fontSize: 13, color: "var(--success)", textAlign: "center", fontWeight: 600, fontFamily: "var(--mono)" }}>{row.ent}</div>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      <LiquidGlassFooter />

      {/* Explorer Evaluation Node Modal */}
      <AnimatePresence>
        {showExplorerModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(10, 10, 12, 0.6)", backdropFilter: "blur(12px)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
            onClick={() => setShowExplorerModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{ width: "100%", maxWidth: 440, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(32px)", borderRadius: 24, padding: 40, border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 24px 64px rgba(0,0,0,0.12)", position: "relative" }}
            >
              <button onClick={() => setShowExplorerModal(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "var(--ts)" }}>
                <X size={20} />
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(0, 0, 0, 0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Terminal size={20} color="var(--tp)" />
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: "var(--tp)" }}>Evaluation Node</div>
                  <div style={{ fontSize: 12, color: "var(--ts)" }}>Explorer Compute Quota</div>
                </div>
              </div>

              <p style={{ fontSize: 14, color: "var(--ts)", lineHeight: 1.6, marginBottom: 24 }}>
                You are provisioning a baseline evaluation node. This infrastructure provides limited access to the recruiter engine and 5 evaluations per month.
              </p>

              <div style={{ background: "rgba(0,0,0,0.02)", borderRadius: 12, padding: 16, border: "1px solid rgba(0,0,0,0.04)", marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: "var(--mono)", color: "var(--tm)", marginBottom: 12 }}>
                  <span>Compute</span>
                  <span>5 Evals</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: "var(--mono)", color: "var(--tm)", marginBottom: 12 }}>
                  <span>Vectors</span>
                  <span>Limited Map</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: "var(--mono)", color: "var(--tm)" }}>
                  <span>Telemetry</span>
                  <span>Standard</span>
                </div>
              </div>

              <button onClick={handleLaunchExplorer} style={{ width: "100%", padding: "14px", background: "#0f0f0f", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 600, fontFamily: "var(--sans)", cursor: "pointer" }}>
                Acknowledge & Launch Node
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enterprise Consultation Modal */}
      <AnimatePresence>
        {showEnterpriseModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(10, 10, 12, 0.8)", backdropFilter: "blur(20px)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
            onClick={() => { setShowEnterpriseModal(false); setEnterpriseSubmitted(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{ width: "100%", maxWidth: 580, background: "rgba(20, 20, 24, 0.95)", backdropFilter: "blur(32px)", borderRadius: 24, padding: 40, border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 40px 100px rgba(0,0,0,0.5)", position: "relative" }}
            >
              <button onClick={() => { setShowEnterpriseModal(false); setEnterpriseSubmitted(false); }} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)" }}>
                <X size={20} />
              </button>

              {!enterpriseSubmitted ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(52, 211, 153, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(52, 211, 153, 0.3)" }}>
                      <Shield size={20} color="var(--success)" />
                    </div>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 600, color: "#fff" }}>Infrastructure Consultation</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Enterprise orchestration assessment</div>
                    </div>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); setEnterpriseSubmitted(true); }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <input required type="text" placeholder="Organization Name" style={{ width: "100%", padding: "12px 16px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 14, fontFamily: "var(--sans)", color: "#fff", outline: "none" }} />
                      <input required type="number" placeholder="Organization Size" style={{ width: "100%", padding: "12px 16px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 14, fontFamily: "var(--sans)", color: "#fff", outline: "none" }} />
                    </div>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <input required type="number" placeholder="Recruiter Seats" style={{ width: "100%", padding: "12px 16px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 14, fontFamily: "var(--sans)", color: "#fff", outline: "none" }} />
                      <input required type="number" placeholder="Evaluations / Month" style={{ width: "100%", padding: "12px 16px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 14, fontFamily: "var(--sans)", color: "#fff", outline: "none" }} />
                    </div>

                    <select style={{ width: "100%", padding: "12px 16px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 14, fontFamily: "var(--sans)", color: "#fff", outline: "none", appearance: "none" }}>
                      <option value="" disabled selected hidden>Orchestration Requirements</option>
                      <option style={{color:"black"}}>Batch Processing APIs</option>
                      <option style={{color:"black"}}>Distributed Inference Nodes</option>
                      <option style={{color:"black"}}>Dedicated Infrastructure Cluster</option>
                    </select>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <select style={{ width: "100%", padding: "12px 16px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 14, fontFamily: "var(--sans)", color: "#fff", outline: "none", appearance: "none" }}>
                        <option value="" disabled selected hidden>Telemetry Retention</option>
                        <option style={{color:"black"}}>1 Year Standard</option>
                        <option style={{color:"black"}}>3 Years Compliance</option>
                        <option style={{color:"black"}}>Infinite Enterprise</option>
                      </select>
                      <select style={{ width: "100%", padding: "12px 16px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 14, fontFamily: "var(--sans)", color: "#fff", outline: "none", appearance: "none" }}>
                        <option value="" disabled selected hidden>Infra Scaling Needs</option>
                        <option style={{color:"black"}}>Predictable / Steady</option>
                        <option style={{color:"black"}}>High Elasticity</option>
                        <option style={{color:"black"}}>Global Multi-region</option>
                      </select>
                    </div>

                    <button type="submit" style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, var(--success), #059669)", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 600, fontFamily: "var(--sans)", cursor: "pointer", marginTop: 12, boxShadow: "0 8px 20px rgba(52, 211, 153, 0.2)" }}>
                      Initialize Architecture Review
                    </button>
                  </form>
                </>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", padding: "30px 0" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(52, 211, 153, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", border: "1px solid rgba(52, 211, 153, 0.3)" }}>
                    <Check size={32} color="#10b981" />
                  </div>
                  <h3 style={{ fontSize: 24, fontWeight: 600, color: "#fff", marginBottom: 12 }}>Consultation Queued</h3>
                  <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, maxWidth: 400, margin: "0 auto" }}>
                    The Enterprise infrastructure team has received your evaluation metrics. You will receive an architecture proposal within 24 hours.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}