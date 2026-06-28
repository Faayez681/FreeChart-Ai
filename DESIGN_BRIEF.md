# Design UI/UX Brief and Specs (Design UI/UX Brief)
## Project: FreeChart AI (v5.0 Pro)

---

### 1. Aesthetic Identity Guidelines
FreeChart AI is designed around a "Spec Elite / Minimalist Luxury" design aesthetic, drawing from the clean structure of precision European lens design systems (Zeiss / Leica) and high-density financial trading terminal setups.

*   **Primary Concept:** Architectural honesty with zero clutter. Focus entirely on contrast, typography hierarchy, and purposeful scanning animations.
*   **Color Tone:** Deep space background contrasted against high-precision vector indicators.

---

### 2. Design System Tokens

#### 2.1 The Spec Palette
*   **Background Canvas:** `#000000` (Pure Black)
*   **Card Shroud:** `#09090b` (Deep charcoal, styled with 1px border lines)
*   **Aesthetic Branding Blue:** `#0066ee` (Premium precision indicator blue)
*   **Breakout Bullish Green:** `#00d97e` (Teal-green, vibrant and highly visible)
*   **Breakout Bearish Red:** `#ff4560` (High-contrast red indicator)
*   **Core Shading Accents:** `#18181b` (Border/divider line highlights)

#### 2.2 Typography Pairings
*   **Primary Sans-Serif (Standard controls, lists, buttons):** `Inter` - versatile, tight kerning, outstanding legible scanning density.
*   **Display Header (Big focus titles):** `Space Grotesk` - geometric, wide, modern tech-forward premium vibe.
*   **Status & Coordinates Monospace (Fractions, indicators, values):** `JetBrains Mono` - highly legible, optimized characters.

---

### 3. Precision State Interactions & Micro-Animations

#### A. Interactive Cursor Indicators (Hover)
On desktop frames, a custom cursor tracking system renders a smooth, delayed visual reticle.
*   Inner tracking dot moves near instantly.
*   Outer reticle trails behind with a light mathematical spring-decay.
*   Imparts high responsiveness.

#### B. Sweep Bar Scanning Visualizer
During screenshot analysis processing, a cyan vector bar glides down the viewfinder frame using a continuous loop animation, simulating precision lens sweeps:
```css
@keyframes scanY {
  0% { transform: translateY(0); opacity: 0.8; }
  50% { opacity: 1; }
  100% { transform: translateY(380px); opacity: 0.2; }
}
```

#### C. Floating Candle Animations
Hover events over presets or workspace elements trigger micro-translations, giving the cards a tactile levitation feel.
