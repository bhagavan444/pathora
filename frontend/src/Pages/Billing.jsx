import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CreditCard, Activity, Database, Users, ChevronRight, BarChart3, Clock } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import { LiquidGlassFooter } from "./HomeComponents.jsx";

const UsageCard = ({ title, icon: Icon, value, limit, type, delay = 0 }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = parseFloat(value.toString().replace(/,/g, ''));
    if (start === end) return;
    
    let totalDuration = 1500;
    let incrementTime = (totalDuration / end);
    let timer = setInterval(() => {
      start += (end / 30); // 30 steps
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 50);
    return () => clearInterval(timer);
  }, [value]);

  const percentage = limit && limit !== "Unlimited" ? Math.min((count / limit) * 100, 100) : 0;
  
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }} style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(24px)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 20, padding: 24, boxShadow: "0 12px 32px rgba(0,0,0,0.03)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(0,0,0,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon size={16} color="var(--tp)" />
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ts)" }}>{title}</span>
        </div>
      </div>
      
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: limit ? 16 : 0 }}>
        <span style={{ fontSize: 32, fontWeight: 700, fontFamily: "var(--sans)", color: "var(--tp)", letterSpacing: "-0.02em" }}>
          {type === "percentage" ? `${count.toFixed(1)}%` : count.toLocaleString()}
        </span>
        {limit && (
          <span style={{ fontSize: 13, color: "var(--tm)", fontFamily: "var(--mono)" }}>/ {limit === "Unlimited" ? "∞" : limit}</span>
        )}
      </div>

      {limit && limit !== "Unlimited" && (
        <div style={{ height: 6, background: "rgba(0,0,0,0.04)", borderRadius: 100, overflow: "hidden" }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 1.5, delay: delay + 0.2 }} style={{ height: "100%", background: percentage > 90 ? "var(--accent)" : "var(--tp)", borderRadius: 100 }} />
        </div>
      )}
    </motion.div>
  );
};

export default function Billing() {
  const navigate = useNavigate();
  const [tier, setTier] = useState("Explorer");
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedTier = localStorage.getItem("pathora_tier");
    const subData = localStorage.getItem("pathora_subscription");
    if (storedTier) setTier(storedTier);
    if (subData) {
      try {
        setSubscription(JSON.parse(subData));
      } catch (e) {}
    }
  }, []);

  const limits = {
    "Explorer": { evals: 5, vectors: 30, exports: 0 },
    "Engineer": { evals: 100, vectors: 500, exports: 10 },
    "Architect": { evals: "Unlimited", vectors: "Unlimited", exports: "Unlimited" },
    "Enterprise Infrastructure": { evals: "Unlimited", vectors: "Unlimited", exports: "Unlimited" }
  };

  const usage = {
    evals: tier === "Explorer" ? 3 : (tier === "Engineer" ? 84 : 124),
    vectors: tier === "Explorer" ? 14 : (tier === "Engineer" ? 430 : 1284),
    exports: tier === "Explorer" ? 0 : (tier === "Engineer" ? 7 : 14),
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "var(--bg)", paddingTop: 100, paddingBottom: 60 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 400, fontFamily: "var(--display)", color: "var(--tp)", marginBottom: 8 }}>Infrastructure Billing</h1>
              <p style={{ fontSize: 14, color: "var(--ts)" }}>Manage your subscription and view orchestration usage.</p>
            </div>
            
            {subscription && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.7)", padding: "8px 16px", borderRadius: 100, border: "1px solid rgba(0,0,0,0.06)" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
                <span style={{ fontSize: 13, fontFamily: "var(--mono)", color: "var(--tp)", fontWeight: 600 }}>{tier} Active</span>
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, marginBottom: 40 }}>
            <UsageCard title="Evaluations Processed" icon={Activity} value={usage.evals} limit={limits[tier]?.evals} delay={0} />
            <UsageCard title="Vector Mappings" icon={Database} value={usage.vectors} limit={limits[tier]?.vectors} delay={0.1} />
            <UsageCard title="Infrastructure Stability" icon={BarChart3} value={99.98} type="percentage" delay={0.2} />
            <UsageCard title="Recruiter Simulations" icon={Users} value={92} limit={tier === "Explorer" ? 0 : (tier === "Engineer" ? 100 : "Unlimited")} delay={0.3} />
          </div>

          <div style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(24px)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 24, overflow: "hidden" }}>
            <div style={{ padding: "24px 32px", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <CreditCard size={20} color="var(--tp)" />
                <span style={{ fontSize: 15, fontWeight: 600, color: "var(--tp)" }}>Current Plan</span>
              </div>
              <button onClick={() => navigate("/plans")} style={{ padding: "8px 16px", background: "#0f0f0f", color: "#fff", border: "none", borderRadius: 100, fontSize: 12, fontWeight: 600, fontFamily: "var(--sans)", cursor: "pointer", transition: "background 0.3s" }} onMouseEnter={e => e.target.style.background = "#1a1a1a"} onMouseLeave={e => e.target.style.background = "#0f0f0f"}>
                Upgrade Tier
              </button>
            </div>
            <div style={{ padding: "32px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
              <div>
                <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--tm)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>Tier Level</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "var(--tp)" }}>{tier} Infrastructure</div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--tm)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>Billing Cycle</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "var(--tp)", textTransform: "capitalize" }}>{subscription?.billing || "Monthly"}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--tm)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>Next Invoice</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "var(--tp)" }}>
                  {subscription ? new Date(new Date(subscription.activatedAt).getTime() + 30*24*60*60*1000).toLocaleDateString() : "N/A"}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <LiquidGlassFooter />
    </>
  );
}
