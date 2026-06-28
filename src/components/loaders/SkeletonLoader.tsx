import React from "react";

export const SkeletonBlock = ({ h = 20, w = "100%" }: { h?: number | string; w?: number | string }) => (
  <div 
    aria-label="Structural loader element"
    className="animate-shimmer"
    style={{
      height: typeof h === "number" ? `${h}px` : h,
      width: typeof w === "number" ? `${w}px` : w,
      borderRadius: 4,
      background: "linear-gradient(90deg, #18181b 25%, #27272a 50%, #18181b 75%)",
      backgroundSize: "200% 100%",
    }} 
  />
);

export default function SkeletonLoader() {
  return (
    <div className="space-y-4 p-5 border border-zinc-900 rounded-xl bg-zinc-950/20">
      <SkeletonBlock h={28} w="40%" />
      <SkeletonBlock h={80} w="100%" />
      <div className="grid grid-cols-2 gap-4">
        <SkeletonBlock h={44} />
        <SkeletonBlock h={44} />
      </div>
      <SkeletonBlock h={110} />
    </div>
  );
}
