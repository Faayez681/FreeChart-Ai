import React from "react";
import { SkeletonBlock } from "./SkeletonLoader";

export default function ShimmerLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
      {Array(3).fill(0).map((_, idx) => (
        <div key={idx} className="border border-zinc-900 bg-zinc-950/45 p-5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <SkeletonBlock h={36} w={36} />
            <SkeletonBlock h={16} w={60} />
          </div>
          <SkeletonBlock h={22} w="70%" />
          <div className="space-y-2 pt-2 border-t border-zinc-900/60">
            <SkeletonBlock h={12} w="90%" />
            <SkeletonBlock h={12} w="85%" />
            <SkeletonBlock h={12} w="75%" />
          </div>
        </div>
      ))}
    </div>
  );
}
export { ShimmerLoader };
