/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AnalysisReport } from "../types";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  CheckCircle, 
  ShieldAlert, 
  Target, 
  Compass, 
  Activity, 
  Sparkles,
  Info
} from "lucide-react";

interface ReportViewerProps {
  report: AnalysisReport;
}

export default function ReportViewer({ report }: ReportViewerProps) {
  const gaugeData = [
    {
      name: "Confidence",
      value: report.confidenceScore,
      fill: report.confidenceScore >= 85 ? "#22c55e" : report.confidenceScore >= 65 ? "#10b981" : report.confidenceScore >= 45 ? "#f59e0b" : "#ef4444"
    }
  ];
  const isBullish = report.trend === "Bullish";
  const isBearish = report.trend === "Bearish";

  // Color mappings
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

  return (
    <div id="report-view-container" className="space-y-6">
      {/* Target Asset Title & Timeframe Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-850 pb-5">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold block mb-1">
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

        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border ${trendBgColor}`}>
          {isBullish ? (
            <TrendingUp className="h-5 w-5 stroke-[2.5]" />
          ) : isBearish ? (
            <TrendingDown className="h-5 w-5 stroke-[2.5]" />
          ) : (
            <Minus className="h-5 w-5 stroke-[2.5]" />
          )}
          <div className="text-left">
            <span className="text-[10px] block uppercase font-mono tracking-widest text-slate-400">Trend Bias</span>
            <span className="text-base font-bold tracking-wide">{report.trend} Setup</span>
          </div>
        </div>
      </div>

      {/* Probabilities Metric Segment slider */}
      <div className="bg-[#18181b]/55 border border-zinc-800 p-5 space-y-4 rounded-xl">
        <div className="flex items-center justify-between">
          <h4 className="text-xs uppercase font-mono tracking-wider font-semibold text-zinc-400">
            Setup Directional Probabilities
          </h4>
          <span className="text-xs text-zinc-500 font-mono">Sum: 100%</span>
        </div>
        
        {/* Custom Segmented Horizontal Bar */}
        <div className="relative h-4 rounded-full overflow-hidden flex bg-[#09090b] border border-zinc-800">
          <div 
            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500 ease-out" 
            style={{ width: `${report.probabilities.bullish}%` }}
            title={`Bullish Probability: ${report.probabilities.bullish}%`}
          />
          <div 
            className="h-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-500 ease-out" 
            style={{ width: `${report.probabilities.bearish}%` }}
            title={`Bearish Probability: ${report.probabilities.bearish}%`}
          />
          <div 
            className="h-full bg-gradient-to-r from-zinc-650 to-zinc-500 transition-all duration-500 ease-out" 
            style={{ width: `${report.probabilities.neutral}%` }}
            title={`Neutral Probability: ${report.probabilities.neutral}%`}
          />
        </div>

        {/* Labels Block */}
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

      {/* Grid: Confidence Engine & Key Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Confidence Engine Breakdown Panel */}
        <div className="bg-[#18181b]/55 border border-zinc-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              <h4 className="text-xs uppercase font-mono tracking-wider font-semibold text-zinc-400">
                AI Confidence Engine
              </h4>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold border ${confidenceColor}`}>
              {report.confidenceLevel}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2 bg-[#09090b]/40 rounded-xl p-4 border border-zinc-900/60 shadow-inner">
            <div className="relative flex items-center justify-center w-[160px] h-[110px] overflow-hidden shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="100%"
                  innerRadius="75%"
                  outerRadius="98%"
                  barSize={12}
                  data={gaugeData}
                  startAngle={180}
                  endAngle={0}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    angleAxisId={0}
                    tick={false}
                  />
                  <RadialBar
                    background={{ fill: "#27272a" }}
                    dataKey="value"
                    cornerRadius={8}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute bottom-1 text-center">
                <span className="text-3xl font-black font-mono text-zinc-100 block tracking-tight leading-none mb-0.5">
                  {report.confidenceScore}%
                </span>
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-mono font-semibold">
                  Score Strength
                </span>
              </div>
            </div>
            <p className="flex-1 text-xs text-zinc-400 leading-relaxed text-center sm:text-left">
              Confidence score is dynamically derived from custom algorithmic weights assigned to indicators, volume confirmation parameters, structural trend vectors, and pattern clarity metrics.
            </p>
          </div>

          <div className="space-y-4.5 pt-2 font-mono text-xs">
            {/* Trend Score */}
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-zinc-500">Trend Score (30%)</span>
                <span className="text-zinc-300">{report.scores.trend}/100</span>
              </div>
              <div className="h-1.5 bg-[#09090b] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${report.scores.trend}%` }} />
              </div>
            </div>
            {/* Volume Score */}
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-zinc-500">Volume Score (20%)</span>
                <span className="text-zinc-300">{report.scores.volume}/100</span>
              </div>
              <div className="h-1.5 bg-[#09090b] rounded-full overflow-hidden">
                <div className="h-full bg-teal-500" style={{ width: `${report.scores.volume}%` }} />
              </div>
            </div>
            {/* Pattern Score */}
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-zinc-500">Pattern Score (20%)</span>
                <span className="text-zinc-300">{report.scores.pattern}/100</span>
              </div>
              <div className="h-1.5 bg-[#09090b] rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: `${report.scores.pattern}%` }} />
              </div>
            </div>
            {/* Indicator Score */}
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-zinc-500">Indicator Score (15%)</span>
                <span className="text-zinc-300">{report.scores.indicator}/100</span>
              </div>
              <div className="h-1.5 bg-[#09090b] rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500" style={{ width: `${report.scores.indicator}%` }} />
              </div>
            </div>
            {/* Momentum Score */}
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-zinc-500">Momentum Score (15%)</span>
                <span className="text-zinc-300">{report.scores.momentum}/100</span>
              </div>
              <div className="h-1.5 bg-[#09090b] rounded-full overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: `${report.scores.momentum}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Actionable Trading Layout Box */}
        <div className="bg-[#18181b]/55 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3">
              <Target className="h-4 w-4 text-emerald-400" />
              <h4 className="text-xs uppercase font-mono tracking-wider font-semibold text-zinc-400">
                Core Trading Layout
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#09090b]/60 p-3 rounded-lg border border-zinc-850">
                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">Entry Zone</span>
                <p className="text-sm font-bold font-mono text-emerald-400 mt-1">{report.entryZone}</p>
              </div>
              <div className="bg-[#09090b]/60 p-3 rounded-lg border border-zinc-850">
                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">Stop Loss</span>
                <p className="text-sm font-bold font-mono text-rose-400 mt-1">{report.stopLoss}</p>
              </div>
            </div>

            {/* Profit Targets Stack */}
            <div className="bg-[#09090b]/40 p-3.5 rounded-lg border border-zinc-850 space-y-2.5">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block border-b border-zinc-800 pb-1">
                Calculated Targets Sequence
              </span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-1">
                <div className="bg-[#18181b]/60 p-2 rounded border border-zinc-800">
                  <span className="block text-[8px] text-zinc-500 uppercase tracking-tight">Target 1</span>
                  <span className="font-semibold text-zinc-200">{report.targets?.[0] || "N/A"}</span>
                </div>
                <div className="bg-[#18181b]/60 p-2 rounded border border-zinc-800">
                  <span className="block text-[8px] text-zinc-500 uppercase tracking-tight">Target 2</span>
                  <span className="font-semibold text-zinc-200">{report.targets?.[1] || "N/A"}</span>
                </div>
                <div className="bg-[#18181b]/60 p-2 rounded border border-zinc-800">
                  <span className="block text-[8px] text-zinc-500 uppercase tracking-tight">Target 3</span>
                  <span className="font-semibold text-zinc-200">{report.targets?.[2] || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-850 flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-500">Risk/Reward Profile</span>
            <span className="text-zinc-200 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/20 font-bold">
              {report.riskRewardRatio} R:R Ratio
            </span>
          </div>
        </div>
      </div>

      {/* Market Structure & Pattern Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Support & Resistance Table */}
        <div className="bg-[#18181b]/40 border border-zinc-800 rounded-xl p-5 space-y-4">
          <h4 className="text-xs uppercase font-mono tracking-wider font-bold text-zinc-400">
            Horizontal Levels
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">Support Pillars</span>
              <ul className="space-y-1.5 font-mono text-xs">
                {report.supportLevels?.map((lvl, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-emerald-400 bg-emerald-950/20 px-2.5 py-1.5 rounded border border-emerald-900/30">
                    <span className="text-[9px] text-zinc-500 font-bold">S{idx + 1}</span>
                    <span className="font-bold">{lvl}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">Resistance Barriers</span>
              <ul className="space-y-1.5 font-mono text-xs">
                {report.resistanceLevels?.map((lvl, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-rose-400 bg-rose-950/20 px-2.5 py-1.5 rounded border border-rose-900/30">
                    <span className="text-[9px] text-zinc-500 font-bold">R{idx + 1}</span>
                    <span className="font-bold">{lvl}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Patterns & Reversal Structures */}
        <div className="bg-[#18181b]/40 border border-zinc-800 rounded-xl p-5 space-y-4">
          <h4 className="text-xs uppercase font-mono tracking-wider font-bold text-zinc-400">
            Structural Formations
          </h4>
          <div className="space-y-3.5 text-xs text-zinc-300">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block mb-1.5">Detected Patterns</span>
              <div className="flex flex-wrap gap-1.5">
                {report.patterns?.map((pat, idx) => (
                  <span key={idx} className="bg-zinc-900 text-zinc-300 border border-zinc-800 px-2.5 py-1 rounded text-[11px] font-mono leading-tight">
                    • {pat}
                  </span>
                ))}
              </div>
            </div>
            <div className="border-t border-zinc-800/50 pt-3">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block mb-1.5">Market Structure</span>
              <ul className="space-y-1.5 list-disc list-inside text-zinc-300 font-sans leading-relaxed">
                {report.marketStructure?.map((item, idx) => (
                  <li key={idx} className="text-[11px] list-none flex items-start gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Indicators console table */}
      <div className="bg-[#18181b]/40 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="bg-zinc-900/60 border-b border-zinc-800 px-5 py-3 flex items-center justify-between">
          <h4 className="text-xs uppercase font-mono tracking-wider font-bold text-zinc-400">
            Technical Oscillators & Indicator Matrix
          </h4>
          <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-800/20">
            Simultaneous Analytics
          </span>
        </div>
        <div className="divide-y divide-zinc-800/60 border-t border-zinc-800/45 text-xs">
          {/* RSI */}
          <div className="grid grid-cols-1 sm:grid-cols-4 p-4 gap-2">
            <span className="font-mono font-semibold text-zinc-500 sm:col-span-1">RSI (Relative Strength)</span>
            <span className="text-zinc-200 sm:col-span-3 leading-relaxed">{report.indicators.rsi}</span>
          </div>
          {/* MACD */}
          <div className="grid grid-cols-1 sm:grid-cols-4 p-4 gap-2">
            <span className="font-mono font-semibold text-zinc-500 sm:col-span-1">MACD (Crossovers)</span>
            <span className="text-zinc-200 sm:col-span-3 leading-relaxed">{report.indicators.macd}</span>
          </div>
          {/* EMAs */}
          <div className="grid grid-cols-1 sm:grid-cols-4 p-4 gap-2">
            <span className="font-mono font-semibold text-zinc-500 sm:col-span-1">Moving Averages</span>
            <span className="text-zinc-200 sm:col-span-3 leading-relaxed">{report.indicators.emas}</span>
          </div>
          {/* Bollinger Bands */}
          <div className="grid grid-cols-1 sm:grid-cols-4 p-4 gap-2">
            <span className="font-mono font-semibold text-zinc-500 sm:col-span-1">Bollinger Bands</span>
            <span className="text-zinc-200 sm:col-span-3 leading-relaxed">{report.indicators.bollinger}</span>
          </div>
          {/* Volume */}
          <div className="grid grid-cols-1 sm:grid-cols-4 p-4 gap-2">
            <span className="font-mono font-semibold text-zinc-500 sm:col-span-1">Volume Oscillations</span>
            <span className="text-zinc-200 sm:col-span-3 leading-relaxed">{report.indicators.volume}</span>
          </div>
        </div>
      </div>

      {/* Visual Report Explanation Box */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <h4 className="text-sm font-semibold text-zinc-200">
            AI Structural Narrative Explanation
          </h4>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed font-sans font-normal">
          {report.analysisExplanation}
        </p>
      </div>

      {/* Safety Compliance Banner */}
      <div className="bg-rose-950/20 border border-rose-900/30 rounded-xl p-4 flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-rose-400 block">
            Disclaimer & Regulatory Warning
          </span>
          <p className="text-[11px] text-slate-400 leading-normal">
            AI-generated analysis is for educational and informational purposes only and should not be considered financial advice. Markets involve risk and losses may occur. Always verify with official broker logs and execute custom research before trade allocations.
          </p>
        </div>
      </div>
    </div>
  );
}
