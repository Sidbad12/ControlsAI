import ReactMarkdown from "react-markdown";
import { useState, useRef, useEffect } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// ── CONFIG ─────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:7860";

const VERSIONS = [
  { value: "",          label: "All Versions" },
  { value: "G2-V1.0",  label: "G2 V1.0 (2024+)" },
  { value: "G1-V4.7",  label: "G1 V4.7 (Current)" },
  { value: "G1-V3.0",  label: "G1 V3.0 (Legacy)" },
  { value: "G1-V2.2",  label: "G1 V2.2 (Legacy)" },
];

// ── STYLES ─────────────────────────────────────────────────────────────────
const colors = {
  navy    : "#002060",
  navyDark: "#001030",
  navyMid : "#001b4d",
  light   : "#F5F7FA",
  white   : "#FFFFFF",
  text    : "#1a1a1a",
  muted   : "#718096",
  border  : "#E2E8F0",
  accent  : "#0050c0",
  success : "#48BB78",
  error   : "#F56565",
  bubbleUser: "#002060",
  bubbleAI: "#FFFFFF",
};

const s = {
  app: {
    display: "flex",
    height : "100vh",
    fontFamily: "Calibri, Segoe UI, Arial, sans-serif",
    backgroundColor: colors.light,
    color: colors.text,
  },
  sidebar: {
    width: "260px",
    backgroundColor: colors.navyDark,
    display: "flex",
    flexDirection: "column",
    color: colors.white,
    borderRight: "1px solid #000c24",
    flexShrink: 0,
  },
  sidebarHeader: {
    padding: "20px",
    borderBottom: "1px solid #000c24",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "700",
    letterSpacing: "1px",
    marginBottom: "16px",
  },
  logoAccent: { color: "#6699ff" },
  newBtn: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #334488",
    backgroundColor: colors.navyMid,
    color: "#aabbff",
    fontSize: "13px",
    fontWeight: "600",
    textAlign: "left",
    cursor: "pointer",
    marginBottom: "8px",
    transition: "background 0.2s",
  },
  sessionList: {
    flex: 1,
    overflowY: "auto",
    padding: "12px",
  },
  sessionItem: (active) => ({
    padding: "10px 12px",
    borderRadius: "6px",
    fontSize: "13px",
    backgroundColor: active ? colors.navyMid : "transparent",
    color: active ? colors.white : "#cbd5e0",
    cursor: "pointer",
    marginBottom: "4px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    transition: "0.2s",
  }),
  sidebarFooter: {
    padding: "20px",
    borderTop: "1px solid #000c24",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  chatArea: {
    flex: 1,
    overflowY: "auto",
    padding: "24px 0",
    display: "flex",
    flexDirection: "column",
  },
  chatContainer: {
    maxWidth: "800px",
    width: "90%",
    margin: "0 auto",
  },
  bubble: (role) => ({
    maxWidth: "85%",
    padding: "16px",
    borderRadius: role === "user" ? "12px 12px 0 12px" : "12px 12px 12px 0",
    alignSelf: role === "user" ? "flex-end" : "flex-start",
    backgroundColor: role === "user" ? colors.bubbleUser : colors.bubbleAI,
    color: role === "user" ? colors.white : colors.text,
    marginBottom: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    fontSize: "14px",
    lineHeight: "1.6",
    border: role === "user" ? "none" : `1px solid ${colors.border}`,
  }),
  inputArea: {
    borderTop: `1px solid ${colors.border}`,
    padding: "24px",
    backgroundColor: colors.white,
  },
  inputWrap: {
    maxWidth: "800px",
    width: "90%",
    margin: "0 auto",
    position: "relative",
  },
  textarea: {
    width: "100%",
    padding: "14px 45px 14px 16px",
    borderRadius: "8px",
    border: `1px solid ${colors.border}`,
    fontSize: "14px",
    fontFamily: "inherit",
    resize: "none",
    outline: "none",
    maxHeight: "200px",
    overflowY: "auto",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  sendBtn: {
    position: "absolute",
    right: "10px",
    bottom: "10px",
    background: colors.navy,
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "6px 12px",
    cursor: "pointer",
    fontWeight: "700",
  },
  labelFixed: {
    fontSize: "11px",
    fontWeight: "700",
    color: colors.navy,
    textTransform: "uppercase",
    marginBottom: "4px",
    display: "block",
  },
  selectMini: {
    width: "100%",
    padding: "6px",
    fontSize: "11px",
    backgroundColor: "#000c24",
    border: "1px solid #334488",
    color: "white",
    borderRadius: "4px",
    outline: "none",
  },
  sourceTag: {
    display: "inline-block",
    backgroundColor: colors.navy,
    color: colors.white,
    fontSize: "10px",
    padding: "2px 8px",
    borderRadius: "4px",
    marginRight: "4px",
    marginTop: "8px",
  },
  imageCard: {
    border: `1px solid ${colors.border}`,
    borderRadius: "8px",
    overflow: "hidden",
    marginTop: "12px",
    backgroundColor: colors.white,
  },
  spinner: {
    width: "14px",
    height: "14px",
    border: "2px solid #ddd",
    borderTopColor: colors.navy,
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    display: "inline-block",
  }
};

// ── UTILS ───────────────────────────────────────────────────────────────────
const generateId = () => Math.random().toString(36).substr(2, 9);

export default function App() {
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem("controlsai_sessions");
    return saved ? JSON.parse(saved) : [{ 
      id: generateId(), 
      title: "New Chat", 
      mode: "qa", 
      messages: [] 
    }];
  });
  const [activeId, setActiveId] = useState(sessions[0]?.id);
  const [version, setVersion] = useState("");
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [modalImg, setModalImg] = useState(null);

  const inputRef = useRef(null);
  const chatEndRef = useRef(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem("controlsai_sessions", JSON.stringify(sessions));
  }, [sessions]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessions, activeId, loading]);

  // Handle auto-resize
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input]);

  const activeSession = sessions.find(s => s.id === activeId) || sessions[0];

  const handleNewSession = (mode) => {
    const newSession = {
      id: generateId(),
      title: mode === "qa" ? "New Chat" : "Flowchart Task",
      mode: mode,
      messages: []
    };
    setSessions([newSession, ...sessions]);
    setActiveId(newSession.id);
    setInput("");
  };

  const handleSwitchSession = (id) => {
    setActiveId(id);
    setInput("");
  };

  const handleSubmit = async () => {
    const text = input.trim();
    if (!text || loading) return;

    // Add user message
    const userMsg = { role: "user", content: text, timestamp: Date.now() };
    const updatedSessions = sessions.map(s => 
      s.id === activeId 
      ? { ...s, messages: [...s.messages, userMsg], title: s.messages.length === 0 ? text.slice(0, 30) + (text.length > 30 ? "..." : "") : s.title }
      : s
    );
    setSessions(updatedSessions);
    setInput("");
    setLoading(true);

    try {
      const hiddenRules = `\n\n%% IMPORTANT SYSTEM OVERRIDE:\n%% 1. Output ONE cohesive, complete Structured Text (SCL) Function/Function Block at the very top.\n%% 2. STRICTLY use Siemens S7-1200 SCL syntax. No generic "PROGRAM" blocks.\n%% 3. Use proper instance calls for timers, e.g., "Timer_DB".TON(...)`;

      const body = {
        query: activeSession.mode === "qa" ? text : "Generate programming guide for attached flowchart",
        mode: activeSession.mode,
        version_filter: version || null,
        mermaid_code: activeSession.mode === "flowchart" ? text + hiddenRules : null,
      };

      const res = await fetch(`${API_BASE}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`Server Error: ${res.status}`);

      const data = await res.json();
      
      const assistantMsg = {
        role: "assistant",
        content: data.answer,
        sources: data.sources || [],
        images: data.images || [],
        latency: data.latency_ms,
        timestamp: Date.now()
      };

      setSessions(prev => prev.map(s => 
        s.id === activeId ? { ...s, messages: [...s.messages, assistantMsg] } : s
      ));
    } catch (err) {
      const errorMsg = { role: "assistant", content: `**Error:** ${err.message}`, isError: true };
      setSessions(prev => prev.map(s => 
        s.id === activeId ? { ...s, messages: [...s.messages, errorMsg] } : s
      ));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div style={s.app}>
      {/* Img Modal */}
      {modalImg && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', cursor: 'pointer' }} onClick={() => setModalImg(null)}>
          <img src={modalImg} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} alt="Zoomed" />
        </div>
      )}

      {/* Sidebar */}
      <div style={s.sidebar}>
        <div style={s.sidebarHeader}>
          <div style={s.logo}>CONTROLS<span style={s.logoAccent}>AI</span></div>
          <button style={s.newBtn} onClick={() => handleNewSession("qa")}>+ New Chat</button>
          <button style={s.newBtn} onClick={() => handleNewSession("flowchart")}>+ New Flowchart</button>
        </div>
        
        <div style={s.sessionList}>
          {sessions.map(sess => (
            <div 
              key={sess.id} 
              style={s.sessionItem(sess.id === activeId)}
              onClick={() => handleSwitchSession(sess.id)}
            >
              {sess.mode === "flowchart" ? "󱡠 " : "󰭹 "} {sess.title}
            </div>
          ))}
        </div>

        <div style={s.sidebarFooter}>
          <label style={s.labelFixed}>Hardware Version</label>
          <select style={s.selectMini} value={version} onChange={(e) => setVersion(e.target.value)}>
            {VERSIONS.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
          </select>
          <div style={{ fontSize: "10px", marginTop: "12px", color: "#4a5568" }}>v1.0 Release Candidate</div>
        </div>
      </div>

      {/* Main Content */}
      <div style={s.main}>
        <div style={s.chatArea}>
          <div style={s.chatContainer}>
            {activeSession.messages.length === 0 && (
              <div style={{ textAlign: "center", color: colors.muted, marginTop: "100px" }}>
                <h2 style={{ color: colors.navy }}>Welcome to ControlsAI</h2>
                <p>Selected Mode: **{activeSession.mode === "qa" ? "Q&A System" : "Flowchart to Code"}**</p>
                <p style={{ fontSize: "13px" }}>Ask a technical question about S7-1200 or paste a Mermaid flowchart to begin.</p>
              </div>
            )}
            
            {activeSession.messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={s.bubble(m.role)}>
                  <ReactMarkdown
                    components={{
                      code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '');
                        let lang = match ? match[1].toLowerCase() : 'text';
                        if (['scl','st','ladder'].includes(lang)) lang = 'pascal';
                        return !inline ? (
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={lang}
                            PreTag="div"
                            wrapLongLines={true}
                            customStyle={{ borderRadius: '6px', fontSize: '13px', margin: '0' }}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code {...props} style={{ backgroundColor: m.role === 'user' ? '#003380' : '#edf2f7', padding: '2px 4px', borderRadius: '3px', color: m.role === 'user' ? 'white' : colors.navy, fontSize: '90%' }}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {m.content.replace(/\[Source \d+\s*\|[\s\S]*?Pages\s*\[.*?\]\]\s*/g, '')}
                  </ReactMarkdown>

                  {m.sources?.length > 0 && (
                    <div style={{ marginTop: "12px", borderTop: "1px dashed #cbd5e0", paddingTop: "8px" }}>
                      {m.sources.map((src, si) => (
                        <span key={si} style={s.sourceTag}>
                          {src.section?.slice(0, 30)} | p.{src.pages?.join(",")}
                        </span>
                      ))}
                    </div>
                  )}

                  {m.images?.map((img, ii) => (
                    <div key={ii} style={s.imageCard}>
                      <img 
                        src={`${API_BASE}${img.image_url}`} 
                        alt="Diagram"
                        style={{ width: '100%', cursor: 'zoom-in' }} 
                        onClick={() => setModalImg(`${API_BASE}${img.image_url}`)}
                      />
                      <div style={{ padding: "6px 10px", fontSize: "11px", backgroundColor: "#f8f9fa", fontStyle: "italic" }}>
                        {img.caption || img.explanation}
                      </div>
                    </div>
                  ))}

                  {m.latency && (
                    <div style={{ fontSize: "10px", color: colors.muted, marginTop: "8px", textAlign: "right" }}>
                      {m.latency}ms
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div style={s.bubble("assistant")}>
                <div style={s.spinner} /> <span style={{ marginLeft: "8px", fontSize: "13px" }}>Retrieving technical context...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div style={s.inputArea}>
          <div style={s.inputWrap}>
            <textarea
              ref={inputRef}
              style={s.textarea}
              rows={1}
              placeholder={activeSession.mode === "qa" ? "Ask a question..." : "Paste Mermaid flowchart..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button style={s.sendBtn} onClick={handleSubmit} disabled={loading || !input.trim()}>
              Send
            </button>
          </div>
          <div style={{ textAlign: "center", fontSize: "11px", color: colors.muted, marginTop: "8px" }}>
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e0; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #a0aec0; }
      `}</style>
    </div>
  );
}
