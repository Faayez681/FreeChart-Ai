import React, { useState, useEffect } from "react";
import { useAppStore } from "../store/useAppStore";
import { 
  Sparkle, Search, Menu, X, Terminal, BookOpen, Layers3, Sparkles, Copy, ChevronDown, Check, LogOut, User 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import CommandCenterMenu from "./CommandCenterMenu";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";

export default function HeaderAssembly() {
  const { currentView, setCurrentView, setActiveTab, setActiveDashboard, user, setUser, setIsAuthModalOpen } = useAppStore() as any;
  const [showLogOutMenu, setShowLogOutMenu] = useState(false);

  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [hoverMegaMenu, setHoverMegaMenu] = useState(false);

  const [activeHoveredTab, setActiveHoveredTab] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleCommandAction = (action: () => void) => {
    action();
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      <CommandCenterMenu
        isOpen={isHamburgerOpen}
        onClose={() => setIsHamburgerOpen(false)}
        setCurrentView={setCurrentView}
        scrollToSection={scrollToSection}
        setIsDocsOpen={setIsDocsOpen}
        setIsPricingOpen={setIsPricingOpen}
      />

      {/* Futuristic Floating Glass Header */}
      <div className="fixed top-4 left-0 right-0 z-50 w-full px-4 select-none pointer-events-none">
        <header className={`mx-auto max-w-7xl w-full transition-all duration-500 border pointer-events-auto rounded-3xl ${
          scrollY > 25
            ? "bg-zinc-950/95 border-zinc-800/80 shadow-[0_24px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl py-2 px-3 sm:px-5"
            : "bg-zinc-950/40 border-white/5 shadow-lg backdrop-blur-xl py-2.5 px-3.5 sm:px-6"
        }`}>
          <div className="flex items-center justify-between">
            {/* Mobile hamburger menu toggle */}
            <button 
              onClick={() => setIsHamburgerOpen(true)}
              className="p-2 rounded-xl bg-zinc-900/35 hover:bg-zinc-900/60 text-zinc-400 hover:text-white transition-all cursor-pointer flex lg:hidden items-center border border-zinc-900"
            >
              <Menu className="h-4 w-4" />
            </button>

            {/* Logo and branding */}
            <div 
              onClick={() => {
                setCurrentView("HOMEPAGE");
                setTimeout(() => scrollToSection("hero"), 80);
              }}
              className="flex items-center gap-2 select-none cursor-pointer group"
            >
              <div className="h-7 w-7 sm:h-7.5 sm:w-7.5 rounded-lg sm:rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center border border-white/10 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.6)] group-hover:rotate-6 transition-all duration-300 shrink-0">
                <Sparkle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white animate-pulse" />
              </div>
              <span className="hidden sm:inline-block font-display font-medium tracking-[0.25em] text-sm sm:text-base md:text-lg text-white uppercase group-hover:tracking-[0.28em] transition-all">
                freechart<span className="text-blue-500 font-extrabold ml-0.5">ai</span>
              </span>
            </div>

            {/* Desktop Navigation Links with Animated Shared-Layout Pill Tracers */}
            <div className="hidden lg:flex items-center gap-1.5 bg-zinc-950/50 border border-white/5 p-1 rounded-full px-2 backdrop-blur-xl relative">
              {[
                { id: "features", label: "Features", action: () => { setCurrentView("HOMEPAGE"); setTimeout(() => scrollToSection("features"), 80); } },
                { id: "how-it-works", label: "How It Works", action: () => { setCurrentView("HOMEPAGE"); setTimeout(() => scrollToSection("how-it-works"), 80); } },
                { id: "examples", label: "Examples", action: () => { setCurrentView("HOMEPAGE"); setTimeout(() => scrollToSection("examples"), 80); } },
                { id: "pricing", label: "Pricing", action: () => { setCurrentView("HOMEPAGE"); setTimeout(() => scrollToSection("pricing"), 80); } },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={tab.action}
                  onMouseEnter={() => setActiveHoveredTab(tab.id)}
                  onMouseLeave={() => setActiveHoveredTab(null)}
                  className="px-3.5 py-1.5 text-[10px] uppercase font-mono tracking-widest relative cursor-pointer text-zinc-400 hover:text-white transition-all rounded-full"
                >
                  {activeHoveredTab === tab.id && (
                    <motion.div
                      layoutId="nav-hover-pill"
                      className="absolute inset-0 bg-white/5 ring-1 ring-white/10 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}

              {user && (
                <div className="flex items-center gap-1 border-l border-white/10 pl-2.5 ml-1">
                  {user.role === "Owner / Administrator" && (
                    <button
                      onClick={() => setCurrentView("ADMIN")}
                      className={`px-3 py-1 text-[9px] uppercase font-mono tracking-wider relative cursor-pointer transition-all duration-200 rounded-full font-bold ${
                        currentView === "ADMIN"
                          ? "bg-red-500/15 text-red-400 border border-red-500/30"
                          : "text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      }`}
                    >
                      Admin
                    </button>
                  )}
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[9px] font-mono tracking-wider">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] text-zinc-400 lowercase truncate max-w-[100px]">{user.email}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Hub Buttons with Glass Ring Search Trigger */}
            <div className="flex items-center gap-2 sm:gap-3 font-mono text-[9px] uppercase tracking-widest font-bold pointer-events-auto">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden sm:flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 px-3.5 py-1.8 rounded-full text-[10px] font-mono tracking-normal text-zinc-400 hover:text-white transition cursor-pointer select-none"
                title="Search Command Palette (Ctrl+K)"
              >
                <Search className="h-3.5 w-3.5 text-zinc-500" />
                <span className="text-[8px] uppercase tracking-wider text-zinc-500">Ctrl+K</span>
              </button>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowLogOutMenu(!showLogOutMenu)}
                    onBlur={() => setTimeout(() => setShowLogOutMenu(false), 200)}
                    className="flex items-center gap-1.5 bg-zinc-950/70 hover:bg-zinc-900/80 border border-white/10 ring-1 ring-white/5 px-2.5 py-1.5 sm:px-3 sm:py-1.8 rounded-full text-[8px] sm:text-[9px] uppercase font-mono tracking-wider text-zinc-300 hover:text-white transition cursor-pointer select-none animate-fade-in"
                    title="Signed In Account"
                  >
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="h-4.5 w-4.5 sm:h-5 sm:w-5 rounded-full border border-blue-500/40 ring-2 ring-white/20"
                    />
                    <span className="max-w-[45px] sm:max-w-[70px] truncate">{user.name}</span>
                    <ChevronDown className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-zinc-500" />
                  </button>

                  <AnimatePresence>
                    {showLogOutMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute right-0 mt-2 w-48 bg-[#09090c]/90 border border-white/10 rounded-xl py-1.5 shadow-[0_15px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl z-50 text-left font-sans"
                      >
                        <div className="px-3 py-2 border-b border-white/5 text-[10px] text-zinc-500 font-mono truncate">
                          {user.email}
                        </div>
                        <button
                          onClick={async () => {
                            try {
                              await signOut(auth);
                              localStorage.setItem("freechartai_logged_out", "true");
                              setUser(null);
                              setShowLogOutMenu(false);
                              window.location.reload();
                            } catch (err) {
                              console.error("[Sign Out Error]", err);
                            }
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition text-left font-mono"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-2.5 py-1.5 sm:px-4 sm:py-2 text-[8px] sm:text-[9px] text-zinc-400 hover:text-white border border-transparent hover:border-white/5 hover:bg-white/5 rounded-full transition cursor-pointer select-none"
                >
                  Sign In
                </button>
              )}

              <button
                onClick={() => {
                  setCurrentView("WORKSPACE");
                }}
                className="px-3 py-1.5 sm:px-4.5 sm:py-2.2 text-[8px] sm:text-[9px] bg-white text-black hover:bg-zinc-200 rounded-full cursor-pointer transition select-none border border-white/20 hover:scale-[1.03] active:scale-[0.98] duration-200"
              >
                Console
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* SEARCH COMMAND PALETTE MODAL */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex flex-col items-center justify-start p-6 pt-16 md:pt-24 select-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,102,238,0.12)_0%,transparent_65%)] pointer-events-none" />
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white hover:bg-zinc-805 cursor-pointer flex items-center justify-center"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <div className="w-full max-w-2xl bg-[#09090b] border border-zinc-900 rounded-3xl shadow-3xl overflow-hidden flex flex-col p-2 max-h-[70vh]">
              <div className="flex items-center gap-3 border-b border-zinc-900 p-4 leading-relaxed">
                <Search className="h-5 w-5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Filter algorithms, documentation sections, or chart panels..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-white w-full border-none outline-none font-mono text-xs focus:ring-0 placeholder-zinc-600"
                  autoFocus
                />
              </div>

              <div className="overflow-y-auto p-2.5 space-y-2 text-left">
                {[
                  { label: "New Dashboard", desc: "Synthesize a professional custom SaaS Metrics dashboard via AI", act: () => handleCommandAction(async () => {
                    // Pre-generate a beautiful SaaS template dashboard as starter
                    try {
                      const res = await fetch("/api/dashboard/generate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ prompt: "Create a SaaS metrics dashboard" })
                      });
                      const parsed = await res.json();
                      setActiveDashboard(parsed);
                    } catch {
                      setActiveDashboard(null);
                    }
                    setCurrentView("WORKSPACE");
                    setActiveTab("DASHBOARD");
                  }) },
                  { label: "New Chart Sandbox", desc: "Process loaded screenshot triggers & start empty canvas", act: () => handleCommandAction(() => { setCurrentView("WORKSPACE"); setActiveTab("CHART"); }) },
                  { label: "Select Business Templates", desc: "Browse high-density templates (Finance, Marketing, Sales)", act: () => handleCommandAction(() => { setCurrentView("HOMEPAGE"); setTimeout(() => scrollToSection("examples"), 120); }) },
                  { label: "Scenario Multi-model Simulator", desc: "Run aggressive or defensive risk paths", act: () => handleCommandAction(() => { setCurrentView("WORKSPACE"); setActiveTab("SIMULATOR"); }) },
                  { label: "Export Reports (PDF/Excel)", desc: "Render and download analytical briefs and sheets", act: () => handleCommandAction(() => { setCurrentView("WORKSPACE"); setActiveTab("REPORT"); }) },
                  { label: "Platform Engineering Settings", desc: "Inspect Gantt specifications, API variables, and database metrics", act: () => handleCommandAction(() => { setCurrentView("SPEC_WORKSTATION"); }) }
                ].filter(cmd => cmd.label.toLowerCase().includes(searchQuery.toLowerCase())).map((cmd) => (
                  <div key={cmd.label} onClick={cmd.act} className="p-3 hover:bg-zinc-950 border border-transparent hover:border-zinc-900 rounded-2xl cursor-pointer transition select-none flex items-center justify-between">
                    <div>
                      <strong className="block text-white text-xs">{cmd.label}</strong>
                      <span className="text-[10px] text-zinc-450 font-mono font-light leading-snug">{cmd.desc}</span>
                    </div>
                    <ChevronDown className="-rotate-90 h-4 w-4 text-zinc-600" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* DOCUMENTATION PANEL */}
      <AnimatePresence>
        {isDocsOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 select-none">
            <button 
              onClick={() => setIsDocsOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <div className="w-full max-w-4xl bg-[#09090b]/98 border border-zinc-900 rounded-2xl flex flex-col md:grid md:grid-cols-4 max-h-[80vh] overflow-hidden">
              <div className="md:col-span-1 bg-zinc-950 p-4 border-r border-zinc-900 text-[9px] uppercase tracking-wider font-mono">
                <span className="text-[#00c8ff] font-extrabold block">FREECHART SDK v5.0</span>
                <span className="text-zinc-650 block">TLS HANDSHAKE STABLE</span>
                <div className="mt-4 space-y-1">
                  {["Auth Nodes", "Crop Pipeline", "Optics", "Socket Stream"].map((v, i) => (
                    <button key={v} className={`w-full text-left p-2 rounded ${i === 2 ? "text-[#00c8ff] bg-zinc-900" : "text-zinc-500"}`}>{v}</button>
                  ))}
                </div>
              </div>
              <div className="md:col-span-3 p-6 space-y-4 overflow-y-auto text-left">
                <span className="font-mono text-[#00c8ff] text-[8px] tracking-widest block uppercase">SDK Documentation</span>
                <h3 className="text-xl font-display font-medium text-white">Multimodal Candlestick Optics Integration</h3>
                <p className="text-zinc-400 text-xs leading-relaxed font-sans font-light">Deploy advanced analytical pipelines directly inside your custom dashboard. Query bounding box vectors and S/R trends instantaneously.</p>
                <div className="bg-black/80 rounded-xl p-4.5 border border-zinc-900 text-left font-mono text-[10px] text-zinc-300">
                  <pre>{`curl -X POST https://api.freechart.ai/v5/segment-graphics \\
  -H "Authorization: Bearer $FREECHART_KEY" \\
  -F "file=@chart_screenshot.png"`}</pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
export { HeaderAssembly };
