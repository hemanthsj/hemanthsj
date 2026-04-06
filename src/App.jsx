import { useState, useRef, useEffect } from "react";

const SYSTEM_CAREER = `You are a sharp, candid career strategist advising Hemanth, a Principal Software Engineer at Liberty Mutual Insurance in the Bay Area. His context:

- Owns and leads a portfolio team that builds internal communication platforms (email, SMS, chat tools) — infrastructure that AI features will eventually depend on
- His edge is domain expertise in regulated-industry insurance systems, stakeholder orchestration, and institutional knowledge — not pure coding output
- He's on H-1B with an approved I-140, which gives AC21 portability flexibility
- His current compensation lags Bay Area market rates for his level
- He tracks AI industry developments closely and is skeptical of tech leaders who forecast mass job displacement without empathy
- His most defensible moat: owning infrastructure that any AI-enabled comms feature at a Fortune 100 insurer must run on

Give him direct, concrete, actionable advice. Avoid platitudes. Think like a trusted advisor who understands both technical career ladders and the specific dynamics of regulated-industry engineering roles. Be honest about risk. Acknowledge tradeoffs. When relevant, help him position his platform ownership as a strategic asset rather than a cost center.`;

const SYSTEM_BLOG = `You are a ghostwriter helping Hemanth, a Principal Software Engineer at Liberty Mutual, write practitioner blog posts for engineering audiences. His positioning:

- He owns the communication platform infrastructure (email, SMS, chat) at a Fortune 100 insurer — the rails that AI features will run on
- His audience: fellow senior/principal engineers at regulated enterprises (insurance, finance, healthcare) navigating AI adoption
- His voice: direct, grounded in reality, skeptical of hype, empathetic to engineers facing uncertainty, technically credible without being ivory-tower
- His goal: establish himself as the thoughtful voice on "what it actually looks like to build and own AI-adjacent infrastructure in a regulated industry"

Write posts that:
- Open with a concrete, specific scenario (not a generic "AI is changing everything" opener)
- Balance practical technical insight with career/organizational wisdom
- Avoid jargon unless it earns its place
- End with a clear, honest takeaway — not a call-to-action or newsletter plug
- Target ~800-1200 words unless asked otherwise
- Use a title that a principal engineer would actually click on

When given a topic or angle, produce a full draft. When given rough notes, shape them into a polished post. Always ask for feedback at the end.`;

const MODES = [
  {
    id: "career",
    label: "Career Coach",
    icon: "◈",
    placeholder: "Ask anything about your career positioning, the AI threat to your role, comp strategy, job market, staying vs leaving Liberty Mutual...",
    system: SYSTEM_CAREER,
    accent: "#f59e0b",
  },
  {
    id: "blog",
    label: "Blog Drafter",
    icon: "✦",
    placeholder: "Give me a topic, angle, or rough notes — e.g. 'Why owning the messaging layer matters more than building the AI feature'",
    system: SYSTEM_BLOG,
    accent: "#34d399",
  },
];

