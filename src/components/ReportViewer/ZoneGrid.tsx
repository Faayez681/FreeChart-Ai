import React from "react";
import { CheckCircle } from "lucide-react";
import { AnalysisReport } from "../../types";

interface ZoneGridProps {
  report: AnalysisReport;
}

export default function ZoneGrid({ report }: ZoneGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Support & Resistance Table */}
      <div className="bg-[#18181b]/40 border border-zinc-800 rounded-xl p-5 space-y-4 text-left">
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
      <div className="bg-[#18181b]/40 border border-zinc-800 rounded-xl p-5 space-y-4 text-left">
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
  );
}
