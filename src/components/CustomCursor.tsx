import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "motion/react";

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  // Real-time hover coordinate coordinates telemetry
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  // Light trail coordinate history for glowing cyber-trail (up to 5 elements)
  const [trail, setTrail] = useState<{ x: number; y: number; id: string; opacity: number }[]>([]);

  // Motion Values for immediate real-time tracking
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Springs for smooth, delayed tactical lag/HUD drag
  const springConfig = { damping: 28, stiffness: 200, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if device is touch or mobile to disable custom cursor safely
    const checkTouch = () => {
      const isTouch = 
        window.matchMedia("(pointer: coarse)").matches || 
        ("ontouchstart" in window) || 
        (navigator.maxTouchPoints > 0);
      setIsTouchDevice(isTouch);
    };

    checkTouch();
    window.addEventListener("resize", checkTouch);

    if (isTouchDevice) return;

    let indexCount = 0;
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setCoords({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Add points to trail with unique IDs to allow React list key matching
      indexCount++;
      if (indexCount % 2 === 0) { // Throttle trail capture to run perfectly at 60fps
        setTrail((prev) => {
          const freshPoint = {
            x: e.clientX,
            y: e.clientY,
            id: `${e.clientX}-${e.clientY}-${Date.now()}-${Math.random()}`,
            opacity: 0.65,
          };
          return [freshPoint, ...prev].slice(0, 5);
        });
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseDown = () => {
      setClicked(true);
    };

    const handleMouseUp = () => {
      setClicked(false);
    };

    // Global listener discovering pointer components and active triggers
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.closest("button") ||
          target.closest("a") ||
          target.closest("input") ||
          target.closest("select") ||
          target.closest("textarea") ||
          target.closest('[role="button"]') ||
          target.closest(".cursor-pointer") ||
          window.getComputedStyle(target).cursor === "pointer")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    // Inject CSS to hide physical cursor cleanly during active fine-pointer tracking
    const styleTag = document.createElement("style");
    styleTag.id = "custom-cursor-global-style";
    styleTag.innerHTML = `
      @media (pointer: fine) {
        body, a, button, input, select, textarea, [role="button"], .cursor-pointer {
          cursor: none !important;
        }
      }
    `;
    document.head.appendChild(styleTag);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    // Fade out trail elements periodically
    const trailInterval = setInterval(() => {
      setTrail((prev) =>
        prev
          .map((pt) => ({ ...pt, opacity: pt.opacity - 0.15 }))
          .filter((pt) => pt.opacity > 0)
      );
    }, 60);

    return () => {
      window.removeEventListener("resize", checkTouch);
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      clearInterval(trailInterval);
      
      const tag = document.getElementById("custom-cursor-global-style");
      if (tag) tag.remove();
    };
  }, [cursorX, cursorY, isVisible, isTouchDevice]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[10000] overflow-hidden select-none">
      
      {/* 1. Dissolving Digital Trail Fragments */}
      {trail.map((pt, idx) => (
        <div
          key={pt.id}
          className="absolute bg-gradient-to-r from-[#00D4FF] to-[#0A84FF] rounded-full blur-[0.8px]"
          style={{
            left: pt.x,
            top: pt.y,
            width: `${1.5 + (5 - idx) * 0.8}px`,
            height: `${1.5 + (5 - idx) * 0.8}px`,
            opacity: pt.opacity * 0.4,
            transform: "translate(-50%, -50%)",
            transition: "opacity 100ms ease-out",
          }}
        />
      ))}

      {/* 2. Interactive Circular Targeting Reticle with Spring Inertia */}
      <motion.div
        id="custom-cursor-reticle"
        className="absolute w-20 h-20 flex items-center justify-center pointer-events-none"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute inset-0"
            >
              {/* Outer Dashed Spinning Circle */}
              <motion.svg
                width="100%"
                height="100%"
                viewBox="0 0 80 80"
                className="absolute text-[#00D4FF]"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              >
                <circle
                  cx="40"
                  cy="40"
                  r="30"
                  stroke="currentColor"
                  strokeDasharray="4 6"
                  strokeWidth="0.75"
                  fill="none"
                  className="opacity-70"
                />
              </motion.svg>

              {/* Inner Cyber-Lock Ticks rotating counter-clockwise */}
              <motion.svg
                width="100%"
                height="100%"
                viewBox="0 0 80 80"
                className="absolute text-[#0A84FF]"
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              >
                {/* 4 Corner Crosshair Marks */}
                <path d="M 40 14 L 40 18" stroke="currentColor" strokeWidth="1.2" />
                <path d="M 40 62 L 40 66" stroke="currentColor" strokeWidth="1.2" />
                <path d="M 14 40 L 18 40" stroke="currentColor" strokeWidth="1.2" />
                <path d="M 62 40 L 66 40" stroke="currentColor" strokeWidth="1.2" />
                
                {/* HUD Angled brackets */}
                <path d="M 28 28 L 24 28 L 24 32" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M 52 28 L 56 28 L 56 32" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M 28 52 L 24 52 L 24 48" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M 52 52 L 56 52 L 56 48" stroke="currentColor" strokeWidth="1" fill="none" />
              </motion.svg>

              {/* High-Contrast Coordinates Telemetry on active elements */}
              <div className="absolute top-[85%] left-[85%] bg-black/90 px-1 py-0.5 rounded border border-[#00D4FF]/30 font-mono text-[6.5px] text-[#00D4FF] uppercase tracking-wider scale-90 whitespace-nowrap">
                LOCK_X{coords.x}:Y{coords.y}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 3. Aggressive Sharp Triangular Vector Pointer Core */}
      <motion.div
        id="custom-cursor-pointer"
        className="absolute w-8 h-8 pointer-events-none"
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={{
          scale: clicked ? 0.85 : isHovered ? 1.05 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 20 }}
      >
        <div className="relative w-full h-full">
          
          {/* Neon electric blue outer blur background bloom */}
          <div className="absolute inset-0 w-8 h-8 rounded-full bg-[#0A84FF]/25 blur-[12px] opacity-80 pointer-events-none" />

          {/* Sharp HUD pointer SVG */}
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            className="absolute left-0 top-0 transition-transform duration-200"
            style={{
              filter: "drop-shadow(0 0 3.5px rgba(10, 132, 255, 0.85))",
            }}
          >
            {/* Holographic cyan outline */}
            <polygon
              points="2,2 20,9 10,11 8,19"
              fill="rgba(5, 5, 5, 0.94)"
              stroke="#00D4FF"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* Metallic internal carbon highlight line */}
            <line
              x1="3"
              y1="3"
              x2="10"
              y2="10"
              stroke="#0A84FF"
              strokeWidth="0.85"
              strokeLinecap="round"
            />
          </svg>

          {/* Orbiting cyber energy particles circling pointer tip (at 0,0 top-left of parent box) */}
          <motion.div
            className="absolute left-1 top-1 w-5 h-5 flex items-center justify-center"
            style={{ x: "-50%", y: "-50%" }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
          >
            {/* Primary Orbit Dot */}
            <div className="absolute top-0 left-1/2 w-1.2 h-1.2 bg-[#00D4FF] rounded-full shadow-[0_0_4px_#00D4FF]" />
            {/* Secondary dim trailing bit */}
            <div className="absolute bottom-0 right-1/4 w-[1px] h-[1px] bg-[#0A84FF] rounded-full opacity-60" />
          </motion.div>

        </div>
      </motion.div>

    </div>
  );
}
