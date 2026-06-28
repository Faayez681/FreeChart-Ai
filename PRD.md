# Product Requirement Document (PRD)
## Project: FreeChart AI — Premium AI-Powered Chart Generation SaaS Platform
**Author:** AI Product Engineering Team  
**Date:** June 2026  
**Status:** Approved & Implemented  
**Target Version:** v5.0-Enterprise  

---

### 1. Executive Summary & Value Proposition
FreeChart AI is a premium, high-speed, interactive AI-powered chart generator designed for high-growth startups, analysts, students, marketers, and executive teams. The core value proposition is **"Turn Any Text Into Professional Charts Instantly"**. By translating unstructured, conversational natural language and unstructured data into beautiful, presentation-ready diagrams in real-time, FreeChart AI bypasses the overhead of legacy spreadsheet builders (Excel, Google Sheets) and static design platforms (Canva).

---

### 2. Design Philosophy & High-Fidelity Tone
To convey a "$100M Startup" impression, FreeChart AI implements the **Premium Futuristic Minimalism** aesthetic, drawing inspiration from Apple.com, Stripe, Linear, Vercel, TradingView, and Notion.

*   **Color Palette:**
    *   Deep Space Black background: `#050505` to `#07070a` to maintain ocular comfort and high contrast.
    *   Premium pure whites: `#fafafa` to `#ffffff` for ultra-readable display typography.
    *   Electric blue accent: `#2563eb` (`rgb(37,99,235)`) and Indigo Shimmers for active focus elements.
    *   Subtle metallic zinc borders: `#18181b` (`border-zinc-900`) and dark glass backdrops.
*   **Aesthetic Rules:**
    *   *No over-done glassmorphism:* Avoid bulky, opaque glass and cartoonish neon blurs.
    *   *Sophisticated margins:* Incorporate generous negative space, airy row paddings, and balanced visual weights.
    *   *Native performance feeling:* Ensure 60fps transitions and fluid interactive visualizers using Framer Motion (`motion/react`) and Recharts.

---

### 3. Core Feature Architecture & Sections

#### Section 1: Floating Navbar
*   **Left Brand:** High-contrast `freechart.ai` identity configured with an animated gradient spark launcher icon.
*   **Middle Navigation Links:** Quick smooth-scrolling anchors to `Features`, `How It Works`, `Examples`, and `Pricing`.
*   **Right Utilities:** Minimalist "Sign In" waitlist trigger paired with a high-contrast white "Get Started" capsule button, executing a smooth scroll down to the prompt cockpit.
*   **Scroll Interceptor:** Implements real-time scroll state monitoring to trigger a 75% blurred backguard (`backdrop-blur-md bg-zinc-950/80`) once scrolled more than 25px.

#### Section 2: Immersive 3D Hero Screen
*   **Sizing:** 90vh to 100vh display layout to establish commanding status.
*   **Foreground Copy:** Bold, large font size pairing with responsive tracking (`tracking-tight text-white`). 
*   **Background:** 3D prospective dynamic canvas containing floating shimmer vectors, linked particle arrays, and gentle horizontal lattice expansion loops.
*   **Interactive Simulation Console:** A live simulation mock-up which demonstrates real-time compiling. It loops through custom datasets, typing the prompt code line-by-line and compiling it into an active Area Chart in secondary stages.

#### Section 3: Social Telemetry Proof
*   **Counter Panel:** Neon numerical representation showing `50,000+` charts generated securely.
*   **Validated Audiences:** Scrolling/ticker items of corporate audiences: `Startups`, `Analysts`, `Marketers`, `Researchers`.

#### Section 4: Interactive Cockpit Engine (The Sandbox)
*   **Core Capability:** Open-participation testing sandbox requiring no tedious registration or authentication locks.
*   **Inputs:** A clean multi-line `textarea` accepting standard prose, and a drag-and-drop dotted boundary accepting CSV or plain spreadsheet files.
*   **Live Preview Canvas:** Live compilation showing the generated Recharts diagrams, complete with full interactivity:
    *   Layout overrides (on-the-fly toggling between Bar Chart, Line Chart, and Pie Chart).
    *   Interactive customizers (toggle Gridlines, Tooltips, active Legends).
    *   Preset-driven themes (Ocean, Emerald green, Cyber violet, Golden Sunset, Neon Rose, or Minimalist Mono).
*   **Export Actions:** Premium client-side file downloads:
    *   **SVG Download:** Extracts full vector XML representation directly from the active SVG container for high-fidelity designer scaling.
    *   **PNG Download:** Renders the vector onto a canvas stream with custom high-contrast dark backgrounds and captures a 2x retina snapshot download.
    *   **PDF Download:** Dynamically invokes `jspdf` to generate an executive-grade 1-page paper briefing detailing chart titles, AI summaries, and complete setpoint data matrices.

#### Section 5: Bento-Grid Interactive Features
Six beautifully polished card containers representing:
1.  **AI Chart Generation:** Deep LLM natural language compilers.
2.  **Smart Analytics:** Automated trend explanations.
3.  **Presentation Export:** Instant high-res SVG, PNG, and PDF briefings.
4.  **Brand Themes:** Apple-level high-fidelity preset gradients.
5.  **Instant Insights:** Real-time summary breakdowns.
6.  **Interactive Dashboard:** Customizable toggles for custom layouts and controls.

#### Section 6: How It Works Timeline
A structured 4-step vertical or horizontal timeline illustrating:
*   `Step 1: Describe Data`
*   `Step 2: AI Understands`
*   `Step 3: Generate Chart`
*   `Step 4: Export Anywhere`
Includes hover transition and glow tracking.

#### Section 7: Strategic Matrix-Comparison Table
Gives immediate competitive positioning comparing `FreeChart AI` against traditional tools like `Excel`, `Google Sheets`, and `Canva Charts` across premium metrics like speed, style compliance, natural language parsing, and executive-grade exports.

#### Section 8: Executive Social Proof Testimonials
Authentic design cards with realistic tech-profiles, custom avatar initials, and elegant glass states showing high operational success scores.

#### Section 9: Transparent Scale Pricing
A clean 3-tier matrix showing `Free`, `Pro`, and `Enterprise Team` packages with clear custom feature details, highlighting the high-value `Pro` option in an electric-blue focus outline.

#### Section 10: Final CTA & Secure Waitlist capture
Features a minimal digital submit module which registers interest. Stores registrations locally inside client storage with elegant diagnostic checks.

---

### 4. Technical Engine Specs & Serialization
*   **Platform Runtime:** React 19 / Vite / TypeScript.
*   **Core Rendering Engine:** Recharts, optimized with primitive state dependency arrays to eradicate duplicate execution and frame tearing.
*   **Local Storage Keys:**
    *   `fc_recent_charts_saved`: Array of user-generated datasets and types.
    *   `fc_waitlist_registered`: Array of approved diagnostic subscriber emails.
*   **Lighthouse Performance Mandates:**
    *   Zero CLS (Cumulative Layout Shift) by serving pre-computed canvas wrappers.
    *   Highly optimized SVGs with strict `referrerPolicy="no-referrer"` handling.
    *   Perfect accessibility using deep black `#050505` to `#fafafa` contrast layers.
