import React, { useState, useEffect, useRef } from "react";
import { 
  RefreshCw, Sparkles, Layers, Tv, Compass, Clock, Sliders, Gamepad, ChevronRight, Play, Sun, Moon, Upload
} from "lucide-react";
import SpinnerLoader from "./loaders/SpinnerLoader";
import ProgressLoader from "./loaders/ProgressLoader";
import SkeletonLoader, { SkeletonBlock } from "./loaders/SkeletonLoader";
import ShimmerLoader from "./loaders/ShimmerLoader";
import FullscreenLoader from "./loaders/FullscreenLoader";

interface LoaderDetail {
  id: string;
  name: string;
  durationText: string;
  scenario: string;
  specs: string[];
  animationRule: string;
  reactTailwindAdvice: string;
}

const LOADER_DETAILS: Record<string, LoaderDetail> = {
  SPINNER: {
    id: "SPINNER",
    name: "1. Spinner Loader",
    durationText: "< 1.0 Second maximum",
    scenario: "Instant reactions: button clicks, rapid REST API compilations, SQL queries, and tab changes.",
    specs: [
      "Keep dimensions compact: 16px to 32px diameter max to avoid visual clutter.",
      "High visual contrast: use accent neon colors (e.g. blue-400) against dark layouts.",
      "Eliminate adjacent text if action is self-explanatory."
    ],
    animationRule: "360-degree linear rotation keyframes.",
    reactTailwindAdvice: "Deploy using the custom SpinnerLoader modular component."
  },
  PROGRESS: {
    id: "PROGRESS",
    name: "2. Progress Bar",
    durationText: "1.0 to 5.0 Seconds",
    scenario: "Measurable processes: uploads, high-resolution downloads, and exports.",
    specs: [
      "Include a direct numeric percentage text (e.g., '67% Complete').",
      "Integrate descriptive dynamic stage subtitles.",
      "Ensure a soft track backdrop to outline the progress boundary."
    ],
    animationRule: "Smooth width transition with ease-out curve.",
    reactTailwindAdvice: "Use the ProgressiveLoader component linked to local task state."
  },
  SKELETON: {
    id: "SKELETON",
    name: "3. Skeleton Screen",
    durationText: "1.5 to 3.0 Seconds",
    scenario: "Structure-locked loading: rendering the workspace technical cockpit dashboard grids before reports compile.",
    specs: [
      "Match the target DOM arrangement strictly: match sizes of headers, charts, and metrics cells.",
      "Use muted flat backgrounds with softer corners (rounded-xl/ rounded-2xl).",
      "Avoid rendering actual mock labels inside the skeleton structure."
    ],
    animationRule: "Subtle fixed opacity states or simple enter fade-in layouts.",
    reactTailwindAdvice: "Generate matching mock arrays using custom SkeletonLoader block components."
  },
  SHIMMER: {
    id: "SHIMMER",
    name: "4. Shimmer Loader",
    durationText: "1.5 to 4.0 Seconds",
    scenario: "Premium layout placeholders: enhances standard skeleton grids to elevate perceived system performance.",
    specs: [
      "Apply linear gradient sweeps moving left-to-right at a diagonal angle.",
      "Contrast ratio: Keep the shimmer light band extremely subtle."
    ],
    animationRule: "Infinite sweep keyframes over 1.4s intervals.",
    reactTailwindAdvice: "Utilize the custom ShimmerLoader system component with linear-gradient background loops."
  },
  FULLSCREEN: {
    id: "FULLSCREEN",
    name: "5. Fullscreen Preloader",
    durationText: "2.0 to 5.0 Seconds maximum",
    scenario: "Macro system state changes: running heavy diagnostic calibrations, or exporting entire workbook archives.",
    specs: [
      "Use viewport overlays to isolate background noise.",
      "Show interactive loading text indicators to keep traders engaged."
    ],
    animationRule: "Linear scanning beams drifting vertically, paired with staggered progress lists.",
    reactTailwindAdvice: "Deploy using the portable FullscreenLoader component with status overlays."
  }
};

