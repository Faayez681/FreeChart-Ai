/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ShieldCheck, Calendar, Activity, Cpu } from "lucide-react";

interface CompanyLogoBannerProps {
  assetName: string;
  timeframe?: string;
  trend?: string;
}

export default function CompanyLogoBanner({ assetName, timeframe = "4H", trend = "Bullish" }: CompanyLogoBannerProps) {
  // Normalize the asset identifier
  const cleanAsset = assetName.toUpperCase();
  
  const isApple = cleanAsset.includes("AAPL") || cleanAsset.includes("APPLE");
  const isBitcoin = cleanAsset.includes("BTC") || cleanAsset.includes("BITCOIN");
  const isTesla = cleanAsset.includes("TSLA") || cleanAsset.includes("TESLA");

  // Determine metadata
  let name = "Custom Asset";
  let subtitle = "Global Market Specimen";
  let logoBg = "from-zinc-950 to-zinc-900";
  let glowColor = "rgba(100, 110, 120, 0.15)";
  let badgeColor = "bg-zinc-800 text-zinc-300";

  if (isApple) {
    name = "Apple Inc.";
    subtitle = "NASDAQ · AAPL";
    logoBg = "from-zinc-950 via-zinc-900 to-[#0b0b0f]";
    glowColor = "rgba(0, 102, 238, 0.15)";
    badgeColor = "bg-[#0066ee]/10 text-blue-400 border border-[#0066ee]/20";
  } else if (isBitcoin) {
    name = "Bitcoin Network";
    subtitle = "CRYPTO · BTC-USD";
    logoBg = "from-zinc-950 via-[#120e0a] to-[#0b0b0f]";
    glowColor = "rgba(247, 147, 26, 0.12)";
    badgeColor = "bg-[#f7931a]/10 text-[#f7931a] border border-[#f7931a]/20";
  } else if (isTesla) {
    name = "Tesla Inc.";
    subtitle = "NASDAQ · TSLA";
    logoBg = "from-zinc-950 via-[#140e0e] to-[#0b0b0f]";
    glowColor = "rgba(232, 33, 39, 0.12)";
    badgeColor = "bg-[#e82127]/10 text-[#e82127] border border-[#e82127]/20";
  } else {
    // Attempt to extract ticker from e.g. "NVDA (NVIDIA Corp)" -> NVDA
    const match = assetName.match(/^([A-Z0-9a-z-]+)/);
    if (match) {
      name = match[1];
      subtitle = `ACTIVE FINANCIAL SPECIMEN`;
    }
  }

  // Define SVG renderers
  const renderLogo = () => {
    if (isApple) {
      return (
        <div id="company-logo-apple" className="flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl relative group-hover:border-zinc-700 transition-colors">
          <svg className="w-9 h-9 text-white opacity-95 group-hover:scale-105 duration-300 transition-transform" viewBox="0 0 170 170" fill="currentColor">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.35-6.15-2.88-2.38-6.67-6.9-11.33-13.56-7.14-10.22-12.5-21.57-16.08-34.04-3.58-12.47-5.38-23.95-5.38-34.45 0-14.92 3.5-27.17 10.5-36.75 7-9.58 15.66-14.37 25.99-14.37 4.7 0 9.88 1.25 15.54 3.75 5.66 2.5 9.21 3.75 10.66 3.75 1.77 0 5.48-1.37 11.13-4.12 5.66-2.75 10.74-4.12 15.24-4.12 12.35 0 22.3 4.21 29.86 12.63 4.67 5.16 8.01 11.14 10.02 17.93-13.48 8.16-20.15 18.99-20.02 32.5.13 10.22 3.82 18.82 11.07 25.8 7.25 6.98 15.93 10.65 26.04 11.01-.33 2.12-1 4.7-2.01 7.75zM122.9 14.15c0 5.95-2.2 11.66-6.61 17.13-4.41 5.47-9.74 8.2-16 8.2-.13-.53-.2-1.07-.2-1.63 0-5.7 2.22-11.23 6.66-16.59 4.44-5.36 9.8-8.22 16.09-8.58.06.47.06.94.06 1.47z" />
          </svg>
        </div>
      );
    }
    if (isBitcoin) {
      return (
        <div id="company-logo-bitcoin" className="flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-950 border border-amber-500/20 shadow-2xl relative group-hover:border-amber-500/40 transition-colors">
          <svg className="w-10 h-10 text-[#f7931a] group-hover:scale-105 duration-300 transition-transform" viewBox="0 0 512 512" fill="currentColor">
            <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM366.505 197.683c4.137-27.653-16.909-42.525-45.668-52.441l9.328-37.402-22.76-5.674-9.088 36.438c-5.98-1.492-12.13-2.898-18.232-4.288l9.155-36.7-22.753-5.674-9.328 37.409c-4.954-1.127-9.8-2.235-14.475-3.385l.013-.058-31.396-7.838-6.059 24.314s16.892 3.87 16.539 4.108c9.222 2.302 10.89 8.406 10.613 13.245l-10.638 42.668c6.374 1.59 14.636 3.9 21.848 5.836l-8.773 35.187c1.173.292 2.288.583 3.38.868l-9.168 36.76c-1.52.378-3.003.748-4.443 1.118l.006.027-31.422-7.844-6.064 24.331c29.198 7.283 51.525 2.19 61.644-23.708 8.161-20.88-1.583-32.92-16.643-40.8s26.33-6.262 29.351-23.714zm-52.128 77.202c-5.292 21.218-41.05 9.756-52.613 6.877l10.741-43.083c11.564 2.88 47.195 8.57 41.872 36.206zm5.281-77.925c-4.819 19.326-34.629 9.516-44.256 7.119l9.743-39.068c9.627 2.397 39.357 6.874 34.513 21.949z" />
          </svg>
        </div>
      );
    }
    if (isTesla) {
      return (
        <div id="company-logo-tesla" className="flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-950 border border-red-500/20 shadow-2xl relative group-hover:border-red-500/40 transition-colors">
          {/* Exact premium rendering of custom Tesla Emblem SVG */}
          <svg className="w-10 h-10 text-[#e82127] group-hover:scale-105 duration-300 transition-transform" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 5v2l10 3 10-3V5L12 2zm0 10l-8 2.5V17l8 3 8-3v-2.5l-8-2.5z" />
            <path d="M12 5.5l-6-1.8v1.2l6 1.8 6-1.8v-1.2z" />
          </svg>
        </div>
      );
    }

    // Dynamic clean fallback text logo (bento/metallic look)
    const initials = name.slice(0, 3).toUpperCase();
    return (
      <div id="company-logo-fallback" className="flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl relative">
        <span className="font-mono text-xl font-black text-zinc-100 tracking-wider">
          {initials}
        </span>
        <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
      </div>
    );
  };

  return (
    <div 
      id="company-header-corporate-board" 
      className={`relative rounded-3xl overflow-hidden border border-zinc-900 bg-gradient-to-br ${logoBg} p-8 shadow-2xl transition-all duration-300 group hover:border-zinc-800`}
      style={{
        boxShadow: `inset 0 0 80px rgba(0, 0, 0, 0.9), 0 10px 40px ${glowColor}`
      }}
    >
      {/* Absolute Tech grid lines pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Corporate brand symbol container */}
          {renderLogo()}

          <div className="text-left space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="font-sans text-xs font-mono tracking-widest text-zinc-500 uppercase">
                ACTIVE LAB TARGET SPECIMEN
              </span>
              <span className={`text-[8.5px] uppercase font-mono px-2 py-0.5 rounded-full font-bold ${badgeColor}`}>
                {trend} Profile
              </span>
            </div>
            
            <h2 className="text-3xl font-display font-black text-white tracking-tight leading-none">
              {name}
            </h2>
            
            <p className="font-mono text-xs text-zinc-400">
              {subtitle} · <span className="text-zinc-500">Corporate Intelligence Deck Loaded</span>
            </p>
          </div>
        </div>

        {/* System telemetry spec status pills (Right hand side) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-[10px] shrink-0">
          <div className="bg-zinc-950/80 rounded-xl p-3 border border-zinc-900/80 text-left min-w-[110px]">
            <span className="text-zinc-600 block text-[9px] uppercase tracking-wider">Timeframe</span>
            <span className="text-zinc-100 font-bold block mt-0.5 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-blue-500" />
              {timeframe}
            </span>
          </div>

          <div className="bg-zinc-950/80 rounded-xl p-3 border border-zinc-900/80 text-left min-w-[110px]">
            <span className="text-zinc-600 block text-[9px] uppercase tracking-wider">Direction</span>
            <span className={`font-bold block mt-0.5 flex items-center gap-1.5 ${trend === "Bullish" ? "text-emerald-400" : "text-rose-400"}`}>
              <Activity className="h-3.5 w-3.5" />
              {trend.toUpperCase()}
            </span>
          </div>

          <div className="bg-zinc-950/80 rounded-xl p-3 border border-zinc-900/80 col-span-2 sm:col-span-1 text-left min-w-[110px]">
            <span className="text-zinc-600 block text-[9px] uppercase tracking-wider">Status</span>
            <span className="text-blue-400 font-bold block mt-0.5 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              ANALYZED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
