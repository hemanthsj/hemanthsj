import { useState } from "react";

// Custom hook — encapsulates all chat state and API logic.
// The component that uses this hook never needs to know about fetch,
// message formatting, or error handling. It just calls sendMessage()
// and reads the returned state.
export function useChat(mode) {
  const [messages, setMessages] = useState({ career: [], blog: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentMessages = messages[mode.id];

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMsg = { role: "user", content: text.trim() };
    const updatedMsgs = [...currentMessages, userMsg];

    setMessages((m) => ({ ...m, [mode.id]: updatedMsgs }));
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(import.meta.env.VITE_WORKER_URL, {
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
      if (!res.ok || data.error) {
        const msg = data.error?.message || `API error ${res.status}`;
        setError(msg);
        setMessages((m) => ({ ...m, [mode.id]: currentMessages }));
        return;
      }
      const reply = data.content?.find((b) => b.type === "text")?.text || "No response.";
      setMessages((m) => ({
        ...m,
        [mode.id]: [...updatedMsgs, { role: "assistant", content: reply }],
      }));
    } catch (e) {
      setError(e.message || "Request failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => setMessages((m) => ({ ...m, [mode.id]: [] }));

  return { currentMessages, loading, error, sendMessage, clearChat };
}
