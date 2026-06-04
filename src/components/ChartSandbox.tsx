/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { SlidersHorizontal, Info, Play, TrendingUp, Sparkles } from "lucide-react";

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

// Candlestick pattern presets
const BULLISH_FLAG_CANDLES: CandleData[] = [
  { time: "09:30", open: 190, high: 194, low: 189, close: 193 },
  { time: "10:30", open: 193, high: 198, low: 192, close: 197 },
  { time: "11:30", open: 197, high: 205, low: 196, close: 204 }, // Pole
  { time: "12:30", open: 204, high: 204, low: 199, close: 201 }, // Flag start
  { time: "13:30", open: 201, high: 203, low: 198, close: 200 },
  { time: "14:30", open: 200, high: 201, low: 197, close: 198 },
  { time: "15:30", open: 198, high: 203, low: 198, close: 202 }, // Breakout start
  { time: "16:00", open: 202, high: 208, low: 202, close: 207 }  // Breakout confirmed
];

const DOUBLE_BOTTOM_CANDLES: CandleData[] = [
  { time: "Day 1", open: 120, high: 122, low: 110, close: 112 },
  { time: "Day 2", open: 112, high: 115, low: 98, close: 100 },  // Bottom 1
  { time: "Day 3", open: 100, high: 108, low: 100, close: 106 },
  { time: "Day 4", open: 106, high: 112, low: 104, close: 110 }, // Neck
  { time: "Day 5", open: 110, high: 110, low: 97, close: 99 },   // Bottom 2
  { time: "Day 6", open: 99, high: 105, low: 99, close: 104 },
  { time: "Day 7", open: 104, high: 114, low: 103, close: 112 },
  { time: "Day 8", open: 112, high: 121, low: 111, close: 119 }  // Reversal Break
];

const BEARISH_DOUBLE_TOP_CANDLES: CandleData[] = [
  { time: "Day 1", open: 220, high: 235, low: 218, close: 232 },
  { time: "Day 2", open: 232, high: 247, low: 230, close: 245 }, // Top 1
  { time: "Day 3", open: 245, high: 245, low: 234, close: 238 },
  { time: "Day 4", open: 238, high: 242, low: 236, close: 240 }, // Neck
  { time: "Day 5", open: 240, high: 248, low: 238, close: 246 }, // Top 2
  { time: "Day 6", open: 246, high: 246, low: 232, close: 234 },
  { time: "Day 7", open: 234, high: 236, low: 221, close: 223 }, // Breakdown
  { time: "Day 8", open: 223, high: 225, low: 211, close: 213 }
];

interface ChartSandboxProps {
  onAnalyzeDrawnSetup: (presetName: string, trend: "Bullish" | "Bearish") => void;
  isProcessing: boolean;
}

