import React from "react";

interface ProgressLoaderProps {
  progress: number;
  message?: string;
}

export default function ProgressLoader({ progress, message = "Processing technical datasets..." }: ProgressLoaderProps) {
  return (
    <div className="w-full max-w-sm mx-auto space-y-3 p-4 bg-zinc-950/60 border border-zinc-900 rounded-xl">
      <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
        <span className="truncate">{message}</span>
        <span className="text-blue-400 font-bold ml-2 shrink-0">{progress}%</span>
      </div>
      <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-300 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
export { ProgressLoader };
