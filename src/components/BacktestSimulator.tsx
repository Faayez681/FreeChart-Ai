/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { AnalysisReport } from "../types";
import { Play, SlidersHorizontal, Info, RefreshCw, BarChart2 } from "lucide-react";

interface BacktestSimulatorProps {
  report: AnalysisReport;
}

interface SimulatedTrade {
  index: number;
  outcome: "WIN" | "LOSS";
  gainLossR: number; // in R units
  gainLossCash: number; // in actual currency
  equity: number;
}

export default function BacktestSimulator({ report }: BacktestSimulatorProps) {
  const [startingCapital, setStartingCapital] = useState<number>(10000);
  const [riskPerTradePct, setRiskPerTradePct] = useState<number>(2); // default 2% risk
  const [simulatedTrades, setSimulatedTrades] = useState<SimulatedTrade[]>([]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Extract base stats from report
  const parsedRR = parseFloat(report.riskRewardRatio.split(":")[1]) || 2.5;
  const rawWinRate = report.probabilities.bullish > report.probabilities.bearish 
    ? report.probabilities.bullish 
    : report.probabilities.bearish > report.probabilities.bullish
      ? report.probabilities.bearish
      : 50;

  // Run Monte Carlo simulation based on setup parameters
  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const trades: SimulatedTrade[] = [];
      let currentEquity = startingCapital;
      const riskAmount = currentEquity * (riskPerTradePct / 100);

      // Add Trade 0 as starting capital
      trades.push({
        index: 0,
        outcome: "WIN",
        gainLossR: 0,
        gainLossCash: 0,
        equity: startingCapital
      });

      for (let i = 1; i <= 20; i++) {
        // Roll dice
        const roll = Math.random() * 100;
        const isWin = roll < rawWinRate;
        const outcome = isWin ? "WIN" : "LOSS";
        
        let gainLossR = 0;
        let gainLossCash = 0;

        if (isWin) {
          gainLossR = parsedRR;
          gainLossCash = riskAmount * parsedRR;
        } else {
          gainLossR = -1;
          gainLossCash = -riskAmount;
        }

        currentEquity = currentEquity + gainLossCash;
        // Make sure equity doesn't crash below zero
        if (currentEquity < 0) currentEquity = 0;

        trades.push({
          index: i,
          outcome,
          gainLossR,
          gainLossCash,
          equity: Math.round(currentEquity * 100) / 100
        });
      }

      setSimulatedTrades(trades);
      setIsSimulating(false);
    }, 500);
  };

  // Run automatically when report or risk parameters change
  useEffect(() => {
    runSimulation();
  }, [report, startingCapital, riskPerTradePct]);

  // Compute summary metrics
  const finalEquity = simulatedTrades[simulatedTrades.length - 1]?.equity || startingCapital;
  const netProfitPct = Math.round(((finalEquity - startingCapital) / startingCapital) * 1000) / 10;
  const totalWins = simulatedTrades.slice(1).filter(t => t.outcome === "WIN").length;
  const totalLosses = simulatedTrades.slice(1).filter(t => t.outcome === "LOSS").length;
  const achievedWinRate = Math.round((totalWins / 20) * 100);

  // Profit Factor calculation
  const grossWin = simulatedTrades.slice(1).reduce((sum, t) => t.outcome === "WIN" ? sum + t.gainLossCash : sum, 0);
  const grossLoss = simulatedTrades.slice(1).reduce((sum, t) => t.outcome === "LOSS" ? sum + Math.abs(t.gainLossCash) : sum, 0);
  const profitFactor = grossLoss === 0 
    ? grossWin > 0 ? "9.9+" : "0.00" 
    : (grossWin / grossLoss).toFixed(2);

  // Drawdown tracker
  let peakEquity = startingCapital;
  let maxDrawdownPct = 0;
  simulatedTrades.forEach(t => {
    if (t.equity > peakEquity) {
      peakEquity = t.equity;
    }
    const dd = ((peakEquity - t.equity) / peakEquity) * 100;
    if (dd > maxDrawdownPct) {
      maxDrawdownPct = dd;
    }
  });

  // SVG Drawing Helpers for Equity Line
  const padding = 35;
  const svgWidth = 460;
  const svgHeight = 180;
  const chartWidth = svgWidth - padding * 2;
  const chartHeight = svgHeight - padding * 2;

  const minEquityValue = Math.min(...simulatedTrades.map(t => t.equity), startingCapital * 0.8);
  const maxEquityValue = Math.max(...simulatedTrades.map(t => t.equity), startingCapital * 1.2);
  const equityRange = maxEquityValue - minEquityValue || 1;

  // Transform data points to SVG coordinate space
  const pointsString = simulatedTrades.map((t, idx) => {
    const x = padding + (idx / 20) * chartWidth;
    const y = padding + chartHeight - ((t.equity - minEquityValue) / equityRange) * chartHeight;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div id="backtest-simulator-box" className="p-5 bg-slate-900/40 border border-slate-800/80 rounded-xl space-y-5">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-4.5 w-4.5 text-indigo-400" />
          <h3 className="text-sm font-bold font-sans text-slate-200">
            Premium Historical Sandbox Backtester
          </h3>
        </div>
        <button 
          onClick={runSimulation}
          disabled={isSimulating}
          className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono text-emerald-400 hover:text-emerald-300 bg-slate-800 hover:bg-slate-700/80 rounded border border-slate-700 disabled:opacity-40 transition-all cursor-pointer"
        >
          <RefreshCw className={`h-3 w-3 ${isSimulating ? "animate-spin" : ""}`} />
          Run Monte Carlo
        </button>
      </div>

      <p className="text-xs text-slate-400 leading-normal">
        Test this {report.trend} setup parameters over 20 randomized trades utilizing probability thresholds of {rawWinRate}% win likelihood and a {report.riskRewardRatio} Risk/Reward Ratio.
      </p>

      {/* Simulator Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/40 p-3.5 rounded-lg border border-slate-800/60 font-mono text-xs">
        {/* Input: Starting Capital */}
        <div className="space-y-1.5 col-span-1">
          <label className="text-slate-400 text-[10px] uppercase tracking-wide">Starting Capital</label>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5">
            <span className="text-slate-500 font-bold">$</span>
            <input 
              type="number"
              value={startingCapital}
              onChange={(e) => setStartingCapital(Math.max(100, parseInt(e.target.value) || 0))}
              className="bg-transparent text-slate-100 focus:outline-none w-full font-bold"
            />
          </div>
        </div>

        {/* Input: Risk slider */}
        <div className="space-y-1.5 col-span-1">
          <div className="flex justify-between items-center text-[10px] uppercase tracking-wide">
            <span className="text-slate-400">Risk per Trade %</span>
            <span className="text-emerald-400 font-bold">{riskPerTradePct}%</span>
          </div>
          <div className="pt-2">
            <input 
              type="range"
              min="1"
              max="15"
              step="1"
              value={riskPerTradePct}
              onChange={(e) => setRiskPerTradePct(parseInt(e.target.value) || 1)}
              className="w-full accent-emerald-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Analytics Summary scoreboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/40 text-center font-mono">
          <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Total Return</span>
          <p className={`text-sm font-black mt-1 ${netProfitPct >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {netProfitPct >= 0 ? "+" : ""}{netProfitPct}%
          </p>
          <span className="text-[8px] text-slate-400 font-medium">({netProfitPct >= 0 ? "📈" : "📉"} profit)</span>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/40 text-center font-mono">
          <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Achieved Win Rate</span>
          <p className="text-sm font-black mt-1 text-indigo-300">
            {achievedWinRate}%
          </p>
          <span className="text-[8px] text-slate-400 font-medium font-mono">{totalWins}W / {totalLosses}L</span>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/40 text-center font-mono">
          <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Profit Factor</span>
          <p className="text-sm font-black mt-1 text-amber-400">
            {profitFactor}
          </p>
          <span className="text-[8px] text-slate-400 font-medium">(&gt; 1 is premium)</span>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/40 text-center font-mono">
          <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Max Drawdown</span>
          <p className="text-sm font-black mt-1 text-rose-400">
            {maxDrawdownPct.toFixed(1)}%
          </p>
          <span className="text-[8px] text-slate-400 font-medium">(equity correction)</span>
        </div>
      </div>

      {/* SVG Equity Line Chart Workspace */}
      <div className="bg-slate-950 border border-slate-800/60 rounded-xl p-3 flex flex-col justify-center items-center">
        {simulatedTrades.length === 0 ? (
          <div className="h-40 flex items-center justify-center text-xs text-slate-500 font-mono">
            Generating simulation curves...
          </div>
        ) : (
          <div className="w-full">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 px-1 mb-1.5">
              <span>Equity Minimum: ${Math.round(minEquityValue)}</span>
              <span>Ending Equity: ${Math.round(finalEquity)}</span>
            </div>
            
            <svg 
              className="w-full overflow-visible max-h-44" 
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Grid Lines */}
              <line 
                x1={padding} 
                y1={padding} 
                x2={svgWidth - padding} 
                y2={padding} 
                stroke="#1e293b" 
                strokeDasharray="4 4" 
              />
              <line 
                x1={padding} 
                y1={padding + chartHeight / 2} 
                x2={svgWidth - padding} 
                y2={padding + chartHeight / 2} 
                stroke="#1e293b" 
                strokeDasharray="4 4" 
              />
              <line 
                x1={padding} 
                y1={padding + chartHeight} 
                x2={svgWidth - padding} 
                y2={padding + chartHeight} 
                stroke="#1e293b" 
                strokeWidth="1.5" 
              />

              {/* Vertical grids */}
              <line x1={padding} y1={padding} x2={padding} y2={padding + chartHeight} stroke="#1e293b" />
              <line x1={padding + chartWidth / 2} y1={padding} x2={padding + chartWidth / 2} y2={padding + chartHeight} stroke="#1e293b" strokeDasharray="4 4" />
              <line x1={svgWidth - padding} y1={padding} x2={svgWidth - padding} y2={padding + chartHeight} stroke="#1e293b" />

              {/* SVG Area Under Path (shaded polygon for smooth depth) */}
              {simulatedTrades.length > 0 && (
                <polygon
                  points={`${padding},${padding + chartHeight} ${pointsString} ${svgWidth - padding},${padding + chartHeight}`}
                  fill="url(#grad)"
                  opacity="0.1"
                />
              )}

              {/* SVG Path Curve */}
              {simulatedTrades.length > 0 && (
                <polyline
                  fill="none"
                  stroke={netProfitPct >= 0 ? "#10b981" : "#f43f5e"}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={pointsString}
                />
              )}

              {/* Key Marker Points */}
              {simulatedTrades.map((t, idx) => {
                if (idx === 0 || idx === 20 || t.outcome === "WIN") {
                  const cx = padding + (idx / 20) * chartWidth;
                  const cy = padding + chartHeight - ((t.equity - minEquityValue) / equityRange) * chartHeight;
                  return (
                    <circle 
                      key={idx}
                      cx={cx}
                      cy={cy}
                      r={idx === 20 ? 4 : 2}
                      className={idx === 20 ? "fill-white" : t.outcome === "WIN" ? "fill-emerald-400" : "fill-rose-400"}
                    />
                  );
                }
                return null;
              })}

              {/* SVG Gradient definitions */}
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={netProfitPct >= 0 ? "#10b981" : "#f43f5e"} stopOpacity="1" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Labelings */}
              <text x={padding} y={svgHeight - 10} className="fill-slate-500 font-mono text-[9px]" textAnchor="middle">S0</text>
              <text x={padding + chartWidth / 2} y={svgHeight - 10} className="fill-slate-500 font-mono text-[9px]" textAnchor="middle">Trade 10</text>
              <text x={svgWidth - padding} y={svgHeight - 10} className="fill-slate-500 font-mono text-[9px]" textAnchor="middle">Trade 20</text>
            </svg>
          </div>
        )}
      </div>

      {/* Information Notes */}
      <div className="flex items-start gap-2.5 text-[10px] text-slate-400 leading-normal p-2.5 rounded bg-slate-950 border border-slate-800/40">
        <Info className="h-4 w-4 text-slate-500 shrink-0" />
        <span>
          <strong>Backtest Note:</strong> This simulation reflects a randomized trial run assuming consistent entry execution near the recommended levels. Actual market executions include slippery execution, spread variables, fees, and dynamic macro events which might alter terminal outcomes.
        </span>
      </div>
    </div>
  );
}
