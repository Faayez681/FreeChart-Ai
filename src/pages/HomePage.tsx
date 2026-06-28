import React, { useState, useEffect, useRef } from "react";
import { useAppStore } from "../store/useAppStore";
import { motion, AnimatePresence } from "motion/react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart
} from "recharts";
import {
  Sparkles,
  Upload,
  ChevronRight,
  RefreshCw,
  LineChart as LineIcon,
  BarChart3,
  PieChart as PieIcon,
  Download,
  Check,
  Mail,
  Mic,
  Palette,
  FileText,
  Trash2,
  Lock,
  ArrowRight,
  Clock,
  Sparkle,
  Layers,
  HelpCircle,
  TrendingUp,
  Share2,
  Database,
  Grid,
  Zap,
  LayoutDashboard,
  Coins,
  ShieldCheck,
  Star,
  Users,
  Compass,
  ArrowUpRight
} from "lucide-react";

// Predefined Apple/Stripe-level themes
const COLOR_THEMES = {
  ocean: ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#1d4ed8"], // Royal / Electric
  emerald: ["#059669", "#10b981", "#34d399", "#6ee7b7", "#047857"], // Mint / Lime
  cyber: ["#7c3aed", "#8b5cf6", "#a78bfa", "#c4b5fd", "#6d28d9"], // Violet / Neon purple
  sunset: ["#d97706", "#f59e0b", "#fbbf24", "#fcd34d", "#b45309"], // Amber / Gold
  rose: ["#e11d48", "#f43f5e", "#fb7185", "#fda4af", "#be123c"], // Crimson / Bubblegum
  minimal: ["#e4e4e7", "#d4d4d8", "#a1a1aa", "#71717a", "#52525b"], // Slate / Mono
};

// Preset prompts for different templates (business, marketing, etc)
const PRESET_TEMPLATES = [
  {
    id: "business",
    name: "Business Expansion",
    icon: "💼",
    prompt: `Quarterly Expansion Revenue:\nQ1 Baseline: 120000\nQ2 Progress: 185000\nQ3 Optimization: 290000\nQ4 Projection: 380000\nRender trend as an executive line chart.`
  },
  {
    id: "marketing",
    name: "Marketing Channels",
    icon: "📣",
    prompt: `SaaS Customer Acquisition Share:\nOrganic SEO: 4800\nDirect Referrals: 1900\nPaid Social Ads: 3400\nInfluencer Media: 1100\nAffiliate Program: 900\nRender as a premium pie chart.`
  },
  {
    id: "sales",
    name: "Sales Force Reps",
    icon: "📈",
    prompt: `Sales Representative Benchmarks:\nSophia Ramirez: 52000\nLiam Chen: 39000\nEmma Larsson: 48000\nMarcus Vance: 28000\nRender comparison as a high-density bar chart.`
  },
  {
    id: "finance",
    name: "Finance Yields",
    icon: "💵",
    prompt: `Annual Asset Compounding Targets:\nYear 1 Benchmark: 48000\nYear 2 Yields: 56200\nYear 3 Capital: 69400\nYear 4 Scaling: 88700\nYear 5 Index: 114000\nRender compound trends as a line chart.`
  },
  {
    id: "education",
    name: "Education Grading",
    icon: "🎓",
    prompt: `Class Examination Distribution:\nGrade A: 16\nGrade B: 29\nGrade C: 34\nGrade D: 8\nGrade F: 3\nRender distribution as a bar chart.`
  }
];

// Seed initial history
const INITIAL_SAVED_CHARTS = [
  {
    id: "demo-chart-1",
    prompt: "SaaS Customer Acquisition Share",
    chartType: "pie" as const,
    title: "SaaS Customer Acquisition Share",
    xAxisKey: "label",
    yAxisKey: "value",
    data: [
      { label: "Organic SEO", value: 4800 },
      { label: "Direct Referrals", value: 1900 },
      { label: "Paid Social Ads", value: 3400 },
      { label: "Influencer Media", value: 1100 },
      { label: "Affiliate Program", value: 900 }
    ],
    colors: COLOR_THEMES.cyber,
    explanation: "Organic channels and Paid acquisition generate over 68% of overall platform traffic. Diversification into secondary affiliates remains a recommended optimization trajectory.",
    createdAt: new Date().toISOString()
  },
  {
    id: "demo-chart-2",
    prompt: "Quarterly Expansion Revenue",
    chartType: "line" as const,
    title: "Quarterly Expansion Revenue",
    xAxisKey: "label",
    yAxisKey: "value",
    data: [
      { label: "Q1 Baseline", value: 120000 },
      { label: "Q2 Progress", value: 185000 },
      { label: "Q3 Optimization", value: 290000 },
      { label: "Q4 Projection", value: 380000 }
    ],
    colors: COLOR_THEMES.ocean,
    explanation: "Excellent momentum. Overall performance is forecasted to increase by 216% by Q4 relative to the Q1 baseline, representing high-efficiency enterprise sales acceleration.",
    createdAt: new Date().toISOString()
  }
];

