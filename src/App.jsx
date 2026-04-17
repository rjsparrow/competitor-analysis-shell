import { useState, useEffect } from "react";
import XRayVision from "./XRayVision";
import ContentEngine from "./ContentEngine";
import CompetitorScorecard from "./CompetitorScorecard";

export default function CompetitorAnalysisShell() {
  const [view, setView] = useState("home");
  const [competitors, setCompetitors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadCompetitors();
  }, []);

  const loadCompetitors = async () => {
    try {
      const response = await fetch('/api/competitors');
      const data = await response.json();
      setCompetitors(data);
    } catch (err) {
      console.log("No existing competitors found");
    }
  };

  const handleUpdateCompetitor = (name, updatedFirm) => {
  setCompetitors(prev => ({ ...prev, [name]: updatedFirm }));
};

const handleDeleteCompetitor = (name) => {
  setCompetitors(prev => {
    const next = { ...prev };
    delete next[name];
    return next;
  });
};

  const handleImport = async (firmData) => {
    try {
      const response = await fetch('/api/save-competitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(firmData)
      });
      
      if (!response.ok) throw new Error('Failed to save');
      
      await loadCompetitors();
      setShowSuccess(true);
    } catch (err) {
      console.error('Import error:', err);
      alert('Failed to save competitor data. Please try again.');
    }
  };

  const firmList = Object.values(competitors).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f5f2ed", minHeight: "100vh" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {view === "home" && <HomePage onNavigate={setView} competitorCount={firmList.length} />}
      
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
      description: "10-category ratings (1-5 scale), detailed notes per category, SWOT analysis, and side-by-side comparison view across all scored firms.",
      icon: <StarIcon />,
    },
    {
      id: "xray",
      title: "Website X-Ray Vision",
      description: "Deep website audit covering structure & UX, homepage messaging, about page language, team presentation, portfolio depth, and SEO optimization.",
      icon: <WebsiteIcon />,
    },
    {
      id: "content",
      title: "Content Engine",
      description: "Publishing cadence analysis, social media content mix, thought leadership signals, niche positioning proof, and AI search visibility.",
      icon: <LinkedInIcon />,
    },
    {
      id: "import",
      title: "Add New Competitor",
      description: "Import firm data from competitive analysis research — JSON export plus screenshots (hero, homepage, portfolio, logo).",
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

function ImportPage({ onImport, onBack, showSuccess, onCloseSuccess, onAddAnother }) {
  const [formData, setFormData] = useState({
    name: "",
    jsonData: "",
    images: {
      hero: null,
      fullHomepage: null,
      portfolio: null,
      logo: null,
    },
  });
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [existingFirm, setExistingFirm] = useState(null);

  const handleImageUpload = (key, file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData((prev) => ({
        ...prev,
        images: { ...prev.images, [key]: e.target.result },
      }));
    };
    reader.readAsDataURL(file);
  };

  const checkDuplicate = async (firmName) => {
    try {
      const response = await fetch(`/api/check-competitor?name=${encodeURIComponent(firmName)}`);
      const data = await response.json();
      return data.exists;
    } catch {
      return false;
    }
  };

const handleSubmit = async () => {
    try {
      const parsed = JSON.parse(formData.jsonData);
      const isDuplicate = await checkDuplicate(formData.name);
      
      if (isDuplicate) {
        setExistingFirm(formData.name);
        setShowDuplicateWarning(true);
        return;
      }

      await performImport(parsed);
    } catch (err) {
      console.error('Error details:', err);
      alert("Invalid JSON format. Please check your data and try again.");
    }
  };

const performImport = async (parsed) => {
    // 1. Smart Root Selection: Handle both nested and flat JSON
    const scorecardRoot = parsed.scorecard || parsed;
    const xrayRoot = parsed.xray || parsed;
    const contentRoot = parsed.contentEngine || parsed;

    // 2. Intelligent Score Mapping: Look for keys even if AI changed the names
    const extractedScores = scorecardRoot.scores || {
      brand_pos: scorecardRoot.brand_pos || scorecardRoot.brand || scorecardRoot.positioning || 0,
      market: scorecardRoot.market || scorecardRoot.market_focus || 0,
      portfolio: scorecardRoot.portfolio || scorecardRoot.project_portfolio || 0,
      thought: scorecardRoot.thought || scorecardRoot.thought_leadership || 0,
      services: scorecardRoot.services || scorecardRoot.service_presentation || 0,
      team: scorecardRoot.team || scorecardRoot.team_presentation || 0,
      ux: scorecardRoot.ux || scorecardRoot.website_ux || 0,
      digital: scorecardRoot.digital || scorecardRoot.digital_presence || 0,
      tone: scorecardRoot.tone || scorecardRoot.tone_voice || 0,
      cta: scorecardRoot.cta || scorecardRoot.calls_to_action || 0
    };

    // 3. Build final unified object
    const firmData = {
      ...xrayRoot, // Spread X-Ray details to top level
      name: formData.name || parsed.name || "Unknown Firm",
      peerGroup: formData.peerGroup || parsed.peerGroup || scorecardRoot.peerGroup || "Peer Group",
      scorecard: {
        scores: extractedScores,
        notes: scorecardRoot.notes || {}
      },
      contentEngine: {
        keyTakeaway: contentRoot.keyTakeaway || parsed.keyTakeaway || "",
        ...contentRoot
      },
      images: {
        ...(parsed.images || {}),
        ...formData.images
      },
      importedAt: new Date().toISOString(),
    };

    await onImport(firmData);
    
    setFormData({
      name: "",
      jsonData: "",
      images: { hero: null, fullHomepage: null, portfolio: null, logo: null },
    });
  };

  const handleReplaceConfirm = async () => {
    try {
      const parsed = JSON.parse(formData.jsonData);
      await performImport(parsed);
      setShowDuplicateWarning(false);
      setExistingFirm(null);
    } catch (err) {
      alert("Invalid JSON format. Please check your data and try again.");
    }
  };

  return (
    <div style={{ background: "#f5f2ed", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "#2c2c2c", padding: "32px 32px 28px", color: "#f5f2ed" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              color: "#b68d40",
              cursor: "pointer",
              marginBottom: 16,
              padding: "0",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            ← Back to Home
          </button>

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
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 32,
              fontWeight: 600,
              margin: "0 0 8px 0",
              color: "#f5f2ed",
            }}
          >
            Import Competitor Data
          </h1>
          <p style={{ fontSize: 14, color: "#a09a90", margin: 0, maxWidth: 560, lineHeight: 1.5 }}>
            Add a new firm to your competitive analysis toolkit — paste JSON and upload screenshots.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px" }}>
        {/* Form */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8e4df", padding: 32 }}>
          {/* Firm Name */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontWeight: 600, fontSize: 13, color: "#5c5549", marginBottom: 8 }}>
              Firm Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Guidon Design"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d6d0c8",
                borderRadius: 8,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* JSON Data */}
          <div style={{ marginBottom: 32 }}>
            <label style={{ display: "block", fontWeight: 600, fontSize: 13, color: "#5c5549", marginBottom: 8 }}>
              JSON Data
            </label>
            <textarea
              value={formData.jsonData}
              onChange={(e) => setFormData({ ...formData, jsonData: e.target.value })}
              placeholder='Paste combined JSON here (e.g., { "scorecard": {...}, "xray": {...}, "contentEngine": {...} })'
              style={{
                width: "100%",
                minHeight: 200,
                padding: 12,
                border: "1px solid #d6d0c8",
                borderRadius: 8,
                fontFamily: "'DM Mono', monospace",
                fontSize: 12,
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Image Uploads */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
            {[
              { key: "hero", label: "Hero Image" },
              { key: "fullHomepage", label: "Full Homepage Screenshot" },
              { key: "portfolio", label: "Portfolio Page" },
              { key: "logo", label: "Logo" },
            ].map((img) => (
              <div key={img.key}>
                <label style={{ display: "block", fontWeight: 600, fontSize: 13, color: "#5c5549", marginBottom: 8 }}>
                  {img.label}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files[0] && handleImageUpload(img.key, e.target.files[0])}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #d6d0c8",
                    borderRadius: 8,
                    fontSize: 13,
                    fontFamily: "'DM Sans', sans-serif",
                    boxSizing: "border-box",
                  }}
                />
                {formData.images[img.key] && (
                  <div style={{ marginTop: 8, fontSize: 12, color: "#5c6d5e", display: "flex", alignItems: "center", gap: 4 }}>
                    ✓ Uploaded
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!formData.name || !formData.jsonData}
            style={{
              width: "100%",
              padding: "14px 24px",
              background: formData.name && formData.jsonData ? "#5c6d5e" : "#d1d5db",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              fontWeight: 600,
              cursor: formData.name && formData.jsonData ? "pointer" : "not-allowed",
              transition: "all 0.2s ease",
            }}
          >
            Import Competitor Data
          </button>
        </div>
      </div>

      {/* Duplicate Warning Modal */}
      {showDuplicateWarning && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div style={{ background: "#fff", borderRadius: 12, padding: 40, maxWidth: 400, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16, color: "#c17817" }}>⚠</div>
            <h2
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 24,
                fontWeight: 600,
                margin: "0 0 12px 0",
                color: "#1a1a1a",
              }}
            >
              Firm Already Exists
            </h2>
            <p style={{ fontSize: 14, color: "#6b6358", marginBottom: 32 }}>
              "{existingFirm}" is already in your database. Do you want to replace the existing data?
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => {
                  setShowDuplicateWarning(false);
                  setExistingFirm(null);
                }}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  background: "#fff",
                  color: "#1a1a1a",
                  border: "1px solid #d6d0c8",
                  borderRadius: 8,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleReplaceConfirm}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  background: "#c17817",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Replace Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div style={{ background: "#fff", borderRadius: 12, padding: 40, maxWidth: 400, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
            <h2
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 24,
                fontWeight: 600,
                margin: "0 0 12px 0",
                color: "#1a1a1a",
              }}
            >
              Success!
            </h2>
            <p style={{ fontSize: 14, color: "#6b6358", marginBottom: 32 }}>
              Competitor data has been imported and saved.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={onAddAnother}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  background: "#fff",
                  color: "#5c6d5e",
                  border: "1px solid #5c6d5e",
                  borderRadius: 8,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Add Another
              </button>
              <button
                onClick={() => {
                  onCloseSuccess();
                  onBack();
                }}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  background: "#5c6d5e",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// TOOL VIEW
// ============================================================================

function ToolView({ view, competitors, onBack, onUpdateCompetitor, onDeleteFirm }) {
  // Render X-Ray Vision component for xray view
  if (view === "xray") {
    return <XRayVision competitors={competitors} onBack={onBack} />;
  }
  // Render Content Engine for content view
  if (view === "content") {
return <ContentEngine competitors={competitors} onBack={onBack} onUpdateCompetitor={onUpdateCompetitor} onDeleteFirm={onDeleteFirm} />;
  }
  // Render Competitor Scorecard for scorecard view
  if (view === "scorecard") {
    return <CompetitorScorecard competitors={competitors} onBack={onBack} />;
  }

return null;
}
