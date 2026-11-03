 "use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowDownRight, ArrowUpRight, BarChart3, CalendarDays, ChevronDown,
  CircleHelp, Clock3, Command, Globe2, Goal, LayoutDashboard, Menu, Search,
  Shield, Sparkles, Trophy, Users, X, Zap, RefreshCw, Send, AlertCircle,
  Radio, ChartNoAxesCombined
} from "lucide-react";

type Tab = "Overview" | "Matches" | "Competitions" | "Scorers" | "AI Analyst";
type ApiState = { loading: boolean; error: string; data: any };

const tabs: { name: Tab; icon: any }[] = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "Matches", icon: CalendarDays },
  { name: "Competitions", icon: Trophy },
  { name: "Scorers", icon: Goal },
  { name: "AI Analyst", icon: Sparkles }
];

function useFootball(resource: string, params = "") {
  const [state, setState] = useState<ApiState>({ loading: true, error: "", data: null });
  const load = async () => {
    setState(s => ({ ...s, loading: true, error: "" }));
    try {
      const res = await fetch(`/api/football?resource=${resource}${params}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || json.error || "Request failed");
      setState({ loading: false, error: "", data: json });
    } catch (e: any) {
      setState({ loading: false, error: e.message || "Unable to load data", data: null });
    }
  };
  useEffect(() => { load(); }, [resource, params]);
  return { ...state, reload: load };
}

function EmptyState({ title, detail, onRetry }: { title: string; detail: string; onRetry?: () => void }) {
  return <div className="empty-state">
    <div className="empty-icon"><AlertCircle size={19} /></div>
    <h3>{title}</h3><p>{detail}</p>
    {onRetry && <button className="subtle-button" onClick={onRetry}><RefreshCw size={14}/> Retry</button>}
  </div>;
}

function Header({ active, setActive }: { active: Tab; setActive: (t: Tab) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return <header className="topbar">
    <button className="mobile-menu icon-button" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">{mobileOpen ? <X/> : <Menu/>}</button>
    <div className="brand"><div className="brand-mark"><Activity size={21}/></div><span>FOOTBALL<span className="brand-iq"> IQ</span></span></div>
    <nav className={mobileOpen ? "nav open" : "nav"}>
      {tabs.map(({name, icon: Icon}) => <button key={name} className={active === name ? "nav-link active" : "nav-link"} onClick={() => {setActive(name);setMobileOpen(false);}}><Icon size={16}/>{name}</button>)}
    </nav>
    <div className="top-actions"><div className="status"><span/> DATA HUB</div><button className="icon-button" aria-label="Search" onClick={() => setActive("Competitions")}><Search size={18}/></button><div className="avatar">IQ</div></div>
  </header>;
}

function MatchRow({ match }: { match: any }) {
  const home = match.homeTeam?.name || "Home team";
  const away = match.awayTeam?.name || "Away team";
  const score = match.score?.fullTime;
  const finished = match.status === "FINISHED";
  const time = match.utcDate ? new Date(match.utcDate).toLocaleString([], { month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" }) : match.status;
  return <div className="match-row">
    <div className="match-meta"><span>{match.competition?.name || "Competition"}</span><span className={finished ? "match-finished" : "match-time"}>{finished ? "FT" : time}</span></div>
    <div className="match-teams"><div className="team-name"><span className="team-dot">{home.slice(0,1)}</span>{home}</div><strong>{score?.home ?? "–"} <i>:</i> {score?.away ?? "–"}</strong><div className="team-name away"><span className="team-dot">{away.slice(0,1)}</span>{away}</div></div>
  </div>;
}

function Overview() {
  const matches = useFootball("matches", "&dateFrom=" + new Date().toISOString().slice(0,10) + "&dateTo=" + new Date(Date.now()+86400000).toISOString().slice(0,10));
  const comps = useFootball("competitions");
  const [period, setPeriod] = useState("Today");
  const list = matches.data?.matches || [];
  const competitions = comps.data?.competitions || [];
  return <>
    <section className="welcome-row"><div><div className="eyebrow"><span className="pulse"/> GLOBAL FOOTBALL INTELLIGENCE</div><h1>See the game <em>deeper.</em></h1><p>Your command centre for the world's game.</p></div><div className="date-chip"><CalendarDays size={15}/>{new Date().toLocaleDateString([], {weekday:"long", month:"short", day:"numeric"})}</div></section>
    <section className="stats-grid">
      <div className="stat-card"><div className="stat-top"><span>DATA PROVIDER</span><Globe2 size={17}/></div><strong className="stat-text">football-data.org</strong><small>Connected when API token is configured</small></div>
      <div className="stat-card"><div className="stat-top"><span>COMPETITIONS</span><Trophy size={17}/></div><strong>{comps.loading ? "…" : comps.error ? "—" : competitions.length}</strong><small>Available through your provider plan</small></div>
      <div className="stat-card"><div className="stat-top"><span>FIXTURES LOADED</span><CalendarDays size={17}/></div><strong>{matches.loading ? "…" : matches.error ? "—" : list.length}</strong><small>Current date window</small></div>
      <div className="stat-card"><div className="stat-top"><span>ANALYTICS ENGINE</span><ChartNoAxesCombined size={17}/></div><strong className="stat-text">Ready to configure</strong><small>Predictions require historical match data</small></div>
    </section>
    <div className="content-grid">
      <section className="panel matches-panel"><div className="panel-heading"><div><div className="eyebrow">THE PITCH</div><h2>Match centre</h2></div><div className="period-switch">{["Today","Next 24h"].map(x=><button key={x} className={period===x?"selected":""} onClick={()=>setPeriod(x)}>{x}</button>)}</div></div>
        {matches.loading ? <div className="loading"><span className="spinner"/>Loading verified fixtures…</div> : matches.error ? <EmptyState title="Match data unavailable" detail={matches.error} onRetry={matches.reload}/> : list.length ? list.slice(0,7).map((m:any)=><MatchRow key={m.id} match={m}/>) : <EmptyState title="No fixtures found" detail="There are no fixtures in this date window from the connected provider." onRetry={matches.reload}/>}
        <div className="panel-footer"><span>Source: football-data.org</span><button onClick={()=>matches.reload()}>Refresh <RefreshCw size={13}/></button></div>
      </section>
      <section className="panel side-panel"><div className="panel-heading"><div><div className="eyebrow">DISCOVER</div><h2>Competitions</h2></div><Trophy size={18} className="muted"/></div>
        {comps.loading ? <div className="loading"><span className="spinner"/>Loading competitions…</div> : comps.error ? <EmptyState title="Provider not connected" detail={comps.error} onRetry={comps.reload}/> : competitions.slice(0,8).map((c:any)=><div className="competition-row" key={c.id}><div className="comp-icon">{(c.name||"C").slice(0,1)}</div><div><b>{c.name}</b><small>{c.area?.name || "International"} · {c.code || "—"}</small></div><ChevronDown size={15}/></div>)}
        <div className="panel-footer"><span>Provider-supported catalogue</span><button onClick={comps.reload}>Refresh <RefreshCw size={13}/></button></div>
      </section>
    </div>
    <section className="feature-strip"><div className="feature-icon"><Shield size={19}/></div><div><b>Data integrity comes first</b><p>Unavailable information is labelled clearly. No fabricated live scores, player stats or injury reports.</p></div><span className="integrity-tag">VERIFIED DATA POLICY</span></section>
  </>;
}

function Matches() {
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const data = useFootball("matches", `&dateFrom=${date}&dateTo=${date}`);
  return <section className="page-section"><div className="page-title"><div><div className="eyebrow">FIXTURES & RESULTS</div><h1>Match centre</h1><p>Fixtures and results returned by your connected provider.</p></div><input type="date" value={date} onChange={e=>setDate(e.target.value)} className="date-input"/></div><div className="panel">
    {data.loading ? <div className="loading"><span className="spinner"/>Loading matches…</div> : data.error ? <EmptyState title="Could not load matches" detail={data.error} onRetry={data.reload}/> : (data.data?.matches || []).length ? data.data.matches.map((m:any)=><MatchRow key={m.id} match={m}/>) : <EmptyState title="No matches listed" detail="The provider returned no matches for this date." onRetry={data.reload}/>}
  </div></section>;
}

function Competitions() {
  const data = useFootball("competitions");
  const [query,setQuery] = useState("");
  const items = data.data?.competitions || [];
  const filtered = useMemo(()=>items.filter((x:any)=>(x.name+" "+(x.area?.name||"")+" "+(x.code||"")).toLowerCase().includes(query.toLowerCase())),[items,query]);
  return <section className="page-section"><div className="page-title"><div><div className="eyebrow">GLOBAL DIRECTORY</div><h1>Competitions</h1><p>Browse competitions available through the active data provider.</p></div></div><div className="search-box"><Search size={17}/><input placeholder="Search competition or country…" value={query} onChange={e=>setQuery(e.target.value)}/></div><div className="competition-grid">
    {data.loading ? <div className="loading"><span className="spinner"/>Loading directory…</div> : data.error ? <EmptyState title="Competition directory unavailable" detail={data.error} onRetry={data.reload}/> : filtered.map((c:any)=><article className="competition-card" key={c.id}><div className="comp-icon large">{(c.name||"C").slice(0,1)}</div><div><span className="eyebrow">{c.area?.name || "INTERNATIONAL"}</span><h3>{c.name}</h3><p>{c.code || "No competition code"} · {c.type || "Competition"}</p></div><span className="arrow">↗</span></article>)}
    {!data.loading && !data.error && filtered.length===0 && <EmptyState title="No matching competitions" detail="Try another search term."/>}
  </div></section>;
}

function Scorers() {
  const [id,setId] = useState("PL");
  const [season,setSeason] = useState(String(new Date().getFullYear()));
  const data = useFootball("scorers", `&id=${encodeURIComponent(id)}&season=${encodeURIComponent(season)}`);
  return <section className="page-section"><div className="page-title"><div><div className="eyebrow">PLAYER PERFORMANCE</div><h1>Top scorers</h1><p>Competition scoring data, where your provider plan allows access.</p></div></div><div className="filters"><select value={id} onChange={e=>setId(e.target.value)}><option value="PL">Premier League</option><option value="PD">La Liga</option><option value="BL1">Bundesliga</option><option value="SA">Serie A</option><option value="FL1">Ligue 1</option><option value="DED">Eredivisie</option><option value="PPL">Primeira Liga</option></select><input value={season} onChange={e=>setSeason(e.target.value)} aria-label="Season year"/></div><div className="panel">
    {data.loading ? <div className="loading"><span className="spinner"/>Loading scorers…</div> : data.error ? <EmptyState title="Scorer data unavailable" detail={data.error} onRetry={data.reload}/> : (data.data?.scorers || []).length ? <div className="table-wrap"><table><thead><tr><th>PLAYER</th><th>TEAM</th><th>GOALS</th><th>ASSISTS</th><th>PENALTIES</th></tr></thead><tbody>{data.data.scorers.map((s:any,i:number)=><tr key={s.player?.id||i}><td><b>{s.player?.name || "Unknown player"}</b><small>{s.player?.nationality || "Nationality unavailable"}</small></td><td>{s.team?.name || "—"}</td><td className="green-number">{s.goals ?? "—"}</td><td>{s.assists ?? "—"}</td><td>{s.penalties ?? "—"}</td></tr>)}</tbody></table></div> : <EmptyState title="No scorer records returned" detail="The selected competition or season may not be covered by your API plan." onRetry={data.reload}/>}
  </div></section>;
}

function Analyst() {
  const [question,setQuestion] = useState("");
  const [answer,setAnswer] = useState("");
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);
  async function ask(e:any) {
    e.preventDefault(); if(!question.trim()) return;
    setLoading(true);setError("");setAnswer("");
    try {
      const r=await fetch("/api/assistant",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question})});
      const j=await r.json(); if(!r.ok) throw new Error(j.detail||j.error||"Request failed");
      setAnswer(j.answer);
    } catch(err:any) {setError(err.message||"Could not get an answer");}
    finally {setLoading(false);}
  }
  return <section className="page-section analyst-page"><div className="page-title"><div><div className="eyebrow">TACTICAL INTELLIGENCE</div><h1>AI analyst</h1><p>Ask football questions. The assistant is configured to separate facts from analysis.</p></div><div className="ai-pill"><Sparkles size={15}/> AI POWERED</div></div><div className="analyst-card"><div className="analyst-orb"><Sparkles size={26}/></div><h2>Think beyond the scoreline.</h2><p>Explore tactics, compare football ideas and break down the game.</p><div className="suggestions">{["Explain how a 4-3-3 press works","What makes a low block difficult to break?","Compare possession football and counter-attacking football"].map(x=><button key={x} onClick={()=>setQuestion(x)}>{x}<span>↗</span></button>)}</div><form onSubmit={ask} className="ask-form"><input value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Ask your football question…"/><button disabled={loading||!question.trim()} aria-label="Send question">{loading?<span className="spinner"/>:<Send size={17}/>}</button></form>{error&&<div className="notice error">{error}</div>}{answer&&<div className="answer"><div className="eyebrow">ANALYST RESPONSE</div><p>{answer}</p></div>}<div className="disclaimer"><CircleHelp size={14}/> Current facts and statistics must be verified against connected source data.</div></div></section>;
}

export default function Home() {
  const [active,setActive] = useState<Tab>("Overview");
  return <main className="app-shell"><Header active={active} setActive={setActive}/><div className="main-content">
    {active==="Overview"&&<Overview/>}{active==="Matches"&&<Matches/>}{active==="Competitions"&&<Competitions/>}{active==="Scorers"&&<Scorers/>}{active==="AI Analyst"&&<Analyst/>}
    <footer><div className="brand small"><div className="brand-mark"><Activity size={16}/></div><span>FOOTBALL<span className="brand-iq"> IQ</span></span></div><span>Built for the love of the game. <b>Data before hype.</b></span><span>FOOTBALL IQ · 2026</span></footer>
  </div></main>;
}