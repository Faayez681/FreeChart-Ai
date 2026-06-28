import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, Sparkles, TrendingUp, Cpu, Activity, Newspaper } from "lucide-react";

interface StorySection {
  id: number;
  number: string;
  title: string;
  subtitle: string;
  paragraph: string;
  icon: React.ReactNode;
  accent: string;
}

export default function ScrollStorytelling() {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [backtestProgress, setBacktestProgress] = useState<number>(0);
  const [backtestStats, setBacktestStats] = useState({ winRate: 55, profitFactor: 1.4, trades: 120 });
  const [sentimentIndex, setSentimentIndex] = useState<number>(0.5);
  const [pulseRings, setPulseRings] = useState<{ id: number; scale: number; opacity: number }[]>([]);

  const sections: StorySection[] = [
    {
      id: 1,
      number: "01 // THE PROBLEM",
      title: "Market Noise Overload",
      subtitle: "Markets generate millions of chaotic signals daily. Humans miss critical opportunities.",
      paragraph: "Traders struggle to isolate institutional footprint zones amidst high-frequency noise, leading to delayed entries, uncalibrated risk margins, and catastrophic drawback cycles.",
      icon: <HelpCircle className="h-5 w-5 text-rose-500" />,
      accent: "#f43f5e"
    },
    {
      id: 2,
      number: "02 // COGNITIVE DETECTOR",
      title: "Real-Time AI Candlestick Analysis",
      subtitle: "Advanced computer vision models scan setups, trace pattern wicks, and compute zones.",
      paragraph: "Hover over the analyzer to lock pattern hulls. FreeChart isolates bullish rejections, evening star formations, or double top caps inside local structures in milliseconds.",
      icon: <Sparkles className="h-5 w-5 text-cyan-400" />,
      accent: "#00c8ff"
    },
    {
      id: 3,
      number: "03 // PREDICTION LAYER",
      title: "Forecasting & Confidence Horizons",
      subtitle: "Project future candles and probability tunnels based on dynamic neural networks.",
      paragraph: "Run advanced probability mappings to map bullish or bearish convergence targets with active risk boundaries calculated dynamically using real volatility coefficients.",
      icon: <TrendingUp className="h-5 w-5 text-emerald-400" />,
      accent: "#10b981"
    },
    {
      id: 4,
      number: "04 // BACKTEST MATRIX",
      title: "Instant Simulation Engine",
      subtitle: "Benchmark setups against 5 years of historical order books automatically.",
      paragraph: "Instantly stream backtest runs. Watch win-rates and profit factor counts compile in real-time, validating predictive visual paths before allocating live capital.",
      icon: <Cpu className="h-5 w-5 text-[#0066ee]" />,
      accent: "#0066ee"
    },
    {
      id: 5,
      number: "05 // NEURAL INTEL",
      title: "Market News Sentiment Pulse",
      subtitle: "Parse financial streams, SEC filings, and volume density dynamically.",
      paragraph: "Decode macro sentiments with dynamic vector-embeddings, projecting clean score index halos matching active chart setups under a single operational view.",
      icon: <Newspaper className="h-5 w-5 text-purple-400" />,
      accent: "#a855f7"
    }
  ];

  // Simulation handler for backtest progress rolling up
  useEffect(() => {
    if (activeTab === 4) {
      setBacktestProgress(0);
      setBacktestStats({ winRate: 55, profitFactor: 1.4, trades: 120 });
      
      const interval = setInterval(() => {
        setBacktestProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });

        setBacktestStats(prev => ({
          winRate: Math.min(prev.winRate + Math.floor(Math.random() * 3) + 1, 89),
          profitFactor: parseFloat((prev.profitFactor + 0.08).toFixed(2)),
          trades: prev.trades + Math.floor(Math.random() * 12) + 5
        }));
      }, 100);

      return () => clearInterval(interval);
    }
  }, [activeTab]);

  // Pulse rings creator for macro sentiment sector
  useEffect(() => {
    if (activeTab === 5) {
      const interval = setInterval(() => {
        setPulseRings(prev => [
          ...prev.filter(r => r.scale < 3).map(r => ({ ...r, scale: r.scale + 0.2, opacity: Math.max(r.opacity - 0.08, 0) })),
          { id: Math.random(), scale: 1, opacity: 0.8 }
        ]);
        setSentimentIndex(prev => {
          const delta = (Math.random() - 0.5) * 0.15;
          return Math.max(0.2, Math.min(0.95, prev + delta));
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [activeTab]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-28 relative">
      
      {/* Decorative vertical blueprint lines */}
      <div className="absolute top-0 bottom-0 left-[2.5rem] w-px bg-zinc-950 hidden md:block" />
      <div className="absolute top-0 bottom-0 right-[2.5rem] w-px bg-zinc-950 hidden md:block" />

      {/* Grid heading */}
      <div className="space-y-4 text-center max-w-2xl mx-auto mb-20">
        <span className="font-mono text-xs text-[#00c8ff] tracking-[0.25em] uppercase block">
          ✦ THE COGNITIVE EXPERIENCE PIPELINE
        </span>
        <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-white leading-tight">
          How FREECHART Transforms Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Trading Reality</span>
        </h2>
        <p className="text-zinc-500 font-sans text-sm sm:text-base leading-relaxed font-light">
          Experience the absolute pinnacle of visual analysis. Scroll or hover over each core stage to witness the system active in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-12 relative z-10">
        
        {/* LEFT COLUMN: Narrative steplist Cards */}
        <div className="lg:col-span-6 space-y-6">
          {sections.map((sect) => {
            const isActive = activeTab === sect.id;
            return (
              <div
                key={sect.id}
                onMouseEnter={() => setActiveTab(sect.id)}
                className={`relative p-6 sm:p-8 rounded-2xl border text-left cursor-pointer select-none transition-all duration-300 ${
                  isActive 
                    ? "bg-[#070709] border-zinc-800 shadow-[0_0_24px_rgba(0,102,238,0.06)]" 
                    : "bg-transparent border-zinc-950 hover:bg-[#030304]/60 hover:border-zinc-900"
                }`}
              >
                {/* Active edge highlight block */}
                {isActive && (
                  <div 
                    className="absolute inset-y-0 left-0 w-1 rounded-l-2xl" 
                    style={{ backgroundColor: sect.accent }} 
                  />
                )}

                <div className="flex gap-4 sm:gap-6 items-start">
                  
                  {/* Step Icon */}
                  <div 
                    className={`p-3 rounded-xl border flex items-center justify-center shrink-0 transition-transform ${
                      isActive ? "scale-110" : "scale-100"
                    }`}
                    style={{ 
                      backgroundColor: isActive ? `${sect.accent}15` : "rgba(9,9,11,0.5)",
                      borderColor: isActive ? sect.accent : "rgba(39,39,42,0.4)" 
                    }}
                  >
                    {sect.icon}
                  </div>

                  {/* Text items */}
                  <div className="space-y-2">
                    <span 
                      className="font-mono text-[9px] uppercase tracking-widest font-bold"
                      style={{ color: isActive ? sect.accent : "#71717a" }}
                    >
                      {sect.number}
                    </span>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-white tracking-tight">
                      {sect.title}
                    </h3>
                    <p className="text-[#00c8ff]/90 text-xs font-mono font-medium leading-relaxed">
                      {sect.subtitle}
                    </p>
                    {isActive && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-zinc-400 font-sans text-xs pt-2 leading-relaxed"
                      >
                        {sect.paragraph}
                      </motion.p>
                    )}
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: Interactive HUD monitor screen */}
        <div className="lg:col-span-6 lg:sticky lg:top-28">
          <div className="relative w-full aspect-[4/3] bg-[#050507] border border-zinc-900 rounded-2xl overflow-hidden p-6 shadow-2xl flex flex-col justify-between">
            
            {/* Monitor HUD Framing Corner Accents */}
            <div className="absolute top-3 left-3 flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500/40" />
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/40" />
              <span className="w-1.5 h-1.5 rounded-full bg-green-500/40" />
            </div>
            
            <div className="absolute top-3 right-4 font-mono text-[8px] text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-green-400 animate-pulse" />
              <span>STREAMS_OK // CORE_ACTV</span>
            </div>

            {/* Inner dynamic stage wrapper based on Active state */}
            <div className="flex-1 flex flex-col justify-center items-center py-6">
              <AnimatePresence mode="wait">
                
                {/* SUB-VIEW 1: Noise Market Chaos */}
                {activeTab === 1 && (
                  <motion.div
                    key="stage-problem"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full h-full flex flex-col justify-center space-y-4 text-center font-mono"
                  >
                    <div className="relative w-full max-w-[280px] h-32 mx-auto border border-red-950 bg-red-950/5 rounded-xl p-3 flex flex-col justify-between overflow-hidden">
                      {/* Grid background noise code streams */}
                      <div className="absolute inset-x-2 top-2 flex justify-between text-[7px] text-rose-800 animate-pulse">
                        <span>ERR: REJECTED // MT_44_O</span>
                        <span>0.4150_VOL</span>
                      </div>
                      <div className="h-24 flex items-end justify-between gap-1 mt-2">
                        {Array.from({ length: 18 }).map((_, i) => {
                          const randHeight = 15 + Math.random() * 65;
                          return (
                            <div key={i} className="flex-1 flex flex-col items-center">
                              <span className="w-[1px] bg-zinc-800 h-4" />
                              <div
                                className="w-full bg-rose-600/40 border border-rose-500"
                                style={{ height: `${randHeight}%` }}
                              />
                            </div>
                          );
                        })}
                      </div>
                      <div className="absolute inset-0 bg-transparent flex items-center justify-center">
                        <span className="bg-red-500 text-black px-2 py-1 text-[8px] tracking-widest font-extrabold uppercase rounded shadow-lg animate-bounce">
                          ⚠ MARKET NOISE FILTER FAILURE
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Unstructured candlestick arrays overloading retail channels.</span>
                  </motion.div>
                )}

                {/* SUB-VIEW 2: Live AI Candlestick Analyzer */}
                {activeTab === 2 && (
                  <motion.div
                    key="stage-analysis"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full h-full flex flex-col justify-center space-y-4 text-center font-mono cursor-pointer"
                  >
                    <div className="relative w-full max-w-[340px] h-36 mx-auto border border-cyan-900/40 bg-zinc-950 rounded-xl p-3 flex flex-col justify-center overflow-hidden">
                      <div className="absolute top-2 left-3 text-[8px] text-cyan-400 font-bold uppercase tracking-widest">
                        ● PARSING CANDLESTICK HULLS
                      </div>
                      
                      {/* Laser scanners sweeping */}
                      <div className="absolute inset-y-0 w-0.5 bg-gradient-to-b from-transparent via-cyan-400 to-transparent left-1/2 -translate-x-1/2 animate-infinite-slide z-20" />

                      <div className="h-24 flex items-end justify-center gap-3">
                        {[
                          { bull: true, h: 30, wickTop: 10, wickBot: 12, label: "DOJI" },
                          { bull: true, h: 65, wickTop: 20, wickBot: 8, label: "ENGULFING", glow: true },
                          { bull: false, h: 40, wickTop: 15, wickBot: 15, label: "REJECTION" },
                          { bull: true, h: 80, wickTop: 30, wickBot: 10, label: "MARUBOZU", glow: true },
                        ].map((cd, i) => (
                          <div key={i} className="flex flex-col items-center relative group">
                            <span className="w-[1px] bg-zinc-600 h-4" style={{ height: cd.wickTop }} />
                            <div 
                              className={`w-4 sm:w-5 transition-all duration-300 rounded ${
                                cd.glow 
                                  ? "bg-[#00c8ff] shadow-[0_0_12px_#00c8ff]/60 border-cyan-300" 
                                  : cd.bull ? "bg-emerald-600" : "bg-rose-600"
                              }`}
                              style={{ height: `${cd.h}px` }}
                            />
                            <span className="w-[1px] bg-zinc-600 h-4" style={{ height: cd.wickBot }} />
                            
                            {/* Target boxes identifying zones */}
                            {cd.glow && (
                              <div className="absolute -inset-2 border border-dashed border-cyan-400/80 rounded animate-pulse" />
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="absolute bottom-2 right-3 text-[7.5px] text-emerald-400 font-light uppercase">
                        SUPPORT BOUNDARY: $151.20 SPEC_LOCKED
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SUB-VIEW 3: Prediction forecasts */}
                {activeTab === 3 && (
                  <motion.div
                    key="stage-prediction"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full h-full flex flex-col justify-center space-y-4 text-center font-mono"
                  >
                    <div className="relative w-full max-w-[340px] h-36 mx-auto border border-emerald-950 bg-black rounded-xl p-4 flex flex-col justify-between overflow-hidden">
                      <div className="text-[8px] text-emerald-400 font-bold uppercase tracking-widest text-left">
                        COGNITIVE PROBABILITY TUNNEL
                      </div>

                      {/* Smooth SVG forecast pathway */}
                      <svg className="w-full h-20 text-emerald-400" viewBox="0 0 100 50">
                        {/* Shaded confidence channel */}
                        <path d="M 10,35 Q 35,20 60,15 L 90,5 L 90,30 L 60,32 Z" fill="rgba(16,185,129,0.08)" stroke="none" />
                        {/* Shaded bearish channel */}
                        <path d="M 10,35 Q 35,20 60,25 L 90,45 L 90,30 L 60,28 Z" fill="rgba(244,63,94,0.02)" stroke="none" />

                        {/* Historic Line */}
                        <path d="M 10,40 L 30,30 L 50,35 L 60,22" fill="none" stroke="currentColor" strokeWidth="1" />
                        {/* Forecast Dash tunnel */}
                        <path d="M 60,22 Q 75,10 90,8" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2 2" className="animate-pulse" />
                        
                        <circle cx="90" cy="8" r="1.5" fill="#10b981" />
                        <circle cx="60" cy="22" r="1.5" fill="currentColor" />
                      </svg>

                      <div className="flex justify-between items-center text-[8.5px] text-zinc-400">
                        <span>BULL HORIZON: 74% PROBABILITY</span>
                        <span className="text-emerald-400">SIGMA BAND: 1.6σ</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SUB-VIEW 4: Backtesting simulation progress */}
                {activeTab === 4 && (
                  <motion.div
                    key="stage-backtest"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full h-full flex flex-col justify-center space-y-4 text-center font-mono"
                  >
                    <div className="relative w-full max-w-[340px] border border-blue-900 bg-zinc-950 rounded-xl p-4 flex flex-col gap-3">
                      <div className="flex justify-between items-center text-[8.5px] uppercase">
                        <span className="text-blue-400 font-bold">HISTORICAL BACKTEST PIPELINE</span>
                        <span className="text-zinc-500">YEARS_SCANNED: 5Y</span>
                      </div>

                      {/* Stats Readout with rolling values */}
                      <div className="grid grid-cols-3 gap-2 py-1 bg-black/60 rounded p-2 text-center">
                        <div>
                          <span className="text-[8px] text-zinc-500 uppercase block">Win Rate</span>
                          <span className="text-xs sm:text-sm font-semibold text-emerald-400">{backtestStats.winRate}%</span>
                        </div>
                        <div className="border-l border-zinc-900">
                          <span className="text-[8px] text-zinc-500 uppercase block">Profit Fct</span>
                          <span className="text-xs sm:text-sm font-semibold text-blue-400">{backtestStats.profitFactor}x</span>
                        </div>
                        <div className="border-l border-zinc-900">
                          <span className="text-[8px] text-zinc-500 uppercase block">Trades run</span>
                          <span className="text-xs sm:text-sm font-semibold text-zinc-300">{backtestStats.trades}</span>
                        </div>
                      </div>

                      {/* Loading running bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[7px] text-zinc-500 uppercase">
                          <span>Simulating matrix...</span>
                          <span>{backtestProgress}% Complete</span>
                        </div>
                        <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full transition-all duration-100" style={{ width: `${backtestProgress}%` }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SUB-VIEW 5: Sentiment Macro haloguide */}
                {activeTab === 5 && (
                  <motion.div
                    key="stage-news"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full h-full flex flex-col justify-center space-y-4 text-center font-mono"
                  >
                    <div className="relative w-full max-w-[340px] h-36 mx-auto border border-purple-950 bg-black rounded-xl p-4 flex flex-col justify-between overflow-hidden">
                      <div className="text-[8px] text-purple-400 font-bold uppercase tracking-widest text-left">
                        REAL-TIME MACRO EMBEDDING MATRIX
                      </div>

                      {/* Circular pulse halo core */}
                      <div className="relative h-20 w-20 mx-auto flex items-center justify-center">
                        {pulseRings.map(rg => (
                          <div
                            key={rg.id}
                            className="absolute border border-purple-500/30 rounded-full"
                            style={{
                              width: `${rg.scale * 30}px`,
                              height: `${rg.scale * 30}px`,
                              opacity: rg.opacity,
                              transform: "translate(-50%, -50%)",
                              top: "50%",
                              left: "50%",
                            }}
                          />
                        ))}
                        <div className="h-10 w-10 rounded-full bg-purple-950 border border-purple-400 flex flex-col items-center justify-center shadow-lg z-10">
                          <span className="text-[8px] uppercase text-zinc-500">Score</span>
                          <span className="text-xs font-bold text-white">{(sentimentIndex).toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex justify-between text-[8px] text-zinc-500">
                        <span>SENTIMENT: BULLISH COEF</span>
                        <span className="text-purple-400 uppercase">Neural Stream Connected</span>
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Bottom Status bar */}
            <div className="border-t border-zinc-950 pt-3 flex justify-between items-center font-mono text-[8px] text-zinc-650">
              <span>HOLOGRAPHIC DIAGNOSTICS DECK v5.0</span>
              <span>D3_INERTIA: CALIBRATED</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
