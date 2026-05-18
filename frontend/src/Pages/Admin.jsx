import React, { useEffect, useState, useRef } from "react";
import { motion, useSpring, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, Radar
} from "recharts";

/* ================= CONFIG ================= */
const ADMIN_EMAIL = "admin@pathora.com";
const ADMIN_PASSWORD = "admin123";
const DOMAINS = ["tech", "data", "ai", "cloud", "business"];
const LEVELS = ["easy", "medium", "hard"];
const COLORS = ["#2563EB", "#10B981", "#F59E0B", "#06B6D4", "#8B5CF6"];

/* ================= MAIN ================= */
export default function Admin() {
  const [auth, setAuth] = useState(localStorage.getItem("ADMIN_TOKEN"));
  if (!auth) return <AdminLogin onAuth={setAuth} />;
  return <AdminDashboard onLogout={() => {
    localStorage.removeItem("ADMIN_TOKEN");
    setAuth(null);
  }} />;
}

/* ================= LOGIN ================= */
function AdminLogin({ onAuth }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", mouseMove);
    return () => window.removeEventListener("mousemove", mouseMove);
  }, []);

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mousePosition.x, springConfig);
  const cursorY = useSpring(mousePosition.y, springConfig);

  const login = () => {
    if (email === ADMIN_EMAIL && pass === ADMIN_PASSWORD) {
      localStorage.setItem("ADMIN_TOKEN", "jwt_mock");
      onAuth("jwt_mock");
    } else {
      alert("Invalid admin credentials");
    }
  };

  return (
    <>
      <MagneticCursor cursorX={cursorX} cursorY={cursorY} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",
          fontFamily: "'Inter', sans-serif",
          cursor: "none",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated Background */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            right: "-10%",
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(60px)",
            animation: "float 20s ease-in-out infinite",
          }}
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(37, 99, 235, 0.2)",
            borderRadius: "24px",
            padding: "60px",
            maxWidth: "450px",
            width: "100%",
            boxShadow: "0 20px 60px rgba(37, 99, 235, 0.15)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px rgba(37, 99, 235, 0.3)",
                  "0 0 40px rgba(37, 99, 235, 0.5)",
                  "0 0 20px rgba(37, 99, 235, 0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: "80px",
                height: "80px",
                background: "linear-gradient(135deg, #2563EB, #3B82F6)",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                fontSize: "36px",
                fontWeight: "900",
                color: "#FFFFFF",
              }}
            >
              PN
            </motion.div>
            <h2 style={{ fontSize: "32px", fontWeight: "800", color: "#1E293B", marginBottom: "8px", fontFamily: "'Brush Script MT', cursive" }}>
              Admin Portal
            </h2>
            <p style={{ color: "#64748B", fontSize: "14px" }}>
              Secure access to Pathora operations
            </p>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#64748B", marginBottom: "8px" }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@pathora.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "14px",
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                color: "#1E293B",
                fontSize: "15px",
                outline: "none",
                transition: "all 0.3s",
              }}
              onFocus={(e) => e.target.style.borderColor = "#2563EB"}
              onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
            />
          </div>

          <div style={{ marginBottom: "32px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#64748B", marginBottom: "8px" }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={pass}
              onChange={e => setPass(e.target.value)}
              style={{
                width: "100%",
                padding: "14px",
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                color: "#1E293B",
                fontSize: "15px",
                outline: "none",
                transition: "all 0.3s",
              }}
              onFocus={(e) => e.target.style.borderColor = "#2563EB"}
              onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
              onKeyPress={(e) => e.key === "Enter" && login()}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(37, 99, 235, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={login}
            style={{
              width: "100%",
              padding: "16px",
              background: "linear-gradient(135deg, #2563EB, #3B82F6)",
              border: "none",
              borderRadius: "12px",
              color: "#FFFFFF",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "none",
              transition: "all 0.3s",
            }}
          >
            Secure Login
          </motion.button>

          <p style={{ textAlign: "center", marginTop: "20px", fontSize: "12px", color: "#94A3B8" }}>
            Protected by enterprise-grade security
          </p>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(20px); }
        }
        * { cursor: none !important; }
      `}</style>
    </>
  );
}

/* ================= MAGNETIC CURSOR ================= */
function MagneticCursor({ cursorX, cursorY, isHovering: propHovering }) {
  const [isHovering, setIsHovering] = useState(false);

  // Use prop hovering state if provided, otherwise use local state
  const hoverState = propHovering !== undefined ? propHovering : isHovering;

  useEffect(() => {
    if (propHovering !== undefined) return; // Skip if controlled by parent

    const updateHoverState = () => {
      const hoverable = document.querySelectorAll('button, a, input, select, textarea, [role="button"]');
      
      const handleMouseEnter = () => setIsHovering(true);
      const handleMouseLeave = () => setIsHovering(false);

      hoverable.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });

      return () => {
        hoverable.forEach(el => {
          el.removeEventListener('mouseenter', handleMouseEnter);
          el.removeEventListener('mouseleave', handleMouseLeave);
        });
      };
    };

    // Initial setup
    const cleanup = updateHoverState();

    // Re-setup after DOM changes
    const observer = new MutationObserver(() => {
      cleanup();
      updateHoverState();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      cleanup();
      observer.disconnect();
    };
  }, [propHovering]);

  return (
    <>
      {/* Main Cursor Ring */}
      <motion.div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "2px solid rgba(37, 99, 235, 0.8)",
          backgroundColor: "rgba(37, 99, 235, 0.1)",
          pointerEvents: "none",
          zIndex: 99999,
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: "difference",
        }}
        animate={{
          scale: hoverState ? 1.8 : 1,
          backgroundColor: hoverState ? "rgba(37, 99, 235, 0.2)" : "rgba(37, 99, 235, 0.1)",
          borderColor: hoverState ? "rgba(37, 99, 235, 1)" : "rgba(37, 99, 235, 0.8)",
        }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      />
      
      {/* Center Dot */}
      <motion.div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: "#2563EB",
          pointerEvents: "none",
          zIndex: 100000,
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ scale: hoverState ? 0 : 1 }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
      />
      
      {/* Outer Trail Ring */}
      <motion.div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "1px solid rgba(37, 99, 235, 0.3)",
          pointerEvents: "none",
          zIndex: 99998,
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: hoverState ? 1.5 : 1,
          opacity: hoverState ? 0.5 : 0.3,
        }}
        transition={{ type: "spring", damping: 15, stiffness: 200 }}
      />
    </>
  );
}

/* ================= DASHBOARD ================= */
function AdminDashboard({ onLogout }) {
  const [questions, setQuestions] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [edit, setEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDomain, setFilterDomain] = useState("all");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toast, setToast] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorHover, setCursorHover] = useState(false);

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", mouseMove);
    return () => window.removeEventListener("mousemove", mouseMove);
  }, []);

  useEffect(() => {
    const addHoverListeners = () => {
      const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [role="button"]');
      
      const handleMouseEnter = () => setCursorHover(true);
      const handleMouseLeave = () => setCursorHover(false);

      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });

      return () => {
        interactiveElements.forEach(el => {
          el.removeEventListener('mouseenter', handleMouseEnter);
          el.removeEventListener('mouseleave', handleMouseLeave);
        });
      };
    };

    const cleanup = addHoverListeners();

    const observer = new MutationObserver(() => {
      cleanup();
      addHoverListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cleanup();
      observer.disconnect();
    };
  }, [activeTab, showModal]);

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mousePosition.x, springConfig);
  const cursorY = useSpring(mousePosition.y, springConfig);

  useEffect(() => {
    const savedQuestions = JSON.parse(localStorage.getItem("QUIZ_DB")) || [];
    setQuestions(savedQuestions);
    setLogs(JSON.parse(localStorage.getItem("ADMIN_LOGS")) || []);
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const saveDB = (data, action) => {
    setQuestions(data);
    localStorage.setItem("QUIZ_DB", JSON.stringify(data));

    if (action) {
      const entry = {
        action,
        time: new Date().toLocaleString(),
        timestamp: Date.now(),
      };
      const updatedLogs = [entry, ...logs].slice(0, 50);
      setLogs(updatedLogs);
      localStorage.setItem("ADMIN_LOGS", JSON.stringify(updatedLogs));
      showToast(action);
    }
  };

  const handleCSV = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const rows = reader.result.trim().split("\n").slice(1);
      const parsed = rows.map((r, idx) => {
        const cols = r.split(",");
        if (cols.length < 8) return null;
        const [q, o1, o2, o3, o4, domain, difficulty, weight] = cols;
        return {
          id: Date.now() + idx + Math.random(),
          q: q.trim(),
          options: [o1.trim(), o2.trim(), o3.trim(), o4.trim()],
          answer: o1.trim(),
          domain: domain.trim().toLowerCase(),
          difficulty: difficulty.trim().toLowerCase(),
          weight: Number(weight.trim()),
        };
      }).filter(Boolean);

      saveDB([...questions, ...parsed], `CSV UPLOAD: ${parsed.length} questions imported`);
    };
    reader.readAsText(file);
  };

  const remove = (id) => {
    if (window.confirm("Permanently delete this question?")) {
      saveDB(questions.filter(q => q.id !== id), "QUESTION DELETED");
    }
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(questions, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pathora-questions-${new Date().toISOString().slice(0,10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Database exported successfully");
  };

  const totalQuestions = questions.length;
  const domainData = DOMAINS.map(d => ({
    name: d.toUpperCase(),
    value: questions.filter(q => q.domain === d).length,
    percentage: totalQuestions ? Math.round((questions.filter(q => q.domain === d).length / totalQuestions) * 100) : 0
  }));

  const levelData = LEVELS.map(l => ({
    name: l.charAt(0).toUpperCase() + l.slice(1),
    value: questions.filter(q => q.difficulty === l).length
  }));

  const radarData = DOMAINS.map(d => ({
    domain: d.toUpperCase(),
    coverage: questions.filter(q => q.domain === d).length,
  }));

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.q.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = filterDomain === "all" || q.domain === filterDomain;
    const matchesDifficulty = filterDifficulty === "all" || q.difficulty === filterDifficulty;
    return matchesSearch && matchesDomain && matchesDifficulty;
  });

  const navItems = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "questions", label: "Question Bank", icon: "📝" },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "activity", label: "Activity Logs", icon: "🕐" },
  ];

  return (
    <>
      <MagneticCursor cursorX={cursorX} cursorY={cursorY} isHovering={cursorHover} />
      
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          background: "#F8FAFC",
          fontFamily: "'Inter', sans-serif",
          cursor: "none",
        }}
      >
        {/* Sidebar */}
        <motion.aside
          animate={{ width: sidebarCollapsed ? "80px" : "280px" }}
          style={{
            background: "#FFFFFF",
            borderRight: "1px solid #E5E7EB",
            height: "100vh",
            position: "sticky",
            top: 0,
            display: "flex",
            flexDirection: "column",
            transition: "width 0.3s ease",
          }}
        >
          <div
            style={{
              padding: "24px",
              borderBottom: "1px solid #E5E7EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {!sidebarCollapsed && (
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "linear-gradient(135deg, #2563EB, #3B82F6)",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    fontWeight: "900",
                    color: "#FFFFFF",
                  }}
                >
                  PN
                </div>
                <div>
                  <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#1E293B", margin: 0 }}>
                    Pathora
                  </h2>
                  <p style={{ fontSize: "11px", color: "#64748B", margin: 0 }}>Admin Portal</p>
                </div>
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "20px",
                cursor: "none",
                padding: "8px",
              }}
            >
              {sidebarCollapsed ? "→" : "←"}
            </motion.button>
          </div>

          <nav style={{ flex: 1, padding: "16px" }}>
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                onClick={() => setActiveTab(item.id)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: activeTab === item.id ? "rgba(37, 99, 235, 0.1)" : "transparent",
                  border: "none",
                  borderLeft: activeTab === item.id ? "3px solid #2563EB" : "3px solid transparent",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "8px",
                  cursor: "none",
                  transition: "all 0.2s",
                  textAlign: "left",
                }}
              >
                <span style={{ fontSize: "20px" }}>{item.icon}</span>
                {!sidebarCollapsed && (
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: activeTab === item.id ? "600" : "500",
                      color: activeTab === item.id ? "#2563EB" : "#64748B",
                    }}
                  >
                    {item.label}
                  </span>
                )}
              </motion.button>
            ))}
          </nav>

          <div style={{ padding: "16px", borderTop: "1px solid #E5E7EB" }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={onLogout}
              style={{
                width: "100%",
                padding: "12px",
                background: "#EF4444",
                border: "none",
                borderRadius: "8px",
                color: "#FFFFFF",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "none",
              }}
            >
              {sidebarCollapsed ? "🚪" : "Logout"}
            </motion.button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main style={{ flex: 1, overflow: "auto" }}>
          {/* Header */}
          <header
            style={{
              background: "#FFFFFF",
              borderBottom: "1px solid #E5E7EB",
              padding: "20px 40px",
              position: "sticky",
              top: 0,
              zIndex: 10,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#1E293B", margin: 0, fontFamily: "'Brush Script MT', cursive" }}>
                {navItems.find(n => n.id === activeTab)?.label}
              </h1>
              <p style={{ fontSize: "13px", color: "#64748B", margin: "4px 0 0 0" }}>
                System operational • Last sync: {new Date().toLocaleTimeString()}
              </p>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#10B981",
                  boxShadow: "0 0 10px rgba(16, 185, 129, 0.5)",
                }}
              />
              <span style={{ fontSize: "13px", color: "#64748B" }}>System Healthy</span>
            </div>
          </header>

          <div style={{ padding: "40px" }}>
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Stats Cards */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: "24px",
                    marginBottom: "32px",
                  }}
                >
                  {[
                    { label: "Total Questions", value: totalQuestions, icon: "📝", color: "#2563EB" },
                    { label: "Active Domains", value: DOMAINS.length, icon: "🎯", color: "#10B981" },
                    { label: "Recent Actions", value: logs.length, icon: "🕐", color: "#F59E0B" },
                    { label: "System Health", value: "100%", icon: "✓", color: "#06B6D4" },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0, 0, 0, 0.1)" }}
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid #E5E7EB",
                        borderRadius: "16px",
                        padding: "24px",
                        position: "relative",
                        overflow: "hidden",
                        transition: "all 0.3s",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "-10px",
                          right: "-10px",
                          width: "100px",
                          height: "100px",
                          background: `${stat.color}15`,
                          borderRadius: "50%",
                          filter: "blur(20px)",
                        }}
                      />
                      <div style={{ fontSize: "32px", marginBottom: "8px" }}>{stat.icon}</div>
                      <div style={{ fontSize: "13px", color: "#64748B", marginBottom: "4px" }}>
                        {stat.label}
                      </div>
                      <div style={{ fontSize: "32px", fontWeight: "800", color: "#1E293B" }}>
                        {stat.value}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Charts Grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "24px",
                    marginBottom: "32px",
                  }}
                >
                  <div
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E5E7EB",
                      borderRadius: "16px",
                      padding: "24px",
                    }}
                  >
                    <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1E293B", marginBottom: "20px", fontFamily: "'Brush Script MT', cursive" }}>
                      Domain Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={domainData}>
                        <XAxis dataKey="name" stroke="#64748B" />
                        <YAxis stroke="#64748B" />
                        <Tooltip
                          contentStyle={{
                            background: "#1E293B",
                            border: "none",
                            borderRadius: "8px",
                            color: "#FFFFFF",
                          }}
                        />
                        <Bar dataKey="value" fill="#2563EB" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E5E7EB",
                      borderRadius: "16px",
                      padding: "24px",
                    }}
                  >
                    <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1E293B", marginBottom: "20px", fontFamily: "'Brush Script MT', cursive" }}>
                      Difficulty Breakdown
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={levelData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {levelData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Radar Chart */}
                <div
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: "16px",
                    padding: "24px",
                  }}
                >
                  <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1E293B", marginBottom: "20px", fontFamily: "'Brush Script MT', cursive" }}>
                    Coverage Analysis
                  </h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#E5E7EB" />
                      <PolarAngleAxis dataKey="domain" stroke="#64748B" />
                      <Radar dataKey="coverage" stroke="#2563EB" fill="#2563EB" fillOpacity={0.6} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {/* Questions Tab */}
            {activeTab === "questions" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Control Bar */}
                <div
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: "16px",
                    padding: "20px",
                    marginBottom: "24px",
                    display: "flex",
                    gap: "12px",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="text"
                    placeholder="🔍 Search questions..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{
                      flex: 1,
                      minWidth: "200px",
                      padding: "12px 16px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "10px",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                  <select
                    value={filterDomain}
                    onChange={e => setFilterDomain(e.target.value)}
                    style={{
                      padding: "12px 16px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "10px",
                      fontSize: "14px",
                      outline: "none",
                      cursor: "none",
                    }}
                  >
                    <option value="all">All Domains</option>
                    {DOMAINS.map(d => <option key={d} value={d}>{d.toUpperCase()}</option>)}
                  </select>
                  <select
                    value={filterDifficulty}
                    onChange={e => setFilterDifficulty(e.target.value)}
                    style={{
                      padding: "12px 16px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "10px",
                      fontSize: "14px",
                      outline: "none",
                      cursor: "none",
                    }}
                  >
                    <option value="all">All Levels</option>
                    {LEVELS.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                  </select>

                  <motion.label
                    whileHover={{ scale: 1.02 }}
                    style={{
                      padding: "12px 20px",
                      background: "#10B981",
                      color: "#FFFFFF",
                      borderRadius: "10px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "none",
                    }}
                  >
                    📤 Import CSV
                    <input
                      type="file"
                      accept=".csv"
                      hidden
                      onChange={(e) => e.target.files[0] && handleCSV(e.target.files[0])}
                    />
                  </motion.label>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={exportToJSON}
                    style={{
                      padding: "12px 20px",
                      background: "#F59E0B",
                      border: "none",
                      color: "#FFFFFF",
                      borderRadius: "10px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "none",
                    }}
                  >
                    📥 Export JSON
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setShowModal(true)}
                    style={{
                      padding: "12px 20px",
                      background: "#2563EB",
                      border: "none",
                      color: "#FFFFFF",
                      borderRadius: "10px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "none",
                    }}
                  >
                    + Add Question
                  </motion.button>
                </div>

                {/* Questions Table */}
                <div
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: "16px",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr
                          style={{
                            background: "#F8FAFC",
                            borderBottom: "1px solid #E5E7EB",
                          }}
                        >
                          {["#", "Question", "Domain", "Difficulty", "Weight", "Actions"].map(h => (
                            <th
                              key={h}
                              style={{
                                padding: "16px",
                                textAlign: "left",
                                fontSize: "13px",
                                fontWeight: "700",
                                color: "#64748B",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                              }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredQuestions.length === 0 ? (
                          <tr>
                            <td
                              colSpan="6"
                              style={{
                                padding: "60px",
                                textAlign: "center",
                                color: "#94A3B8",
                                fontSize: "15px",
                              }}
                            >
                              No questions found. Try adjusting your filters or add new questions.
                            </td>
                          </tr>
                        ) : (
                          filteredQuestions.map((q, idx) => (
                            <motion.tr
                              key={q.id}
                              whileHover={{ backgroundColor: "#F8FAFC" }}
                              style={{
                                borderBottom: "1px solid #E5E7EB",
                                transition: "background 0.2s",
                              }}
                            >
                              <td style={{ padding: "16px", fontSize: "14px", color: "#64748B" }}>
                                {idx + 1}
                              </td>
                              <td
                                style={{
                                  padding: "16px",
                                  fontSize: "14px",
                                  color: "#1E293B",
                                  maxWidth: "400px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {q.q}
                              </td>
                              <td style={{ padding: "16px" }}>
                                <span
                                  style={{
                                    padding: "4px 12px",
                                    background: `${COLORS[DOMAINS.indexOf(q.domain)]}15`,
                                    color: COLORS[DOMAINS.indexOf(q.domain)],
                                    borderRadius: "6px",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                  }}
                                >
                                  {q.domain.toUpperCase()}
                                </span>
                              </td>
                              <td style={{ padding: "16px" }}>
                                <span
                                  style={{
                                    padding: "4px 12px",
                                    background: q.difficulty === "easy" ? "#10B98115" : q.difficulty === "medium" ? "#F59E0B15" : "#EF444415",
                                    color: q.difficulty === "easy" ? "#10B981" : q.difficulty === "medium" ? "#F59E0B" : "#EF4444",
                                    borderRadius: "6px",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                  }}
                                >
                                  {q.difficulty}
                                </span>
                              </td>
                              <td style={{ padding: "16px", fontSize: "14px", color: "#64748B" }}>
                                {q.weight}
                              </td>
                              <td style={{ padding: "16px", display: "flex", gap: "8px" }}>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  onClick={() => { setEdit(q); setShowModal(true); }}
                                  style={{
                                    padding: "6px 12px",
                                    background: "#3B82F6",
                                    border: "none",
                                    borderRadius: "6px",
                                    color: "#FFFFFF",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    cursor: "none",
                                  }}
                                >
                                  Edit
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  onClick={() => remove(q.id)}
                                  style={{
                                    padding: "6px 12px",
                                    background: "#EF4444",
                                    border: "none",
                                    borderRadius: "6px",
                                    color: "#FFFFFF",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    cursor: "none",
                                  }}
                                >
                                  Delete
                                </motion.button>
                              </td>
                            </motion.tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "24px",
                  }}
                >
                  {domainData.map((d, i) => (
                    <motion.div
                      key={d.name}
                      whileHover={{ scale: 1.02 }}
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid #E5E7EB",
                        borderRadius: "16px",
                        padding: "24px",
                        borderLeft: `4px solid ${COLORS[i]}`,
                      }}
                    >
                      <h3 style={{ fontSize: "14px", color: "#64748B", marginBottom: "8px", fontFamily: "'Brush Script MT', cursive" }}>
                        {d.name}
                      </h3>
                      <div style={{ fontSize: "32px", fontWeight: "800", color: "#1E293B", marginBottom: "8px" }}>
                        {d.value}
                      </div>
                      <div style={{ fontSize: "13px", color: "#64748B" }}>
                        {d.percentage}% of total questions
                      </div>
                      <div
                        style={{
                          marginTop: "12px",
                          height: "8px",
                          background: "#F1F5F9",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${d.percentage}%`,
                            background: COLORS[i],
                            borderRadius: "4px",
                            transition: "width 0.5s ease",
                          }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Activity Tab */}
            {activeTab === "activity" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "16px",
                  padding: "24px",
                }}
              >
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1E293B", marginBottom: "20px", fontFamily: "'Brush Script MT', cursive" }}>
                  Recent Admin Activity
                </h3>
                {logs.length === 0 ? (
                  <p style={{ color: "#94A3B8", textAlign: "center", padding: "40px" }}>
                    No activity recorded yet
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {logs.map((log, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "16px",
                          background: "#F8FAFC",
                          borderRadius: "12px",
                          border: "1px solid #E5E7EB",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              background: "#2563EB",
                            }}
                          />
                          <span style={{ fontSize: "14px", color: "#1E293B", fontWeight: "500" }}>
                            {log.action}
                          </span>
                        </div>
                        <span style={{ fontSize: "13px", color: "#64748B" }}>
                          {log.time}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </main>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{
              position: "fixed",
              bottom: "32px",
              right: "32px",
              background: toast.type === "success" ? "#10B981" : "#EF4444",
              color: "#FFFFFF",
              padding: "16px 24px",
              borderRadius: "12px",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
              fontSize: "14px",
              fontWeight: "600",
              zIndex: 10000,
            }}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <QuestionModal
            edit={edit}
            onClose={() => {
              setEdit(null);
              setShowModal(false);
            }}
            onSave={(newQuestion) => {
              if (edit) {
                saveDB(
                  questions.map(x => x.id === newQuestion.id ? newQuestion : x),
                  "QUESTION UPDATED"
                );
              } else {
                saveDB([...questions, { ...newQuestion, id: Date.now() + Math.random() }], "QUESTION ADDED");
              }
              setEdit(null);
              setShowModal(false);
            }}
          />
        )}
      </AnimatePresence>

      <style>{`
        * { cursor: none !important; }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(20px); }
        }
      `}</style>
    </>
  );
}

