export const styles = {
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

export const css = `
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
