import { useState, useEffect, useCallback } from "react";

const CATEGORIES = [
  {
    id: "brand",
    label: "Brand & Positioning",
    description: "Tagline, mission, value prop, niche vs. generalist positioning, 'why us' clarity",
  },
  {
    id: "market",
    label: "Market Focus",
    description: "Sector organization, target market alignment (healthcare, senior living, housing, community)",
  },
  {
    id: "portfolio",
    label: "Project Portfolio",
    description: "Case study depth, outcomes/metrics vs. photos, testimonials, profile format quality",
  },
  {
    id: "thought",
    label: "Thought Leadership",
    description: "Blogs, whitepapers, videos, podcasts — content cadence and quality",
  },
  {
    id: "services",
    label: "Service Presentation",
    description: "How services are framed — design-forward, consultative, data-driven, etc.",
  },
  {
    id: "team",
    label: "Team Presentation",
    description: "People showcase style — credentials, specialties, personality, approachability",
  },
  {
    id: "ux",
    label: "Website UX & Design",
    description: "Aesthetic quality, navigation, mobile experience, speed, polish, modernity",
  },
  {
    id: "digital",
    label: "Digital & Social Presence",
    description: "Social channels, e-newsletters, video series, platform activity level",
  },
  {
    id: "tone",
    label: "Tone & Voice",
    description: "Corporate vs. warm, human vs. clinical — alignment with trust/empathy positioning",
  },
  {
    id: "cta",
    label: "Calls to Action & BD",
    description: "Engagement funnels — contact forms, RFP submission, downloadable resources",
  },
];

const COMPETITOR_GROUPS = [
  {
    group: "Healthcare (Large)",
    firms: ["HKS", "HOK", "HDR", "Cannon", "ESA", "Gresham Smith", "BSA", "E4H", "SmithGroup", "NBBJ"],
  },
  {
    group: "Healthcare (Small)",
    firms: ["ARC", "Guidon", "Champlin", "Haffer"],
  },
  {
    group: "Senior Living",
    firms: ["Perkins Eastman", "RLPS", "Progressive AE"],
  },
  {
    group: "Peer Group",
    firms: ["Design Collaborative", "KrM", "MSKTD", "CSO"],
  },
];

const ALL_FIRMS = COMPETITOR_GROUPS.flatMap((g) => g.firms);

const ScoreButton = ({ value, selected, onClick, color }) => (
  <button
    onClick={onClick}
    style={{
      width: 36,
      height: 36,
      borderRadius: "50%",
      border: selected ? `2px solid ${color}` : "2px solid #d1d5db",
      background: selected ? color : "transparent",
      color: selected ? "#fff" : "#6b7280",
      fontFamily: "'DM Mono', monospace",
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.15s ease",
    }}
  >
    {value}
  </button>
);

const CategoryRow = ({ category, score, notes, onScoreChange, onNotesChange, accentColor }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      style={{
        borderBottom: "1px solid #e8e4df",
        padding: "16px 0",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: 17,
              color: "#1a1a1a",
              marginBottom: 2,
            }}
          >
            {category.label}
          </div>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              color: "#8a8278",
              lineHeight: 1.4,
            }}
          >
            {category.description}
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, alignItems: "center", flexShrink: 0 }}>
          {[1, 2, 3, 4, 5].map((v) => (
            <ScoreButton
              key={v}
              value={v}
              selected={score === v}
              onClick={() => onScoreChange(v)}
              color={accentColor}
            />
          ))}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#8a8278",
            fontSize: 18,
            padding: "4px 8px",
            flexShrink: 0,
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          ▾
        </button>
      </div>
      {expanded && (
        <div style={{ marginTop: 12, paddingLeft: 0 }}>
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Add observations, strengths, weaknesses..."
            style={{
              width: "100%",
              minHeight: 72,
              padding: 12,
              border: "1px solid #d6d0c8",
              borderRadius: 8,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              color: "#1a1a1a",
              background: "#faf8f5",
              resize: "vertical",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
      )}
    </div>
  );
};

const getAvg = (scores) => {
  const vals = Object.values(scores).filter((v) => v > 0);
  if (vals.length === 0) return 0;
  return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
};

