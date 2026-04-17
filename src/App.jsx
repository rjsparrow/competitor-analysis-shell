import { useState, useEffect } from "react";
import XRayVision from "./XRayVision";
import ContentEnginePanel from "./ContentEngine";
import CompetitorScorecard from "./CompetitorScorecard";

const DANGER = "#a12c7b";
const MUTED = "#8a8278";

function emptyContentEngine() {
  return {
    keyTakeaway: "",
    content: {},
    social: {},
    niche: {},
  };
}

export default function CompetitorAnalysisTools({
  competitors = {},
  onBack,
  onUpdateCompetitor,
  onDeleteFirm,
}) {
  const [selectedFirmName, setSelectedFirmName] = useState(null);
  const [view, setView] = useState("home");
  const [activeTab, setActiveTab] = useState("content");
  const [trayOpen, setTrayOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [localCe, setLocalCe] = useState(null);
  const [saveStatus, setSaveStatus] = useState("");

  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  const [importFirm, setImportFirm] = useState("");
  const [importError, setImportError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (selectedFirmName && competitors[selectedFirmName]) {
      setLocalCe(competitors[selectedFirmName].contentEngine || emptyContentEngine());
    } else {
      setLocalCe(null);
    }
  }, [selectedFirmName, competitors]);

  useEffect(() => {
    if (!selectedFirmName || !localCe) return;

    setSaveStatus("saving");

    const timer = setTimeout(async () => {
      try {
        const firm = competitors[selectedFirmName] || {};
        const updated = {
          ...firm,
          name: selectedFirmName,
          contentEngine: localCe,
        };

        const response = await fetch("/api/save-competitor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });

        if (response.ok) {
          setSaveStatus("saved");
          onUpdateCompetitor?.(selectedFirmName, {
            ...firm,
            contentEngine: localCe,
          });
          setTimeout(() => setSaveStatus(""), 2500);
        } else {
          setSaveStatus("error");
        }
      } catch {
        setSaveStatus("error");
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [localCe, selectedFirmName, competitors, onUpdateCompetitor]);

  const handleSelectFirm = (name) => {
    setSelectedFirmName(name);
    setView("audit");
    setTrayOpen(false);
  };

  const currentFirmMeta = selectedFirmName ? competitors[selectedFirmName] : null;
  const ce = localCe || emptyContentEngine();
  const firmForTabs = selectedFirmName ? { name: selectedFirmName, ...ce } : null;

  const handleChange = (updated) => {
    if (!selectedFirmName) return;
    const { name, ...ceData } = updated;
    setLocalCe(ceData);
  };

  const handleJsonImport = () => {
    setImportError("");
    const targetFirm = importFirm.trim() || selectedFirmName;

    if (!targetFirm) {
      setImportError("Enter a firm name or select one from the sidebar first.");
      return;
    }

    try {
      const parsed = JSON.parse(importText);
      const base =
        (targetFirm === selectedFirmName ? localCe : null) || emptyContentEngine();

      const merged = {
        ...base,
        ...parsed,
        content: { ...base.content, ...(parsed.content || {}) },
        social: { ...base.social, ...(parsed.social || {}) },
        niche: { ...base.niche, ...(parsed.niche || {}) },
      };

      if (targetFirm === selectedFirmName) {
        setLocalCe(merged);
      } else {
        const firm = competitors[targetFirm] || {};
        fetch("/api/save-competitor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...firm,
            name: targetFirm,
            contentEngine: merged,
          }),
        });
      }

      setImportText("");
      setImportFirm("");
      setShowImport(false);
    } catch (e) {
      setImportError("Invalid JSON: " + e.message);
    }
  };

  const handleDelete = async (firmName) => {
    if (!window.confirm(`Delete "${firmName}"? This cannot be undone.`)) return;

    try {
      await fetch("/api/delete-competitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: firmName }),
      });

      onDeleteFirm?.(firmName);

      if (selectedFirmName === firmName) {
        setSelectedFirmName(null);
        setLocalCe(null);
        setView("summary");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const saveIndicatorColor =
    saveStatus === "saved"
      ? "#3a8a5c"
      : saveStatus === "error"
      ? DANGER
      : MUTED;

  const handleImport = async (firmData) => {
    try {
      const response = await fetch("/api/save-competitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(firmData),
      });

      if (!response.ok) throw new Error("Failed to save");

      onUpdateCompetitor?.(firmData.name, firmData);
      setShowSuccess(true);
    } catch (err) {
      console.error("Import error:", err);
      alert("Failed to save competitor data. Please try again.");
    }
  };

  const handleUpdateCompetitor = (name, updatedFirm) => {
    onUpdateCompetitor?.(name, updatedFirm);
  };

  const handleDeleteCompetitor = (name) => {
    onDeleteFirm?.(name);
  };

  const firmList = Object.values(competitors).sort((a, b) =>
    (a.name || "").localeCompare(b.name || "")
  );

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: "#f5f2ed",
        minHeight: "100vh",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {view === "home" && (
        <HomePage onNavigate={setView} competitorCount={firmList.length} />
      )}

      {view === "import" && (
        <ImportPage
          onImport={handleImport}
          onBack={() => setView("home")}
          showSuccess={showSuccess}
          onCloseSuccess={() => setShowSuccess(false)}
          onAddAnother={() => {
            setShowSuccess(false);
            window.scrollTo(0, 0);
          }}
        />
      )}

      {(view === "scorecard" || view === "xray" || view === "content") && (
        <ToolView
          view={view}
          competitors={competitors}
          onBack={() => setView("home")}
          onUpdateCompetitor={handleUpdateCompetitor}
          onDeleteFirm={handleDeleteCompetitor}
        />
      )}
    </div>
  );
}

// ============================================================================
// ICON COMPONENTS
// ============================================================================
function StarIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <path
        d="M24 4L28.854 18.708H44.472L31.809 27.584L36.663 42.292L24 33.416L11.337 42.292L16.191 27.584L3.528 18.708H19.146L24 4Z"
        fill="#b68d40"
        stroke="#b68d40"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WebsiteIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <rect x="6" y="10" width="36" height="28" rx="2" stroke="#5c6d5e" strokeWidth="1.5" fill="none" />
      <rect x="10" y="16" width="28" height="3" fill="#5c6d5e" />
      <rect x="10" y="22" width="12" height="12" fill="#d6d0c8" />
      <rect x="24" y="22" width="14" height="3" fill="#d6d0c8" />
      <rect x="24" y="27" width="14" height="3" fill="#d6d0c8" />
      <rect x="24" y="32" width="10" height="2" fill="#d6d0c8" />
      <line x1="6" y1="14" x2="42" y2="14" stroke="#5c6d5e" strokeWidth="1.5" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <rect x="8" y="8" width="32" height="32" rx="4" fill="#0A66C2" />
      <path
        d="M16 19.5H12V35H16V19.5ZM14 18C15.1 18 16 17.1 16 16C16 14.9 15.1 14 14 14C12.9 14 12 14.9 12 16C12 17.1 12.9 18 14 18ZM36 35H32V27C32 25.3 31 24 29 24C27 24 26 25.3 26 27V35H22V19.5H26V21.5C26.8 20.3 28.4 19.5 30 19.5C33.3 19.5 36 21.7 36 25.5V35Z"
        fill="white"
      />
    </svg>
  );
}

