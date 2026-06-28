import React from "react";

export default function SpinnerLoader({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "sm" ? "h-5 w-5 border-2" : size === "lg" ? "h-10 w-10 border-3" : "h-7 w-7 border-2";

  return (
    <div className="flex items-center justify-center p-3">
      <div 
        aria-label="Loading indicator"
        className={`animate-spin rounded-full border-t-transparent border-blue-500 ${sizeClass}`} 
      />
    </div>
  );
}
export { SpinnerLoader };
