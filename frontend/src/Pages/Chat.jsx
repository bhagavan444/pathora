import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { githubGist } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useIntelligenceStore } from "../store/intelligenceStore";
import "./Home.css";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api/v1` : "https://pathora-backend1.onrender.com/api/v1";
const uid = () => crypto.randomUUID?.() || Math.random().toString(36).slice(2);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const PLACEHOLDERS = [
  "Analyze my resume for ATS gaps...",
  "Build a backend engineer roadmap...",
  "Predict my placement readiness...",
  "Compare my skills to industry benchmarks...",
  "Optimize my profile for product companies...",
  "Create a DSA preparation strategy...",
];

const THINKING_STEPS = [
  "Loading career intelligence context...",
  "Analyzing skill & role alignment...",
  "Cross-referencing industry benchmarks...",
  "Composing personalized insight...",
];

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: transparent;
    --bg-surface: rgba(255,255,255,0.12);
    --bg-card: rgba(255,255,255,0.14);
    --bg-elevated: rgba(255,255,255,0.1);
    --border: rgba(255,255,255,0.22);
    --border-focus: rgba(129,140,248,0.6);
    --accent-blue: #818cf8;
    --accent-violet: #a78bfa;
    --accent-blue-light: rgba(129,140,248,0.12);
    --accent-blue-hover: #a78bfa;
    --accent-red: #ef4444;
    --accent-green: #34d399;
    --text-primary: #000000;
    --text-secondary: rgba(0,0,0,0.7);
    --text-muted: rgba(0,0,0,0.45);
    --user-bubble: rgba(129,140,248,0.2);
    --user-text: #000000;
    --ai-bubble: rgba(255,255,255,0.14);
    --ai-border: rgba(255,255,255,0.22);
    --sidebar-bg: rgba(255,255,255,0.45);
    --sidebar-width: 240px;
    --header-height: 56px;
    --font-body: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --font-mono: 'Geist Mono', 'JetBrains Mono', monospace;
    --r-xs: 4px;
    --r-sm: 8px;
    --r-md: 12px;
    --r-lg: 14px;
    --r-xl: 18px;
    --r-2xl: 24px;
    --r-full: 9999px;
    --shadow-sm: 0 1px 4px rgba(0,0,0,0.04);
    --shadow-md: 0 4px 16px rgba(0,0,0,0.06);
    --shadow-lg: 0 8px 40px rgba(124,58,237,0.08);
    --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  body{background:transparent;
    color: var(--text-primary);
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
  }

  ::selection { background: rgba(129,140,248,0.2); color: var(--text-primary); }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 99px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.25); }

  textarea::-webkit-scrollbar { display: none; }
  textarea { scrollbar-width: none; }

  @keyframes fade-in {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes dot-bounce {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-5px); }
  }

  @keyframes shimmer {
    0% { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes float {
    0%,100%{transform:translateY(0)}
    50%{transform:translateY(-8px)}
  }

  @keyframes orb-pulse {
    0%, 100% { transform: scale(1); box-shadow: 0 0 12px rgba(167,139,250,0.4), 0 0 24px rgba(129,140,248,0.15); }
    50% { transform: scale(1.06); box-shadow: 0 0 20px rgba(167,139,250,0.7), 0 0 40px rgba(129,140,248,0.25); }
  }

  @keyframes subtle-breath {
    0%, 100% { opacity: 0.35; }
    50% { opacity: 1; }
  }

  @keyframes cursor-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  @keyframes neural-wave {
    0% { background-position: 200% center; }
    100% { background-position: -200% center; }
  }

  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 8px rgba(129,140,248,0.2); }
    50% { box-shadow: 0 0 18px rgba(129,140,248,0.5); }
  }

  @keyframes status-flicker {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }

  @keyframes light-sweep {
    0% { background-position: -100% 0; }
    100% { background-position: 200% 0; }
  }

  .thinking-dot {
    animation: dot-bounce 1.4s ease-in-out infinite;
    border-radius: 50%;
    width: 7px;
    height: 7px;
    background: linear-gradient(135deg, var(--accent-blue), var(--accent-violet));
    box-shadow: 0 0 8px rgba(129,140,248,0.4);
  }
  .thinking-dot:nth-child(2) { animation-delay: 0.2s; }
  .thinking-dot:nth-child(3) { animation-delay: 0.4s; }

  .shimmer-line {
    background: linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 75%);
    background-size: 400px 100%;
    animation: shimmer 1.4s infinite;
    border-radius: var(--r-sm);
    height: 14px;
  }

  .md-content { font-size: 14px; line-height: 1.75; color: var(--text-primary); }
  .md-content h1 { font-size: 1.35em; font-weight: 700; margin: 16px 0 8px; }
  .md-content h2 { font-size: 1.15em; font-weight: 600; margin: 14px 0 7px; }
  .md-content h3 { font-size: 1.02em; font-weight: 600; margin: 12px 0 6px; color: var(--accent-blue); }
  .md-content ul, .md-content ol { padding-left: 18px; margin: 8px 0; }
  .md-content li { margin: 3px 0; line-height: 1.7; }
  .md-content strong { color: var(--text-primary); font-weight: 600; }
  .md-content em { color: var(--text-secondary); font-style: italic; }
  .md-content a { color: var(--accent-blue); text-decoration: underline; text-underline-offset: 2px; }
  .md-content code {
    font-family: var(--font-mono);
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.18);
    padding: 1px 5px;
    border-radius: var(--r-xs);
    font-size: 0.84em;
    color: #000;
  }
  .md-content blockquote {
    border-left: 3px solid var(--accent-blue);
    padding: 6px 14px;
    margin: 10px 0;
    background: rgba(129,140,248,0.08);
    border-radius: 0 var(--r-sm) var(--r-sm) 0;
    color: var(--text-secondary);
  }
  .md-content table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 0.88em; }
  .md-content th {
    background: rgba(255,255,255,0.08);
    padding: 8px 12px;
    text-align: left;
    font-weight: 600;
    border: 1px solid var(--border);
    font-size: 0.85em;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .md-content td { padding: 7px 12px; border: 1px solid var(--border); }
  .md-content tr:nth-child(even) td { background: rgba(255,255,255,0.04); }
  .md-content p { margin-bottom: 8px; }
  .md-content p:last-child { margin-bottom: 0; }

  /* Interactive states */
  .btn {
    transition: background var(--transition), color var(--transition), border-color var(--transition), box-shadow var(--transition), opacity var(--transition);
    cursor: pointer;
    border: none;
    font-family: var(--font-body);
  }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .sidebar-item {
    transition: background 0.15s ease, box-shadow 0.15s ease;
    position: relative;
  }
  .sidebar-item:hover {
    background: rgba(0,0,0,0.04) !important;
  }

  .icon-btn {
    display: flex; align-items: center; justify-content: center;
    border-radius: var(--r-md);
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.15);
    color: var(--text-secondary);
    cursor: pointer;
    transition: background var(--transition), color var(--transition), border-color var(--transition);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  }
  .icon-btn:hover {
    background: rgba(255,255,255,0.16);
    color: var(--text-primary);
  }

  .chip {
    transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease;
    cursor: pointer;
    font-family: var(--font-body);
  }
  .chip:hover {
    background: #fff !important;
    border-color: rgba(124,58,237,0.25) !important;
    color: #111 !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.06), 0 0 0 1px rgba(124,58,237,0.08);
  }
  .chip:active {
    transform: translateY(0) scale(0.98);
  }

  .meta-btn {
    display: flex; align-items: center; justify-content: center;
    gap: 4px;
    border-radius: var(--r-sm);
    background: transparent;
    border: 1px solid transparent;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 12px;
    padding: 4px 8px;
    transition: background var(--transition), color var(--transition), border-color var(--transition);
    font-family: var(--font-body);
  }
  .meta-btn:hover {
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.18);
    color: var(--text-secondary);
  }

  .send-btn:not(:disabled):hover {
    background: var(--accent-blue-hover) !important;
    box-shadow: 0 4px 20px rgba(129,140,248,0.4), 0 0 40px rgba(129,140,248,0.15);
    transform: scale(1.05);
  }
  .send-btn:not(:disabled):active {
    transform: scale(0.96);
  }
`;