/* ================= QUESTION MODAL ================= */
function QuestionModal({ edit, onClose, onSave }) {
  const [form, setForm] = useState(
    edit || {
      q: "",
      options: ["", "", "", ""],
      answer: "",
      domain: "tech",
      difficulty: "easy",
      weight: 1,
    }
  );

  const handleOptionChange = (index, value) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    setForm({ ...form, options: newOptions });
  };

  const handleSave = () => {
    if (!form.q.trim()) {
      alert("Question text is required.");
      return;
    }
    if (form.options.some(o => !o.trim())) {
      alert("All 4 options must be filled.");
      return;
    }
    if (!form.answer) {
      alert("Please select the correct answer.");
      return;
    }
    onSave(form);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FFFFFF",
          borderRadius: "24px",
          padding: "40px",
          maxWidth: "700px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <h3 style={{ fontSize: "24px", fontWeight: "800", color: "#1E293B", marginBottom: "24px", fontFamily: "'Brush Script MT', cursive" }}>
          {edit ? "Edit Question" : "Add New Question"}
        </h3>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#64748B", marginBottom: "8px" }}>
            Question Text
          </label>
          <textarea
            placeholder="Enter your question here..."
            value={form.q}
            onChange={e => setForm({ ...form, q: e.target.value })}
            rows="3"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #E5E7EB",
              borderRadius: "12px",
              fontSize: "14px",
              resize: "vertical",
              outline: "none",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#64748B", marginBottom: "12px" }}>
            Answer Options
          </label>
          {form.options.map((opt, i) => (
            <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "12px", alignItems: "center" }}>
              <span
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "#F8FAFC",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#64748B",
                }}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <input
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={e => handleOptionChange(i, e.target.value)}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "1px solid #E5E7EB",
                  borderRadius: "10px",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "none" }}>
                <input
                  type="radio"
                  name="correct-answer"
                  checked={form.answer === opt}
                  onChange={() => setForm({ ...form, answer: opt })}
                  style={{ cursor: "none" }}
                />
                <span style={{ fontSize: "13px", color: "#64748B" }}>Correct</span>
              </label>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "32px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#64748B", marginBottom: "8px" }}>
              Domain
            </label>
            <select
              value={form.domain}
              onChange={e => setForm({ ...form, domain: e.target.value })}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #E5E7EB",
                borderRadius: "10px",
                fontSize: "14px",
                outline: "none",
                cursor: "none",
              }}
            >
              {DOMAINS.map(d => (
                <option key={d} value={d}>{d.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#64748B", marginBottom: "8px" }}>
              Difficulty
            </label>
            <select
              value={form.difficulty}
              onChange={e => setForm({ ...form, difficulty: e.target.value })}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #E5E7EB",
                borderRadius: "10px",
                fontSize: "14px",
                outline: "none",
                cursor: "none",
              }}
            >
              {LEVELS.map(l => (
                <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#64748B", marginBottom: "8px" }}>
              Weight
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={form.weight}
              onChange={e => setForm({ ...form, weight: Number(e.target.value) })}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #E5E7EB",
                borderRadius: "10px",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            style={{
              flex: 1,
              padding: "14px",
              background: "#2563EB",
              border: "none",
              borderRadius: "12px",
              color: "#FFFFFF",
              fontSize: "15px",
              fontWeight: "700",
              cursor: "none",
            }}
          >
            {edit ? "Update Question" : "Add Question"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            style={{
              flex: 1,
              padding: "14px",
              background: "transparent",
              border: "2px solid #E5E7EB",
              borderRadius: "12px",
              color: "#64748B",
              fontSize: "15px",
              fontWeight: "700",
              cursor: "none",
            }}
          >
            Cancel
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}