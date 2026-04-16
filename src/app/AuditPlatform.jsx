"use client";
import { useState, useCallback } from "react";

const NAMES = ["Alpine Family Trust","Horizon Wealth Trust","Emerald Holdings","Sapphire Legacy","Granite Capital","Silver Lake Trust","Aurora Beneficiary","Pinnacle Estate","Crystal Bay Trust","Summit Protection","Valley Heritage","Northern Star Trust","Pacific Edge Trust","Sunrise Capital","Diamond Gate Trust","Cedar Ridge Trust","Golden Path Trust","Iron Bridge Trust","Coral Reef Trust","Atlas Growth Trust"];

const DEMO_TRUSTS = Array.from({ length: 50 }, (_, i) => {
  const id = `TR-${String(i + 1).padStart(4, "0")}`;
  const name = NAMES[i % 20] + (i >= 20 ? ` ${Math.floor(i/20)+1}` : "");
  const riskCat = i % 7 === 0 ? "high" : i % 3 === 0 ? "medium" : "low";
  const hasSystem = i % 5 !== 0;
  const hasGovernance = i % 4 !== 0;
  const hasCompliance = i % 6 !== 0;
  const hasPricefeed = i % 3 !== 0;
  const hasReconciliation = i % 4 !== 0;
  const hasValuation = i % 5 !== 0;
  const assetType = i % 5 === 0 ? "illiquid" : "liquid";
  const totalAssets = Math.round((500000 + Math.random() * 9500000) / 1000) * 1000;
  const materiality = Math.round(totalAssets * (riskCat === "high" ? 0.01 : riskCat === "medium" ? 0.03 : 0.05));
  const distributions = Math.floor(Math.random() * 8);
  const steps = {
    independence: i < 40, acceptance: i < 38, understanding: i < 35, scope: i < 33,
    financials: i < 30, risk: i < 28, materiality: i < 26, reliance: i < 24,
    strategy: i < 22, portfolioTests: i < 20, additionalTests: i < 18, exceptions: i < 16,
    conclusion: i < 12, report: i < 8, signoff: i < 4,
  };
  // who/when for each completed step
  const stepAudit = {};
  const users = ["A. Müller","M. Keller","S. Brunner","P. Weber","C. Fischer"];
  const roles = ["Assistant","Senior","Manager","Partner","Compliance"];
  Object.keys(steps).forEach((k, idx) => {
    if (steps[k]) {
      const d = new Date(2026, 3, 16 - Math.floor(idx * 0.8));
      stepAudit[k] = { user: users[idx % 5], role: roles[idx % 5], date: `${d.getDate()}.04.2026`, time: `${9 + (idx % 8)}:${String((idx * 7) % 60).padStart(2,"0")}` };
    }
  });
  const completedSteps = Object.values(steps).filter(Boolean).length;
  const status = completedSteps === 15 ? "completed" : completedSteps > 10 ? "in-review" : completedSteps > 5 ? "in-progress" : "open";
  return { id, name, riskCat, hasSystem, hasGovernance, hasCompliance, hasPricefeed, hasReconciliation, hasValuation, assetType, totalAssets, materiality, distributions, steps, stepAudit, completedSteps, status };
});

const IKS_CONTROLS = [
  { id: "C1", area: "Ausschüttungen", question: "Alle Ausschüttungen im System initiiert", design: true, impl: true, eff: "effective", exc: 3,
    testMethod: "Stichprobe", sampleSize: 25, sampleFrom: "Alle systembasierten Ausschüttungen (N=847)", testedItems: ["TR-0003 / 15.03.2025","TR-0017 / 22.05.2025","TR-0029 / 10.08.2025","TR-0041 / 03.11.2025"], result: "24/25 korrekt im System initiiert. 1 Fall nachträglich erfasst." },
  { id: "C2", area: "Ausschüttungen", question: "Keine Direktzahlungen ausserhalb des Systems", design: true, impl: false, eff: "partial", exc: 8,
    testMethod: "Vollprüfung Bankkonten", sampleSize: 10, sampleFrom: "Bankjournale aller Trusts mit Direktzahlungshistorie (N=10)", testedItems: ["TR-0005 / CHF 45'000","TR-0010 / CHF 120'000","TR-0015 / CHF 78'500","TR-0020 / CHF 210'000"], result: "8 von 10 Fällen mit Direktzahlung ohne Systeminitiierung. Kontrolle nicht wirksam." },
  { id: "C3", area: "Ausschüttungen", question: "Compliance-Prüfung jeder Auszahlung", design: true, impl: true, eff: "effective", exc: 1,
    testMethod: "Stichprobe", sampleSize: 30, sampleFrom: "Compliance-Logs (N=1'240)", testedItems: ["Log #2041","Log #2089","Log #2134","Log #2201"], result: "29/30 mit dokumentierter Compliance-Freigabe. 1 Ausnahme nachträglich genehmigt." },
  { id: "C4", area: "Governance", question: "Governance / Stiftungsrat hat Stellung genommen", design: true, impl: false, eff: "partial", exc: 12,
    testMethod: "Stichprobe Protokolle", sampleSize: 20, sampleFrom: "Stiftungsratsprotokolle (N=412)", testedItems: ["Protokoll 2025-Q1-014","Protokoll 2025-Q2-028","Protokoll 2025-Q3-019","Protokoll 2025-Q4-031"], result: "8/20 ohne dokumentierte Stellungnahme des Stiftungsrats. Kontrolldefizit." },
  { id: "C5", area: "Governance", question: "Dokumentierte Freigaben vorhanden", design: true, impl: true, eff: "effective", exc: 2,
    testMethod: "Stichprobe", sampleSize: 25, sampleFrom: "Freigabe-Workflow (N=890)", testedItems: ["Freigabe #F-2025-0134","Freigabe #F-2025-0289","Freigabe #F-2025-0445","Freigabe #F-2025-0612"], result: "23/25 mit vollständiger dokumentierter Freigabe." },
  { id: "C6", area: "Wertschriften", question: "Werthaltigkeitsbeurteilung dokumentiert", design: true, impl: true, eff: "effective", exc: 5,
    testMethod: "Stichprobe", sampleSize: 20, sampleFrom: "Bewertungsdossiers (N=680)", testedItems: ["TR-0002 / Aktienportfolio","TR-0014 / Obligationen","TR-0028 / PE-Beteiligung","TR-0036 / Immobilienfonds"], result: "15/20 mit vollständiger Bewertungsdokumentation. 5 mit unvollständigen Pricefeeds." },
  { id: "C7", area: "Wertschriften", question: "Pricefeeds, Custody Statements, Reconciliation", design: true, impl: true, eff: "effective", exc: 3,
    testMethod: "Stichprobe + Systemabgleich", sampleSize: 30, sampleFrom: "Reconciliation-Reports (N=1'450)", testedItems: ["Recon #R-2025-0312","Recon #R-2025-0587","Recon #R-2025-0891","Recon #R-2025-1204"], result: "27/30 mit vollständigem Abgleich. 3 mit Differenzen unter Materialität." },
  { id: "C8", area: "Wertschriften", question: "Ausnahmen geloggt und nachverfolgt", design: true, impl: false, eff: "partial", exc: 7,
    testMethod: "Exception-Log Review", sampleSize: 15, sampleFrom: "Exception-Register (N=41)", testedItems: ["Exc #E-001","Exc #E-008","Exc #E-015","Exc #E-023"], result: "8/15 Ausnahmen nachverfolgt und geschlossen. 7 ohne dokumentierte Nachverfolgung." },
];

const POPULATIONS = [
  { id: "POP-1", name: "Systembasierte Ausschüttungen", count: 40, risk: "low", iks: true, sample: 8, findings: 1,
    sampleMethod: "Zufallsstichprobe", testedItems: ["TR-0003","TR-0009","TR-0012","TR-0018","TR-0024","TR-0031","TR-0037","TR-0044"], testResults: "7/8 ohne Beanstandung. 1 Fall mit verspäteter Buchung (TR-0024)." },
  { id: "POP-2", name: "Direktzahlungen ausserhalb System", count: 10, risk: "high", iks: false, sample: 10, findings: 4,
    sampleMethod: "Vollprüfung", testedItems: ["TR-0005","TR-0010","TR-0015","TR-0020","TR-0025","TR-0030","TR-0035","TR-0040","TR-0045","TR-0050"], testResults: "4 Fälle mit nicht autorisierter Direktzahlung. 6 Fälle nachträglich genehmigt." },
  { id: "POP-3", name: "Dokumentierte Governance", count: 38, risk: "low", iks: true, sample: 6, findings: 0,
    sampleMethod: "Zufallsstichprobe", testedItems: ["TR-0001","TR-0007","TR-0016","TR-0022","TR-0033","TR-0046"], testResults: "Alle 6 Fälle mit vollständiger Governance-Dokumentation." },
  { id: "POP-4", name: "Fehlende Governance-Nachweise", count: 12, risk: "high", iks: false, sample: 12, findings: 5,
    sampleMethod: "Vollprüfung", testedItems: ["TR-0004","TR-0008","TR-0012","TR-0016","TR-0020","TR-0024","TR-0028","TR-0032","TR-0036","TR-0040","TR-0044","TR-0048"], testResults: "5 Fälle ohne jeglichen Governance-Nachweis. 7 Fälle mit unvollständiger Dokumentation." },
  { id: "POP-5", name: "Liquide kotierte Wertschriften", count: 34, risk: "low", iks: true, sample: 7, findings: 1,
    sampleMethod: "Zufallsstichprobe", testedItems: ["TR-0002","TR-0011","TR-0019","TR-0026","TR-0034","TR-0041","TR-0049"], testResults: "6/7 mit korrekter Bewertung. 1 Fall mit Preisfeed-Abweichung (TR-0026, CHF 1'200 Differenz)." },
  { id: "POP-6", name: "Illiquide / schwer bewertbar", count: 10, risk: "high", iks: false, sample: 10, findings: 3,
    sampleMethod: "Vollprüfung", testedItems: ["TR-0005","TR-0010","TR-0015","TR-0020","TR-0025","TR-0030","TR-0035","TR-0040","TR-0045","TR-0050"], testResults: "3 Fälle ohne nachvollziehbare Bewertungsgrundlage. 7 Fälle mit externer Bewertung dokumentiert." },
  { id: "POP-7", name: "Pricefeeds + Reconciliation", count: 34, risk: "low", iks: true, sample: 5, findings: 0,
    sampleMethod: "Zufallsstichprobe", testedItems: ["TR-0006","TR-0014","TR-0023","TR-0038","TR-0047"], testResults: "Alle 5 Fälle mit vollständigem Pricefeed und abgestimmter Reconciliation." },
  { id: "POP-8", name: "Fehlende Werthaltigkeitsprüfung", count: 10, risk: "high", iks: false, sample: 10, findings: 4,
    sampleMethod: "Vollprüfung", testedItems: ["TR-0005","TR-0010","TR-0015","TR-0020","TR-0025","TR-0030","TR-0035","TR-0040","TR-0045","TR-0050"], testResults: "4 Fälle ohne dokumentierte Werthaltigkeitsprüfung. 6 mit minimaler Dokumentation." },
];

