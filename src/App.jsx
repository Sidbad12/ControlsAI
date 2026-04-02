import ReactMarkdown from "react-markdown";
import { useState, useRef } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// ── CONFIG ─────────────────────────────────────────────────────────────────
// Replace with your HuggingFace Spaces URL after deployment
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
  navyDark: "#001540",
  navyMid : "#003080",
  light   : "#EAEAEA",
  white   : "#FFFFFF",
  text    : "#1a1a1a",
  muted   : "#666666",
  border  : "#cccccc",
  accent  : "#0050c0",
  success : "#006400",
  error   : "#8B0000",
};

const s = {
  app: {
    minHeight    : "100vh",
    backgroundColor: colors.light,
    fontFamily   : "Calibri, Arial, sans-serif",
    color        : colors.text,
  },
  header: {
    backgroundColor: colors.navy,
    padding        : "16px 32px",
    display        : "flex",
    alignItems     : "center",
    justifyContent : "space-between",
    boxShadow      : "0 2px 8px rgba(0,0,0,0.3)",
  },
  logo: {
    color      : colors.white,
    fontSize   : "22px",
    fontWeight : "700",
    letterSpacing: "1px",
  },
  logoAccent: {
    color: "#6699ff",
  },
  badge: {
    backgroundColor: colors.navyMid,
    color          : "#aabbff",
    fontSize       : "11px",
    padding        : "3px 10px",
    borderRadius   : "12px",
    border         : "1px solid #334488",
  },
  main: {
    maxWidth : "900px",
    margin   : "0 auto",
    padding  : "32px 24px",
  },
  card: {
    backgroundColor: colors.white,
    borderRadius   : "8px",
    padding        : "24px",
    marginBottom   : "20px",
    boxShadow      : "0 1px 4px rgba(0,0,0,0.08)",
    border         : `1px solid ${colors.border}`,
  },
  label: {
    display      : "block",
    fontSize     : "12px",
    fontWeight   : "700",
    color        : colors.navy,
    marginBottom : "6px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  select: {
    width           : "100%",
    padding         : "10px 12px",
    border          : `1px solid ${colors.border}`,
    borderRadius    : "6px",
    fontSize        : "14px",
    backgroundColor : colors.white,
    color           : colors.text,
    marginBottom    : "16px",
    outline         : "none",
  },
  tabBar: {
    display      : "flex",
    gap          : "8px",
    marginBottom : "16px",
  },
  tab: (active) => ({
    padding        : "8px 20px",
    border         : `1px solid ${active ? colors.navy : colors.border}`,
    borderRadius   : "6px",
    backgroundColor: active ? colors.navy : colors.white,
    color          : active ? colors.white : colors.text,
    fontSize       : "13px",
    fontWeight     : active ? "700" : "400",
    cursor         : "pointer",
  }),
  textarea: {
    width          : "100%",
    padding        : "12px",
    border         : `1px solid ${colors.border}`,
    borderRadius   : "6px",
    fontSize       : "14px",
    fontFamily     : "Calibri, Arial, sans-serif",
    resize         : "vertical",
    minHeight      : "80px",
    outline        : "none",
    boxSizing      : "border-box",
  },
  monoArea: {
    width          : "100%",
    padding        : "12px",
    border         : `1px solid ${colors.border}`,
    borderRadius   : "6px",
    fontSize       : "12px",
    fontFamily     : "Consolas, monospace",
    resize         : "vertical",
    minHeight      : "120px",
    outline        : "none",
    backgroundColor: "#f8f8f8",
    boxSizing      : "border-box",
  },
  btn: {
    backgroundColor: colors.navy,
    color          : colors.white,
    border         : "none",
    borderRadius   : "6px",
    padding        : "12px 28px",
    fontSize       : "14px",
    fontWeight     : "700",
    cursor         : "pointer",
    marginTop      : "8px",
  },
  btnDisabled: {
    backgroundColor: colors.border,
    color          : colors.muted,
    border         : "none",
    borderRadius   : "6px",
    padding        : "12px 28px",
    fontSize       : "14px",
    fontWeight     : "700",
    cursor         : "not-allowed",
    marginTop      : "8px",
  },
  answerBox: {
    backgroundColor: "#f0f4ff",
    border         : `1px solid ${colors.accent}`,
    borderRadius   : "6px",
    padding        : "20px",
    marginBottom   : "16px",
    fontSize       : "14px",
    lineHeight     : "1.7",
  },
  sourceTag: {
    display        : "inline-block",
    backgroundColor: colors.navy,
    color          : colors.white,
    fontSize       : "11px",
    padding        : "3px 10px",
    borderRadius   : "4px",
    marginRight    : "6px",
    marginBottom   : "6px",
  },
  imageGrid: {
    display             : "grid",
    gridTemplateColumns : "repeat(auto-fill, minmax(200px, 1fr))",
    gap                 : "12px",
    marginTop           : "12px",
  },
  imgCard: {
    border      : `1px solid ${colors.border}`,
    borderRadius: "6px",
    overflow    : "hidden",
    backgroundColor: colors.white,
  },
  img: {
    width     : "100%",
    display   : "block",
    maxHeight : "160px",
    objectFit : "contain",
    backgroundColor: "#fafafa",
    padding   : "8px",
  },
  imgCaption: {
    fontSize  : "11px",
    color     : colors.muted,
    padding   : "6px 8px",
    borderTop : `1px solid ${colors.border}`,
  },
  latency: {
    fontSize : "12px",
    color    : colors.muted,
    marginTop: "8px",
  },
  error: {
    backgroundColor: "#fff0f0",
    border         : `1px solid ${colors.error}`,
    borderRadius   : "6px",
    padding        : "12px 16px",
    color          : colors.error,
    fontSize       : "13px",
  },
  sectionTitle: {
    fontSize     : "13px",
    fontWeight   : "700",
    color        : colors.navy,
    marginBottom : "10px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  spinner: {
    display        : "inline-block",
    width          : "18px",
    height         : "18px",
    border         : "3px solid #ddd",
    borderTop      : `3px solid ${colors.navy}`,
    borderRadius   : "50%",
    animation      : "spin 0.8s linear infinite",
    verticalAlign  : "middle",
    marginRight    : "8px",
  },
};


// ── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [mode,         setMode]         = useState("qa");
  const [query,        setQuery]        = useState("");
  const [mermaid,      setMermaid]      = useState("");
  const [version,      setVersion]      = useState("");
  const [loading,      setLoading]      = useState(false);
  const [response,     setResponse]     = useState(null);
  const [error,        setError]        = useState("");
  const [modalImg,     setModalImg]     = useState(null);

  const handleSubmit = async () => {
    const text = mode === "qa" ? query.trim() : mermaid.trim();
    if (!text) return;

    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const body = {
        query          : mode === "qa" ? query : "Generate programming guide for attached flowchart",
        mode,
        version_filter : version || null,
        mermaid_code   : mode === "flowchart" ? mermaid : null,
      };

      const res = await fetch(`${API_BASE}/query`, {
        method  : "POST",
        headers : { "Content-Type": "application/json" },
        body    : JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey) handleSubmit();
  };

  return (
    <div style={s.app}>
      {/* Img Modal */}
      {modalImg && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', cursor: 'zoom-out' }}
          onClick={() => setModalImg(null)}
        >
          <img src={modalImg} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }} />
        </div>
      )}

      {/* Header */}
      <div style={s.header}>
        <div style={s.logo}>
          CONTROLS<span style={s.logoAccent}>AI</span>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span style={s.badge}>S7-1200</span>
          <span style={s.badge}>v0.5</span>
        </div>
      </div>

      <div style={s.main}>

        {/* Input card */}
        <div style={s.card}>

          {/* Version selector */}
          <label style={s.label}>Firmware Version</label>
          <select
            style={s.select}
            value={version}
            onChange={(e) => setVersion(e.target.value)}
          >
            {VERSIONS.map(v => (
              <option key={v.value} value={v.value}>{v.label}</option>
            ))}
          </select>

          {/* Mode tabs */}
          <div style={s.tabBar}>
            <button style={s.tab(mode === "qa")}
              onClick={() => setMode("qa")}>
              Q&A
            </button>
            <button style={s.tab(mode === "flowchart")}
              onClick={() => setMode("flowchart")}>
              Flowchart → Code
            </button>
          </div>

          {/* Input */}
          {mode === "qa" ? (
            <>
              <label style={s.label}>Your Question</label>
              <textarea
                style={s.textarea}
                placeholder="e.g. How do I configure a TON timer? What causes the red light on S7-1200?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <div style={{ fontSize: "11px", color: colors.muted, marginTop: "4px" }}>
                Ctrl+Enter to submit
              </div>
            </>
          ) : (
            <>
              <label style={s.label}>Mermaid Flowchart</label>
              <textarea
                style={s.monoArea}
                placeholder={`flowchart TD\n    A[Start] --> B{Sensor Active?}\n    B -->|Yes| C[Start Motor]\n    B -->|No| D[Wait 5s]\n    D --> B\n    C --> E[Run Conveyor]`}
                value={mermaid}
                onChange={(e) => setMermaid(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </>
          )}

          <button
            style={loading ? s.btnDisabled : s.btn}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <span style={s.spinner} />
                Processing...
              </>
            ) : (
              mode === "qa" ? "Ask CONTROLSAI" : "Generate Code"
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={s.error}>
            Error: {error}
          </div>
        )}

        {/* Response */}
        {response && (
          <div style={s.card}>

            {/* Answer */}
            <div style={s.sectionTitle}>Answer</div>
            <div style={s.answerBox}>
              <ReactMarkdown
                components={{
                  code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '')
                    // SCL (Structured Control Language) is extremely similar to Pascal 
                    const lang = match ? (match[1].toLowerCase() === 'scl' ? 'pascal' : match[1]) : '';
                    return !inline && match ? (
                      <SyntaxHighlighter
                        {...props}
                        style={vscDarkPlus}
                        language={lang}
                        PreTag="div"
                        customStyle={{ borderRadius: '6px', fontSize: '13px', margin: '0' }}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code {...props} className={className} style={{ backgroundColor: '#d0d8f0', padding: '2px 5px', borderRadius: '4px', fontSize: '13px', color: '#002060' }}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {response.answer}
              </ReactMarkdown>
            </div>

            {/* Latency */}
            <div style={s.latency}>
              Response time: {response.latency_ms}ms
              {response.version_used && ` | Version: ${response.version_used}`}
            </div>

            {/* Sources */}
            {response.sources?.length > 0 && (
              <div style={{ marginTop: "16px" }}>
                <div style={s.sectionTitle}>Sources</div>
                {response.sources.map((src, i) => (
                  <span key={i} style={s.sourceTag}>
                    {src.section?.slice(0, 40)} | {src.version} | p.{src.pages?.join(",")}
                  </span>
                ))}
              </div>
            )}

            {/* Images */}
            {response.images?.length > 0 && (
              <div style={{ marginTop: "16px" }}>
                <div style={s.sectionTitle}>
                  Relevant Diagrams ({response.images.length})
                </div>
                <div style={s.imageGrid}>
                  {response.images.map((img, i) => (
                    <div key={i} style={s.imgCard}>
                      <img
                        src={`${API_BASE}${img.image_url}`}
                        alt={img.caption || `Diagram ${i + 1}`}
                        style={{ ...s.img, cursor: 'zoom-in' }}
                        onClick={() => setModalImg(`${API_BASE}${img.image_url}`)}
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                      {img.caption && (
                        <div style={s.imgCaption}><strong>Diagram:</strong> {img.caption}</div>
                      )}
                      {img.explanation && (
                        <div style={{ ...s.imgCaption, borderTop: "none", color: colors.text, fontStyle: "italic", backgroundColor: "#f9f9f9" }}>
                          <span style={{color: colors.accent, fontWeight: "bold"}}>Relevance:</span> {img.explanation}
                        </div>
                      )}
                      <div style={{ ...s.imgCaption, borderTop: `1px solid ${colors.border}` }}>
                        Page {img.page}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      <style>{`
        @keyframes spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        * { box-sizing: border-box; }
        body { margin: 0; }
        textarea:focus, select:focus { border-color: #002060; }
      `}</style>
    </div>
  );
}
