// A purely presentational component — receives text and accent color as props,
// renders formatted markdown-like content. No state, no side effects.
export function FormattedText({ text, accent }) {
  const lines = text.split("\n");
  return (
    <div style={{ lineHeight: 1.7 }}>
      {lines.map((line, i) => {
        if (line.startsWith("## "))
          return <div key={i} style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.05rem", fontWeight: 700, color: accent, marginTop: "1rem", marginBottom: "0.25rem" }}>{line.slice(3)}</div>;
        if (line.startsWith("# "))
          return <div key={i} style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.2rem", fontWeight: 700, color: accent, marginTop: "1rem", marginBottom: "0.25rem" }}>{line.slice(2)}</div>;
        if (line.startsWith("- ") || line.startsWith("• "))
          return <div key={i} style={{ paddingLeft: "1rem", position: "relative", marginBottom: "0.2rem" }}><span style={{ position: "absolute", left: 0, color: accent }}>›</span>{line.slice(2)}</div>;
        if (line.match(/^\d+\. /))
          return <div key={i} style={{ paddingLeft: "1.5rem", position: "relative", marginBottom: "0.2rem" }}>{line}</div>;
        if (line.startsWith("**") && line.endsWith("**"))
          return <div key={i} style={{ fontWeight: 700, color: "#e2e8f0", marginTop: "0.5rem" }}>{line.slice(2, -2)}</div>;
        if (line === "")
          return <div key={i} style={{ height: "0.5rem" }} />;
        return <div key={i} style={{ marginBottom: "0.15rem" }}>{line}</div>;
      })}
    </div>
  );
}
