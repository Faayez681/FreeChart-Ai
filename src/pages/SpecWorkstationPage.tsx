import React, { useState, useEffect } from "react";
import { useAppStore } from "../store/useAppStore";
import { motion } from "motion/react";
import { 
  Download, Play, CheckSquare, Terminal, Map, Palette, Database, Layers3, FileCode, RefreshCw 
} from "lucide-react";

interface SpecWorkstationPageProps {
  onBackToLab: () => void;
}

const pageVariant: any = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.25, ease: "easeIn" } }
};

export default function SpecWorkstationPage({ onBackToLab }: SpecWorkstationPageProps) {
  const { setCurrentView } = useAppStore();

  // Local state elements
  const [activeSpecTab, setActiveSpecTab] = useState<number>(1);
  const [specFileContent, setSpecFileContent] = useState<string>("");
  const [isSpecLoading, setIsSpecLoading] = useState<boolean>(false);

  // States for subchecklists and compiler simulations
  const [apiMethod, setApiMethod] = useState<string>("POST");
  const [apiPath, setApiPath] = useState<string>("/api/analyze");
  const [apiRequestBody, setApiRequestBody] = useState<string>(
    JSON.stringify({
      asset: "TSLA",
      timeframe: "1 Hour",
      imageUrl: "data:image/png;base64,...",
      requestedCores: ["pattern", "backtest"]
    }, null, 2)
  );
  const [apiResponseOutput, setApiResponseOutput] = useState<string>("");
  const [isApiCalling, setIsApiCalling] = useState<boolean>(false);

  const [activeFlowNode, setActiveFlowNode] = useState<string>("LANDING");
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const [prdVerifiedItems, setPrdVerifiedItems] = useState<Record<string, boolean>>({
    "func-upload": true,
    "func-sr": true,
    "func-sim": true,
    "nfunc-speed": true,
    "nfunc-cap": false
  });

  const [selectedSqlQuery, setSelectedSqlQuery] = useState<string>("");
  const [sqlResultData, setSqlResultData] = useState<any[]>([]);
  const [isSqlCompiling, setIsSqlCompiling] = useState<boolean>(false);

  const [phaseProgress, setPhaseProgress] = useState<number[]>([100, 100, 100, 80]);

  // Load specs from active server node
  useEffect(() => {
    const fileMap: Record<number, string> = {
      1: "PRD.md",
      2: "TRD.md",
      3: "APP_FLOW.md",
      4: "DESIGN_BRIEF.md",
      5: "BACKEND_SCHEMA.md",
      6: "IMPLEMENTATION_PLAN.md"
    };

    const fileName = fileMap[activeSpecTab];
    if (!fileName) return;

    setIsSpecLoading(true);
    fetch(`/api/spec-content?file=${fileName}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          setSpecFileContent(data.content);
        } else {
          setSpecFileContent(`### Error Loading file\n${data.error || "Unknown server response."}`);
        }
      })
      .catch((err) => {
        setSpecFileContent(`### System Link Failure\nCould not fetch raw specifications from local sandbox nodes. Exception: ${err.message}`);
      })
      .finally(() => {
        setIsSpecLoading(false);
      });
  }, [activeSpecTab]);

  const downloadMarkdownFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const executeSimulatedApi = () => {
    setIsApiCalling(true);
    setApiResponseOutput("// Initiating socket pipeline...\n// Framing multimodal request context...");
    
    setTimeout(() => {
      setApiResponseOutput((prev) => prev + "\n// Resolving security authorization token...\n// Dispatching 12.5KB payload to Gemini core matrix...");
      setTimeout(() => {
        const responseMock = {
          status: "SUCCESS_OK",
          timestamp: new Date().toISOString(),
          latencyMs: 760,
          data: {
            asset: "TSLA",
            timeframe: "1 Hour",
            trend: apiRequestBody.toLowerCase().includes("bear") ? "Bearish" : "Bullish",
            confidenceScore: 84,
            supportLevels: ["$240.50", "$232.00"],
            resistanceLevels: ["$265.00", "$272.50"],
            entryZone: "$241.00 - $244.50",
            stopLoss: "$238.10",
            targets: ["$252.00", "$259.00", "$268.00"],
            indicators: {
              rsi: "Oscillating at 56, room for bullish validation.",
              macd: "Intraday crossover confirmed.",
              emas: "Assertive breakout above 50-period average lines."
            },
            recommendationText: "Dynamic Pivot Support Structure Identified"
          }
        };
        setApiResponseOutput(JSON.stringify(responseMock, null, 2));
        setIsApiCalling(false);
      }, 700);
    }, 600);
  };

  const handleQuerySelection = (query: string) => {
    setSelectedSqlQuery(query);
    setIsSqlCompiling(true);
    setSqlResultData([]);

    setTimeout(() => {
      setIsSqlCompiling(false);
      if (query.includes("confidence >= 80")) {
        setSqlResultData([
          { id: "e10b1a-8c9d", user_id: "u3498f-092c", asset: "AAPL (Apple Inc.)", trend: "Bullish", confidence: 85, risk: "Medium", entry_zone: "$198.00 - $202.00" },
          { id: "d42b9c-2f1d", user_id: "u5126e-449a", asset: "BTC (Bitcoin)", trend: "Bullish", confidence: 88, risk: "Low", entry_zone: "$67,800 - $68,400" },
        ]);
      } else if (query.includes("win_rate > 60")) {
        setSqlResultData([
          { id: "b22a10-09fa", analysis_id: "e10b1a-8c9d", scenario: "Aggressive Expansion", win_rate: "74.00%", risk_reward_ratio: "1:3.2", consecutive_wins: 6 },
          { id: "b55c23-d8cd", analysis_id: "d42b9c-2f1d", scenario: "Defensive Accumulation", win_rate: "68.20%", risk_reward_ratio: "1:3.5", consecutive_wins: 4 },
        ]);
      } else if (query.includes("coach_conversations")) {
        setSqlResultData([
          { role: "user", content: "Where is the major stop loss in AAPL?", sent_at: "2026-06-06 08:35:12" },
          { role: "assistant", content: "Defensive stop loss is anchored at $194.00, below key support cluster floors.", sent_at: "2026-06-06 08:35:14" },
          { role: "user", content: "Explain the confidence score", sent_at: "2026-06-06 08:37:05" },
          { role: "assistant", content: "The 85% confidence score represents high coordination across MACD and RSIs.", sent_at: "2026-06-06 08:37:08" },
        ]);
      } else if (query.includes("users")) {
        setSqlResultData([
          { id: "u3498f-092c", email: "analyst@platform.internal", registered_at: "2026-06-01 10:11:42" },
          { id: "u5126e-449a", email: "beta_tester@platform.internal", registered_at: "2026-06-03 14:24:19" },
        ]);
      } else {
        setSqlResultData([
          { system_status: "Query executed correctly", rows_returned: 0 }
        ]);
      }
    }, 450);
  };

  return (
    <motion.main
      key="spec_workstation"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariant}
      className="flex-1 w-full mx-auto max-w-7xl px-6 py-8 space-y-10 text-white select-text font-sans"
    >
      {/* Header segment representing premium workspace specs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-8">
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] bg-emerald-950/80 text-emerald-400 border border-emerald-900/60 rounded-md py-1 px-2.5 font-bold">
              PRO_ENGINEERING_SUITE_ACTIVE
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] bg-zinc-900 text-zinc-400 rounded-md py-1 px-2.5">
              v5.0 LIVE
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-medium text-white tracking-tight">
            Engineering Spec Workstation
          </h1>
          <p className="text-zinc-500 font-sans text-xs max-w-2xl">
            A dynamic, interactive workspace integrating all 6 core stages of product delivery from your uploaded engineering thumbprint guide. Track checklists, compile REST API payloads, animate layout trees, query SQL databases, and configure Gantt schedules.
          </p>
        </div>

        {/* Quick dashboard figures */}
        <div className="flex flex-wrap gap-4 font-mono text-[10px] text-zinc-500 bg-zinc-950/60 p-4 rounded-xl border border-zinc-900 shadow-md">
          <div className="space-y-1 pr-4 border-r border-zinc-900 text-left">
            <span className="block text-zinc-650 font-bold uppercase tracking-wider">PILLARS MAPPED</span>
            <strong className="text-emerald-400 text-lg">6 / 6 active</strong>
          </div>
          <div className="space-y-1 pr-4 border-r border-zinc-900 text-left">
            <span className="block text-zinc-650 font-bold uppercase tracking-wider">COMPLIANCE CODE</span>
            <strong className="text-white text-lg">100% SECURE</strong>
          </div>
          <div className="space-y-1 text-left">
            <span className="block text-zinc-650 font-bold uppercase tracking-wider">WORKSPACE LINKS</span>
            <button
              onClick={() => {
                const zipContent = `# Project Deliverables Index\nGenerated based on 6 core engineering steps.\n- PRD.md: Product Requirements Document\n- TRD.md: Technical Requirements Document\n- APP_FLOW.md: Application Wireflow Maps\n- DESIGN_BRIEF.md: Brand Style Tokens\n- BACKEND_SCHEMA.md: Relational Database Models\n- IMPLEMENTATION_PLAN.md: Task Timeline`;
                downloadMarkdownFile("DELIVERABLES_MANIFEST.md", zipContent);
              }}
              className="text-blue-400 hover:text-blue-300 transition-colors font-bold flex items-center gap-1 cursor-pointer"
            >
              <Download className="h-3 w-3" /> EXPORT MANIFEST
            </button>
          </div>
        </div>
      </div>

      {/* Core Spec Workstation Navigation and Viewer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Nav column containing ALL 6 PILLARS */}
        <div className="lg:col-span-4 space-y-3 lg:sticky lg:top-28 bg-[#000000] p-1.5 rounded-2xl border border-zinc-900/60">
          <div className="p-3 border-b border-zinc-900 font-mono text-[9.5px] uppercase text-zinc-500 tracking-wider flex items-center justify-between">
            <span>PROJECT LIFE RUN-TRACKS</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {[
            { step: 1, label: "PRD Spec", sub: "Product Requirements" },
            { step: 2, label: "TRD Spec", sub: "Technical Spec" },
            { step: 3, label: "UI Flow Map", sub: "Create App Flow" },
            { step: 4, label: "Design Tokens", sub: "Design UI/UX Brief" },
            { step: 5, label: "Data Schema", sub: "Create Backend Schema" },
            { step: 6, label: "Dev Roadmap", sub: "Write Implementation Plan" }
          ].map((item) => (
            <button
              key={item.step}
              onClick={() => setActiveSpecTab(item.step)}
              className={`w-full p-4 rounded-xl transition-all font-sans text-left flex items-start gap-4 border cursor-pointer group hover:translate-x-1 ${
                activeSpecTab === item.step
                  ? "bg-zinc-950 text-white border-zinc-805 shadow-xl"
                  : "bg-black text-zinc-400 border-transparent hover:bg-zinc-950/45 hover:text-zinc-200"
              }`}
            >
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center font-mono text-sm font-bold shrink-0 ${
                  activeSpecTab === item.step ? "bg-blue-600 text-white" : "bg-zinc-900 text-zinc-500 group-hover:text-zinc-300"
                }`}
              >
                {item.step}
              </div>
              <div className="space-y-0.5">
                <span className="block font-mono text-[9px] uppercase tracking-widest text-[#0066ee] font-extrabold">{item.label}</span>
                <strong className="block text-sm font-medium">{item.sub}</strong>
              </div>
            </button>
          ))}

          <div className="pt-4 border-t border-zinc-900 flex justify-center">
            <button
              onClick={onBackToLab}
              className="w-full text-center bg-zinc-900 hover:bg-[#18181b] border border-zinc-800 text-zinc-300 py-2.5 px-4 font-mono text-[10px] uppercase font-bold tracking-widest rounded-xl transition-all active:scale-95 cursor-pointer"
            >
              ◀ BACK TO ANALYTICS LAB
            </button>
          </div>
        </div>

        {/* Right content display column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6.5 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
              <div className="text-left">
                <span className="font-mono text-[9px] text-zinc-500 block uppercase tracking-widest">
                  ACTIVE PILLARS SPECTRAL RENDER
                </span>
                <h2 className="text-xs sm:text-sm font-mono font-medium text-blue-400 uppercase tracking-tight">
                  {activeSpecTab === 1 && "01 // PRODUCT REQUIREMENTS DOCUMENT (PRD.md)"}
                  {activeSpecTab === 2 && "02 // TECHNICAL REQUIREMENTS SPECIFICATION (TRD.md)"}
                  {activeSpecTab === 3 && "03 // APP USER FLOW DIAGRAMS & WIREMAPPING (APP_FLOW.md)"}
                  {activeSpecTab === 4 && "04 // UI/UX STYLE SHEETS & COLOR BRIEF (DESIGN_BRIEF.md)"}
                  {activeSpecTab === 5 && "05 // BACKEND POSTGRESQL DATABASE SCHEMAS (BACKEND_SCHEMA.md)"}
                  {activeSpecTab === 6 && "06 // ENGINEERING SPRINT ROADMAP (IMPLEMENTATION_PLAN.md)"}
                </h2>
              </div>

              <button
                onClick={() => {
                  const fileNames: Record<number, string> = {
                    1: "PRD.md",
                    2: "TRD.md",
                    3: "APP_FLOW.md",
                    4: "DESIGN_BRIEF.md",
                    5: "BACKEND_SCHEMA.md",
                    6: "IMPLEMENTATION_PLAN.md"
                  };
                  downloadMarkdownFile(fileNames[activeSpecTab], specFileContent);
                }}
                className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-[9.5px] font-bold py-1.5 px-3.5 rounded-lg border border-zinc-855 hover:border-zinc-700 transition-all cursor-pointer select-none"
              >
                <Download className="h-3 w-3" />
                <span>Download Raw (.md)</span>
              </button>
            </div>

            {/* 1. PRD INTERACTIVE WORKBENCH */}
            {activeSpecTab === 1 && (
              <div className="bg-black/40 border border-zinc-900 rounded-2xl p-5 space-y-5 animate-fade-in font-sans">
                <h3 className="text-xs font-mono text-[#0066ee] uppercase tracking-widest font-extrabold flex items-center gap-1.5 justify-start">
                  <CheckSquare className="h-3.5 w-3.5" /> Requirement Coverage Conformance Audit
                </h3>
                <p className="text-zinc-500 text-xs text-left">
                  Audit code delivery directly against target product definitions:
                </p>

                <div className="space-y-3.5 text-left">
                  {[
                    { id: "func-upload", tag: "FUNC-01", name: "Screenshot Uploader", desc: "Drag-and-drop or clipboard loading.", status: "In Production" },
                    { id: "func-sr", tag: "FUNC-02", name: "Support/Resistance Overlay", desc: "D3 technical indicators projection.", status: "In Production" },
                    { id: "func-sim", tag: "FUNC-03", name: "Scenario Backtester Simulator", desc: "Risk models charting outputs.", status: "In Production" },
                    { id: "nfunc-speed", tag: "NFUNC-01", name: "Deep Processing Speed", desc: "Under 3-seconds analytical computation flow.", status: "Compliant" },
                    { id: "nfunc-cap", tag: "NFUNC-02", name: "Institutional Memory Expand", desc: "Requires Redis backend server nodes.", status: "Pending" }
                  ].map((chk) => (
                    <div key={chk.id} className="flex items-start gap-3 p-3 bg-zinc-950/65 rounded-xl border border-zinc-900">
                      <input
                        type="checkbox"
                        checked={prdVerifiedItems[chk.id] || false}
                        onChange={(e) => setPrdVerifiedItems({ ...prdVerifiedItems, [chk.id]: e.target.checked })}
                        className="mt-0.5 rounded accent-blue-600 scale-110 cursor-pointer"
                        id={`chk-${chk.id}`}
                      />
                      <div className="space-y-0.5">
                        <label htmlFor={`chk-${chk.id}`} className="text-xs font-semibold text-white cursor-pointer flex items-center gap-2">
                          {chk.tag}: {chk.name}
                          <span className={`text-[9.5px] px-1.5 py-0.5 rounded uppercase font-mono font-bold ${chk.status === "Pending" ? "bg-red-950/30 text-red-400" : "bg-emerald-950/30 text-emerald-400"}`}>{chk.status}</span>
                        </label>
                        <span className="block text-[11px] text-zinc-500">{chk.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. TRD API STATION */}
            {activeSpecTab === 2 && (
              <div className="bg-black/40 border border-zinc-900 rounded-2xl p-5 space-y-5 animate-fade-in font-sans text-left">
                <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-extrabold flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5" /> REST API Endpoint Testing Station
                </h3>
                <p className="text-zinc-500 text-xs">
                  Test the Express API pipeline with simulated webhook packages:
                </p>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <select
                      value={apiMethod}
                      onChange={(e) => setApiMethod(e.target.value)}
                      className="bg-zinc-900 text-white font-mono text-xs rounded-xl px-3 py-2 border border-zinc-800 cursor-pointer outline-none"
                    >
                      <option>POST</option>
                      <option>GET</option>
                    </select>
                    <input
                      type="text"
                      value={apiPath}
                      onChange={(e) => setApiPath(e.target.value)}
                      className="bg-zinc-900 text-white font-mono text-xs rounded-xl px-4 py-2 border border-zinc-800 flex-1 outline-none font-bold"
                    />
                    <button
                      onClick={executeSimulatedApi}
                      disabled={isApiCalling}
                      className="bg-cyan-500 text-black hover:bg-cyan-400 px-5 py-2 rounded-xl text-xs font-bold font-mono tracking-wider transition-all disabled:opacity-40 cursor-pointer"
                    >
                      {isApiCalling ? "SENDING..." : "SEND"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">Request Body</span>
                      <textarea
                        value={apiRequestBody}
                        onChange={(e) => setApiRequestBody(e.target.value)}
                        className="w-full h-40 bg-zinc-950 font-mono text-[11px] text-zinc-300 p-3 rounded-xl border border-zinc-900 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">Response Terminal</span>
                      <div className="w-full h-40 bg-zinc-950 font-mono text-[11px] text-[#00c6ff] p-3 rounded-xl border border-zinc-900 overflow-y-auto whitespace-pre">
                        {apiResponseOutput || "// Idle workstation console."}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. WIREFLOW DIAGRAMS */}
            {activeSpecTab === 3 && (
              <div className="bg-black/40 border border-zinc-900 rounded-2xl p-5 space-y-5 animate-fade-in font-sans text-left">
                <h3 className="text-xs font-mono text-amber-500 uppercase tracking-widest font-extrabold flex items-center gap-1.5">
                  <Map className="h-3.5 w-3.5" /> Interactive Application Wireflow & Core State Mapping
                </h3>
                <p className="text-zinc-550 text-xs">Animate the chart lab pipeline by clicking on state vectors:</p>

                <div className="flex flex-wrap gap-2 text-[9px] font-mono">
                  {["LANDING", "UPLOADER", "PROXY", "DIAGNOSTICS"].map((node) => (
                    <button
                      key={node}
                      onClick={() => setActiveFlowNode(node)}
                      className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        activeFlowNode === node ? "bg-amber-950/20 text-amber-400 border-amber-800 font-bold" : "bg-zinc-950 text-zinc-500 border-transparent hover:text-zinc-300"
                      }`}
                    >
                      [{node}_NODE]
                    </button>
                  ))}
                </div>

                <div className="p-6 bg-zinc-950 rounded-2xl border border-zinc-900 flex items-center justify-around font-mono text-[10px] min-h-[140px] overflow-hidden select-none">
                  {["Landing HUD", "Uploader", "Server API", "Lab Panel"].map((name, i) => {
                    const nodeKeys = ["LANDING", "UPLOADER", "PROXY", "DIAGNOSTICS"];
                    const active = activeFlowNode === nodeKeys[i];
                    return (
                      <React.Fragment key={name}>
                        <div className={`p-3 rounded-xl border text-center transition-all ${active ? "bg-amber-950/10 border-amber-500 text-amber-500 font-bold" : "bg-black border-zinc-900 text-zinc-550"}`}>
                          <strong>{name}</strong>
                          <span className="block text-[8.5px] font-light">{nodeKeys[i]}</span>
                        </div>
                        {i < 3 && <span className={`text-sm ${active ? "text-amber-500 animate-pulse" : "text-zinc-900"}`}>→</span>}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. DESIGN TOKENS WORKBENCH */}
            {activeSpecTab === 4 && (
              <div className="bg-black/40 border border-zinc-900 rounded-2xl p-5 space-y-4 animate-fade-in font-sans text-left">
                <h3 className="text-xs font-mono text-pink-500 uppercase tracking-widest font-extrabold flex items-center gap-1.5">
                  <Palette className="h-3.5 w-3.5" /> Interactive UI/UX Palette Brief
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-[9px] text-zinc-500">
                  {[
                    { hex: "#000000", name: "Pure Canvas Black", bg: "bg-black" },
                    { hex: "#09090b", name: "Shroud Gray", bg: "bg-[#09090b]" },
                    { hex: "#0066ee", name: "Indicator Blue", bg: "bg-[#0066ee]" },
                    { hex: "#00d97e", name: "Success Green", bg: "bg-[#00d97e]" },
                    { hex: "#ff4560", name: "Alert Crimson", bg: "bg-[#ff4560]" }
                  ].map((color) => (
                    <div
                      key={color.hex}
                      onClick={() => {
                        navigator.clipboard.writeText(color.hex);
                        setCopiedColor(color.hex);
                        setTimeout(() => setCopiedColor(null), 1200);
                      }}
                      className="border border-zinc-900 p-2.5 rounded-xl cursor-pointer hover:border-zinc-700 transition"
                    >
                      <div className={`h-10 rounded-md mb-2 ${color.bg}`} />
                      <strong className="block text-white text-[10px] truncate">{color.name}</strong>
                      <span>{color.hex}</span>
                    </div>
                  ))}
                </div>
                {copiedColor && (
                  <div className="p-2.5 bg-emerald-950/20 text-emerald-400 border border-emerald-900/60 rounded-xl text-center text-xs font-mono">
                    HEX {copiedColor} COMPLETED TO CLIPBOARD!
                  </div>
                )}
              </div>
            )}

            {/* 5. SQL DATABASE WORKBENCH */}
            {activeSpecTab === 5 && (
              <div className="bg-black/40 border border-zinc-900 rounded-2xl p-5 space-y-5 animate-fade-in font-sans text-left">
                <h3 className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-extrabold flex items-center gap-1.5 flex-wrap">
                  <Database className="h-3.5 w-3.5" /> PostgreSQL Multi-Table Query Compiler Simulator
                </h3>
                <p className="text-zinc-500 text-xs">Run precompiled query presets to test data integrity indexes:</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left font-mono text-[9px]">
                  {[
                    { q: "SELECT * FROM analysis WHERE confidence >= 80;", tag: "SELECT COGNITIVE HIGH CONFIDENCE REPORTS" },
                    { q: "SELECT * FROM backtest_runs WHERE win_rate > 60;", tag: "SELECT HIGH PROFIT SCENARIO BACKTESTS" },
                    { q: "SELECT role, content FROM coach_conversations ORDER BY sent_at DESC;", tag: "SELECT RECENT COACH CONVERSATIONS" },
                    { q: "SELECT * FROM users WHERE email LIKE '%@platform.internal';", tag: "SELECT DEPLOYED WORKSPACE ENGINEERS" }
                  ].map((preset) => (
                    <button
                      key={preset.tag}
                      onClick={() => handleQuerySelection(preset.q)}
                      className="p-2.5 bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-900 text-zinc-300 rounded-xl text-left font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Terminal className="h-3 w-3 text-indigo-400 shrink-0" />
                      <span>{preset.tag}</span>
                    </button>
                  ))}
                </div>

                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 font-mono space-y-3">
                  <div className="text-[9.5px] text-zinc-600 flex items-center justify-between">
                    <span>SQL CONSOLE REPL // postgres@localhost:5432</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  </div>
                  <div className="text-xs text-[#00c6ff] font-bold select-all overflow-x-auto whitespace-nowrap">
                    {selectedSqlQuery ? `>> ${selectedSqlQuery}` : ">> Select a query above to dispatch."}
                  </div>

                  {isSqlCompiling ? (
                    <div className="text-[11px] text-zinc-500 py-3 italic">Running query indexes scan ...</div>
                  ) : sqlResultData.length > 0 ? (
                    <div className="overflow-x-auto text-[10px] leading-relaxed pt-1">
                      <table className="w-full text-left border-collapse border border-zinc-900">
                        <thead>
                          <tr className="bg-zinc-900 text-zinc-400 border-b border-zinc-800">
                            {Object.keys(sqlResultData[0]).map((key) => (
                              <th key={key} className="p-2">{key}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {sqlResultData.map((row, idx) => (
                            <tr key={idx} className="border-b border-zinc-900 hover:bg-zinc-900/20">
                              {Object.values(row).map((val: any, colIdx) => (
                                <td key={colIdx} className="p-2 text-zinc-300">{String(val)}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-[10px] text-zinc-650 italic">Console buffer is currently empty.</div>
                  )}
                </div>
              </div>
            )}

            {/* 6. DEV ROADMAP WORKBENCH */}
            {activeSpecTab === 6 && (
              <div className="bg-black/40 border border-zinc-900 rounded-2xl p-5 space-y-4 animate-fade-in font-sans text-left">
                <h3 className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-extrabold flex items-center gap-1.5">
                  <Layers3 className="h-3.5 w-3.5" /> Sprint Timeline Completion Slider Calculator
                </h3>
                <div className="space-y-4 bg-zinc-950 p-4 rounded-xl border border-zinc-900">
                  {[
                    { label: "Phase 1: Brand Layout Design Core", idx: 0 },
                    { label: "Phase 2: Technical Simulator & Backtester", idx: 1 },
                    { label: "Phase 3: Express Multimodal API Engine", idx: 2 },
                    { label: "Phase 4: High-Fidelity Interactive Specs", idx: 3 }
                  ].map((ph) => (
                    <div key={ph.idx} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-white">{ph.label}</span>
                        <span className="font-mono text-[9px] text-emerald-400">{phaseProgress[ph.idx]}% Complete</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={phaseProgress[ph.idx]}
                        onChange={(e) => {
                          const newProgress = [...phaseProgress];
                          newProgress[ph.idx] = parseInt(e.target.value);
                          setPhaseProgress(newProgress);
                        }}
                        className="w-full h-1 bg-zinc-900 appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 font-mono text-[9.5px] bg-zinc-950 p-4 rounded-xl border border-zinc-900 text-zinc-500">
                  <div>
                    <span className="block text-zinc-650">CUMULATIVE ROADMAP COMPLETION</span>
                    <strong className="text-lg text-emerald-400">
                      {Math.round((phaseProgress[0] + phaseProgress[1] + phaseProgress[2] + phaseProgress[3]) / 4)}%
                    </strong>
                  </div>
                  <div>
                    <span className="block text-zinc-650">ESTIMATED LAUNCH MATRIX STATUS</span>
                    <strong className="text-lg text-white">
                      {Math.round((phaseProgress[0] + phaseProgress[1] + phaseProgress[2] + phaseProgress[3]) / 4) >= 95 ? "UTC PROD STABLE" : "STABLE // 3 DAYS REMAINING"}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* RAW MARKDOWN CODE PREVIEW */}
            <div className="bg-black/90 rounded-2xl border border-zinc-900 p-5 mt-6 text-left">
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-500 uppercase border-b border-zinc-900 pb-3 mb-3.5">
                <FileCode className="h-4 w-4 text-[#0066ee]" /> RAW CODE SPECIFICATION FILE PREVIEW
              </div>
              {isSpecLoading ? (
                <div className="text-sm text-zinc-500 py-12 text-center animate-pulse flex flex-col items-center justify-center gap-2">
                  <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
                  <span>Loading raw specification node file...</span>
                </div>
              ) : (
                <pre className="w-full max-h-[300px] bg-zinc-950 font-mono text-[11px] text-zinc-400 p-4 rounded-xl border border-zinc-950/60 overflow-auto select-text shadow-inner leading-relaxed">
                  {specFileContent || "// Ready to pipeline repository files"}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  );
}
export { SpecWorkstationPage };
