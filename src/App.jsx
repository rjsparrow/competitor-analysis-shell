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

  const firmList = Object.values(competitors).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#111110", minHeight: "100vh" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
      {view === "home" && <HomePage onNavigate={setView} competitors={competitors} firmList={firmList} />}

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
// HOME PAGE — Dark dashboard
// ============================================================================
function HomePage({ onNavigate, competitors, firmList }) {
  const firmCount = firmList.length;

  // Derive stats from real data
  const screensCount = firmList.reduce((acc, f) => {
    const imgs = f.images || {};
    return acc + Object.values(imgs).filter(Boolean).length;
  }, 0);

  // Average overall scorecard score across all firms
  const scoredFirms = firmList.filter(f => f.scorecard?.scores);
  const avgScore = scoredFirms.length > 0
    ? scoredFirms.reduce((acc, f) => {
        const scores = Object.values(f.scorecard.scores).filter(s => s > 0);
        const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
        return acc + avg;
      }, 0) / scoredFirms.length
    : 0;

  // Recent activity: last 4 firms sorted by importedAt
  const recentFirms = [...firmList]
    .filter(f => f.importedAt)
    .sort((a, b) => new Date(b.importedAt) - new Date(a.importedAt))
    .slice(0, 4);

  const formatTimeAgo = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const gaugePercent = avgScore / 5;
  const gaugeCircumference = 88;
  const gaugeDash = gaugeCircumference * gaugePercent;
  const gaugeOffset = gaugeCircumference - gaugeDash;

  const modules = [
    {
      id: "scorecard",
      num: "01",
      title: "Competitor Scorecard",
      desc: "Benchmark firms across 10 strategic categories and uncover key gaps.",
      link: "View Scorecard",
      accent: (
        <div style={{ textAlign: "center" }}>
          <svg width="72" height="48" viewBox="0 0 72 48" style={{ display: "block", margin: "0 auto 4px" }}>
            <path d="M8 44 A28 28 0 0 1 64 44" fill="none" stroke="#252320" strokeWidth="5" strokeLinecap="round" />
            <path d="M8 44 A28 28 0 0 1 64 44" fill="none" stroke="#C9922A" strokeWidth="5" strokeLinecap="round"
              strokeDasharray={gaugeCircumference}
              strokeDashoffset={gaugeOffset} />
          </svg>
          <div style={{ fontSize: 26, fontWeight: 500, color: "#f0ede6", lineHeight: 1 }}>
            {avgScore > 0 ? avgScore.toFixed(1) : "—"}
          </div>
          <div style={{ fontSize: 11, color: "#6a6660", marginTop: 2 }}>Average Score</div>
        </div>
      ),
    },
    {
      id: "xray",
      num: "02",
      title: "Website X-Ray Vision",
      desc: "Deep website audits covering structure, messaging, UX, SEO, and more.",
      link: "Start Audit",
      accent: (
        <div style={{
          width: 90, height: 64, background: "#1e1c18", borderRadius: 6,
          border: "1px solid #2e2d2a", overflow: "hidden", position: "relative"
        }}>
          <div style={{
            width: "100%", height: "100%",
            background: "linear-gradient(135deg, #E8632A 0%, #D45220 35%, #1a1816 35%)",
            position: "relative"
          }}>
            <div style={{
              position: "absolute", bottom: 6, left: 6, right: 6,
              fontSize: 7, color: "#fff", lineHeight: 1.3, fontWeight: 500
            }}>
              DEEP AUDIT<br />IN PROGRESS
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "content",
      num: "03",
      title: "Content Engine",
      desc: "Audit content strategy, publishing cadence, social presence, and thought leadership.",
      link: "Analyze Content",
      accent: (
        <div>
          <div style={{ fontSize: 9, color: "#4a4840", marginBottom: 4, textAlign: "right" }}>Content Visibility</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 60 }}>
            {[20, 32, 24, 44, 16, 52, 28].map((h, i) => (
              <div key={i} style={{
                width: 12, height: h, borderRadius: "2px 2px 0 0",
                background: i % 2 === 1 ? "#C9922A" : "#2e2d2a"
              }} />
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "import",
      num: "04",
      title: "Add New Competitor",
      desc: "Import firm data from competitive analysis research — JSON export plus screenshots.",
      link: "Import Firm",
      accent: (
        <div style={{ position: "relative", width: 90, height: 80 }}>
          {[
            { label: "Specialist", style: { top: 0, left: "50%", transform: "translateX(-50%)" } },
            { label: "Generalist", style: { bottom: 0, left: "50%", transform: "translateX(-50%)" } },
            { label: "Community", style: { left: 0, top: "50%", transform: "translateY(-50%)" } },
            { label: "Technical", style: { right: 0, top: "50%", transform: "translateY(-50%)" } },
          ].map(({ label, style }) => (
            <span key={label} style={{ fontSize: 9, color: "#4a4840", position: "absolute", ...style }}>{label}</span>
          ))}
          {[
            { bg: "#C9922A", top: 22, left: 38 },
            { bg: "#4a8c5c", top: 18, left: 58 },
            { bg: "#4a6a8c", top: 40, left: 48 },
            { bg: "#7a4a8c", top: 52, left: 20 },
            { bg: "#8c4a4a", top: 52, left: 60 },
          ].map((dot, i) => (
            <div key={i} style={{
              width: 9, height: 9, borderRadius: "50%",
              background: dot.bg, position: "absolute", top: dot.top, left: dot.left
            }} />
          ))}
        </div>
      ),
    },
  ];

  const stats = [
    { icon: "🏛", num: firmCount, label: "Firms Audited" },
    { icon: "🖥", num: screensCount, label: "Screens Captured" },
    { icon: "💡", num: scoredFirms.length * 10, label: "Strategic Insights" },
    { icon: "🎯", num: 10, label: "Categories Scored" },
  ];

  return (
    <div style={{ background: "#111110", minHeight: "100vh" }}>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 28px 0" }}>
        <span style={{ fontSize: 11, letterSpacing: "0.15em", color: "#9a9489", fontWeight: 500, textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>
          Midwest Architecture
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%", border: "1px solid #2e2d2a",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#9a9489", fontSize: 16
          }}>🔔</div>
          <div style={{
            width: 34, height: 34, borderRadius: "50%", border: "2px solid #C9922A",
            background: "#1e1c18", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 500, color: "#C9922A", letterSpacing: "0.05em",
            fontFamily: "'DM Mono', monospace"
          }}>MA</div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ padding: "28px 28px 20px" }}>
        <div style={{ width: 32, height: 2, background: "#C9922A", marginBottom: 16, borderRadius: 1 }} />
        <h1 style={{ fontSize: 40, fontWeight: 500, color: "#f0ede6", margin: "0 0 8px", lineHeight: 1.1, fontFamily: "'DM Sans', sans-serif" }}>
          Competitor Intelligence
        </h1>
        <p style={{ fontSize: 13, color: "#7a7670", margin: 0, maxWidth: 420, lineHeight: 1.5 }}>
          Strategic analysis of positioning, digital presence, and content leadership across Midwest architecture firms.
        </p>
      </div>

      {/* Stats row */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        gap: 1, background: "#1e1c18", margin: "0 28px", borderRadius: 10, overflow: "hidden"
      }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: "#161512", padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
              <span style={{ fontSize: 28, fontWeight: 500, color: "#f0ede6", lineHeight: 1 }}>{s.num}</span>
            </div>
            <div style={{ fontSize: 11, color: "#6a6660" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Module cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "20px 28px" }}>
        {modules.map((m) => (
          <button
            key={m.id}
            onClick={() => onNavigate(m.id)}
            style={{
              background: "#161512", border: "1px solid #252320", borderRadius: 12,
              padding: 22, position: "relative", overflow: "hidden", minHeight: 160,
              cursor: "pointer", textAlign: "left", transition: "border-color 0.15s",
              display: "block", width: "100%"
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#C9922A"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#252320"}
          >
            <div style={{ fontSize: 11, color: "#C9922A", fontWeight: 500, letterSpacing: "0.1em", marginBottom: 10, fontFamily: "'DM Mono', monospace" }}>
              {m.num}
            </div>
            <div style={{ fontSize: 16, fontWeight: 500, color: "#f0ede6", marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>
              {m.title}
            </div>
            <div style={{ fontSize: 12, color: "#6a6660", lineHeight: 1.5, maxWidth: 200 }}>
              {m.desc}
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 14, fontSize: 12, color: "#C9922A" }}>
              {m.link} →
            </div>
            {/* Accent graphic */}
            <div style={{ position: "absolute", right: 18, top: "50%", transform: "translateY(-50%)" }}>
              {m.accent}
            </div>
          </button>
        ))}
      </div>

      {/* Bottom row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "0 28px 28px" }}>
        {/* Recent activity */}
        <div style={{ background: "#161512", border: "1px solid #252320", borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 12, color: "#7a7670", marginBottom: 14, fontWeight: 500 }}>Recent Activity</div>
          {recentFirms.length > 0 ? recentFirms.map((f) => (
            <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #1e1c18" }}>
              <div style={{ width: 28, height: 28, background: "#1e1c18", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12 }}>🏛</div>
              <span style={{ fontSize: 12, color: "#c8c4bc", fontWeight: 500, minWidth: 130 }}>{f.name}</span>
              <span style={{ fontSize: 11, color: "#5a5650", flex: 1 }}>Data imported</span>
              <span style={{ fontSize: 11, color: "#4a4840" }}>{formatTimeAgo(f.importedAt)}</span>
            </div>
          )) : (
            <div style={{ fontSize: 12, color: "#4a4840", fontStyle: "italic" }}>No firms imported yet — add your first competitor above.</div>
          )}
          <div
            onClick={() => onNavigate("scorecard")}
            style={{ fontSize: 12, color: "#C9922A", display: "inline-flex", alignItems: "center", gap: 4, marginTop: 12, cursor: "pointer" }}
          >
            View all firms →
          </div>
        </div>

        {/* Insight card */}
        <div style={{ background: "#161512", border: "1px solid #252320", borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 11, color: "#C9922A", marginBottom: 8, fontWeight: 500 }}>Top Insight This Week</div>
          <div style={{ fontSize: 20, fontWeight: 500, color: "#f0ede6", lineHeight: 1.3, marginBottom: 12 }}>
            Thought leadership is the largest gap across all firms.
          </div>
          <div style={{ fontSize: 44, fontWeight: 500, color: "#C9922A", lineHeight: 1 }}>68%</div>
          <div style={{ fontSize: 12, color: "#6a6660", marginTop: 6, lineHeight: 1.4 }}>
            of firms publish thought leadership content sporadically or not at all.
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ICON COMPONENTS (kept for ImportPage compatibility)
// ============================================================================
function StarIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <path d="M24 4L28.854 18.708H44.472L31.809 27.584L36.663 42.292L24 33.416L11.337 42.292L16.191 27.584L3.528 18.708H19.146L24 4Z" fill="#b68d40" stroke="#b68d40" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

// ============================================================================
// IMPORT PAGE
// ============================================================================
function ImportPage({ onImport, onBack, showSuccess, onCloseSuccess, onAddAnother }) {
  const [formData, setFormData] = useState({
    name: "",
    jsonData: "",
    images: { hero: null, fullHomepage: null, portfolio: null, logo: null },
  });
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [existingFirm, setExistingFirm] = useState(null);

  const handleImageUpload = (key, file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData((prev) => ({ ...prev, images: { ...prev.images, [key]: e.target.result } }));
    };
    reader.readAsDataURL(file);
  };

  const checkDuplicate = async (firmName) => {
    try {
      const response = await fetch(`/api/check-competitor?name=${encodeURIComponent(firmName)}`);
      const data = await response.json();
      return data.exists;
    } catch { return false; }
  };

  const handleSubmit = async () => {
    try {
      const parsed = JSON.parse(formData.jsonData);
      const isDuplicate = await checkDuplicate(formData.name);
      if (isDuplicate) { setExistingFirm(formData.name); setShowDuplicateWarning(true); return; }
      await performImport(parsed);
    } catch (err) {
      console.error('Error details:', err);
      alert("Invalid JSON format. Please check your data and try again.");
    }
  };

  const performImport = async (parsed) => {
    const scorecardRoot = parsed.scorecard || parsed;
    const xrayRoot = parsed.xray || parsed;
    const contentRoot = parsed.contentEngine || parsed;

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
      cta: scorecardRoot.cta || scorecardRoot.calls_to_action || 0,
    };

    const firmData = {
      ...xrayRoot,
      name: formData.name || parsed.name || "Unknown Firm",
      peerGroup: formData.peerGroup || parsed.peerGroup || scorecardRoot.peerGroup || "Peer Group",
      scorecard: { scores: extractedScores, notes: scorecardRoot.notes || {} },
      contentEngine: { keyTakeaway: contentRoot.keyTakeaway || parsed.keyTakeaway || "", ...contentRoot },
      images: { ...(parsed.images || {}), ...formData.images },
      importedAt: new Date().toISOString(),
    };

    await onImport(firmData);
    setFormData({ name: "", jsonData: "", images: { hero: null, fullHomepage: null, portfolio: null, logo: null } });
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
    <div style={{ background: "#111110", minHeight: "100vh" }}>
      <div style={{ background: "#161512", borderBottom: "1px solid #252320", padding: "32px 32px 28px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#C9922A", cursor: "pointer", marginBottom: 16, padding: 0, display: "flex", alignItems: "center", gap: 8 }}>
            ← Back to Home
          </button>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: 2.5, color: "#C9922A", marginBottom: 8 }}>
            Midwest Architecture
          </div>
          <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 32, fontWeight: 600, margin: "0 0 8px 0", color: "#f0ede6" }}>
            Import Competitor Data
          </h1>
          <p style={{ fontSize: 14, color: "#7a7670", margin: 0, maxWidth: 560, lineHeight: 1.5 }}>
            Add a new firm to your competitive analysis toolkit — paste JSON and upload screenshots.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px" }}>
        <div style={{ background: "#161512", borderRadius: 12, border: "1px solid #252320", padding: 32 }}>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontWeight: 600, fontSize: 13, color: "#9a9489", marginBottom: 8 }}>Firm Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Guidon Design"
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #2e2d2a", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14, boxSizing: "border-box", background: "#1e1c18", color: "#f0ede6" }} />
          </div>

          <div style={{ marginBottom: 32 }}>
            <label style={{ display: "block", fontWeight: 600, fontSize: 13, color: "#9a9489", marginBottom: 8 }}>JSON Data</label>
            <textarea value={formData.jsonData} onChange={(e) => setFormData({ ...formData, jsonData: e.target.value })}
              placeholder='Paste combined JSON here (e.g., { "scorecard": {...}, "xray": {...}, "contentEngine": {...} })'
              style={{ width: "100%", minHeight: 200, padding: 12, border: "1px solid #2e2d2a", borderRadius: 8, fontFamily: "'DM Mono', monospace", fontSize: 12, resize: "vertical", boxSizing: "border-box", background: "#1e1c18", color: "#f0ede6" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
            {[{ key: "hero", label: "Hero Image" }, { key: "fullHomepage", label: "Full Homepage Screenshot" }, { key: "portfolio", label: "Portfolio Page" }, { key: "logo", label: "Logo" }].map((img) => (
              <div key={img.key}>
                <label style={{ display: "block", fontWeight: 600, fontSize: 13, color: "#9a9489", marginBottom: 8 }}>{img.label}</label>
                <input type="file" accept="image/*" onChange={(e) => e.target.files[0] && handleImageUpload(img.key, e.target.files[0])}
                  style={{ width: "100%", padding: "8px", border: "1px solid #2e2d2a", borderRadius: 8, fontSize: 13, fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box", background: "#1e1c18", color: "#9a9489" }} />
                {formData.images[img.key] && <div style={{ marginTop: 8, fontSize: 12, color: "#C9922A" }}>✓ Uploaded</div>}
              </div>
            ))}
          </div>

          <button onClick={handleSubmit} disabled={!formData.name || !formData.jsonData}
            style={{ width: "100%", padding: "14px 24px", background: formData.name && formData.jsonData ? "#C9922A" : "#2e2d2a", color: formData.name && formData.jsonData ? "#111110" : "#4a4840", border: "none", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, cursor: formData.name && formData.jsonData ? "pointer" : "not-allowed", transition: "all 0.2s ease" }}>
            Import Competitor Data
          </button>
        </div>
      </div>

      {showDuplicateWarning && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#161512", border: "1px solid #252320", borderRadius: 12, padding: 40, maxWidth: 400, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 24, fontWeight: 600, margin: "0 0 12px 0", color: "#f0ede6" }}>Firm Already Exists</h2>
            <p style={{ fontSize: 14, color: "#7a7670", marginBottom: 32 }}>"{existingFirm}" is already in your database. Do you want to replace the existing data?</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => { setShowDuplicateWarning(false); setExistingFirm(null); }} style={{ flex: 1, padding: "12px 20px", background: "transparent", color: "#f0ede6", border: "1px solid #2e2d2a", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleReplaceConfirm} style={{ flex: 1, padding: "12px 20px", background: "#C9922A", color: "#111110", border: "none", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Replace Data</button>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#161512", border: "1px solid #252320", borderRadius: 12, padding: 40, maxWidth: 400, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 24, fontWeight: 600, margin: "0 0 12px 0", color: "#f0ede6" }}>Imported!</h2>
            <p style={{ fontSize: 14, color: "#7a7670", marginBottom: 32 }}>Competitor data has been saved.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={onAddAnother} style={{ flex: 1, padding: "12px 20px", background: "transparent", color: "#C9922A", border: "1px solid #C9922A", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Add Another</button>
              <button onClick={() => { onCloseSuccess(); onBack(); }} style={{ flex: 1, padding: "12px 20px", background: "#C9922A", color: "#111110", border: "none", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Back to Home</button>
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
  if (view === "xray") return <XRayVision competitors={competitors} onBack={onBack} />;
  if (view === "content") return <ContentEngine competitors={competitors} onBack={onBack} onUpdateCompetitor={onUpdateCompetitor} onDeleteFirm={onDeleteFirm} />;
  if (view === "scorecard") return <CompetitorScorecard competitors={competitors} onBack={onBack} />;
  return null;
}
