import { useState, useRef, useEffect } from "react";

// ===== FRAMEWORK MATRIX =====
// Heatmap of the recommendation table: which frameworks come up for which role (or question).
// Everything is derived from the props, so new frameworks, roles or goals show up automatically.

// Single-hue sequential ramp (OKLCH hue 255, L 0.40 -> 0.84), dark surface: more = lighter.
const RAMP = ["#2d496d", "#345d90", "#4072b1", "#5188cd", "#6b9fe1", "#8ab6ef", "#accdf8"];
// Marker ink per ramp step, picked for contrast >= 3.9:1 against the cell.
const INK = ["#e8f0f8", "#e8f0f8", "#e8f0f8", "#0a0e17", "#0a0e17", "#0a0e17", "#0a0e17"];
const EMPTY = "rgba(255,255,255,0.025)";

const RANK_LABELS = { primary: "Start here", secondary: "Then layer in", tertiary: "For depth" };
const RANKS = Object.keys(RANK_LABELS);

// Short column/row labels so seven columns fit; anything missing falls back to the full label.
const SHORT = {
  product: "Product", policy: "Policy", researcher: "Research", ethics: "Ethics", leadership: "Leadership", funder: "Funder", curious: "Exploring",
  detect: "Detect", compare: "Compare", communicate: "Communicate", measure: "Measure", future: "Anticipate", unsure: "Orienting",
};
const SHORT_FW = {
  scientific: "Scientific Indicators", precautionary: "Precautionary", iit: "IIT 4.0", tom: "Theory of Mind", functionalist: "Functionalist Welfare",
  gwt: "Global Workspace", hot: "Higher-Order", rpf: "Recurrent Processing", embodied: "Embodied", moral_status: "Moral Status",
};

const mono = "'JetBrains Mono', monospace";
const LABEL_W = 150;
const COL_W = 70; // fits "Leadership" / "Communicate" at 10px mono
// Row labels stay put while the grid scrolls sideways on narrow screens. The opaque background only
// approximates the card surface, so it is applied only when the grid actually overflows.
const STICKY = { position: "sticky", left: 0, zIndex: 1, background: "#171d2e" };

function buildMatrix(axis, { frameworkKeys, roles, goals, getRecommendation }) {
  const columns = axis === "role" ? roles : goals;
  const others = axis === "role" ? goals : roles;
  const cells = {};
  for (const fw of frameworkKeys) {
    cells[fw] = {};
    for (const col of columns) {
      const hits = [];
      for (const other of others) {
        const rec = axis === "role" ? getRecommendation(col.id, other.id) : getRecommendation(other.id, col.id);
        const rank = RANKS.find(r => rec[r] === fw);
        if (rank) hits.push({ other, rank });
      }
      cells[fw][col.id] = { hits, count: hits.length, starts: hits.filter(h => h.rank === "primary").length };
    }
  }
  return { columns, others, cells };
}

function stepFor(count, max) {
  if (count === 0) return -1;
  if (max <= 1) return RAMP.length - 1;
  return Math.round(((count - 1) / (max - 1)) * (RAMP.length - 1));
}

