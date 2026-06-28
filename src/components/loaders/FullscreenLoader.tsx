import React from "react";
import { Terminal, RefreshCw } from "lucide-react";

export default function FullscreenLoader({ message = "CALIBRATING MULTIMODAL OPTICS..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center select-none font-mono">
      <div className="space-y-6 max-w-sm w-full">
        <div className="relative inline-flex">
          <div className="h-14 w-14 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-center shadow-2xl relative">
            <RefreshCw className="h-6 w-6 text-blue-500 animate-spin" />
          </div>
          <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-black animate-pulse" />
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-bold tracking-widest text-[#fafafa] uppercase">
            {message}
          </h2>
          <div className="flex justify-center items-center gap-1.5 text-zinc-500 text-[10px] tracking-wider">
            <Terminal className="h-3.5 w-3.5 text-blue-400" />
            <span>ESTABLISHING QUANT COGNITIVE LINK</span>
          </div>
        </div>

        <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden relative">
          <div className="absolute top-0 bottom-0 left-0 w-1/3 bg-gradient-to-r from-blue-600 to-[#00c8ff] rounded-full animate-infinite-slide" />
        </div>
      </div>
    </div>
  );
}
export { FullscreenLoader };
