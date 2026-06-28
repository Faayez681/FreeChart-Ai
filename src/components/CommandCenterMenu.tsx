import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowRight, ShieldCheck, Cpu, Eye, Activity, HeartPulse, Sparkles, Terminal, Compass, Layers, Landmark, BookOpen, Mail } from "lucide-react";

interface CommandCenterMenuProps {
  isOpen: boolean;
  onClose: () => void;
  setCurrentView: (view: any) => void;
  scrollToSection: (id: string) => void;
  setIsDocsOpen: (open: boolean) => void;
  setIsPricingOpen: (open: boolean) => void;
}

// Custom hook to trace cursor coordinate within cards for precise premium spotlight glow
function useCursorTracker() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return { ref, coords, handleMouseMove };
}

// Dynamic Counter Animation
function AnimateCounter({
  target,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 1100,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setValue(progress * target);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [target, duration]);

  return (
    <span>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

// Particle interface
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedY: number;
  opacity: number;
}

export default function CommandCenterMenu({
  isOpen,
  onClose,
  setCurrentView,
  scrollToSection,
  setIsDocsOpen,
  setIsPricingOpen,
}: CommandCenterMenuProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const [activeHoverNav, setActiveHoverNav] = useState<string | null>(null);

  // Close with Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Handle ambient parallax tracking on mouse move
  useEffect(() => {
    const handleMouseMoveGlobal = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) / 35;
      const y = (e.clientY - window.innerHeight / 2) / 35;
      setParallaxOffset({ x, y });
    };

    if (isOpen) {
      window.addEventListener("mousemove", handleMouseMoveGlobal);
      // Setup fine background floating particles
      const newParticles = Array.from({ length: 25 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        speedY: Math.random() * 0.15 + 0.05,
        opacity: Math.random() * 0.5 + 0.2,
      }));
      setParticles(newParticles);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMoveGlobal);
    };
  }, [isOpen]);

  // Continuous animation of floating particles
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setParticles((prevParticles) =>
        prevParticles.map((pt) => ({
          ...pt,
          y: pt.y - pt.speedY < 0 ? 100 : pt.y - pt.speedY,
        }))
      );
    }, 45);
    return () => clearInterval(interval);
  }, [isOpen]);

  const navItems = [
    { label: "Home", action: () => { window.scrollTo({ top: 0, behavior: "smooth" }); setCurrentView("HOMEPAGE"); } },
    { label: "Platform", action: () => { setCurrentView("WORKSPACE"); } },
    { label: "AI Analysis", action: () => { setCurrentView("WORKSPACE"); } },
    { label: "Features", action: () => { scrollToSection("features-section"); } },
    { label: "Pricing", action: () => { setIsPricingOpen(true); } },
    { label: "Documentation", action: () => { setIsDocsOpen(true); } },
    { label: "Contact", action: () => { scrollToSection("active-workstation-dock"); } }, // scrolls down to lab
  ];

  const systems = [
    {
      title: "AI VISION",
      icon: <Eye className="h-5 w-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />,
      capabilities: ["Pattern Detection", "Trend Recognition", "Support & Resistance Mapping"],
      glowColor: "rgba(6, 182, 212, 0.15)",
      borderColor: "border-cyan-500/20 hover:border-cyan-400/60",
    },
    {
      title: "RISK ENGINE",
      icon: <ShieldCheck className="h-5 w-5 text-blue-500 group-hover:text-blue-400 transition-colors" />,
      capabilities: ["Stop Loss Calculation", "Position Sizing", "Risk-to-Reward Analysis"],
      glowColor: "rgba(59, 130, 246, 0.15)",
      borderColor: "border-blue-500/20 hover:border-blue-400/60",
    },
    {
      title: "MARKET INTELLIGENCE",
      icon: <Activity className="h-5 w-5 text-purple-500 group-hover:text-purple-400 transition-colors" />,
      capabilities: ["Sentiment Analysis", "News Processing", "Momentum Detection"],
      glowColor: "rgba(168, 85, 247, 0.15)",
      borderColor: "border-purple-500/20 hover:border-purple-400/60",
    },
  ];

  // Particle tracker & tilt refs for components
  const track1 = useCursorTracker();
  const track2 = useCursorTracker();
  const track3 = useCursorTracker();
  const trackers = [track1, track2, track3];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="fixed inset-0 z-[110] bg-black backdrop-blur-xl flex flex-col justify-between overflow-y-auto overflow-x-hidden font-sans select-none"
        id="futuristic-command-deck"
      >
        {/* BACKGROUND EFFECTS */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          
          {/* Subtle Parallax Background Node Overlay */}
          <div
            className="absolute inset-[-40px] opacity-15 transition-transform duration-300 ease-out"
            style={{
              transform: `translate(${parallaxOffset.x}px, ${parallaxOffset.y}px)`,
              backgroundImage: `radial-gradient(circle_at_center, rgba(0, 102, 238, 0.12) 0%, transparent 60%)`,
            }}
          />

          {/* Neural Grid Grid lines */}
          <div 
            className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(0,102,238,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(0,102,238,0.4)_1px,transparent_1px)] bg-[size:40px_40px]" 
            style={{ transform: `translate(${parallaxOffset.x * 0.4}px, ${parallaxOffset.y * 0.4}px)` }}
          />

          {/* Drifting horizontal TV scanlines */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_4px,rgba(0,200,255,0.015)_4px,rgba(0,200,255,0.015)_5px)] animate-scanDrift" />

          {/* Dynamic Floating Ambient Particle Stars */}
          {particles.map((pt) => (
            <div
              key={pt.id}
              className="absolute bg-cyan-400/40 rounded-full"
              style={{
                left: `${pt.x}%`,
                top: `${pt.y}%`,
                width: `${pt.size}px`,
                height: `${pt.size}px`,
                opacity: pt.opacity,
                boxShadow: pt.size > 2 ? "0 0 4px rgba(0, 200, 255, 0.5)" : "none",
                transition: "top 0.1s linear",
              }}
            />
          ))}

          {/* Neon Soft blue lighting pools in corners */}
          <div className="absolute top-1/4 left-0 w-[400px] h-[400px] rounded-full bg-blue-900/10 blur-[130px] -translate-x-1/2" />
          <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full bg-cyan-900/10 blur-[130px] translate-x-1/2" />
        </div>

        {/* CONTAINER MAIN: Spaced out for ultra premium feels */}
        <div className="w-full max-w-7xl mx-auto px-6 py-6 md:py-10 z-10 flex-grow flex flex-col justify-between space-y-10">
          
          {/* SECTION 1 — HEADER */}
          <header className="flex justify-between items-center border-b border-zinc-900/40 pb-6 relative">
            <div className="flex flex-col text-left">
              <span className="font-display tracking-[0.45em] font-black text-white text-xl sm:text-2xl drop-shadow-[0_0_12px_rgba(0,200,255,0.3)]">
                FREECHART AI
              </span>
              <div className="flex items-center gap-2 mt-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                </span>
                <span className="font-mono text-[9px] uppercase text-[#00c8ff] tracking-[0.2em]">
                  ● SYSTEM ONLINE // INSTITUTIONAL INTELLIGENCE LAYER
                </span>
              </div>
            </div>

            {/* Premium high-tech tactical close button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-850 text-zinc-400 hover:text-[#00c8ff] hover:border-[#00c8ff]/40 shadow-inner cursor-pointer transition-all flex items-center justify-center active:scale-95"
            >
              <X className="h-5 w-5" />
            </motion.button>
          </header>

          {/* MULTI COLUMN CONTENT DECK */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start relative pb-6">
            
            {/* SECTION 2 — QUICK NAVIGATION (Left 5 Columns) */}
            <nav className="lg:col-span-4 flex flex-col space-y-4">
              <span className="font-mono text-[9px] text-zinc-500 tracking-[0.25em] uppercase border-l-2 border-cyan-500 pl-3 block text-left mb-2">
                CRITICAL TARGET NAVIGATION
              </span>
              
              <div className="flex flex-col space-y-1 text-left">
                {navItems.map((item, idx) => {
                  const isHovered = activeHoverNav === item.label;
                  return (
                    <motion.div
                      key={idx}
                      className="relative py-2 group cursor-pointer"
                      onMouseEnter={() => setActiveHoverNav(item.label)}
                      onMouseLeave={() => setActiveHoverNav(null)}
                      onClick={() => {
                        item.action();
                        onClose();
                      }}
                    >
                      {/* Spring sliding background accent */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            layoutId="nav-glow-bar"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                            className="absolute inset-y-1 -left-4 -right-4 bg-zinc-950/40 border-l-4 border-[#00c8ff] rounded-r-xl z-0"
                          />
                        )}
                      </AnimatePresence>

                      {/* Content representation */}
                      <div className="relative z-10 flex justify-between items-center pl-1 pr-4">
                        <span 
                          className={`font-display text-xl sm:text-2xl font-bold tracking-tight transition-all duration-300 flex items-center gap-1.5 ${
                            isHovered 
                              ? "text-[#00c8ff] translate-x-1 drop-shadow-[0_0_12px_rgba(0,200,255,0.4)]" 
                              : "text-zinc-400 group-hover:text-zinc-200"
                          }`}
                        >
                          <span className="font-mono text-[9px] uppercase text-zinc-650 font-normal mr-2">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          {item.label}
                        </span>

                        {/* Sliding neon arrow */}
                        <span 
                          className={`opacity-0 group-hover:opacity-100 transition-all duration-350 transform ${
                            isHovered ? "translate-x-0 opacity-100" : "-translate-x-3"
                          }`}
                        >
                          <ArrowRight className="h-4.5 w-4.5 text-[#00c8ff]" />
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </nav>

            {/* SECTION 3 — AI SYSTEMS (Right 8 Columns) */}
            <div className="lg:col-span-8 space-y-6">
              <span className="font-mono text-[9px] text-zinc-500 tracking-[0.25em] uppercase border-l-2 border-[#0051ba] pl-3 block text-left mb-2">
                ACTIVE HEURISTICS COGNITIVE DECK
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {systems.map((sys, idx) => {
                  const trk = trackers[idx];
                  return (
                    <div
                      key={idx}
                      ref={trk.ref}
                      onMouseMove={trk.handleMouseMove}
                      className={`relative rounded-2xl border ${sys.borderColor} bg-zinc-950/20 backdrop-blur-lg p-5 flex flex-col justify-between transition-all duration-500 hover:shadow-2xl overflow-hidden group select-none h-64 text-left`}
                      style={{
                        boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.4)`,
                      }}
                    >
                      {/* Spotlight hover effect tracking cursor offset */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
                        style={{
                          background: `radial-gradient(110px circle at ${trk.coords.x}px ${trk.coords.y}px, ${sys.glowColor}, transparent 80%)`,
                        }}
                      />

                      {/* Header with capability status block */}
                      <div className="space-y-4 relative z-10">
                        <div className="flex justify-between items-center">
                          <div className="p-2.5 rounded-lg bg-black border border-zinc-900 group-hover:border-[#00c8ff]/30 transition-colors">
                            {sys.icon}
                          </div>
                          
                          {/* Pulsing state block */}
                          <div className="flex items-center gap-1.5 bg-emerald-950/20 border border-emerald-800/30 px-2 py-0.5 rounded-full font-mono text-[7px] text-emerald-400 font-bold uppercase">
                            <span className="h-1 w-1 bg-emerald-400 rounded-full animate-pulse" />
                            <span>{sys.title === "AI VISION" ? "ACTIVE" : "STANDBY"}</span>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-display font-black tracking-wider text-white uppercase">
                            {sys.title}
                          </h3>
                        </div>
                      </div>

                      {/* Capabilities detail list */}
                      <ul className="space-y-2 relative z-10 border-t border-zinc-900/60 pt-4 mt-2">
                        {sys.capabilities.map((cap, cIdx) => (
                          <li key={cIdx} className="flex gap-2 items-center text-[10px] text-zinc-400 group-hover:text-zinc-300 leading-none">
                            <span className="h-1 w-1 rounded-full bg-cyan-400/70" />
                            <span>{cap}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Dynamic corner tech design line */}
                      <div className="absolute bottom-2 right-2 opacity-15 font-mono text-[7px] text-zinc-650 group-hover:text-cyan-400 group-hover:opacity-100 transition-colors">
                        0{idx+1} // CORE_MATV
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* LOWER DIVISION: METRICS & SYSTEM HEALTH (Merged row) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4 border-t border-zinc-900/50">
            
            {/* SECTION 4 — LIVE SYSTEM METRICS (Animate counters) */}
            <div className="lg:col-span-8 bg-[#030304]/60 border border-zinc-950 rounded-2xl p-6 flex flex-col justify-between">
              <span className="font-mono text-[9px] text-zinc-500 tracking-[0.25em] uppercase text-left mb-4 block">
                QUANTITATIVE COGNITION FEED
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {[
                  { label: "Prediction Accuracy", value: 98.7, suffix: "%", decimals: 1 },
                  { label: "Charts Processed", value: 2.3, suffix: "M+", decimals: 1 },
                  { label: "Models Active", value: 12, suffix: "", decimals: 0 },
                  { label: "Average Latency", value: 0.4, suffix: "s", decimals: 1 },
                ].map((mt, mIdx) => (
                  <div key={mIdx} className="text-left space-y-1 bg-black/40 border border-zinc-900/30 rounded-xl p-4 shadow-inner relative overflow-hidden group hover:border-[#00c8ff]/10">
                    <span className="text-[10px] sm:text-[11px] text-zinc-500 block leading-tight font-sans">
                      {mt.label}
                    </span>
                    <div className="text-xl sm:text-2xl font-mono font-bold text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,200,255,0.1)] flex items-baseline">
                      <AnimateCounter target={mt.value} suffix={mt.suffix} decimals={mt.decimals} />
                    </div>
                    {/* Tiny visual chart layout line underneath */}
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-[#00c8ff]/20 to-transparent group-hover:via-[#00c8ff]/50 transition-colors" />
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 5 — SYSTEM HEALTH */}
            <div className="lg:col-span-4 bg-[#030304]/60 border border-zinc-950 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[9px] text-zinc-500 tracking-[0.25em] uppercase text-left mb-4 block">
                  SYSTEM FEEDS STATUS
                </span>
                
                <div className="space-y-2.5 font-mono text-[10px] text-zinc-400">
                  <div className="flex justify-between items-center">
                    <span>AI Vision</span>
                    <span className="text-zinc-600">.......................</span>
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold shrink-0">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]" />
                      <span>ONLINE</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Risk Engine</span>
                    <span className="text-zinc-600">.....................</span>
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold shrink-0">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]" />
                      <span>ONLINE</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Market Feed</span>
                    <span className="text-zinc-600">.....................</span>
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold shrink-0">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]" />
                      <span>ONLINE</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Neural Core</span>
                    <span className="text-zinc-600">.....................</span>
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold shrink-0">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]" />
                      <span>ONLINE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* SECTION 6 — CTA (FOOTER ACTIONS) */}
          <footer className="border-t border-zinc-900/60 pt-6 flex flex-col sm:flex-row justify-between items-center gap-6">
            <span className="font-mono text-[8px] text-zinc-650 tracking-[0.1em] text-center sm:text-left">
              FREECHART TRADING LABS INC // BIND LOCAL PORT 3000 // SECURITIES ARCHETYPE DESIGNER
            </span>

            {/* Large premium magnet button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setCurrentView("WORKSPACE");
                onClose();
              }}
              className="relative px-8 py-4 w-full sm:w-auto bg-gradient-to-r from-blue-700 via-[#0051ba] to-[#00c8ff] text-white rounded-xl shadow-[0_0_30px_rgba(0,102,238,0.25)] hover:shadow-[0_0_40px_rgba(0,200,255,0.45)] cursor-pointer overflow-hidden font-mono font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2.5 active:scale-95 group"
            >
              <Terminal className="h-4 w-4 text-cyan-300 group-hover:rotate-12 transition-transform" />
              <span>LAUNCH AI TERMINAL ✦</span>
              {/* Dynamic laser gloss shine effect line */}
              <div className="absolute top-0 bottom-0 w-[4px] bg-white/40 blur-[2px] rotate-[25deg] animate-infinite-slide z-20 pointer-events-none" />
            </motion.button>
          </footer>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