// ============================================================================
// HOME PAGE
// ============================================================================
function HomePage({ onNavigate, competitorCount }) {
  const tools = [
    {
      id: "scorecard",
      title: "Competitor Scorecard",
      description:
        "10-category ratings (1-5 scale), detailed notes per category, SWOT analysis, and side-by-side comparison view across all scored firms.",
      icon: <StarIcon />,
    },
    {
      id: "xray",
      title: "Website X-Ray Vision",
      description:
        "Deep website audit covering structure & UX, homepage messaging, about page language, team presentation, portfolio depth, and SEO optimization.",
      icon: <WebsiteIcon />,
    },
    {
      id: "content",
      title: "Content Engine",
      description:
        "Publishing cadence analysis, social media content mix, thought leadership signals, niche positioning proof, and AI search visibility.",
      icon: <LinkedInIcon />,
    },
    {
      id: "import",
      title: "Add New Competitor",
      description:
        "Import firm data from competitive analysis research — JSON export plus screenshots (hero, homepage, portfolio, logo).",
      accent: true,
    },
  ];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "64px 32px" }}>
      <h1
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 32,
          fontWeight: 600,
          margin: "0 0 12px 0",
          color: "#1a1a1a",
          textAlign: "center",
        }}
      >
        Competitor Analysis Tools
      </h1>
      <p style={{ fontSize: 16, color: "#8a8278", margin: "0 0 48px 0", textAlign: "center" }}>
        Strategic intelligence across {competitorCount} architecture firms
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onNavigate(tool.id)}
            style={{
              background: tool.accent ? "#b68d40" : "#fff",
              border: tool.accent ? "none" : "1px solid #e8e4df",
              borderRadius: 12,
              padding: 24,
              textAlign: "left",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
            }}
          >
            {tool.icon && <div style={{ flexShrink: 0 }}>{tool.icon}</div>}
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 20,
                  fontWeight: 600,
                  margin: "0 0 8px 0",
                  color: tool.accent ? "#2c5f8d" : "#1a1a1a",
                }}
              >
                {tool.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: tool.accent ? "#1a1a1a" : "#6b6358",
                  margin: 0,
                }}
              >
                {tool.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// IMPORT PAGE
// ============================================================================
function ImportPage({ onImport, onBack, showSuccess, onCloseSuccess, onAddAnother 