const fmt = n => n.toLocaleString("de-CH");
const pct = (a, b) => b === 0 ? 0 : Math.round((a / b) * 100);
const RISK = { high: { l: "Hoch", c: "#B83230", bg: "#FEF0EF", bd: "#E6B8B3" }, medium: { l: "Mittel", c: "#92710C", bg: "#FDF6E3", bd: "#E6D5A8" }, low: { l: "Tief", c: "#2D6A4F", bg: "#EDF5F0", bd: "#B3D4C2" } };
const STAT = { completed: { l: "Abgeschlossen", c: "#2D6A4F", bg: "#EDF5F0" }, "in-review": { l: "In Review", c: "#1A5276", bg: "#EBF5FB" }, "in-progress": { l: "In Bearbeitung", c: "#92710C", bg: "#FDF6E3" }, open: { l: "Offen", c: "#6B6B6B", bg: "#F4F4F4" } };
const EFF = { effective: { l: "Wirksam", c: "#2D6A4F", bg: "#EDF5F0" }, partial: { l: "Teilweise", c: "#92710C", bg: "#FDF6E3" } };
const STEPS = { independence: "Unabhängigkeit bestätigt", acceptance: "Mandatsannahme / Continuance", understanding: "Kunden- und Mandatsverständnis", scope: "Scope und Grundlagen", financials: "Jahresrechnung eingelesen", risk: "Risikoanalyse", materiality: "Materialität festgelegt", reliance: "Reliance-Entscheid", strategy: "Prüfungsstrategie", portfolioTests: "Portfolio-basierte Prüfungen", additionalTests: "Individuelle Zusatztests", exceptions: "Offene Punkte / Exceptions", conclusion: "Schlussbeurteilung", report: "Berichtserstellung", signoff: "Reviewer Sign-off" };

function computeRisk(t) {
  let ih = 1, ihF = [], ctF = [];
  if (t.assetType === "illiquid") { ih += 2; ihF.push("Illiquide Vermögenswerte — erhöhtes Bewertungsrisiko"); }
  if (t.distributions > 4) { ih += 1; ihF.push("Überdurchschnittliche Ausschüttungsfrequenz"); }
  if (t.totalAssets > 5000000) { ih += 1; ihF.push("Hohes Vermögensvolumen (> CHF 5 Mio.)"); }
  if (!ihF.length) ihF.push("Standardrisikoprofil — keine besonderen Faktoren");
  const iL = ih >= 4 ? "high" : ih >= 2 ? "medium" : "low";
  let ct = 0;
  if (!t.hasSystem) { ct += 2; ctF.push("Keine systembasierte Initiierung"); }
  if (!t.hasGovernance) { ct += 2; ctF.push("Fehlende Governance-Freigabe"); }
  if (!t.hasCompliance) { ct += 1; ctF.push("Compliance-Prüfung fehlt"); }
  if (!t.hasPricefeed) { ct += 1; ctF.push("Keine Pricefeeds"); }
  if (!t.hasReconciliation) { ct += 1; ctF.push("Keine Reconciliation"); }
  if (!t.hasValuation) { ct += 1; ctF.push("Werthaltigkeitsdokumentation fehlt"); }
  if (!ctF.length) ctF.push("Alle Kontrollen implementiert und wirksam");
  const cL = ct >= 4 ? "high" : ct >= 2 ? "medium" : "low";
  const map = { "high-high":"high","high-medium":"high","high-low":"medium","medium-high":"high","medium-medium":"medium","medium-low":"low","low-high":"medium","low-medium":"low","low-low":"low" };
  const rL = map[`${iL}-${cL}`];
  const rel = cL !== "high" && iL !== "high";
  const strat = rL === "high" ? "Erweiterte Einzelprüfung + volle Stichprobe" : rL === "medium" ? "Reduzierte Stichprobe + gezielte Einzeltests" : "IKS-Reliance + minimale Portfolio-Stichprobe";
  return { iL, cL, rL, ihF, ctF, rel, strat };
}

function computeSample(pop, iks, exc) {
  let base = pop <= 10 ? pop : pop <= 50 ? Math.ceil(pop*.25) : pop <= 200 ? Math.ceil(pop*.15) : Math.ceil(pop*.10);
  return Math.min(pop, Math.max(1, Math.ceil(base * (iks === "strong" ? .6 : iks === "partial" ? 1 : 1.5) * (exc > .1 ? 1.5 : exc > .05 ? 1.2 : 1))));
}

const Pill = ({ children, c, bg }) => <span style={{ display: "inline-flex", padding: "2px 9px", borderRadius: 100, fontSize: 11, fontWeight: 500, background: bg, color: c, letterSpacing: "0.01em", whiteSpace: "nowrap" }}>{children}</span>;

const css = ``;

const thS = { fontSize: 10.5, fontWeight: 600, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: "0.07em", padding: "10px 12px", textAlign: "left", borderBottom: "1px solid var(--ln)", background: "var(--sf2)" };
const tdS = { fontSize: 13, padding: "10px 12px", borderBottom: "0.5px solid var(--ln)", verticalAlign: "middle" };
const cardS = { background: "var(--sf)", border: "0.5px solid var(--ln)", borderRadius: "var(--rl)", padding: "20px 24px", marginBottom: 12 };
const metricS = { background: "var(--sf)", border: "0.5px solid var(--ln)", borderRadius: "var(--r)", padding: "16px 20px" };
const btnS = { display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", fontSize: 12, fontWeight: 500, fontFamily: "var(--f)", borderRadius: "var(--r)", cursor: "pointer", border: "0.5px solid var(--ln2)", background: "var(--sf)", color: "var(--ink2)", transition: "all .15s" };
const secLabel = { fontSize: 10.5, fontWeight: 600, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 };
const Bar = ({ v, max, c }) => <div style={{ height: 4, background: "var(--sf3)", borderRadius: 2, overflow: "hidden", flex: 1 }}><div style={{ height: "100%", width: `${pct(v,max)}%`, background: c || "var(--ac)", borderRadius: 2, transition: "width .4s" }}/></div>;

function SignatureLine({ label, name, role, signed, date }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ borderBottom: `1.5px solid ${signed ? "var(--gn)" : "var(--ln2)"}`, height: 48, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 6, marginBottom: 6 }}>
        {signed ? <span style={{ fontFamily: "var(--m)", fontSize: 14, color: "var(--gn)", fontStyle: "italic", letterSpacing: "0.05em" }}>{name}</span> : <span style={{ fontSize: 11, color: "var(--ink4)" }}>Ausstehend</span>}
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 11, color: "var(--ink3)" }}>{role}</div>
        {signed && <div style={{ fontSize: 10, color: "var(--gn)", fontFamily: "var(--m)", marginTop: 2 }}>{date}</div>}
      </div>
    </div>
  );
}

