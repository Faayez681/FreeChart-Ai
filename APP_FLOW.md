# App User Flow and Architecture (Create App Flow)
## Project: FreeChart AI (v5.0 Pro)

---

### 1. Interactive App Map Overview
This flow diagrams the user path from landing, screenshot analysis trigger, deep sandboxed modifications, to real-world deployment decisions.

```
                  +-----------------------------------+
                  |           1. Landing Screen       |
                  |  - Learn Core Models / Presets    |
                  |  - Technical Specs Overview Page  |
                  +-----------------+-----------------+
                                    |
                                    v
                  +-----------------------------------+
                  |        2. Capture Interface       |  <-----+
                  |  - Drag & Drop Asset Snapshot     |        |
                  |  - Clipboard Raw Paste Trigger    |        | (Draw new pattern)
                  |  - Interactive Sketch Sandbox     |        |
                  +-----------------+-----------------+        |
                                    |                          |
                                    v                          |
                  +-----------------------------------+        |
                  |        3. Processing Channel       |        |
                  |  - Trigger Live Multimodal API    |        |
                  |  - Cascade Scan Animations        |        |
                  +-----------------+-----------------+        |
                                    |                          |
                                    v                          |
                  +-----------------------------------+        |
                  |      4. Main Diagnostics Lab      |  ------+
                  |  - Standard Specs Checklist       |
                  |  - Dynamic Support/Resistance     |
                  |  - Interactive Strategy Simulator |
                  |  - Senior Trade Coach Chat Panel  |
                  +-----------------------------------+
```

---

### 2. Functional Route Transitions

#### A. The Upload Scan Loop (Automatic)
1.  **User Trigger:** User drops a `.png` file or presses `Cmd+V`.
2.  **State Shift:** Core state `uploadedImage` is populated, view transitions instantly to `currentView = "WORKSPACE"`, and `activeTab = "REPORT"`.
3.  **Visual Queue:** `isProcessing` flag is set to true. HUD elements flash and display scanning progress stages.
4.  **Payload Dispatch:** Client posts raw base64 arrays to `/api/analyze`.
5.  **Data Render:** `isProcessing` finishes. The parsed JSON populates `activeReport` which updates charts, tables, trading advice elements, and contextualizes the AI Coach chat context.

#### B. The Manual Sketch Sandbox Loop (Alternative)
1.  **User Switch:** User scrolls to Sandbox Canvas on the sidebar.
2.  **Interactive Setup:** Uses drawing tools to model diagonal flags or price bounds.
3.  **Selection Trigger:** Clicks bullish or bearish analysis simulation buttons.
4.  **Simulation Dispatch:** Transcribes drawings to custom local reports. Overwrites active indicators to let the user backtest their manual hand-drawn layout!

#### C. The Conversational Audit Loop
1.  **User Switch:** User checks "Coach Space" tab.
2.  **Instruction Feed:** Sends a message asking "Where is the major stop loss?"
3.  **State Context:** Coach reads active report JSON state variables, formulates institutional answers, and logs message history parameters.