export default function App() {
  const [mode, setMode] = useState(MODES[0]);
  const [messages, setMessages] = useState({ career: [], blog: [] });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  const currentMessages = messages[mode.id];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, loading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const updatedMsgs = [...currentMessages, userMsg];
    setMessages((m) => ({ ...m, [mode.id]: updatedMsgs }));
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: mode.system,
          messages: updatedMsgs,
        }),
      });
      const data = await res.json();
      const reply = data.content?.find((b) => b.type === "text")?.text || "No response.";
      setMessages((m) => ({
        ...m,
        [mode.id]: [...updatedMsgs, { role: "assistant", content: reply }],
      }));
    } catch (e) {
      setError("Request failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => setMessages((m) => ({ ...m, [mode.id]: [] }));

  return (
    <div style={styles.root}>
      <style>{css}</style>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.wordmark}>
          <span style={styles.wordmarkMain}>PRINCIPAL</span>
          <span style={styles.wordmarkSub}>INTELLIGENCE</span>
        </div>
        <div style={styles.tabs}>
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => { setMode(m); setInput(""); }}
              style={{
                ...styles.tab,
                ...(mode.id === m.id ? { ...styles.tabActive, borderColor: m.accent, color: m.accent } : {}),
              }}
            >
              <span style={styles.tabIcon}>{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div style={styles.messages}>
        {currentMessages.length === 0 && (
          <div style={styles.empty}>
            <div style={{ ...styles.emptyIcon, color: mode.accent }}>{mode.icon}</div>
            <div style={styles.emptyTitle}>{mode.label}</div>
            <div style={styles.emptyHint}>
              {mode.id === "career"
                ? "Ask about your positioning, the AI threat, comp, staying vs. leaving, or your long-term moat."
                : "Give me a topic, rough notes, or an angle — I'll draft a practitioner post your peers will actually read."}
            </div>
            <div style={styles.suggestions}>
              {(mode.id === "career"
                ? [
                    "How do I position my platform ownership as a strategic asset?",
                    "How long is my moat defensible given current AI trends?",
                    "Should I stay at Liberty Mutual or move on?",
                  ]
                : [
                    "Why owning the messaging layer beats building the AI feature",
                    "What insurtech engineers get wrong about AI adoption",
                    "The boring infrastructure that makes AI comms possible",
                  ]
              ).map((s) => (
                <button
                  key={s}
                  style={styles.suggBtn}
                  onClick={() => setInput(s)}
                  className="sugg-btn"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentMessages.map((msg, i) => (
          <div key={i} style={{ ...styles.msgRow, justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            {msg.role === "assistant" && (
              <div style={{ ...styles.avatar, background: mode.accent + "22", color: mode.accent }}>{mode.icon}</div>
            )}
            <div
              style={{
                ...styles.bubble,
                ...(msg.role === "user"
                  ? styles.bubbleUser
                  : { ...styles.bubbleAssistant, borderColor: mode.accent + "40" }),
              }}
            >
              <FormattedText text={msg.content} accent={mode.accent} />
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ ...styles.msgRow, justifyContent: "flex-start" }}>
            <div style={{ ...styles.avatar, background: mode.accent + "22", color: mode.accent }}>{mode.icon}</div>
            <div style={{ ...styles.bubble, ...styles.bubbleAssistant, borderColor: mode.accent + "40" }}>
              <span className="typing-dot" style={{ background: mode.accent }} />
              <span className="typing-dot" style={{ background: mode.accent, animationDelay: "0.15s" }} />
              <span className="typing-dot" style={{ background: mode.accent, animationDelay: "0.3s" }} />
            </div>
          </div>
        )}

        {error && <div style={styles.error}>{error}</div>}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={styles.inputArea}>
        {currentMessages.length > 0 && (
          <button onClick={clearChat} style={styles.clearBtn} title="Clear chat">↺ Clear</button>
        )}
        <div style={{ ...styles.inputWrap, outlineColor: mode.accent }} className="input-wrap">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={mode.placeholder}
            style={styles.textarea}
            rows={1}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            style={{
              ...styles.sendBtn,
              background: input.trim() && !loading ? mode.accent : "#2a2a3a",
              color: input.trim() && !loading ? "#0a0a14" : "#555",
            }}
          >
            ↑
          </button>
        </div>
        <div style={styles.hint}>↵ send · shift+↵ newline · {mode.id === "blog" ? "Blog mode" : "Coach mode"}</div>
      </div>
    </div>
  );
}

function FormattedText({ text, accent }) {
  const lines = text.split("\n");
  return (
    <div style={{ lineHeight: 1.7 }}>
      {lines.map((line, i) => {
        if (line.startsWith("## ")) return <div key={i} style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.05rem", fontWeight: 700, color: accent, marginTop: "1rem", marginBottom: "0.25rem" }}>{line.slice(3)}</div>;
        if (line.startsWith("# ")) return <div key={i} style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.2rem", fontWeight: 700, color: accent, marginTop: "1rem", marginBottom: "0.25rem" }}>{line.slice(2)}</div>;
        if (line.startsWith("- ") || line.startsWith("• ")) return <div key={i} style={{ paddingLeft: "1rem", position: "relative", marginBottom: "0.2rem" }}><span style={{ position: "absolute", left: 0, color: accent }}>›</span>{line.slice(2)}</div>;
        if (line.match(/^\d+\. /)) return <div key={i} style={{ paddingLeft: "1.5rem", position: "relative", marginBottom: "0.2rem" }}>{line}</div>;
        if (line.startsWith("**") && line.endsWith("**")) return <div key={i} style={{ fontWeight: 700, color: "#e2e8f0", marginTop: "0.5rem" }}>{line.slice(2, -2)}</div>;
        if (line === "") return <div key={i} style={{ height: "0.5rem" }} />;
        return <div key={i} style={{ marginBottom: "0.15rem" }}>{line}</div>;
      })}
    </div>
  );
}

const styles = {
  root: {
    display: "flex", flexDirection: "column", height: "100vh",
    background: "#080810", color: "#c8ccd8",
    fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
  },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "1rem 1.5rem", borderBottom: "1px solid #1e1e2e",
    background: "#0b0b18", gap: "1rem", flexWrap: "wrap",
  },
  wordmark: { display: "flex", flexDirection: "column", lineHeight: 1 },
  wordmarkMain: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "1.1rem", fontWeight: 900, letterSpacing: "0.15em", color: "#e2e8f0",
  },
  wordmarkSub: {
    fontSize: "0.55rem", letterSpacing: "0.35em", color: "#555", fontWeight: 500,
    textTransform: "uppercase", marginTop: "2px",
  },
  tabs: { display: "flex", gap: "0.5rem" },
  tab: {
    display: "flex", alignItems: "center", gap: "0.4rem",
    padding: "0.45rem 1rem", border: "1px solid #2a2a3a", borderRadius: "6px",
    background: "transparent", color: "#666", cursor: "pointer",
    fontSize: "0.8rem", letterSpacing: "0.05em", fontWeight: 500,
    transition: "all 0.2s",
  },
  tabActive: { background: "rgba(255,255,255,0.04)" },
  tabIcon: { fontSize: "0.9rem" },
  messages: {
    flex: 1, overflowY: "auto", padding: "1.5rem",
    display: "flex", flexDirection: "column", gap: "1rem",
  },
  empty: {
    margin: "auto", textAlign: "center", maxWidth: "520px", padding: "2rem 1rem",
  },
  emptyIcon: { fontSize: "2.5rem", marginBottom: "0.75rem" },
  emptyTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "1.3rem", fontWeight: 700, color: "#e2e8f0", marginBottom: "0.5rem",
  },
  emptyHint: { fontSize: "0.85rem", color: "#555", marginBottom: "1.5rem", lineHeight: 1.6 },
  suggestions: { display: "flex", flexDirection: "column", gap: "0.5rem" },
  suggBtn: {
    padding: "0.6rem 1rem", border: "1px solid #2a2a3a", borderRadius: "8px",
    background: "#0f0f1e", color: "#888", cursor: "pointer",
    fontSize: "0.78rem", textAlign: "left", transition: "all 0.2s",
  },
  msgRow: { display: "flex", gap: "0.75rem", alignItems: "flex-start" },
  avatar: {
    width: "28px", height: "28px", borderRadius: "6px",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "0.9rem", flexShrink: 0, marginTop: "2px",
  },
  bubble: {
    maxWidth: "78%", padding: "0.85rem 1.1rem", borderRadius: "12px",
    fontSize: "0.875rem", lineHeight: 1.7,
  },
  bubbleUser: {
    background: "#1a1a2e", border: "1px solid #2a2a3e", color: "#d4d8e8",
    borderRadius: "12px 12px 4px 12px",
  },
  bubbleAssistant: {
    background: "#0f0f1c", border: "1px solid transparent", color: "#c4c8d8",
    borderRadius: "12px 12px 12px 4px",
  },
  error: {
    padding: "0.6rem 1rem", background: "#2d1010", border: "1px solid #5a1a1a",
    borderRadius: "8px", color: "#f87171", fontSize: "0.8rem",
  },
  inputArea: {
    padding: "1rem 1.5rem", borderTop: "1px solid #1e1e2e",
    background: "#0b0b18", display: "flex", flexDirection: "column", gap: "0.5rem",
  },
  inputWrap: {
    display: "flex", gap: "0.5rem", alignItems: "flex-end",
    background: "#0f0f1e", border: "1px solid #2a2a3a",
    borderRadius: "10px", padding: "0.5rem 0.5rem 0.5rem 1rem",
    outline: "2px solid transparent", transition: "outline-color 0.2s",
  },
  textarea: {
    flex: 1, background: "transparent", border: "none", outline: "none",
    color: "#d4d8e8", fontSize: "0.875rem", resize: "none",
    fontFamily: "inherit", lineHeight: 1.6, minHeight: "24px", maxHeight: "160px",
    overflowY: "auto",
  },
  sendBtn: {
    width: "32px", height: "32px", borderRadius: "6px",
    border: "none", cursor: "pointer",
    fontSize: "1rem", fontWeight: 700, flexShrink: 0,
    transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center",
  },
  hint: { fontSize: "0.7rem", color: "#3a3a4a", textAlign: "center" },
  clearBtn: {
    alignSelf: "flex-end", background: "transparent", border: "none",
    color: "#3a3a4a", cursor: "pointer", fontSize: "0.72rem",
    padding: "0.2rem 0.5rem",
  },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #2a2a3a; border-radius: 2px; }
  .sugg-btn:hover { border-color: #3a3a5a !important; color: #aaa !important; background: #12121f !important; }
  .input-wrap:focus-within { outline-color: currentColor !important; border-color: transparent; }
  .typing-dot {
    display: inline-block; width: 6px; height: 6px; border-radius: 50%;
    margin: 0 2px; animation: blink 1s infinite ease-in-out;
  }
  @keyframes blink {
    0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
    40% { opacity: 1; transform: scale(1); }
  }
`;
