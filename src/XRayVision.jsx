import { useState, useEffect, useCallback, useRef } from "react";

// ─── THEME ───────────────────────────────────────────────────────────
const A = "#5c6d5e", AW = "#b68d40", BG = "#e8e4dd", C = "#fff", BD = "#e8e4df", M = "#8a8278", D = "#1a1a1a", S = "#f5f2ed";
const s = (x={}) => ({fontFamily:"'DM Sans',sans-serif",...x});
const m = (x={}) => ({fontFamily:"'DM Mono',monospace",...x});

// ─── CHIP OPTIONS ───────────────────────────────────────────────────
const PEER_GROUPS = ["Healthcare (Large)","Healthcare (Small)","Senior Living","Peer Group"];
const STATUS_OPTIONS = ["Not Started","In Progress","Complete"];
const NAV_STYLES = ["Simple Dropdown","Mega Menu","Hamburger Only","Sticky Nav","Sidebar Nav","Hybrid"];
const ANIMATION_FEATURES = ["Parallax scrolling","Scroll-triggered animations","Video backgrounds","Hover effects on cards/images","Page transition animations","Loading animations","Animated statistics/counters","Micro-interactions","CSS transitions on navigation","None / Minimal"];
const PHOTO_STYLES = ["Warm / Natural light","Clinical / Sterile","Dramatic / Editorial","Candid / Lifestyle","Rendering-heavy","Aerial / Drone","Detail-focused","People in spaces","Empty / Aspirational","Before/After"];
const MODERNITY = ["Dated","Average","Modern","Cutting Edge"];
const MOBILE = ["Poor","Adequate","Good","Excellent"];
const SPEED = ["Slow","Medium","Fast"];
const HP_SECTIONS = ["Hero / Banner","Mission / Tagline Statement","Services Overview","Market Sectors","Featured Projects","Stats / By the Numbers","Testimonials / Client Quotes","Team Spotlight","News / Blog Feed","Awards / Recognition","Call to Action","Video / Media Embed","Client Logos","Careers CTA","Newsletter Signup","Office Locations"];
const TONE_TAGS = ["Corporate","Warm / Approachable","Clinical / Technical","Aspirational","Conversational","Academic","Bold / Confident","Humble / Understated","Community-Focused","Innovation-Forward"];
const PERSONALITY = ["Low","Medium","High"];
const GEO_SIGNALS = ["Mentions rural healthcare","Mentions critical access hospitals","Mentions community hospitals","Mentions underserved populations","Mentions FQHC / community health centers","Positions as national firm","Positions as regional firm","Emphasizes local roots","Lists multiple office locations","Targets large health systems","Targets independent / small providers","Mentions specific states or regions","Client size language (bed count, revenue, etc.)"];
const PORT_FEATURES = ["Filterable by sector/type","Project detail pages","Before/after imagery","Outcome metrics / data","Client testimonials on project pages","Square footage / budget info","Process narrative","Team credits","Related projects section","Video walkthroughs","Photography gallery","Awards listed per project","Downloadable case study / PDF"];
const PORT_EMPHASIS = ["Photography-heavy","Narrative / Storytelling","Data / Outcomes","Process-focused","Minimal / Grid only"];
const NARR_INCLUDES = ["Project problem / challenge statement","Design solution description","Client goals or vision","Community context or impact","Technical / clinical program details","Sustainability or wellness features","Construction phasing or delivery method","Collaboration / process description","Future-looking or aspirational language","Quantifiable outcomes (patient satisfaction, efficiency, etc.)","Named client challenge (specific, not generic)"];
const META_FIELDS = ["Client name","Location","Market / sector","Size (SF)","Construction cost / budget","Services provided","Completion date","Certifications (LEED, WELL, etc.)","Team members credited","Awards"];
const NARR_TONE = ["Firm as subject ('we designed...')","Client as subject ('the hospital needed...')","Reads like marketing copy","Reads like a case study","Outcome-oriented (what changed after)","Process-oriented (what they did)"];
const NARR_ABSENT = ["No outcomes / metrics","No testimonial","No team credits","No budget / cost","No process description","No before condition described","No community context","No awards listed","No related projects","No downloadable content"];
const ABOUT_STORY = ["Founding story","Mission-driven narrative","Growth / scale","Technical credentials","Community roots","Awards / recognition"];
const JARGON = ["Low","Medium","High"];
const WARMTH = ["Very Corporate","Somewhat Corporate","Neutral","Somewhat Warm","Very Warm"];

// ─── STORAGE (localStorage for standalone deployment) ────────────────
const SK = "xray-v5-firms", SO = "xray-v5-order";
async function sGet(k) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } }
async function sSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) { console.error(e); } }
// Image storage - separate keys per image
async function imgGet(firmId, slot) { try { return localStorage.getItem(`xray-img-${firmId}-${slot}`) || null; } catch { return null; } }
async function imgSet(firmId, slot, data) { try { if (data) { localStorage.setItem(`xray-img-${firmId}-${slot}`, data); } else { localStorage.removeItem(`xray-img-${firmId}-${slot}`); } } catch(e) { console.error(e); } }
const IMG_SLOTS = ["logo","hero","fullPage","portfolio","aboutScreenshot","peopleScreenshot","hpExtra1","hpExtra2","hpExtra3","aboutExtra1","aboutExtra2","aboutExtra3","peopleExtra1","peopleExtra2","peopleExtra3","portExtra1","portExtra2","portExtra3"];

function compressImage(dataUrl, maxWidth=1400, quality=0.72) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onerror = () => resolve(dataUrl);
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxWidth) { height = Math.round(height * maxWidth / width); width = maxWidth; }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(dataUrl); return; }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } catch(e) { resolve(dataUrl); }
    };
    img.src = dataUrl;
  });
}


// // ─── SHARED COMPONENTS ───────────────────────────────────────────────
const inputSt = {...s(),width:"100%",padding:"10px 12px",border:`1px solid #d6d0c8`,borderRadius:8,fontSize:13,color:D,background:C,outline:"none",boxSizing:"border-box"};
const txSt = {...inputSt,minHeight:80,resize:"vertical",background:S};
const cardSt = {background:C,borderRadius:12,border:`1px solid ${BD}`,padding:"24px 28px",marginBottom:20};
const lblSt = {...m(),fontSize:12,textTransform:"uppercase",letterSpacing:1.8,color:M,marginBottom:10};
const fldSt = {...s(),fontSize:12,fontWeight:600,color:"#5c5549",marginBottom:4};

const SL = ({children}) => <div style={lblSt}>{children}</div>;
const FL = ({children}) => <div style={fldSt}>{children}</div>;
const Chip = ({text,active,onClick}) => <button onClick={onClick} style={{...s(),fontSize:12,padding:"5px 14px",borderRadius:20,border:active?`1.5px solid ${A}`:`1.5px solid ${BD}`,background:active?A:"transparent",color:active?"#fff":"#5c5549",cursor:"pointer",fontWeight:active?600:400,transition:"all 0.15s ease",margin:"0 6px 6px 0"}}>{text}</button>;
const ChipSet = ({items,selected=[],onChange}) => <div style={{display:"flex",flexWrap:"wrap",marginBottom:16}}>{items.map(i=><Chip key={i} text={i} active={selected.includes(i)} onClick={()=>{const c=[...selected];c.includes(i)?onChange(c.filter(x=>x!==i)):onChange([...c,i]);}}/>)}</div>;

let _setPreview = null;