function DocHeader({ title, subtitle, trustName, trustId }) {
  return (
    <div style={{ borderBottom: "2px solid var(--ac)", paddingBottom: 16, marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: "var(--ac)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Muster Treuhand AG · Vaduz</div>
          <div style={{ fontSize: 20, fontWeight: 400, color: "var(--ink)" }}>{title}</div>
          {subtitle && <div style={{ fontSize: 13, color: "var(--ink3)", marginTop: 4 }}>{subtitle}</div>}
        </div>
        <div style={{ textAlign: "right" }}><div style={{ fontSize: 13, fontWeight: 500 }}>{trustName}</div><div style={{ fontSize: 11, fontFamily: "var(--m)", color: "var(--ink4)" }}>{trustId}</div></div>
      </div>
    </div>
  );
}

// ─── Sidebar ────────────────────────────────────────
function Sidebar({ screen, setScreen, selectedTrust }) {
  const trust = DEMO_TRUSTS.find(t => t.id === selectedTrust);
  const items = [
    { k: "dashboard", i: "◫", l: "Dashboard" },
    { k: "trustee", i: "⊞", l: "Trustee IKS" },
    { k: "portfolio", i: "⊟", l: "Portfolio" },
    { k: "exceptions", i: "◉", l: "Exceptions" },
    { k: "mandate", i: "▤", l: "Mandatsakte" },
    { k: "trail", i: "☰", l: "Audit Trail" },
  ];
  const active = k => screen === k;
  return (
    <aside style={{ width: 210, background: "var(--sf)", borderRight: "0.5px solid var(--ln)", display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh" }}>
      <div style={{ padding: "22px 18px 18px", borderBottom: "0.5px solid var(--ln)" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ac)", letterSpacing: "0.06em" }}>TRUST AUDIT</div>
        <div style={{ fontSize: 10, color: "var(--ink4)", marginTop: 3, letterSpacing: "0.04em" }}>Liechtenstein · GJ 2025</div>
      </div>
      <nav style={{ padding: "10px 8px", flex: 1 }}>
        {items.map(it => (
          <button key={it.k} onClick={() => setScreen(it.k)} style={{
            display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "8px 12px", marginBottom: 1,
            border: "none", borderRadius: "var(--r)", background: active(it.k) ? "var(--ac2)" : "transparent",
            color: active(it.k) ? "var(--ac)" : "var(--ink2)", fontSize: 13, fontWeight: active(it.k) ? 500 : 400,
            fontFamily: "var(--f)", cursor: "pointer", textAlign: "left", transition: "all .15s"
          }}>
            <span style={{ fontSize: 13, opacity: .6, width: 18, textAlign: "center" }}>{it.i}</span>{it.l}
          </button>
        ))}
        {/* Current mandate indicator */}
        {trust && (
          <div style={{ margin: "12px 4px 0", padding: "10px 12px", background: "var(--sf2)", borderRadius: "var(--r)", border: "0.5px solid var(--ln)" }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>Aktives Mandat</div>
            <div style={{ fontSize: 12, fontWeight: 500, color: "var(--ink)" }}>{trust.name}</div>
            <div style={{ fontSize: 10, fontFamily: "var(--m)", color: "var(--ink4)", marginTop: 2 }}>{trust.id} · {RISK[trust.riskCat].l}</div>
          </div>
        )}
      </nav>
      <div style={{ padding: "14px 18px", borderTop: "0.5px solid var(--ln)", fontSize: 11, color: "var(--ink4)" }}>
        <div style={{ fontWeight: 500, color: "var(--ink3)" }}>S. Brunner</div>
        <div style={{ marginTop: 1 }}>Manager · Sync 14:32</div>
      </div>
    </aside>
  );
}

// ─── Dashboard ──────────────────────────────────────
function Dashboard({ onSelect }) {
  const co = DEMO_TRUSTS.filter(t => t.status === "completed").length;
  const rv = DEMO_TRUSTS.filter(t => t.status === "in-review").length;
  const ip = DEMO_TRUSTS.filter(t => t.status === "in-progress").length;
  const op = DEMO_TRUSTS.filter(t => t.status === "open").length;
  const hi = DEMO_TRUSTS.filter(t => t.riskCat === "high").length;
  const exc = DEMO_TRUSTS.filter(t => !t.hasSystem || !t.hasGovernance).length;
  const [fil, setFil] = useState("all");
  const list = fil === "all" ? DEMO_TRUSTS : DEMO_TRUSTS.filter(t => t.status === fil);

  return (
    <div className="au">
      <div style={{ marginBottom: 28 }}><h1 style={{ fontSize: 24, fontWeight: 300, letterSpacing: "-.02em" }}>Audit-Übersicht</h1><p style={{ fontSize: 13, color: "var(--ink3)", marginTop: 4 }}>Geschäftsjahr 2025 · 2'000 Mandate · Stand 16. April 2026</p></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10, marginBottom: 16 }}>
        {[{ l:"Mandate",v:"2'000",s:`${DEMO_TRUSTS.length} geladen`,a:"var(--ac)" },{ l:"Abgeschlossen",v:co,s:`${pct(co,DEMO_TRUSTS.length)}%`,a:"var(--gn)" },{ l:"In Review",v:rv,a:"var(--bl)" },{ l:"Hohes Risiko",v:hi,a:"var(--am)" },{ l:"Exceptions",v:exc,a:"var(--rd)" }].map((m,i) => (
          <div key={i} style={{ ...metricS, borderTop: `2.5px solid ${m.a}` }}><div style={{ fontSize: 10.5, fontWeight: 500, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>{m.l}</div><div style={{ fontSize: 28, fontWeight: 300 }}>{m.v}</div>{m.s && <div style={{ fontSize: 11, color: "var(--ink4)", marginTop: 3 }}>{m.s}</div>}</div>
        ))}
      </div>
      <div style={cardS}>
        <div style={{ display: "flex", gap: 2, height: 8, borderRadius: 4, overflow: "hidden", marginBottom: 10 }}>
          {[{ c:"var(--gn)",w:co },{ c:"var(--bl)",w:rv },{ c:"var(--am)",w:ip },{ c:"var(--ln)",w:op }].map((s,i) => <div key={i} style={{ flex: s.w||.001, background: s.c, transition: "flex .4s" }} />)}
        </div>
        <div style={{ display: "flex", gap: 20, fontSize: 11, color: "var(--ink3)" }}>
          {[{ c:"var(--gn)",n:co,l:"Abgeschlossen" },{ c:"var(--bl)",n:rv,l:"In Review" },{ c:"var(--am)",n:ip,l:"In Bearbeitung" },{ c:"var(--ln2)",n:op,l:"Offen" }].map((s,i) => <span key={i} style={{ display:"flex",alignItems:"center",gap:5 }}><span style={{ width:8,height:8,borderRadius:2,background:s.c }} />{s.l} <span style={{ fontFamily:"var(--m)",fontWeight:500 }}>{s.n}</span></span>)}
        </div>
      </div>
      <div style={cardS}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div><div style={{ fontSize: 14, fontWeight: 500 }}>Risiko-Heatmap</div></div>
          <div style={{ display: "flex", gap: 14, fontSize: 11, color: "var(--ink3)" }}>{Object.entries(RISK).map(([k,v]) => <span key={k} style={{ display:"flex",alignItems:"center",gap:4 }}><span style={{ width:10,height:10,borderRadius:2,background:v.bg,border:`1px solid ${v.bd}` }} />{v.l}</span>)}</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {DEMO_TRUSTS.map(t => <div key={t.id} onClick={() => onSelect(t.id)} title={`${t.name} · ${RISK[t.riskCat].l}`} style={{ width:15,height:15,borderRadius:2,background:RISK[t.riskCat].bg,border:`0.5px solid ${RISK[t.riskCat].bd}`,cursor:"pointer",transition:"transform .12s" }} onMouseEnter={e=>{e.target.style.transform="scale(1.5)";e.target.style.zIndex=2}} onMouseLeave={e=>{e.target.style.transform="scale(1)";e.target.style.zIndex=0}} />)}
        </div>
      </div>
      <div style={cardS}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 500 }}>Mandate</div>
          <div style={{ display: "flex", gap: 3 }}>{[["all","Alle"],["completed","Abgeschl."],["in-review","Review"],["in-progress","Bearb."],["open","Offen"]].map(([k,l]) => <button key={k} onClick={() => setFil(k)} style={{ ...btnS, padding:"4px 10px",fontSize:11,background:fil===k?"var(--ac2)":"var(--sf)",color:fil===k?"var(--ac)":"var(--ink3)",borderColor:fil===k?"var(--ac)":"var(--ln)" }}>{l}</button>)}</div>
        </div>
        <div style={{ borderRadius: "var(--r)", border: "0.5px solid var(--ln)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><th style={{ ...thS,width:70 }}>ID</th><th style={thS}>Name</th><th style={{ ...thS,width:70 }}>Risiko</th><th style={{ ...thS,width:110 }}>Status</th><th style={{ ...thS,width:150 }}>Fortschritt</th><th style={{ ...thS,width:110,textAlign:"right" }}>Vermögen</th></tr></thead>
            <tbody>{list.slice(0,20).map(t => (
              <tr key={t.id} onClick={() => onSelect(t.id)} style={{ cursor:"pointer" }} onMouseEnter={e=>e.currentTarget.style.background="var(--ac2)"} onMouseLeave={e=>e.currentTarget.style.background=""}>
                <td style={tdS}><span style={{ fontFamily:"var(--m)",fontSize:11,color:"var(--ink3)" }}>{t.id}</span></td>
                <td style={{ ...tdS,fontWeight:450 }}>{t.name}</td>
                <td style={tdS}><Pill c={RISK[t.riskCat].c} bg={RISK[t.riskCat].bg}>{RISK[t.riskCat].l}</Pill></td>
                <td style={tdS}><Pill c={STAT[t.status].c} bg={STAT[t.status].bg}>{STAT[t.status].l}</Pill></td>
                <td style={tdS}><div style={{ display:"flex",alignItems:"center",gap:8 }}><Bar v={t.completedSteps} max={15} c={STAT[t.status].c} /><span style={{ fontFamily:"var(--m)",fontSize:10,color:"var(--ink4)",minWidth:28,textAlign:"right" }}>{t.completedSteps}/15</span></div></td>
                <td style={{ ...tdS,textAlign:"right",fontFamily:"var(--m)",fontSize:12,color:"var(--ink2)" }}>CHF {fmt(t.totalAssets)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Trustee IKS (with sample documentation) ────────
function TrusteeIKS() {
  const eff = IKS_CONTROLS.filter(c => c.eff === "effective").length;
  const par = IKS_CONTROLS.filter(c => c.eff === "partial").length;
  const texc = IKS_CONTROLS.reduce((a,c) => a + c.exc, 0);
  const ok = eff >= 5;
  const areas = [...new Set(IKS_CONTROLS.map(c => c.area))];
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="au">
      <div style={{ marginBottom: 28 }}><h1 style={{ fontSize: 24, fontWeight: 300, letterSpacing: "-.02em" }}>Trustee control center</h1><p style={{ fontSize: 13, color: "var(--ink3)", marginTop: 4 }}>Zentrale IKS-Prüfung · Prüfungsdokumentation · Reliance-Entscheidung</p></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
        {[{ l:"Kontrollen",v:IKS_CONTROLS.length,a:"var(--ac)" },{ l:"Wirksam",v:eff,s:`${pct(eff,IKS_CONTROLS.length)}%`,a:"var(--gn)" },{ l:"Teilweise",v:par,a:"var(--am)" },{ l:"Exceptions",v:texc,a:"var(--rd)" }].map((m,i) => (
          <div key={i} style={{ ...metricS, borderTop: `2.5px solid ${m.a}` }}><div style={{ fontSize:10.5,fontWeight:500,color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:6 }}>{m.l}</div><div style={{ fontSize:28,fontWeight:300 }}>{m.v}</div>{m.s && <div style={{ fontSize:11,color:"var(--ink4)",marginTop:3 }}>{m.s}</div>}</div>
        ))}
      </div>
      <div style={{ ...cardS, borderLeft:`3px solid ${ok?"var(--gn)":"var(--rd)"}`, borderRadius:"0 var(--rl) var(--rl) 0", display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ width:36,height:36,borderRadius:"50%",background:ok?"var(--gn2)":"var(--rd2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:ok?"var(--gn)":"var(--rd)",flexShrink:0 }}>{ok?"✓":"✗"}</div>
        <div><div style={{ fontWeight:500,fontSize:15,color:ok?"var(--gn)":"var(--rd)" }}>{ok?"Reliance grundsätzlich zulässig":"Eingeschränkte Reliance"}</div><div style={{ fontSize:12,color:"var(--ink3)",marginTop:3 }}>{eff}/{IKS_CONTROLS.length} Kontrollen wirksam · Exception Rate: {pct(texc, DEMO_TRUSTS.length * IKS_CONTROLS.length)}%</div></div>
      </div>

      {areas.map(area => (
        <div key={area} style={cardS}>
          <div style={secLabel}>{area}</div>
          {IKS_CONTROLS.filter(c => c.area === area).map(c => (
            <div key={c.id} style={{ marginBottom: 8 }}>
              {/* Control row */}
              <div onClick={() => setExpanded(expanded === c.id ? null : c.id)} style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:expanded===c.id?"var(--sf2)":"transparent",borderRadius:"var(--r)",cursor:"pointer",transition:"background .15s",border:"0.5px solid var(--ln)" }}>
                <span style={{ fontFamily:"var(--m)",fontSize:11,color:"var(--ink4)",width:24 }}>{c.id}</span>
                <span style={{ flex:1,fontSize:13 }}>{c.question}</span>
                <Pill c={c.impl?"var(--gn)":"var(--am)"} bg={c.impl?"var(--gn2)":"var(--am2)"}>{c.impl?"Impl.":"Teilw."}</Pill>
                <Pill c={EFF[c.eff].c} bg={EFF[c.eff].bg}>{EFF[c.eff].l}</Pill>
                <span style={{ fontFamily:"var(--m)",fontSize:11,color:"var(--ink4)" }}>{c.exc} Exc.</span>
                <span style={{ fontSize:11,color:"var(--ink4)",transition:"transform .2s",transform:expanded===c.id?"rotate(180deg)":"" }}>▾</span>
              </div>
              {/* Expanded: test documentation */}
              {expanded === c.id && (
                <div style={{ margin:"0 0 0 0",padding:"16px 20px",background:"var(--sf2)",borderRadius:"0 0 var(--r) var(--r)",borderTop:"none",border:"0.5px solid var(--ln)",borderTop:"none" }}>
                  <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:14 }}>
                    <div><div style={{ fontSize:10,fontWeight:600,color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:4 }}>Prüfungsmethode</div><div style={{ fontSize:13,fontWeight:450 }}>{c.testMethod}</div></div>
                    <div><div style={{ fontSize:10,fontWeight:600,color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:4 }}>Stichprobengrösse</div><div style={{ fontSize:13,fontWeight:450 }}>{c.sampleSize} Fälle</div></div>
                    <div><div style={{ fontSize:10,fontWeight:600,color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:4 }}>Population</div><div style={{ fontSize:13,fontWeight:450 }}>{c.sampleFrom}</div></div>
                  </div>
                  <div style={{ marginBottom:12 }}>
                    <div style={{ fontSize:10,fontWeight:600,color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:6 }}>Geprüfte Stichproben</div>
                    <div style={{ display:"flex",flexWrap:"wrap",gap:4 }}>
                      {c.testedItems.map((item,i) => <span key={i} style={{ fontFamily:"var(--m)",fontSize:10.5,padding:"3px 8px",background:"var(--sf)",border:"0.5px solid var(--ln)",borderRadius:4 }}>{item}</span>)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize:10,fontWeight:600,color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:4 }}>Ergebnis</div>
                    <div style={{ fontSize:13,color:"var(--ink2)",padding:"8px 12px",background:c.eff==="effective"?"var(--gn2)":"var(--am2)",borderRadius:"var(--r)" }}>{c.result}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}

      <div style={cardS}>
        <div style={secLabel}>Risikologik-Ableitung</div>
        <div style={{ display:"grid",gap:4 }}>
          {IKS_CONTROLS.filter(c => c.eff !== "effective").map(c => <div key={c.id} style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 14px",background:"var(--rd2)",borderRadius:"var(--r)",fontSize:12 }}><span style={{ color:"var(--rd)",fontWeight:600,fontSize:10,letterSpacing:".04em" }}>RISIKO ↑</span><span style={{ color:"var(--ink2)" }}>{c.question} — nur {EFF[c.eff].l.toLowerCase()}, {c.exc} Exceptions</span></div>)}
          {IKS_CONTROLS.filter(c => c.eff === "effective").map(c => <div key={c.id} style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 14px",background:"var(--gn2)",borderRadius:"var(--r)",fontSize:12 }}><span style={{ color:"var(--gn)",fontWeight:600,fontSize:10,letterSpacing:".04em" }}>RISIKO ↓</span><span style={{ color:"var(--ink2)" }}>{c.question} — wirksam, Reliance möglich</span></div>)}
        </div>
      </div>
    </div>
  );
}

// ─── Portfolio (with sample documentation) ──────────
function Portfolio() {
  const [iks, setIks] = useState("strong");
  const [exc, setExc] = useState(0.05);
  const [pop, setPop] = useState(100);
  const [expanded, setExpanded] = useState(null);
  const tf = POPULATIONS.reduce((a,p) => a + p.findings, 0);

  return (
    <div className="au">
      <div style={{ marginBottom: 28 }}><h1 style={{ fontSize: 24, fontWeight: 300 }}>Portfolio testing</h1><p style={{ fontSize: 13, color: "var(--ink3)", marginTop: 4 }}>Populationen · Stichproben · Prüfungsdokumentation</p></div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16 }}>
        {[{ l:"Populationen",v:POPULATIONS.length,a:"var(--ac)" },{ l:"Stichproben",v:POPULATIONS.reduce((a,p)=>a+p.sample,0),a:"var(--bl)" },{ l:"Findings",v:tf,a:"var(--rd)" },{ l:"IKS-abgedeckt",v:`${POPULATIONS.filter(p=>p.iks).length}/${POPULATIONS.length}`,a:"var(--gn)" }].map((m,i) => (
          <div key={i} style={{ ...metricS, borderTop:`2.5px solid ${m.a}` }}><div style={{ fontSize:10.5,fontWeight:500,color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:6 }}>{m.l}</div><div style={{ fontSize:28,fontWeight:300 }}>{m.v}</div></div>
        ))}
      </div>

      <div style={cardS}>
        <div style={secLabel}>Populationen, Stichproben und Prüfungsdokumentation</div>
        {POPULATIONS.map(p => (
          <div key={p.id} style={{ marginBottom: 6 }}>
            <div onClick={() => setExpanded(expanded === p.id ? null : p.id)} style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:expanded===p.id?"var(--sf2)":"transparent",borderRadius:"var(--r)",cursor:"pointer",border:"0.5px solid var(--ln)",transition:"background .15s" }}>
              <span style={{ fontFamily:"var(--m)",fontSize:10,color:"var(--ink4)",width:42 }}>{p.id}</span>
              <span style={{ flex:1,fontSize:13,fontWeight:450 }}>{p.name}</span>
              <span style={{ fontFamily:"var(--m)",fontSize:11,color:"var(--ink3)",width:36,textAlign:"right" }}>{p.count}</span>
              <Pill c={RISK[p.risk].c} bg={RISK[p.risk].bg}>{RISK[p.risk].l}</Pill>
              <span style={{ width:8,height:8,borderRadius:"50%",background:p.iks?"var(--gn)":"var(--rd)" }} />
              <span style={{ fontFamily:"var(--m)",fontSize:11,color:"var(--ink3)" }}>{p.sample} ({pct(p.sample,p.count)}%)</span>
              {p.findings > 0 ? <Pill c="var(--rd)" bg="var(--rd2)">{p.findings} F</Pill> : <span style={{ color:"var(--ink4)",fontSize:11 }}>0 F</span>}
              <span style={{ fontSize:11,color:"var(--ink4)",transition:"transform .2s",transform:expanded===p.id?"rotate(180deg)":"" }}>▾</span>
            </div>
            {expanded === p.id && (
              <div style={{ padding:"16px 20px",background:"var(--sf2)",borderRadius:"0 0 var(--r) var(--r)",border:"0.5px solid var(--ln)",borderTop:"none" }}>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:14 }}>
                  <div><div style={{ fontSize:10,fontWeight:600,color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:4 }}>Methode</div><div style={{ fontSize:13,fontWeight:450 }}>{p.sampleMethod}</div></div>
                  <div><div style={{ fontSize:10,fontWeight:600,color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:4 }}>Stichprobe</div><div style={{ fontSize:13,fontWeight:450 }}>{p.sample} von {p.count} ({pct(p.sample,p.count)}%)</div></div>
                  <div><div style={{ fontSize:10,fontWeight:600,color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:4 }}>Findings</div><div style={{ fontSize:13,fontWeight:450,color:p.findings>0?"var(--rd)":"var(--gn)" }}>{p.findings} Beanstandungen</div></div>
                </div>
                <div style={{ marginBottom:12 }}>
                  <div style={{ fontSize:10,fontWeight:600,color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:6 }}>Geprüfte Mandate</div>
                  <div style={{ display:"flex",flexWrap:"wrap",gap:4 }}>
                    {p.testedItems.map((item,i) => <span key={i} style={{ fontFamily:"var(--m)",fontSize:10.5,padding:"3px 8px",background:"var(--sf)",border:"0.5px solid var(--ln)",borderRadius:4 }}>{item}</span>)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize:10,fontWeight:600,color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:4 }}>Ergebnis / Feststellungen</div>
                  <div style={{ fontSize:13,color:"var(--ink2)",padding:"8px 12px",background:p.findings===0?"var(--gn2)":"var(--am2)",borderRadius:"var(--r)" }}>{p.testResults}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={cardS}>
        <div style={secLabel}>Sampling-Engine</div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1.2fr auto",gap:20,alignItems:"end" }}>
          <div><div style={{ fontSize:11,color:"var(--ink3)",marginBottom:6 }}>IKS-Stärke</div><select value={iks} onChange={e=>setIks(e.target.value)} style={{ width:"100%",padding:"7px 10px",fontSize:12,border:"0.5px solid var(--ln2)",borderRadius:"var(--r)",background:"var(--sf)",color:"var(--ink)",fontFamily:"var(--f)" }}><option value="strong">Stark</option><option value="partial">Teilweise</option><option value="weak">Schwach</option></select></div>
          <div><div style={{ fontSize:11,color:"var(--ink3)",marginBottom:6 }}>Exception Rate</div><select value={exc} onChange={e=>setExc(parseFloat(e.target.value))} style={{ width:"100%",padding:"7px 10px",fontSize:12,border:"0.5px solid var(--ln2)",borderRadius:"var(--r)",background:"var(--sf)",color:"var(--ink)",fontFamily:"var(--f)" }}><option value={0.02}>Tief</option><option value={0.05}>Mittel</option><option value={0.15}>Hoch</option></select></div>
          <div><div style={{ fontSize:11,color:"var(--ink3)",marginBottom:6 }}>Population: {pop}</div><input type="range" min="5" max="500" step="5" value={pop} onChange={e=>setPop(Number(e.target.value))} style={{ width:"100%",accentColor:"var(--ac)" }} /></div>
          <div style={{ textAlign:"center",minWidth:90 }}><div style={{ fontSize:10,color:"var(--ink4)",marginBottom:2 }}>Empfohlen</div><div style={{ fontSize:36,fontWeight:300,color:"var(--ac)" }}>{computeSample(pop,iks,exc)}</div></div>
        </div>
      </div>
    </div>
  );
}

// ─── Exceptions ─────────────────────────────────────
function Exceptions() {
  const cats = [
    { t:"Direktzahlungen ausserhalb System", items: DEMO_TRUSTS.filter(t => !t.hasSystem), d:"Keine systembasierte Initiierung" },
    { t:"Fehlende Governance", items: DEMO_TRUSTS.filter(t => !t.hasGovernance), d:"Stiftungsrat hat nicht Stellung genommen" },
    { t:"Fehlende Compliance", items: DEMO_TRUSTS.filter(t => !t.hasCompliance), d:"Auszahlungen nicht durch Compliance geprüft" },
    { t:"Fehlende Werthaltigkeitsdoku", items: DEMO_TRUSTS.filter(t => !t.hasValuation), d:"Keine dokumentierte Bewertungsgrundlage" },
  ];
  return (
    <div className="au">
      <div style={{ marginBottom: 28 }}><h1 style={{ fontSize: 24, fontWeight: 300 }}>Exceptions center</h1><p style={{ fontSize: 13, color: "var(--ink3)", marginTop: 4 }}>Kontrolllücken · Zusätzliche Einzelprüfung</p></div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16 }}>
        {cats.map(c => <div key={c.t} style={{ ...metricS, borderTop:"2.5px solid var(--rd)" }}><div style={{ fontSize:10.5,fontWeight:500,color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:6 }}>{c.t}</div><div style={{ fontSize:28,fontWeight:300 }}>{c.items.length}</div></div>)}
      </div>
      {cats.map(cat => (
        <div key={cat.t} style={cardS}>
          <div style={{ fontWeight:500,fontSize:14,marginBottom:4 }}>{cat.t}</div>
          <div style={{ fontSize:12,color:"var(--ink3)",marginBottom:10 }}>{cat.d}</div>
          <div style={{ display:"flex",flexWrap:"wrap",gap:4 }}>{cat.items.map(t => <span key={t.id} style={{ fontFamily:"var(--m)",fontSize:10.5,padding:"3px 8px",background:"var(--rd2)",color:"var(--rd)",borderRadius:4,fontWeight:500 }}>{t.id}</span>)}</div>
          <div style={{ marginTop:10,fontSize:11,color:"var(--ink4)",fontStyle:"italic" }}>→ Erweiterte Einzelprüfung pro Mandat</div>
        </div>
      ))}
    </div>
  );
}

// ─── Mandatsakte ────────────────────────────────────
function Mandate({ id }) {
  const trust = DEMO_TRUSTS.find(t => t.id === id) || DEMO_TRUSTS[0];
  const risk = computeRisk(trust);
  const [tab, setTab] = useState("overview");
  const [emailSent, setEmailSent] = useState(false);
  const [clientSig, setClientSig] = useState(false);
  const [vollstSigned, setVollstSigned] = useState(false);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [expandedTest, setExpandedTest] = useState(null);
  const fin = Object.values(trust.steps).every(Boolean);
  const tabs = [["overview","Übersicht"],["checklist","Checkliste"],["acceptance","Annahme"],["vollst","Vollständigkeit"],["reliance","Reliance"],["risk","Risiko"],["pruefung","Prüfung"],["report","Bericht"]];

  // Prüfungs-Workbench state
  const needsExtendedTesting = risk.rL === "high" || !risk.rel;
  const [testItems, setTestItems] = useState(() => {
    const areas = [];
    // Wertschriften tests
    areas.push({
      id: "WS", area: "Wertschriften / Vermögenswerte", tests: [
        { id: "WS-1", name: "Abgleich Wertschriftenverzeichnis mit Depotauszug", status: trust.completedSteps > 8 ? "done" : "open", method: "Einzelprüfung", docs: trust.completedSteps > 8 ? ["Depotauszug UBS 31.12.2025", "Wertschriftenverzeichnis Export"] : [], result: trust.completedSteps > 8 ? "Abgleich stimmt überein. Keine Differenzen über Materialität." : "", user: "M. Keller", role: "Senior", date: "10.04.2026" },
        { id: "WS-2", name: "Bewertung: Pricefeed-Abgleich kotierte Titel", status: trust.hasPricefeed && trust.completedSteps > 8 ? "done" : "open", method: "Systemabgleich + Stichprobe", docs: trust.hasPricefeed ? ["Bloomberg Pricefeed 31.12.2025", "Kursvergleich 5 grösste Positionen"] : [], result: trust.hasPricefeed ? "Kurse stimmen mit Bloomberg überein. Max. Abweichung CHF 45." : "", user: "A. Müller", role: "Assistant", date: "11.04.2026" },
        { id: "WS-3", name: "Bewertung: illiquide / nicht kotierte Positionen", status: trust.assetType === "illiquid" ? (trust.hasValuation ? "finding" : "open") : "na", method: "Einzelprüfung Bewertungsgutachten", docs: trust.hasValuation ? ["Bewertungsgutachten PE-Beteiligung", "NAV-Statement Immobilienfonds"] : [], result: trust.assetType === "illiquid" && trust.hasValuation ? "Bewertung plausibel, aber Gutachten > 6 Monate alt." : "", user: "M. Keller", role: "Senior", date: "12.04.2026" },
        { id: "WS-4", name: "Reconciliation: Portfolio vs. Buchhaltung", status: trust.hasReconciliation && trust.completedSteps > 8 ? "done" : "open", method: "Vollabgleich", docs: trust.hasReconciliation ? ["Recon-Report 31.12.2025", "Buchhaltungsexport GL"] : [], result: trust.hasReconciliation ? "Vollständig abgestimmt. Keine offenen Posten." : "", user: "A. Müller", role: "Assistant", date: "09.04.2026" },
      ]
    });
    // Ausschüttungen tests
    areas.push({
      id: "AS", area: "Ausschüttungen / Trustgelder", tests: [
        { id: "AS-1", name: "Prüfung Ausschüttungen gegen Trust Deed", status: trust.completedSteps > 8 ? "done" : "open", method: "Einzelprüfung aller Ausschüttungen", docs: trust.completedSteps > 8 ? ["Trust Deed Auszug", `${trust.distributions} Zahlungsbelege`] : [], result: trust.completedSteps > 8 ? `${trust.distributions} Ausschüttungen geprüft. Alle in Übereinstimmung mit Trust Deed.` : "", user: "M. Keller", role: "Senior", date: "11.04.2026" },
        { id: "AS-2", name: "Governance-Freigaben zu Ausschüttungen", status: trust.hasGovernance && trust.completedSteps > 8 ? "done" : trust.hasGovernance ? "open" : "finding", method: "Prüfung Protokolle und Freigaben", docs: trust.hasGovernance ? ["Stiftungsratsprotokoll Q4", "Freigabe-Workflow Screenshot"] : [], result: trust.hasGovernance ? "Alle Ausschüttungen mit dokumentierter Governance-Freigabe." : "FINDING: Keine Governance-Freigabe dokumentiert.", user: "S. Brunner", role: "Manager", date: "12.04.2026" },
        { id: "AS-3", name: "Compliance-Prüfung der Auszahlungen", status: trust.hasCompliance && trust.completedSteps > 8 ? "done" : trust.hasCompliance ? "open" : "finding", method: "Stichprobe Compliance-Logs", docs: trust.hasCompliance ? ["Compliance-Log Auszug"] : [], result: trust.hasCompliance ? "Compliance hat alle Auszahlungen geprüft und freigegeben." : "FINDING: Compliance-Prüfung fehlt für dieses Mandat.", user: "C. Fischer", role: "Compliance", date: "13.04.2026" },
        { id: "AS-4", name: "Prüfung auf Direktzahlungen ausserhalb System", status: trust.hasSystem ? (trust.completedSteps > 8 ? "done" : "open") : "finding", method: "Bankjournal-Review", docs: trust.hasSystem ? ["Bankjournal 2025 komplett"] : ["Bankjournal 2025 — Direktzahlungen identifiziert"], result: trust.hasSystem ? "Keine Direktzahlungen ausserhalb des Systems identifiziert." : `FINDING: ${Math.floor(Math.random()*3)+1} Direktzahlung(en) ohne Systeminitiierung.`, user: "M. Keller", role: "Senior", date: "14.04.2026" },
      ]
    });
    return areas;
  });

  // exceptions for this mandate
  const mandateExc = [];
  if (!trust.hasSystem) mandateExc.push("Direktzahlungen ausserhalb System");
  if (!trust.hasGovernance) mandateExc.push("Fehlende Governance-Nachweise");
  if (!trust.hasCompliance) mandateExc.push("Fehlende Compliance-Prüfung");
  if (!trust.hasValuation) mandateExc.push("Fehlende Werthaltigkeitsdoku");

  return (
    <div className="au">
      <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:6 }}>
        <div style={{ flex:1 }}><div style={{ display:"flex",alignItems:"baseline",gap:10 }}><h1 style={{ fontSize:20,fontWeight:400 }}>{trust.name}</h1><span style={{ fontFamily:"var(--m)",fontSize:12,color:"var(--ink4)" }}>{trust.id}</span></div></div>
        <Pill c={STAT[trust.status].c} bg={STAT[trust.status].bg}>{STAT[trust.status].l}</Pill>
        <Pill c={RISK[trust.riskCat].c} bg={RISK[trust.riskCat].bg}>Risiko {RISK[trust.riskCat].l}</Pill>
      </div>
      <div style={{ display:"flex",gap:0,borderBottom:"0.5px solid var(--ln)",marginBottom:20,flexWrap:"wrap" }}>
        {tabs.map(([k,l]) => <button key={k} onClick={()=>setTab(k)} style={{ padding:"10px 14px",fontSize:12,fontWeight:tab===k?500:400,fontFamily:"var(--f)",color:tab===k?"var(--ac)":"var(--ink3)",background:"none",border:"none",borderBottom:tab===k?"2px solid var(--ac)":"2px solid transparent",cursor:"pointer" }}>{l}</button>)}
      </div>

      {tab === "overview" && <>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16 }}>
          {[{ l:"Vermögen",v:`CHF ${fmt(trust.totalAssets)}`,a:"var(--ac)" },{ l:"Materialität",v:`CHF ${fmt(trust.materiality)}`,a:"var(--am)" },{ l:"Result. Risiko",v:RISK[risk.rL].l,a:RISK[risk.rL].c },{ l:"Reliance",v:risk.rel?"Ja":"Nein",a:risk.rel?"var(--gn)":"var(--rd)" }].map((m,i) => (
            <div key={i} style={{ ...metricS, borderTop:`2.5px solid ${m.a}` }}><div style={{ fontSize:10.5,fontWeight:500,color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:6 }}>{m.l}</div><div style={{ fontSize:20,fontWeight:400 }}>{m.v}</div></div>
          ))}
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
          <div style={cardS}>
            <div style={secLabel}>Mandatsdaten</div>
            {[["Vermögensart",trust.assetType==="illiquid"?"Illiquide":"Liquide"],["Ausschüttungen",trust.distributions],["Systembasiert",trust.hasSystem],["Governance",trust.hasGovernance],["Compliance",trust.hasCompliance],["Pricefeeds",trust.hasPricefeed]].map(([k,v]) => (
              <div key={k} style={{ display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"0.5px solid var(--ln)",fontSize:13 }}>
                <span style={{ color:"var(--ink3)" }}>{k}</span>
                {typeof v==="boolean"?<Pill c={v?"var(--gn)":"var(--rd)"} bg={v?"var(--gn2)":"var(--rd2)"}>{v?"Ja":"Nein"}</Pill>:<span style={{ fontWeight:450 }}>{v}</span>}
              </div>
            ))}
          </div>
          <div style={cardS}>
            <div style={secLabel}>Fortschritt und Exceptions</div>
            <div style={{ display:"flex",alignItems:"center",gap:16,marginBottom:14 }}>
              <div style={{ fontSize:36,fontWeight:300,color:"var(--ac)" }}>{trust.completedSteps}</div>
              <div style={{ flex:1 }}><div style={{ fontSize:12,color:"var(--ink3)",marginBottom:6 }}>von 15 Pflichtschritten</div><Bar v={trust.completedSteps} max={15} c={STAT[trust.status].c} /></div>
            </div>
            {mandateExc.length > 0 && (
              <div style={{ marginBottom:10 }}>
                <div style={{ fontSize:10.5,fontWeight:600,color:"var(--rd)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:6 }}>Exceptions ({mandateExc.length})</div>
                {mandateExc.map(e => <div key={e} style={{ fontSize:12,color:"var(--ink2)",padding:"4px 0",borderBottom:"0.5px solid var(--ln)" }}>· {e}</div>)}
              </div>
            )}
            <div style={{ padding:"10px 14px",background:fin?"var(--gn2)":"var(--am2)",borderRadius:"var(--r)",fontSize:12,color:fin?"var(--gn)":"var(--am)",fontWeight:500 }}>
              {fin?"✓ Berichtsbereit":`✗ ${15-trust.completedSteps} Schritte offen`}
            </div>
          </div>
        </div>
      </>}

      {/* Checklist with WHO / WHEN audit trail */}
      {tab === "checklist" && <div style={cardS}>
        <div style={secLabel}>Pflichtschritte mit Audit Trail</div>
        {Object.entries(STEPS).map(([k,l],i) => {
          const done = trust.steps[k];
          const audit = trust.stepAudit[k];
          return (
            <div key={k} style={{ display:"flex",alignItems:"center",gap:12,padding:"9px 0",borderBottom:"0.5px solid var(--ln)",fontSize:13 }}>
              <div style={{ width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0,border:`1.5px solid ${done?"var(--gn)":"var(--ln2)"}`,background:done?"var(--gn2)":"transparent",color:done?"var(--gn)":"var(--ink4)" }}>
                {done?"✓":i+1}
              </div>
              <span style={{ flex:1,color:done?"var(--ink)":"var(--ink3)" }}>{l}</span>
              {done && audit ? (
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:11,fontWeight:500,color:"var(--gn)" }}>{audit.user}</div>
                  <div style={{ fontSize:10,fontFamily:"var(--m)",color:"var(--ink4)" }}>{audit.role} · {audit.date} {audit.time}</div>
                </div>
              ) : (
                <span style={{ fontSize:11,fontFamily:"var(--m)",color:"var(--ink4)" }}>Offen</span>
              )}
            </div>
          );
        })}
        <div style={{ marginTop:16,padding:"12px 16px",background:fin?"var(--gn2)":"var(--rd2)",borderRadius:"var(--r)",fontSize:13,fontWeight:500,color:fin?"var(--gn)":"var(--rd)" }}>
          {fin?"✓ Mandat kann finalisiert werden":"✗ Offene Pflichtschritte — nicht finalisierbar"}
        </div>
      </div>}

      {/* Annahmeerklärung — SIGNED BY CLIENT */}
      {tab === "acceptance" && <>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16 }}>
          <div style={{ ...metricS, borderTop:`2.5px solid ${emailSent?"var(--gn)":"var(--am)"}` }}><div style={{ fontSize:10.5,fontWeight:500,color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:6 }}>E-Mail versandt</div><div style={{ fontSize:16,fontWeight:400,color:emailSent?"var(--gn)":"var(--am)" }}>{emailSent?"Ja":"Ausstehend"}</div></div>
          <div style={{ ...metricS, borderTop:`2.5px solid ${clientSig?"var(--gn)":"var(--am)"}` }}><div style={{ fontSize:10.5,fontWeight:500,color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:6 }}>Kundenunterschrift</div><div style={{ fontSize:16,fontWeight:400,color:clientSig?"var(--gn)":"var(--am)" }}>{clientSig?"Erhalten":"Ausstehend"}</div></div>
          <div style={{ ...metricS, borderTop:`2.5px solid ${emailSent&&clientSig?"var(--gn)":"var(--rd)"}` }}><div style={{ fontSize:10.5,fontWeight:500,color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:6 }}>Status</div><div style={{ fontSize:16,fontWeight:400,color:emailSent&&clientSig?"var(--gn)":"var(--rd)" }}>{emailSent&&clientSig?"Vollständig":"Offen"}</div></div>
        </div>

        <div style={{ ...cardS, border:"1px solid var(--ln)", padding:"32px 36px" }}>
          <DocHeader title="Annahmeerklärung" subtitle="Engagement Letter — Prüfungsauftrag GJ 2025" trustName={trust.name} trustId={trust.id} />
          <div style={{ fontSize:13,lineHeight:2,color:"var(--ink2)",marginBottom:20 }}>
            <p style={{ marginBottom:12 }}>Sehr geehrte Damen und Herren,</p>
            <p style={{ marginBottom:12 }}>wir bestätigen hiermit die Annahme des Auftrags zur Durchführung einer eingeschränkten Revision bzw. vereinbarter Prüfungshandlungen für das Geschäftsjahr vom 1. Januar 2025 bis 31. Dezember 2025.</p>
            <div style={{ background:"var(--sf2)",borderRadius:"var(--r)",padding:"14px 18px",marginBottom:16 }}>
              {[["Trust / Mandat",trust.name],["Mandatsnummer",trust.id],["Bilanzstichtag","31. Dezember 2025"],["Vermögenswerte",`CHF ${fmt(trust.totalAssets)}`],["Art der Prüfung","Eingeschränkte Revision / Vereinbarte Prüfungshandlungen"]].map(([k,v]) => (
                <div key={k} style={{ display:"flex",padding:"4px 0",borderBottom:"0.5px solid var(--ln)" }}><span style={{ width:180,flexShrink:0,color:"var(--ink3)",fontWeight:450,fontSize:12 }}>{k}</span><span style={{ fontSize:13 }}>{v}</span></div>
              ))}
            </div>
            <p style={{ marginBottom:12 }}>Wir bitten um Gegenzeichnung und Rücksendung dieses Schreibens als Bestätigung Ihres Einverständnisses.</p>
          </div>
          {/* Client signature block */}
          <div style={{ marginTop:24,paddingTop:20,borderTop:"0.5px solid var(--ln)" }}>
            <div style={{ fontSize:10.5,fontWeight:600,color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:16 }}>Gegenzeichnung Kunde / Trustee</div>
            <div style={{ display:"flex",gap:40 }}>
              <SignatureLine label="Auftraggeber" name="Dr. K. Frick" role="Trustee / Stiftungsrat" signed={clientSig} date="18.04.2026" />
              <div style={{ flex:1 }}><div style={{ fontSize:12,color:"var(--ink3)",marginBottom:6 }}>Ort und Datum</div><div style={{ fontSize:13 }}>{clientSig?"Vaduz, 18. April 2026":"—"}</div></div>
            </div>
          </div>
        </div>

        <div style={{ display:"flex",gap:8,marginTop:12,flexWrap:"wrap" }}>
          {!emailSent && <button style={{ ...btnS,background:"var(--ac)",color:"#fff",border:"none" }} onClick={()=>setShowEmailPreview(true)}>E-Mail an Kunden versenden</button>}
          {emailSent && !clientSig && <button style={{ ...btnS,background:"var(--ac)",color:"#fff",border:"none" }} onClick={()=>setClientSig(true)}>Gegengezeichnet erhalten</button>}
          {emailSent && clientSig && <Pill c="var(--gn)" bg="var(--gn2)">✓ Annahmeerklärung vollständig — vom Kunden unterzeichnet</Pill>}
          <button style={btnS}>PDF-Vorschau</button>
        </div>

        {showEmailPreview && (
          <div style={{ ...cardS,marginTop:12,borderLeft:"3px solid var(--bl)",borderRadius:"0 var(--rl) var(--rl) 0" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}><div style={{ fontSize:14,fontWeight:500,color:"var(--bl)" }}>E-Mail-Vorschau</div><button style={{ ...btnS,padding:"3px 8px",fontSize:11 }} onClick={()=>setShowEmailPreview(false)}>×</button></div>
            <div style={{ background:"var(--sf2)",borderRadius:"var(--r)",padding:"14px 18px",fontSize:12 }}>
              {[["Von","audit@muster-treuhand.li"],["An",`trustee@${trust.name.toLowerCase().replace(/\s+/g,"-")}.li`],["CC","compliance@muster-treuhand.li"],["Betreff",`Annahmeerklärung zur Gegenzeichnung — ${trust.name} (${trust.id}) — GJ 2025`]].map(([k,v]) => (
                <div key={k} style={{ display:"flex",padding:"4px 0",borderBottom:"0.5px solid var(--ln)" }}><span style={{ width:60,color:"var(--ink3)",fontWeight:500 }}>{k}</span><span style={{ color:"var(--ink2)" }}>{v}</span></div>
              ))}
              <div style={{ marginTop:8,fontSize:11,color:"var(--ink3)" }}>Anhänge: Annahmeerklärung_{trust.id}_2025.pdf, AGB_Muster_Treuhand.pdf</div>
            </div>
            <div style={{ display:"flex",gap:8,marginTop:12 }}>
              <button style={{ ...btnS,background:"var(--ac)",color:"#fff",border:"none" }} onClick={()=>{setEmailSent(true);setShowEmailPreview(false)}}>Jetzt versenden</button>
              <button style={btnS} onClick={()=>setShowEmailPreview(false)}>Abbrechen</button>
            </div>
          </div>
        )}
      </>}

      {/* Vollständigkeitserklärung */}
      {tab === "vollst" && <>
        <div style={{ ...cardS, border:"1px solid var(--ln)", padding:"32px 36px" }}>
          <DocHeader title="Vollständigkeitserklärung" subtitle="Letter of Representation — GJ 2025" trustName={trust.name} trustId={trust.id} />
          <div style={{ fontSize:13,lineHeight:2,color:"var(--ink2)",marginBottom:20 }}>
            <p style={{ marginBottom:12 }}>Im Zusammenhang mit Ihrer Prüfung des {trust.name} per 31. Dezember 2025 bestätigen wir nach bestem Wissen und Gewissen:</p>
            {["Die Jahresrechnung gibt ein den tatsächlichen Verhältnissen entsprechendes Bild wieder.","Sämtliche Vermögenswerte und Verbindlichkeiten wurden vollständig und korrekt erfasst.","Alle Ausschüttungen erfolgten in Übereinstimmung mit der Trust Deed.","Es bestehen keine nicht offengelegten Eventualverbindlichkeiten oder Rechtsstreitigkeiten.","Alle Transaktionen mit nahestehenden Personen wurden offengelegt.","Es sind keine wesentlichen Ereignisse nach dem Bilanzstichtag eingetreten.","Uneingeschränkter Zugang zu allen prüfungsrelevanten Unterlagen wurde gewährt.",`Die Bewertung der Vermögenswerte (CHF ${fmt(trust.totalAssets)}) basiert auf dokumentierten Grundlagen.`].map((item,i) => (
              <div key={i} style={{ display:"flex",gap:10,padding:"5px 0",borderBottom:"0.5px solid var(--ln)" }}><span style={{ fontFamily:"var(--m)",fontSize:11,color:"var(--ink4)",width:20,flexShrink:0 }}>{i+1}.</span><span>{item}</span></div>
            ))}
          </div>
          <div style={{ marginTop:24,paddingTop:20,borderTop:"0.5px solid var(--ln)" }}>
            <div style={{ fontSize:10.5,fontWeight:600,color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:16 }}>Unterzeichnung Trustee</div>
            <div style={{ display:"flex",gap:40 }}>
              <SignatureLine label="Trustee" name="Dr. K. Frick" role="Geschäftsführer" signed={vollstSigned} date="12.04.2026" />
              <div style={{ flex:1 }}><div style={{ fontSize:12,color:"var(--ink3)",marginBottom:6 }}>Ort / Datum</div><div style={{ fontSize:13 }}>{vollstSigned?"Vaduz, 12. April 2026":"—"}</div></div>
            </div>
          </div>
        </div>
        <div style={{ display:"flex",gap:8,marginTop:12 }}>
          {!vollstSigned?<button style={{ ...btnS,background:"var(--ac)",color:"#fff",border:"none" }} onClick={()=>setVollstSigned(true)}>Als erhalten markieren</button>:<Pill c="var(--gn)" bg="var(--gn2)">✓ Vollständigkeitserklärung liegt vor</Pill>}
          <button style={btnS}>PDF-Vorlage</button><button style={btnS}>Dokument hochladen</button>
        </div>
      </>}

      {/* Reliance */}
      {tab === "reliance" && <div style={cardS}>
        <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:18 }}>
          <div style={{ width:36,height:36,borderRadius:"50%",background:risk.rel?"var(--gn2)":"var(--rd2)",display:"flex",alignItems:"center",justifyContent:"center",color:risk.rel?"var(--gn)":"var(--rd)",fontWeight:600,fontSize:16 }}>{risk.rel?"✓":"✗"}</div>
          <div><div style={{ fontWeight:500,fontSize:15,color:risk.rel?"var(--gn)":"var(--rd)" }}>{risk.rel?"Reliance auf zentrale IKS-Kontrollen":"Keine Reliance möglich"}</div></div>
        </div>
        {IKS_CONTROLS.map(c => <div key={c.id} style={{ display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:"0.5px solid var(--ln)",fontSize:13 }}><span style={{ fontFamily:"var(--m)",fontSize:10,color:"var(--ink4)",width:22 }}>{c.id}</span><Pill c={EFF[c.eff].c} bg={EFF[c.eff].bg}>{EFF[c.eff].l}</Pill><span style={{ flex:1,color:"var(--ink2)" }}>{c.question}</span></div>)}
      </div>}

      {/* Risk */}
      {tab === "risk" && <>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16 }}>
          {[{ l:"Inhärentes Risiko",lv:risk.iL,f:risk.ihF },{ l:"Kontrollrisiko",lv:risk.cL,f:risk.ctF },{ l:"Resultierendes Risiko",lv:risk.rL,f:[risk.strat] }].map(col => (
            <div key={col.l} style={{ ...cardS,borderTop:`2.5px solid ${RISK[col.lv].c}` }}><div style={{ fontSize:10.5,fontWeight:600,color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:8 }}>{col.l}</div><div style={{ fontSize:22,fontWeight:400,color:RISK[col.lv].c,marginBottom:10 }}>{RISK[col.lv].l}</div><div style={{ fontSize:12,color:"var(--ink3)",lineHeight:1.7 }}>{col.f.map((f,i)=><div key={i}>· {f}</div>)}</div></div>
          ))}
        </div>
      </>}

      {/* ── PRÜFUNG — Mandatsspezifische Prüfungs-Workbench ── */}
      {tab === "pruefung" && <>
        {/* Strategy banner */}
        <div style={{ ...cardS, borderLeft:`3px solid ${RISK[risk.rL].c}`, borderRadius:"0 var(--rl) var(--rl) 0", marginBottom:16 }}>
          <div style={{ display:"flex",alignItems:"center",gap:14 }}>
            <div style={{ width:36,height:36,borderRadius:"50%",background:RISK[risk.rL].bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:RISK[risk.rL].c,fontWeight:600,flexShrink:0 }}>
              {risk.rL === "high" ? "!" : risk.rL === "medium" ? "~" : "✓"}
            </div>
            <div>
              <div style={{ fontWeight:500,fontSize:14,color:RISK[risk.rL].c }}>Prüfungsstrategie: {risk.strat}</div>
              <div style={{ fontSize:12,color:"var(--ink3)",marginTop:3 }}>
                Risiko: {RISK[risk.rL].l} · Reliance: {risk.rel ? "Ja" : "Nein"} · Materialität: CHF {fmt(trust.materiality)}
              </div>
            </div>
          </div>
        </div>

        {/* Summary metrics */}
        {(() => {
          const allTests = testItems.flatMap(a => a.tests).filter(t => t.status !== "na");
          const done = allTests.filter(t => t.status === "done").length;
          const findings = allTests.filter(t => t.status === "finding").length;
          const open = allTests.filter(t => t.status === "open").length;
          return (
            <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16 }}>
              <div style={{ ...metricS,borderTop:"2.5px solid var(--ac)" }}><div style={{ fontSize:10.5,fontWeight:500,color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:6 }}>Prüfungshandlungen</div><div style={{ fontSize:28,fontWeight:300 }}>{allTests.length}</div></div>
              <div style={{ ...metricS,borderTop:"2.5px solid var(--gn)" }}><div style={{ fontSize:10.5,fontWeight:500,color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:6 }}>Erledigt</div><div style={{ fontSize:28,fontWeight:300 }}>{done}</div></div>
              <div style={{ ...metricS,borderTop:"2.5px solid var(--rd)" }}><div style={{ fontSize:10.5,fontWeight:500,color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:6 }}>Findings</div><div style={{ fontSize:28,fontWeight:300 }}>{findings}</div></div>
              <div style={{ ...metricS,borderTop:"2.5px solid var(--am)" }}><div style={{ fontSize:10.5,fontWeight:500,color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:6 }}>Offen</div><div style={{ fontSize:28,fontWeight:300 }}>{open}</div></div>
            </div>
          );
        })()}

        {/* Test areas */}
        {testItems.map(area => (
          <div key={area.id} style={cardS}>
            <div style={secLabel}>{area.area}</div>
            {area.tests.map(test => {
              const stColor = test.status === "done" ? "var(--gn)" : test.status === "finding" ? "var(--rd)" : test.status === "na" ? "var(--ink4)" : "var(--am)";
              const stBg = test.status === "done" ? "var(--gn2)" : test.status === "finding" ? "var(--rd2)" : test.status === "na" ? "var(--sf2)" : "var(--am2)";
              const stLabel = test.status === "done" ? "Erledigt" : test.status === "finding" ? "Finding" : test.status === "na" ? "N/A" : "Offen";
              const exp = expandedTest === test.id;
              return (
                <div key={test.id} style={{ marginBottom:6 }}>
                  <div onClick={() => setExpandedTest(exp ? null : test.id)} style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:exp?"var(--sf2)":"transparent",borderRadius:"var(--r)",cursor:"pointer",border:"0.5px solid var(--ln)",transition:"background .15s" }}>
                    <div style={{ width:20,height:20,borderRadius:"50%",border:`1.5px solid ${stColor}`,background:stBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:stColor,flexShrink:0 }}>
                      {test.status === "done" ? "✓" : test.status === "finding" ? "!" : test.status === "na" ? "—" : "○"}
                    </div>
                    <span style={{ fontFamily:"var(--m)",fontSize:10,color:"var(--ink4)",width:34 }}>{test.id}</span>
                    <span style={{ flex:1,fontSize:13,fontWeight:450,color:test.status==="na"?"var(--ink4)":"var(--ink)" }}>{test.name}</span>
                    <Pill c={stColor} bg={stBg}>{stLabel}</Pill>
                    <span style={{ fontSize:11,color:"var(--ink4)",transition:"transform .2s",transform:exp?"rotate(180deg)":"" }}>▾</span>
                  </div>

                  {exp && test.status !== "na" && (
                    <div style={{ padding:"16px 20px",background:"var(--sf2)",borderRadius:"0 0 var(--r) var(--r)",border:"0.5px solid var(--ln)",borderTop:"none" }}>
                      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:14 }}>
                        <div>
                          <div style={{ fontSize:10,fontWeight:600,color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:4 }}>Methode</div>
                          <div style={{ fontSize:13,fontWeight:450 }}>{test.method}</div>
                        </div>
                        <div>
                          <div style={{ fontSize:10,fontWeight:600,color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:4 }}>Geprüft von</div>
                          <div style={{ fontSize:13,fontWeight:450 }}>{test.status !== "open" ? `${test.user} (${test.role})` : "—"}</div>
                        </div>
                        <div>
                          <div style={{ fontSize:10,fontWeight:600,color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:4 }}>Datum</div>
                          <div style={{ fontSize:13,fontWeight:450 }}>{test.status !== "open" ? test.date : "—"}</div>
                        </div>
                      </div>

                      {/* Belege */}
                      <div style={{ marginBottom:12 }}>
                        <div style={{ fontSize:10,fontWeight:600,color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:6 }}>Hinterlegte Belege / Dokumente</div>
                        {test.docs.length > 0 ? (
                          <div style={{ display:"flex",flexWrap:"wrap",gap:4 }}>
                            {test.docs.map((doc,i) => (
                              <span key={i} style={{ fontFamily:"var(--m)",fontSize:10.5,padding:"4px 10px",background:"var(--sf)",border:"0.5px solid var(--ln)",borderRadius:4,display:"flex",alignItems:"center",gap:4 }}>
                                <span style={{ fontSize:11,opacity:.4 }}>■</span> {doc}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div style={{ fontSize:12,color:"var(--ink4)",fontStyle:"italic" }}>Noch keine Belege hinterlegt</div>
                        )}
                        <button style={{ ...btnS,padding:"4px 10px",fontSize:11,marginTop:6 }}>+ Beleg hochladen</button>
                      </div>

                      {/* Ergebnis */}
                      <div>
                        <div style={{ fontSize:10,fontWeight:600,color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:4 }}>Ergebnis / Feststellung</div>
                        {test.result ? (
                          <div style={{ fontSize:13,color:"var(--ink2)",padding:"8px 12px",background:test.status==="finding"?"var(--rd2)":"var(--gn2)",borderRadius:"var(--r)",borderLeft:test.status==="finding"?"3px solid var(--rd)":"3px solid var(--gn)" }}>
                            {test.result}
                          </div>
                        ) : (
                          <div style={{ display:"flex",gap:8,alignItems:"center" }}>
                            <div style={{ fontSize:12,color:"var(--ink4)",fontStyle:"italic" }}>Noch kein Ergebnis dokumentiert</div>
                            <button style={{ ...btnS,padding:"4px 10px",fontSize:11 }}>Ergebnis erfassen</button>
                          </div>
                        )}
                      </div>

                      {/* Actions for open items */}
                      {test.status === "open" && (
                        <div style={{ display:"flex",gap:8,marginTop:12,paddingTop:10,borderTop:"0.5px solid var(--ln)" }}>
                          <button style={{ ...btnS,background:"var(--ac)",color:"#fff",border:"none" }}>Als erledigt markieren</button>
                          <button style={{ ...btnS,color:"var(--rd)",borderColor:"var(--rd)" }}>Finding erfassen</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Additional test button */}
        <div style={{ display:"flex",gap:8,marginTop:4 }}>
          <button style={btnS}>+ Prüfungshandlung hinzufügen</button>
          <button style={btnS}>Prüfungsprogramm aus Vorlage laden</button>
        </div>
      </>}

      {/* Bericht */}
      {tab === "report" && <>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16 }}>
          {[{ l:"Annahme",ok:emailSent&&clientSig },{ l:"Vollständigkeit",ok:vollstSigned },{ l:"Pflichtschritte",ok:fin },{ l:"Berichtsbereit",ok:fin&&emailSent&&clientSig&&vollstSigned }].map((m,i) => (
            <div key={i} style={{ ...metricS,borderTop:`2.5px solid ${m.ok?"var(--gn)":"var(--rd)"}` }}><div style={{ fontSize:10.5,fontWeight:500,color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:4 }}>{m.l}</div><div style={{ fontSize:13,color:m.ok?"var(--gn)":"var(--rd)" }}>{m.ok?"✓ Ja":"✗ Offen"}</div></div>
          ))}
        </div>
        <div style={{ ...cardS,border:"1px solid var(--ln)",padding:"32px 36px" }}>
          <DocHeader title="Bericht über vereinbarte Prüfungshandlungen" subtitle={`Geschäftsjahr 2025 · ${trust.name}`} trustName={trust.name} trustId={trust.id} />
          <div style={{ fontSize:13,lineHeight:2,color:"var(--ink2)" }}>
            <div style={{ marginBottom:20 }}><div style={{ fontSize:11,fontWeight:600,color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:8 }}>1. Auftrag und Grundlagen</div><p>Gestützt auf den Prüfungsauftrag haben wir vereinbarte Prüfungshandlungen für den {trust.name} für das Geschäftsjahr 2025 durchgeführt.</p></div>
            <div style={{ marginBottom:20 }}><div style={{ fontSize:11,fontWeight:600,color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:8 }}>2. Prüfungsumfang</div>
              <div style={{ background:"var(--sf2)",borderRadius:"var(--r)",padding:"14px 18px" }}>
                {[["Vermögen",`CHF ${fmt(trust.totalAssets)}`],["Materialität",`CHF ${fmt(trust.materiality)}`],["Strategie",risk.strat],["Reliance",risk.rel?"Ja":"Nein"],["Risiko",`${RISK[risk.iL].l} / ${RISK[risk.cL].l} → ${RISK[risk.rL].l}`]].map(([k,v]) => <div key={k} style={{ display:"flex",padding:"4px 0",borderBottom:"0.5px solid var(--ln)" }}><span style={{ width:160,flexShrink:0,color:"var(--ink3)",fontWeight:450,fontSize:12 }}>{k}</span><span>{v}</span></div>)}
              </div>
            </div>
            <div style={{ marginBottom:20 }}><div style={{ fontSize:11,fontWeight:600,color:"var(--ink3)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:8 }}>3. Feststellungen</div>
              {mandateExc.length === 0 ? <div style={{ padding:"10px 14px",background:"var(--gn2)",borderRadius:"var(--r)",color:"var(--gn)" }}>Keine wesentlichen Beanstandungen.</div> : (
                <div>{mandateExc.map(e => <div key={e} style={{ padding:"6px 14px",borderLeft:"2px solid var(--rd)",marginBottom:4,fontSize:12,color:"var(--ink2)" }}>{e}</div>)}</div>
              )}
            </div>
          </div>
          <div style={{ marginTop:24,paddingTop:20,borderTop:"0.5px solid var(--ln)" }}>
            <div style={{ display:"flex",gap:40 }}>
              <SignatureLine label="Leitender Prüfer" name="S. Brunner" role="Manager" signed={fin} date="16.04.2026" />
              <SignatureLine label="Partner" name="P. Weber" role="Partner" signed={fin} date="16.04.2026" />
            </div>
          </div>
        </div>
        <div style={cardS}>
          <div style={secLabel}>Completion Memo</div>
          <div style={{ fontSize:13,lineHeight:2,color:"var(--ink2)" }}>
            {[["Mandat",`${trust.name} (${trust.id})`],["Annahme",emailSent&&clientSig?"✓ Versandt + gegengezeichnet":"Offen"],["Vollständigkeit",vollstSigned?"✓ Erhalten":"Offen"],["Risiko",`${RISK[risk.iL].l} / ${RISK[risk.cL].l} → ${RISK[risk.rL].l}`],["Exceptions",mandateExc.length>0?mandateExc.join(", "):"Keine"]].map(([k,v]) => <div key={k} style={{ display:"flex",padding:"1px 0",borderBottom:"0.5px solid var(--ln)" }}><span style={{ width:180,flexShrink:0,color:"var(--ink3)",fontWeight:450 }}>{k}</span><span>{v}</span></div>)}
          </div>
        </div>
        <div style={{ display:"flex",gap:8,marginTop:8 }}>
          <button style={{ ...btnS,background:fin&&emailSent&&clientSig&&vollstSigned?"var(--ac)":"var(--ln)",color:fin&&emailSent&&clientSig&&vollstSigned?"#fff":"var(--ink4)",border:"none",cursor:fin&&emailSent&&clientSig&&vollstSigned?"pointer":"not-allowed" }} disabled={!fin||!emailSent||!clientSig||!vollstSigned}>Bericht als PDF</button>
          <button style={btnS}>Dossier exportieren</button>
        </div>
        {(!fin||!emailSent||!clientSig||!vollstSigned) && <div style={{ marginTop:8,padding:"10px 14px",background:"var(--am2)",borderRadius:"var(--r)",fontSize:12,color:"var(--am)" }}>Bericht erst möglich wenn: Annahmeerklärung vom Kunden gegengezeichnet, Vollständigkeitserklärung erhalten, alle Pflichtschritte erledigt.</div>}
      </>}
    </div>
  );
}

// ─── Audit Trail ────────────────────────────────────
function Trail() {
  const logs = [
    { ts:"16.04.2026 14:32",u:"M. Keller",r:"Senior",a:"IKS-Kontrolltest C3 — Stichprobe 30 Fälle abgeschlossen",m:"—",tp:"test" },
    { ts:"16.04.2026 13:15",u:"S. Brunner",r:"Manager",a:"Reliance-Entscheid freigegeben",m:"—",tp:"approval" },
    { ts:"16.04.2026 11:48",u:"A. Müller",r:"Assistant",a:"Jahresrechnung importiert",m:"TR-0001",tp:"import" },
    { ts:"16.04.2026 10:22",u:"P. Weber",r:"Partner",a:"Reviewer Sign-off erteilt",m:"TR-0003",tp:"signoff" },
    { ts:"15.04.2026 16:45",u:"M. Keller",r:"Senior",a:"Risikoanalyse durchgeführt",m:"TR-0005",tp:"test" },
    { ts:"15.04.2026 15:30",u:"C. Fischer",r:"Compliance",a:"Compliance Review bestätigt",m:"TR-0002",tp:"approval" },
    { ts:"15.04.2026 14:12",u:"A. Müller",r:"Assistant",a:"Portfolio POP-2 — Vollprüfung 10 Mandate dokumentiert",m:"—",tp:"test" },
    { ts:"15.04.2026 11:00",u:"S. Brunner",r:"Manager",a:"Exception: Fehlende Governance",m:"TR-0010",tp:"exception" },
    { ts:"14.04.2026 16:30",u:"A. Müller",r:"Assistant",a:"Annahmeerklärung per E-Mail versandt",m:"TR-0001",tp:"import" },
    { ts:"14.04.2026 14:00",u:"S. Brunner",r:"Manager",a:"Vollständigkeitserklärung als erhalten markiert",m:"TR-0003",tp:"approval" },
  ];
  const tpC = { test:"var(--bl)",approval:"var(--gn)",import:"var(--ink3)",signoff:"var(--ac)",exception:"var(--rd)" };
  const roleMatrix = [{ r:"Assistant",p:[1,1,0,0,0,0] },{ r:"Senior",p:[1,1,1,0,0,0] },{ r:"Manager",p:[1,1,1,1,0,1] },{ r:"Partner",p:[1,1,1,1,1,1] },{ r:"Compliance",p:[0,0,1,1,0,0] },{ r:"Admin",p:[1,1,1,1,1,1] }];

  return (
    <div className="au">
      <div style={{ marginBottom:28 }}><h1 style={{ fontSize:24,fontWeight:300 }}>Audit trail</h1><p style={{ fontSize:13,color:"var(--ink3)",marginTop:4 }}>Nachvollziehbarkeit aller Prüfungshandlungen</p></div>
      <div style={cardS}>
        <div style={secLabel}>Letzte Aktivitäten</div>
        <div style={{ borderRadius:"var(--r)",border:"0.5px solid var(--ln)",overflow:"hidden" }}>
          <table style={{ width:"100%",borderCollapse:"collapse" }}>
            <thead><tr><th style={{ ...thS,width:140 }}>Zeit</th><th style={{ ...thS,width:120 }}>Benutzer</th><th style={thS}>Aktion</th><th style={{ ...thS,width:80 }}>Mandat</th></tr></thead>
            <tbody>{logs.map((l,i) => (
              <tr key={i}><td style={tdS}><span style={{ fontFamily:"var(--m)",fontSize:11,color:"var(--ink3)" }}>{l.ts}</span></td><td style={tdS}><div style={{ fontSize:13,fontWeight:450 }}>{l.u}</div><div style={{ fontSize:10,color:"var(--ink4)" }}>{l.r}</div></td><td style={tdS}><div style={{ display:"flex",alignItems:"center",gap:8 }}><span style={{ width:6,height:6,borderRadius:"50%",background:tpC[l.tp],flexShrink:0 }} />{l.a}</div></td><td style={tdS}><span style={{ fontFamily:"var(--m)",fontSize:11,color:l.m==="—"?"var(--ink4)":"var(--ink2)" }}>{l.m}</span></td></tr>
            ))}</tbody>
          </table>
        </div>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
        <div style={cardS}>
          <div style={secLabel}>Offene Freigaben</div>
          {[{ m:"TR-0005",s:"Reviewer Sign-off",u:"P. Weber" },{ m:"TR-0008",s:"Compliance Review",u:"C. Fischer" },{ m:"TR-0012",s:"Gegengezeichnete Annahme",u:"Kunde" }].map((f,i) => (
            <div key={i} style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"0.5px solid var(--ln)",fontSize:13 }}>
              <span style={{ fontFamily:"var(--m)",fontSize:11,color:"var(--ink4)",width:52 }}>{f.m}</span><span style={{ flex:1 }}>{f.s}</span><span style={{ fontSize:11,color:"var(--ink3)" }}>{f.u}</span><button style={{ ...btnS,padding:"3px 10px",fontSize:11 }}>Freigeben</button>
            </div>
          ))}
        </div>
        <div style={cardS}>
          <div style={secLabel}>Rollenmodell</div>
          <div style={{ borderRadius:"var(--r)",border:"0.5px solid var(--ln)",overflow:"hidden" }}>
            <table style={{ width:"100%",borderCollapse:"collapse" }}>
              <thead><tr><th style={thS}>Rolle</th><th style={{ ...thS,textAlign:"center" }}>Imp.</th><th style={{ ...thS,textAlign:"center" }}>Bearb.</th><th style={{ ...thS,textAlign:"center" }}>Freig.</th><th style={{ ...thS,textAlign:"center" }}>Rev.</th><th style={{ ...thS,textAlign:"center" }}>Sign.</th><th style={{ ...thS,textAlign:"center" }}>Samp.</th></tr></thead>
              <tbody>{roleMatrix.map(r => <tr key={r.r}><td style={{ ...tdS,fontWeight:450,fontSize:12 }}>{r.r}</td>{r.p.map((v,i)=><td key={i} style={{ ...tdS,textAlign:"center" }}><span style={{ width:8,height:8,borderRadius:"50%",display:"inline-block",background:v?"var(--gn)":"var(--ln)" }} /></td>)}</tr>)}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── App ────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("dashboard");
  const [sel, setSel] = useState("TR-0001");
  const go = useCallback(id => { setSel(id); setScreen("mandate"); }, []);

  return (
    <div style={{ display:"flex",minHeight:"100vh",fontFamily:"var(--f)",color:"var(--ink)",background:"var(--sf2)" }}>
      <style>{css}</style>
      <Sidebar screen={screen} setScreen={setScreen} selectedTrust={sel} />
      <main style={{ flex:1,padding:"28px 36px 48px",maxWidth:1020,overflow:"auto" }}>
        {screen === "dashboard" && <Dashboard onSelect={go} />}
        {screen === "trustee" && <TrusteeIKS />}
        {screen === "portfolio" && <Portfolio />}
        {screen === "exceptions" && <Exceptions />}
        {screen === "mandate" && <Mandate id={sel} />}
        {screen === "trail" && <Trail />}
      </main>
    </div>
  );
}
