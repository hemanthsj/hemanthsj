import { useState, useRef, useEffect } from "react";
import { MODES } from "./config/modes.js";
import { useChat } from "./hooks/useChat.js";
import { FormattedText } from "./components/FormattedText.jsx";
import { styles, css } from "./styles.js";

export default function App() {
  const [mode, setMode] = useState(MODES[0]);
  const [input, setInput] = useState("");
  const { currentMessages, loading, error, sendMessage, clearChat } = useChat(mode);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, loading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  const handleSend = () => {
    sendMessage(input);
    setInput("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
                <button key={s} style={styles.suggBtn} onClick={() => setInput(s)} className="sugg-btn">
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
            onClick={handleSend}
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