const getColor = (avg) => {
  if (avg === 0) return "#d1d5db";
  if (avg >= 4) return "#2d6a4f";
  if (avg >= 3) return "#b68d40";
  if (avg >= 2) return "#c17817";
  return "#a4433a";
};

const ACCENT = "#5c6d5e";
const ACCENT_WARM = "#b68d40";

export default function CompetitorScorecard() {
  const [data, setData] = useState({});
  const [selectedFirm, setSelectedFirm] = useState(null);
  const [view, setView] = useState("score"); // "score" | "compare"
  const [search, setSearch] = useState("");
  const [swotText, setSwotText] = useState({});

  const getFirmData = useCallback(
    (firm) => {
      return (
        data[firm] || {
          scores: {},
          notes: {},
        }
      );
    },
    [data]
  );

  const updateScore = (firm, catId, value) => {
    setData((prev) => ({
      ...prev,
      [firm]: {
        ...getFirmData(firm),
        scores: { ...getFirmData(firm).scores, [catId]: value },
      },
    }));
  };

  const updateNotes = (firm, catId, value) => {
    setData((prev) => ({
      ...prev,
      [firm]: {
        ...getFirmData(firm),
        notes: { ...getFirmData(firm).notes, [catId]: value },
      },
    }));
  };

  const scoredFirms = ALL_FIRMS.filter((f) => {
    const d = getFirmData(f);
    return Object.values(d.scores).some((v) => v > 0);
  }).sort((a, b) => {
    return parseFloat(getAvg(getFirmData(b).scores)) - parseFloat(getAvg(getFirmData(a).scores));
  });

  const filteredFirms = ALL_FIRMS.filter((f) =>
    f.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: "#f5f2ed",
        minHeight: "100vh",
        color: "#1a1a1a",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <div
        style={{
          background: "#2c2c2c",
          padding: "32px 32px 28px",
          color: "#f5f2ed",
        }}
      >
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 2.5,
              color: "#b68d40",
              marginBottom: 8,
            }}
          >
            MKM Design Group
          </div>
          <h1
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: 32,
              fontWeight: 400,
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Competitor Analysis Scorecard
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#a09a90",
              marginTop: 8,
              marginBottom: 0,
              maxWidth: 560,
              lineHeight: 1.5,
            }}
          >
            Rate each competitor 1–5 across 10 categories. Add notes per category, then compare across firms.
          </p>

          {/* Tab Toggle */}
          <div style={{ display: "flex", gap: 0, marginTop: 24 }}>
            {[
              { key: "score", label: "Score Firms" },
              { key: "compare", label: "Compare" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setView(tab.key)}
                style={{
                  padding: "10px 24px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  borderBottom: view === tab.key ? `2px solid ${ACCENT_WARM}` : "2px solid transparent",
                  background: "transparent",
                  color: view === tab.key ? "#f5f2ed" : "#7a756d",
                  transition: "all 0.15s ease",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 32px 64px" }}>
        {/* ===== SCORING VIEW ===== */}
        {view === "score" && (
          <div style={{ display: "flex", gap: 32 }}>
            {/* Firm Selector */}
            <div style={{ width: 220, flexShrink: 0 }}>
              <input
                type="text"
                placeholder="Search firms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #d6d0c8",
                  borderRadius: 8,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  background: "#fff",
                  outline: "none",
                  marginBottom: 16,
                  boxSizing: "border-box",
                }}
              />
              {COMPETITOR_GROUPS.map((group) => {
                const visible = group.firms.filter((f) => filteredFirms.includes(f));
                if (visible.length === 0) return null;
                return (
                  <div key={group.group} style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 10,
                        textTransform: "uppercase",
                        letterSpacing: 1.5,
                        color: "#8a8278",
                        marginBottom: 6,
                        paddingLeft: 4,
                      }}
                    >
                      {group.group}
                    </div>
                    {visible.map((firm) => {
                      const avg = getAvg(getFirmData(firm).scores);
                      const isSelected = selectedFirm === firm;
                      return (
                        <button
                          key={firm}
                          onClick={() => setSelectedFirm(firm)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                            padding: "8px 10px",
                            border: "none",
                            borderRadius: 6,
                            background: isSelected ? ACCENT : "transparent",
                            color: isSelected ? "#fff" : "#1a1a1a",
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 13,
                            fontWeight: isSelected ? 600 : 400,
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "all 0.12s ease",
                            marginBottom: 2,
                          }}
                        >
                          <span>{firm}</span>
                          {parseFloat(avg) > 0 && (
                            <span
                              style={{
                                fontFamily: "'DM Mono', monospace",
                                fontSize: 11,
                                color: isSelected ? "rgba(255,255,255,0.7)" : getColor(parseFloat(avg)),
                                fontWeight: 500,
                              }}
                            >
                              {avg}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Scoring Panel */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {!selectedFirm ? (
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    padding: 48,
                    textAlign: "center",
                    border: "1px solid #e8e4df",
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 12 }}>←</div>
                  <div
                    style={{
                      fontFamily: "'Instrument Serif', Georgia, serif",
                      fontSize: 20,
                      color: "#1a1a1a",
                      marginBottom: 8,
                    }}
                  >
                    Select a firm to begin scoring
                  </div>
                  <div style={{ fontSize: 13, color: "#8a8278" }}>
                    Pick a competitor from the sidebar to rate their website across all categories.
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    padding: "24px 28px",
                    border: "1px solid #e8e4df",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <h2
                      style={{
                        fontFamily: "'Instrument Serif', Georgia, serif",
                        fontSize: 26,
                        fontWeight: 400,
                        margin: 0,
                      }}
                    >
                      {selectedFirm}
                    </h2>
                    <div
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 14,
                        color: getColor(parseFloat(getAvg(getFirmData(selectedFirm).scores))),
                        fontWeight: 500,
                      }}
                    >
                      Avg: {getAvg(getFirmData(selectedFirm).scores) || "—"}
                    </div>
                  </div>

                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 10,
                      textTransform: "uppercase",
                      letterSpacing: 1.5,
                      color: "#8a8278",
                      marginBottom: 4,
                      display: "flex",
                      justifyContent: "flex-end",
                      paddingRight: 44,
                    }}
                  >
                    <span>Weak → Strong</span>
                  </div>

                  {CATEGORIES.map((cat) => (
                    <CategoryRow
                      key={cat.id}
                      category={cat}
                      score={getFirmData(selectedFirm).scores[cat.id] || 0}
                      notes={getFirmData(selectedFirm).notes[cat.id] || ""}
                      onScoreChange={(v) => updateScore(selectedFirm, cat.id, v)}
                      onNotesChange={(v) => updateNotes(selectedFirm, cat.id, v)}
                      accentColor={ACCENT}
                    />
                  ))}

                  {/* SWOT Notes */}
                  <div style={{ marginTop: 24 }}>
                    <div
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 10,
                        textTransform: "uppercase",
                        letterSpacing: 1.5,
                        color: "#8a8278",
                        marginBottom: 10,
                      }}
                    >
                      SWOT Summary
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {["Strengths", "Weaknesses", "Opportunities", "Threats"].map((label) => (
                        <div key={label}>
                          <div
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#5c5549",
                              marginBottom: 4,
                            }}
                          >
                            {label}
                          </div>
                          <textarea
                            value={(swotText[selectedFirm] || {})[label] || ""}
                            onChange={(e) =>
                              setSwotText((prev) => ({
                                ...prev,
                                [selectedFirm]: {
                                  ...(prev[selectedFirm] || {}),
                                  [label]: e.target.value,
                                },
                              }))
                            }
                            placeholder={`${label}...`}
                            style={{
                              width: "100%",
                              minHeight: 60,
                              padding: 10,
                              border: "1px solid #e8e4df",
                              borderRadius: 6,
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: 12,
                              color: "#1a1a1a",
                              background: "#faf8f5",
                              resize: "vertical",
                              outline: "none",
                              boxSizing: "border-box",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== COMPARE VIEW ===== */}
        {view === "compare" && (
          <div>
            {scoredFirms.length === 0 ? (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: 48,
                  textAlign: "center",
                  border: "1px solid #e8e4df",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontSize: 20,
                    color: "#1a1a1a",
                    marginBottom: 8,
                  }}
                >
                  No scores yet
                </div>
                <div style={{ fontSize: 13, color: "#8a8278" }}>
                  Head to "Score Firms" and rate at least one competitor to see comparisons.
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  border: "1px solid #e8e4df",
                  overflowX: "auto",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "14px 16px",
                          borderBottom: "2px solid #e8e4df",
                          fontFamily: "'DM Mono', monospace",
                          fontSize: 10,
                          textTransform: "uppercase",
                          letterSpacing: 1.5,
                          color: "#8a8278",
                          fontWeight: 500,
                          position: "sticky",
                          left: 0,
                          background: "#fff",
                          minWidth: 120,
                        }}
                      >
                        Firm
                      </th>
                      {CATEGORIES.map((cat) => (
                        <th
                          key={cat.id}
                          style={{
                            textAlign: "center",
                            padding: "14px 8px",
                            borderBottom: "2px solid #e8e4df",
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 9,
                            textTransform: "uppercase",
                            letterSpacing: 1,
                            color: "#8a8278",
                            fontWeight: 500,
                            minWidth: 64,
                          }}
                        >
                          {cat.label.split(" ")[0]}
                        </th>
                      ))}
                      <th
                        style={{
                          textAlign: "center",
                          padding: "14px 16px",
                          borderBottom: "2px solid #e8e4df",
                          fontFamily: "'DM Mono', monospace",
                          fontSize: 10,
                          textTransform: "uppercase",
                          letterSpacing: 1.5,
                          color: ACCENT_WARM,
                          fontWeight: 600,
                        }}
                      >
                        Avg
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {scoredFirms.map((firm, i) => {
                      const fd = getFirmData(firm);
                      const avg = parseFloat(getAvg(fd.scores));
                      return (
                        <tr
                          key={firm}
                          style={{
                            background: i % 2 === 0 ? "#fff" : "#faf8f5",
                          }}
                        >
                          <td
                            style={{
                              padding: "12px 16px",
                              fontWeight: 600,
                              borderBottom: "1px solid #e8e4df",
                              position: "sticky",
                              left: 0,
                              background: i % 2 === 0 ? "#fff" : "#faf8f5",
                            }}
                          >
                            {firm}
                          </td>
                          {CATEGORIES.map((cat) => {
                            const s = fd.scores[cat.id] || 0;
                            return (
                              <td
                                key={cat.id}
                                style={{
                                  textAlign: "center",
                                  padding: "12px 8px",
                                  borderBottom: "1px solid #e8e4df",
                                  fontFamily: "'DM Mono', monospace",
                                  fontSize: 13,
                                  color: s === 0 ? "#d1d5db" : getColor(s),
                                  fontWeight: 500,
                                }}
                              >
                                {s === 0 ? "–" : s}
                              </td>
                            );
                          })}
                          <td
                            style={{
                              textAlign: "center",
                              padding: "12px 16px",
                              borderBottom: "1px solid #e8e4df",
                              fontFamily: "'DM Mono', monospace",
                              fontSize: 14,
                              fontWeight: 600,
                              color: getColor(avg),
                            }}
                          >
                            {avg}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Category Averages */}
            {scoredFirms.length > 0 && (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: "24px 28px",
                  border: "1px solid #e8e4df",
                  marginTop: 20,
                }}
              >
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: 1.5,
                    color: "#8a8278",
                    marginBottom: 16,
                  }}
                >
                  Category Averages Across All Scored Firms
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {CATEGORIES.map((cat) => {
                    const allScores = scoredFirms
                      .map((f) => getFirmData(f).scores[cat.id])
                      .filter((v) => v > 0);
                    const catAvg =
                      allScores.length > 0
                        ? (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1)
                        : 0;
                    const pct = (parseFloat(catAvg) / 5) * 100;
                    return (
                      <div key={cat.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div
                          style={{
                            width: 160,
                            fontSize: 12,
                            fontWeight: 500,
                            color: "#5c5549",
                            flexShrink: 0,
                          }}
                        >
                          {cat.label}
                        </div>
                        <div
                          style={{
                            flex: 1,
                            height: 20,
                            background: "#f0ece6",
                            borderRadius: 10,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${pct}%`,
                              height: "100%",
                              background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_WARM})`,
                              borderRadius: 10,
                              transition: "width 0.4s ease",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 12,
                            color: getColor(parseFloat(catAvg)),
                            fontWeight: 500,
                            width: 32,
                            textAlign: "right",
                            flexShrink: 0,
                          }}
                        >
                          {catAvg || "–"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