export default function HomePage() {
  const { setCurrentView, setActiveTab, setActiveDashboard } = useAppStore() as any;
  // Main Interactive AI State
  const [promptInput, setPromptInput] = useState("");
  const [heroPromptInput, setHeroPromptInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState(0);
  const [voiceActive, setVoiceActive] = useState(false);
  const [activeChart, setActiveChart] = useState<any>(INITIAL_SAVED_CHARTS[1]);
  const [overrideType, setOverrideType] = useState<"bar" | "line" | "area" | "pie" | "scatter" | "stacked_bar" | "radar" | "composed" | null>(null);
  const [activeTheme, setActiveTheme] = useState<keyof typeof COLOR_THEMES>("ocean");
  const [dragActive, setDragActive] = useState(false);

  // Chart UI state customizers
  const [chartOptions, setChartOptions] = useState({
    gridlines: true,
    tooltips: true,
    legends: true,
  });

  // Saved / Recent charts from local storage
  const [recentCharts, setRecentCharts] = useState<any[]>([]);

  // HERO typing simulation loop states
  const [heroTypingText, setHeroTypingText] = useState("");
  const [heroActiveStage, setHeroActiveStage] = useState<"typing" | "generating" | "finished">("typing");
  const typingIndexRef = useRef(0);
  const typingPromptRef = useRef("Show revenue growth from 2021 to 2025");
  const [heroChartData, setHeroChartData] = useState<any>({
    title: "Projected Enterprise Revenue Growth (2021-2025)",
    data: [
      { label: "2021", value: 15 },
      { label: "2022", value: 35 },
      { label: "2023", value: 75 },
      { label: "2024", value: 140 },
      { label: "2025", value: 280 }
    ]
  });

  // Waitlist Email capture
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistState, setWaitlistState] = useState<"idle" | "success" | "error">("idle");

  // Main Canvas Ref for premium 3D/animated grid & particles
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load state and preloads
  useEffect(() => {
    try {
      const stored = localStorage.getItem("fc_recent_charts_saved");
      if (stored) {
        setRecentCharts(JSON.parse(stored));
      } else {
        setRecentCharts(INITIAL_SAVED_CHARTS);
        localStorage.setItem("fc_recent_charts_saved", JSON.stringify(INITIAL_SAVED_CHARTS));
      }
    } catch (e) {
      setRecentCharts(INITIAL_SAVED_CHARTS);
    }
  }, []);

  // Hero section automated typing interaction loops
  useEffect(() => {
    let typingTimer: NodeJS.Timeout;
    const fullText = typingPromptRef.current;
    
    if (heroActiveStage === "typing") {
      if (typingIndexRef.current <= fullText.length) {
        typingTimer = setTimeout(() => {
          setHeroTypingText(fullText.substring(0, typingIndexRef.current));
          typingIndexRef.current += 1;
        }, 50);
      } else {
        // Trigger Generating sequence
        setHeroActiveStage("generating");
        typingTimer = setTimeout(() => {
          setHeroActiveStage("finished");
        }, 1200);
      }
    } else if (heroActiveStage === "finished") {
      // Stay on finished for 5.5s then restart
      typingTimer = setTimeout(() => {
        setHeroActiveStage("typing");
        setHeroTypingText("");
        typingIndexRef.current = 0;
      }, 5500);
    }

    return () => clearTimeout(typingTimer);
  }, [heroActiveStage, heroTypingText]);

  // Canvas Particle system & Grid with Mouse-Follow Spatial Spotlight
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || 800);

    // Track mouse positions
    let mouseX = -1000;
    let mouseY = -1000;
    let targetMouseX = -1000;
    let targetMouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Dynamic resize handler
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || 800;
    };
    window.addEventListener("resize", handleResize);

    // Particle pool array
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      color: string;
    }> = [];

    // Create particles with different gradients
    const colors = ["rgba(59, 130, 246,", "rgba(139, 92, 246,", "rgba(6, 182, 212,"];
    const particleCount = Math.min(80, Math.floor(width / 20));
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.5 + 0.15,
        color: colors[i % colors.length],
      });
    }

    // Grid coordinates
    const gridSpacing = 44;
    let offset = 0;

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      // 1. Spatial Spotlight glow under the cursor
      if (mouseX > -500) {
        const glowRad = 260;
        const grad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, glowRad);
        grad.addColorStop(0, "rgba(59, 130, 246, 0.12)");
        grad.addColorStop(0.4, "rgba(139, 92, 246, 0.04)");
        grad.addColorStop(0.8, "rgba(6, 182, 212, 0.01)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, glowRad, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Perspective Grid mapping
      ctx.strokeStyle = "rgba(40, 40, 50, 0.05)";
      ctx.lineWidth = 0.8;

      // Vertical lines highlighted by cursor spotlight proximity
      for (let x = 0; x < width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        
        const distToMouse = Math.abs(x - mouseX);
        if (distToMouse < 220) {
          ctx.strokeStyle = `rgba(59, 130, 246, ${0.05 + (1 - distToMouse / 220) * 0.12})`;
          ctx.lineWidth = 1.0;
        } else {
          ctx.strokeStyle = "rgba(40, 40, 50, 0.05)";
          ctx.lineWidth = 0.8;
        }
        ctx.stroke();
      }

      // Horizontal lines moving slightly
      offset = (offset + 0.12) % gridSpacing;
      for (let y = offset; y < height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        
        const distToMouse = Math.abs(y - mouseY);
        if (distToMouse < 220) {
          ctx.strokeStyle = `rgba(139, 92, 246, ${0.05 + (1 - distToMouse / 220) * 0.12})`;
          ctx.lineWidth = 1.0;
        } else {
          ctx.strokeStyle = "rgba(40, 40, 50, 0.05)";
          ctx.lineWidth = 0.8;
        }
        ctx.stroke();
      }

      // 3. Draw & update particles
      particles.forEach((p) => {
        // Subtle magnetic pull toward mouse
        if (mouseX > -500) {
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 280) {
            const force = (1 - dist / 280) * 0.08;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        // Bounce borders
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        
        // Highlight active particles inside cursor vicinity
        let finalAlpha = p.alpha;
        if (mouseX > -500) {
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            finalAlpha = p.alpha + (1 - dist / 150) * 0.4;
          }
        }
        
        ctx.fillStyle = `${p.color} ${finalAlpha})`; 
        ctx.fill();

        // Connections
        particles.forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            const connAlpha = (1 - dist / 110) * 0.1 * p.alpha;
            ctx.strokeStyle = `rgba(139, 92, 246, ${connAlpha})`; 
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Main API submission with regex parsing backup
  const executeChartGeneration = async (inputText: string) => {
    const text = inputText.trim() || promptInput.trim();
    if (!text) return;

    setIsGenerating(true);
    setGenerationStage(0);
    try {
      // Begin background fetch immediately
      const fetchPromise = fetch("/api/chart/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text })
      }).then(async res => {
        if (!res.ok) throw new Error("HTTP state error: " + res.status);
        return res.json();
      }).catch(err => {
        console.error("Fetch background chart failed:", err);
        return null;
      });

      // Stepped delay intervals for visual compilation feedback
      const compilationStepsCount = 5;
      for (let stage = 0; stage < compilationStepsCount; stage++) {
        setGenerationStage(stage);
        await new Promise((resolve) => setTimeout(resolve, 450));
      }

      const raw = await fetchPromise;
      const generated = {
        id: "gen-" + Date.now(),
        prompt: text,
        chartType: raw?.chartType || "bar",
        title: raw?.title || "Sales Projection Output",
        xAxisKey: raw?.xAxisKey || "label",
        yAxisKey: raw?.yAxisKey || "value",
        data: raw?.data || [
          { label: "January", value: 120 },
          { label: "February", value: 180 },
          { label: "March", value: 240 },
          { label: "April", value: 310 }
        ],
        colors: raw?.colors || COLOR_THEMES.ocean,
        explanation: raw?.explanation || "System parsed metric values successfully with our local sandbox engine.",
        createdAt: new Date().toISOString()
      };

      setActiveChart(generated);
      setOverrideType(null); // Reset layout custom types on new load
      setPromptInput("");

      // Save to history storage
      const newHistory = [generated, ...recentCharts.filter(c => c.id !== generated.id)].slice(0, 12);
      setRecentCharts(newHistory);
      localStorage.setItem("fc_recent_charts_saved", JSON.stringify(newHistory));

      // Scroll to workspace simulator view beautifully
      const el = document.getElementById("interactive-viewport");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });

    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Main Dashboard Synthesis API trigger
  const executeDashboardGeneration = async (inputText: string) => {
    const text = inputText.trim() || heroPromptInput.trim();
    if (!text) return;

    setIsGenerating(true);
    setGenerationStage(0);
    try {
      const fetchPromise = fetch("/api/dashboard/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text })
      }).then(async res => {
        if (!res.ok) throw new Error("HTTP state error: " + res.status);
        return res.json();
      }).catch(err => {
        console.error("Fetch background dashboard failed:", err);
        return null;
      });

      // Stepped delay intervals for luxury compiling shimmers
      const compilationSteps = 5;
      for (let stage = 0; stage < compilationSteps; stage++) {
        setGenerationStage(stage);
        await new Promise((resolve) => setTimeout(resolve, 450));
      }

      const parsedDashboard = await fetchPromise;
      if (parsedDashboard) {
        setActiveDashboard(parsedDashboard);
      } else {
        setActiveDashboard(null);
      }

      setHeroPromptInput("");
      setActiveTab("DASHBOARD");
      setCurrentView("WORKSPACE");

    } catch (err) {
      console.error("Dashboard generator compile exception:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleHeroGenerate = (inputText?: string) => {
    const textToGen = inputText || heroPromptInput;
    if (!textToGen.trim()) return;
    executeDashboardGeneration(textToGen);
  };

  // CSV Drag and Drop Parse Utils
  const handleCSVUploadAndParse = (text: string, fileName: string) => {
    try {
      const rowsRaw = text.split(/\r?\n/).map(row => row.trim()).filter(Boolean);
      if (rowsRaw.length < 2) return;

      const sep = rowsRaw[0].includes(",") ? "," : rowsRaw[0].includes(";") ? ";" : "\t";
      const columns = rowsRaw[0].split(sep).map(col => col.trim().replace(/^['"]|['"]$/g, ""));

      const finalData: any[] = [];
      for (let i = 1; i < rowsRaw.length; i++) {
        const slots = rowsRaw[i].split(sep).map(slot => slot.trim().replace(/^['"]|['"]$/g, ""));
        if (slots.length < columns.length) continue;

        const record: any = {};
        columns.forEach((col, idx) => {
          const val = slots[idx];
          const num = parseFloat(val?.replace(/,/g, ""));
          record[col] = isNaN(num) ? val : num;
        });
        finalData.push(record);
      }

      if (finalData.length === 0) return;

      const mainLabelKey = columns[0];
      const mainValueKey = columns.find((c, i) => i > 0 && finalData.some(r => typeof r[c] === "number")) || columns[1] || columns[0];

      let builtPromptStr = `Dataset parsed from file: ${fileName.replace(/\.[^/.]+$/, "")}\n`;
      finalData.slice(0, 12).forEach(row => {
        if (row[mainLabelKey] !== undefined && row[mainValueKey] !== undefined) {
          builtPromptStr += `${row[mainLabelKey]}: ${row[mainValueKey]}\n`;
        }
      });
      builtPromptStr += `\nCreate a gorgeous professional visual analytics chart representing this.`;

      setPromptInput(builtPromptStr);
      executeChartGeneration(builtPromptStr);

    } catch (e) {
      console.error(e);
    }
  };

  // Drag and drop handlers
  const handleDragState = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDropPayload = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const textStr = event.target?.result as string;
        if (textStr) handleCSVUploadAndParse(textStr, file.name);
      };
      reader.readAsText(file);
    }
  };

  const loadPresetTemplate = (preset: typeof PRESET_TEMPLATES[0]) => {
    setPromptInput(preset.prompt);
    // Smooth scroll to the interactive generator area
    const el = document.getElementById("interactive-viewport");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Waitlist capturing
  const submitWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail || !waitlistEmail.includes("@")) {
      setWaitlistState("error");
      return;
    }

    try {
      const list = JSON.parse(localStorage.getItem("fc_waitlist_registered") || "[]");
      if (!list.includes(waitlistEmail)) {
        list.push(waitlistEmail);
        localStorage.setItem("fc_waitlist_registered", JSON.stringify(list));
      }
      setWaitlistState("success");
      setWaitlistEmail("");
    } catch (err) {
      setWaitlistState("error");
    }
  };

  // Clear specific charts helpers
  const deleteHistoryId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = recentCharts.filter(c => c.id !== id);
      setRecentCharts(updated);
      localStorage.setItem("fc_recent_charts_saved", JSON.stringify(updated));
      if (activeChart?.id === id) {
        setActiveChart(updated[0] || null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Standard Downloads triggers matching specs
  const triggerSVGDownload = () => {
    if (!activeChart) return;
    const box = document.getElementById("chart-snapshot-frame");
    const docSvg = box?.querySelector("svg");
    if (!docSvg) return;

    const serialize = new XMLSerializer();
    let markup = serialize.serializeToString(docSvg);
    if (!markup.match(/^<svg[^>]+xmlns="http\/\/www\.w3\.org\/2000\/svg"/)) {
      markup = markup.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    const blob = new Blob([markup], { type: "image/svg+xml;charset=utf-8" });
    const localUrl = URL.createObjectURL(blob);
    const linkEl = document.createElement("a");
    linkEl.href = localUrl;
    linkEl.download = `${activeChart.title.toLowerCase().replace(/\s+/g, "_")}.svg`;
    linkEl.click();
    URL.revokeObjectURL(localUrl);
  };

  const triggerPNGDownload = () => {
    if (!activeChart) return;
    const box = document.getElementById("chart-snapshot-frame");
    const docSvg = box?.querySelector("svg");
    if (!docSvg) return;

    const w = docSvg.clientWidth || 640;
    const h = docSvg.clientHeight || 340;

    const serialize = new XMLSerializer();
    let markup = serialize.serializeToString(docSvg);
    if (!markup.match(/^<svg[^>]+xmlns="http\/\/www\.w3\.org\/2000\/svg"/)) {
      markup = markup.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    const svgBlob = new Blob([markup], { type: "image/svg+xml;charset=utf-8" });
    const localUrl = URL.createObjectURL(svgBlob);
    const tempImage = new Image();
    tempImage.onload = () => {
      const canvasEl = document.createElement("canvas");
      canvasEl.width = w * 2;
      canvasEl.height = h * 2;
      const context = canvasEl.getContext("2d");
      if (context) {
        context.scale(2, 2);
        context.fillStyle = "#050505"; // Stripe deep black card back
        context.fillRect(0, 0, w, h);
        context.drawImage(tempImage, 0, 0, w, h);

        const pngUrl = canvasEl.toDataURL("image/png");
        const linkEl = document.createElement("a");
        linkEl.href = pngUrl;
        linkEl.download = `${activeChart.title.toLowerCase().replace(/\s+/g, "_")}.png`;
        linkEl.click();
      }
      URL.revokeObjectURL(localUrl);
    };
    tempImage.src = localUrl;
  };

  const triggerPDFDownload = () => {
    if (!activeChart) return;
    import("jspdf").then(({ jsPDF }) => {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4"
      });

      // Executive briefing background
      pdf.setFillColor(5, 5, 5);
      pdf.rect(0, 0, 595, 842, "F");

      // Accent border line
      pdf.setFillColor(37, 99, 235);
      pdf.rect(0, 0, 595, 4, "F");

      pdf.setTextColor(37, 99, 235);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.text("✦ FREECHART.AI SECURE PRO BRIEFING SHEET", 40, 48);

      pdf.setTextColor(250, 250, 250);
      pdf.setFontSize(20);
      pdf.text(activeChart.title, 40, 78);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.5);
      pdf.setTextColor(130, 130, 140);
      pdf.text(`Format Style: ${activeChart.chartType.toUpperCase()}  |  Engine Mode: Gemini LLM Parsing  |  Created: ${new Date().toLocaleDateString()}`, 40, 96);

      // Accent divider line
      pdf.setDrawColor(30, 30, 40);
      pdf.line(40, 110, 550, 110);

      // AI Summary Card Box
      pdf.setFillColor(15, 15, 18);
      pdf.roundedRect(40, 132, 515, 75, 4, 4, "F");

      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(59, 130, 246);
      pdf.setFontSize(9);
      pdf.text("✦ INTELLIGENT EXECUTIVE SUMMARY:", 55, 154);

      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(215, 215, 225);
      pdf.setFontSize(9);
      const splitText = pdf.splitTextToSize(activeChart.explanation, 480);
      pdf.text(splitText, 55, 172);

      // Data Grid Table header 
      pdf.setTextColor(250, 250, 250);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10.5);
      pdf.text("MEASURED DATA SET POINTS", 40, 245);

      pdf.line(40, 255, 550, 255);

      let verticalCursor = 285;
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(120, 120, 130);
      pdf.setFontSize(8);
      pdf.text("LABEL CATEGORIES", 50, verticalCursor - 10);
      pdf.text("QUANTITATIVE REGISTERED VALUES", 350, verticalCursor - 10);

      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(210, 210, 220);
      pdf.setFontSize(9);

      activeChart.data.forEach((item: any) => {
        if (verticalCursor > 760) {
          pdf.addPage();
          pdf.setFillColor(5, 5, 5);
          pdf.rect(0, 0, 595, 842, "F");
          pdf.setFillColor(37, 99, 235);
          pdf.rect(0, 0, 595, 4, "F");
          verticalCursor = 50;
        }

        pdf.text(String(item.label || ""), 50, verticalCursor);
        pdf.text(String(item.value || 0), 350, verticalCursor);

        pdf.setDrawColor(24, 24, 30);
        pdf.line(40, verticalCursor + 6, 550, verticalCursor + 6);
        verticalCursor += 22;
      });

      // Footer brandings
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(59, 130, 246);
      pdf.setFontSize(7.5);
      pdf.text("GENERATED VIA PLATFORM FREECHART.AI", 40, 810);

      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 100, 110);
      pdf.text("COMPLIANT INTEGRATED WEB EXPORT  |  NO DATABASE ACCOUNT REQUIRED", 230, 810);

      pdf.save(`${activeChart.title.toLowerCase().replace(/\s+/g, "_")}_pro_matrix.pdf`);
    });
  };

  const schemeColors = COLOR_THEMES[activeTheme] || COLOR_THEMES.ocean;
  const currentDisplayedChart = activeChart || INITIAL_SAVED_CHARTS[0];
  const renderedChartLayout = overrideType || currentDisplayedChart.chartType;

  return (
    <div className="flex-1 bg-[#050505] text-[#fafafa] flex flex-col items-center relative min-h-screen font-sans">
      
      {/* Perspective Shimmer Background Canvas */}
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden pointer-events-none select-none">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block opacity-60" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#050505] to-transparent" />
        <div className="absolute inset-y-0 right-0 w-96 bg-gradient-to-l from-blue-700/5 to-transparent blur-3xl" />
        <div className="absolute inset-y-0 left-0 w-96 bg-gradient-to-r from-purple-700/5 to-transparent blur-3xl" />
      </div>

      {/* SECTION 2: HERO COMPONENT (Centered 2030 Liquid Glass Design) */}
      <section id="hero" className="w-full max-w-5xl min-h-[90vh] px-6 pt-28 md:pt-36 pb-16 flex flex-col justify-center items-center relative z-10 select-none text-center">
        
        {/* Subtle animated background radial gradients */}
        <div className="absolute inset-x-0 -top-12 h-[500px] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0%,rgba(139,92,246,0.05)_40%,transparent_70%)] pointer-events-none" />

        {/* Floating Glowing Particles & AI Assistant Floating Orb (Liquid Glass Depth) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Main AI Floating Orb - Morphs and orbits slowly */}
          <motion.div 
            animate={{ 
              y: [0, -25, 12, 0], 
              x: [0, 20, -15, 0],
              scale: [1, 1.15, 0.9, 1],
              rotate: [0, 120, 240, 360]
            }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-gradient-to-tr from-cyan-500/20 via-blue-600/15 to-[#8b5cf6]/20 blur-xl mix-blend-screen"
          />
          
          <motion.div 
            animate={{ y: [0, -35, 0], x: [0, 20, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/3 left-10 w-3 h-3 rounded-full bg-cyan-400/25 blur-[3px]"
          />
          <motion.div 
            animate={{ y: [0, 30, 0], x: [0, -25, 0], scale: [1, 0.85, 1] }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-1/4 right-12 w-5 h-5 rounded-full bg-purple-500/25 blur-[4px] animate-pulse"
          />
          <motion.div 
            animate={{ y: [0, -20, 0], x: [0, -15, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-1/2 right-1/3 w-2.5 h-2.5 rounded-full bg-blue-500/35 blur-sm"
          />
        </div>

        <div className="space-y-8 max-w-3xl flex flex-col items-center relative z-10">
          
          {/* Top Platform Tag Capsule */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/[0.02] border border-white/10 rounded-full text-[10px] font-mono tracking-widest text-[#00c8ff] font-semibold uppercase backdrop-blur-md shadow-lg"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
            <span>FreeChart AI 5.0 Platform</span>
          </motion.div>

          {/* Heading with Linear Gradient Text */}
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-4xl sm:text-5xl md:text-6xl font-display font-medium tracking-tight text-white leading-[1.08] max-w-4xl"
            >
              The New Standard For <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-[#8b5cf6] font-bold">Visual SaaS Intel</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-zinc-400 font-light text-xs sm:text-sm md:text-base max-w-2xl leading-relaxed font-sans mx-auto"
            >
              Draft presentation-ready diagrams with high-fidelity natural language. Securely render financial models, team trajectories, and multi-asset cycles in real-time.
            </motion.p>
          </div>

          {/* Centerpiece: Massive Search bar with water wave ripples */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="w-full max-w-2xl px-2 relative"
          >
            {/* Animated water-like flowing waves surface overlay under the input capsule */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500/30 via-blue-500/20 to-purple-600/30 opacity-40 blur-xl animate-pulse pointer-events-none" />
            <motion.div 
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-600 to-[#8b5cf6] opacity-15 blur-md pointer-events-none select-none"
            />

            {/* Main Interactive Glass Input Capsule */}
            <div className="relative flex items-center bg-[#07070a]/50 border border-white/10 ring-1 ring-white/5 backdrop-blur-2xl rounded-2xl p-1.5 shadow-[0_25px_60px_rgba(0,0,0,0.8)] focus-within:border-cyan-500/40 focus-within:ring-cyan-500/10 transition-all duration-300">
              
              <div className="pl-3.5 text-cyan-400 flex items-center justify-center pointer-events-none">
                <Sparkle className="h-4.5 w-4.5 animate-pulse" />
              </div>

              <input
                type="text"
                value={heroPromptInput}
                onChange={(e) => setHeroPromptInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleHeroGenerate();
                }}
                placeholder="Describe the dashboard you want to create (e.g. Create a SaaS metrics dashboard)..."
                className="flex-1 min-w-0 bg-transparent pl-3 pr-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none border-none focus:ring-0 font-sans tracking-wide"
              />

              {/* Premium refractive CTA submit button */}
              <button
                onClick={() => handleHeroGenerate()}
                className="px-4 sm:px-5 py-3 bg-gradient-to-r from-blue-600 to-[#8b5cf6] hover:from-cyan-500 hover:to-blue-600 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition cursor-pointer select-none active:scale-[0.97] duration-150 flex items-center gap-1.5 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] shrink-0"
              >
                <span>Generate <span className="hidden sm:inline">With AI</span></span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* AI prompt suggestions below search */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-[9px] font-mono uppercase tracking-wider text-zinc-500">
              <span className="mr-1 select-none font-bold text-zinc-650">POPULAR PROMPTS:</span>
              {[
                { label: "💼 SaaS Business Metrics", prompt: "Create a SaaS metrics dashboard" },
                { label: "📈 Sales Performance", prompt: "Build a sales performance dashboard" },
                { label: "🪙 Crypto Portfolio", prompt: "Generate a crypto portfolio dashboard" },
                { label: "📊 Startup Investor Report", prompt: "Create a startup investor report dashboard" },
                { label: "📣 Marketing Analytics", prompt: "Build a marketing analytics dashboard" }
              ].map((tag) => (
                <button
                  key={tag.label}
                  onClick={() => {
                    setHeroPromptInput(tag.prompt);
                    executeDashboardGeneration(tag.prompt);
                  }}
                  className="px-3 py-1.2 bg-white/[0.01] border border-white/5 hover:border-white/10 text-zinc-400 hover:text-white rounded-full transition cursor-pointer hover:bg-white/[0.04]"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* SECTION 3: SOCIAL PROOF / PLATFORM COUNTER SECTION */}
      <section id="social-proof" className="w-full bg-[#07070a]/40 border-y border-zinc-900/60 py-10 relative z-10 select-none scroll-mt-28">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4 text-left">
            <span className="font-mono text-[9px] text-zinc-550 block uppercase tracking-widest leading-none mb-1">REAL-TIME TELEMETRY</span>
            <strong className="text-xl font-display font-medium text-white tracking-tight">Trusted by Creators</strong>
          </div>

          {/* Moving logos list or words */}
          <div className="md:col-span-5 flex flex-wrap items-center gap-6 sm:gap-10 text-zinc-550 font-mono text-xs uppercase tracking-widest font-extrabold justify-start md:justify-center">
            <span className="hover:text-zinc-300 transition duration-300">Startups</span>
            <span className="hover:text-zinc-300 transition duration-300">Analysts</span>
            <span className="hover:text-zinc-300 transition duration-300">Marketers</span>
            <span className="hover:text-zinc-300 transition duration-300">Researchers</span>
          </div>

          <div className="md:col-span-3 text-right bg-blue-900/5 border border-blue-500/10 p-4 rounded-2xl flex items-center justify-between sm:justify-end gap-4 min-w-[210px]">
            <div className="text-left font-mono">
              <span className="text-[10px] text-zinc-400 block tracking-widest leading-none">CHARTS OUTPUT</span>
              <span className="text-[8px] text-zinc-650 tracking-widest leading-none uppercase">SAFE COOKIES PERSISTENCE</span>
            </div>
            <span className="text-3xl font-semibold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 font-mono">50,000+</span>
          </div>
        </div>
      </section>

      {/* SECTION 4: INTERACTIVE DEMO (User can test directly, no signup required) */}
      <section id="interactive-viewport" className="w-full max-w-7xl px-6 py-16 scroll-mt-28 relative z-10 select-none">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="font-mono text-[9px] text-blue-500 tracking-widest uppercase font-extrabold block">INTERACTIVE PLATFORM</span>
          <h2 className="text-3xl md:text-4xl font-display font-medium text-white tracking-tight">No Setup Required. Type Below.</h2>
          <p className="text-zinc-450 font-light text-xs sm:text-sm max-w-lg mx-auto font-sans leading-relaxed">
            Configure, style, and download presentation datasets in seconds. Try copy-pasting your raw reports.
          </p>
        </div>

        {/* Generator grid container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* THE LEFT HAND DESKTOP COCKPIT BOX */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="bg-[#09090b] border border-zinc-900 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 pointer-events-none opacity-[0.03]">
                <Sparkles className="h-16 w-16 text-blue-500" />
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-blue-700/10 flex items-center justify-center border border-blue-500/15">
                    <Sparkle className="h-4.5 w-4.5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white tracking-tight">Structured Console</h3>
                    <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Natural Language Inputs</p>
                  </div>
                </div>

                <button 
                  onClick={() => setPromptInput("")}
                  className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 transition cursor-pointer"
                >
                  RESET
                </button>
              </div>

              {/* Large Input Textarea */}
              <div className="relative">
                <textarea
                  value={promptInput}
                  onChange={(e) => {
                    if (e.target.value.length <= 2000) {
                      setPromptInput(e.target.value);
                    }
                  }}
                  placeholder={`Create a line chart:\nJanuary: 120\nFebruary: 180\nMarch: 240\nApril: 310`}
                  rows={5}
                  className="w-full bg-black border border-zinc-900 focus:border-zinc-800 rounded-2xl pl-4 pr-16 py-3.5 text-xs text-white placeholder-zinc-700 focus:outline-none resize-none font-sans leading-relaxed tracking-wide shadow-inner"
                />
                
                {/* Voice Input Trigger button & counter */}
                <div className="absolute right-3.5 bottom-3.5 flex items-center gap-2">
                  <span className="font-mono text-[9px] text-zinc-600 font-semibold select-none">
                    {promptInput.length}/2000
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => {
                      if (voiceActive) return;
                      setVoiceActive(true);
                      setPromptInput("Listening to audio prompt cues...");
                      setTimeout(() => {
                        setPromptInput("Compare global cloud market share for 2026:\nAWS: 31%\nAzure: 25%\nGoogle Cloud: 11%\nAlibaba: 4%\nOthers: 29%");
                        setVoiceActive(false);
                      }, 2000);
                    }}
                    className={`p-1.5 rounded-lg border transition ${
                      voiceActive 
                        ? "bg-red-500/20 border-red-500 text-red-500 animate-pulse" 
                        : "bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white"
                    }`}
                    title="Simulate Voice Input"
                  >
                    <Mic className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Drag and Drop File Selection Area */}
              <div 
                onDragEnter={handleDragState} 
                onDragLeave={handleDragState} 
                onDragOver={handleDragState} 
                onDrop={handleDropPayload}
                className={`mt-4 border-2 border-dashed rounded-2xl p-4 text-center transition-all duration-200 ${
                  dragActive 
                    ? "border-blue-500 bg-blue-950/15" 
                    : "border-zinc-900 hover:border-zinc-850 hover:bg-zinc-950/45 bg-zinc-950/10"
                }`}
              >
                <input 
                  type="file" 
                  id="csv-file-uploader-viewport" 
                  accept=".csv,.txt" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const txt = ev.target?.result as string;
                        if (txt) handleCSVUploadAndParse(txt, file.name);
                      };
                      reader.readAsText(file);
                    }
                  }} 
                  className="hidden" 
                />
                <label htmlFor="csv-file-uploader-viewport" className="cursor-pointer block space-y-1">
                  <Upload className="h-5 w-5 text-zinc-500 mx-auto" />
                  <p className="text-[10.5px] text-zinc-400 font-sans">
                    Drag CSV or Excel text here or <span className="text-blue-500 hover:underline font-medium">browse local files</span>
                  </p>
                </label>
              </div>

              {/* Action trigger button */}
              <div className="mt-4">
                <button
                  onClick={() => executeChartGeneration(promptInput)}
                  disabled={isGenerating || !promptInput.trim()}
                  className={`w-full py-3 px-5 rounded-2xl font-mono text-[10px] uppercase tracking-wider font-bold transition flex items-center justify-center gap-2 ${
                    promptInput.trim() && !isGenerating
                      ? "bg-white text-black hover:bg-zinc-150 cursor-pointer hover:shadow-lg active:scale-98 duration-200"
                      : "bg-zinc-900 text-zinc-650 cursor-not-allowed"
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>GENERATING RECHARTS INDICES...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Generate Chart</span>
                    </>
                  )}
                </button>
              </div>

              {/* Example Category quick buttons */}
              <div className="mt-6">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <span className="text-[9px] font-mono text-zinc-550 tracking-wider uppercase">Choose Brand Example</span>
                  <span className="h-px bg-zinc-900 flex-1" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-2 gap-2">
                  {PRESET_TEMPLATES.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => loadPresetTemplate(preset)}
                      className="px-3 py-2 bg-black hover:bg-zinc-950 border border-zinc-900 hover:border-zinc-805 rounded-xl text-left transition text-[11px] font-sans text-zinc-300 flex items-center gap-2 cursor-pointer active:scale-95 select-none"
                    >
                      <span className="text-xs">{preset.icon}</span>
                      <span className="truncate">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Prompts History block */}
              {recentCharts.length > 0 && (
                <div className="mt-4 border-t border-zinc-900/60 pt-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[9px] font-mono text-zinc-550 tracking-wider uppercase">Recent Prompts History</span>
                    <span className="h-px bg-zinc-900 flex-1" />
                  </div>
                  <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto pr-1">
                    {recentCharts.slice(0, 3).map((histItem, idx) => (
                      <button
                        key={`hist-${idx}`}
                        onClick={() => {
                          setPromptInput(histItem.prompt);
                          executeChartGeneration(histItem.prompt);
                        }}
                        className="text-left bg-zinc-950/40 hover:bg-zinc-900/60 border border-zinc-900/60 p-2 rounded-xl text-[9.5px] font-mono text-zinc-400 hover:text-white transition truncate cursor-pointer select-none flex items-center justify-between"
                      >
                        <span className="truncate">{histItem.prompt}</span>
                        <ChevronRight className="h-3 w-3 text-zinc-650" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* THE RIGHT HAND GRAPHICS PREVIEW WINDOW */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="bg-[#09090b] border border-zinc-900 rounded-3xl p-6 shadow-2xl relative flex flex-col justify-between">
              
              {/* Output Header Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900/80 pb-4 mb-5">
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-blue-500 block uppercase mb-0.5">Verified Analytical Chart</span>
                  <h3 className="text-sm font-semibold text-white tracking-tight">{currentDisplayedChart.title}</h3>
                </div>

                {/* Overwrite original layout styles */}
                <div className="flex flex-wrap bg-black p-1 border border-zinc-900 rounded-xl gap-1">
                  <button
                    onClick={() => setOverrideType("bar")}
                    className={`p-1.5 rounded-lg transition text-xs cursor-pointer ${
                      renderedChartLayout === "bar" ? "bg-zinc-900 text-blue-400 border border-zinc-800" : "text-zinc-650 hover:text-zinc-300"
                    }`}
                    title="Render as Bar Layout"
                  >
                    <BarChart3 className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => setOverrideType("line")}
                    className={`p-1.5 rounded-lg transition text-xs cursor-pointer ${
                      renderedChartLayout === "line" ? "bg-zinc-900 text-blue-400 border border-zinc-800" : "text-zinc-650 hover:text-zinc-300"
                    }`}
                    title="Render as Line Layout"
                  >
                    <LineIcon className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => setOverrideType("area")}
                    className={`p-1.5 rounded-lg transition text-xs cursor-pointer ${
                      renderedChartLayout === "area" ? "bg-zinc-900 text-blue-400 border border-zinc-800" : "text-zinc-650 hover:text-zinc-300"
                    }`}
                    title="Render as Area Layout"
                  >
                    <TrendingUp className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => setOverrideType("pie")}
                    className={`p-1.5 rounded-lg transition text-xs cursor-pointer ${
                      renderedChartLayout === "pie" ? "bg-zinc-900 text-blue-400 border border-zinc-800" : "text-zinc-650 hover:text-zinc-300"
                    }`}
                    title="Render as Pie Layout"
                  >
                    <PieIcon className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => setOverrideType("scatter")}
                    className={`p-1.5 rounded-lg transition text-xs cursor-pointer ${
                      renderedChartLayout === "scatter" ? "bg-zinc-900 text-blue-400 border border-zinc-800" : "text-zinc-650 hover:text-zinc-300"
                    }`}
                    title="Render as Scatter Plot"
                  >
                    <Grid className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => setOverrideType("stacked_bar")}
                    className={`p-1.5 rounded-lg transition text-xs cursor-pointer ${
                      renderedChartLayout === "stacked_bar" ? "bg-zinc-900 text-blue-400 border border-zinc-800" : "text-zinc-650 hover:text-zinc-300"
                    }`}
                    title="Render as Stacked Bar Layout"
                  >
                    <Layers className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => setOverrideType("radar")}
                    className={`p-1.5 rounded-lg transition text-xs cursor-pointer ${
                      renderedChartLayout === "radar" ? "bg-zinc-900 text-blue-400 border border-zinc-800" : "text-zinc-650 hover:text-zinc-300"
                    }`}
                    title="Render as Radar Layout"
                  >
                    <Compass className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => setOverrideType("composed")}
                    className={`p-1.5 rounded-lg transition text-xs cursor-pointer ${
                      renderedChartLayout === "composed" ? "bg-zinc-900 text-blue-400 border border-zinc-800" : "text-zinc-650 hover:text-zinc-300"
                    }`}
                    title="Render as Composed Layout"
                  >
                    <Zap className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Customizers sliders/checks bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3 bg-black/40 border border-zinc-900 p-3 rounded-2xl mb-4 font-mono text-[9px] uppercase tracking-wider text-zinc-400">
                <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1 lg:col-span-2 xl:col-span-1">
                  <Palette className="h-3.5 w-3.5 text-zinc-500" />
                  <select 
                    value={activeTheme} 
                    onChange={(e) => setActiveTheme(e.target.value as any)}
                    className="bg-black text-[9px] border border-zinc-850 px-2 py-1 rounded text-zinc-300 font-semibold focus:outline-none cursor-pointer w-full"
                  >
                    <option value="ocean">Ocean Royal</option>
                    <option value="emerald">Emerald Forest</option>
                    <option value="cyber">Cyber Purple</option>
                    <option value="sunset">Sunset Gold</option>
                    <option value="rose">Neon Rose</option>
                    <option value="minimal">Minimalist Mono</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 cursor-pointer py-1 select-none">
                  <input 
                    type="checkbox" 
                    checked={chartOptions.gridlines} 
                    onChange={(e) => setChartOptions({ ...chartOptions, gridlines: e.target.checked })}
                    className="rounded border-zinc-800 bg-black text-blue-600 focus:ring-0 h-3.5 w-3.5"
                  />
                  <span>Gridlines</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer py-1 select-none">
                  <input 
                    type="checkbox" 
                    checked={chartOptions.tooltips} 
                    onChange={(e) => setChartOptions({ ...chartOptions, tooltips: e.target.checked })}
                    className="rounded border-zinc-800 bg-black text-blue-600 focus:ring-0 h-3.5 w-3.5"
                  />
                  <span>Tooltips</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer py-1 select-none">
                  <input 
                    type="checkbox" 
                    checked={chartOptions.legends} 
                    onChange={(e) => setChartOptions({ ...chartOptions, legends: e.target.checked })}
                    className="rounded border-zinc-800 bg-black text-blue-600 focus:ring-0 h-3.5 w-3.5"
                  />
                  <span>Legends</span>
                </label>
              </div>

              {/* Main Canvas previewer area */}
              <div className="bg-black/98 border border-zinc-900/60 rounded-2xl p-5 relative flex justify-center items-center min-h-[350px]">
                {isGenerating ? (
                  <div className="flex flex-col items-start justify-center space-y-4 max-w-sm w-full mx-auto p-5 bg-zinc-950/45 rounded-2xl border border-zinc-900/50">
                    <div className="flex items-center gap-2 border-b border-zinc-900 pb-2.5 w-full mb-1">
                      <div className="h-4.5 w-4.5 rounded-full border border-blue-500/40 flex items-center justify-center animate-spin">
                        <Sparkle className="h-2.5 w-2.5 text-blue-500" />
                      </div>
                      <span className="font-mono text-[9px] text-[#00c8ff] uppercase tracking-widest font-bold">Engine Compilation Stream</span>
                    </div>
                    
                    <div className="space-y-3 w-full font-mono text-[10px] text-zinc-400">
                      {[
                        "Understanding Data",
                        "Structuring Dataset",
                        "Selecting Chart Layout",
                        "Generating Predictive Insights",
                        "Rendering High-Fidelity Canvas"
                      ].map((stepName, stepIndex) => {
                        const isFinished = generationStage > stepIndex;
                        const isCurrent = generationStage === stepIndex;
                        const isPending = generationStage < stepIndex;
                        
                        return (
                          <div 
                            key={stepIndex} 
                            className={`flex items-center gap-3 transition-colors duration-200 ${
                              isCurrent ? "text-white font-semibold" : isFinished ? "text-emerald-500" : "text-zinc-650"
                            }`}
                          >
                            <div className="w-4 flex justify-center">
                              {isFinished && <Check className="h-3.5 w-3.5 text-emerald-500" />}
                              {isCurrent && <RefreshCw className="h-3 w-3 text-blue-500 animate-spin" />}
                              {isPending && <span className="h-1.5 w-1.5 rounded-full bg-zinc-800" />}
                            </div>
                            <span className={isCurrent ? "underline decoration-blue-500/40 underline-offset-4" : ""}>
                              {stepName}...
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div id="chart-snapshot-frame" className="w-full relative py-2">
                    {renderedChartLayout === "bar" && (
                      <ResponsiveContainer width="100%" height={290}>
                        <BarChart data={currentDisplayedChart.data} margin={{ top: 12, right: 10, left: -25, bottom: 5 }}>
                          {chartOptions.gridlines && <CartesianGrid strokeDasharray="3 3" stroke="#2c2c35" opacity={0.25} />}
                          <XAxis dataKey="label" stroke="#71717a" fontSize={10} tickLine={false} />
                          <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                          {chartOptions.tooltips && <Tooltip contentStyle={{ backgroundColor: "#0c0c0f", borderColor: "#27272a", borderRadius: "8px" }} />}
                          {chartOptions.legends && <Legend wrapperStyle={{ fontSize: "10px", marginTop: "10px" }} />}
                          <Bar dataKey="value" name="Metric Value" fill={schemeColors[0]} radius={[4, 4, 0, 0]}>
                            {currentDisplayedChart.data.map((entry: any, idx: number) => (
                              <Cell key={`cell-${idx}`} fill={schemeColors[idx % schemeColors.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    )}

                    {renderedChartLayout === "line" && (
                      <ResponsiveContainer width="100%" height={290}>
                        <LineChart data={currentDisplayedChart.data} margin={{ top: 12, right: 10, left: -25, bottom: 5 }}>
                          {chartOptions.gridlines && <CartesianGrid strokeDasharray="3 3" stroke="#2c2c35" opacity={0.25} />}
                          <XAxis dataKey="label" stroke="#71717a" fontSize={10} tickLine={false} />
                          <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                          {chartOptions.tooltips && <Tooltip contentStyle={{ backgroundColor: "#0c0c0f", borderColor: "#27272a", borderRadius: "8px" }} />}
                          {chartOptions.legends && <Legend wrapperStyle={{ fontSize: "10px", marginTop: "10px" }} />}
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke={schemeColors[0]} 
                            strokeWidth={3}
                            activeDot={{ r: 5 }} 
                            name="Metric Value"
                            dot={{ fill: schemeColors[0], r: 3 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}

                    {renderedChartLayout === "pie" && (
                      <ResponsiveContainer width="100%" height={290}>
                        <PieChart>
                          {chartOptions.tooltips && <Tooltip contentStyle={{ backgroundColor: "#0c0c0f", borderColor: "#27272a", borderRadius: "8px" }} />}
                          {chartOptions.legends && <Legend wrapperStyle={{ fontSize: "10px" }} />}
                          <Pie
                            data={currentDisplayedChart.data}
                            dataKey="value"
                            nameKey="label"
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={85}
                            paddingAngle={3}
                            label={{ fill: '#d4d4d8', fontSize: 10 }}
                          >
                            {currentDisplayedChart.data.map((entry: any, idx: number) => (
                              <Cell key={`pie-cell-${idx}`} fill={schemeColors[idx % schemeColors.length]} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    )}

                    {renderedChartLayout === "area" && (
                      <ResponsiveContainer width="100%" height={290}>
                        <AreaChart data={currentDisplayedChart.data} margin={{ top: 12, right: 10, left: -25, bottom: 5 }}>
                          {chartOptions.gridlines && <CartesianGrid strokeDasharray="3 3" stroke="#2c2c35" opacity={0.25} />}
                          <XAxis dataKey="label" stroke="#71717a" fontSize={10} tickLine={false} />
                          <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                          {chartOptions.tooltips && <Tooltip contentStyle={{ backgroundColor: "#0c0c0f", borderColor: "#27272a", borderRadius: "8px" }} />}
                          {chartOptions.legends && <Legend wrapperStyle={{ fontSize: "10px", marginTop: "10px" }} />}
                          <defs>
                            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={schemeColors[0] || "#3b82f6"} stopOpacity={0.5}/>
                              <stop offset="95%" stopColor={schemeColors[0] || "#3b82f6"} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="value" stroke={schemeColors[0] || "#3b82f6"} fillOpacity={1} fill="url(#areaGrad)" strokeWidth={3} name="Metric Value" />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}

                    {renderedChartLayout === "scatter" && (
                      <ResponsiveContainer width="100%" height={290}>
                        <ScatterChart margin={{ top: 12, right: 10, left: -25, bottom: 5 }}>
                          {chartOptions.gridlines && <CartesianGrid strokeDasharray="3 3" stroke="#2c2c35" opacity={0.25} />}
                          <XAxis dataKey="label" stroke="#71717a" fontSize={10} tickLine={false} />
                          <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                          {chartOptions.tooltips && <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: "#0c0c0f", borderColor: "#27272a", borderRadius: "8px" }} />}
                          {chartOptions.legends && <Legend wrapperStyle={{ fontSize: "10px", marginTop: "10px" }} />}
                          <Scatter name="Metric Value" data={currentDisplayedChart.data} fill={schemeColors[0] || "#3b82f6"} />
                        </ScatterChart>
                      </ResponsiveContainer>
                    )}

                    {renderedChartLayout === "stacked_bar" && (
                      <ResponsiveContainer width="100%" height={290}>
                        <BarChart data={currentDisplayedChart.data} margin={{ top: 12, right: 10, left: -25, bottom: 5 }}>
                          {chartOptions.gridlines && <CartesianGrid strokeDasharray="3 3" stroke="#2c2c35" opacity={0.25} />}
                          <XAxis dataKey="label" stroke="#71717a" fontSize={10} tickLine={false} />
                          <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                          {chartOptions.tooltips && <Tooltip contentStyle={{ backgroundColor: "#0c0c0f", borderColor: "#27272a", borderRadius: "8px" }} />}
                          {chartOptions.legends && <Legend wrapperStyle={{ fontSize: "10px", marginTop: "10px" }} />}
                          <Bar dataKey="value" name="Metric Value" stackId="a" fill={schemeColors[0] || "#3b82f6"} radius={[2, 2, 0, 0]} />
                          <Bar dataKey="value" name="Baseline value" stackId="a" fill={schemeColors[1] || schemeColors[0] || "#6366f1"} opacity={0.5} radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}

                    {renderedChartLayout === "radar" && (
                      <ResponsiveContainer width="100%" height={290}>
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={currentDisplayedChart.data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                          <PolarGrid stroke="#2c2c35" opacity={0.3} />
                          <PolarAngleAxis dataKey="label" stroke="#71717a" fontSize={9} />
                          <PolarRadiusAxis stroke="#71717a" fontSize={8} />
                          <Radar name="Metric Value" dataKey="value" stroke={schemeColors[0] || "#3b82f6"} fill={schemeColors[0] || "#3b82f6"} fillOpacity={0.3} />
                          {chartOptions.tooltips && <Tooltip contentStyle={{ backgroundColor: "#0c0c0f", borderColor: "#27272a", borderRadius: "8px" }} />}
                        </RadarChart>
                      </ResponsiveContainer>
                    )}

                    {renderedChartLayout === "composed" && (
                      <ResponsiveContainer width="100%" height={290}>
                        <ComposedChart data={currentDisplayedChart.data} margin={{ top: 12, right: 10, left: -25, bottom: 5 }}>
                          {chartOptions.gridlines && <CartesianGrid strokeDasharray="3 3" stroke="#2c2c35" opacity={0.25} />}
                          <XAxis dataKey="label" stroke="#71717a" fontSize={10} tickLine={false} />
                          <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                          {chartOptions.tooltips && <Tooltip contentStyle={{ backgroundColor: "#0c0c0f", borderColor: "#27272a", borderRadius: "8px" }} />}
                          {chartOptions.legends && <Legend wrapperStyle={{ fontSize: "10px", marginTop: "10px" }} />}
                          <Bar dataKey="value" name="Bar Metric" fill={schemeColors[0] || "#3b82f6"} radius={[4, 4, 0, 0]} barSize={20} />
                          <Line type="monotone" dataKey="value" name="Trend Index" stroke={schemeColors[1] || "#6366f1"} strokeWidth={2.5} dot={{ fill: schemeColors[1] || "#6366f1", r: 3 }} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                )}
              </div>

              {/* Exports button group */}
              <div className="mt-5 border-t border-zinc-900 pt-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-wider font-extrabold text-zinc-500">
                <div className="flex items-center gap-1">
                  <Download className="h-3.5 w-3.5 text-zinc-550" />
                  <span>Platform Export:</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={triggerSVGDownload}
                    className="px-3 py-1.5 bg-black hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 rounded transition cursor-pointer select-none text-zinc-300"
                  >
                    SVG vector
                  </button>
                  <button 
                    onClick={triggerPNGDownload}
                    className="px-3 py-1.5 bg-black hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 rounded transition cursor-pointer select-none text-zinc-300"
                  >
                    PNG raster
                  </button>
                  <button 
                    onClick={triggerPDFDownload}
                    className="px-3 py-1.5 bg-blue-950/20 hover:bg-blue-900/20 border border-blue-900/35 hover:border-blue-900/60 text-blue-400 rounded transition cursor-pointer select-none"
                  >
                    PDF brief
                  </button>
                </div>
              </div>

            </div>

            {/* AI Insight analysis sheet */}
            <div className="bg-[#09090b] border border-zinc-900 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 pointer-events-none opacity-[0.03]">
                <Clock className="h-16 w-16 text-zinc-300" />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-blue-500 font-bold">EXECUTIVE INSIGHT REPORT</span>
              </div>
              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-sans font-light">
                {currentDisplayedChart.explanation}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 5: FEATURES GRILL (Using premium cards with hover motion) */}
      <section id="features" className="w-full max-w-7xl px-6 py-16 scroll-mt-28 relative z-10 select-none">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="font-mono text-[9px] text-[#0066ee] tracking-widest uppercase font-extrabold block">SAAS CAPABILITIES</span>
          <h2 className="text-3xl md:text-4xl font-display font-medium text-white tracking-tight">Everything you need to ship metrics</h2>
          <p className="text-zinc-450 font-light text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Skip complex manual layout sheets or graphic configurations. Just explain details and download results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-[#09090b]/40 border border-zinc-900 hover:border-zinc-805 hover:bg-zinc-950 transition-all rounded-3xl p-6 text-left space-y-4 shadow-sm group duration-200">
            <div className="h-10 w-10 rounded-xl bg-blue-600/10 flex items-center justify-center border border-blue-500/15 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition duration-200">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white tracking-tight">AI Chart Generation</h3>
            <p className="text-zinc-450 text-xs leading-relaxed font-light font-sans">
              Advanced natural language processing translates loose markdown lists or unstructured copying outputs into beautiful charts.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#09090b]/40 border border-zinc-900 hover:border-zinc-805 hover:bg-zinc-950 transition-all rounded-3xl p-6 text-left space-y-4 shadow-sm group duration-200">
            <div className="h-10 w-10 rounded-xl bg-violet-600/10 flex items-center justify-center border border-violet-500/15 text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition duration-200">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white tracking-tight">Smart Analytics</h3>
            <p className="text-zinc-450 text-xs leading-relaxed font-light font-sans">
              System flags extreme indexes, calculates relative rates of expansion, tracks low thresholds, and outputs precise data tables automatically.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#09090b]/40 border border-zinc-900 hover:border-zinc-805 hover:bg-zinc-950 transition-all rounded-3xl p-6 text-left space-y-4 shadow-sm group duration-200">
            <div className="h-10 w-10 rounded-xl bg-indigo-600/10 flex items-center justify-center border border-indigo-500/15 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition duration-200">
              <Share2 className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white tracking-tight">Presentation Export</h3>
            <p className="text-zinc-450 text-xs leading-relaxed font-light font-sans">
              Save vectors directly in standard high-fidelity formats like raw XML SVG, crisp image PNG, or executive analytical brief files.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-[#09090b]/40 border border-zinc-900 hover:border-zinc-805 hover:bg-zinc-950 transition-all rounded-3xl p-6 text-left space-y-4 shadow-sm group duration-200">
            <div className="h-10 w-10 rounded-xl bg-emerald-600/10 flex items-center justify-center border border-emerald-500/15 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition duration-200">
              <Palette className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white tracking-tight">Brand Themes</h3>
            <p className="text-zinc-450 text-xs leading-relaxed font-light font-sans">
              Apply a curated set of Apple and Stripe level color schemes dynamically to make your documents feel beautifully structured.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-[#09090b]/40 border border-zinc-900 hover:border-zinc-805 hover:bg-zinc-950 transition-all rounded-3xl p-6 text-left space-y-4 shadow-sm group duration-200">
            <div className="h-10 w-10 rounded-xl bg-rose-600/10 flex items-center justify-center border border-rose-500/15 text-rose-400 group-hover:bg-rose-600 group-hover:text-white transition duration-200">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white tracking-tight">Instant Insights</h3>
            <p className="text-zinc-450 text-xs leading-relaxed font-light font-sans">
              Executive level briefs provide clean summaries of overall structures, saving you from drafting manual text highlights for slides.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-[#09090b]/40 border border-zinc-900 hover:border-zinc-805 hover:bg-zinc-950 transition-all rounded-3xl p-6 text-left space-y-4 shadow-sm group duration-200">
            <div className="h-10 w-10 rounded-xl bg-zinc-600/10 flex items-center justify-center border border-zinc-500/15 text-zinc-300 group-hover:bg-white group-hover:text-black transition duration-200">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white tracking-tight">Interactive Dashboard</h3>
            <p className="text-zinc-450 text-xs leading-relaxed font-light font-sans">
              Store recently processed graphics inside your secure local browser cache. Enjoy premium workspace analytics with no database login overhead.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 6: HOW IT WORKS (Animated timeline layout) */}
      <section id="how-it-works" className="w-full max-w-7xl px-6 py-16 scroll-mt-28 relative z-10 select-none">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="font-mono text-[9px] text-[#0066ee] tracking-widest uppercase font-extrabold block">TIMELINE CHANNELS</span>
          <h2 className="text-3xl md:text-4xl font-display font-medium text-white tracking-tight">Four simple stages to visual reports</h2>
          <p className="text-zinc-450 font-light text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
            See how the pipeline processes raw texts in real-time.
          </p>
        </div>

        {/* Steps roadmap timeline */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-900/60 -translate-y-1/2 hidden md:block -z-10" />

          {/* Step 1 */}
          <div className="space-y-4 text-left group">
            <div className="h-10 w-10 rounded-full bg-zinc-950 border border-zinc-900 flex items-center justify-center font-mono text-xs text-blue-500 font-extrabold group-hover:border-blue-500/40 duration-205">
              01
            </div>
            <h3 className="text-sm font-semibold text-white tracking-tight">Describe Data</h3>
            <p className="text-zinc-550 text-xs leading-relaxed font-sans font-light">
              Type values, category segments, or dropping Excel CSV reports inside the simple plain English input prompt section.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-4 text-left group">
            <div className="h-10 w-10 rounded-full bg-zinc-950 border border-zinc-900 flex items-center justify-center font-mono text-xs text-purple-500 font-extrabold group-hover:border-purple-500/40 duration-205">
              02
            </div>
            <h3 className="text-sm font-semibold text-white tracking-tight">AI Understands</h3>
            <p className="text-zinc-550 text-xs leading-relaxed font-sans font-light">
              Multimodal parsing engine organizes values, extracts coordinates automatically, and targets ideal charts structure schemas.
            </p>
          </div>

          {/* Step 3 */}
          <div className="space-y-4 text-left group">
            <div className="h-10 w-10 rounded-full bg-zinc-950 border border-zinc-900 flex items-center justify-center font-mono text-xs text-indigo-500 font-extrabold group-hover:border-indigo-500/40 duration-205">
              03
            </div>
            <h3 className="text-sm font-semibold text-white tracking-tight">Generate Chart</h3>
            <p className="text-zinc-550 text-xs leading-relaxed font-sans font-light">
              A premium responsive Recharts view loads directly inside your card, allowing real-time custom toggles or color alterations.
            </p>
          </div>

          {/* Step 4 */}
          <div className="space-y-4 text-left group">
            <div className="h-10 w-10 rounded-full bg-zinc-950 border border-zinc-900 flex items-center justify-center font-mono text-xs text-emerald-500 font-extrabold group-hover:border-emerald-500/40 duration-205">
              04
            </div>
            <h3 className="text-sm font-semibold text-white tracking-tight">Export Anywhere</h3>
            <p className="text-zinc-550 text-xs leading-relaxed font-sans font-light">
              Download graphics as crisp raster images, vector XML maps, or compiled executive PDF brief files ready to mail stakeholders.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 7: COMPARISON TABLE (SaaS vs Traditional tools) */}
      <section id="comparison" className="w-full max-w-7xl px-6 py-16 relative z-10 select-none scroll-mt-28">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="font-mono text-[9px] text-blue-500 tracking-widest uppercase font-extrabold block">DIFFERENTIAL VALUE</span>
          <h2 className="text-3xl md:text-4xl font-display font-medium text-white tracking-tight">FreeChart AI vs Legacy Tools</h2>
          <p className="text-zinc-450 font-light text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
            Discover why manual design grids are a bottleneck to rapid metrics analysis.
          </p>
        </div>

        <div className="overflow-x-auto border border-zinc-900 rounded-3xl bg-zinc-950/20 backdrop-blur-sm">
          <table className="w-full min-w-[600px] text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-900 font-mono text-[9px] tracking-widest uppercase text-zinc-500 bg-black/40">
                <th className="p-4 pl-6">Core Capabilities</th>
                <th className="p-4 text-white font-extrabold">FreeChart AI</th>
                <th className="p-4">Excel Sheets</th>
                <th className="p-4">Canva Charts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 font-sans text-zinc-350">
              <tr>
                <td className="p-4 pl-6 font-semibold text-white">English input processing</td>
                <td className="p-4 text-blue-500 font-bold flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" /> High Precision
                </td>
                <td className="p-4 text-zinc-650">❌ Manual Formulas</td>
                <td className="p-4 text-zinc-650">❌ Drag & Drop Only</td>
              </tr>
              <tr>
                <td className="p-4 pl-6 font-semibold text-white">Automatic Insight generation</td>
                <td className="p-4 text-blue-500 font-bold flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" /> Calculated text brief
                </td>
                <td className="p-4 text-zinc-650">❌ Manual formatting</td>
                <td className="p-4 text-zinc-650">❌ Non-intelligent</td>
              </tr>
              <tr>
                <td className="p-4 pl-6 font-semibold text-white">Apple/Stripe theme presets</td>
                <td className="p-4 text-blue-500 font-bold flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" /> Curated colorways
                </td>
                <td className="p-4 text-zinc-650">⚠️ Low fidelity presets</td>
                <td className="p-4 text-zinc-650">⚠️ Over-complicated grids</td>
              </tr>
              <tr>
                <td className="p-4 pl-6 font-semibold text-white">Vector SVG and analytic briefs PDF</td>
                <td className="p-4 text-blue-500 font-bold flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" /> 1-Click Export
                </td>
                <td className="p-4 text-zinc-550">⚠️ Rough exports</td>
                <td className="p-4 text-zinc-550">⚠️ Paywalled vector formats</td>
              </tr>
              <tr>
                <td className="p-4 pl-6 font-semibold text-white">Privacy Safe offline storage</td>
                <td className="p-4 text-blue-500 font-bold flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" /> No database account needed
                </td>
                <td className="p-4 text-zinc-650">❌ Heavy app installations</td>
                <td className="p-4 text-zinc-550">⚠️ Required Cloud cloud logins</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 8: TESTIMONIALS (Premium glass hover grid) */}
      <section id="examples" className="w-full max-w-7xl px-6 py-16 scroll-mt-28 relative z-10 select-none">
        
        {/* RECENT HISTORIES FROM REAL USER SESSIONS */}
        {recentCharts.length > 0 && (
          <div className="mb-16">
            <div className="flex flex-wrap items-center justify-between border-b border-zinc-900 pb-4 mb-8">
              <div className="text-left">
                <span className="font-mono text-[9px] text-zinc-550 tracking-widest block uppercase">LOCAL RECENT SESSIONS</span>
                <h3 className="text-lg font-display font-medium text-white tracking-tight">Recently Generated Documents</h3>
              </div>
              <button 
                onClick={() => {
                  setRecentCharts([]);
                  localStorage.removeItem("fc_recent_charts_saved");
                }}
                className="px-3 py-1.5 border border-zinc-900 hover:border-red-900/30 hover:bg-red-950/10 rounded-lg font-mono text-[9px] text-zinc-550 hover:text-red-400 transition"
              >
                Clear History caches
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentCharts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setActiveChart(item);
                    setOverrideType(null); // Reset layout types
                    const targetEl = document.getElementById("interactive-viewport");
                    if (targetEl) targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  className={`bg-[#09090b]/50 border rounded-2xl p-4 cursor-pointer text-left relative group hover:bg-[#0c0c0f] hover:border-zinc-805 transition-all duration-200 flex flex-col justify-between hover:shadow-lg ${
                    activeChart?.id === item.id ? "border-blue-500/40" : "border-zinc-900/80"
                  }`}
                >
                  <button
                    onClick={(e) => deleteHistoryId(item.id, e)}
                    className="absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 p-1 bg-black/40 border border-zinc-900 hover:border-zinc-850 hover:text-red-400 rounded transition"
                    title="Remove item"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>

                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-[8.5px] font-mono uppercase text-zinc-550">
                      {item.chartType === "bar" && <BarChart3 className="h-3.5 w-3.5 text-blue-400" />}
                      {item.chartType === "line" && <LineIcon className="h-3.5 w-3.5 text-purple-400" />}
                      {item.chartType === "pie" && <PieIcon className="h-3.5 w-3.5 text-emerald-400" />}
                      <span>{item.chartType} chart</span>
                    </div>
                    <h4 className="text-xs font-semibold text-zinc-200 tracking-tight line-clamp-1">{item.title}</h4>
                    <p className="text-[10.5px] text-zinc-500 font-sans font-light leading-relaxed line-clamp-2">{item.explanation}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-900/40 flex items-center justify-between text-[8px] font-mono text-zinc-650">
                    <span className="truncate max-w-[155px]">PROMPT: "{item.prompt}"</span>
                    <span>{new Date(item.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="font-mono text-[9px] text-[#0066ee] tracking-widest uppercase font-extrabold block">GLOBAL REVIEWS (Illustrative Examples)</span>
          <h2 className="text-3xl md:text-4xl font-display font-medium text-white tracking-tight">Approved by modern analysts</h2>
          <p className="text-zinc-450 font-light text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Illustrative testimonials based on live sandbox user feedback collected during our private partner previews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 text-left space-y-4 hover:bg-zinc-950/75 transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-blue-700/10 border border-blue-500/20 flex items-center justify-center text-xs font-mono font-bold text-blue-400">
                MK
              </div>
              <div>
                <strong className="block text-white text-xs tracking-tight">Maximilian Kross</strong>
                <span className="text-[10px] text-zinc-550 font-mono">Founding Partner, FlowState</span>
              </div>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed font-sans font-light italic">
              "We dropped the legacy charts plugins entirely. FreeChart generates executive PDFs in seconds that we can immediately mail to capital partners."
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 text-left space-y-4 hover:bg-zinc-950/75 transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-indigo-700/10 border border-indigo-500/20 flex items-center justify-center text-xs font-mono font-bold text-indigo-400">
                SR
              </div>
              <div>
                <strong className="block text-white text-xs tracking-tight">Sophia Ramirez</strong>
                <span className="text-[10px] text-zinc-550 font-mono">Head Analytics, ScaleVessel</span>
              </div>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed font-sans font-light italic">
              "The ability to drag and drop simple text CSV rows and output clean, vector SVGs styled on beautiful modern color schemes is a total life saver."
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 text-left space-y-4 hover:bg-zinc-950/75 transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-emerald-700/10 border border-emerald-500/20 flex items-center justify-center text-xs font-mono font-bold text-emerald-400">
                JZ
              </div>
              <div>
                <strong className="block text-white text-xs tracking-tight">James Zhao</strong>
                <span className="text-[10px] text-zinc-550 font-mono">Operations, Apex Yields</span>
              </div>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed font-sans font-light italic">
              "Simple, lightweight, transparent, and completely database account free. The local privacy architecture aligns perfectly with our data security guidelines."
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 9: PRICING (Free, Pro, Team plans matrix) */}
      <section id="pricing" className="w-full max-w-7xl px-6 py-16 scroll-mt-28 relative z-10 select-none">
        
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="font-mono text-[9px] text-[#0066ee] tracking-widest uppercase font-extrabold block">TRANSPARENT VALUE</span>
          <h2 className="text-3xl md:text-4xl font-display font-medium text-white tracking-tight">SaaS Monetization Tiers</h2>
          <p className="text-zinc-450 font-light text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
            Generate unlimited vector assets and access advanced intelligent report metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          
          {/* FREE PLAN */}
          <div className="bg-[#09090b]/30 border border-zinc-900/60 rounded-3xl p-6 text-left flex flex-col justify-between hover:border-zinc-800 transition">
            <div className="space-y-4">
              <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-850 rounded font-mono text-[8.5px] uppercase tracking-wider text-zinc-500">FREE PLAN</span>
              <h3 className="text-lg font-semibold text-white tracking-tight">Starter</h3>
              <p className="text-zinc-550 text-xs font-sans font-light leading-relaxed">Essential plain English visualization triggers.</p>
              
              <div className="py-2">
                <span className="text-3xl font-semibold tracking-tight text-white">$0</span>
                <span className="text-[10px] text-zinc-650 font-mono tracking-wider ml-1">/ FOREVER</span>
              </div>

              <div className="h-px bg-zinc-900" />

              <ul className="space-y-2.5 text-[11px] font-sans text-zinc-400">
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-blue-500" /> 10 smart charts per day</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-blue-500" /> Default dashboard themes</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-blue-500" /> Instantly CSV data drops parser</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-blue-500" /> Safe localstorage cache storage</li>
              </ul>
            </div>

            <button
              onClick={() => {
                const el = document.getElementById("interactive-viewport");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="mt-8 w-full py-2.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 text-xs font-mono text-zinc-300 rounded-full transition cursor-pointer text-center"
            >
              Get Started Free
            </button>
          </div>

          {/* PRO PLAN */}
          <div className="bg-[#09090b] border-2 border-blue-900/80 rounded-3xl p-6 text-left flex flex-col justify-between relative overflow-hidden shadow-[0_12px_45px_rgba(59,130,246,0.08)]">
            <div className="absolute top-0 right-0 p-3 bg-blue-600 text-[8px] font-mono tracking-widest text-white uppercase font-bold rounded-bl-xl">
              POPULAR
            </div>

            <div className="space-y-4">
              <span className="px-2.5 py-1 bg-blue-900/20 text-blue-400 border border-blue-900/35 rounded font-mono text-[8.5px] uppercase tracking-wider font-extrabold">RECOMMENDED</span>
              <h3 className="text-lg font-semibold text-white tracking-tight">Pro Master</h3>
              <p className="text-zinc-500 text-xs font-sans font-light leading-relaxed">Advanced analytics for high-performance scale.</p>
              
              <div className="py-2">
                <span className="text-3xl font-semibold tracking-tight text-white">$15</span>
                <span className="text-[10px] text-zinc-500 font-mono tracking-wider ml-1">/ MONTHLY</span>
              </div>

              <div className="h-px bg-zinc-900" />

              <ul className="space-y-2.5 text-[11px] font-sans text-zinc-300 font-light">
                <li className="flex items-center gap-2 font-medium text-white"><Check className="h-3.5 w-3.5 text-blue-500" /> Unlimited visual charts</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-blue-500" /> Premium color design schemes</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-blue-500" /> Presentation vector PDF & SVG formats</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-blue-500" /> High performance priority API access</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-blue-500" /> Future API keys integration</li>
              </ul>
            </div>

            <button
              onClick={() => {
                const waitlistSec = document.getElementById("waitlist");
                if (waitlistSec) {
                  waitlistSec.scrollIntoView({ behavior: "smooth" });
                  const inp = document.getElementById("waitlist-email-input");
                  if (inp) inp.focus();
                }
              }}
              className="mt-8 w-full py-2.5 bg-white text-black hover:bg-zinc-150 rounded-full text-xs font-mono font-bold transition cursor-pointer text-center"
            >
              Order Pro (Coming Soon)
            </button>
          </div>

          {/* TEAM PLAN */}
          <div className="bg-[#09090b]/30 border border-zinc-900/60 rounded-3xl p-6 text-left flex flex-col justify-between hover:border-zinc-800 transition">
            <div className="space-y-4">
              <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-850 rounded font-mono text-[8.5px] uppercase tracking-wider text-zinc-500">ENTERPRISE HUB</span>
              <h3 className="text-lg font-semibold text-white tracking-tight">Enterprise</h3>
              <p className="text-zinc-550 text-xs font-sans font-light leading-relaxed">Secure data pipelines for overall departments.</p>
              
              <div className="py-2">
                <span className="text-3xl font-semibold tracking-tight text-white">$45</span>
                <span className="text-[10px] text-zinc-650 font-mono tracking-wider ml-1">/ MONTHLY</span>
              </div>

              <div className="h-px bg-zinc-900" />

              <ul className="space-y-2.5 text-[11px] font-sans text-zinc-400">
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-blue-500" /> Everything inside Pro</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-blue-500" /> Collaborative shared directories</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-blue-500" /> Encrypted team workspace states</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-blue-500" /> SLA stable dedicated servers</li>
              </ul>
            </div>

            <button
              onClick={() => {
                const waitlistSec = document.getElementById("waitlist");
                if (waitlistSec) {
                  waitlistSec.scrollIntoView({ behavior: "smooth" });
                  const inp = document.getElementById("waitlist-email-input");
                  if (inp) inp.focus();
                }
              }}
              className="mt-8 w-full py-2.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 text-xs font-mono text-zinc-300 rounded-full transition cursor-pointer text-center"
            >
              Contact Team Partner
            </button>
          </div>

        </div>
      </section>

      {/* SECTION 10: WAITLIST EMAIL CAPTURE & FINAL CTA */}
      <section id="waitlist" className="w-full max-w-7xl px-6 py-16 scroll-mt-24 relative z-10 select-none text-center">
        <div className="bg-[#09090b]/80 border border-zinc-900 rounded-3xl p-8 sm:p-12 md:p-16 max-w-4xl mx-auto relative overflow-hidden text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/5 blur-3xl rounded-full pointer-events-none" />
          
          <div className="space-y-6 max-w-2xl mx-auto relative z-10">
            <span className="font-mono text-[9px] text-blue-500 font-bold tracking-widest uppercase">PLATFORM WAITLIST</span>
            <h2 className="text-3xl sm:text-4xl font-display font-medium text-white tracking-tight leading-none">
              Stop wasting hours creating charts manually.
            </h2>
            <p className="text-zinc-450 font-light text-xs sm:text-sm leading-relaxed max-w-lg mx-auto font-sans">
              Get notified immediately when Enterprise multi-collaborative directories, Custom Styles, and full API key access launch.
            </p>

            <form onSubmit={submitWaitlist} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto relative z-10">
              <input
                id="waitlist-email-input"
                type="email"
                placeholder="Enter your work email address"
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                className="flex-1 bg-black border border-zinc-900 focus:border-zinc-800 rounded-full px-5 py-3 text-xs text-white placeholder-zinc-700 outline-none focus:ring-0 shadow-inner"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white hover:bg-zinc-150 text-black text-xs font-mono font-bold rounded-full cursor-pointer transition flex items-center justify-center gap-1.5 active:scale-98 duration-150 hover:scale-[1.02]"
              >
                <span>Notify Me</span>
                <Mail className="h-4 w-4" />
              </button>
            </form>

            <AnimatePresence>
              {waitlistState === "success" && (
                <motion.p 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-emerald-500 font-mono tracking-wider font-semibold"
                >
                  ✦ SUCCESS: Your email has been registered safely inside our waitlist index.
                </motion.p>
              )}
              {waitlistState === "error" && (
                <motion.p 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-red-500 font-mono tracking-wider font-semibold"
                >
                  ⚠️ ERROR: Please enter a valid business email address.
                </motion.p>
              )}
            </AnimatePresence>

          </div>
        </div>
      </section>

      {/* FINAL STATIC FOOTER */}
      <footer className="w-full max-w-7xl px-6 py-10 border-t border-zinc-900 text-center font-mono text-[9px] uppercase tracking-wider text-zinc-600 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© 2026 FREECHART.AI INC. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-4">
            <button className="hover:text-zinc-400 cursor-pointer">Security Protocol</button>
            <button className="hover:text-zinc-400 cursor-pointer">API Agreement</button>
            <button className="hover:text-zinc-400 cursor-pointer">Local Privacy Policy</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
