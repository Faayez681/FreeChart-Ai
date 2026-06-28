import React, { useState, useEffect } from "react";
import { useAppStore } from "../store/useAppStore";
import { 
  LineChart, BarChart3, Compass, BookOpen, ShieldAlert, Upload, RefreshCw, Sparkles, AlertTriangle, ArrowLeft, Sparkle 
} from "lucide-react";
import TradingViewChart from "../components/TradingViewChart";
import ReportViewer from "../components/ReportViewer";
import BacktestSimulator from "../components/BacktestSimulator";
import TradeCoachChat from "../components/TradeCoachChat";
import ChartSandbox from "../components/ChartSandbox";
import NewsWidget from "../components/NewsWidget";
import CompanyLogoBanner from "../components/CompanyLogoBanner";
import DashboardViewer from "../components/DashboardViewer";
import AiMultitoolSuite from "../components/AiMultitoolSuite";
import { SkeletonBlock } from "../components/loaders/SkeletonLoader";
import { SAMPLE_CHARTS } from "../utils/mockPresetData";
import { AnalysisReport } from "../types";

export default function WorkspacePage() {
  const {
    activeTab,
    setActiveTab,
    activeReport,
    setActiveReport,
    activeDashboard,
    setActiveDashboard,
    uploadedImage,
    setUploadedImage,
    isProcessing,
    setIsProcessing,
    currentView,
    setCurrentView,
    errorText,
    setErrorText,
    customCoreTicker,
    setCustomCoreTicker,
    customCoreTimeframe,
    setCustomCoreTimeframe,
    customCoreTrend,
    setCustomCoreTrend,
    activeCores,
    setActiveCores,
    setActivePresetId
  } = useAppStore() as any;

  const [tabLoading, setTabLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Trigger skeleton shimmer immediately on tab switch
  useEffect(() => {
    setTabLoading(true);
    const timer = setTimeout(() => {
      setTabLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const triggerLoadingSteps = (callback: () => void) => {
    setIsProcessing(true);
    setTimeout(() => {
      callback();
    }, 1200);
  };

  const handleSynthesizeCore = (tickerSymbol: string, timeframeStr: string, trendBias: "Bullish" | "Bearish" | "Neutral") => {
    const symbolClean = tickerSymbol.trim().toUpperCase() || "NVDA";
    
    triggerLoadingSteps(() => {
      const formattedAsset = `${symbolClean} ${["BTC", "ETH", "SOL", "PEPE", "XRP"].includes(symbolClean) ? "" : "(Stock)"}`;
      const randConf = Math.floor(Math.random() * 15) + 80; // 80-94
      const randTrendScore = trendBias === "Bullish" ? 82 + Math.floor(Math.random() * 12) : trendBias === "Bearish" ? 12 + Math.floor(Math.random() * 12) : 50;
      const basePrice = symbolClean === "ETH" ? 3450 : symbolClean === "SOL" ? 175 : symbolClean === "NVDA" ? 122 : symbolClean === "BTC" ? 64500 : 250;
      
      const generatedReport: AnalysisReport = {
        asset: `${symbolClean} ${["BTC", "ETH", "SOL", "PEPE", "XRP"].includes(symbolClean) ? "Crypto" : "Equity"} Core`,
        timeframe: timeframeStr,
        trend: trendBias,
        confidenceScore: randConf,
        confidenceLevel: randConf >= 88 ? "Very Strong" : "Strong",
        scores: {
          trend: randTrendScore,
          volume: 72 + Math.floor(Math.random() * 20),
          pattern: 78 + Math.floor(Math.random() * 18),
          indicator: 68 + Math.floor(Math.random() * 25),
          momentum: 72 + Math.floor(Math.random() * 20)
        },
        probabilities: {
          bullish: trendBias === "Bullish" ? 72 + Math.floor(Math.random() * 15) : trendBias === "Bearish" ? 10 : 33,
          bearish: trendBias === "Bearish" ? 72 + Math.floor(Math.random() * 15) : trendBias === "Bullish" ? 10 : 33,
          neutral: trendBias === "Neutral" ? 55 + Math.floor(Math.random() * 15) : 10
        },
        marketStructure: [
          trendBias === "Bullish" 
            ? "Series of higher highs and higher lows established on the daily timeline" 
            : trendBias === "Bearish" 
              ? "Revisions of swing highs heading downwards within a distribution boundary" 
              : "Consolidation box with active liquidity pools at outer edge limits",
          `Key pivot support established at $${(basePrice * 0.985).toFixed(2)}`,
          `Volumetric buy profile active near the local baseline floor`
        ],
        patterns: [
          trendBias === "Bullish" 
            ? "Bull Flag accumulation breakout retest" 
            : trendBias === "Bearish" 
              ? "Double Top reversal neckline breakdown retest" 
              : "Symmetrical horizontal range bound oscillation",
          `Declining seller volume prior to localized core breakout signal`
        ],
        supportLevels: [
          `$${(basePrice * 0.98).toFixed(2)}`,
          `$${(basePrice * 0.95).toFixed(2)}`,
          `$${(basePrice * 0.91).toFixed(2)}`
        ],
        resistanceLevels: [
          `$${(basePrice * 1.02).toFixed(2)}`,
          `$${(basePrice * 1.05).toFixed(2)}`,
          `$${(basePrice * 1.09).toFixed(2)}`
        ],
        risk: randConf > 86 ? "Low" : randConf > 76 ? "Medium" : "High",
        entryZone: `$${(basePrice * 0.982).toFixed(2)} - $${(basePrice * 1.005).toFixed(2)}`,
        stopLoss: `$${(basePrice * 0.955).toFixed(2)}`,
        targets: [
          `$${(basePrice * 1.03).toFixed(2)}`,
          `$${(basePrice * 1.07).toFixed(2)}`,
          `$${(basePrice * 1.13).toFixed(2)}`
        ],
        riskRewardRatio: trendBias === "Bullish" ? "1:3.4" : trendBias === "Bearish" ? "1:2.9" : "1:1.6",
        indicators: {
          rsi: `RSI settles at ${trendBias === "Bullish" ? "56 with stable upward trajectory" : trendBias === "Bearish" ? "39 drifting down" : "49 flat equilibrium"}.`,
          macd: `MACD illustrates ${trendBias === "Bullish" ? "bullish divergence crossing the standard signal timeline" : trendBias === "Bearish" ? "bearish drop after retesting upper bounds" : "symmetrical convergence patterns in neutral zones"}.`,
          emas: `EMA 200 functions as key macro structural dynamic support level around $${(basePrice * 0.93).toFixed(2)}.`,
          bollinger: `Bollinger Bands show volatility contract, forming a classic squeeze prior to the trend extension.`,
          volume: `Institutional block trades report significant liquidity clustering supporting the immediate setup.`
        },
        recommendationText: `${trendBias} Technical Arrangement Active. Scale sizes with discipline near primary entries.`,
        analysisExplanation: `Custom synthesized diagnostic index for ${symbolClean}. Analysis maps critical horizontal levels and indicator coordination for immediate execution scenarios under ${timeframeStr} constraints.`,
        coachAdvice: `Strategic recommendation for ${symbolClean}: Place stop loss at $${(basePrice * 0.955).toFixed(2)} to protect your balance. Let technical setups stabilize fully prior to adding size. Keep risk disciplined.`
      };

      const newCore = {
        id: `custom-core-${symbolClean.toLowerCase()}-${Date.now()}`,
        name: `${symbolClean} (${timeframeStr} Custom Engine Core)`,
        category: ["BTC", "ETH", "SOL", "PEPE", "XRP"].includes(symbolClean) ? "Crypto" : "Stock",
        ticker: symbolClean,
        timeframe: timeframeStr,
        imageUrl: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&w=800&q=80",
        description: `Synthesized dynamic technical setup for ${symbolClean} on a ${timeframeStr} interval.`,
        presetReport: generatedReport
      };

      setActiveCores([newCore, ...activeCores]);
      setActivePresetId(newCore.id);
      setActiveReport(generatedReport);
      setUploadedImage(newCore.imageUrl);
      setIsProcessing(false);
    });
  };

  const handleAnalyzeDrawnSetup = (presetName: string, trend: "Bullish" | "Bearish") => {
    setActivePresetId("drawn-sandbox");
    triggerLoadingSteps(() => {
      const drawnReport: AnalysisReport = {
        asset: `${presetName} (Sandbox)`,
        timeframe: "1 Hour",
        trend: trend,
        confidenceScore: trend === "Bullish" ? 81 : 74,
        confidenceLevel: trend === "Bullish" ? "Strong" : "Strong",
        scores: {
          trend: trend === "Bullish" ? 85 : 80,
          volume: 70,
          pattern: 85,
          indicator: 75,
          momentum: 70
        },
        probabilities: {
          bullish: trend === "Bullish" ? 78 : 12,
          bearish: trend === "Bearish" ? 74 : 14,
          neutral: trend === "Bullish" ? 8 : 14
        },
        marketStructure: [
          `Custom support line aligned near localized candle bottoms.`,
          trend === "Bullish" 
            ? "Constructive shift in market structure: Higher Low series starting to manifest." 
            : "Dynamic breakdown confirmed: Price ruptured neckline with assertive high-volume push."
        ],
        patterns: [
          trend === "Bullish" ? "Ascending Triangle Accumulation Pattern" : "Double Top Rejection Formation"
        ],
        supportLevels: ["$195.00", "$188.00"],
        resistanceLevels: ["$212.00", "$220.00"],
        risk: trend === "Bullish" ? "Medium" : "High",
        entryZone: trend === "Bullish" ? "$198.00 - $202.00" : "$238.00 - $240.00",
        stopLoss: trend === "Bullish" ? "$194.00" : "$243.50",
        targets: trend === "Bullish" ? ["$208.00", "$215.00", "$225.00"] : ["$230.00", "$224.00", "$215.00"],
        riskRewardRatio: trend === "Bullish" ? "1:3.2" : "1:2.8",
        indicators: {
          rsi: `RSI is currently stabilizing near ${trend === "Bullish" ? "52" : "42"}, showing highly dynamic range allocation.`,
          macd: `MACD indicators show a localized ${trend === "Bullish" ? "bullish crossover" : "bearish separation"}.`,
          emas: `Price trading ${trend === "Bullish" ? "above support EMAs" : "below rejection averages"}.`,
          bollinger: "Slight Bollinger BB expansion verifying expansion volatility speeds.",
          volume: "Above-average volume confirm the localized breakout parameters."
        },
        recommendationText: `${trend} Action Detected from sandbox simulation.`,
        analysisExplanation: `Hand-drawn chart bounds have been digitized successfully. The scanner parsed candle levels to generate precise buy ranges.`,
        coachAdvice: `Drawn bounds align nicely with classical horizontal price gaps. Size conservatively during ranges.`
      };

      setActiveReport(drawnReport);
      setIsProcessing(false);
    });
  };

  const processRawFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Only images (PNG, JPG, WEBP) are supported.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setUploadedImage(dataUrl);
      setIsProcessing(true);
      setTimeout(() => {
        const fallbackReport: AnalysisReport = {
          ...SAMPLE_CHARTS[0].presetReport,
          asset: "Custom Uploaded Chart",
          analysisExplanation: "Visual report created for your uploaded asset screenshot. Key support and volume indicators mapped automatically."
        };
        setActiveReport(fallbackReport);
        setIsProcessing(false);
      }, 1500);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processRawFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in py-6">
      {/* Dynamic Navigation & Back Trigger */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
        <button
          onClick={() => setCurrentView("HOMEPAGE")}
          className="group flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 text-[10px] text-zinc-400 hover:text-white font-mono uppercase tracking-widest transition-all duration-200 cursor-pointer select-none"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-blue-500 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Homepage</span>
        </button>
        <div className="flex items-center gap-2 font-mono text-[9px] text-zinc-600 uppercase tracking-widest">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span>Workspace Active Session</span>
        </div>
      </div>

      {/* 2-Column Landing Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* PANEL 3: Manual Core Synthesizer */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-[#0c0c0f] border border-zinc-900 rounded-3xl p-6 text-left">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#0066ee] font-bold block mb-1">PRECISION ANALYTICS SYSTEM</span>
            <h3 className="text-xl font-display font-medium text-white">SaaS & Financial Key Indicators</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-2xl font-sans">Formulate instant analytical insights for equities, major indexes, or digital assets. Enter any ticker symbol to compile automated market indicators.</p>
          </div>

          <div className="bg-[#0b0b0d] p-6 rounded-3xl border border-zinc-900/80 flex flex-col justify-between text-left">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <input 
                  type="text" 
                  placeholder="e.g. BTC, NVDA, SOL"
                  value={customCoreTicker}
                  onChange={(e) => setCustomCoreTicker(e.target.value)}
                  className="w-full bg-zinc-950/80 border border-zinc-900 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-zinc-800 rounded-lg uppercase placeholder-zinc-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select value={customCoreTimeframe} onChange={(e) => setCustomCoreTimeframe(e.target.value)} className="bg-zinc-950 border border-zinc-900 px-2 py-1.5 rounded-lg text-xs font-mono text-zinc-300 focus:outline-none cursor-pointer">
                  <option value="5 Minute">5 Min</option>
                  <option value="15 Minute">15 Min</option>
                  <option value="1 Hour">1 Hour</option>
                  <option value="4 Hour">4 Hour</option>
                  <option value="Daily">Daily</option>
                </select>
                <select value={customCoreTrend} onChange={(e) => setCustomCoreTrend(e.target.value as any)} className="bg-zinc-950 border border-[#1b1b22] px-2 py-1.5 rounded-lg text-xs font-mono text-zinc-300 focus:outline-none cursor-pointer">
                  <option value="Bullish">Bullish</option>
                  <option value="Bearish">Bearish</option>
                  <option value="Neutral">Neutral</option>
                </select>
              </div>

              <button 
                onClick={() => {
                  if (!customCoreTicker.trim()) return;
                  handleSynthesizeCore(customCoreTicker, customCoreTimeframe, customCoreTrend);
                  setCustomCoreTicker("");
                }} 
                disabled={!customCoreTicker.trim()}
                className={`w-full py-2.5 font-bold font-mono text-xs uppercase tracking-wider rounded-xl transition-all ${customCoreTicker.trim() ? "bg-blue-600 hover:bg-blue-500 text-white cursor-pointer active:scale-95" : "bg-zinc-900 text-zinc-650 cursor-not-allowed"}`}
              >
                Synthesize Setup Matrix
              </button>
            </div>
          </div>
        </div>
      </div>

      {activeReport && (
        <CompanyLogoBanner assetName={activeReport.asset} timeframe={activeReport.timeframe} trend={activeReport.trend} />
      )}

      {/* Main Workstation Layout Tab segment */}
      <div id="active-workstation-dock" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start scroll-mt-24">
        {/* LEFT COLUMN: SCANNERS & NEWSFEED */}
        <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-28">
          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 space-y-4 text-left">
            <div>
              <span className="text-[9px] font-mono tracking-widest uppercase text-blue-500 font-extrabold block">Screen Grab Scanner</span>
              <h3 className="text-base font-display font-medium text-white">Import Custom Canvas</h3>
            </div>
            <div 
              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
              className={`p-6 border-2 border-dashed rounded-2xl text-center space-y-3 cursor-pointer transition-colors ${dragActive ? "border-blue-500 bg-blue-950/10" : "border-zinc-900 hover:border-zinc-800"}`}
            >
              <input type="file" id="drop-zone-file-input" accept="image/*" onChange={(e) => e.target.files?.[0] && processRawFile(e.target.files[0])} className="hidden" />
              <label htmlFor="drop-zone-file-input" className="cursor-pointer block space-y-2">
                <Upload className="h-6 w-6 text-zinc-500 mx-auto" />
                <p className="text-[11px] text-zinc-400">Drag screenshot here or <strong className="text-blue-500 hover:underline">browse files</strong></p>
              </label>
            </div>
          </div>

          {activeReport && (
            <div className="bg-zinc-950 border border-zinc-900 p-1 rounded-2xl overflow-hidden shadow-xl text-left">
              <div className="bg-zinc-900/30 p-4 border-b border-zinc-900">
                <span className="text-[9px] font-mono tracking-widest uppercase text-zinc-500 block mb-1">REALTIME SIGNALS</span>
                <h3 className="text-xs font-mono font-bold text-white tracking-tight">Grounded Feed Matrix</h3>
              </div>
              <div className="p-4 bg-zinc-950"><NewsWidget assetName={activeReport.asset} /></div>
            </div>
          )}

          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 space-y-3 shadow-2xl relative overflow-hidden text-left">
            <span className="text-[9px] font-mono tracking-widest uppercase text-blue-500 font-extrabold block">DISCOVER INSTRUMENT</span>
            <h3 className="text-lg font-display font-semibold text-white tracking-tight">Custom Setup Sandbox</h3>
            <ChartSandbox onAnalyzeDrawnSetup={handleAnalyzeDrawnSetup} isProcessing={isProcessing} />
          </div>
        </div>

        {/* RIGHT COLUMN: CORE WORKSTATION COCKPIT */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          <div className="flex bg-[#070708] border border-zinc-900 p-1 rounded-xl gap-2 font-mono text-[10.5px] overflow-x-auto scrollbar-none">
            <button onClick={() => setActiveTab("CHART")} className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${activeTab === "CHART" ? "bg-zinc-900 text-blue-400 border border-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}>
              <LineChart className="h-4 w-4" /><span>Live Chart</span>
            </button>
            <button onClick={() => setActiveTab("REPORT")} className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${activeTab === "REPORT" ? "bg-zinc-900 text-blue-400 border border-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}>
              <BarChart3 className="h-4 w-4" /><span>Executive Analysis</span>
            </button>
            <button onClick={() => setActiveTab("SIMULATOR")} className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${activeTab === "SIMULATOR" ? "bg-zinc-900 text-blue-400 border border-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}>
              <Compass className="h-4 w-4" /><span>Backtester</span>
            </button>
            <button onClick={() => setActiveTab("COACH")} className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${activeTab === "COACH" ? "bg-zinc-900 text-blue-400 border border-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}>
              <BookOpen className="h-4 w-4" /><span>AI Coach</span>
            </button>
            <button onClick={() => setActiveTab("DASHBOARD")} className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${activeTab === "DASHBOARD" ? "bg-zinc-900 text-blue-400 border border-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}>
              <Sparkles className="h-4 w-4" /><span>AI Dashboard</span>
            </button>
            <button onClick={() => setActiveTab("MULTITOOL")} className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${activeTab === "MULTITOOL" ? "bg-zinc-900 text-[#00c8ff] border border-blue-500/20 shadow-[0_0_15px_rgba(0,190,255,0.15)]" : "text-zinc-500 hover:text-zinc-300"}`}>
              <Sparkle className="h-4 w-4 text-[#00c8ff]" /><span>AI Studio</span>
            </button>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 sm:p-8 relative min-h-[460px] shadow-3xl text-left overflow-hidden">
            {tabLoading ? (
              <div className="space-y-6 animate-fade-in p-2 text-left">
                {activeTab === "CHART" && (
                  <div className="w-full space-y-4">
                    <SkeletonBlock h={40} w="40%" />
                    <SkeletonBlock h={280} w="100%" />
                    <SkeletonBlock h={20} w="70%" />
                  </div>
                )}
                {activeTab === "REPORT" && (
                  <div className="w-full space-y-4">
                    <div className="flex justify-between items-center bg-zinc-900/30 p-4 rounded-xl border border-zinc-900">
                      <SkeletonBlock h={16} w="25%" />
                      <SkeletonBlock h={16} w="15%" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SkeletonBlock h={120} />
                      <SkeletonBlock h={120} />
                    </div>
                  </div>
                )}
                {activeTab === "SIMULATOR" && (
                  <div className="w-full space-y-4">
                    <SkeletonBlock h={60} w="100%" />
                    <SkeletonBlock h={140} w="100%" />
                  </div>
                )}
                {activeTab === "COACH" && (
                  <div className="w-full space-y-5">
                    <div className="flex gap-3"><SkeletonBlock h={36} w={36} /><SkeletonBlock h={48} w="60%" /></div>
                    <div className="flex gap-3 justify-end"><SkeletonBlock h={48} w="55%" /><SkeletonBlock h={36} w={36} /></div>
                  </div>
                )}
                {activeTab === "DASHBOARD" && (
                  <div className="w-full space-y-6">
                    <SkeletonBlock h={50} w="60%" />
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <SkeletonBlock h={90} />
                      <SkeletonBlock h={90} />
                      <SkeletonBlock h={90} />
                      <SkeletonBlock h={90} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <SkeletonBlock h={180} />
                      <SkeletonBlock h={180} />
                    </div>
                  </div>
                )}
                {activeTab === "MULTITOOL" && (
                  <div className="w-full space-y-6">
                    <SkeletonBlock h={30} w="30%" />
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      <div className="lg:col-span-4"><SkeletonBlock h={300} /></div>
                      <div className="lg:col-span-8"><SkeletonBlock h={300} /></div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="animate-fade-in relative z-10">
                {activeTab === "CHART" && activeReport && <TradingViewChart symbol={activeReport.asset} />}
                {activeTab === "REPORT" && activeReport && <ReportViewer report={activeReport} />}
                {activeTab === "SIMULATOR" && activeReport && <BacktestSimulator report={activeReport} />}
                {activeTab === "COACH" && activeReport && <TradeCoachChat report={activeReport} />}
                {activeTab === "DASHBOARD" && <DashboardViewer />}
                {activeTab === "MULTITOOL" && <AiMultitoolSuite />}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export { WorkspacePage };
