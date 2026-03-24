import { useState } from "react";

// ─── THEME ──────────────────────────────────────────────────────────
const ACCENT = "#1B2A4A";
const ACCENT_WARM = "#b68d40";
const BG = "#f5f2ed";
const CARD = "#fff";
const BORDER = "#e8e4df";
const MUTED = "#8a8278";
const DARK = "#1a1a1a";
const SUBTLE = "#faf8f5";
const DANGER = "#a4433a";
const SECTION_ALT = "rgba(182,141,64,0.07)";

const BLOG_MIX_KEYS = [
  { key: "projectCaseStudies", label: "Project case studies", color: "#5c6d5e" },
  { key: "industryTrends", label: "Industry trends", color: "#b68d40" },
  { key: "designProcess", label: "Design process", color: "#7a8c78" },
  { key: "researchWhitepapers", label: "Research / whitepapers", color: "#6b4e7a" },
  { key: "communityHealth", label: "Community health", color: "#2e7060" },
  { key: "ruralHealth", label: "Rural health / access", color: "#3d6499" },
  { key: "sustainability", label: "Sustainability", color: "#8B6914" },
  { key: "firmNews", label: "Firm news / awards", color: "#a4433a" },
  { key: "conferenceRecaps", label: "Conference recaps", color: "#b5563a" },
  { key: "opinionPOV", label: "Opinion / POV", color: "#1b2a4a" },
];

const SOCIAL_MIX_KEYS = [
  { key: "projectShowcases", label: "Project showcases", color: "#5c6d5e" },
  { key: "groundbreakings", label: "Groundbreakings", color: "#b68d40" },
  { key: "teamCulture", label: "Team / culture", color: "#7a8c78" },
  { key: "awards", label: "Awards", color: "#6b4e7a" },
  { key: "clientPartner", label: "Client / partner", color: "#2e7060" },
  { key: "conferences", label: "Conferences / events", color: "#3d6499" },
  { key: "community", label: "Community / charity", color: "#8B6914" },
  { key: "thoughtLeadership", label: "Thought leadership", color: "#a4433a" },
  { key: "hiring", label: "Hiring / recruitment", color: "#b5563a" },
  { key: "holidays", label: "Holidays / national days", color: "#1b2a4a" },
];

const HIGHLIGHT_TAGS = ["standout post","content to emulate","strong example","competitive threat"];

const PLATFORM_COLORS = {
  LinkedIn: "#0A66C2", Facebook: "#1877F2", Instagram: "#E4405F", YouTube: "#FF0000",
  "Twitter/X": "#000000", TikTok: "#010101", Pinterest: "#BD081C", Vimeo: "#1AB7EA",
};

const FIRM_LOGOS = {
  HKS:"HKS",HOK:"HOK",HDR:"HDR",Cannon:"CAN",ESA:"ESA","Gresham Smith":"GS",BSA:"BSA",E4H:"E4H",
  SmithGroup:"SG",NBBJ:"NB",ARC:"ARC",Guidon:"GD",Champlin:"CH",Haffer:"HF",
  "Perkins Eastman":"PE",RLPS:"RL","Progressive AE":"PA","Design Collaborative":"DC",
  KrM:"KrM",MSKTD:"MS",CSO:"CSO",MKM:"MKM",
};

const sans = (x={}) => ({ fontFamily: "'DM Sans', sans-serif", ...x });
const mono = (x={}) => ({ fontFamily: "'DM Mono', monospace", ...x });
const inputStyle = { ...sans(), width: "100%", padding: "10px 12px", border: "1px solid #d6d0c8", borderRadius: 8, fontSize: 13, color: DARK, background: CARD, outline: "none", boxSizing: "border-box" };
const textareaStyle = { ...inputStyle, minHeight: 80, resize: "vertical", background: SUBTLE };
const cardStyle = { background: CARD, borderRadius: 12, border: "1px solid "+BORDER, padding: "24px 28px", marginBottom: 20 };
const cardAltStyle = { ...cardStyle, background: SECTION_ALT };
const btnSmall = { ...sans(), padding: "6px 14px", background: "transparent", border: "1px solid "+BORDER, borderRadius: 6, fontSize: 12, cursor: "pointer", color: MUTED };
const sectionHeader = { ...sans(), fontSize: 16, fontWeight: 700, color: DARK, marginBottom: 14 };

const emptyContentEngine = () => ({
  starred: false, keyTakeaway: "", thumbsRating: "",
  content: {
    blogUrl: "", totalPosts: "", cadence: "", isActive: true, contentFormat: "",
    blogMix: Object.fromEntries(BLOG_MIX_KEYS.map(k => [k.key, 0])),
    contentHubs: [],
    thoughtLeadership: { whitepapers:"", originalResearch:"", speakingEngagements:"", programs:"", downloadableResources:"", newsletter:"" },
    contentSEO: { optimizedPosts:"", pillarPages:"", structuredContent:"", targetTerms:"", notes:"",
      geoPromptsTested:"", geoAppears:"", geoQuotableContent:"", geoTopicAuthority:"", geoStructuredContent:"", geoIndustryListings:"", geoNotes:"" },
    highlights: [], notes: "",
  },
  social: {
    platforms: [],
    socialMix: Object.fromEntries(SOCIAL_MIX_KEYS.map(k => [k.key, 0])),
    video: { usesVideo:false, platforms:[], formats:[], contentTypes:[], namedSeries:"", significance:"", quality:"" },
    engagement: { respondsToComments:"", voiceConsistency:"", employeeAdvocacy:"" },
    highlights: [], notes: "",
  },
  niche: {
    sectorLanguage: { ruralHealthcare:"", criticalAccess:"", fqhc:"", underserved:"", continuumOfCare:"", facilityTypes:"", clientSizeSignaling:"", geographicSpecificity:"" },
    proofStorytelling: { challengeApproachOutcome:"", quantifiableMetrics:"", clientTestimonials:"", beforeAfter:"", longevityCredibility:"", namedChallenges:"", designToOutcome:"" },
    proposalReady: { rfpReadyPages:"", proposalUrls:"", downloadableCaseStudies:"", aboveFoldSectorCues:"" },
    highlights: [], notes: "",
  },
});

