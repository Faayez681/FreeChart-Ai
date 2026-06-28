import React from "react";
import { Target, Activity } from "lucide-react";
import { AnalysisReport } from "../../types";

interface RiskPanelProps {
  report: AnalysisReport;
}

export default function RiskPanel({ report }: RiskPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Metrics breakdown details list */}
      <div className="bg-[#18181b]/55 border border-zinc-800 rounded-xl p-5 space-y-4 text-left">
        <h4 className="text-xs uppercase font-mono tracking-wider font-semibold text-zinc-400 border-b border-zinc-800/80 pb-3">
          Algorithmic Weighted Scores
        </h4>
        <div className="space-y-4 pt-1 font-mono text-xs">
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
              <div className="h-full bg-[#10b981]" style={{ width: `${report.scores.volume}%` }} />
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
            <div className="flex justify-between mb-1.5 font-mono text-xs">
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
      <div className="bg-[#18181b]/55 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between text-left">
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3">
            <Target className="h-4 w-4 text-emerald-400" />
            <h4 className="text-xs uppercase font-mono tracking-wider font-semibold text-zinc-400">
              Core Position Plan Layout
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#09090b]/60 p-3 rounded-lg border border-zinc-800/80">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">Entry Zone</span>
              <p className="text-sm font-bold font-mono text-emerald-400 mt-1">{report.entryZone}</p>
            </div>
            <div className="bg-[#09090b]/60 p-3 rounded-lg border border-zinc-800/80">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">Stop Loss</span>
              <p className="text-sm font-bold font-mono text-rose-400 mt-1">{report.stopLoss}</p>
            </div>
          </div>

          {/* Profit Targets Stack */}
          <div className="bg-[#09090b]/40 p-3.5 rounded-lg border border-zinc-800/80 space-y-2.5">
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

        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-500">Risk/Reward Profile</span>
          <span className="text-zinc-200 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/20 font-bold">
            {report.riskRewardRatio} R:R Ratio
          </span>
        </div>
      </div>
    </div>
  );
}
