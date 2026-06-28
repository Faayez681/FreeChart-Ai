import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

interface ParticleType {
  id: number;
  angle: number;
  radius: number;
  speed: number;
  size: number;
  color: string;
}

export default function AICore3D() {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [activeSignal, setActiveSignal] = useState<string>("SYSTEM_IDLE");
  const coreRef = useRef<HTMLDivElement>(null);

  // Tracks smooth mouse location to translate visual depth perspective subtly
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!coreRef.current) return;
      const rect = coreRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      // Calculate delta offsets downscaled for delicate, prestigious perspective shifts
      const deltaX = (e.clientX - centerX) / (window.innerWidth / 2);
      const deltaY = (e.clientY - centerY) / (window.innerHeight / 2);
      
      setRotation({
        x: deltaY * -12, // subtle interactive tilt up/down
        y: deltaX * 12,  // subtle interactive spin left/right
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Dynamic signal cycle simulation to simulate a live thinking brain matrix
    const signals = [
      "DECODING_CANDLESTICKS",
      "OPTIMIZING_ENTRY_BOUNDS",
      "COMPUTING_BACKTESTS",
      "RESOLVING_PROBABILITIES",
      "ALIGNING_RISK_SHIELDS"
    ];
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setActiveSignal(signals[count % signals.length]);
    }, 4000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  // Set up circular orbiting particles
  const particles = React.useMemo<ParticleType[]>(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      angle: (i / 15) * Math.PI * 2,
      radius: 110 + Math.random() * 50,
      speed: 0.01 + Math.random() * 0.015,
      size: Math.random() * 2.5 + 1.5,
      color: i % 2 === 0 ? "bg-[#00c8ff]" : "bg-blue-500",
    }));
  }, []);

  const [tickerAngles, setTickerAngles] = useState<number[]>(particles.map(p => p.angle));

  useEffect(() => {
    let animId: number;
    const updateAngles = () => {
      setTickerAngles(prev => 
        prev.map((angle, idx) => (angle + particles[idx].speed) % (Math.PI * 2))
      );
      animId = requestAnimationFrame(updateAngles);
    };
    animId = requestAnimationFrame(updateAngles);
    return () => cancelAnimationFrame(animId);
  }, [particles]);

  return (
    <div 
      ref={coreRef}
      className="relative w-80 h-80 sm:w-96 sm:h-96 mx-auto flex items-center justify-center select-none"
      style={{ perspective: "1000px" }}
    >
      {/* 1. STUNNING INTERACTIVE PERSPECTIVE CONTAINER */}
      <div
        className="relative w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        
        {/* Layer A - Outer volumetric background glow */}
        <div className="absolute w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,102,238,0.22)_0%,transparent_65%)] blur-[40px] animate-pulse-glow" />

        {/* Layer B - Concentric Science Energy Ring 1 (Clockwise) */}
        <motion.div
          className="absolute w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] rounded-full border-2 border-dashed border-[#00c8ff]/20 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
        />

        {/* Layer C - Concentric Science Energy Ring 2 (Counter-Clockwise, angled) */}
        <motion.div
          className="absolute w-[210px] h-[210px] sm:w-[250px] sm:h-[250px] rounded-full border border-double border-blue-500/30 flex items-center justify-center"
          style={{ transform: "rotateX(60deg) rotateY(20deg)" }}
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 14, ease: "linear" }}
        >
          {/* Dash marker */}
          <div className="absolute top-0 right-0 h-2 w-2 rounded-full bg-[#00c8ff]/60 shadow-[0_0_8px_#00c8ff]" />
        </motion.div>

        {/* Layer D - Concentric Mathematical Lattice Ring */}
        <motion.div
          className="absolute w-[250px] h-[250px] sm:w-[305px] sm:h-[305px] rounded-full border-t border-b border-purple-500/25 flex items-center justify-center"
          style={{ transform: "rotateX(-35deg) rotateY(-10deg)" }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
        />

        {/* Layer E - Holographic Crosshair ticks aligned to core */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <svg className="w-full h-full text-[#00c8ff]" viewBox="0 0 100 100">
            {/* Top mark */}
            <line x1="50" y1="5" x2="50" y2="12" stroke="currentColor" strokeWidth="0.8" />
            {/* Bottom mark */}
            <line x1="50" y1="88" x2="50" y2="95" stroke="currentColor" strokeWidth="0.8" />
            {/* Left mark */}
            <line x1="5" y1="50" x2="12" y2="50" stroke="currentColor" strokeWidth="0.8" />
            {/* Right mark */}
            <line x1="88" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.8" />
            
            {/* Fine radar scope markings */}
            <circle cx="50" cy="50" r="43" stroke="currentColor" strokeWidth="0.3" fill="none" strokeDasharray="1 5" />
          </svg>
        </div>

        {/* Layer F - Orbiting Mathematical Particle Grid */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((pt, idx) => {
            const angle = tickerAngles[idx] || pt.angle;
            const x = Math.cos(angle) * pt.radius;
            // Apply slight vertical wobble/tilt to particles
            const y = Math.sin(angle) * pt.radius * 0.45;
            // Fake 3D depth scale depending on sine layer
            const isBehind = Math.sin(angle) < 0;
            const size = pt.size * (isBehind ? 0.65 : 1.35);

            return (
              <div
                key={pt.id}
                className={`absolute rounded-full transition-all duration-300 ${pt.color}`}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  width: `${size}px`,
                  height: `${size}px`,
                  opacity: isBehind ? 0.25 : 0.85,
                  transform: "translate(-50%, -50%)",
                  boxShadow: !isBehind ? `0 0 6px rgba(0, 200, 255, 0.6)` : "none",
                  zIndex: isBehind ? 5 : 25,
                }}
              />
            );
          })}
        </div>

        {/* Layer G - The central glowing "INTELLIGENCE BRADY CORE" */}
        <div 
          className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center bg-black border-[3px] border-[#00c8ff] shadow-[0_0_35px_rgba(0,200,255,0.45)] z-20 group cursor-pointer"
          style={{ transform: "translateZ(30px)" }}
        >
          {/* Inner pulsating core rings */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-[#0051ba] via-indigo-950 to-cyan-900 border border-cyan-400/30 flex items-center justify-center overflow-hidden">
            
            {/* Sweep laser line effect */}
            <div className="absolute top-0 bottom-0 w-[4px] bg-cyan-400/60 blur-[3px] rotate-[20deg] animate-infinite-slide" />
            
            {/* Blinking central energy dot */}
            <div className="h-4 w-4 rounded-full bg-cyan-400 animate-pulse flex items-center justify-center shadow-[0_0_12px_#00c8ff]">
              <div className="h-1.5 w-1.5 rounded-full bg-white" />
            </div>

            {/* Simulated code streams flashing inside core */}
            <span className="absolute bottom-2 font-mono text-[7px] text-cyan-400/80 uppercase tracking-widest scale-90">
              SYS_ACTIVE
            </span>
          </div>

          {/* Orbiting concentric ring hovering just around center */}
          <motion.div
            className="absolute -inset-4 border border-cyan-400/25 rounded-full"
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Layer H - Floating Quantum State Display (Hover HUD) */}
        <div 
          className="absolute -bottom-8 bg-[#09090b]/95 border border-zinc-805 px-3.5 py-1.5 rounded-lg shadow-2xl z-40 text-center font-mono text-[8px] uppercase tracking-[0.2em] text-[#00c8ff] flex items-center gap-2"
          style={{ transform: "translateZ(50px)" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_4px_#10b981]" />
          <AnimatePresence mode="wait">
            <motion.span
              key={activeSignal}
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -5, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {activeSignal}
            </motion.span>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
