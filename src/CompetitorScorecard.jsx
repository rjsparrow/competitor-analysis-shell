import React, { useState, useEffect, useCallback } from "react";

// Standard categories for assessment
const CATEGORIES = [
  { id: "brand", label: "Brand & Positioning", description: "Tagline, mission, value prop, niche vs. generalist positioning, 'why us' clarity" },
  { id: "market", label: "Market Focus", description: "Sector organization, target market alignment (healthcare, senior living, housing, community)" },
  { id: "portfolio", label: "Project Portfolio", description: "Case study depth, outcomes/metrics vs. photos, testimonials, profile format quality" },
  { id: "thought", label: "Thought Leadership", description: "Blogs, whitepapers, videos, podcasts — content cadence and quality" },
  { id: "services", label: "Service Presentation", description: "How services are framed — design-forward, consultative, data-driven, etc." },
  { id: "team", label: "Team Presentation", description: "People showcase style — credentials, specialties, personality, approachability" },
  { id: "ux", label: "Website UX & Design", description: "Aesthetic quality, navigation, mobile experience, speed, polish, modernity" },
  { id: "digital", label: "Digital & Social Presence", description: "Social channels, e-newsletters, video series, platform activity level" },
  { id: "tone", label: "Tone & Voice", description: "Corporate vs. warm, human vs. clinical — alignment with trust/empathy positioning" },
  { id: "cta", label: "Calls to Action & BD", description: "Engagement funnels — contact forms, RFP submission, downloadable resources" },
];

const COMPETITOR_GROUPS = [
  { group: "Healthcare (Large)", firms: ["HKS", "HOK", "HDR", "Cannon", "ESA", "Gresham Smith", "BSA", "E4H", "SmithGroup", "NBBJ"] },
  { group: "Healthcare (Small)", firms: ["ARC", "Guidon", "Champlin", "Haffer"] },
  { group: "Senior Living", firms: ["Perkins Eastman", "RLPS", "Progressive AE"] },
  { group: "Peer Group", firms: ["Design Collaborative", "KrM", "MSKTD", "CSO"] },
];

const ALL_FIRMS = COMPETITOR_GROUPS.flatMap((g) => g.firms);

const ACCENT = "#5c6d5e";
const ACCENT_WARM = "#b68d40";

// Helper for Colors
const getColor = (avg) => {
  const val = parseFloat(avg);
  if (!val || val === 0) return "#d1d5db";
  if (val >= 4) return "#2d6a4f";
  if (val >= 3) return "#b68d40";
  if (val >= 2) return "#c17817";
  return "#a4433a";
};

// Helper for Averages
const getAvg = (scores) => {
  if (!scores) return "0.0";
  const vals = Object.values(scores).map(v => parseFloat(v)).filter((v) => v > 0);
  if (vals.length === 0) return "0.0";
  return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
};

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
      fontFamily: "monospace",
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
    <div style={{ borderBottom: "1px solid #e8e4df", padding: "16px 0" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 17, color: "#1a1a1a", marginBottom: 2, fontWeight: "bold" }}>
            {category.label}
          </div>
          <div style={{ fontSize: 12, color: "#8a8278", lineHeight: 1.4 }}>
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
          style={{ background: "none", border: "none", cursor: "pointer", color: "#8a8278", fontSize: 18, padding: "4px 8px", transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▾
        </button>
      </div>
      {expanded && (
        <div style={{ marginTop: 12 }}>
          <textarea
            value={notes || ""}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Add observations..."
            style={{ width: "100%", minHeight: 72, padding: 12, border: "1px solid #d6d0c8", borderRadius: 8, fontSize: 13, background: "#faf8f5", resize: "vertical" }}
          />
        </div>
      )}
    </div>
  );
};

