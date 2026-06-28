import React from "react";
import { AnalysisReport } from "../../types";

interface IndicatorListProps {
  report: AnalysisReport;
}

export default function IndicatorList({ report }: IndicatorListProps) {
  const indicatorsData = [
    { name: "RSI (Relative Strength)", val: report.indicators.rsi },
    { name: "MACD (Crossovers)", val: report.indicators.macd },
    { name: "Moving Averages", val: report.indicators.emas },
    { name: "Bollinger Bands", val: report.indicators.bollinger },
    { name: "Volume Oscillations", val: report.indicators.volume },
  ];

  return (
    <div className="bg-[#18181b]/40 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="bg-zinc-900/60 border-b border-zinc-800 px-5 py-3 flex items-center justify-between text-left">
        <h4 className="text-xs uppercase font-mono tracking-wider font-bold text-zinc-400">
          Technical Oscillators & Indicator Matrix
        </h4>
        <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-800/20">
          Simultaneous Analytics
        </span>
      </div>
      <div className="divide-y divide-zinc-800/60 border-t border-zinc-800/45 text-xs text-left">
        {indicatorsData.map((ind, index) => (
          <div key={index} className="grid grid-cols-1 sm:grid-cols-4 p-4 gap-2">
            <span className="font-mono font-semibold text-zinc-500 sm:col-span-1">{ind.name}</span>
            <span className="text-zinc-200 sm:col-span-3 leading-relaxed">{ind.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