export default function IntelligentLoaderDemo() {
  const [activeTab, setActiveTab] = useState<string>("SPINNER");
  const [loaderTheme, setLoaderTheme] = useState<"light" | "dark">("dark");
  const [simulatedSpeed, setSimulatedSpeed] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simType, setSimType] = useState<string | null>(null);
  const [simPercent, setSimPercent] = useState<number>(0);
  const [simMessage, setSimMessage] = useState<string>("");

  const startSimulation = (type: string) => {
    setIsSimulating(true);
    setSimType(type);
    setSimPercent(0);
    const speedCoeff = simulatedSpeed === 0.5 ? 0.6 : simulatedSpeed === 2 ? 2.2 : 1.0;

    if (type === "SPINNER") {
      setSimMessage("Compiling SQL query rows...");
      setTimeout(() => setIsSimulating(false), 900 * speedCoeff);
    } 
    else if (type === "PROGRESS") {
      setSimMessage("Buffering local viewport streams...");
      let current = 0;
      const interval = setInterval(() => {
        current += Math.floor(Math.random() * 8) + 4;
        if (current >= 100) {
          current = 100;
          clearInterval(interval);
          setSimMessage("Optimal diagnostic targets established!");
          setTimeout(() => setIsSimulating(false), 350);
        } else {
          setSimPercent(Math.min(current, 99));
          if (current < 30) setSimMessage("Buffering visual data stream...");
          else if (current < 65) setSimMessage("Decoding candlestick geometry wicks...");
          else setSimMessage("Optimizing indicators...");
        }
      }, 75 * speedCoeff);
    } 
    else if (type === "SKELETON" || type === "SHIMMER") {
      setSimMessage("Calibrating workspace structures...");
      setTimeout(() => setIsSimulating(false), 1400 * speedCoeff);
    } 
    else if (type === "FULLSCREEN") {
      setSimMessage("DISPATCHING DEEP SIMULATION DEPLOYMENT...");
      let val = 0;
      const interval = setInterval(() => {
        val += 5;
        if (val >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsSimulating(false), 400);
        } else {
          setSimPercent(val);
          if (val < 35) setSimMessage("SCANNING LOCAL GRID LIQUIDITY NODES...");
          else if (val < 70) setSimMessage("CALIBRATING MONTE CARLO PROBABILITIES...");
          else setSimMessage("PACKAGING MANIFEST...");
        }
      }, 80 * speedCoeff);
    }
  };

  const activeDetail = LOADER_DETAILS[activeTab] || LOADER_DETAILS["SPINNER"];

  return (
    <div id="intelligent-loading-sandbox" className="p-1.5 bg-zinc-950 border border-zinc-900 rounded-3xl mt-8 font-sans overflow-hidden text-left">
      <div className="p-6 bg-zinc-900/10 border-b border-zinc-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1 px-1.5 bg-blue-950/20 text-[#0066ee] rounded border border-blue-900/50 text-[9px] font-mono font-bold tracking-widest uppercase">
              UI DESIGN COMPLIANCE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          </div>
          <h2 className="text-xl font-display font-bold text-white tracking-tight">Intelligent Loading Lab</h2>
          <p className="text-xs text-zinc-500 mt-1">Test and evaluate the performance curves of different layout and preloader states.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono text-[10.5px]">
          <div className="flex bg-[#0a0a0c] border border-zinc-900 p-0.5 rounded-lg">
            <button onClick={() => setLoaderTheme("dark")} className={`p-1.5 px-2.5 rounded-md flex items-center gap-1 cursor-pointer transition-all ${loaderTheme === "dark" ? "bg-zinc-900 text-blue-400 font-bold" : "text-zinc-500 hover:text-zinc-300"}`}><Moon className="h-3.5 w-3.5" /> Dark</button>
            <button onClick={() => setLoaderTheme("light")} className={`p-1.5 px-2.5 rounded-md flex items-center gap-1 cursor-pointer transition-all ${loaderTheme === "light" ? "bg-white text-zinc-900 font-bold shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}><Sun className="h-3.5 w-3.5" /> Light</button>
          </div>

          <div className="flex bg-[#0a0a0c] border border-zinc-900 p-0.5 rounded-lg items-center gap-1">
            <span className="text-zinc-500 px-2 text-[9.5px] uppercase font-bold">Latency</span>
            <select value={simulatedSpeed} onChange={(e) => setSimulatedSpeed(parseFloat(e.target.value))} className="bg-zinc-950 border border-zinc-850 py-1 px-2 rounded-md font-bold text-zinc-300 outline-none cursor-pointer">
              <option value="0.5">Fast 5G (Instant)</option>
              <option value="1">Standard (1x)</option>
              <option value="2">Slow Mobile (2.2x)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        <div className="lg:col-span-4 bg-black/40 lg:border-r border-zinc-900/60 p-4 space-y-1.5">
          <div className="text-[10px] text-zinc-650 font-mono uppercase tracking-widest px-2 mb-3 mt-1 block">Select Loader Archetype</div>
          {Object.values(LOADER_DETAILS).map((item) => {
            const isSelected = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer group flex items-center justify-between ${isSelected ? "bg-[#0c0c0e] border-[#0066ee]/50 text-white shadow-lg" : "bg-[#0b0b0d]/30 border-zinc-900/30 hover:border-zinc-800 text-zinc-450"}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isSelected ? "bg-blue-950/40 text-blue-400" : "bg-zinc-900/20 text-zinc-500"}`}>
                    {item.id === "SPINNER" && <RefreshCw className="h-4 w-4" />}
                    {item.id === "PROGRESS" && <Upload className="h-4 w-4" />}
                    {item.id === "SKELETON" && <Layers className="h-4 w-4" />}
                    {item.id === "SHIMMER" && <Sparkles className="h-4 w-4" />}
                    {item.id === "FULLSCREEN" && <Compass className="h-4 w-4" />}
                  </div>
                  <div>
                    <span className={`block text-xs font-semibold ${isSelected ? "text-blue-400" : "text-zinc-200"}`}>{item.name}</span>
                    <span className="block text-[9.5px] text-zinc-500 font-mono mt-0.5">{item.durationText}</span>
                  </div>
                </div>
                <ChevronRight className={`h-4 w-4 ${isSelected ? "text-blue-400 translate-x-1" : "text-zinc-700"}`} />
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-8 flex flex-col p-6 space-y-6">
          <div className={`p-8 border rounded-2xl flex flex-col items-center justify-center relative min-h-[220px] overflow-hidden ${loaderTheme === "dark" ? "bg-[#09090b] border-zinc-900 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900"}`}>
            <div className="absolute inset-0 bg-[#3b82f6]/[0.02] pointer-events-none" />
            
            {!isSimulating ? (
              <div className="z-10 text-center space-y-4">
                <p className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Interactive simulation pane</p>
                <h4 className="text-sm font-semibold">Ready to emulate {activeTab.toLowerCase()} preloader</h4>
                <button onClick={() => startSimulation(activeTab)} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-xs font-bold font-mono tracking-wider text-white uppercase rounded-lg cursor-pointer flex items-center gap-1.5 mx-auto active:scale-95 transition-all"><Play className="h-3 w-3 fill-white" /> Fire Routine</button>
              </div>
            ) : (
              <div className="z-10 w-full">
                {simType === "SPINNER" && <div className="text-center space-y-2"><SpinnerLoader size="lg" /><p className="text-xs font-mono text-zinc-400">{simMessage}</p></div>}
                {simType === "PROGRESS" && <ProgressLoader progress={simPercent} message={simMessage} />}
                {simType === "SKELETON" && <div className="w-full max-w-sm mx-auto text-left"><SkeletonLoader /></div>}
                {simType === "SHIMMER" && <div className="w-full max-w-md mx-auto"><ShimmerLoader /></div>}
                {simType === "FULLSCREEN" && <FullscreenLoader message={simMessage} />}
              </div>
            )}
          </div>

          <div className="bg-zinc-900/40 border border-zinc-900/65 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
              <Clock className="h-4 w-4 text-zinc-550" />
              <h4 className="text-xs uppercase font-mono tracking-wider font-extrabold text-zinc-400">Target Scenario Specifications</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-zinc-650 text-[10px] uppercase">Optimal State Usage</span>
                <p className="text-zinc-300 leading-relaxed font-sans">{activeDetail.scenario}</p>
              </div>
              <div className="space-y-1">
                <span className="text-zinc-650 text-[10px] uppercase">Technical Execution Guides</span>
                <p className="text-zinc-300 leading-relaxed font-sans">{activeDetail.reactTailwindAdvice}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export { IntelligentLoaderDemo };
