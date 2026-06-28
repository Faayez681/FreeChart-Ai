# Technical Requirements Document (TRD)
## Project: FreeChart AI (v5.0 Pro)

---

### 1. System Architecture Overview
FreeChart AI is engineered as a high-fidelity, single-page full-stack application leveraging React 18 for client state tracking, Tailwind CSS for responsive luxury style declarations, and an Express proxy node server to broker Gemini API multimodal visual processing.

```
       +--------------------------------------------------------+
       |                     CLIENT LAYER                       |
       |  [Showcase Home]   [Workstation Lab]   [Sandbox Sketch] |
       +-------------------------+------------------------------+
                                 | (HTTP POST / Fetch / Stream)
                                 v
       +--------------------------------------------------------+
       |                     SERVER PROXY                       |
       |     [Vite Middleware]     [Express API /api/analyze]   |
       +-------------------------+------------------------------+
                                 | (Secure API Authentication)
                                 v
       +--------------------------------------------------------+
       |                 INTELLIGENCE COGNITION                 |
       |              [Gemini 1.5/2.0 Multimodal API]           |
       +--------------------------------------------------------+
```

---

### 2. Client-Side Specifications & State Engineering
The client architecture uses a central state machine managing navigation, screenshot uploads, drawing coordinates, and diagnostic summaries.

#### 2.1 Component Architecture & Routing
*   **Routing System:** Single-view conditional router. State space: `HOMEPAGE | WORKSPACE | SPEC_WORKSTATION`.
*   **Core State Variables:**
    *   `currentView`: Tracking active display mode.
    *   `activeReport`: Diagnostic structured JSON object following `AnalysisReport` TypeScript interface.
    *   `uploadedImage`: Base64 raw image reference to render target mockup.
    *   `isProcessing`: Volatility sweep loader trigger.

#### 2.2 Paste Injection & Drag-and-Drop Event Listener
The system listens to global window clipboard paste events:
```typescript
useEffect(() => {
  const handlePaste = (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) processRawFile(file);
      }
    }
  };
  window.addEventListener("paste", handlePaste);
  return () => window.removeEventListener("paste", handlePaste);
}, []);
```

---

### 3. Server-Side Specifications & API Proxy
To protect security credentials and handle visual analysis, all image requests route through an Express body parser.

#### 3.1 Endpoint Schema: `POST /api/analyze`
*   **Request Payload:**
```json
{
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSU..."
}
```
*   **Response Payload Structure (Strict JSON following our TypeScript interface):**
```json
{
  "asset": "BTC-USD",
  "timeframe": "4 Hour",
  "trend": "Bullish",
  "confidenceScore": 88,
  "confidenceLevel": "Strong",
  "scores": {
    "trend": 90,
    "volume": 85,
    "pattern": 88,
    "indicator": 82,
    "momentum": 86
  },
  "patterns": ["Bullish Engulfing", "Double Bottom Support"],
  "supportLevels": ["$67,500", "$66,200"],
  "resistanceLevels": ["$70,000", "$71,500"],
  "entryZone": "$67,800 - $68,400",
  "stopLoss": "$66,900",
  "targets": ["$69,800", "$70,500", "$72,000"],
  "riskRewardRatio": "1:3.5",
  "recommendationText": "Formulating structural pivot above local average bounds."
}
```

---

### 4. Technical Performance & Resilience Benchmarks
1.  **Response Latency:** Full diagnostic sweeps must compile under 2400ms.
2.  **Image Upload Capacity:** Handle payload sizes up to 8MB in local memory array buffers.
3.  **Graceful Fallback Mode:** In environments where `GEMINI_API_KEY` is not provided, the server falls back to static template analysis using asset-class preset heuristic matrices rather than breaking the UI.