// ─── MARKDOWN PARSER ─────────────────────────────────────────────────────────
function parseMarkdown(text = "") {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/^# (.*?)$/gm, "<h1>$1</h1>")
    .replace(/^## (.*?)$/gm, "<h2>$1</h2>")
    .replace(/^### (.*?)$/gm, "<h3>$1</h3>")
    .replace(/^> (.*?)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^[-*] (.*?)$/gm, "<li>$1</li>")
    .replace(/^\d+\. (.*?)$/gm, "<li>$1</li>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/(<li>.*?<\/li>\n?)+/gs, "<ul>$&</ul>")
    .replace(/\n\n/g, "</p><p>");
}

function renderContent(raw = "", isStreaming = false) {
  if (!raw) return null;
  const codeRe = /```(\w*)\n?([\s\S]*?)```/g;
  const parts = [];
  let last = 0, m, i = 0;
  while ((m = codeRe.exec(raw)) !== null) {
    if (m.index > last) {
      parts.push(
        <div key={`t${i++}`} className="md-content"
          dangerouslySetInnerHTML={{ __html: `<p>${parseMarkdown(raw.slice(last, m.index))}</p>` }} />
      );
    }
    parts.push(<CodeBlock key={`c${i++}`} lang={m[1] || "text"} code={m[2].trim()} />);
    last = codeRe.lastIndex;
  }
  if (last < raw.length) {
    parts.push(
      <div key={`te${i++}`} className="md-content"
        dangerouslySetInnerHTML={{ __html: `<p>${parseMarkdown(raw.slice(last))}</p>` }} />
    );
  }
  return parts;
}

// ─── CODE BLOCK ──────────────────────────────────────────────────────────────
const CodeBlock = React.memo(function CodeBlock({ lang, code }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{
      margin: "10px 0",
      borderRadius: "12px",
      border: "1px solid rgba(255,255,255,0.18)",
      overflow: "hidden",
      background: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 12px",
        background: "rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}>
        <span style={{
          fontSize: "11px", fontFamily: "var(--font-mono)",
          color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em",
        }}>{lang}</span>
        <button
          className="btn"
          onClick={copy}
          style={{
            padding: "3px 10px", borderRadius: "6px",
            border: "1px solid rgba(255,255,255,0.15)",
            background: copied ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.08)",
            color: copied ? "#34d399" : "rgba(255,255,255,0.7)",
            fontSize: "11px", fontFamily: "var(--font-mono)",
          }}>
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        language={lang}
        style={githubGist}
        customStyle={{
          background: "transparent",
          padding: "14px 16px",
          margin: 0,
          fontSize: "12.5px",
          fontFamily: "var(--font-mono)",
          color: "#e2e8f0",
        }}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
});

// ─── TYPING DOTS ─────────────────────────────────────────────────────────────
const TypingDots = React.memo(function TypingDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 0" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} className="thinking-dot" style={{ animationDelay: `${i * 0.2}s` }} />
      ))}
    </div>
  );
});

// ─── SKELETON LOADER ──────────────────────────────────────────────────────────
const SkeletonLoader = React.memo(function SkeletonLoader() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "4px" }}>
      <div className="shimmer-line" style={{ width: "80%" }} />
      <div className="shimmer-line" style={{ width: "60%" }} />
      <div className="shimmer-line" style={{ width: "70%" }} />
    </div>
  );
});

// ─── TOAST ────────────────────────────────────────────────────────────────────
const Toast = React.memo(function Toast({ toasts, dismiss }) {
  return (
    <div style={{ position: "fixed", top: "68px", right: "16px", zIndex: 9999, display: "flex", flexDirection: "column", gap: "6px" }}>
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "10px 14px", borderRadius: "10px", fontSize: "13px", fontWeight: "500",
              background: t.type === "error" ? "#fef2f2" : "#f0fdf4",
              border: `1px solid ${t.type === "error" ? "#fecaca" : "#bbf7d0"}`,
              color: t.type === "error" ? "#dc2626" : "#16a34a",
              boxShadow: "var(--shadow-md)", maxWidth: "280px",
            }}>
            <span>{t.type === "error" ? "✕" : "✓"}</span>
            <span style={{ flex: 1 }}>{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "inherit", opacity: 0.5, fontSize: "12px", padding: 0,
              }}>✕</button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
});

