import React, { useMemo, useEffect, useState } from "react";
import { motion } from "motion/react";

interface GridNode {
  id: number;
  x: number;
  y: number;
  label: string;
  value: string;
  color: string;
  pulseDelay: number;
}

export default function IntelligenceGrid() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Stable random vectors for nodes and connection pulses
  const nodes = useMemo<GridNode[]>(() => {
    const labels = [
      "EST // ALGO_ALPHA", 
      "BTC_USD // INFERENCE",
      "AAPL // TARGET_Z",
      "US10Y // NEURAL_FLOW",
      "RSI_V5 // BOUND_MATRIX",
      "S/R // DEVIATION_2.4",
      "QUANT_NODE_X7",
      "MACD // VOL_VECT",
      "TSLA // BACKTEST_W"
    ];
    return Array.from({ length: 9 }).map((_, idx) => {
      const colors = ["text-blue-400", "text-cyan-400", "text-emerald-400", "text-[#00c8ff]"];
      return {
        id: idx,
        x: 10 + (idx * 11) + (idx % 2 === 0 ? 5 : -4), // beautiful spread
        y: 20 + ((idx * 8) % 65) + (idx % 3 === 0 ? 12 : -8),
        label: labels[idx % labels.length],
        value: `${Math.floor(Math.random() * 200 + 400)}MS`,
        color: colors[idx % colors.length],
        pulseDelay: idx * 0.45,
      };
    });
  }, []);

  // Stable vertical fallback binary columns
  const binaryColumns = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      left: `${(i * 9) + 4}%`,
      delay: i * 0.35,
      duration: Math.random() * 8 + 8,
      opacity: Math.random() * 0.08 + 0.02
    }));
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none" id="intelligence-grid-root">
      
      {/* Laser-sharp technical grid */}
      <div className="absolute inset-0 grid-overlay opacity-35" />

      {/* Radial lens-flare depth lighting overlays */}
      <div className="absolute inset-x-0 top-0 h-[500px] bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(0,102,238,0.08)_0%,transparent_80%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[400px] bg-[radial-gradient(ellipse_50%_40%_at_50%_100%,rgba(0,200,255,0.04)_0%,transparent_75%)]" />

      {/* Cybernetic code falling streams (The Matrix HUD) */}
      <div className="absolute inset-0 flex select-none pointer-events-none opacity-20">
        {binaryColumns.map((col, idx) => (
          <motion.div
            key={idx}
            className="absolute top-0 text-[8px] font-mono whitespace-nowrap leading-none flex flex-col text-[#00c8ff]/40"
            style={{ left: col.left, opacity: col.opacity }}
            animate={{ y: ["-100%", "200%"] }}
            transition={{
              duration: col.duration,
              repeat: Infinity,
              ease: "linear",
              delay: col.delay
            }}
          >
            {Array.from({ length: 15 }).map((_, s) => (
              <span key={s} className="my-1 text-[8px] tracking-wider block">
                {s % 3 === 0 ? "1" : "0"}
                {s % 4 === 0 ? "✦" : ""}
                {((idx * s) % 100).toString(16).toUpperCase()}
              </span>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Neural Pathway Laser Connection paths */}
      <svg className="absolute inset-0 h-full w-full opacity-30 select-none" style={{ mixBlendMode: "screen" }}>
        
        {/* Pathway Left-to-Right */}
        <motion.path
          d="M 120 250 L 320 280 L 520 180 L 720 320 L 980 200"
          fill="none"
          stroke="url(#neon-trail-gradient-1)"
          strokeWidth="1.2"
          strokeDasharray="20 40"
          animate={{ strokeDashoffset: [-120, 120] }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        />
        
        {/* Pathway Center-Top-to-Bottom */}
        <motion.path
          d="M 800 50 L 450 350 L 300 650 L 600 800"
          fill="none"
          stroke="url(#neon-trail-gradient-2)"
          strokeWidth="1.0"
          strokeDasharray="15 35"
          animate={{ strokeDashoffset: [100, -100] }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        />

        {/* Gradient declarations */}
        <defs>
          <linearGradient id="neon-trail-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0051ba" />
            <stop offset="50%" stopColor="#00c8ff" />
            <stop offset="100%" stopColor="#0051ba" />
          </linearGradient>
          <linearGradient id="neon-trail-gradient-2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00c8ff" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#00c8ff" />
          </linearGradient>
        </defs>
      </svg>

      {/* Interactive holographic nodes pulsing */}
      {nodes.map((node) => (
        <div
          key={node.id}
          className="absolute select-none group/node pointer-events-none"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
        >
          {/* Ambient glowing outer halo */}
          <motion.div
            className="absolute rounded-full -translate-x-1/2 -translate-y-1/2 bg-blue-500/20 blur-[6px]"
            animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, delay: node.pulseDelay }}
            style={{ width: "16px", height: "16px" }}
          />

          {/* Core bright neon grid junction block */}
          <div className="absolute h-2 w-2 rounded-full border border-[#00c8ff] bg-black -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <span className="h-1 w-1 rounded-full bg-[#00c8ff] animate-ping" />
          </div>

          {/* Micro HUD Metadata panel appearing elegantly near the node */}
          <div className="absolute left-3.5 -top-2.5 py-1 px-2 border border-zinc-900 bg-black/85 backdrop-blur-md rounded font-mono text-[7px] tracking-wider uppercase leading-none text-zinc-500 flex flex-col gap-0.5 whitespace-nowrap shadow-xl">
            <span className={`font-bold ${node.color} flex items-center gap-1`}>
              <span className="w-1 h-1 rounded-full bg-[#00c8ff] inline-block shadow-[0_0_4px_#00c8ff] animate-pulse" />
              {node.label}
            </span>
            <span className="text-[6.5px]">LATENCY: {node.value}</span>
          </div>

          {/* Interactive signal pulse moving outwards from node */}
          <motion.div
            className="absolute border border-cyan-400/30 rounded-full -translate-x-1/2 -translate-y-1/2"
            animate={{ width: [0, 80], height: [0, 80], opacity: [0.8, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: node.pulseDelay, ease: "easeOut" }}
          />
        </div>
      ))}

      {/* Horizontal & Vertical flowing grid ticks */}
      <div className="absolute top-[35%] left-[5%] p-2 bg-[#0051ba]/5 border border-[#0051ba]/10 rounded font-mono text-[7.5px] text-zinc-650 flex flex-col gap-0.5">
        <span>CORE_CLOCK: UTC_ONLINE</span>
        <span>LATENCY_SYNC: 14MS</span>
      </div>

    </div>
  );
}
