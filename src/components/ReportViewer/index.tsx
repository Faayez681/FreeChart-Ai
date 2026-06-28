import React, { useState } from "react";
import { ReportViewerProps } from "../../types";
import { ShieldAlert, Terminal, Copy, Check } from "lucide-react";
import PatternHeader from "./PatternHeader";
import ZoneGrid from "./ZoneGrid";
import RiskPanel from "./RiskPanel";
import IndicatorList from "./IndicatorList";
import { downloadPDFReport } from "./pdfGenerator";

export default function ReportViewer({ report }: ReportViewerProps) {
  const [viewMode, setViewMode] = useState<"interactive" | "briefing">("interactive");
  const [copied, setCopied] = useState(false);

  const rawBriefingText = `# Technical Intelligence Report
Asset: ${report.asset} | Trend: ${report.trend.toUpperCase()} | Score: ${report.confidenceScore}% (${report.confidenceLevel})\n\nEntry Zone: ${report.entryZone}\nStop Loss: ${report.stopLoss}${report.targets?.map((t, idx) => `\nTarget ${idx + 1}: ${t}`).join("")}\n\nDisclaimer: Educational only. Not advisory.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(rawBriefingText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="report-view-container" className="space-y-6">
      <PatternHeader report={report} viewMode={viewMode} setViewMode={setViewMode} onDownloadPDF={() => downloadPDFReport(report)} />

      {viewMode === "interactive" ? (
        <>
          <RiskPanel report={report} />
          <ZoneGrid report={report} />
          <IndicatorList report={report} />
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3 text-left">
            <h4 className="text-sm font-semibold text-zinc-200">AI Structural Narrative Explanation</h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">{report.analysisExplanation}</p>
          </div>
        </>
      ) : (
        <div className="bg-[#09090b] border border-zinc-800 rounded-xl overflow-hidden font-mono text-xs">
          <div className="bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between">
            <span className="text-zinc-300 font-bold">Institutional Briefing Log</span>
            <button onClick={handleCopy} className="px-3 py-1.5 rounded-md border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 flex items-center gap-1.5 cursor-pointer active:scale-95">
              {copied ? <><Check className="h-3.5 w-3.5 text-emerald-400" /><span>Copied</span></> : <><Copy className="h-3.5 w-3.5" /><span>Copy Report</span></>}
            </button>
          </div>
          <pre className="p-6 overflow-x-auto text-left leading-relaxed whitespace-pre-wrap text-zinc-300 bg-[#0c0c0e]">{rawBriefingText}</pre>
        </div>
      )}

      <div className="bg-rose-950/20 border border-rose-900/30 rounded-xl p-4 flex items-start gap-3 text-left">
        <ShieldAlert className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-rose-400 block font-sans">Disclaimer & Regulatory Warning</span>
          <p className="text-[11px] text-zinc-500 leading-normal font-sans">AI-generated analysis is for educational and informational purposes only and should not be considered financial advice. Markets involve risk and losses may occur.</p>
        </div>
      </div>
    </div>
  );
}
export { default as PatternHeader } from "./PatternHeader";
export { default as ZoneGrid } from "./ZoneGrid";
export { default as RiskPanel } from "./RiskPanel";
export { default as IndicatorList } from "./IndicatorList";
export { downloadPDFReport } from "./pdfGenerator";