export default function CompetitorScorecard({ competitors = {}, onBack }) {
  const [localData, setLocalData] = useState({});
  const [selectedFirm, setSelectedFirm] = useState(null);
  const [view, setView] = useState("score"); 
  const [search, setSearch] = useState("");
  const [swotText, setSwotText] = useState({});

  useEffect(() => {
    if (competitors) {
      setLocalData(competitors);
    }
  }, [competitors]);

  const getFirmData = useCallback((firmName) => {
    return localData?.[firmName] || { scores: {}, notes: {} };
  }, [localData]);

  const updateScore = (firm, catId, value) => {
    const current = getFirmData(firm);
    setLocalData(prev => ({
      ...prev,
      [firm]: { ...current, scores: { ...current.scores, [catId]: value } }
    }));
  };

  const updateNotes = (firm, catId, value) => {
    const current = getFirmData(firm);
    setLocalData(prev => ({
      ...prev,
      [firm]: { ...current, notes: { ...current.notes, [catId]: value } }
    }));
  };

  const scoredFirms = (ALL_FIRMS || []).filter((f) => {
    const d = getFirmData(f);
    return d?.scores && Object.values(d.scores).some(v => v > 0);
  }).sort((a, b) => {
    return parseFloat(getAvg(getFirmData(b).scores)) - parseFloat(getAvg(getFirmData(a).scores));
  });

  return (
    <div style={{ fontFamily: "sans-serif", background: "#f5f2ed", minHeight: "100vh", color: "#1a1a1a" }}>
      {/* Header */}
      <div style={{ background: "#2c2c2c", padding: "32px 32px 28px", color: "#f5f2ed" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#b68d40", cursor: "pointer", marginBottom: 16 }}>
            ← Back to Home
          </button>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2.5, color: "#b68d40", marginBottom: 8 }}>
            MKM Design Group
          </div>
          <h1 style={{ fontSize: 32, margin: 0 }}>Competitor Analysis Scorecard</h1>
          
          <div style={{ display: "flex", gap: 20, marginTop: 24 }}>
            <button onClick={() => setView("score")} style={{ padding: "10px 0", border: "none", background: "none", color: view === "score" ? "#fff" : "#7a756d", borderBottom: view === "score" ? "2px solid #b68d40" : "none", cursor: "pointer", fontWeight: "bold" }}>Score Firms</button>
            <button onClick={() => setView("compare")} style={{ padding: "10px 0", border: "none", background: "none", color: view === "compare" ? "#fff" : "#7a756d", borderBottom: view === "compare" ? "2px solid #b68d40" : "none", cursor: "pointer", fontWeight: "bold" }}>Compare</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 32px 64px" }}>
        {view === "score" ? (
          <div style={{ display: "flex", gap: 32 }}>
            {/* Sidebar */}
            <div style={{ width: 220, flexShrink: 0 }}>
              <input
                type="text"
                placeholder="Search firms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #d6d0c8", marginBottom: 16 }}
              />
              {COMPETITOR_GROUPS.map(g => (
                <div key={g.group} style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 10, fontWeight: "bold", color: "#8a8278", marginBottom: 8 }}>{g.group}</div>
                  {g.firms.filter(f => f.toLowerCase().includes(search.toLowerCase())).map(firm => {
                    const avg = getAvg(getFirmData(firm)?.scores);
                    return (
                      <button
                        key={firm}
                        onClick={() => setSelectedFirm(firm)}
                        style={{ width: "100%", textAlign: "left", padding: "8px", borderRadius: 6, border: "none", background: selectedFirm === firm ? ACCENT : "transparent", color: selectedFirm === firm ? "#fff" : "#1a1a1a", cursor: "pointer", display: "flex", justifyContent: "space-between" }}
                      >
                        <span>{firm}</span>
                        {parseFloat(avg) > 0 && <span style={{ fontSize: 11 }}>{avg}</span>}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>

            {/* Main Content */}
            <div style={{ flex: 1 }}>
              {selectedFirm ? (
                <div style={{ background: "#fff", padding: 24, borderRadius: 12, border: "1px solid #e8e4df" }}>
                  <h2 style={{ margin: "0 0 16px 0" }}>{selectedFirm}</h2>
                  {CATEGORIES.map(cat => (
                    <CategoryRow
                      key={cat.id}
                      category={cat}
                      score={getFirmData(selectedFirm)?.scores?.[cat.id] || 0}
                      notes={getFirmData(selectedFirm)?.notes?.[cat.id] || ""}
                      onScoreChange={(v) => updateScore(selectedFirm, cat.id, v)}
                      onNotesChange={(v) => updateNotes(selectedFirm, cat.id, v)}
                      accentColor={ACCENT}
                    />
                  ))}
                </div>
              ) : (
                <div style={{ padding: 48, textAlign: "center", color: "#8a8278" }}>Select a firm from the list to start scoring.</div>
              )}
            </div>
          </div>
        ) : (
          /* Compare View */
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8e4df", overflow: "hidden" }}>
             <table style={{ width: "100%", borderCollapse: "collapse" }}>
               <thead>
                 <tr style={{ background: "#faf8f5" }}>
                   <th style={{ padding: 12, textAlign: "left" }}>Firm</th>
                   <th style={{ padding: 12 }}>Avg</th>
                   {CATEGORIES.slice(0, 5).map(c => <th key={c.id} style={{ padding: 12, fontSize: 10 }}>{c.label}</th>)}
                 </tr>
               </thead>
               <tbody>
                 {scoredFirms.length > 0 ? scoredFirms.map(f => {
                   const d = getFirmData(f);
                   return (
                     <tr key={f} style={{ borderTop: "1px solid #e8e4df" }}>
                       <td style={{ padding: 12, fontWeight: "bold" }}>{f}</td>
                       <td style={{ padding: 12, textAlign: "center", color: getColor(getAvg(d.scores)) }}>{getAvg(d.scores)}</td>
                       {CATEGORIES.slice(0, 5).map(c => (
                         <td key={c.id} style={{ padding: 12, textAlign: "center" }}>{d.scores[c.id] || "—"}</td>
                       ))}
                     </tr>
                   )
                 }) : (
                   <tr><td colSpan="7" style={{ padding: 24, textAlign: "center" }}>No firms scored yet.</td></tr>
                 )}
               </tbody>
             </table>
          </div>
        )}
      </div>
    </div>
  );
}