const ImageSlot = ({image,onUpload,onDelete,label,height=180,contain=false}) => {
  const ref = useRef(null);
 
 const handle = (e) => { const f=e.target.files?.[0]; if(!f)return; const r=new FileReader(); r.onload=(ev)=>{ compressImage(ev.target.result).then(img=>onUpload(img)).catch(()=>onUpload(ev.target.result)); }; r.readAsDataURL(f); };
  
  const imgHeight = height === null ? "auto" : height;
  const imgFit = height === null ? "contain" : contain ? "contain" : "cover";
  return <div style={{marginBottom:12}}>
    <FL>{label}</FL>
    {image ? <div style={{position:"relative",borderRadius:8,overflow:"hidden",border:`1px solid ${BD}`,background:contain?"#f0ece6":"transparent"}}>
      <img src={image} alt={label} onClick={()=>_setPreview&&_setPreview(image)} style={{width:"100%",height:imgHeight,objectFit:imgFit,objectPosition:contain?"center":"top",display:"block",padding:contain?8:0,boxSizing:"border-box",cursor:"pointer"}}/>
      <button onClick={onDelete} style={{position:"absolute",top:8,right:8,width:28,height:28,borderRadius:"50%",background:"rgba(0,0,0,0.6)",color:"#fff",border:"none",cursor:"pointer",fontSize:14,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
    </div> : <div onClick={()=>ref.current?.click()} style={{width:"100%",height:height||180,borderRadius:8,border:`2px dashed #d6d0c8`,background:S,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",color:M,...s(),fontSize:12,boxSizing:"border-box"}}>
      <div style={{fontSize:24,marginBottom:4,opacity:0.4}}>📷</div><div>Click to upload</div>
    </div>}
    <input ref={ref} type="file" accept="image/*" onChange={handle} style={{display:"none"}}/>
  </div>;
};

const TwoColLayout = ({children,screenshot,onScreenshot,onDelete,label}) => {
  const ref = useRef(null);
const handle = (e) => { const f=e.target.files?.[0]; if(!f)return; const r=new FileReader(); r.onload=(ev)=>{ compressImage(ev.target.result).then(img=>onScreenshot(img)).catch(()=>onScreenshot(ev.target.result)); }; r.readAsDataURL(f); };
  
  return <div style={{display:"flex",gap:24,alignItems:"flex-start"}}>
    <div style={{flex:"2 1 0",minWidth:0}}>{children}</div>
    <div style={{flex:"1 1 0",minWidth:200,position:"sticky",top:24}}>
      <FL>{label}</FL>
      {screenshot?<div style={{position:"relative",borderRadius:8,overflow:"hidden",border:`1px solid ${BD}`}}>
        <img src={screenshot} alt={label} onClick={()=>_setPreview&&_setPreview(screenshot)} style={{width:"100%",display:"block",objectPosition:"top",cursor:"pointer"}}/>
        <button onClick={onDelete} style={{position:"absolute",top:8,right:8,width:28,height:28,borderRadius:"50%",background:"rgba(0,0,0,0.6)",color:"#fff",border:"none",cursor:"pointer",fontSize:14,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
      </div>:<div onClick={()=>ref.current?.click()} style={{width:"100%",minHeight:300,borderRadius:8,border:`2px dashed #d6d0c8`,background:S,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",color:M,...s(),fontSize:12}}>
        <div style={{fontSize:24,marginBottom:4,opacity:0.4}}>📷</div><div>Upload full page</div>
      </div>}
      <input ref={ref} type="file" accept="image/*" onChange={handle} style={{display:"none"}}/>
    </div>
  </div>;
};

const ExtraScreenshots = ({prefix,images,onImg}) => <div style={cardSt}>
  <SL>Additional Screenshots (Optional)</SL>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
    {[1,2,3].map(n=><ImageSlot key={n} image={images[`${prefix}Extra${n}`]} onUpload={img=>onImg(`${prefix}Extra${n}`,img)} onDelete={()=>onImg(`${prefix}Extra${n}`,null)} label={`Detail ${n}`} height={120}/>)}
  </div>
</div>;

// ─── SITEMAP BUILDER ─────────────────────────────────────────────────
const emptyNode = (name="") => ({id:Date.now()+Math.random()+"",name,children:[]});
const SitemapNode = ({node,depth,onUpdate,onDelete,onAddChild}) => <div style={{marginLeft:depth*24,marginBottom:4}}>
  <div style={{display:"flex",alignItems:"center",gap:6}}>
    {depth>0&&<span style={{color:"#ccc",fontSize:12,...m(),userSelect:"none"}}>└─</span>}
    <input value={node.name} onChange={e=>onUpdate(node.id,"name",e.target.value)} placeholder={depth===0?"Top-level page...":"Sub-page..."} style={{...s(),fontSize:13,padding:"6px 10px",border:`1px solid ${BD}`,borderRadius:6,background:depth===0?C:S,color:D,outline:"none",flex:1,fontWeight:depth===0?600:400}}/>
    <button onClick={()=>onAddChild(node.id)} style={{background:"none",border:`1px solid ${BD}`,borderRadius:4,cursor:"pointer",padding:"4px 8px",fontSize:11,color:A,...m(),fontWeight:500}}>+ child</button>
    <button onClick={()=>onDelete(node.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#c4b8a8",fontSize:16,padding:"2px 6px"}}>×</button>
  </div>
  {node.children.map(c=><SitemapNode key={c.id} node={c} depth={depth+1} onUpdate={onUpdate} onDelete={onDelete} onAddChild={onAddChild}/>)}
</div>;

const SitemapViz = ({nodes}) => {
  if(!nodes?.length) return <div style={{...s(),fontSize:12,color:M,fontStyle:"italic",padding:16}}>Add pages above to see visualization</div>;
  const render = (n,d=0) => {
    if(!n.name&&!n.children?.length) return null;
    return <div key={n.id} style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
      <div style={{padding:d===0?"8px 18px":"5px 14px",borderRadius:6,background:d===0?A:d===1?AW:"#d6d0c8",color:d<=1?"#fff":D,...s(),fontSize:d===0?13:11,fontWeight:d===0?700:500,whiteSpace:"nowrap",minWidth:40,textAlign:"center"}}>{n.name||"(unnamed)"}</div>
      {n.children?.filter(c=>c.name||c.children?.length).length>0&&<><div style={{width:1,height:12,background:"#d6d0c8"}}/><div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center"}}>{n.children.filter(c=>c.name||c.children?.length).map(c=><div key={c.id} style={{display:"flex",flexDirection:"column",alignItems:"center"}}><div style={{width:1,height:8,background:"#d6d0c8"}}/>{render(c,d+1)}</div>)}</div></>}
    </div>;
  };
  const valid = nodes.filter(n=>n.name||n.children?.length);
  return valid.length?<div style={{background:S,borderRadius:8,border:`1px solid ${BD}`,padding:24,overflowX:"auto"}}><div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap",alignItems:"flex-start"}}>{valid.map(n=>render(n,0))}</div></div>:null;
};

// ─── TAB: STRUCTURE & UX ─────────────────────────────────────────────
const TabStructure = ({firm:d,onChange:o,images,onImg}) => {
  const sitemap = d.sitemap||[];
  const findUp = (ns,id,k,v) => ns.map(n=>n.id===id?{...n,[k]:v}:{...n,children:findUp(n.children||[],id,k,v)});
  const findDel = (ns,id) => ns.filter(n=>n.id!==id).map(n=>({...n,children:findDel(n.children||[],id)}));
  const findAdd = (ns,id) => ns.map(n=>n.id===id?{...n,children:[...(n.children||[]),emptyNode()]}:{...n,children:findAdd(n.children||[],id)});

  return <div>
    <div style={cardSt}>
      <div style={{...s(),fontSize:13,color:M,lineHeight:1.6,marginBottom:20}}>How the site is organized and how it feels to use — navigation hierarchy, visual design choices, and technical quality.</div>
      <SL>Navigation Style</SL>
      <ChipSet items={NAV_STYLES} selected={d.navStyles||[]} onChange={v=>o("navStyles",v)}/>
      <SL>Sitemap Builder</SL>
      <div style={{marginBottom:12}}>
        {sitemap.map(n=><SitemapNode key={n.id} node={n} depth={0} onUpdate={(id,k,v)=>o("sitemap",findUp(sitemap,id,k,v))} onDelete={id=>o("sitemap",findDel(sitemap,id))} onAddChild={id=>o("sitemap",findAdd(sitemap,id))}/>)}
        <button onClick={()=>o("sitemap",[...sitemap,emptyNode()])} style={{...s(),padding:"6px 16px",fontSize:12,background:"transparent",color:A,border:`1.5px solid ${A}`,borderRadius:8,cursor:"pointer",fontWeight:600,marginTop:8}}>+ Add Top-Level Page</button>
      </div>
      <SL>Sitemap Visualization</SL>
      <SitemapViz nodes={sitemap}/>
    </div>
    <div style={cardSt}>
      <SL>Visual Design & Technical Quality</SL>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        <div><FL>Heading Font</FL><input value={d.headingFont||""} onChange={e=>o("headingFont",e.target.value)} placeholder="e.g., Playfair Display" style={inputSt}/></div>
        <div><FL>Body Font</FL><input value={d.bodyFont||""} onChange={e=>o("bodyFont",e.target.value)} placeholder="e.g., Open Sans" style={inputSt}/></div>
      </div>
      <FL>Animation & Motion</FL>
      <ChipSet items={ANIMATION_FEATURES} selected={d.animations||[]} onChange={v=>o("animations",v)}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
        {[["Modernity","modernity",MODERNITY],["Mobile Friendly","mobile",MOBILE],["Load Speed","speed",SPEED]].map(([l,k,opts])=><div key={k}><FL>{l}</FL><select value={d[k]||""} onChange={e=>o(k,e.target.value)} style={{...inputSt,cursor:"pointer"}}><option value="">Select...</option>{opts.map(x=><option key={x} value={x}>{x}</option>)}</select></div>)}
      </div>
      <SL>Color & Visual Identity</SL>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
        {[["Primary Brand Color","primaryColor"],["Secondary Color","secondaryColor"],["Accent Color","accentColor"]].map(([l,k])=><div key={k}><FL>{l}</FL><div style={{display:"flex",gap:8,alignItems:"center"}}><input value={d[k]||""} onChange={e=>o(k,e.target.value)} placeholder="e.g., #e67e22" style={{...inputSt,flex:1}}/>{d[k]&&/^#[0-9a-fA-F]{3,8}$/.test((d[k]||"").trim())&&<div style={{width:32,height:32,borderRadius:6,background:d[k].trim(),border:`1px solid ${BD}`,flexShrink:0}}/>}</div></div>)}
      </div>
      <FL>Palette Notes</FL>
      <textarea value={d.paletteNotes||""} onChange={e=>o("paletteNotes",e.target.value)} placeholder="Overall color impression..." style={{...txSt,minHeight:60}}/>

      
      <div style={{marginTop:12}}><FL>Photography Style</FL><ChipSet items={PHOTO_STYLES} selected={d.photoStyles||[]} onChange={v=>o("photoStyles",v)}/></div>
      <FL>Visual Identity Notes</FL>
      <textarea value={d.visualIdNotes||""} onChange={e=>o("visualIdNotes",e.target.value)} placeholder="What makes this site visually distinctive — or forgettable?" style={{...txSt,minHeight:60}}/>
    </div>
    <div style={cardSt}><SL>Notes & Observations</SL><textarea value={d.structureNotes||""} onChange={e=>o("structureNotes",e.target.value)} placeholder="General observations about site structure..." style={txSt}/></div>
  </div>;
};

// ─── TAB: HOMEPAGE ───────────────────────────────────────────────────
const TabHomepage = ({firm:d,onChange:o,images,onImg}) => <TwoColLayout screenshot={images.fullPage} onScreenshot={img=>onImg("fullPage",img)} onDelete={()=>onImg("fullPage",null)} label="Full Homepage">
  <div style={cardSt}>
    <div style={{...s(),fontSize:13,color:M,lineHeight:1.6,marginBottom:20}}>What visitors see first — the sections, messaging, tone, and calls to action that define the firm's front door.</div>
    <SL>Hero Section</SL>
    <div style={{marginBottom:16}}><FL>Hero Headline</FL><input value={d.heroHeadline||""} onChange={e=>o("heroHeadline",e.target.value)} placeholder="Primary headline text..." style={inputSt}/></div>
    <div style={{marginBottom:16}}><FL>Hero Subtext / Tagline</FL><textarea value={d.heroSubtext||""} onChange={e=>o("heroSubtext",e.target.value)} placeholder="Supporting text..." style={{...txSt,minHeight:60}}/></div>
    <ImageSlot image={images.hero} onUpload={img=>onImg("hero",img)} onDelete={()=>onImg("hero",null)} label="Hero Section Screenshot" height={null}/>
  </div>
  <div style={cardSt}>
    <SL>Homepage Sections Present</SL>
    <ChipSet items={HP_SECTIONS} selected={d.homepageSections||[]} onChange={v=>o("homepageSections",v)}/>
    <FL>Section Order (top to bottom)</FL>
    <textarea value={d.sectionOrder||""} onChange={e=>o("sectionOrder",e.target.value)} placeholder="List sections in order..." style={{...txSt,minHeight:60}}/>
  </div>
  <div style={cardSt}>
    <SL>Tone & Voice</SL>
    <ChipSet items={TONE_TAGS} selected={d.toneTags||[]} onChange={v=>o("toneTags",v)}/>
    <FL>Personality Level</FL>
    <div style={{display:"flex",gap:8,marginBottom:16}}>{PERSONALITY.map(l=><Chip key={l} text={l} active={d.personality===l} onClick={()=>o("personality",d.personality===l?"":l)}/>)}</div>
    <FL>Reading Level / Language Notes</FL>
    <textarea value={d.readingNotes||""} onChange={e=>o("readingNotes",e.target.value)} placeholder="Reading level, jargon density, target audience..." style={{...txSt,minHeight:60}}/>
  </div>
  <div style={cardSt}>
    <SL>Geographic & Market Messaging</SL>
    <ChipSet items={GEO_SIGNALS} selected={d.geoSignals||[]} onChange={v=>o("geoSignals",v)}/>
    <FL>Specific States/Regions</FL><input value={d.geoRegions||""} onChange={e=>o("geoRegions",e.target.value)} placeholder="e.g., Indiana, Ohio..." style={inputSt}/>
    <div style={{marginTop:12}}><FL>Client Size Positioning Notes</FL><textarea value={d.clientSizeNotes||""} onChange={e=>o("clientSizeNotes",e.target.value)} placeholder="How do they describe their clients?" style={{...txSt,minHeight:60}}/></div>
  </div>
  <div style={cardSt}><SL>CTA Inventory</SL><textarea value={d.ctaInventory||""} onChange={e=>o("ctaInventory",e.target.value)} placeholder="List all CTAs on homepage..." style={txSt}/></div>
  <div style={cardSt}><SL>Notes & Observations</SL><textarea value={d.homepageNotes||""} onChange={e=>o("homepageNotes",e.target.value)} placeholder="Overall homepage impressions..." style={txSt}/></div>
  <ExtraScreenshots prefix="hp" images={images} onImg={onImg}/>
</TwoColLayout>;

// ─── TAB: ABOUT ──────────────────────────────────────────────────────
const TabAbout = ({firm:d,onChange:o,images,onImg}) => <TwoColLayout screenshot={images.aboutScreenshot} onScreenshot={img=>onImg("aboutScreenshot",img)} onDelete={()=>onImg("aboutScreenshot",null)} label="About Page">
  <div style={cardSt}>
    <div style={{...s(),fontSize:13,color:M,lineHeight:1.6,marginBottom:20}}>How the firm tells its story — mission, history, and the language choices that reveal who they're really talking to.</div>
    <div style={{marginBottom:16}}><FL>About Page URL</FL><div style={{display:"flex",gap:8}}><input value={d.aboutUrl||""} onChange={e=>o("aboutUrl",e.target.value)} placeholder="https://..." style={{...inputSt,flex:1}}/>{d.aboutUrl&&<a href={d.aboutUrl} target="_blank" rel="noopener noreferrer" style={{...s(),padding:"8px 14px",border:`1.5px solid ${A}`,borderRadius:8,color:A,textDecoration:"none",fontSize:12,whiteSpace:"nowrap",display:"flex",alignItems:"center",fontWeight:600}}>Visit →</a>}</div></div>
    <div style={{marginBottom:16}}><FL>Mission / Vision Statement</FL><textarea value={d.aboutMissionVision||""} onChange={e=>o("aboutMissionVision",e.target.value)} placeholder="Exact text if different from homepage..." style={{...txSt,minHeight:80}}/></div>
    <FL>Story Type — What Do They Lead With?</FL>
    <ChipSet items={ABOUT_STORY} selected={d.aboutStoryType||[]} onChange={v=>o("aboutStoryType",v)}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
      <div><FL>Year Founded</FL><input value={d.aboutYearFounded||""} onChange={e=>o("aboutYearFounded",e.target.value)} placeholder="e.g., 1981" style={inputSt}/></div>
      <div><FL>Markets/Specialties Named</FL><input value={d.aboutMarketsNamed||""} onChange={e=>o("aboutMarketsNamed",e.target.value)} placeholder="e.g., Healthcare, Senior Living" style={inputSt}/></div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
      <div><FL>Awards / Certifications</FL><input value={d.aboutAwardsCerts||""} onChange={e=>o("aboutAwardsCerts",e.target.value)} placeholder="AIA, LEED, WELL, EDAC..." style={inputSt}/></div>
      <div><FL>Client / Partner Logos</FL><input value={d.aboutClientLogos||""} onChange={e=>o("aboutClientLogos",e.target.value)} placeholder="Yes/No, which ones..." style={inputSt}/></div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
      <div><FL>Office Location Detail</FL><input value={d.aboutOfficeDetail||""} onChange={e=>o("aboutOfficeDetail",e.target.value)} placeholder="Photos, team counts..." style={inputSt}/></div>
      <div><FL>Video / Media</FL><input value={d.aboutVideoMedia||""} onChange={e=>o("aboutVideoMedia",e.target.value)} placeholder="Yes/No, what type..." style={inputSt}/></div>
    </div>
  </div>
  <div style={cardSt}>
    <SL>Language Analysis</SL>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
      <div><FL>Word Count</FL><input value={d.aboutWordCount||""} onChange={e=>o("aboutWordCount",e.target.value)} placeholder="e.g., 350" style={inputSt}/></div>
      <div><FL>Jargon Density</FL><select value={d.aboutJargonDensity||""} onChange={e=>o("aboutJargonDensity",e.target.value)} style={{...inputSt,cursor:"pointer"}}><option value="">Select...</option>{JARGON.map(x=><option key={x} value={x}>{x}</option>)}</select></div>
      <div><FL>Warmth Scale</FL><select value={d.aboutWarmthScale||""} onChange={e=>o("aboutWarmthScale",e.target.value)} style={{...inputSt,cursor:"pointer"}}><option value="">Select...</option>{WARMTH.map(x=><option key={x} value={x}>{x}</option>)}</select></div>
    </div>
    <div style={{marginBottom:16}}><FL>AI Writing Check</FL><textarea value={d.aboutAiWritingCheck||""} onChange={e=>o("aboutAiWritingCheck",e.target.value)} placeholder="Does it sound authentic or generated?" style={{...txSt,minHeight:60}}/></div>
    <div style={{marginBottom:16}}><FL>Audience Targeting</FL><textarea value={d.aboutAudienceTarget||""} onChange={e=>o("aboutAudienceTarget",e.target.value)} placeholder="Who is this written for?" style={{...txSt,minHeight:60}}/></div>
    <div style={{marginBottom:16}}><FL>Community / Rural Connection</FL><textarea value={d.aboutCommunityConnection||""} onChange={e=>o("aboutCommunityConnection",e.target.value)} placeholder="Does it connect with community health, rural interests?" style={{...txSt,minHeight:60}}/></div>
    <div style={{marginBottom:16}}><FL>"We" vs. "The Firm" Language</FL><input value={d.aboutWeLanguage||""} onChange={e=>o("aboutWeLanguage",e.target.value)} placeholder="How do they refer to themselves?" style={inputSt}/></div>
    <FL>Notable Phrases</FL><textarea value={d.aboutNotablePhrases||""} onChange={e=>o("aboutNotablePhrases",e.target.value)} placeholder="Taglines or phrases worth capturing..." style={{...txSt,minHeight:60}}/>
  </div>
  <div style={cardSt}><SL>Notes & Observations</SL><textarea value={d.aboutNotes||""} onChange={e=>o("aboutNotes",e.target.value)} placeholder="Does this page make you want to hire them?" style={txSt}/></div>
  <ExtraScreenshots prefix="about" images={images} onImg={onImg}/>
</TwoColLayout>;

// ─── TAB: PEOPLE ─────────────────────────────────────────────────────
const TabPeople = ({firm:d,onChange:o,images,onImg}) => <TwoColLayout screenshot={images.peopleScreenshot} onScreenshot={img=>onImg("peopleScreenshot",img)} onDelete={()=>onImg("peopleScreenshot",null)} label="People Page">
  <div style={cardSt}>
    <div style={{...s(),fontSize:13,color:M,lineHeight:1.6,marginBottom:20}}>How the firm presents its team — credentials, personality, and whether you'd want to work with these people.</div>
    <div style={{marginBottom:16}}><FL>People Page URL</FL><div style={{display:"flex",gap:8}}><input value={d.peopleUrl||""} onChange={e=>o("peopleUrl",e.target.value)} placeholder="https://..." style={{...inputSt,flex:1}}/>{d.peopleUrl&&<a href={d.peopleUrl} target="_blank" rel="noopener noreferrer" style={{...s(),padding:"8px 14px",border:`1.5px solid ${A}`,borderRadius:8,color:A,textDecoration:"none",fontSize:12,whiteSpace:"nowrap",display:"flex",alignItems:"center",fontWeight:600}}>Visit →</a>}</div></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
      <div><FL>Total Headcount Shown</FL><input value={d.peopleHeadcount||""} onChange={e=>o("peopleHeadcount",e.target.value)} placeholder="e.g., 45" style={inputSt}/></div>
      <div><FL>Organization Method</FL><input value={d.peopleOrganization||""} onChange={e=>o("peopleOrganization",e.target.value)} placeholder="By role, by office, flat grid..." style={inputSt}/></div>
    </div>
    <div style={{marginBottom:16}}><FL>Info Per Person</FL><input value={d.peopleInfoPerPerson||""} onChange={e=>o("peopleInfoPerPerson",e.target.value)} placeholder="Title, credentials, bio, photo, contact, fun facts..." style={inputSt}/></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
      <div><FL>Photo Style</FL><input value={d.peoplePhotoStyle||""} onChange={e=>o("peoplePhotoStyle",e.target.value)} placeholder="Professional headshots, casual, environmental..." style={inputSt}/></div>
      <div><FL>Certifications Highlighted</FL><input value={d.peopleCertifications||""} onChange={e=>o("peopleCertifications",e.target.value)} placeholder="AIA, NCARB, LEED AP, EDAC..." style={inputSt}/></div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
      <div><FL>Connected to Projects/Markets?</FL><input value={d.peopleProjectConnection||""} onChange={e=>o("peopleProjectConnection",e.target.value)} placeholder="Yes/No, how..." style={inputSt}/></div>
      <div><FL>Community / Personal Interests?</FL><input value={d.peopleCommunityInterests||""} onChange={e=>o("peopleCommunityInterests",e.target.value)} placeholder="Yes/No, examples..." style={inputSt}/></div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
      <div><FL>Culture/Recruiting Content</FL><input value={d.peopleCultureContent||""} onChange={e=>o("peopleCultureContent",e.target.value)} placeholder="Join us section, values..." style={inputSt}/></div>
      <div><FL>Approachability Factor</FL><input value={d.peopleApproachability||""} onChange={e=>o("peopleApproachability",e.target.value)} placeholder="Would a rural CEO feel comfortable calling?" style={inputSt}/></div>
    </div>
  </div>
  <div style={cardSt}>
    <SL>Language Analysis</SL>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
      <div><FL>Bio Depth</FL><input value={d.peopleBioDepth||""} onChange={e=>o("peopleBioDepth",e.target.value)} placeholder="One sentence, paragraph, multiple..." style={inputSt}/></div>
      <div><FL>Jargon Density</FL><select value={d.peopleJargonDensity||""} onChange={e=>o("peopleJargonDensity",e.target.value)} style={{...inputSt,cursor:"pointer"}}><option value="">Select...</option>{JARGON.map(x=><option key={x} value={x}>{x}</option>)}</select></div>
      <div><FL>Warmth Scale</FL><select value={d.peopleWarmthScale||""} onChange={e=>o("peopleWarmthScale",e.target.value)} style={{...inputSt,cursor:"pointer"}}><option value="">Select...</option>{WARMTH.map(x=><option key={x} value={x}>{x}</option>)}</select></div>
    </div>
    <div style={{marginBottom:16}}><FL>AI Writing Check</FL><textarea value={d.peopleAiWritingCheck||""} onChange={e=>o("peopleAiWritingCheck",e.target.value)} placeholder="Do bios sound like real people or LinkedIn auto-generated?" style={{...txSt,minHeight:60}}/></div>
    <div style={{marginBottom:16}}><FL>Bio Consistency</FL><textarea value={d.peopleBioConsistency||""} onChange={e=>o("peopleBioConsistency",e.target.value)} placeholder="Same voice across all bios, or individual personalities?" style={{...txSt,minHeight:60}}/></div>
  </div>
  <div style={cardSt}><SL>Notes & Observations</SL><textarea value={d.peopleNotes||""} onChange={e=>o("peopleNotes",e.target.value)} placeholder="Is this a team you'd want to work with?" style={txSt}/></div>
  <ExtraScreenshots prefix="people" images={images} onImg={onImg}/>
</TwoColLayout>;

// ─── TAB: PORTFOLIO ──────────────────────────────────────────────────
const TabPortfolio = ({firm:d,onChange:o,images,onImg}) => <TwoColLayout screenshot={images.portfolio} onScreenshot={img=>onImg("portfolio",img)} onDelete={()=>onImg("portfolio",null)} label="Portfolio Page">
  <div style={cardSt}>
    <div style={{...s(),fontSize:13,color:M,lineHeight:1.6,marginBottom:20}}>How the firm presents its work — project organization, what's emphasized, and how deep the case studies go.</div>
    <div style={{marginBottom:16}}><FL>Portfolio Page URL</FL><div style={{display:"flex",gap:8}}><input value={d.portfolioUrl||""} onChange={e=>o("portfolioUrl",e.target.value)} placeholder="https://..." style={{...inputSt,flex:1}}/>{d.portfolioUrl&&<a href={d.portfolioUrl} target="_blank" rel="noopener noreferrer" style={{...s(),padding:"8px 14px",border:`1.5px solid ${A}`,borderRadius:8,color:A,textDecoration:"none",fontSize:12,whiteSpace:"nowrap",display:"flex",alignItems:"center",fontWeight:600}}>Visit →</a>}</div></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
      <div><FL>Total Projects Shown</FL><input value={d.totalProjects||""} onChange={e=>o("totalProjects",e.target.value)} placeholder="e.g., 45" style={inputSt}/></div>
      <div><FL>Primary Organization</FL><input value={d.portfolioOrg||""} onChange={e=>o("portfolioOrg",e.target.value)} placeholder="By sector, by type..." style={inputSt}/></div>
    </div>
    <FL>Filter Categories</FL><textarea value={d.filterCategories||""} onChange={e=>o("filterCategories",e.target.value)} placeholder="List filter options..." style={{...txSt,minHeight:60}}/>
    <div style={{marginTop:12}}><FL>Project Counts by Category</FL><textarea value={d.categoryCounts||""} onChange={e=>o("categoryCounts",e.target.value)} placeholder="e.g., Healthcare: 25, Senior Living: 12..." style={{...txSt,minHeight:60}}/></div>
  </div>
  <div style={cardSt}>
    <SL>Portfolio Features</SL>
    <ChipSet items={PORT_FEATURES} selected={d.portfolioFeatures||[]} onChange={v=>o("portfolioFeatures",v)}/>
    <FL>Presentation Emphasis</FL>
    <ChipSet items={PORT_EMPHASIS} selected={d.portfolioEmphasis||[]} onChange={v=>o("portfolioEmphasis",v)}/>
    <FL>Video / Animation</FL><textarea value={d.portfolioVideo||""} onChange={e=>o("portfolioVideo",e.target.value)} placeholder="Video usage within project pages..." style={{...txSt,minHeight:60}}/>
  </div>
  <div style={cardSt}>
    <SL>Sample Project Text Analysis</SL>
    <div style={{...s(),fontSize:12,color:M,lineHeight:1.5,marginBottom:16}}>Analyze one representative project page in depth.</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
      <div><FL>Project Name</FL><input value={d.sampleProjectName||""} onChange={e=>o("sampleProjectName",e.target.value)} style={inputSt}/></div>
      <div><FL>Project URL</FL><input value={d.sampleProjectUrl||""} onChange={e=>o("sampleProjectUrl",e.target.value)} placeholder="https://..." style={inputSt}/></div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
      <div><FL>Word Count</FL><input value={d.sampleWordCount||""} onChange={e=>o("sampleWordCount",e.target.value)} style={inputSt}/></div>
      <div><FL>Paragraphs</FL><input value={d.sampleParagraphs||""} onChange={e=>o("sampleParagraphs",e.target.value)} style={inputSt}/></div>
      <div><FL>Reading Level</FL><input value={d.sampleReadingLevel||""} onChange={e=>o("sampleReadingLevel",e.target.value)} style={inputSt}/></div>
    </div>
    <FL>Narrative Includes</FL><ChipSet items={NARR_INCLUDES} selected={d.narrativeIncludes||[]} onChange={v=>o("narrativeIncludes",v)}/>
    <FL>Metadata Fields Present</FL><ChipSet items={META_FIELDS} selected={d.metadataFields||[]} onChange={v=>o("metadataFields",v)}/>
    <FL>Narrative Tone</FL><ChipSet items={NARR_TONE} selected={d.narrativeTone||[]} onChange={v=>o("narrativeTone",v)}/>
    <FL>What's Notably Absent</FL><ChipSet items={NARR_ABSENT} selected={d.narrativeAbsent||[]} onChange={v=>o("narrativeAbsent",v)}/>
    <FL>Text Analysis Notes</FL><textarea value={d.textAnalysisNotes||""} onChange={e=>o("textAnalysisNotes",e.target.value)} placeholder="What stands out about how they write?" style={{...txSt,minHeight:80}}/>
  </div>
  <div style={cardSt}><SL>Notes & Observations</SL><textarea value={d.portfolioNotes||""} onChange={e=>o("portfolioNotes",e.target.value)} placeholder="Portfolio strengths, weaknesses, what MKM can learn..." style={txSt}/></div>
  <ExtraScreenshots prefix="port" images={images} onImg={onImg}/>
</TwoColLayout>;

// ─── TAB: SEO ────────────────────────────────────────────────────────
const TabSEO = ({firm:d,onChange:o}) => <div>
  <div style={cardSt}>
    <div style={{...s(),fontSize:13,color:M,lineHeight:1.6,marginBottom:20}}>Search visibility and traffic patterns. Connect Similarweb for automated data.</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
      {[["Domain Authority","domainAuthority","DA 45"],["Monthly Traffic","monthlyTraffic","15,000 visits/mo"],["Top Traffic Source","topTrafficSource","Organic, Direct..."],["Bounce Rate","bounceRate","42%"]].map(([l,k,p])=><div key={k}><FL>{l}</FL><input value={d[k]||""} onChange={e=>o(k,e.target.value)} placeholder={p} style={inputSt}/></div>)}
    </div>
    <FL>Top Organic Keywords</FL><textarea value={d.topKeywords||""} onChange={e=>o("topKeywords",e.target.value)} placeholder="Top ranking keywords..." style={{...txSt,minHeight:80}}/>
    <div style={{marginTop:12}}><FL>Top Referral Sources</FL><textarea value={d.referralSources||""} onChange={e=>o("referralSources",e.target.value)} placeholder="Key referring sites..." style={{...txSt,minHeight:60}}/></div>
    <div style={{marginTop:12}}><FL>Page Title</FL><input value={d.pageTitle||""} onChange={e=>o("pageTitle",e.target.value)} placeholder="Homepage title tag..." style={inputSt}/></div>
    <div style={{marginTop:12}}><FL>Meta Description</FL><textarea value={d.metaDescription||""} onChange={e=>o("metaDescription",e.target.value)} placeholder="Meta description..." style={{...txSt,minHeight:60}}/></div>
  </div>
  <div style={cardSt}><SL>Notes & Observations</SL><textarea value={d.seoNotes||""} onChange={e=>o("seoNotes",e.target.value)} placeholder="SEO impressions, keyword opportunities..." style={txSt}/></div>
</div>;

// ─── COMPARE VIEWS ───────────────────────────────────────────────────
const CompareMatrix = ({firms,order}) => {
  const entries = order.map(id=>firms[id]).filter(Boolean);
  if(entries.length<2) return <div style={{...cardSt,textAlign:"center",padding:48}}><div style={{...s(),fontSize:20,fontWeight:700,color:D,marginBottom:8}}>Need at least 2 firms</div><div style={{...s(),fontSize:13,color:M}}>Add more firms to see comparisons.</div></div>;
  return <div>
    <div style={{...cardSt,overflowX:"auto"}}>
      <SL>Homepage Sections</SL>
      <table style={{width:"100%",borderCollapse:"collapse",...s(),fontSize:12}}>
        <thead><tr><th style={{textAlign:"left",padding:"10px 12px",borderBottom:`2px solid ${BD}`,...m(),fontSize:10,color:M,letterSpacing:1,textTransform:"uppercase",position:"sticky",left:0,background:C,minWidth:120}}>Firm</th>{HP_SECTIONS.map(h=><th key={h} style={{textAlign:"center",padding:"10px 4px",borderBottom:`2px solid ${BD}`,...m(),fontSize:8,color:M,textTransform:"uppercase",minWidth:32,writingMode:"vertical-lr",height:100}}>{h}</th>)}</tr></thead>
        <tbody>{entries.map((f,i)=><tr key={f.id} style={{background:i%2===0?C:S}}><td style={{padding:"8px 12px",fontWeight:600,borderBottom:`1px solid ${BD}`,position:"sticky",left:0,background:i%2===0?C:S,fontSize:12}}>{f.name}</td>{HP_SECTIONS.map(h=><td key={h} style={{textAlign:"center",padding:"8px 4px",borderBottom:`1px solid ${BD}`}}><div style={{width:14,height:14,borderRadius:"50%",margin:"0 auto",background:(f.homepageSections||[]).includes(h)?A:"#e8e4df"}}/></td>)}</tr>)}</tbody>
      </table>
    </div>
    <div style={{...cardSt,overflowX:"auto"}}>
      <SL>Geographic & Market Signals</SL>
      <table style={{width:"100%",borderCollapse:"collapse",...s(),fontSize:12}}>
        <thead><tr><th style={{textAlign:"left",padding:"10px 12px",borderBottom:`2px solid ${BD}`,...m(),fontSize:10,color:M,letterSpacing:1,textTransform:"uppercase",position:"sticky",left:0,background:C,minWidth:120}}>Firm</th>{GEO_SIGNALS.map(g=><th key={g} style={{textAlign:"center",padding:"10px 4px",borderBottom:`2px solid ${BD}`,...m(),fontSize:8,color:M,textTransform:"uppercase",minWidth:32,writingMode:"vertical-lr",height:120}}>{g}</th>)}</tr></thead>
        <tbody>{entries.map((f,i)=><tr key={f.id} style={{background:i%2===0?C:S}}><td style={{padding:"8px 12px",fontWeight:600,borderBottom:`1px solid ${BD}`,position:"sticky",left:0,background:i%2===0?C:S,fontSize:12}}>{f.name}</td>{GEO_SIGNALS.map(g=><td key={g} style={{textAlign:"center",padding:"8px 4px",borderBottom:`1px solid ${BD}`}}><div style={{width:14,height:14,borderRadius:"50%",margin:"0 auto",background:(f.geoSignals||[]).includes(g)?AW:"#e8e4df"}}/></td>)}</tr>)}</tbody>
      </table>
    </div>
    <div style={cardSt}>
      <SL>Site Quality Overview</SL>
      <table style={{width:"100%",borderCollapse:"collapse",...s(),fontSize:13}}>
        <thead><tr>{["Firm","Modernity","Mobile","Speed","Personality","Tone","Thumbs"].map(h=><th key={h} style={{textAlign:"left",padding:"10px 12px",borderBottom:`2px solid ${BD}`,...m(),fontSize:9,color:M,letterSpacing:1,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
        <tbody>{entries.map((f,i)=><tr key={f.id} style={{background:i%2===0?C:S}}>
          <td style={{padding:"10px 12px",fontWeight:600,borderBottom:`1px solid ${BD}`}}>{f.name}</td>
          <td style={{padding:"10px 12px",borderBottom:`1px solid ${BD}`}}>{f.modernity||"—"}</td>
          <td style={{padding:"10px 12px",borderBottom:`1px solid ${BD}`}}>{f.mobile||"—"}</td>
          <td style={{padding:"10px 12px",borderBottom:`1px solid ${BD}`}}>{f.speed||"—"}</td>
          <td style={{padding:"10px 12px",borderBottom:`1px solid ${BD}`,fontWeight:600,color:f.personality==="High"?A:f.personality==="Medium"?AW:M}}>{f.personality||"—"}</td>
          <td style={{padding:"10px 12px",borderBottom:`1px solid ${BD}`,fontSize:12}}>{(f.toneTags||[]).join(", ")||"—"}</td>
          <td style={{padding:"10px 12px",borderBottom:`1px solid ${BD}`,fontSize:18}}>{f.thumbsRating==="up"?"👍":f.thumbsRating==="down"?"👎":"—"}</td>
        </tr>)}</tbody>
      </table>
    </div>
  </div>;
};

const CompareAB = ({firms,order}) => {
  const entries = order.map(id=>firms[id]).filter(Boolean);
  const [a,setA] = useState(entries[0]?.id||"");
  const [b,setB] = useState(entries[1]?.id||"");
  const fA = firms[a], fB = firms[b];
  const Row = ({label,va,vb}) => <tr><td style={{padding:"10px 12px",borderBottom:`1px solid ${BD}`,fontWeight:600,fontSize:12,color:M,width:180}}>{label}</td><td style={{padding:"10px 12px",borderBottom:`1px solid ${BD}`,fontSize:13}}>{va||"—"}</td><td style={{padding:"10px 12px",borderBottom:`1px solid ${BD}`,fontSize:13}}>{vb||"—"}</td></tr>;
  return <div>
    <div style={{display:"flex",gap:16,marginBottom:20}}>
      {[["Firm A",a,setA],["Firm B",b,setB]].map(([l,v,fn])=><div key={l} style={{flex:1}}><FL>{l}</FL><select value={v} onChange={e=>fn(e.target.value)} style={{...inputSt,cursor:"pointer"}}><option value="">Select...</option>{entries.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}</select></div>)}
    </div>
    {fA&&fB?<div style={cardSt}>
      <table style={{width:"100%",borderCollapse:"collapse",...s()}}>
        <thead><tr><th style={{textAlign:"left",padding:"10px 12px",borderBottom:`2px solid ${BD}`,...m(),fontSize:10,color:M,width:180}}></th><th style={{textAlign:"left",padding:"10px 12px",borderBottom:`2px solid ${BD}`,fontWeight:700}}>{fA.name}</th><th style={{textAlign:"left",padding:"10px 12px",borderBottom:`2px solid ${BD}`,fontWeight:700}}>{fB.name}</th></tr></thead>
        <tbody>
          <Row label="Hero Headline" va={fA.heroHeadline} vb={fB.heroHeadline}/>
          <Row label="Modernity" va={fA.modernity} vb={fB.modernity}/>
          <Row label="Mobile" va={fA.mobile} vb={fB.mobile}/>
          <Row label="Personality" va={fA.personality} vb={fB.personality}/>
          <Row label="Tone" va={(fA.toneTags||[]).join(", ")} vb={(fB.toneTags||[]).join(", ")}/>
          <Row label="Thumbs" va={fA.thumbsRating==="up"?"👍":fA.thumbsRating==="down"?"👎":""} vb={fB.thumbsRating==="up"?"👍":fB.thumbsRating==="down"?"👎":""}/>
          <Row label="Key Takeaway" va={fA.keyTakeaway} vb={fB.keyTakeaway}/>
          <Row label="Primary Color" va={fA.primaryColor} vb={fB.primaryColor}/>
          <Row label="Portfolio Projects" va={fA.totalProjects} vb={fB.totalProjects}/>
          <Row label="Portfolio Emphasis" va={(fA.portfolioEmphasis||[]).join(", ")} vb={(fB.portfolioEmphasis||[]).join(", ")}/>
          <Row label="Sample Word Count" va={fA.sampleWordCount} vb={fB.sampleWordCount}/>
          <Row label="Geo Signals" va={(fA.geoSignals||[]).join(", ")} vb={(fB.geoSignals||[]).join(", ")}/>
          <Row label="Page Title" va={fA.pageTitle} vb={fB.pageTitle}/>
          <Row label="About Warmth" va={fA.aboutWarmthScale} vb={fB.aboutWarmthScale}/>
          <Row label="About Jargon" va={fA.aboutJargonDensity} vb={fB.aboutJargonDensity}/>
          <Row label="People Headcount" va={fA.peopleHeadcount} vb={fB.peopleHeadcount}/>
          <Row label="People Warmth" va={fA.peopleWarmthScale} vb={fB.peopleWarmthScale}/>
        </tbody>
      </table>
    </div>:<div style={{...cardSt,textAlign:"center",padding:32,color:M,...s(),fontSize:13}}>Select two firms to compare.</div>}
  </div>;
};

// ─── JSON IMPORT ─────────────────────────────────────────────────────
const JSONImport = ({onImport, firms, order}) => {
  const [json,setJson] = useState("");
  const [err,setErr] = useState("");
  const [targetId,setTargetId] = useState("");
  const doImport = () => {
    try {
      const d = JSON.parse(json);
      setErr("");
      onImport(d, targetId);
      setJson("");
      setTargetId("");
    } catch(e) { setErr("Invalid JSON: "+e.message); }
  };
  
  return <div style={cardSt}>
    <SL>Import Firm Data (JSON)</SL>
    <div style={{...s(),fontSize:12,color:M,marginBottom:12}}>Paste the X-Ray JSON block from your research prompt output.</div>
<div style={{marginBottom:12}}>
  <div style={{...s(),fontSize:12,fontWeight:600,color:"#5c5549",marginBottom:4}}>Apply to Firm</div>
  <select value={targetId} onChange={e=>setTargetId(e.target.value)} style={{...inputSt,cursor:"pointer"}}>
    <option value="">Select existing firm...</option>
    {order.map(id=><option key={id} value={id}>{firms[id]?.name||id}</option>)}
  </select>
</div>

    
    <textarea value={json} onChange={e=>{setJson(e.target.value);setErr("");}} placeholder='Paste JSON here...' style={{...txSt,minHeight:120,...m(),fontSize:12}}/>
    {err&&<div style={{color:"#a4433a",fontSize:12,...s(),marginTop:8}}>{err}</div>}
    <button onClick={doImport} disabled={!json.trim()} style={{...s(),marginTop:12,padding:"10px 24px",background:json.trim()?A:"#ccc",color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:json.trim()?"pointer":"not-allowed"}}>Import Data</button>
  </div>;
};

// ─── MAIN APP ────────────────────────────────────────────────────────
const TABS = [
  {id:"structure",label:"Structure & UX"},
  {id:"homepage",label:"Homepage"},
  {id:"about",label:"About"},
  {id:"people",label:"People"},
  {id:"portfolio",label:"Portfolio"},
  {id:"seo",label:"SEO & Traffic"},
];

export default function XRayVision({ competitors, onBack }) {
  const [firms, setFirms] = useState(competitors || {});
  const [order, setOrder] = useState(Object.keys(competitors || {}).sort((a,b) => (competitors[a]?.name||'').localeCompare(competitors[b]?.name||'')));
  const [sel,setSel] = useState(null);
  const [tab,setTab] = useState(null); // null = landing view
  const [view,setView] = useState("audit"); // audit|matrix|ab|import
  const [search,setSearch] = useState("");
  const [loaded,setLoaded] = useState(false);
  const [trayOpen,setTrayOpen] = useState(false);
  const [images,setImages] = useState({}); // {firmId: {slot: dataUrl}}
  const [newName,setNewName] = useState("");
  const [newUrl,setNewUrl] = useState("");
  const [newGroup,setNewGroup] = useState(PEER_GROUPS[0]);
  const [previewImg,setPreviewImg] = useState(null);
  _setPreview = setPreviewImg;

// Stable string for effect deps (avoids new array ref on every render)
  // Mark ready immediately — images are loaded by the effect below
  
// Load
 const orderStr = order.join(',');
  useEffect(()=>{ setLoaded(true); },[]);
  useEffect(()=>{
    if(order.length===0) return;
    (async()=>{
      const nextImgs={};
      for(const id of order){
        nextImgs[id]={};
        for(const slot of IMG_SLOTS){ const img=await imgGet(id,slot); if(img) nextImgs[id][slot]=img; }
        const serverImgs=firms[id]?.images||{};
        Object.assign(nextImgs[id], serverImgs);
      }
      setImages(nextImgs);
    })();
  },[orderStr]);

useEffect(() => {
  if (competitors && Object.keys(competitors).length > 0) {
    setFirms(competitors);
    setOrder(Object.keys(competitors).sort((a,b) =>
      competitors[a].name.localeCompare(competitors[b].name)
    ));
  }
}, [competitors]);
  
  // Guard persist effects — never write empty data before competitors loads
  useEffect(()=>{ if(loaded && Object.keys(firms).length>0) sSet(SK,firms); },[firms,loaded]);
  useEffect(()=>{ if(loaded && order.length>0) sSet(SO,order); },[orderStr,loaded]);

  
  // Auto-select first firm when competitors load
  useEffect(()=>{ if(!sel && order.length>0) setSel(order[0]); },[order.length]);

const updateFirm = useCallback((key, value) => {
  if (!sel) return;
  const now = new Date().toISOString().split("T")[0];
  setFirms(p => {
    const updated = {...p, [sel]: {...p[sel], [key]: value, lastReviewed: now}};
    fetch('/api/save-competitor', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name: p[sel]?.name || sel, ...updated[sel]})
    }).catch(err => console.error('Failed to save:', err));
    return updated;
  });
}, [sel]);

const updateImage = useCallback((slot, data) => {
  if (!sel) return;
  // Instant local update with base64 so UI doesn't wait
  setImages(p => ({ ...p, [sel]: { ...(p[sel] || {}), [slot]: data } }));
  imgSet(sel, slot, data);
  // Persist to server, then swap base64 → blob URL in state + cache
  fetch('/api/save-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firmName: sel, slot, imageData: data || null })
  })
    .then(r => r.json())
    .then(({ url }) => {
      if (url) {
        // Replace base64 with the permanent blob URL
        setImages(p => ({ ...p, [sel]: { ...(p[sel] || {}), [slot]: url } }));
        imgSet(sel, slot, url);
      }
    })
    .catch(err => console.error('Failed to save image:', err));
}, [sel]);

  const addFirm = () => {
    if(!newName.trim()) return;
    const id = Date.now().toString();
    const firm = {id,name:newName.trim(),url:newUrl.trim(),peerGroup:newGroup,status:"Not Started",lastReviewed:new Date().toISOString().split("T")[0],keyTakeaway:"",thumbsRating:"",changelog:{},
      sitemap:[],navStyles:[],headingFont:"",bodyFont:"",animations:[],modernity:"",mobile:"",speed:"",primaryColor:"",secondaryColor:"",accentColor:"",paletteNotes:"",photoStyles:[],visualIdNotes:"",structureNotes:"",
      heroHeadline:"",heroSubtext:"",homepageSections:[],sectionOrder:"",toneTags:[],personality:"",readingNotes:"",geoSignals:[],geoRegions:"",clientSizeNotes:"",ctaInventory:"",homepageNotes:"",
      aboutUrl:"",aboutMissionVision:"",aboutStoryType:[],aboutYearFounded:"",aboutMarketsNamed:"",aboutAwardsCerts:"",aboutClientLogos:"",aboutOfficeDetail:"",aboutVideoMedia:"",aboutWordCount:"",aboutJargonDensity:"",aboutAiWritingCheck:"",aboutAudienceTarget:"",aboutCommunityConnection:"",aboutWarmthScale:"",aboutWeLanguage:"",aboutNotablePhrases:"",aboutNotes:"",
      peopleUrl:"",peopleHeadcount:"",peopleOrganization:"",peopleInfoPerPerson:"",peoplePhotoStyle:"",peopleCertifications:"",peopleProjectConnection:"",peopleCommunityInterests:"",peopleCultureContent:"",peopleApproachability:"",peopleBioDepth:"",peopleJargonDensity:"",peopleAiWritingCheck:"",peopleWarmthScale:"",peopleBioConsistency:"",peopleNotes:"",
      portfolioUrl:"",totalProjects:"",portfolioOrg:"",filterCategories:"",categoryCounts:"",portfolioFeatures:[],portfolioEmphasis:[],portfolioVideo:"",portfolioNotes:"",
      sampleProjectName:"",sampleProjectUrl:"",sampleWordCount:"",sampleParagraphs:"",sampleReadingLevel:"",narrativeIncludes:[],metadataFields:[],narrativeTone:[],narrativeAbsent:[],textAnalysisNotes:"",
      domainAuthority:"",monthlyTraffic:"",topTrafficSource:"",bounceRate:"",topKeywords:"",referralSources:"",pageTitle:"",metaDescription:"",seoNotes:""};
    setFirms(p=>{const next={...p,[id]:firm}; sSet(SK,next); return next;}); setOrder(p=>{const next=[...p,id]; sSet(SO,next); return next;}); setImages(p=>({...p,[id]:{}}));
    setSel(id); setTab(null); setTrayOpen(false); setNewName(""); setNewUrl(""); setNewGroup(PEER_GROUPS[0]);
  };
  
const updateFirmXray = (data, targetId) => {
  const id = targetId || Date.now().toString();
  const isExisting = !!firms[id];
  const existing = isExisting ? firms[id] : {};
  const merged = { ...existing, ...data, id };
  setFirms(p => { const next = {...p, [id]: merged}; sSet(SK, next); return next; });
  if (!isExisting) setOrder(p => { const next = [...p, id]; sSet(SO, next); return next; });
  setImages(p => ({...p, [id]: p[id] || {}}));
  setSel(id); setTab(null); setView("audit"); setTrayOpen(false);
  fetch('/api/save-competitor', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ name: merged.name || id, ...merged })
  }).catch(err => console.error('Failed to save xray import:', err));
};
  const importFirm = (data) => {
    const id = Date.now().toString();
    const defaults = {
      name: data.name || "Imported Firm",
      url: data.url || "",
      peerGroup: data.peerGroup || "Peer Group",
      status: "Complete",
      lastReviewed: new Date().toISOString().split("T")[0],
      keyTakeaway: data.keyTakeaway || "",
      thumbsRating: data.thumbsRating || "",
      changelog: {},
      sitemap:[],navStyles:[],headingFont:"",bodyFont:"",animations:[],modernity:"",mobile:"",speed:"",primaryColor:"",secondaryColor:"",accentColor:"",paletteNotes:"",photoStyles:[],visualIdNotes:"",structureNotes:"",
      heroHeadline:"",heroSubtext:"",homepageSections:[],sectionOrder:"",toneTags:[],personality:"",readingNotes:"",geoSignals:[],geoRegions:"",clientSizeNotes:"",ctaInventory:"",homepageNotes:"",
      aboutUrl:"",aboutMissionVision:"",aboutStoryType:[],aboutYearFounded:"",aboutMarketsNamed:"",aboutAwardsCerts:"",aboutClientLogos:"",aboutOfficeDetail:"",aboutVideoMedia:"",aboutWordCount:"",aboutJargonDensity:"",aboutAiWritingCheck:"",aboutAudienceTarget:"",aboutCommunityConnection:"",aboutWarmthScale:"",aboutWeLanguage:"",aboutNotablePhrases:"",aboutNotes:"",
      peopleUrl:"",peopleHeadcount:"",peopleOrganization:"",peopleInfoPerPerson:"",peoplePhotoStyle:"",peopleCertifications:"",peopleProjectConnection:"",peopleCommunityInterests:"",peopleCultureContent:"",peopleApproachability:"",peopleBioDepth:"",peopleJargonDensity:"",peopleAiWritingCheck:"",peopleWarmthScale:"",peopleBioConsistency:"",peopleNotes:"",
      portfolioUrl:"",totalProjects:"",portfolioOrg:"",filterCategories:"",categoryCounts:"",portfolioFeatures:[],portfolioEmphasis:[],portfolioVideo:"",portfolioNotes:"",
      sampleProjectName:"",sampleProjectUrl:"",sampleWordCount:"",sampleParagraphs:"",sampleReadingLevel:"",narrativeIncludes:[],metadataFields:[],narrativeTone:[],narrativeAbsent:[],textAnalysisNotes:"",
      domainAuthority:"",monthlyTraffic:"",topTrafficSource:"",bounceRate:"",topKeywords:"",referralSources:"",pageTitle:"",metaDescription:"",seoNotes:"",
    };
    const firm = Object.assign({}, defaults, data, { id: id });
    setFirms(p=>{const next = {...p,[id]:firm}; sSet(SK,next); return next;});
    setOrder(p=>{const next = [...p,id]; sSet(SO,next); return next;});
    setImages(p=>({...p,[id]:{}}));
    setSel(id); setTab(null); setView("audit"); setTrayOpen(false);
  };

const deleteFirm = (id) => {
  const firmName = firms[id]?.name || id;
  setFirms(p => {const n={...p}; delete n[id]; return n;});
  setOrder(p => p.filter(x => x !== id));
  IMG_SLOTS.forEach(slot => imgSet(id, slot, null));
  setImages(p => {const n={...p}; delete n[id]; return n;});
  if (sel === id) {setSel(null); setTab(null);}
  fetch('/api/delete-competitor', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({name: firmName})
  }).catch(err => console.error('Failed to delete:', err));
};

  const cur = sel?firms[sel]:null;
  const curImgs = sel?(images[sel]||{}):{};
  const grouped = {};
  PEER_GROUPS.forEach(g=>{grouped[g]=[];});
  order.forEach(id=>{const f=firms[id];if(f){const g=f.peerGroup||"Peer Group";if(!grouped[g])grouped[g]=[];grouped[g].push({...f, id});}});
  const statusColor = s => s==="Complete"?A:s==="In Progress"?AW:M;

  if(!loaded) return <div style={{...s(),background:BG,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",color:M}}>Loading...</div>;

  return <div style={{...s(),background:BG,minHeight:"100vh",color:D}}>

    {/* ═══ HEADER ═══ */}
    <div style={{background:"#2c2c2c",padding:"32px 32px 28px",color:"#f5f2ed"}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>

        {/* ADD HOME BUTTON HERE ↓ */}
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
        ← Home
      </button>
      {/* END HOME BUTTON ↑ */}
        
        <div style={{...m(),fontSize:11,textTransform:"uppercase",letterSpacing:2.5,color:AW,marginBottom:8}}>MKM Design Group</div>
        <h1 style={{...s(),fontSize:32,fontWeight:700,margin:0,lineHeight:1.2}}>Website X-Ray Vision</h1>
        <p style={{fontSize:14,color:"#a09a90",marginTop:8,marginBottom:0,maxWidth:600,lineHeight:1.5}}>Dissect competitor websites — structure, messaging, portfolio, and search visibility.</p>
        <div style={{display:"flex",gap:0,marginTop:24}}>
          {[{k:"audit",l:"Audit Firms"},{k:"matrix",l:"Compare All"},{k:"ab",l:"A/B Compare"},{k:"import",l:"Import"}].map(t=>
            <button key={t.k} onClick={()=>setView(t.k)} style={{padding:"10px 24px",...s(),fontSize:13,fontWeight:600,border:"none",cursor:"pointer",borderBottom:view===t.k?`2px solid ${AW}`:"2px solid transparent",background:"transparent",color:view===t.k?"#f5f2ed":"#7a756d",transition:"all 0.15s ease"}}>{t.l}</button>
          )}
        </div>
      </div>
    </div>

    <div style={{maxWidth:1100,margin:"0 auto",padding:"24px 32px 64px",position:"relative"}}>

      {/* ═══ SLIDE-OVER TRAY ═══ */}
      {view==="audit"&&<>
        {!trayOpen&&<button onClick={()=>setTrayOpen(true)} style={{position:"fixed",left:0,top:"50%",transform:"translateY(-50%)",zIndex:100,background:A,color:"#fff",border:"none",borderRadius:"0 8px 8px 0",padding:"12px 8px",cursor:"pointer",writingMode:"vertical-lr",fontSize:12,fontWeight:600,...s(),letterSpacing:0.5,boxShadow:"2px 2px 12px rgba(0,0,0,0.15)"}}>{cur?cur.name:"Select Firm"} ▸</button>}
        {trayOpen&&<>
          <div onClick={()=>setTrayOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.3)",zIndex:200}}/>
          <div style={{position:"fixed",left:0,top:0,bottom:0,width:280,background:C,zIndex:201,boxShadow:"4px 0 24px rgba(0,0,0,0.15)",overflowY:"auto",padding:"24px 20px"}}>

            
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{...s(),fontSize:16,fontWeight:700}}>Firms</div>
              <button onClick={()=>setTrayOpen(false)} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:M}}>×</button>
            </div>
            <input type="text" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} style={{...inputSt,marginBottom:16}}/>
            {PEER_GROUPS.map(group=>{
              const inGroup = (grouped[group]||[]).filter(f=>!search||f.name.toLowerCase().includes(search.toLowerCase()));
              if(!inGroup.length) return null;
              return <div key={group} style={{marginBottom:16}}>
                <div style={{...m(),fontSize:10,textTransform:"uppercase",letterSpacing:1.5,color:M,marginBottom:6,paddingLeft:4}}>{group}</div>
                {inGroup.map(f=><button key={f.id} onClick={()=>{setSel(f.id);setTab(null);setTrayOpen(false);}} style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"8px 10px",border:"none",borderRadius:6,background:sel===f.id?A:"transparent",color:sel===f.id?"#fff":D,...s(),fontSize:13,fontWeight:sel===f.id?600:400,cursor:"pointer",textAlign:"left",marginBottom:2}}>
                  <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{f.name}</span>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    {f.thumbsRating&&<span style={{fontSize:14}}>{f.thumbsRating==="up"?"👍":"👎"}</span>}
                    <span style={{width:8,height:8,borderRadius:"50%",background:sel===f.id?"rgba(255,255,255,0.5)":statusColor(f.status)}}/>
                  </div>
                </button>)}
              </div>;
            })}
            <div style={{borderTop:`1px solid ${BD}`,paddingTop:12,marginTop:8}}>
              <button onClick={()=>{setSel(null);setTab(null);setTrayOpen(false);}} style={{...s(),fontSize:12,fontWeight:600,color:A,background:"none",border:"none",cursor:"pointer",padding:"4px 4px"}}>+ Add New Firm</button>
            </div>
          </div>
        </>}
      </>}

      {/* ═══ VIEWS ═══ */}
      {view==="matrix"&&<CompareMatrix firms={firms} order={order}/>}
      {view==="ab"&&<CompareAB firms={firms} order={order}/>}
{view==="import"&&<JSONImport onImport={updateFirmXray} firms={firms} order={order}/>}

      {view==="audit"&&<>
        {/* NEW FIRM FORM */}
        {!sel&&<div style={{...cardSt,padding:32}}>
          <div style={{...s(),fontSize:24,fontWeight:700,marginBottom:4}}>{order.length===0?"Add Your First Firm":"Add a New Firm"}</div>
          <div style={{...s(),fontSize:13,color:M,marginBottom:24,lineHeight:1.5}}>{order.length===0?"Start your competitive website audit.":"Add another firm to your audit."}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
            <div><FL>Firm Name</FL><input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="e.g., HKS" style={inputSt} onKeyDown={e=>e.key==="Enter"&&addFirm()}/></div>
            <div><FL>Peer Group</FL><select value={newGroup} onChange={e=>setNewGroup(e.target.value)} style={{...inputSt,cursor:"pointer"}}>{PEER_GROUPS.map(g=><option key={g} value={g}>{g}</option>)}</select></div>
          </div>
          <div style={{marginBottom:24}}><FL>Website URL</FL><input value={newUrl} onChange={e=>setNewUrl(e.target.value)} placeholder="https://..." style={inputSt} onKeyDown={e=>e.key==="Enter"&&addFirm()}/></div>
          <button onClick={addFirm} disabled={!newName.trim()} style={{...s(),padding:"10px 24px",background:newName.trim()?A:"#ccc",color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:newName.trim()?"pointer":"not-allowed"}}>Create Firm & Start Audit →</button>
        </div>}

        {/* FIRM: LANDING VIEW */}
        {cur&&!tab&&<div>
          {/* Summary Card */}
          <div style={cardSt}>
            <div style={{display:"flex",gap:24,alignItems:"flex-start"}}>
              {/* Logo - horizontal */}
              <div style={{width:160,flexShrink:0}}>
                <ImageSlot image={curImgs.logo} onUpload={img=>updateImage("logo",img)} onDelete={()=>updateImage("logo",null)} label="Logo" height={150} contain={true}/>
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div>
                    <h2 style={{...s(),fontSize:28,fontWeight:700,margin:0}}>{cur.name}</h2>
                    {cur.url&&<a href={cur.url.startsWith("http")?cur.url:`https://${cur.url}`} target="_blank" rel="noopener noreferrer" style={{...s(),fontSize:13,color:A,textDecoration:"none"}}>{cur.url} ↗</a>}
                    <div style={{...m(),fontSize:11,color:M,marginTop:4}}>{cur.peerGroup} · Last reviewed: {cur.lastReviewed}</div>
                  </div>


                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
  <div style={{display:"flex",gap:4}}>
    {["up","down"].map(t=><button key={t} onClick={()=>updateFirm("thumbsRating",cur.thumbsRating===t?"":t)} style={{fontSize:22,background:cur.thumbsRating===t?(t==="up"?"#e8f5e9":"#fce4ec"):"transparent",border:`1px solid ${cur.thumbsRating===t?(t==="up"?A:"#a4433a"):BD}`,borderRadius:8,padding:"4px 10px",cursor:"pointer"}}>{t==="up"?"👍":"👎"}</button>)}
  </div>
  <select value={cur.status} onChange={e=>updateFirm("status",e.target.value)} style={{...m(),fontSize:11,padding:"6px 10px",borderRadius:6,border:`1px solid ${BD}`,background:S,color:statusColor(cur.status),fontWeight:600,cursor:"pointer",outline:"none"}}>{STATUS_OPTIONS.map(st=><option key={st} value={st}>{st}</option>)}</select>
                    <button onClick={()=>{if(confirm(`Delete ${cur.name}?`))deleteFirm(sel);}} style={{background:"none",border:"none",cursor:"pointer",color:"#c4b8a8",fontSize:18,padding:"2px 6px"}} title="Delete firm">🗑</button>
                  </div>
                </div>

                <div style={{marginTop:16}}>

                  
                  <FL>Key Takeaway</FL>
                  <input value={cur.keyTakeaway||""} onChange={e=>updateFirm("keyTakeaway",e.target.value)} placeholder="One sentence — the most important thing about this competitor..." style={{...inputSt,fontWeight:500,fontSize:14}}/>
                </div>
                {(cur.modernity||cur.personality||cur.toneTags?.length)&&<div style={{display:"flex",gap:16,marginTop:16,flexWrap:"wrap"}}>
                  {cur.modernity&&<div style={{...m(),fontSize:11,color:M}}>Modernity: <span style={{color:D,fontWeight:600}}>{cur.modernity}</span></div>}
                  {cur.personality&&<div style={{...m(),fontSize:11,color:M}}>Personality: <span style={{color:D,fontWeight:600}}>{cur.personality}</span></div>}
                  {cur.mobile&&<div style={{...m(),fontSize:11,color:M}}>Mobile: <span style={{color:D,fontWeight:600}}>{cur.mobile}</span></div>}
                  {cur.toneTags?.length>0&&<div style={{...m(),fontSize:11,color:M}}>Tone: <span style={{color:D,fontWeight:600}}>{cur.toneTags.join(", ")}</span></div>}
                </div>}
              </div>
            </div>
          </div>
          {/* Notes */}
          <div style={cardSt}>
            <SL>Notes & Observations</SL>
            <textarea value={cur.overviewNotes||""} onChange={e=>updateFirm("overviewNotes",e.target.value)} placeholder="General observations, strategic notes, things to watch..." style={txSt}/>
          </div>
          {/* Tab Buttons */}
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
            {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} data-tab={t.id} style={{...s(),padding:"12px 20px",fontSize:13,fontWeight:600,border:`1px solid ${BD}`,borderRadius:8,background:C,color:D,cursor:"pointer",transition:"all 0.15s ease"}}>
              {t.label} {cur.changelog?.[t.id]?<span style={{...m(),fontSize:10,color:M,marginLeft:6}}>{cur.changelog[t.id]}</span>:""}
            </button>)}
          </div>
          {/* Full Page Screenshot */}
          <div style={cardSt}>
            <SL>Full Homepage</SL>
            {curImgs.fullPage?<div style={{position:"relative",borderRadius:8,overflow:"hidden",border:`1px solid ${BD}`}}>
              <img src={curImgs.fullPage} alt="Full homepage" onClick={()=>setPreviewImg(curImgs.fullPage)} style={{width:"100%",display:"block",objectPosition:"top",cursor:"pointer"}}/>
              <button onClick={()=>updateImage("fullPage",null)} style={{position:"absolute",top:8,right:8,width:28,height:28,borderRadius:"50%",background:"rgba(0,0,0,0.6)",color:"#fff",border:"none",cursor:"pointer",fontSize:14,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
            </div>:<ImageSlot image={null} onUpload={img=>updateImage("fullPage",img)} onDelete={()=>{}} label="Upload Full Homepage Screenshot" height={200}/>}
          </div>
        </div>}

        {/* FIRM: TAB VIEW */}
        {cur&&tab&&<div>
          <button onClick={()=>setTab(null)} style={{...s(),fontSize:13,color:A,background:"none",border:"none",cursor:"pointer",padding:"0 0 16px",fontWeight:600}}>← Back to {cur.name} overview</button>
          <div style={{display:"flex",gap:0,marginBottom:20,borderBottom:`1px solid ${BD}`}}>
            {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} data-tab={t.id} style={{padding:"12px 20px",...s(),fontSize:13,fontWeight:600,border:"none",cursor:"pointer",borderBottom:tab===t.id?`2px solid ${A}`:"2px solid transparent",background:"transparent",color:tab===t.id?D:M,transition:"all 0.15s ease",marginBottom:-1}}>{t.label}</button>)}
          </div>
          {tab==="structure"&&<TabStructure firm={cur} onChange={updateFirm} images={curImgs} onImg={updateImage}/>}
          {tab==="homepage"&&<TabHomepage firm={cur} onChange={updateFirm} images={curImgs} onImg={updateImage}/>}
          {tab==="about"&&<TabAbout firm={cur} onChange={updateFirm} images={curImgs} onImg={updateImage}/>}
          {tab==="people"&&<TabPeople firm={cur} onChange={updateFirm} images={curImgs} onImg={updateImage}/>}
          {tab==="portfolio"&&<TabPortfolio firm={cur} onChange={updateFirm} images={curImgs} onImg={updateImage}/>}
          {tab==="seo"&&<TabSEO firm={cur} onChange={updateFirm}/>}
        </div>}
      </>}
    </div>
    {previewImg&&<div onClick={()=>setPreviewImg(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",padding:24}}>
      <img src={previewImg} alt="Preview" style={{maxWidth:"95%",maxHeight:"95vh",objectFit:"contain",borderRadius:8}}/>
      <button onClick={()=>setPreviewImg(null)} style={{position:"absolute",top:20,right:20,width:40,height:40,borderRadius:"50%",background:"rgba(255,255,255,0.2)",color:"#fff",border:"none",cursor:"pointer",fontSize:24,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
    </div>}
  </div>;
}