// ─── SHARED COMPONENTS ───────────────────────────────────────────────
const SectionLabel = ({ children }) => <div style={sectionHeader}>{children}</div>;
const FieldLabel = ({ children }) => <div style={{ ...sans(), fontSize: 12, fontWeight: 600, color: "#5c5549", marginBottom: 4 }}>{children}</div>;

const FirmLogo = ({ name, size=32 }) => {
  const abbr = FIRM_LOGOS[name] || name.slice(0,2).toUpperCase();
  return <div style={{ width: size, height: size, borderRadius: 6, background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", ...mono(), fontSize: size*0.32, fontWeight: 600, flexShrink: 0 }}>{abbr}</div>;
};

const StarButton = ({ starred, onClick }) => (
  <button onClick={onClick} style={{ background: starred ? ACCENT_WARM : "#d6d0c8", border: "none", cursor: "pointer", color: "#fff", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
    {starred ? "★" : "☆"}
  </button>
);

const ThumbButton = ({ type, active, onClick }) => (
  <button onClick={onClick} style={{ background: active ? (type==="up" ? ACCENT_WARM : DANGER) : "#e8e4df", border: "none", cursor: "pointer", color: active ? "#fff" : MUTED, width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
    {type==="up" ? "👍" : "👎"}
  </button>
);

const LinkField = ({ value, onChange, placeholder }) => (
  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
    <input value={value||""} onChange={onChange} style={{ ...inputStyle, flex: 1 }} placeholder={placeholder||"https://..."} />
    {value && value.startsWith("http") && <a href={value} target="_blank" rel="noreferrer" style={{ ...sans(), fontSize: 11, color: ACCENT_WARM, textDecoration: "none", padding: "4px 8px", border: "1px solid "+ACCENT_WARM, borderRadius: 4 }}>↗</a>}
  </div>
);

const PlatformBadge = ({ name, size=36 }) => {
  const color = PLATFORM_COLORS[name] || "#555";
  const icon = name==="LinkedIn"?"in":name==="Facebook"?"f":name==="Instagram"?"Ig":name==="YouTube"?"▶":name==="Twitter/X"?"X":name==="TikTok"?"Tk":name.slice(0,2);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: size, height: size, borderRadius: 8, background: color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", ...sans(), fontSize: size*0.35, fontWeight: 700, flexShrink: 0 }}>{icon}</div>
      <span style={{ ...sans(), fontSize: 14, fontWeight: 600, color: DARK }}>{name}</span>
    </div>
  );
};

const PieChart = ({ data, keys, size=160 }) => {
  const total = keys.reduce((s,k) => s+(data[k.key]||0), 0);
  if (!total) return <div style={{ width: size, height: size, borderRadius: "50%", background: "#f0ece6", display: "flex", alignItems: "center", justifyContent: "center", ...sans(), fontSize: 11, color: MUTED }}>No data</div>;
  const sorted = [...keys].sort((a,b) => (data[b.key]||0)-(data[a.key]||0));
  const top4 = sorted.slice(0,4).filter(k => data[k.key]>0);
  const otherVal = sorted.slice(4).reduce((s,k) => s+(data[k.key]||0), 0);
  const slices = [...top4.map(k => ({ label:k.label, value:data[k.key], color:k.color })), ...(otherVal>0?[{ label:"Other", value:otherVal, color:"#d1d5db" }]:[])];
  const st = slices.reduce((s,sl) => s+sl.value, 0);
  let cum = -90; const r = size/2;
  const paths = slices.map((sl,i) => {
    const ang=(sl.value/st)*360; const sa=cum; cum+=ang;
    const sr=(sa*Math.PI)/180; const er=(cum*Math.PI)/180;
    const x1=r+r*Math.cos(sr); const y1=r+r*Math.sin(sr);
    const x2=r+r*Math.cos(er); const y2=r+r*Math.sin(er);
    if (ang>=359.9) return <circle key={i} cx={r} cy={r} r={r} fill={sl.color}/>;
    return <path key={i} d={`M${r},${r} L${x1},${y1} A${r},${r} 0 ${ang>180?1:0},1 ${x2},${y2} Z`} fill={sl.color}/>;
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>{paths}</svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {slices.map((sl,i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, ...sans(), fontSize: 11 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: sl.color, flexShrink: 0 }}/>
            <span style={{ color: "#5c5549" }}>{sl.label}</span>
            <span style={{ ...mono(), fontSize: 10, color: MUTED }}>{Math.round((sl.value/st)*100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const MixInput = ({ data, keys, onChange }) => {
  const total = keys.reduce((s,k) => s+(data[k.key]||0), 0);
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" }}>
        {keys.map(k => (
          <div key={k.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: k.color, flexShrink: 0 }}/>
            <span style={{ ...sans(), fontSize: 12, color: "#5c5549", flex: 1 }}>{k.label}</span>
            <input type="number" min={0} max={100} value={data[k.key]||""} onChange={e => onChange(k.key, parseInt(e.target.value)||0)}
              style={{ ...mono(), width: 52, padding: "4px 6px", border: "1px solid #d6d0c8", borderRadius: 4, fontSize: 12, textAlign: "right", outline: "none" }} placeholder="0"/>
            <span style={{ ...mono(), fontSize: 10, color: MUTED }}>%</span>
          </div>
        ))}
      </div>
      <div style={{ ...mono(), fontSize: 11, color: total===100?ACCENT_WARM:total>100?DANGER:MUTED, marginTop: 8 }}>Total: {total}% {total===100?"✓":total>100?"(over)":""}</div>
    </div>
  );
};

const HighlightsSection = ({ highlights=[], onChange }) => {
  const add = () => onChange([...highlights, { url:"", note:"", tag:HIGHLIGHT_TAGS[0] }]);
  const update = (i,f,v) => { const h=[...highlights]; h[i]={...h[i],[f]:v}; onChange(h); };
  const remove = (i) => onChange(highlights.filter((_,j)=>j!==i));
  return (
    <div>
      <SectionLabel>Highlights & Notable Links</SectionLabel>
      {highlights.map((h,i) => (
        <div key={i} style={{ background: SUBTLE, borderRadius: 8, padding: 14, marginBottom: 10, border: "1px solid "+BORDER }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <div style={{ flex: 1 }}><FieldLabel>URL</FieldLabel><LinkField value={h.url} onChange={e => update(i,"url",e.target.value)} placeholder="Paste URL to post or article" /></div>
            <div>
              <FieldLabel>Tag</FieldLabel>
              <select value={h.tag} onChange={e => update(i,"tag",e.target.value)} style={{ ...sans(), fontSize: 12, padding: "8px 10px", border: "1px solid #d6d0c8", borderRadius: 6, background: CARD, color: DARK }}>
                {HIGHLIGHT_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ alignSelf: "flex-end" }}><button onClick={() => remove(i)} style={{ ...btnSmall, color: DANGER, borderColor: DANGER, padding: "6px 10px" }}>×</button></div>
          </div>
          <FieldLabel>Why is this notable?</FieldLabel>
          <textarea value={h.note} onChange={e => update(i,"note",e.target.value)} rows={6} style={{ ...textareaStyle, minHeight: 120 }} placeholder="Describe what makes this stand out…" />
        </div>
      ))}
      <button onClick={add} style={btnSmall}>+ Add highlight</button>
    </div>
  );
};

// ─── TAB: CONTENT & PUBLISHING ───────────────────────────────────────
const TabContent = ({ firm, onChange }) => {
  const _ec = emptyContentEngine();
  const c = { ..._ec.content, ...(firm.content || {}) };
  const uc = (f,v) => onChange({ ...firm, content: { ...c, [f]: v } });
  const ucTL = (f,v) => onChange({ ...firm, content: { ...c, thoughtLeadership: { ...c.thoughtLeadership, [f]: v } } });
  const ucSEO = (f,v) => onChange({ ...firm, content: { ...c, contentSEO: { ...c.contentSEO, [f]: v } } });
  return (
    <div>
      <div style={{ ...sans(), fontSize: 13, color: MUTED, marginBottom: 20, lineHeight: 1.5, fontStyle: "italic" }}>What they publish, how often, and whether it constitutes real thought leadership or just box-checking.</div>
      <div style={cardStyle}>
        <SectionLabel>Blog / News Presence</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div><FieldLabel>Blog URL</FieldLabel><LinkField value={c.blogUrl} onChange={e => uc("blogUrl",e.target.value)} /></div>
          <div><FieldLabel>Total Posts Visible</FieldLabel><input value={c.totalPosts} onChange={e => uc("totalPosts",e.target.value)} style={inputStyle} placeholder="~50" /></div>
          <div><FieldLabel>Publishing Cadence</FieldLabel><input value={c.cadence} onChange={e => uc("cadence",e.target.value)} style={inputStyle} placeholder="e.g., 2-3 posts/month" /></div>
          <div><FieldLabel>Content Format</FieldLabel><input value={c.contentFormat} onChange={e => uc("contentFormat",e.target.value)} style={inputStyle} placeholder="Short posts, long-form, mixed" /></div>
        </div>
        <div style={{ marginTop: 12 }}>
          <label style={{ ...sans(), fontSize: 12, color: "#5c5549", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" checked={c.isActive} onChange={e => uc("isActive",e.target.checked)} /> Blog is actively maintained
          </label>
        </div>
      </div>
      <div style={cardAltStyle}>
        <SectionLabel>Blog Content Mix</SectionLabel>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 280 }}><MixInput data={c.blogMix} keys={BLOG_MIX_KEYS} onChange={(k,v) => uc("blogMix",{ ...c.blogMix, [k]: v })} /></div>
          <div style={{ flexShrink: 0 }}><PieChart data={c.blogMix} keys={BLOG_MIX_KEYS} /></div>
        </div>
      </div>
      <div style={cardStyle}>
        <SectionLabel>Content Hubs & Landing Pages</SectionLabel>
        {(c.contentHubs||[]).map((hub,i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
            <input value={hub.name} onChange={e => { const h=[...(c.contentHubs||[])]; h[i]={...h[i],name:e.target.value}; uc("contentHubs",h); }} style={{ ...inputStyle, flex: 1 }} placeholder="Hub name" />
            <input value={hub.url} onChange={e => { const h=[...(c.contentHubs||[])]; h[i]={...h[i],url:e.target.value}; uc("contentHubs",h); }} style={{ ...inputStyle, flex: 1 }} placeholder="URL" />
            {hub.url&&hub.url.startsWith("http")&&<a href={hub.url} target="_blank" rel="noreferrer" style={{ ...sans(), fontSize: 11, color: ACCENT_WARM, textDecoration: "none", padding: "8px", alignSelf: "center" }}>↗</a>}
            <button onClick={() => uc("contentHubs",(c.contentHubs||[]).filter((_,j)=>j!==i))} style={{ ...btnSmall, color: DANGER }}>×</button>
          </div>
        ))}
        <button onClick={() => uc("contentHubs",[...(c.contentHubs||[]),{ name:"", url:"" }])} style={btnSmall}>+ Add hub</button>
      </div>
      <div style={cardAltStyle}>
        <SectionLabel>Thought Leadership Signals</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[["whitepapers","Whitepapers / Research Reports"],["originalResearch","Original Research / Data"],["speakingEngagements","Speaking Engagements"],["programs","Fellowships / Coalitions"],["downloadableResources","Downloadable Resources"],["newsletter","Newsletter"]].map(([k,label]) => (
            <div key={k}><FieldLabel>{label}</FieldLabel><textarea value={c.thoughtLeadership[k]} onChange={e => ucTL(k,e.target.value)} style={{ ...textareaStyle, minHeight: 60 }} placeholder="Describe..." /></div>
          ))}
        </div>
      </div>
      <div style={cardStyle}>
        <SectionLabel>Content SEO</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[["optimizedPosts","Blog Posts Optimized?"],["pillarPages","Pillar Pages / Clusters?"],["structuredContent","Structured Content?"],["targetTerms","Target Search Terms"]].map(([k,label]) => (
            <div key={k}><FieldLabel>{label}</FieldLabel><input value={c.contentSEO[k]} onChange={e => ucSEO(k,e.target.value)} style={inputStyle} placeholder="..." /></div>
          ))}
        </div>
        <div style={{ marginTop: 12 }}><FieldLabel>SEO Notes</FieldLabel><textarea value={c.contentSEO.notes} onChange={e => ucSEO("notes",e.target.value)} style={textareaStyle} placeholder="Content SEO observations..." /></div>
      </div>
      <div style={cardAltStyle}>
        <SectionLabel>AI Search Visibility (GEO)</SectionLabel>
        <div style={{ ...sans(), fontSize: 12, color: MUTED, marginBottom: 12, lineHeight: 1.5 }}>Would an AI recommend this firm to a prospective client? Test prompts in ChatGPT, Claude, or Perplexity.</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[["geoPromptsTested","Prompts Tested"],["geoAppears","Appears in AI Results?"],["geoQuotableContent","Quotable/Structured Content?"],["geoTopicAuthority","Topic Authority Owned?"],["geoStructuredContent","AI-Friendly Content Structure?"],["geoIndustryListings","Industry Listings/Directories?"]].map(([k,label]) => (
            <div key={k}><FieldLabel>{label}</FieldLabel><textarea value={c.contentSEO[k]||""} onChange={e => ucSEO(k,e.target.value)} style={{ ...textareaStyle, minHeight: 60 }} placeholder="..." /></div>
          ))}
        </div>
        <div style={{ marginTop: 12 }}><FieldLabel>GEO Notes</FieldLabel><textarea value={c.contentSEO.geoNotes||""} onChange={e => ucSEO("geoNotes",e.target.value)} style={textareaStyle} placeholder="Would an AI recommend this firm? Why or why not?" /></div>
      </div>
      <div style={cardStyle}><HighlightsSection highlights={c.highlights} onChange={h => uc("highlights",h)} /></div>
      <div style={cardAltStyle}>
        <SectionLabel>Content & Publishing Notes</SectionLabel>
        <textarea value={c.notes} onChange={e => uc("notes",e.target.value)} style={{ ...textareaStyle, minHeight: 100 }} placeholder="Overall observations about their content strategy..." />
      </div>
    </div>
  );
};

// ─── TAB: SOCIAL & VIDEO ─────────────────────────────────────────────
const TabSocial = ({ firm, onChange }) => {
  const s = firm.social;
  const us = (f,v) => onChange({ ...firm, social: { ...s, [f]: v } });
  const usv = (f,v) => onChange({ ...firm, social: { ...s, video: { ...s.video, [f]: v } } });
  const use_ = (f,v) => onChange({ ...firm, social: { ...s, engagement: { ...s.engagement, [f]: v } } });
  const addP = () => us("platforms",[...s.platforms,{ name:"", url:"", followers:"", postsPerMonth:"", lastPostDate:"", notes:"" }]);
  const upP = (i,f,v) => { const p=[...s.platforms]; p[i]={...p[i],[f]:v}; us("platforms",p); };
  const rmP = (i) => us("platforms",s.platforms.filter((_,j)=>j!==i));
  return (
    <div>
      <div style={{ ...sans(), fontSize: 13, color: MUTED, marginBottom: 20, lineHeight: 1.5, fontStyle: "italic" }}>Where they show up on social, what they post about, how they use video, and whether anyone is actually engaging.</div>
      <div style={cardStyle}>
        <SectionLabel>Platform Inventory</SectionLabel>
        {s.platforms.map((pl,i) => (
          <div key={i} style={{ background: PLATFORM_COLORS[pl.name]?`${PLATFORM_COLORS[pl.name]}10`:SUBTLE, borderRadius: 10, padding: 16, marginBottom: 12, border: "1px solid "+(PLATFORM_COLORS[pl.name]?`${PLATFORM_COLORS[pl.name]}30`:BORDER) }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              {pl.name ? <PlatformBadge name={pl.name} /> : <span style={{ ...sans(), fontSize: 13, color: MUTED }}>New platform</span>}
              <button onClick={() => rmP(i)} style={{ ...btnSmall, color: DANGER, borderColor: DANGER }}>×</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div><FieldLabel>Platform</FieldLabel><input value={pl.name} onChange={e => upP(i,"name",e.target.value)} style={inputStyle} placeholder="e.g., LinkedIn" /></div>
              <div><FieldLabel>Profile URL</FieldLabel><LinkField value={pl.url} onChange={e => upP(i,"url",e.target.value)} placeholder="Profile URL" /></div>
              <div><FieldLabel>Followers</FieldLabel><input value={pl.followers} onChange={e => upP(i,"followers",e.target.value)} style={inputStyle} placeholder="12.5K" /></div>
              <div><FieldLabel>Posts/Month (avg 9mo)</FieldLabel><input value={pl.postsPerMonth} onChange={e => upP(i,"postsPerMonth",e.target.value)} style={inputStyle} placeholder="~8" /></div>
              <div><FieldLabel>Last Post Date</FieldLabel><input value={pl.lastPostDate} onChange={e => upP(i,"lastPostDate",e.target.value)} style={inputStyle} placeholder="Mar 2026" /></div>
              <div><FieldLabel>Notes</FieldLabel><input value={pl.notes} onChange={e => upP(i,"notes",e.target.value)} style={inputStyle} placeholder="Platform notes..." /></div>
            </div>
          </div>
        ))}
        <button onClick={addP} style={btnSmall}>+ Add platform</button>
      </div>
      <div style={cardAltStyle}>
        <SectionLabel>Social Content Mix (Past 9 Months)</SectionLabel>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 280 }}><MixInput data={s.socialMix} keys={SOCIAL_MIX_KEYS} onChange={(k,v) => us("socialMix",{ ...s.socialMix, [k]: v })} /></div>
          <div style={{ flexShrink: 0 }}><PieChart data={s.socialMix} keys={SOCIAL_MIX_KEYS} /></div>
        </div>
      </div>
      <div style={cardStyle}>
        <SectionLabel>Video Usage</SectionLabel>
        <label style={{ ...sans(), fontSize: 13, color: "#5c5549", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 12 }}>
          <input type="checkbox" checked={s.video.usesVideo} onChange={e => usv("usesVideo",e.target.checked)} /> Uses video on social
        </label>
        {s.video.usesVideo && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><FieldLabel>Video Platforms</FieldLabel><input value={(s.video.platforms||[]).join(", ")} onChange={e => usv("platforms",e.target.value.split(",").map(s=>s.trim()).filter(Boolean))} style={inputStyle} placeholder="LinkedIn, YouTube" /></div>
            <div><FieldLabel>Formats</FieldLabel><input value={(s.video.formats||[]).join(", ")} onChange={e => usv("formats",e.target.value.split(",").map(s=>s.trim()).filter(Boolean))} style={inputStyle} placeholder="Reels, Stories" /></div>
            <div><FieldLabel>Content Types</FieldLabel><input value={(s.video.contentTypes||[]).join(", ")} onChange={e => usv("contentTypes",e.target.value.split(",").map(s=>s.trim()).filter(Boolean))} style={inputStyle} placeholder="Walkthroughs, drone" /></div>
            <div><FieldLabel>Named Series</FieldLabel><input value={s.video.namedSeries} onChange={e => usv("namedSeries",e.target.value)} style={inputStyle} placeholder="Series name" /></div>
            <div><FieldLabel>Significance</FieldLabel><input value={s.video.significance} onChange={e => usv("significance",e.target.value)} style={inputStyle} placeholder="Significant, occasional" /></div>
            <div><FieldLabel>Quality</FieldLabel><input value={s.video.quality} onChange={e => usv("quality",e.target.value)} style={inputStyle} placeholder="Professional, in-house" /></div>
          </div>
        )}
      </div>
      <div style={cardAltStyle}>
        <SectionLabel>Engagement & Tone</SectionLabel>
        <div style={{ display: "grid", gap: 12 }}>
          <div><FieldLabel>Responds to Comments?</FieldLabel><textarea value={s.engagement.respondsToComments} onChange={e => use_("respondsToComments",e.target.value)} style={{ ...textareaStyle, minHeight: 70 }} placeholder="Yes/No/Sometimes — describe pattern" /></div>
          <div><FieldLabel>Voice Consistency with Website</FieldLabel><textarea value={s.engagement.voiceConsistency} onChange={e => use_("voiceConsistency",e.target.value)} style={{ ...textareaStyle, minHeight: 70 }} placeholder="Does the social voice match their website voice?" /></div>
          <div><FieldLabel>Employee Advocacy</FieldLabel><textarea value={s.engagement.employeeAdvocacy} onChange={e => use_("employeeAdvocacy",e.target.value)} style={{ ...textareaStyle, minHeight: 70 }} placeholder="Do team members post or share firm content?" /></div>
        </div>
      </div>
      <div style={cardStyle}><HighlightsSection highlights={s.highlights} onChange={h => us("highlights",h)} /></div>
      <div style={cardAltStyle}>
        <SectionLabel>Social & Video Notes</SectionLabel>
        <textarea value={s.notes} onChange={e => us("notes",e.target.value)} style={{ ...textareaStyle, minHeight: 200 }} placeholder="Overall social strategy observations..." />
      </div>
    </div>
  );
};

// ─── TAB: NICHE POSITIONING & PROOF ──────────────────────────────────
const TabNiche = ({ firm, onChange }) => {
  const n = firm.niche;
  const un = (sec,f,v) => onChange({ ...firm, niche: { ...n, [sec]: { ...n[sec], [f]: v } } });
  return (
    <div>
      <div style={{ ...sans(), fontSize: 13, color: MUTED, marginBottom: 20, lineHeight: 1.5, fontStyle: "italic" }}>Are they writing about rural health, community hospitals, and underserved populations — or just claiming it on their website?</div>
      <div style={cardStyle}>
        <SectionLabel>Sector-Specific Language in Content</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[["ruralHealthcare","Rural Healthcare Mentions"],["criticalAccess","Critical Access / Community Hospitals"],["fqhc","FQHC / Community Health Centers"],["underserved","Underserved / Health Equity"],["continuumOfCare","Continuum of Care Language"],["facilityTypes","Facility Types Emphasized"],["clientSizeSignaling","Client Size Signaling"],["geographicSpecificity","Geographic Specificity"]].map(([k,label]) => (
            <div key={k}><FieldLabel>{label}</FieldLabel><textarea value={n.sectorLanguage[k]} onChange={e => un("sectorLanguage",k,e.target.value)} style={{ ...textareaStyle, minHeight: 60 }} placeholder="What do you see in their content?" /></div>
          ))}
        </div>
      </div>
      <div style={cardAltStyle}>
        <SectionLabel>Proof Storytelling Patterns</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[["challengeApproachOutcome","Challenge / Approach / Outcome"],["quantifiableMetrics","Quantifiable Metrics"],["clientTestimonials","Client Testimonials in Content"],["beforeAfter","Before / After Framing"],["longevityCredibility","Longevity / Credibility Signals"],["namedChallenges","Specific Named Challenges"],["designToOutcome","Design-to-Outcome Connections"]].map(([k,label]) => (
            <div key={k}><FieldLabel>{label}</FieldLabel><textarea value={n.proofStorytelling[k]} onChange={e => un("proofStorytelling",k,e.target.value)} style={{ ...textareaStyle, minHeight: 60 }} placeholder="How do they prove claims?" /></div>
          ))}
        </div>
      </div>
      <div style={cardStyle}>
        <SectionLabel>Proposal-Ready Content</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[["rfpReadyPages","RFP-Ready Pages?"],["proposalUrls","Proposal-Ready URLs"],["downloadableCaseStudies","Downloadable Case Studies"],["aboveFoldSectorCues","Above-the-Fold Sector Cues"]].map(([k,label]) => (
            <div key={k}><FieldLabel>{label}</FieldLabel><textarea value={n.proposalReady[k]} onChange={e => un("proposalReady",k,e.target.value)} style={{ ...textareaStyle, minHeight: 60 }} placeholder="..." /></div>
          ))}
        </div>
      </div>
      <div style={cardAltStyle}><HighlightsSection highlights={n.highlights} onChange={h => onChange({ ...firm, niche: { ...n, highlights: h } })} /></div>
      <div style={cardStyle}>
        <SectionLabel>Niche Positioning & Proof Notes</SectionLabel>
        <textarea value={n.notes} onChange={e => onChange({ ...firm, niche: { ...n, notes: e.target.value } })} style={{ ...textareaStyle, minHeight: 120 }} placeholder="Overall: specialist through content, or just claiming it? White space for MKM?" />
      </div>
    </div>
  );
};

// ─── AI SUMMARY PAGE ─────────────────────────────────────────────────
const SummaryPage = ({ competitors, onSelectFirm }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const allFirms = Object.values(competitors || {});
  const completeFirms = allFirms.filter(f => f.contentEngine);
  const starredFirms = allFirms.filter(f => f.contentEngine?.starred);

  const generateSummary = async () => {
    setLoading(true); setError("");
    try {
      const fData = completeFirms.map(f => {
        const ce = f.contentEngine || {};
        return { name: f.name, peerGroup: f.peerGroup, starred: ce.starred, keyTakeaway: ce.keyTakeaway,
          blogActive: ce.content?.isActive, cadence: ce.content?.cadence, blogMix: ce.content?.blogMix,
          socialPlatforms: (ce.social?.platforms||[]).map(p => ({ name:p.name, followers:p.followers })),
          socialMix: ce.social?.socialMix, usesVideo: ce.social?.video?.usesVideo,
          ruralHealthcare: ce.niche?.sectorLanguage?.ruralHealthcare,
          contentNotes: ce.content?.notes, socialNotes: ce.social?.notes, nicheNotes: ce.niche?.notes };
      });
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages: [{ role: "user", content: `You are analyzing competitive content intelligence for MKM Design Group, a healthcare architecture firm focused on rural healthcare and right-sized solutions. DATA: ${JSON.stringify(fData)}\n\nRespond ONLY with valid JSON, no markdown:\n{"topInsight":"one sentence","contentLeaders":[{"name":"firm","why":"reason"}],"socialLeaders":[{"name":"firm","why":"reason"}],"nicheLeaders":[{"name":"firm","why":"reason"}],"stealThis":[{"idea":"tactic","from":"firm","priority":"high|medium|low"}],"whiteSpace":["gap MKM could own"]}` }] })
      });
      const data = await resp.json();
      const text = data.content.map(i => i.text||"").join("");
      setSummary(JSON.parse(text.replace(/```json|```/g,"").trim()));
    } catch(e) { setError("Failed to generate summary."); }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        {[{ label:"Firms with CE Data", value: completeFirms.length, color: ACCENT_WARM },{ label:"Starred", value: starredFirms.length, color: "#b5563a" },{ label:"Total Firms", value: allFirms.length, color: MUTED }].map(s => (
          <div key={s.label} style={{ ...cardStyle, flex: 1, minWidth: 140, textAlign: "center", marginBottom: 0 }}>
            <div style={{ ...mono(), fontSize: 28, color: s.color, fontWeight: 600 }}>{s.value}</div>
            <div style={{ ...mono(), fontSize: 9, textTransform: "uppercase", letterSpacing: 1.5, color: MUTED, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
      {completeFirms.length < 2 ? (
        <div style={{ ...cardStyle, textAlign: "center", padding: 48 }}>
          <div style={{ ...sans(), fontSize: 22, fontWeight: 700, color: DARK, marginBottom: 8 }}>Not enough data yet</div>
          <div style={{ ...sans(), fontSize: 13, color: MUTED, maxWidth: 400, margin: "0 auto" }}>Complete at least 2 firm audits to unlock AI-powered insights.</div>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            <button onClick={generateSummary} disabled={loading} style={{ ...sans(), padding: "10px 24px", background: ACCENT_WARM, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: loading?0.6:1 }}>
              {loading?"Analyzing…":summary?"↻ Refresh Insights":"✨ Generate Insights"}
            </button>
          </div>
          {error && <div style={{ ...sans(), color: DANGER, fontSize: 13, marginBottom: 12 }}>{error}</div>}
          {summary && (
            <div>
              <div style={{ ...cardStyle, background: "#2c2c2c", color: "#f5f2ed", borderColor: "#2c2c2c" }}>
                <div style={{ ...mono(), fontSize: 9, textTransform: "uppercase", letterSpacing: 2, color: ACCENT_WARM, marginBottom: 8 }}>Key Insight</div>
                <div style={{ ...sans(), fontSize: 20, fontWeight: 600, lineHeight: 1.4 }}>{summary.topInsight}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
                {[{ title:"Content Leaders", data:summary.contentLeaders },{ title:"Social Leaders", data:summary.socialLeaders },{ title:"Niche Leaders", data:summary.nicheLeaders }].map(board => (
                  <div key={board.title} style={cardStyle}>
                    <SectionLabel>{board.title}</SectionLabel>
                    {(board.data||[]).map((f,i) => (
                      <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:10, cursor:"pointer" }} onClick={() => onSelectFirm(f.name)}>
                        <FirmLogo name={f.name} size={28} />
                        <div><div style={{ ...sans(), fontSize:13, fontWeight:600 }}>{f.name}</div><div style={{ ...sans(), fontSize:11, color:MUTED, lineHeight:1.4 }}>{f.why}</div></div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div style={cardStyle}>
                <SectionLabel>Steal This — Ideas for MKM</SectionLabel>
                {(summary.stealThis||[]).map((idea,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"10px 0", borderBottom: i<summary.stealThis.length-1?"1px solid "+BORDER:"none" }}>
                    <span style={{ ...mono(), fontSize:9, textTransform:"uppercase", letterSpacing:1, color: idea.priority==="high"?DANGER:idea.priority==="medium"?ACCENT_WARM:MUTED, border:"1px solid "+(idea.priority==="high"?DANGER:idea.priority==="medium"?ACCENT_WARM:MUTED), borderRadius:4, padding:"2px 6px", flexShrink:0 }}>{idea.priority}</span>
                    <div><div style={{ ...sans(), fontSize:13, fontWeight:500 }}>{idea.idea}</div>{idea.from&&<div style={{ ...sans(), fontSize:11, color:MUTED }}>Inspired by: {idea.from}</div>}</div>
                  </div>
                ))}
              </div>
              <div style={cardAltStyle}>
                <SectionLabel>White Space — Gaps MKM Could Own</SectionLabel>
                {(summary.whiteSpace||[]).map((gap,i) => (
                  <div key={i} style={{ ...sans(), fontSize:13, color:"#5c5549", padding:"8px 0", borderBottom: i<summary.whiteSpace.length-1?"1px solid "+BORDER:"none", display:"flex", gap:8 }}>
                    <span style={{ color: ACCENT_WARM, fontWeight:600 }}>●</span> {gap}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ─── MAIN — SHELL-COMPATIBLE ──────────────────────────────────────────
// Props: competitors (obj), selectedFirm (name string), onBack (fn), onUpdate(firmName, ceData) (fn)
export default function ContentEngine({ competitors, onBack }) {
  const firmsWithCE = Object.keys(competitors || {}).filter(k => competitors[k]?.contentEngine);
  const [selectedFirmName, setSelectedFirmName] = useState(firmsWithCE[0] || null);
  const [view, setView] = useState(selectedFirmName ? "audit" : "summary");
  const [activeTab, setActiveTab] = useState("content");

  const onUpdate = async (firmName, ceData) => {
    if (firmName === "__selectFirm__") {
      setSelectedFirmName(ceData);
      return;
    }
    
    const firm = competitors[firmName];
    if (!firm) return;
    
    const updated = { ...firm, contentEngine: ceData };
    
    try {
      await fetch('/api/save-competitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      window.location.reload();
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const currentFirmMeta = selectedFirmName ? competitors[selectedFirmName] : null;
  const ce = currentFirmMeta?.contentEngine || emptyContentEngine();
  const firmForTabs = selectedFirmName ? { name: selectedFirmName, ...ce } : null;

  const handleChange = (updated) => {
    if (!selectedFirmName || !onUpdate) return;
    const { name, ...ceData } = updated;
    onUpdate(selectedFirmName, ceData);
  };

  const handleSelectFromSummary = (firmName) => {
    if (onUpdate) onUpdate("__selectFirm__", firmName);
    setView("audit");
  };

  return (
    <div style={{ ...sans(), background: BG, minHeight: "100vh", color: DARK }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{ background: "#2c2c2c", padding: "32px 32px 28px", color: "#f5f2ed" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", color: ACCENT_WARM, ...sans(), fontSize:13, fontWeight:600, marginBottom:16, padding:0, display:"flex", alignItems:"center", gap:6 }}>
            ← Home
          </button>
          <div style={{ ...mono(), fontSize:11, textTransform:"uppercase", letterSpacing:2.5, color: ACCENT_WARM, marginBottom:8 }}>MKM Design Group</div>
          <h1 style={{ ...sans(), fontSize:32, fontWeight:700, margin:0, lineHeight:1.2 }}>Content Engine</h1>
          <p style={{ fontSize:14, color:"#a09a90", marginTop:8, marginBottom:0, maxWidth:600, lineHeight:1.5 }}>Audit competitor content strategies — blogs, social media, thought leadership, and niche positioning.</p>
          <div style={{ display:"flex", gap:0, marginTop:24 }}>
            {[{ key:"summary", label:"Summary" },{ key:"audit", label:"Audit Firms" }].map(tab => (
              <button key={tab.key} onClick={() => setView(tab.key)} style={{ padding:"10px 24px", ...sans(), fontSize:13, fontWeight:600, border:"none", cursor:"pointer", borderBottom: view===tab.key?"2px solid "+ACCENT_WARM:"2px solid transparent", background:"transparent", color: view===tab.key?"#f5f2ed":"#7a756d", transition:"all 0.15s ease" }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 32px 64px" }}>

        {view === "summary" && <SummaryPage competitors={competitors} onSelectFirm={handleSelectFromSummary} />}

        {view === "audit" && (
          <div>
            {!selectedFirmName ? (
              <div style={{ ...cardStyle, textAlign:"center", padding:48 }}>
                <div style={{ ...sans(), fontSize:20, fontWeight:700, marginBottom:8 }}>No firm selected</div>
                <div style={{ fontSize:13, color:MUTED }}>Select a competitor from the shell to begin auditing.</div>
              </div>
            ) : firmForTabs && (
              <>
                <div style={{ ...cardStyle, display:"flex", alignItems:"flex-start", gap:16 }}>
                  <FirmLogo name={selectedFirmName} size={52} />
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <h2 style={{ ...sans(), fontSize:26, fontWeight:700, margin:0 }}>{selectedFirmName}</h2>
                      <StarButton starred={ce.starred} onClick={() => handleChange({ name:selectedFirmName, ...ce, starred:!ce.starred })} />
                    </div>
                    {currentFirmMeta?.url && <a href={currentFirmMeta.url.startsWith("http")?currentFirmMeta.url:"https://"+currentFirmMeta.url} target="_blank" rel="noreferrer" style={{ ...sans(), fontSize:12, color:ACCENT_WARM, textDecoration:"none" }}>{currentFirmMeta.url} ↗</a>}
                    <div style={{ ...mono(), fontSize:10, textTransform:"uppercase", letterSpacing:1.5, color:MUTED, marginTop:6 }}>{currentFirmMeta?.peerGroup}</div>
                  </div>
                </div>

                <div style={{ ...cardAltStyle, padding:"16px 20px" }}>
                  <FieldLabel>Key Takeaway</FieldLabel>
                  <input value={ce.keyTakeaway||""} onChange={e => handleChange({ name:selectedFirmName, ...ce, keyTakeaway:e.target.value })} style={inputStyle} placeholder="One sentence — the most important thing about this firm's content strategy" />
                  <div style={{ display:"flex", gap:8, marginTop:10, alignItems:"center" }}>
                    <span style={{ ...sans(), fontSize:12, fontWeight:600, color:"#5c5549", marginRight:4 }}>Rating:</span>
                    <ThumbButton type="up" active={ce.thumbsRating==="up"} onClick={() => handleChange({ name:selectedFirmName, ...ce, thumbsRating:"up" })} />
                    <ThumbButton type="down" active={ce.thumbsRating==="down"} onClick={() => handleChange({ name:selectedFirmName, ...ce, thumbsRating:"down" })} />
                  </div>
                </div>

                <div style={{ display:"flex", borderBottom:"2px solid "+BORDER, marginBottom:20 }}>
                  {[{ id:"content", label:"Content & Publishing" },{ id:"social", label:"Social & Video" },{ id:"niche", label:"Niche & Proof" }].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ ...sans(), fontSize:13, fontWeight:600, padding:"10px 20px", border:"none", cursor:"pointer", borderBottom: activeTab===tab.id?"2px solid "+ACCENT_WARM:"2px solid transparent", background:"transparent", color: activeTab===tab.id?DARK:MUTED, transition:"all 0.15s ease", marginBottom:-2 }}>
                      {tab.label}
                    </button>
                  ))}
                </div>

                {activeTab==="content" && <TabContent firm={firmForTabs} onChange={handleChange} />}
                {activeTab==="social" && <TabSocial firm={firmForTabs} onChange={handleChange} />}
                {activeTab==="niche" && <TabNiche firm={firmForTabs} onChange={handleChange} />}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
