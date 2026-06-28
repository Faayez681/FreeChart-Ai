import React from "react";
import { TrendingUp, TrendingDown, Minus, Activity, FileText, Download } from "lucide-react";
import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import { AnalysisReport } from "../../types";

interface PatternHeaderProps {
  report: AnalysisReport;
  viewMode: "interactive" | "briefing";
  setViewMode: (mode: "interactive" | "briefing") => void;
  onDownloadPDF: () => void;
}

export default function PatternHeader({ report, viewMode, setViewMode, onDownloadPDF }: PatternHeaderProps) {
  const isBullish = report.trend === "Bullish";
  const isBearish = report.trend === "Bearish";

  const trendBgColor = isBullish 
    ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400" 
    : isBearish 
      ? "bg-rose-950/40 border-rose-500/30 text-rose-400" 
      : "bg-slate-900 border-slate-700/60 text-slate-300";

  const confidenceColor = 
    report.confidenceLevel === "Very Strong" ? "text-cyan-400 border-cyan-500/30 bg-cyan-950/20" :
    report.confidenceLevel === "Strong" ? "text-emerald-400 border-emerald-500/30 bg-emerald-950/20" :
    report.confidenceLevel === "Moderate" ? "text-amber-400 border-amber-500/30 bg-amber-950/20" :
    "text-rose-400 border-rose-500/30 bg-rose-950/20";

  const gaugeData = [{ name: "Confidence", value: report.confidenceScore, fill: report.confidenceScore >= 85 ? "#22c55e" : report.confidenceScore >= 65 ? "#10b981" : report.confidenceScore >= 45 ? "#f59e0b" : "#ef4444" }];

  return (
    <div className="space-y-6">
      {/* Title & Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div className="text-left">
          <span className="font-mono text-xs uppercase tracking-widest text-[#22c55e] font-bold block mb-1">
            ✨ Technical Intelligence Scan Complete
          </span>
          <h2 className="text-2xl font-bold font-sans text-zinc-100 tracking-tight">
            {report.asset}
          </h2>
          <div className="flex items-center gap-2 mt-1.5 text-zinc-400 text-xs font-mono">
            <span>Interval: <strong className="text-zinc-200">{report.timeframe}</strong></span>
            <span>•</span>
            <span>Risk Index: <strong className={`px-2 py-0.5 rounded text-[10px] ${report.risk === "High" ? "bg-rose-950 text-rose-300" : "bg-emerald-950 text-emerald-300"}`}>{report.risk}</strong></span>
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-2 shrink-0">
          <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border ${trendBgColor}`}>
            {isBullish ? <TrendingUp className="h-5 w-5 stroke-[2.5]" /> : isBearish ? <TrendingDown className="h-5 w-5 stroke-[2.5]" /> : <Minus className="h-5 w-5 stroke-[2.5]" />}
            <div className="text-left">
              <span className="text-[10px] block uppercase font-mono tracking-widest text-slate-400">Trend Bias</span>
              <span className="text-base font-bold tracking-wide">{report.trend} Setup</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 justify-end">
            <div className="flex items-center gap-1 p-0.5 bg-[#09090b] border border-zinc-800 rounded-md font-mono text-[10px]">
              <button
                role="tab"
                aria-selected={viewMode === "interactive"}
                onClick={() => setViewMode("interactive")}
                className={`py-1 px-2.5 rounded transition-all flex items-center gap-1 cursor-pointer ${viewMode === "interactive" ? "bg-zinc-800 text-[#fafafa] font-bold" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <Activity className="h-3 w-3" />
                <span>DASHBOARD</span>
              </button>
              <button
                role="tab"
                aria-selected={viewMode === "briefing"}
                onClick={() => setViewMode("briefing")}
                className={`py-1 px-2.5 rounded transition-all flex items-center gap-1 cursor-pointer ${viewMode === "briefing" ? "bg-zinc-800 text-cyan-400 font-bold" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <FileText className="h-3 w-3" />
                <span>RAW BRIEFING</span>
              </button>
            </div>

            <button
              aria-label="Download briefing report as PDF document"
              onClick={onDownloadPDF}
              className="py-1.5 px-3 rounded-md border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-950/60 active:scale-95 text-[10px] uppercase font-mono tracking-wider font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Download className="h-3.5 w-3.5 text-emerald-400 stroke-[2.5]" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      {viewMode === "interactive" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#18181b]/55 border border-zinc-800 p-5 space-y-4 rounded-xl text-left">
            <div className="flex items-center justify-between">
              <h4 className="text-xs uppercase font-mono tracking-wider font-semibold text-zinc-400">Setup Directional Probabilities</h4>
              <span className="text-xs text-zinc-500 font-mono">Sum: 100%</span>
            </div>
            <div className="relative h-4 rounded-full overflow-hidden flex bg-[#09090b] border border-zinc-800">
              <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500 ease-out" style={{ width: `${report.probabilities.bullish}%` }} />
              <div className="h-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-500 ease-out" style={{ width: `${report.probabilities.bearish}%` }} />
              <div className="h-full bg-gradient-to-r from-zinc-650 to-zinc-500 transition-all duration-500 ease-out" style={{ width: `${report.probabilities.neutral}%` }} />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-1">
              <div className="p-2 rounded bg-emerald-950/20 border border-emerald-900/30 text-emerald-400">
                <span className="block text-[10px] text-zinc-500 uppercase tracking-tight">Bullish Bias</span>
                <span className="text-sm font-bold">{report.probabilities.bullish}%</span>
              </div>
              <div className="p-2 rounded bg-rose-950/20 border border-rose-900/30 text-rose-400">
                <span className="block text-[10px] text-zinc-500 uppercase tracking-tight">Bearish Bias</span>
                <span className="text-sm font-bold">{report.probabilities.bearish}%</span>
              </div>
              <div className="p-2 rounded bg-[#09090b] border border-zinc-800/60 text-zinc-300">
                <span className="block text-[10px] text-zinc-500 uppercase tracking-tight">Neutral Bias</span>
                <span className="text-sm font-bold">{report.probabilities.neutral}%</span>
              </div>
            </div>
          </div>

          <div className="bg-[#18181b]/55 border border-zinc-800 rounded-xl p-5 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-400" />
                <h4 className="text-xs uppercase font-mono tracking-wider font-semibold text-zinc-400">AI Confidence Engine</h4>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold border ${confidenceColor}`}>{report.confidenceLevel}</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2 bg-[#09090b]/40 rounded-xl p-4 border border-zinc-900/60 shadow-inner">
              <div className="relative flex items-center justify-center w-[160px] h-[110px] overflow-hidden shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="100%" innerRadius="75%" outerRadius="98%" barSize={12} data={gaugeData} startAngle={180} endAngle={0}>
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar background={{ fill: "#27272a" }} dataKey="value" cornerRadius={8} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute bottom-1 text-center">
                  <span className="text-3xl font-black font-mono text-zinc-100 block tracking-tight leading-none mb-0.5">{report.confidenceScore}%</span>
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-mono font-semibold">Score Strength</span>
                </div>
              </div>
              <p className="flex-1 text-[11px] text-zinc-400 leading-relaxed text-center sm:text-left">
                Confidence score is dynamically derived from custom algorithmic weights assigned to indicators, volume confirmation parameters, structural trend vectors, and pattern clarity metrics.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