// ─── FILE CARD ────────────────────────────────────────────────────────────────
const FileCard = React.memo(function FileCard({ file, onRemove, analyzing }) {
  const ext = file.name.split(".").pop().toUpperCase();
  const isImage = file.type.startsWith("image/");
  const extColors = {
    PDF: "#ef4444", DOC: "#2563eb", DOCX: "#2563eb",
    TXT: "#64748b", JS: "#f59e0b", PY: "#22c55e",
  };
  const color = extColors[ext] || "#64748b";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
      style={{
        display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px",
        borderRadius: "var(--r-md)", background: "var(--bg-surface)",
        border: "1px solid var(--border)", position: "relative", overflow: "hidden",
      }}>
      {analyzing && (
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, transparent, rgba(37,99,235,0.04), transparent)",
          animation: "shimmer 1.5s infinite",
        }} />
      )}
      <div style={{
        width: "32px", height: "32px", borderRadius: "var(--r-sm)", flexShrink: 0,
        background: `${color}10`, border: `1px solid ${color}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "10px", fontWeight: "700", fontFamily: "var(--font-mono)", color,
      }}>
        {isImage ? "IMG" : ext}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "12px", color: "var(--text-primary)", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {file.name}
        </div>
        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "1px" }}>
          {analyzing
            ? <span style={{ color: "var(--accent-blue)" }}>Analyzing…</span>
            : `${(file.size / 1024).toFixed(1)} KB`}
        </div>
      </div>
      <button
        onClick={onRemove}
        style={{
          width: "18px", height: "18px", borderRadius: "50%", border: "none",
          background: "#fee2e2", color: "#ef4444", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", flexShrink: 0,
        }}>✕</button>
    </motion.div>
  );
});


// ─── PLACEHOLDER ANIMATOR ──────────────────────────────────────────────────
function useAnimatedPlaceholder() {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const target = PLACEHOLDERS[idx];
    let timeout;
    if (!deleting && displayed.length < target.length) {
      timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 60);
    } else if (!deleting && displayed.length === target.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIdx((i) => (i + 1) % PLACEHOLDERS.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, idx]);

  return displayed;
}

// ─── AVATAR ───────────────────────────────────────────────────────────────────
const Avatar = React.memo(function Avatar({ isUser, isStreaming }) {
  return (
    <div style={{
      width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: isUser
        ? "linear-gradient(135deg, #818cf8, #a78bfa)"
        : "rgba(255,255,255,0.15)",
      border: isUser
        ? "2px solid rgba(129,140,248,0.35)"
        : "1.5px solid rgba(255,255,255,0.25)",
      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
      fontSize: "12px", fontWeight: "700",
      color: isUser ? "#fff" : "var(--text-secondary)",
      boxShadow: isUser
        ? "0 4px 16px rgba(129,140,248,0.3), inset 0 1px 2px rgba(255,255,255,0.2)"
        : "0 2px 10px rgba(0,0,0,0.06), inset 0 1px 2px rgba(255,255,255,0.1)",
      transition: "all 0.3s ease",
      ...(isStreaming ? { animation: "glow-pulse 2s ease-in-out infinite" } : {}),
    }}>
      {isUser ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ) : (
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          style={isStreaming ? { animation: "spin 2.5s linear infinite" } : {}}>
          <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="var(--accent-blue)" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M2 17l10 5 10-5" stroke="#60a5fa" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M2 12l10 5 10-5" stroke="#93c5fd" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
});

// ─── MESSAGE REACTIONS ────────────────────────────────────────────────────────
const MessageReactions = React.memo(function MessageReactions({ onReact, reactions }) {
  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {[
        { emoji: "👍", key: "up" },
        { emoji: "👎", key: "down" },
      ].map(({ emoji, key }) => (
        <button
          key={key}
          className="meta-btn"
          onClick={() => onReact(key)}
          style={{
            background: reactions?.[key] ? "var(--accent-blue-light)" : undefined,
            borderColor: reactions?.[key] ? "#bfdbfe" : undefined,
            color: reactions?.[key] ? "var(--accent-blue)" : undefined,
          }}>
          {emoji}
        </button>
      ))}
    </div>
  );
});

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function ChatUI() {
  const globalAnalysis = useIntelligenceStore(state => state.resumeAnalysis);
  const globalDomain = useIntelligenceStore(state => state.currentDomain);
  const globalResume = useIntelligenceStore(state => state.resumeData);

  const [sessions, setSessions] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [streamingId, setStreamingId] = useState(null);
  const [thinkingStep, setThinkingStep] = useState(0);
  const [inputFocused, setInputFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [typingSpeed, setTypingSpeed] = useState("fast");
  const [expandedMsgs, setExpandedMsgs] = useState({});
  const [contextRemembered, setContextRemembered] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [userScrolled, setUserScrolled] = useState(false);
  const [reactions, setReactions] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const stopRef = useRef(false);
  const abortControllerRef = useRef(null);
  const chatBodyRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);

  const placeholderText = useAnimatedPlaceholder();

  // Inject global CSS once
  useEffect(() => {
    if (document.getElementById("gcss-chat-white")) return;
    const el = document.createElement("style");
    el.id = "gcss-chat-white";
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
  }, []);

  useEffect(() => {
    fetchChats();
    const onResize = () => {
      setIsMobile(window.innerWidth < 768);
      setSidebarOpen(window.innerWidth >= 768);
    };
    onResize();
    window.addEventListener("resize", onResize);
    const unsubAuth = auth ? onAuthStateChanged(auth, (u) => setFirebaseUser(u)) : () => {};
    return () => { window.removeEventListener("resize", onResize); unsubAuth(); };
  }, []);

  // Smart auto-scroll: only scroll if user hasn't scrolled up
  useEffect(() => {
    if (!userScrolled && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, userScrolled]);

  useEffect(() => {
    const el = chatBodyRef.current;
    if (!el) return;
    const onScroll = () => {
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
      setUserScrolled(!atBottom);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(160, ta.scrollHeight)}px`;
  }, [input]);

  useEffect(() => {
    if (messages.length > 2) setContextRemembered(true);
    if (messages.length > 20) setShowLimitModal(true);
  }, [messages]);

  // Keyboard shortcuts
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Enter" && !e.shiftKey && document.activeElement === textareaRef.current) {
        e.preventDefault();
        handleSend();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [input, selectedFiles]);

  // ── API ────────────────────────────────────────────────────────────────────
  const fetchChats = async () => {
    try {
      const r = await fetch(`${API_BASE}/chat/chats`);
      if (!r.ok) throw new Error();
      const d = await r.json();
      const list = (d.sessions || []).reverse().map((s) => ({
        ...s,
        lastMessage: s.messages?.[s.messages.length - 1]?.message || "",
      }));
      setSessions(list);
      if (list.length && !tabs.length) {
        const t = [{ id: list[0]._id, title: list[0].title || "Chat 1" }];
        setTabs(t);
        setActiveTab(t[0].id);
      }
    } catch {}
  };

  const selectChat = async (_id) => {
    try {
      setChatId(_id);
      setError(null);
      setUserScrolled(false);
      if (window.innerWidth < 768) setSidebarOpen(false);
      const r = await fetch(`${API_BASE}/chat/chats/${_id}`);
      if (!r.ok) throw new Error();
      const d = await r.json();
      setMessages(d.messages || []);
      if (!tabs.find((t) => t.id === _id)) {
        const s = sessions.find((s) => s._id === _id);
        setTabs((prev) => [...prev.slice(-4), { id: _id, title: s?.title || "Chat" }]);
      }
      setActiveTab(_id);
    } catch {
      setError("Failed to load chat.");
    }
  };

  const handleNewChat = async () => {
    try {
      setError(null);
      const r = await fetch(`${API_BASE}/chat/chats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "New chat", reply: "Started" }),
      });
      if (!r.ok) throw new Error();
      const d = await r.json();
      setChatId(d.chat_id);
      setMessages([]);
      setTabs((prev) => [...prev.slice(-4), { id: d.chat_id, title: "New Chat" }]);
      setActiveTab(d.chat_id);
      await fetchChats();
      if (window.innerWidth < 768) setSidebarOpen(false);
    } catch {
      setError("Failed to create chat.");
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedFiles.length) return;
    setLoading(true);
    setStreaming(true);
    setError(null);
    setUserScrolled(false);
    stopRef.current = false;

    // Create a new AbortController for this request
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    const userMsg = {
      id: uid(),
      message: input,
      reply: "",
      files: selectedFiles.map((f) => f.name),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      role: "user",
      date: new Date().toDateString(),
    };
    setMessages((c) => [...c, userMsg]);
    
    let cap = input;
    if (messages.length === 0 && globalAnalysis) {
      const strengths = globalAnalysis.skills ? globalAnalysis.skills.slice(0, 5).join(', ') : "";
      const contextPreamble = `[SYSTEM CONTEXT: The user has previously uploaded their resume. Their ATS Score is ${globalAnalysis.score}/100. Target Role: ${globalDomain}. Key Skills Detected: ${strengths}. Keep this context in mind to provide highly personalized engineering advice. Do not explicitly state that you are reading system context unless asked.]\n\n`;
      cap = contextPreamble + cap;
    }
    
    setInput("");
    const attachedFiles = [...selectedFiles];
    setSelectedFiles([]);

    const dynamicThinkingSteps = attachedFiles.length > 0 
      ? [`Encrypting & Uploading ${attachedFiles.length} file(s)...`, ...THINKING_STEPS] 
      : THINKING_STEPS;

    const aid = uid();
    setStreamingId(aid);
    setThinkingStep(0);
    setMessages((c) => [
      ...c,
      {
        id: aid, message: null, reply: "", role: "assistant",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        date: new Date().toDateString(), isThinking: true,
        customSteps: dynamicThinkingSteps
      },
    ]);

    const thinkingInterval = setInterval(() => {
      setThinkingStep((s) => {
        if (s >= dynamicThinkingSteps.length - 1) { clearInterval(thinkingInterval); return s; }
        return s + 1;
      });
    }, 280); // Sped up thinking steps for a snappier feel

    let currentSessionId = chatId || uid();
    if (!chatId) setChatId(currentSessionId);

    let built = "";

    try {
      // 1. Upload files first if any
      if (attachedFiles.length > 0) {
        const fd = new FormData();
        fd.append("chat_id", currentSessionId);
        attachedFiles.forEach((f) => fd.append("files", f));
        
        const uploadRes = await fetch(`${API_BASE}/documents/upload`, { 
          method: "POST", 
          body: fd,
          signal 
        });
        if (!uploadRes.ok) {
          if (uploadRes.status === 404) throw new Error("Document upload endpoint not found (404).");
          if (uploadRes.status >= 500) throw new Error("Intelligence core is currently unavailable (Backend Error).");
          throw new Error(`Failed to upload files: ${uploadRes.status}`);
        }
      }

      // 2. Stream SSE Response from Intelligence Engine
      const res = await fetch(`${API_BASE}/chat/stream/${currentSessionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: cap }),
        signal
      });

      if (!res.ok) {
        if (res.status === 404) throw new Error("Streaming endpoint not found (404). Check API routes.");
        if (res.status >= 500) throw new Error("Intelligence core is currently unavailable (Backend Error).");
        throw new Error(`API error during streaming request: ${res.statusText || res.status}`);
      }
      
      clearInterval(thinkingInterval);
      setMessages((c) => c.map((m) => (m.id === aid ? { ...m, isThinking: false } : m)));

      // Read SSE stream
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (stopRef.current) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop(); // keep the incomplete last line in the buffer

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.replace("data: ", "").trim();
            if (dataStr === "[DONE]") {
              break;
            }
            if (dataStr) {
              try {
                const parsed = JSON.parse(dataStr);
                built += parsed.message || parsed.text || "";
                setMessages((c) => c.map((m) => (m.id === aid ? { ...m, reply: built } : m)));
              } catch (e) {
                // Ignore parse errors
              }
            }
          }
        }
      }
      
      if (!built.trim()) {
         built = "I couldn't process that properly. Please try again or ask something else.";
         setMessages((c) => c.map((m) => (m.id === aid ? { ...m, reply: built } : m)));
      }

      setStreamingId(null);
      await fetchChats();
      addToast("Intelligence stream complete");
    } catch (err) {
      clearInterval(thinkingInterval);
      setStreamingId(null);
      if (err.name === "AbortError") {
         addToast("Generation halted manually");
         return;
      }
      setMessages((c) =>
        c.map((m) =>
          m.id === aid
            ? { ...m, reply: built + "\n\n⚠️ " + (err.message || "Connection error."), isThinking: false }
            : m
        )
      );
      setError(err.message || "Failed to reach intelligence core.");
      addToast("Failed to process", "error");
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  };

  const stopGeneration = () => {
    stopRef.current = true;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setStreaming(false);
  };

  const delSession = async (_id) => {
    try {
      await fetch(`${API_BASE}/chat/chats/${_id}`, { method: "DELETE" });
      if (chatId === _id) { setChatId(null); setMessages([]); }
      setTabs((prev) => prev.filter((t) => t.id !== _id));
      await fetchChats();
      addToast("Chat deleted");
    } catch {
      addToast("Failed", "error");
    }
  };

  const delAll = async () => {
    try {
      await fetch(`${API_BASE}/chat/chats`, { method: "DELETE" });
      setChatId(null);
      setMessages([]);
      setTabs([]);
      await fetchChats();
      addToast("All chats cleared");
    } catch {
      addToast("Failed", "error");
    }
  };

  const exportChat = () => {
    const content = messages
      .map((m) => `${m.role === "user" ? "You" : "AI"}: ${m.message || m.reply}`)
      .join("\n\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
    a.download = "chat.txt";
    a.click();
    addToast("Exported as TXT");
  };

  const copyMsg = (text) => { navigator.clipboard.writeText(text); addToast("Copied!"); };

  const addToast = (message, type = "success") => {
    const id = uid();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
  };

  const toggleExpand = (id) => setExpandedMsgs((p) => ({ ...p, [id]: !p[id] }));

  const handleReact = (msgId, key) => {
    setReactions((prev) => ({
      ...prev,
      [msgId]: { ...prev[msgId], [key]: !prev[msgId]?.[key] },
    }));
  };

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles((p) => [...p, ...files]);
    addToast(`${files.length} file(s) attached`);
  };

  const filtered = sessions.filter(
    (s) => !searchQuery || (s.title || "Untitled").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupChatsByTime = (chats) => {
    const groups = { Today: [], Yesterday: [], "Previous 7 Days": [], Older: [] };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    chats.forEach((chat) => {
      let chatDate = chat.createdAt ? new Date(chat.createdAt) : new Date();
      if (isNaN(chatDate.getTime())) chatDate = new Date();
      chatDate.setHours(0, 0, 0, 0);
      const time = chatDate.getTime();
      
      if (time === today.getTime()) groups.Today.push(chat);
      else if (time === yesterday.getTime()) groups.Yesterday.push(chat);
      else if (time >= lastWeek.getTime()) groups["Previous 7 Days"].push(chat);
      else groups.Older.push(chat);
    });
    return groups;
  };
  
  const groupedChats = groupChatsByTime(filtered);

  const LONG_THRESHOLD = 2000;

  const SUGGESTIONS = [
    "Analyze my ATS score",
    "Predict placement readiness",
    "Generate AI engineer roadmap",
    "Compare my backend skills",
    "Create DSA preparation plan",
    "Optimize my resume",
  ];

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div
      className="home-wrap"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      style={{
        display: "flex", flexDirection: "column", height: "100vh", width: "100%",
        color: "var(--text-primary)", overflow: "hidden",
        fontFamily: "var(--font-body)",
      }}>
      <div className="grid-bg" />

      <Toast toasts={toasts} dismiss={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />

      {/* Premium Limit Modal */}
      <AnimatePresence>
        {showLimitModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, zIndex: 10000,
              background: "rgba(0,0,0,0.15)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              style={{
                width: "360px", background: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.6)",
                borderRadius: "24px", padding: "32px 24px", textAlign: "center",
                boxShadow: "0 24px 48px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.02)",
                backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)"
              }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "50%", background: "linear-gradient(135deg, #a78bfa, #818cf8)",
                display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", margin: "0 auto 20px",
                boxShadow: "0 8px 24px rgba(167,139,250,0.4)"
              }}>✨</div>
              <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px", color: "#111" }}>Daily Intelligence Limit Reached</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "24px", lineHeight: 1.6 }}>
                You've reached your daily quota for advanced AI insights. Upgrade to Pathora Pro for unlimited intelligence.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button style={{
                  padding: "12px", borderRadius: "12px", background: "linear-gradient(135deg, #818cf8, #a78bfa)",
                  color: "#fff", border: "none", fontSize: "14px", fontWeight: "600", cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(129,140,248,0.3)"
                }}>Upgrade Plan</button>
                <button 
                  onClick={() => setShowLimitModal(false)}
                  style={{
                  padding: "12px", borderRadius: "12px", background: "transparent", border: "none",
                  color: "var(--text-secondary)", fontSize: "14px", fontWeight: "500", cursor: "pointer",
                }}>Continue Tomorrow</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drag Overlay */}
      <AnimatePresence>
        {dragging && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "fixed", inset: 0, zIndex: 9998,
              background: "rgba(255,255,255,0.15)", backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "2px dashed rgba(129,140,248,0.4)",
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: "10px", pointerEvents: "none",
            }}>
            <div style={{ fontSize: "40px" }}>📎</div>
            <div style={{ fontSize: "18px", fontWeight: "600", color: "var(--accent-blue)" }}>
              Drop files to attach
            </div>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              PDF, DOCX, TXT, Images supported
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LAYOUT ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", paddingTop: "80px" }}>

        {/* ── SIDEBAR ── */}
        <AnimatePresence>
          {(sidebarOpen || !isMobile) && (
            <motion.aside
              initial={false}
              animate={{ 
                width: isMobile ? (sidebarOpen ? 240 : 0) : (sidebarOpen ? 240 : 0),
                opacity: sidebarOpen ? 1 : 0
              }}
              transition={{ type: "spring", stiffness: 350, damping: 35, bounce: 0 }}
              style={{
                display: "flex", flexDirection: "column", height: "100%", flexShrink: 0,
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                borderRight: "1px solid rgba(255,255,255,0.1)",
                overflow: "hidden", position: isMobile ? "absolute" : "relative",
                zIndex: 200, left: 0, top: 0,
                borderRadius: isMobile ? "0 20px 20px 0" : "0",
              }}>
            
              {/* Scrollable Area */}
              <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", display: "flex", flexDirection: "column", minWidth: "240px", paddingBottom: "12px", paddingTop: "8px" }}>
                
                {/* New Chat */}
                <div style={{ padding: "8px 10px 6px" }}>
                  <button 
                    onClick={handleNewChat}
                    style={{
                      width: "100%", height: "34px", borderRadius: "8px",
                      background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.06)",
                      display: "flex", alignItems: "center", padding: "0 10px", gap: "8px",
                      cursor: "pointer", color: "var(--text-secondary)",
                      transition: "all 0.15s ease", overflow: "hidden",
                      fontFamily: "var(--font-body)", fontSize: "12.5px", fontWeight: "500",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.07)"; e.currentTarget.style.color = "#111"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.04)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    New Chat
                  </button>
                </div>
            
                {/* Search */}
                <div style={{ padding: "0 10px 8px" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: "7px",
                    padding: "6px 10px", background: "rgba(0,0,0,0.03)",
                    border: "1px solid rgba(0,0,0,0.05)", borderRadius: "8px",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(124,58,237,0.06)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.05)"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                    <input 
                      type="text" 
                      placeholder="Search chats…"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      style={{
                        flex: 1, background: "none", border: "none", outline: "none",
                        color: "var(--text-primary)", fontSize: "12px", fontFamily: "var(--font-body)",
                        minWidth: 0
                      }}
                    />
                  </div>
                </div>

            
                {/* Chat History */}
                <div style={{ flex: 1, padding: "0 6px", paddingBottom: "8px" }}>
                  <div style={{ fontSize: "10px", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "6px", paddingLeft: "6px" }}>
                    Recent
                  </div>

                  {Object.entries(groupedChats).map(([groupName, groupChats]) => (
                    groupChats.length > 0 && (
                      <div key={groupName} style={{ marginBottom: "8px" }}>
                        <div style={{ fontSize: "10px", fontWeight: "600", color: "var(--text-muted)", paddingLeft: "6px", marginBottom: "2px", letterSpacing: "0.3px" }}>
                          {groupName}
                        </div>
                        {groupChats.map((s) => (
                          <div
                            key={s._id}
                            className="sidebar-item"
                            onClick={() => selectChat(s._id)}
                            style={{
                              padding: "7px 8px", borderRadius: "6px", cursor: "pointer",
                              marginBottom: "1px", display: "flex", alignItems: "center",
                              background: s._id === chatId ? "rgba(0,0,0,0.06)" : "transparent",
                              position: "relative",
                              transition: "background 0.12s ease",
                            }}
                            onMouseEnter={(e) => {
                              const btn = e.currentTarget.querySelector('.del-btn');
                              if(btn) btn.style.opacity = "1";
                            }}
                            onMouseLeave={(e) => {
                              const btn = e.currentTarget.querySelector('.del-btn');
                              if(btn) btn.style.opacity = "0";
                            }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{
                                fontSize: "12.5px", fontWeight: s._id === chatId ? "600" : "400",
                                color: s._id === chatId ? "#111" : "var(--text-secondary)",
                                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                              }}>{s.title || "New conversation"}</div>
                            </div>
                            <button
                              className="del-btn"
                              onClick={(e) => { e.stopPropagation(); delSession(s._id); }}
                              style={{
                                opacity: 0, width: "20px", height: "20px", borderRadius: "4px",
                                border: "none", background: "transparent", color: "var(--text-muted)",
                                cursor: "pointer", flexShrink: 0,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "opacity 0.15s",
                              }}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )
                  ))}

                </div>
              </div>
            
              {/* Sidebar Footer */}
              <div style={{ padding: "8px 10px", borderTop: "1px solid rgba(0,0,0,0.06)", minWidth: "240px", display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: firebaseUser ? "linear-gradient(135deg, #818cf8, #a78bfa)" : "rgba(0,0,0,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: firebaseUser ? "#fff" : "var(--text-muted)", fontWeight: "600", fontSize: "11px", flexShrink: 0,
                }}>
                  {firebaseUser?.displayName?.[0]?.toUpperCase() || firebaseUser?.email?.[0]?.toUpperCase() || "?"}
                </div>
                <div style={{ flex: 1, overflow: "hidden", whiteSpace: "nowrap" }}>
                  <div style={{ fontSize: "12px", fontWeight: "500", color: "#111", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {firebaseUser?.displayName || firebaseUser?.email?.split("@")[0] || "Guest"}
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ── MAIN ── */}
        <main style={{ position: "relative", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", background: "transparent" }}>
          {/* Floating Sidebar Toggle */}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              position: "absolute", top: "16px", left: "16px", zIndex: 300,
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)", cursor: "pointer", display: "flex", 
              alignItems: "center", justifyContent: "center", color: "var(--text-primary)", 
              padding: "8px", borderRadius: "8px", transition: "all 0.2s ease"
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="7" x2="14" y2="7" />
              <line x1="4" y1="17" x2="18" y2="17" />
            </svg>
          </button>

          {/* Error banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                style={{
                  display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px",
                  background: "rgba(248,113,113,0.08)", backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  borderBottom: "1px solid rgba(248,113,113,0.2)",
                  color: "#dc2626", fontSize: "13px",
                }}>
                <span>⚠</span>
                <span style={{ flex: 1 }}>{error}</span>
                <button onClick={() => setError(null)} style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: "14px" }}>✕</button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── CHAT BODY ── */}
          <div ref={chatBodyRef} style={{ flex: 1, overflowY: "auto", padding: "24px 0" }}>
            <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 20px" }}>

              {messages.length === 0 ? (
                /* Empty State */
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", minHeight: "52vh", gap: "24px", textAlign: "center",
                }}>
                  <div style={{
                    width: "60px", height: "60px", borderRadius: "18px",
                    background: "linear-gradient(135deg, #818cf8, #a78bfa)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 8px 32px rgba(129,140,248,0.3), 0 0 60px -10px rgba(129,140,248,0.2)",
                    animation: "float 5s ease-in-out infinite",
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
                      <path d="M2 17l10 5 10-5" stroke="#bfdbfe" strokeWidth="1.8" strokeLinejoin="round" />
                      <path d="M2 12l10 5 10-5" stroke="#dbeafe" strokeWidth="1.8" strokeLinejoin="round" />
                    </svg>
                  </div>

                  <div>
                    <h2 style={{
                      fontSize: "24px", fontWeight: "700", margin: "0 0 8px",
                      color: "var(--text-primary)", letterSpacing: "-0.5px",
                    }}>Pathora Intelligence Engine</h2>
                    <p style={{
                      fontSize: "14px", color: "var(--text-secondary)",
                      margin: "0 auto", maxWidth: "360px", lineHeight: "1.7",
                    }}>
                      Your AI career architect. Ask questions, upload your resume, or build a custom technical roadmap.
                    </p>
                  </div>

                  <div style={{
                    display: "flex", flexWrap: "wrap", gap: "8px",
                    justifyContent: "center", maxWidth: "500px",
                  }}>
                    {SUGGESTIONS.map((q, i) => (
                      <button
                        key={i}
                        className="chip btn"
                        onClick={() => setInput(q)}
                        style={{
                          padding: "6px 12px", borderRadius: "6px",
                          border: "1px solid rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.6)",
                          color: "var(--text-secondary)", fontSize: "12px", fontWeight: "500",
                          animation: `fade-in 0.3s ease ${i * 0.05}s both`,
                          transition: "all 0.2s",
                          cursor: "pointer"
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)"; e.currentTarget.style.color = "#111"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.6)"; e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m, idx) => {
                  const isUser = m.role === "user";
                  const content = m.reply || m.message || "";
                  const isLong = content.length > LONG_THRESHOLD;
                  const isExpanded = expandedMsgs[m.id];
                  const isCurrentlyStreaming = streamingId === m.id;

                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1], delay: idx * 0.02 }}
                      style={{
                        display: "flex", alignItems: "flex-start", gap: "12px",
                        marginBottom: "20px",
                        flexDirection: isUser ? "row-reverse" : "row",
                      }}>

                      <Avatar isUser={isUser} isStreaming={isCurrentlyStreaming} />

                      <div style={{ maxWidth: isUser ? "78%" : "95%", minWidth: 0 }}>
                        {/* Name + badge */}
                        {!isUser && (
                          <div style={{
                            display: "flex", alignItems: "center", gap: "6px",
                            marginBottom: "5px", fontSize: "11px",
                            color: "var(--text-muted)", fontWeight: "500",
                          }}>
                            <span>Neural AI</span>
                            {contextRemembered && idx > 0 && (
                              <span style={{
                                padding: "1px 7px", borderRadius: "var(--r-full)",
                                background: "#eff6ff", border: "1px solid #bfdbfe",
                                color: "var(--accent-blue)", fontSize: "10px",
                              }}>↻ Context aware</span>
                            )}
                          </div>
                        )}

                        {/* Bubble */}
                        <div style={{
                          padding: isUser ? "10px 16px" : "12px 16px",
                          borderRadius: isUser
                            ? "20px 20px 4px 20px"
                            : "20px 20px 20px 4px",
                          background: isUser ? "rgba(129,140,248,0.18)" : "rgba(255,255,255,0.4)",
                          border: isUser ? "1px solid rgba(129,140,248,0.3)" : "1px solid rgba(255,255,255,0.35)",
                          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                          fontSize: "14px", lineHeight: "1.7",
                          color: isUser ? "var(--user-text)" : "var(--text-primary)",
                          boxShadow: isUser
                            ? "0 4px 16px rgba(129,140,248,0.12), inset 0 1px 0 rgba(255,255,255,0.15)"
                            : "0 2px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.2)",
                          overflow: "hidden",
                          maxHeight: isLong && !isExpanded && !isUser ? "600px" : "none",
                          position: "relative",
                        }}>
                          {/* Gradient fade for collapsed long messages */}
                          {isLong && !isExpanded && !isUser && (
                            <div style={{
                              position: "absolute", bottom: 0, left: 0, right: 0, height: "80px",
                              background: "linear-gradient(transparent, var(--ai-bubble))",
                              pointerEvents: "none",
                            }} />
                          )}

                          {/* Thinking state */}
                          {m.isThinking ? (
                            <div>
                              <TypingDots />
                              <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
                                {(m.customSteps || THINKING_STEPS).slice(0, thinkingStep + 1).map((step, i) => (
                                  <motion.div 
                                    initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} 
                                    key={i} 
                                    style={{
                                      fontSize: "11px", color: i === thinkingStep ? "var(--accent-blue)" : "var(--text-muted)",
                                      display: "flex", alignItems: "center", gap: "6px",
                                      fontFamily: "var(--font-mono)",
                                      textShadow: i === thinkingStep ? "0 0 8px rgba(129,140,248,0.4)" : "none"
                                    }}>
                                    <span style={{ opacity: 0.6, fontSize: "14px" }}>{i === thinkingStep ? "›" : "✓"}</span>
                                    {step}
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div>
                              {isUser ? (
                                <div style={{ whiteSpace: "pre-wrap" }}>{m.message}</div>
                              ) : (
                                renderContent(m.reply || "", isCurrentlyStreaming)
                              )}
                              {isCurrentlyStreaming && (
                                <span style={{
                                  display: "inline-block", width: "2px", height: "16px",
                                  background: "linear-gradient(180deg, var(--accent-blue), var(--accent-violet))",
                                  marginLeft: "2px",
                                  verticalAlign: "text-bottom", borderRadius: "1px",
                                  animation: "cursor-blink 1s ease-in-out infinite",
                                  boxShadow: "0 0 6px rgba(129,140,248,0.4)",
                                }} />
                              )}
                            </div>
                          )}
                        </div>

                        {/* Expand/collapse */}
                        {isLong && !isUser && !isCurrentlyStreaming && (
                          <button
                            className="btn"
                            onClick={() => toggleExpand(m.id)}
                            style={{
                              width: "100%", padding: "5px", marginTop: "3px",
                              borderRadius: "var(--r-sm)", border: "1px solid var(--border)",
                              background: "var(--bg-surface)", color: "var(--text-muted)",
                              fontSize: "11px", cursor: "pointer",
                            }}>
                            {isExpanded ? "↑ Show less" : "↓ Show more"}
                          </button>
                        )}

                        {/* Meta actions */}
                        {!m.isThinking && content && (
                          <div style={{
                            display: "flex", alignItems: "center", gap: "2px",
                            marginTop: "5px",
                            flexDirection: isUser ? "row-reverse" : "row",
                          }}>
                            <button
                              className="meta-btn"
                              onClick={() => copyMsg(isUser ? m.message : m.reply)}
                              title="Copy">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </svg>
                              Copy
                            </button>

                            {!isUser && !isCurrentlyStreaming && (
                              <>
                                <MessageReactions
                                  onReact={(key) => handleReact(m.id, key)}
                                  reactions={reactions[m.id]}
                                />
                                <div style={{ flex: 1 }} />
                                {["Explain more", "Simplify"].map((label) => (
                                  <button
                                    key={label}
                                    className="meta-btn"
                                    onClick={() => setInput(`${label}: ${(m.reply || "").slice(0, 40)}…`)}>
                                    {label}
                                  </button>
                                ))}
                              </>
                            )}
                            <span style={{ fontSize: "10px", color: "var(--text-muted)", marginLeft: "4px" }}>
                              {m.time}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* ── INPUT AREA ── */}
          <div style={{
            padding: "12px 20px 16px", flexShrink: 0,
            background: "rgba(255,255,255,0.12)", borderTop: "1px solid rgba(255,255,255,0.2)",
            backdropFilter: "blur(40px) saturate(180%)", WebkitBackdropFilter: "blur(40px) saturate(180%)",
            boxShadow: "0 -2px 20px rgba(0,0,0,0.02)",
          }}>
            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

              {/* File chips */}
              <AnimatePresence>
                {selectedFiles.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "7px" }}>
                    {selectedFiles.map((f, i) => (
                      <FileCard
                        key={i} file={f} analyzing={loading}
                        onRemove={() => setSelectedFiles((p) => p.filter((_, j) => j !== i))} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input row */}
              <div style={{
                display: "flex", alignItems: "flex-end", gap: "8px",
                background: "rgba(255,255,255,0.45)",
                border: `1px solid ${inputFocused ? "rgba(129,140,248,0.5)" : "rgba(255,255,255,0.4)"}`,
                borderRadius: "20px",
                padding: "8px 10px 8px 16px",
                boxShadow: inputFocused
                  ? "0 0 0 3px rgba(129,140,248,0.12), 0 4px 24px rgba(124,58,237,0.08), inset 0 1px 2px rgba(255,255,255,0.3)"
                  : "0 2px 12px rgba(0,0,0,0.04), inset 0 1px 2px rgba(255,255,255,0.3)",
                transition: "border-color 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s cubic-bezier(0.4,0,0.2,1)",
                backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
              }}>
                {/* File attach */}
                <label style={{
                  width: "30px", height: "30px", borderRadius: "var(--r-sm)", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "var(--text-muted)",
                  transition: "color var(--transition)", fontSize: "15px",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-blue)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}>
                  <input
                    ref={fileInputRef} type="file" multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setSelectedFiles((p) => [...p, ...files]);
                      addToast(`${files.length} file(s) attached`);
                    }}
                    style={{ display: "none" }} />
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                </label>

                {/* Textarea */}
                <textarea
                  ref={textareaRef} rows={1} value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  disabled={loading}
                  placeholder={placeholderText}
                  style={{
                    flex: 1, background: "none", border: "none", outline: "none",
                    color: "var(--text-primary)", fontSize: "14px", lineHeight: "1.6",
                    resize: "none", minHeight: "22px", maxHeight: "160px",
                    fontFamily: "var(--font-body)", padding: "4px 0",
                  }} />

                {/* Clear input */}
                {input && (
                  <button
                    onClick={() => setInput("")}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: "var(--text-muted)", fontSize: "13px", padding: "0 4px",
                      flexShrink: 0, lineHeight: 1, transition: "color var(--transition)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}>✕</button>
                )}

                {/* Stop or Send */}
                {streaming ? (
                  <button
                    className="btn"
                    onClick={stopGeneration}
                    style={{
                      width: "36px", height: "36px", borderRadius: "12px", flexShrink: 0,
                      border: "1px solid rgba(248,113,113,0.3)", background: "rgba(248,113,113,0.12)",
                      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                      color: "#ef4444", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "12px", fontWeight: "700",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(248,113,113,0.2)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(248,113,113,0.12)"; }}
                  >■</button>
                ) : (
                  <button
                    className="btn send-btn"
                    onClick={handleSend}
                    disabled={loading || (!input.trim() && !selectedFiles.length)}
                    style={{
                      width: "36px", height: "36px", borderRadius: "12px", flexShrink: 0,
                      border: "none",
                      background: (loading || (!input.trim() && !selectedFiles.length))
                        ? "rgba(255,255,255,0.3)"
                        : "linear-gradient(135deg, #818cf8, #a78bfa)",
                      color: (loading || (!input.trim() && !selectedFiles.length))
                        ? "var(--text-muted)"
                        : "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                      boxShadow: (loading || (!input.trim() && !selectedFiles.length))
                        ? "none"
                        : "0 4px 16px rgba(129,140,248,0.3)",
                    }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22,2 15,22 11,13 2,9" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Footer hint */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                marginTop: "8px", fontSize: "11px", color: "var(--text-muted)", fontWeight: "500"
              }}>
                Pathora Intelligence Core Active
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}