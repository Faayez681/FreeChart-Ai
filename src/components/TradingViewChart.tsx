/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { TrendingUp, RefreshCcw, Info, ExternalLink } from "lucide-react";

interface TradingViewChartProps {
  symbol: string;
}

export default function TradingViewChart({ symbol }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Map user app assets to TradingView exchange symbols
  const getTradingViewSymbol = (inputSymbol: string): string => {
    const cleanSym = inputSymbol.trim().toUpperCase();
    
    // Check if input already has exchange prefix
    if (cleanSym.includes(":")) {
      return cleanSym;
    }

    // Handle common cryptocurrency symbols
    if (
      cleanSym.includes("BTC") || 
      cleanSym.includes("BITCOIN") || 
      cleanSym.includes("CRYPTO") ||
      cleanSym.includes("ETH") ||
      cleanSym.includes("SOL")
    ) {
      return "BINANCE:BTCUSD";
    }

    // Handle specific presets
    if (cleanSym.startsWith("AAPL") || cleanSym.includes("APPLE")) {
      return "NASDAQ:AAPL";
    }
    if (cleanSym.startsWith("TSLA") || cleanSym.includes("TESLA")) {
      return "NASDAQ:TSLA";
    }
    if (cleanSym.startsWith("MSFT") || cleanSym.includes("MICROSOFT")) {
      return "NASDAQ:MSFT";
    }
    if (cleanSym.startsWith("NVDA") || cleanSym.includes("NVIDIA")) {
      return "NASDAQ:NVDA";
    }

    // Fallback directly to NASDAQ or return raw symbol
    return `NASDAQ:${cleanSym}`;
  };

  const tvSymbol = getTradingViewSymbol(symbol);

  useEffect(() => {
    // 1. Create or obtain standard TradingView script injection
    let script = document.getElementById("tradingview-widget-script") as HTMLScriptElement;

    const handleScriptLoad = () => {
      setIsScriptLoaded(true);
      setLoadError(false);
    };

    const handleScriptError = () => {
      setLoadError(true);
    };

    if (!script) {
      script = document.createElement("script");
      script.id = "tradingview-widget-script";
      script.src = "https://s3.tradingview.com/tv.js";
      script.type = "text/javascript";
      script.async = true;
      script.onload = handleScriptLoad;
      script.onerror = handleScriptError;
      document.head.appendChild(script);
    } else {
      if ((window as any).TradingView) {
        setIsScriptLoaded(true);
      } else {
        script.addEventListener("load", handleScriptLoad);
        script.addEventListener("error", handleScriptError);
      }
    }

    return () => {
      if (script) {
        script.removeEventListener("load", handleScriptLoad);
        script.removeEventListener("error", handleScriptError);
      }
    };
  }, []);

  useEffect(() => {
    if (isScriptLoaded && containerRef.current) {
      // Clear container and append intermediate target div
      containerRef.current.innerHTML = "";
      const widgetId = `tradingview_${Math.random().toString(36).substring(7)}`;
      const innerDiv = document.createElement("div");
      innerDiv.id = widgetId;
      innerDiv.className = "w-full h-full";
      containerRef.current.appendChild(innerDiv);

      try {
        new (window as any).TradingView.widget({
          autosize: true,
          symbol: tvSymbol,
          interval: "240", // Default to 4H format
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1", // Candlesticks view mode
          locale: "en",
          toolbar_bg: "#09090b",
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          container_id: widgetId,
          studies: [
            "RSI@tv-basicstudies",
            "MASimple@tv-basicstudies"
          ],
        });
      } catch (err) {
        console.error("TradingView widget initialization error", err);
        setLoadError(true);
      }
    }
  }, [isScriptLoaded, tvSymbol]);

  return (
    <div className="flex flex-col space-y-3 w-full">
      {/* Header toolbar showcasing active live ticker source */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-950 p-4 rounded-2xl border border-zinc-900">
        <div className="flex items-center gap-3">
          <div className="p-2 py-1.5 rounded-lg bg-[#0066ee]/10 border border-[#0051ba]/20 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-left">
            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block">
              LIVE INTERACTIVE CHART
            </span>
            <h4 className="text-xs font-mono font-bold text-[#f4f4f5]">
              TradingView Advanced Engine: <span className="text-blue-400">{tvSymbol}</span>
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[9px] text-zinc-500">
          <Info className="h-3.5 w-3.5 text-[#0066ee]" />
          <span>Interactive hover, zoom, indicators & drawing systems enabled.</span>
        </div>
      </div>

      {/* Actual TradingView Widget Embed Window container */}
      <div 
        id="tradingview-live-sandbox-container"
        className="w-full h-[550px] min-h-[400px] bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden p-1.5 shadow-2xl relative flex flex-col justify-center items-center"
      >
        {loadError ? (
          <div className="p-8 text-center space-y-4">
            <span className="font-mono text-xs text-rose-400 uppercase tracking-widest block font-bold">
              Failed to load standard stream
            </span>
            <p className="text-zinc-500 text-xs max-w-sm">
              The external charts system from TradingView could not be loaded. Please check your internet connection or use standard cached backtest frames.
            </p>
          </div>
        ) : !isScriptLoaded ? (
          <div className="flex flex-col items-center justify-center p-8 space-y-3 text-center">
            <RefreshCcw className="h-6 w-6 text-blue-500 animate-spin" />
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest animate-pulse">
              Connecting TradingView Servers...
            </span>
          </div>
        ) : null}

        {/* The actual placeholder targeted by the dynamic script */}
        <div ref={containerRef} className="w-full h-full rounded-2xl overflow-hidden" />
      </div>
    </div>
  );
}