export default function ChartSandbox({ onAnalyzeDrawnSetup, isProcessing }: ChartSandboxProps) {
  const [selectedPattern, setSelectedPattern] = useState<"BULL_FLAG" | "DOUBLE_BOTTOM" | "DOUBLE_TOP">("BULL_FLAG");
  const [supportLineY, setSupportLineY] = useState<number>(140); // Initial horizontal positions in SVG coords
  const [resistanceLineY, setResistanceLineY] = useState<number>(55);
  const [activeLine, setActiveLine] = useState<"NONE" | "SUPPORT" | "RESISTANCE">("NONE");

  // Determine current active candles
  const candles = 
    selectedPattern === "BULL_FLAG" ? BULLISH_FLAG_CANDLES :
    selectedPattern === "DOUBLE_BOTTOM" ? DOUBLE_BOTTOM_CANDLES :
    BEARISH_DOUBLE_TOP_CANDLES;

  const minVal = Math.min(...candles.map(c => c.low)) - 5;
  const maxVal = Math.max(...candles.map(c => c.high)) + 5;
  const valRange = maxVal - minVal || 1;

  // SVG parameters
  const height = 180;
  const width = 420;
  const paddingX = 40;
  const paddingY = 20;
  const drawableHeight = height - paddingY * 2;
  const drawableWidth = width - paddingX * 2;

  // Coordinate math
  const getX = (idx: number) => paddingX + (idx / (candles.length - 1)) * drawableWidth;
  const getY = (price: number) => paddingY + drawableHeight - ((price - minVal) / valRange) * drawableHeight;

  // Convert graphical Y coordinate back to approximate price
  const getApproxPriceFromY = (yCoord: number) => {
    const fraction = (yCoord - paddingY) / drawableHeight;
    const price = minVal + (1 - fraction) * valRange;
    return Math.round(price * 10) / 10;
  };

  const supportPrice = getApproxPriceFromY(supportLineY);
  const resistancePrice = getApproxPriceFromY(resistanceLineY);

  // Handle Drag / Click overlay placement on SVG
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;

    if (activeLine === "SUPPORT") {
      setSupportLineY(Math.max(paddingY, Math.min(height - paddingY, relativeY)));
      setActiveLine("NONE");
    } else if (activeLine === "RESISTANCE") {
      setResistanceLineY(Math.max(paddingY, Math.min(height - paddingY, relativeY)));
      setActiveLine("NONE");
    }
  };

  const handleTriggerAnalysis = () => {
    const trend = selectedPattern === "DOUBLE_TOP" ? "Bearish" : "Bullish";
    const patternTitle = 
      selectedPattern === "BULL_FLAG" ? "Drawn Bullish Flag Consolidation" : 
      selectedPattern === "DOUBLE_BOTTOM" ? "Drawn Accumulation Double Bottom" : 
      "Drawn Distribution Double Top";
    onAnalyzeDrawnSetup(patternTitle, trend);
  };

  return (
    <div id="sandbox-wrapper" className="p-5 bg-slate-900/40 border border-slate-800/80 rounded-xl space-y-4">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4.5 w-4.5 text-indigo-400" />
          <h3 className="text-sm font-bold font-sans text-slate-200">
            Interactive Drawing Workbench
          </h3>
        </div>

        {/* Pattern preset buttons */}
        <div className="flex gap-1.5 font-mono text-[10px]">
          <button 
            onClick={() => { setSelectedPattern("BULL_FLAG"); setSupportLineY(130); setResistanceLineY(55); }}
            className={`px-2.5 py-1 rounded border transition-all cursor-pointer ${selectedPattern === "BULL_FLAG" ? "bg-emerald-950 border-emerald-500/30 text-emerald-400 font-bold" : "bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300"}`}
          >
            Bull Flag
          </button>
          <button 
            onClick={() => { setSelectedPattern("DOUBLE_BOTTOM"); setSupportLineY(145); setResistanceLineY(45); }}
            className={`px-2.5 py-1 rounded border transition-all cursor-pointer ${selectedPattern === "DOUBLE_BOTTOM" ? "bg-emerald-950 border-emerald-500/30 text-emerald-400 font-bold" : "bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300"}`}
          >
            Double Bottom
          </button>
          <button 
            onClick={() => { setSelectedPattern("DOUBLE_TOP"); setSupportLineY(140); setResistanceLineY(35); }}
            className={`px-2.5 py-1 rounded border transition-all cursor-pointer ${selectedPattern === "DOUBLE_TOP" ? "bg-rose-950 border-rose-500/30 text-rose-400 font-bold" : "bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300"}`}
          >
            Double Top
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-400 leading-normal">
        Select a structural formation template, draw overlays directly by triggering the level placer button, and click <strong>Extract Analytics</strong> to test the setup.
      </p>

      {/* SVG Candlestick Sandbox canvas */}
      <div className="relative bg-slate-950 border border-slate-850 rounded-xl p-2.5 overflow-hidden flex flex-col justify-center items-center">
        
        {/* Placer HUD overlay indicator */}
        {activeLine !== "NONE" && (
          <div className="absolute top-2 left-2 z-10 bg-indigo-900 text-indigo-100 font-mono text-[9px] px-2 py-1 rounded border border-indigo-700 pointer-events-none animate-pulse">
            Placing: {activeLine} Level. Hover & Click anywhere on chart to lock line!
          </div>
        )}

        <svg 
          width="100%" 
          height={height} 
          viewBox={`0 0 ${width} ${height}`}
          onClick={handleSvgClick}
          className={`cursor-crosshair overflow-visible ${activeLine !== "NONE" ? "bg-indigo-950/10" : ""}`}
        >
          {/* Horizontal Grid backgrounds */}
          {[0.25, 0.5, 0.75].map((ratio, idx) => (
            <line 
              key={idx}
              x1={paddingX}
              y1={paddingY + drawableHeight * ratio}
              x2={width - paddingX}
              y2={paddingY + drawableHeight * ratio}
              stroke="#131e31"
              strokeDasharray="3 3"
            />
          ))}

          {/* Render individual Candlestick elements (wicks + bodies) */}
          {candles.map((candle, idx) => {
            const x = getX(idx);
            const yOpen = getY(candle.open);
            const yClose = getY(candle.close);
            const yHigh = getY(candle.high);
            const yLow = getY(candle.low);

            const isGreen = candle.close >= candle.open;
            const strokeColor = isGreen ? "#34d399" : "#f87171";
            const fillColor = isGreen ? "#052e16" : "#4c0519";
            const bodyWidth = 14;

            return (
              <g key={idx} className="hover:opacity-80 transition-opacity">
                {/* Wick lines */}
                <line 
                  x1={x} 
                  y1={yHigh} 
                  x2={x} 
                  y2={yLow} 
                  stroke={strokeColor} 
                  strokeWidth="1.5" 
                />
                {/* Body rect */}
                <rect
                  x={x - bodyWidth / 2}
                  y={Math.min(yOpen, yClose)}
                  width={bodyWidth}
                  height={Math.max(2, Math.abs(yOpen - yClose))}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth="1.5"
                  rx="1"
                />
              </g>
            );
          })}

          {/* Drawn Support Line overlay */}
          <line 
            x1={paddingX} 
            y1={supportLineY} 
            x2={width - paddingX} 
            y2={supportLineY} 
            stroke="#10b981" 
            strokeWidth="2" 
            strokeDasharray={activeLine === "SUPPORT" ? "5 5" : "0"}
            className="transition-all duration-150"
          />
          <text 
            x={paddingX + 4} 
            y={supportLineY - 5} 
            className="fill-emerald-400 font-mono text-[9px] font-bold"
          >
            SUPPORT OVERLAY: ${supportPrice}
          </text>

          {/* Drawn Resistance Line overlay */}
          <line 
            x1={paddingX} 
            y1={resistanceLineY} 
            x2={width - paddingX} 
            y2={resistanceLineY} 
            stroke="#f43f5e" 
            strokeWidth="2" 
            strokeDasharray={activeLine === "RESISTANCE" ? "5 5" : "0"}
            className="transition-all duration-150"
          />
          <text 
            x={paddingX + 4} 
            y={resistanceLineY - 5} 
            className="fill-rose-400 font-mono text-[9px] font-bold"
          >
            RESISTANCE OVERLAY: ${resistancePrice}
          </text>
        </svg>
      </div>

      {/* Control toolbelt buttons to place overlays */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-1.5 font-mono text-[10px]">
          <button 
            onClick={() => setActiveLine("SUPPORT")}
            className="px-2.5 py-1.5 rounded bg-slate-900 hover:bg-slate-850 text-emerald-400 border border-emerald-950 hover:border-emerald-700/60 transition-all cursor-pointer"
          >
            📍 Place Support Overlay
          </button>
          <button 
            onClick={() => setActiveLine("RESISTANCE")}
            className="px-2.5 py-1.5 rounded bg-slate-900 hover:bg-slate-850 text-rose-400 border border-rose-950 hover:border-rose-700/60 transition-all cursor-pointer"
          >
            📍 Place Resistance Overlay
          </button>
        </div>

        <button 
          onClick={handleTriggerAnalysis}
          disabled={isProcessing}
          className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-lg shadow-indigo-900/40 disabled:opacity-50 transition-all cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {isProcessing ? "Crunching Channels..." : "Extract Analytics"}
        </button>
      </div>

      <div className="flex items-start gap-2 text-[10px] text-slate-500 leading-normal font-sans">
        <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-slate-600" />
        <span>
          <strong>Placer Guide:</strong> Click "Place Placer Level" then click anywhere on the candlestick space to overwrite support/resistance parameters. The AI analyzer integrates placed values to adjust trade layouts.
        </span>
      </div>
    </div>
  );
}