export default function FrameworkMatrix({ frameworks, frameworkKeys, roles, goals, getRecommendation, currentRole, currentGoal, recommended = [] }) {
  const [axis, setAxis] = useState("role");
  const [active, setActive] = useState(null); // { fw, col }
  const [showTable, setShowTable] = useState(false);
  const scrollRef = useRef(null);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const check = () => setOverflowing(el.scrollWidth > el.clientWidth + 1);
    const ro = new ResizeObserver(check);
    ro.observe(el);
    check();
    return () => ro.disconnect();
  }, []);
  const sticky = overflowing ? STICKY : {};

  const { columns, others, cells } = buildMatrix(axis, { frameworkKeys, roles, goals, getRecommendation });
  const max = others.length;
  const current = axis === "role" ? currentRole : currentGoal;
  const otherNoun = axis === "role" ? "questions" : "roles";
  const colNoun = axis === "role" ? "role" : "question";
  const short = item => SHORT[item.id] || item.label;
  const fwShort = key => SHORT_FW[key] || frameworks[key].name;

  const activeCell = active && cells[active.fw]?.[active.col];
  const activeCol = active && columns.find(c => c.id === active.col);

  const toggleButton = (value, label) => (
    <button key={value} onClick={() => { setAxis(value); setActive(null); }} aria-pressed={axis === value} style={{
      background: axis === value ? "rgba(110,156,232,0.15)" : "transparent", border: axis === value ? "1px solid rgba(110,156,232,0.3)" : "1px solid rgba(255,255,255,0.08)",
      color: axis === value ? "#8bb4e8" : "#6b7fa3", padding: "5px 12px", borderRadius: 6, fontSize: 11, fontFamily: mono, cursor: "pointer",
    }}>{label}</button>
  );

  return (
    <div>
      <p style={{ fontSize: 13, color: "#7d8fa8", lineHeight: 1.6, margin: "0 0 14px 0" }}>
        How often each framework is recommended, across every combination of role and question. Brighter cells mean it comes up for more {otherNoun}; a dot means it is the starting point for at least one. Your {colNoun} is outlined.
      </p>

      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {toggleButton("role", "By role")}
        {toggleButton("goal", "By question")}
      </div>

      {/* Grid: horizontal scroll stays inside the card on narrow screens */}
      <div ref={scrollRef} style={{ overflowX: "auto", paddingBottom: 4 }}>
        <div role="grid" aria-label={`Framework recommendations by ${colNoun}`} style={{ display: "grid", gridTemplateColumns: `minmax(${LABEL_W}px, 1.6fr) repeat(${columns.length}, minmax(${COL_W}px, 1fr))`, gap: 2, minWidth: LABEL_W + columns.length * (COL_W + 2) }}>
          <div role="row" style={{ display: "contents" }}>
            <div role="columnheader" style={sticky} />
            {columns.map(col => (
              <div key={col.id} role="columnheader" title={col.label} style={{
                fontFamily: mono, fontSize: 10, letterSpacing: 0.5, textAlign: "center", padding: "0 2px 6px", lineHeight: 1.3,
                color: col.id === current ? "#c9d1dd" : "#6b7fa3", fontWeight: col.id === current ? 700 : 400,
              }}>{short(col)}</div>
            ))}
          </div>

          {frameworkKeys.map(fw => {
            const isRec = recommended.includes(fw);
            return (
              <div key={fw} role="row" style={{ display: "contents" }}>
                <div role="rowheader" title={frameworks[fw].name} style={{ ...sticky, display: "flex", alignItems: "center", gap: 8, paddingRight: 8, minHeight: 30 }}>
                  <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: "50%", background: frameworks[fw].color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: isRec ? "#c9d1dd" : "#7d8fa8", fontWeight: isRec ? 700 : 400, lineHeight: 1.3 }}>{fwShort(fw)}</span>
                </div>
                {columns.map(col => {
                  const cell = cells[fw][col.id];
                  const step = stepFor(cell.count, max);
                  const isActive = active && active.fw === fw && active.col === col.id;
                  const isCurrent = col.id === current;
                  return (
                    <div key={col.id} role="gridcell" tabIndex={0}
                      aria-label={`${frameworks[fw].name}, ${col.label}: recommended for ${cell.count} of ${max} ${otherNoun}, starting point for ${cell.starts}`}
                      onPointerEnter={() => setActive({ fw, col: col.id })} onPointerLeave={() => setActive(null)}
                      onFocus={() => setActive({ fw, col: col.id })} onBlur={() => setActive(null)}
                      style={{
                        position: "relative", minHeight: 30, borderRadius: 4, cursor: "default", outline: "none",
                        background: step < 0 ? EMPTY : RAMP[step],
                        boxShadow: isActive ? "inset 0 0 0 2px #e8f0f8" : isCurrent ? "inset 0 0 0 1px rgba(201,209,221,0.55)" : "none",
                        filter: isActive ? "brightness(1.12)" : "none", transition: "filter 0.15s",
                      }}>
                      {cell.starts > 0 && (
                        <span aria-hidden="true" style={{ position: "absolute", top: "50%", left: "50%", width: 8, height: 8, marginTop: -4, marginLeft: -4, borderRadius: "50%", background: INK[step] }} />
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Readout: same content on hover and keyboard focus */}
      <div aria-live="polite" style={{ minHeight: 64, marginTop: 12, padding: "10px 14px", background: "rgba(0,0,0,0.15)", borderRadius: 8 }}>
        {activeCell ? (
          <div>
            <div style={{ fontSize: 14, color: "#e8f0f8", fontWeight: 700 }}>
              {activeCell.count} of {max} {otherNoun}{activeCell.starts > 0 && <span style={{ fontWeight: 400, color: "#a8b5c8" }}> · starting point for {activeCell.starts}</span>}
            </div>
            <div style={{ fontSize: 12, color: "#7d8fa8", marginTop: 2 }}>{frameworks[active.fw].name} · {activeCol.label}</div>
            {activeCell.hits.length > 0 && (
              <div style={{ fontSize: 12, color: "#8899b0", marginTop: 6, lineHeight: 1.6 }}>
                {activeCell.hits.map(h => `${h.other.label}: ${RANK_LABELS[h.rank].toLowerCase()}`).join(" · ")}
              </div>
            )}
          </div>
        ) : (
          <div style={{ fontSize: 12, color: "#5f7390", lineHeight: 1.6 }}>Hover over or tab to a cell to see which {otherNoun} it is recommended for.</div>
        )}
      </div>

      {/* Scale legend */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 12, fontFamily: mono, fontSize: 10, color: "#6b7fa3" }}>
        <span>Recommended for</span>
        <span style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <span style={{ width: 16, height: 10, borderRadius: 2, background: EMPTY, border: "1px solid rgba(255,255,255,0.06)" }} />
          <span style={{ margin: "0 4px" }}>0</span>
          {Array.from({ length: max }, (_, i) => i + 1).map(n => (
            <span key={n} style={{ width: 16, height: 10, borderRadius: 2, background: RAMP[stepFor(n, max)] }} />
          ))}
          <span style={{ marginLeft: 4 }}>{max} {otherNoun}</span>
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#e8f0f8" }} />starting point at least once
        </span>
      </div>

      {/* Table view: every value without hovering */}
      <button onClick={() => setShowTable(s => !s)} aria-expanded={showTable} style={{ marginTop: 14, background: "transparent", border: "none", padding: 0, color: "#6b7fa3", fontFamily: mono, fontSize: 11, cursor: "pointer", textDecoration: "underline" }}>
        {showTable ? "Hide table" : "Show as table"}
      </button>
      {showTable && (
        <div style={{ overflowX: "auto", marginTop: 10 }}>
          <table style={{ borderCollapse: "collapse", fontSize: 12, color: "#8899b0", width: "100%" }}>
            <caption style={{ textAlign: "left", fontSize: 11, color: "#6b7fa3", marginBottom: 6 }}>Times recommended out of {max} {otherNoun} (times as starting point in brackets)</caption>
            <thead>
              <tr>
                <th scope="col" style={{ textAlign: "left", padding: "4px 8px", fontWeight: 600, color: "#a8b5c8" }}>Framework</th>
                {columns.map(col => <th key={col.id} scope="col" style={{ padding: "4px 8px", fontWeight: 600, color: "#a8b5c8", fontVariantNumeric: "tabular-nums" }}>{short(col)}</th>)}
              </tr>
            </thead>
            <tbody>
              {frameworkKeys.map(fw => (
                <tr key={fw} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <th scope="row" style={{ textAlign: "left", padding: "4px 8px", fontWeight: 400 }}>{frameworks[fw].name}</th>
                  {columns.map(col => { const c = cells[fw][col.id]; return (
                    <td key={col.id} style={{ textAlign: "center", padding: "4px 8px", fontVariantNumeric: "tabular-nums" }}>{c.count}{c.starts > 0 ? ` (${c.starts})` : ""}</td>
                  ); })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
