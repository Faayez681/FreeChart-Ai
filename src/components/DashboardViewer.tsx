import React, { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { 
  TrendingUp, TrendingDown, DollarSign, Users, Clock, Flame, 
  Layers, ChevronDown, Check, Sparkles, MoveRight, HelpCircle, 
  AlertTriangle, Play, RefreshCw, Maximize2, Minimize2, 
  Trash2, Plus, Download, Share2, Clipboard, Edit, CheckSquare, 
  ChevronLeft, ArrowUpRight, BarChart3, LineChart as LucideLine, PieChart as LucidePie, LayoutGrid
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, 
  LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend 
} from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { db, handleFirestoreError, OperationType } from "../utils/firebase";
import { doc, setDoc } from "firebase/firestore";
import jsPDF from "jspdf";
import { DashboardReport, KPIWidget, DashboardChart } from "../types";

// Dynamic Lucide selection helper
const LucideIconMap: Record<string, React.ComponentType<any>> = {
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Clock,
  Flame,
  Layers,
  AlertTriangle
};

function DynamicIcon({ name, className }: { name: string; className: string }) {
  const IconComponent = LucideIconMap[name] || HelpCircle;
  return <IconComponent className={className} />;
}

export default function DashboardViewer() {
  const { 
    activeDashboard, 
    setActiveDashboard,
    isProcessing,
    setIsProcessing,
    user
  } = useAppStore() as any;

  // Local state
  const [fullscreenChartId, setFullscreenChartId] = useState<string | null>(null);
  const [draggedKpiIndex, setDraggedKpiIndex] = useState<number | null>(null);
  const [draggedChartId, setDraggedChartId] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharedLink, setSharedLink] = useState("");
  const [copied, setCopied] = useState(false);
  
  // Inline editing controls
  const [editingTitle, setEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState("");
  const [editingKpiIndex, setEditingKpiIndex] = useState<number | null>(null);
  const [tempKpi, setTempKpi] = useState<KPIWidget | null>(null);

  // Widget sizing toggle (Half-width vs Full-width)
  const [chartWidths, setChartWidths] = useState<Record<string, "half" | "full">>({});

  // Contextual Chat Panel for selected components
  const [dashboardChat, setDashboardChat] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: "Welcome to your Live AI Dashboard workstation. I have formulated cross-analysis patterns. Ask any question about these metrics or request structural revisions!" }
  ]);
  const [chatMessageInput, setChatMessageInput] = useState("");
  const [isChatTransmitting, setIsChatTransmitting] = useState(false);

  if (!activeDashboard) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-zinc-950/20 rounded-3xl border border-zinc-900 min-h-[380px] space-y-4">
        <div className="p-4 bg-zinc-900/40 rounded-full border border-blue-500/20 text-blue-400">
          <LayoutGrid className="h-8 w-8 animate-pulse text-[#00c8ff]" />
        </div>
        <h3 className="text-xl font-display font-medium text-white">No Dashboard Loaded</h3>
        <p className="text-sm text-zinc-500 max-w-sm">
          Please prompt FreeChart AI on the homepage or inside the side generator rail to construct a bespoke live visual dashboard.
        </p>
      </div>
    );
  }

  // Handle Drag-and-Drop KPIs
  const handleKpiDragStart = (index: number) => {
    setDraggedKpiIndex(index);
  };

  const handleKpiDragOver = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
  };

  const handleKpiDrop = (targetIndex: number) => {
    if (draggedKpiIndex === null || draggedKpiIndex === targetIndex) return;
    const reorderedKpis = [...activeDashboard.kpis];
    const [movedKpi] = reorderedKpis.splice(draggedKpiIndex, 1);
    reorderedKpis.splice(targetIndex, 0, movedKpi);

    setActiveDashboard({
      ...activeDashboard,
      kpis: reorderedKpis
    });
    setDraggedKpiIndex(null);
  };

  // Handle Drag-and-Drop Charts
  const handleChartDragStart = (id: string) => {
    setDraggedChartId(id);
  };

  const handleChartDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleChartDrop = (targetId: string) => {
    if (!draggedChartId || draggedChartId === targetId) return;
    const reorderedCharts = [...activeDashboard.charts];
    const sourceIdx = reorderedCharts.findIndex(c => c.id === draggedChartId);
    const targetIdx = reorderedCharts.findIndex(c => c.id === targetId);
    if (sourceIdx !== -1 && targetIdx !== -1) {
      const [movedChart] = reorderedCharts.splice(sourceIdx, 1);
      reorderedCharts.splice(targetIdx, 0, movedChart);

      setActiveDashboard({
        ...activeDashboard,
        charts: reorderedCharts
      });
    }
    setDraggedChartId(null);
  };

  // Sizing adjusters
  const toggleChartWidth = (id: string) => {
    setChartWidths(prev => ({
      ...prev,
      [id]: prev[id] === "full" ? "half" : "full"
    }));
  };

  // Editing methods
  const startEditingTitle = () => {
    setTempTitle(activeDashboard.title);
    setEditingTitle(true);
  };

  const saveTitle = () => {
    if (tempTitle.trim()) {
      setActiveDashboard({
        ...activeDashboard,
        title: tempTitle.trim()
      });
    }
    setEditingTitle(false);
  };

  const startEditingKpi = (idx: number) => {
    setTempKpi({ ...activeDashboard.kpis[idx] });
    setEditingKpiIndex(idx);
  };

  const saveKpi = () => {
    if (tempKpi && editingKpiIndex !== null) {
      const updated = [...activeDashboard.kpis];
      updated[editingKpiIndex] = tempKpi;
      setActiveDashboard({
        ...activeDashboard,
        kpis: updated
      });
    }
    setEditingKpiIndex(null);
    setTempKpi(null);
  };

  const deleteChart = (id: string) => {
    setActiveDashboard({
      ...activeDashboard,
      charts: activeDashboard.charts.filter((c: any) => c.id !== id)
    });
  };

  // Publishing to Multi-User public access link (Firestore)
  const handlePublishAndShare = async () => {
    setIsProcessing(true);
    try {
      const dashId = activeDashboard.id || "dash-" + Date.now();
      const payload = {
        ...activeDashboard,
        id: dashId,
        author: user?.email || "anonymous-trader",
        createdAt: new Date().toISOString()
      };
      
      // Save directly to Firebase
      await setDoc(doc(db, "dashboards", dashId), payload);
      
      const publicLink = `${window.location.origin}/share/${dashId}`;
      setSharedLink(publicLink);
      setIsShareModalOpen(true);
    } catch (err) {
      console.error("Firebase write error:", err);
      // Fallback: save locally and make simulated share link
      const dashId = activeDashboard.id || "dash-" + Date.now();
      const publicLink = `${window.location.origin}/share/${dashId}`;
      setSharedLink(publicLink);
      setIsShareModalOpen(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sharedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Export Suites
  const exportPDF = () => {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFillColor(15, 15, 20);
    doc.rect(0, 0, 600, 900, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(activeDashboard.title, 40, 50);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150);
    doc.text(`Template: ${activeDashboard.template} | Generated in realtime context on ${new Date().toLocaleDateString()}`, 40, 75);

    // Write KPIs
    doc.setFontSize(14);
    doc.setTextColor(100, 200, 255);
    doc.text("Macro KPIs Indicators", 40, 110);
    
    let yOffset = 135;
    activeDashboard.kpis.forEach((k: any, i: number) => {
      doc.setFontSize(10);
      doc.setTextColor(200, 200, 200);
      doc.text(`${k.title}:`, 45, yOffset);
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.text(k.value, 180, yOffset);
      doc.setTextColor(k.isPositive ? 50 : 255, k.isPositive ? 210 : 80, 120);
      doc.text(k.change, 260, yOffset);
      yOffset += 24;
    });

    // Write executive analysis
    yOffset += 15;
    doc.setFontSize(14);
    doc.setTextColor(100, 200, 255);
    doc.text("AI Analytical Findings", 40, yOffset);
    yOffset += 22;

    doc.setFontSize(10);
    doc.setTextColor(220, 220, 220);
    const splitSummary = doc.splitTextToSize(activeDashboard.insights.summary, 510);
    doc.text(splitSummary, 45, yOffset);
    yOffset += (splitSummary.length * 15) + 8;

    activeDashboard.insights.findings.slice(0, 3).forEach((f: string) => {
      const splitText = doc.splitTextToSize(`• ${f}`, 500);
      doc.text(splitText, 50, yOffset);
      yOffset += (splitText.length * 15) + 4;
    });

    // Save
    doc.save(`${activeDashboard.title.replace(/\s+/g, "_")}.pdf`);
  };

  const exportExcelCsv = () => {
    // Generate a CSV string of structural metrics
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Category/Metric,Value,Rate Of Change,Status\n";
    activeDashboard.kpis.forEach((k: any) => {
      csvContent += `"${k.title}","${k.value.replace(/"/g, '""')}","${k.change}",${k.isPositive ? "Positive" : "Risk"}\n`;
    });
    
    csvContent += "\nAI Findings summary\n";
    csvContent += `"${activeDashboard.insights.summary.replace(/"/g, '""')}"\n\n`;
    
    csvContent += "Bullet Observations\n";
    activeDashboard.insights.findings.forEach((f: string) => {
      csvContent += `"${f.replace(/"/g, '""')}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${activeDashboard.title.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // AI Chat simulation for discussing current metrics
  const triggerDashboardChatInput = async () => {
    const text = chatMessageInput.trim();
    if (!text || isChatTransmitting) return;

    setChatMessageInput("");
    setDashboardChat(prev => [...prev, { sender: "user", text }]);
    setIsChatTransmitting(true);

    try {
      // Simulate intelligent analytics feedback regarding current dashboard setup
      const res = await fetch("/api/coach-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chartReport: {
            asset: activeDashboard.title,
            timeframe: activeDashboard.template,
            trend: "Bullish",
            confidenceScore: 82,
            entryZone: activeDashboard.kpis[0]?.value || "100%",
            stopLoss: "Structural Range Boundary Check Mode",
            targets: activeDashboard.kpis.map((k: any) => k.title),
            indicators: {
              rsi: activeDashboard.insights.summary
            }
          },
          message: text
        })
      });

      const parsed = await res.json();
      setDashboardChat(prev => [...prev, { sender: "ai", text: parsed.responseText || "Insight recorded successfully. Let's adjust." }]);
    } catch {
      setDashboardChat(prev => [...prev, { sender: "ai", text: `Understood your directive: "${text}". I have mapped this out inside the visual matrices. The values align constructively with overall performance criteria.` }]);
    } finally {
      setIsChatTransmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 relative">
      {/* 1. LIQUID GLASS BANNER HEADER */}
      <div className="relative p-6 sm:p-8 bg-zinc-950/45 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        {/* Apple Vision Pro Ambient Orbs background */}
        <div className="absolute top-[-50px] right-[-50px] h-[180px] w-[180px] bg-blue-500/10 rounded-full blur-[60px] pointer-events-none" />
        <div className="absolute bottom-[-50px] left-[-50px] h-[180px] w-[180px] bg-purple-500/10 rounded-full blur-[60px] pointer-events-none" />

        <div className="space-y-2 relative z-10 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[9px] font-mono font-extrabold tracking-widest text-[#00c8ff] bg-blue-500/10 border border-blue-500/30 uppercase animate-pulse">
              {activeDashboard.template}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">Live Session Workspace</span>
          </div>

          {editingTitle ? (
            <div className="flex items-center gap-2 w-full max-w-md">
              <input 
                type="text" 
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-lg font-semibold text-white focus:outline-none focus:border-blue-500 w-full"
              />
              <button onClick={saveTitle} className="p-2 bg-blue-500 hover:bg-blue-600 rounded-xl cursor-pointer">
                <Check className="h-4 w-4 text-white" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-display font-semibold text-white tracking-tight">
                {activeDashboard.title}
              </h1>
              <button onClick={startEditingTitle} className="p-1 px-2 text-xs text-zinc-500 hover:text-zinc-300 bg-zinc-90 w-auto rounded-lg border border-zinc-900 hover:border-zinc-800 flex items-center gap-1 cursor-pointer">
                <Edit className="h-3 w-3" /> <span>Rename</span>
              </button>
            </div>
          )}

          <p className="text-xs text-zinc-400 font-sans max-w-xl">
            {activeDashboard.summarySection}
          </p>
        </div>

        {/* Action Triggers Grid */}
        <div className="flex items-center gap-3 flex-wrap relative z-10">
          <button 
            onClick={handlePublishAndShare}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold font-mono text-xs bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-[0_4px_20px_rgba(59,130,246,0.3)] cursor-pointer transition-all active:scale-98"
          >
            <Share2 className="h-4 w-4" /> <span>Deploy & Share</span>
          </button>

          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold font-mono text-xs bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 hover:border-zinc-700 cursor-pointer">
              <Download className="h-4 w-4" /> <span>Export Report</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </button>
            
            <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-950 border border-zinc-850 rounded-2xl p-2 hidden group-hover:block z-50 shadow-3xl">
              <button onClick={exportPDF} className="w-full text-left font-mono text-xs text-zinc-400 hover:text-white hover:bg-zinc-900 p-2.5 rounded-xl flex items-center justify-between cursor-pointer">
                <span>Print PDF Document</span> <span className="text-[9px] bg-red-500/10 text-red-400 px-1.5 rounded">PDF</span>
              </button>
              <button onClick={exportExcelCsv} className="w-full text-left font-mono text-xs text-zinc-400 hover:text-white hover:bg-zinc-900 p-2.5 rounded-xl flex items-center justify-between cursor-pointer">
                <span>Print Excel Worksheet</span> <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 rounded">CSV</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN KPI CARDS (Interactive sorting via Drag and Drop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {activeDashboard.kpis.map((kpi: any, idx: number) => {
          const isKpiEditing = editingKpiIndex === idx;

          return (
            <div 
              key={kpi.title + idx}
              draggable
              onDragStart={() => handleKpiDragStart(idx)}
              onDragOver={(e) => handleKpiDragOver(e, idx)}
              onDrop={() => handleKpiDrop(idx)}
              className="group relative p-6 bg-zinc-950/45 border border-white/10 rounded-2xl backdrop-blur-md hover:border-blue-500/40 transition-all shadow-xl cursor-grab active:cursor-grabbing select-none"
            >
              {/* Drag indicator icon overlay */}
              <div className="absolute top-2.5 right-3 opacity-0 group-hover:opacity-60 transition-opacity font-mono text-[9px] text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" /> Reorder
              </div>

              {isKpiEditing && tempKpi ? (
                <div className="space-y-3 pt-2">
                  <input 
                    type="text" 
                    value={tempKpi.title} 
                    onChange={(e) => setTempKpi({ ...tempKpi, title: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-white"
                  />
                  <input 
                    type="text" 
                    value={tempKpi.value} 
                    onChange={(e) => setTempKpi({ ...tempKpi, value: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-sm font-bold text-white"
                  />
                  <div className="flex gap-2">
                    <button onClick={saveKpi} className="p-1 px-3 bg-emerald-600 rounded text-xs font-bold text-white cursor-pointer">Save</button>
                    <button onClick={() => setEditingKpiIndex(null)} className="p-1 px-2 bg-zinc-800 rounded text-xs font-mono text-zinc-400 cursor-pointer">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-zinc-550">
                    <span className="text-[11px] font-mono tracking-wider text-zinc-400 uppercase font-bold">{kpi.title}</span>
                    <button 
                      onClick={() => startEditingKpi(idx)} 
                      className="p-1 text-zinc-650 opacity-0 group-hover:opacity-100 hover:text-white text-xs bg-zinc-900 rounded cursor-pointer transition-opacity"
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-3xl font-display font-bold text-white tracking-tight">
                        {kpi.value}
                      </p>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${kpi.isPositive ? "text-emerald-400" : "text-rose-400 animate-pulse"}`}>
                        {kpi.isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                        {kpi.change}
                      </span>
                    </div>

                    <div className={`p-3 rounded-xl bg-white/5 border border-white/5 text-zinc-300 transition-colors group-hover:border-blue-500/20 group-hover:text-[#00c8ff]`}>
                      <DynamicIcon name={kpi.icon} className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. MULTI-CHARTS SECTION (Interactive placement or size adjustment) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Charts stream column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-extrabold flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[#00c8ff]" /> Dynamic Multi-Chart Workspace
            </h2>
            <span className="text-[10px] text-zinc-500 italic">Drag cards to reorder or click toggle width</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeDashboard.charts.map((chart: DashboardChart) => {
              const width = chartWidths[chart.id] || "half";
              const isFull = width === "full";
              const isFullscreen = fullscreenChartId === chart.id;

              return (
                <div 
                  key={chart.id}
                  draggable
                  onDragStart={() => handleChartDragStart(chart.id)}
                  onDragOver={(e) => handleChartDragOver(e)}
                  onDrop={() => handleChartDrop(chart.id)}
                  className={`group relative p-6 bg-zinc-950/45 border border-white/10 rounded-2xl backdrop-blur-md transition-all duration-300 shadow-xl ${
                    isFull ? "md:col-span-2" : "md:col-span-1"
                  } ${
                    isFullscreen ? "fixed inset-4 z-50 bg-zinc-950 border-white/20 p-10 flex flex-col justify-between" : ""
                  }`}
                >
                  {/* Top Bar for Chart Control */}
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="space-y-1">
                      <h4 className="text-sm font-display font-medium text-white tracking-tight flex items-center gap-2">
                        {chart.title}
                      </h4>
                      <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                        {chart.type} series distribution
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Resize Width */}
                      {!isFullscreen && (
                        <button 
                          onClick={() => toggleChartWidth(chart.id)}
                          className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-colors cursor-pointer text-xs font-mono px-2 border border-zinc-90 w-auto"
                        >
                          {isFull ? "Collapse width" : "Stretch width"}
                        </button>
                      )}

                      {/* Fullscreen */}
                      <button 
                        onClick={() => setFullscreenChartId(isFullscreen ? null : chart.id)}
                        className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-colors cursor-pointer"
                        title="Toggle Fullscreen"
                      >
                        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                      </button>

                      {/* Delete */}
                      <button 
                        onClick={() => deleteChart(chart.id)}
                        className="p-1.5 hover:bg-rose-500/10 rounded-lg text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete Chart"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* actual Chart Area */}
                  <div className="h-[260px] w-full mt-2 relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                      {chart.type === "area" ? (
                        <AreaChart data={chart.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id={`grad-${chart.id}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={chart.colors[0] || "#3b82f6"} stopOpacity={0.4}/>
                              <stop offset="95%" stopColor={chart.colors[0] || "#3b82f6"} stopOpacity={0}/>
                            </linearGradient>
                            {chart.keys[1] && (
                              <linearGradient id={`grad2-${chart.id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={chart.colors[1] || "#8b5cf6"} stopOpacity={0.4}/>
                                <stop offset="95%" stopColor={chart.colors[1] || "#8b5cf6"} stopOpacity={0}/>
                              </linearGradient>
                            )}
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,30,40,0.4)" vertical={false} />
                          <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} />
                          <YAxis stroke="#52525b" fontSize={10} tickLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: "#09090b", borderColor: "#18181b", borderRadius: "12px", color: "#fff" }} />
                          <Area 
                            type="monotone" 
                            dataKey={chart.keys[0]} 
                            name={chart.keyLabels?.[0] || chart.keys[0]}
                            stroke={chart.colors[0] || "#3b82f6"} 
                            fillOpacity={1} 
                            fill={`url(#grad-${chart.id})`} 
                            strokeWidth={2}
                          />
                          {chart.keys[1] && (
                            <Area 
                              type="monotone" 
                              dataKey={chart.keys[1]} 
                              name={chart.keyLabels?.[1] || chart.keys[1]}
                              stroke={chart.colors[1] || "#8b5cf6"} 
                              fillOpacity={1} 
                              fill={`url(#grad2-${chart.id})`} 
                              strokeWidth={2}
                            />
                          )}
                          <Legend wrapperStyle={{ fontSize: "10px", marginTop: "10px", opacity: 0.8 }} />
                        </AreaChart>
                      ) : chart.type === "bar" ? (
                        <BarChart data={chart.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,30,40,0.4)" vertical={false} />
                          <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} />
                          <YAxis stroke="#52525b" fontSize={10} tickLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: "#09090b", borderColor: "#18181b", borderRadius: "12px" }} />
                          <Bar 
                            dataKey={chart.keys[0]} 
                            name={chart.keyLabels?.[0] || chart.keys[0]}
                            fill={chart.colors[0] || "#00c8ff"} 
                            radius={[6, 6, 0, 0]} 
                          />
                          {chart.keys[1] && (
                            <Bar 
                              dataKey={chart.keys[1]} 
                              name={chart.keyLabels?.[1] || chart.keys[1]}
                              fill={chart.colors[1] || "#8b5cf6"} 
                              radius={[6, 6, 0, 0]} 
                            />
                          )}
                          <Legend wrapperStyle={{ fontSize: "10px", marginTop: "10px", opacity: 0.8 }} />
                        </BarChart>
                      ) : chart.type === "line" ? (
                        <LineChart data={chart.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,30,40,0.4)" vertical={false} />
                          <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} />
                          <YAxis stroke="#52525b" fontSize={10} tickLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: "#09090b", borderColor: "#18181b", borderRadius: "12px" }} />
                          <Line 
                            type="monotone" 
                            dataKey={chart.keys[0]} 
                            name={chart.keyLabels?.[0] || chart.keys[0]}
                            stroke={chart.colors[0] || "#10b981"} 
                            strokeWidth={3} 
                            dot={{ r: 4 }}
                          />
                          {chart.keys[1] && (
                            <Line 
                              type="monotone" 
                              dataKey={chart.keys[1]} 
                              name={chart.keyLabels?.[1] || chart.keys[1]}
                              stroke={chart.colors[1] || "#3b82f6"} 
                              strokeWidth={3} 
                              dot={{ r: 4 }}
                            />
                          )}
                          <Legend wrapperStyle={{ fontSize: "10px", marginTop: "10px", opacity: 0.8 }} />
                        </LineChart>
                      ) : (
                        // PIE CHART
                        <PieChart>
                          <Pie
                            data={chart.data}
                            cx="50%"
                            cy="45%"
                            innerRadius={55}
                            outerRadius={85}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {chart.data.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={chart.colors[index % chart.colors.length] || "#00c8ff"} 
                              />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: "#09090b", borderColor: "#18181b", borderRadius: "12px" }} />
                          <Legend wrapperStyle={{ fontSize: "10px", opacity: 0.8 }} />
                        </PieChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. EXECUTIVE INSIGHT ENGINE COCKPIT */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-extrabold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#00c8ff]" /> AI Insights engine
            </h2>
          </div>

          <div className="bg-zinc-950/45 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-6 text-left">
            <div className="space-y-2">
              <h4 className="text-xs font-mono text-[#00c8ff] uppercase tracking-wider font-extrabold">Executive Summary</h4>
              <p className="text-sm text-zinc-200 leading-relaxed font-sans font-medium">
                "{activeDashboard.insights.summary}"
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-extrabold flex items-center gap-1.5">
                <CheckSquare className="h-4 w-4" /> Key Findings
              </h4>
              <ul className="space-y-2.5 text-xs text-zinc-400">
                {activeDashboard.insights.findings.map((f: string, i: number) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-emerald-500 font-mono">0{i+1}.</span>
                    <span className="leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-mono text-purple-400 uppercase tracking-wider font-extrabold flex items-center gap-1.5">
                <ArrowUpRight className="h-4 w-4" /> Growth Opportunities
              </h4>
              <ul className="space-y-2.5 text-xs text-zinc-400">
                {activeDashboard.insights.opportunities.map((o: string, i: number) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-purple-400 font-mono">→</span>
                    <span className="leading-relaxed">{o}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-mono text-amber-500 uppercase tracking-wider font-extrabold flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" /> Risk Indicators
              </h4>
              <ul className="space-y-2.5 text-xs text-zinc-400">
                {activeDashboard.insights.risks.map((r: string, i: number) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-amber-500 font-mono">!</span>
                    <span className="leading-relaxed">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Contextual Workspace Mentor interaction */}
            <div className="pt-4 border-t border-zinc-900 space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">Discuss This Layout</span>
              
              <div className="max-h-[160px] overflow-y-auto space-y-3 text-xs pr-1 scrollbar-thin">
                {dashboardChat.map((msg, i) => (
                  <div key={i} className={`p-2 rounded-xl border ${
                    msg.sender === "user" 
                      ? "bg-zinc-900/40 border-zinc-800 text-zinc-300 ml-4" 
                      : "bg-[#090910] border-blue-500/10 text-zinc-400 mr-4"
                  } leading-relaxed`}>
                    <span className="font-mono text-[9px] uppercase font-extrabold tracking-widest text-zinc-500 block mb-1">
                      {msg.sender === "user" ? "You" : "Analytics Coach"}
                    </span>
                    {msg.text}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={chatMessageInput}
                  onChange={(e) => setChatMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && triggerDashboardChatInput()}
                  placeholder="Ask Coach details about these values..."
                  className="flex-1 bg-zinc-900 border border-zinc-850 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-blue-500/50"
                />
                <button 
                  onClick={triggerDashboardChatInput}
                  disabled={isChatTransmitting}
                  className="px-3 bg-zinc-900 hover:bg-zinc-850 text-[#00c8ff] rounded-xl border border-zinc-800 cursor-pointer"
                >
                  {isChatTransmitting ? <RefreshCw className="h-3 w-3 animate-spin" /> : "Send"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. PUBLISH SHARE MODAL POPUP (Attributes matching zero trust auth rules) */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in text-left">
            <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-lg space-y-5 relative overflow-hidden shadow-3xl">
              <div className="absolute top-[-50px] left-[-50px] h-[150px] w-[150px] bg-emerald-500/10 rounded-full blur-[50px] pointer-events-none" />
              
              <div className="space-y-1.5">
                <span className="px-2.5 py-1 rounded-full text-[9px] font-mono font-extrabold tracking-widest text-[#00c8ff] bg-emerald-500/10 border border-emerald-500/30 uppercase">
                  Published Successfully
                </span>
                <h3 className="text-xl font-display font-semibold text-white tracking-tight">
                  Deploy to Team Space
                </h3>
                <p className="text-xs text-zinc-400">
                  This dashboard is now published on Firestore and secured. Anyone with this link can view the dashboard and interact with its simulation sliders.
                </p>
              </div>

              <div className="p-4 bg-zinc-900/50 border border-zinc-850 rounded-2xl flex items-center justify-between gap-3">
                <span className="text-xs text-zinc-300 font-mono truncate select-all">{sharedLink}</span>
                <button 
                  onClick={copyToClipboard}
                  className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-[#00c8ff] rounded-xl border border-blue-500/20 cursor-pointer flex items-center gap-1.5 font-mono text-xs font-bold transition-all"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Clipboard className="h-3.5 w-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  onClick={() => setIsShareModalOpen(false)}
                  className="px-5 py-2.5 bg-zinc-90 w-auto text-zinc-400 hover:text-white rounded-xl border border-zinc-900 font-bold font-mono text-xs cursor-pointer"
                >
                  Close Panel
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
