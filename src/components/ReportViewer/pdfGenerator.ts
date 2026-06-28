import { jsPDF } from "jspdf";
import { AnalysisReport } from "../../types";

export const downloadPDFReport = (report: AnalysisReport) => {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const startX = 15;
    const endX = 195;
    const contentWidth = 180;
    const isBullish = report.trend === "Bullish";
    const isBearish = report.trend === "Bearish";

    // ----------------------------------------------------
    // PAGE 1: EXECUTIVE BRIEFING & POSITION ARCHITECTURE
    // ----------------------------------------------------

    // 1. Dark Header Band
    doc.setFillColor(10, 15, 30);
    doc.rect(startX, 15, contentWidth, 35, "F");

    // Header branding
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(59, 130, 246); // clear blue
    doc.text("TECHNICAL INTELLIGENCE SCAN INDEX", startX + 8, 23);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text(report.asset, startX + 8, 33);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(156, 163, 175);
    doc.text(`Interval: ${report.timeframe}  |  Risk Class: ${report.risk} Setup`, startX + 8, 41);

    // Status Badge (Trend Bias) on the right side of header banner
    if (isBullish) {
      doc.setFillColor(6, 78, 59); // dark emerald green
      doc.rect(startX + 125, 21, 47, 12, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(52, 211, 153); // bright emerald
      doc.text("BULLISH BIAS", startX + 148.5, 29, { align: "center" });
    } else if (isBearish) {
      doc.setFillColor(159, 18, 57); // dark rose red
      doc.rect(startX + 125, 21, 47, 12, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(248, 113, 113); // bright rose red
      doc.text("BEARISH BIAS", startX + 148.5, 29, { align: "center" });
    } else {
      doc.setFillColor(31, 41, 55); // dark grey
      doc.rect(startX + 125, 21, 47, 12, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(209, 213, 219); // clear gray
      doc.text("NEUTRAL BIAS", startX + 148.5, 29, { align: "center" });
    }

    // Confidence Score on the right of badge
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(`Score strength: ${report.confidenceScore}%`, startX + 148.5, 41, { align: "center" });

    // 2. Setup Directional Probabilities
    let y = 60;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(17, 24, 39);
    doc.text("Setup Directional Probabilities Bias:", startX, y);

    // Total width: 180mm. Let's divide based on score ratios
    const bullWidth = (report.probabilities.bullish / 100) * 180;
    const bearWidth = (report.probabilities.bearish / 100) * 180;
    const neutWidth = (report.probabilities.neutral / 100) * 180;

    // Draw the segmented horizontal bar
    let currentBarX = startX;
    if (bullWidth > 0) {
      doc.setFillColor(16, 185, 129); // emerald green
      doc.rect(currentBarX, y + 3, bullWidth, 5, "F");
      currentBarX += bullWidth;
    }
    if (bearWidth > 0) {
      doc.setFillColor(239, 68, 68); // rose red
      doc.rect(currentBarX, y + 3, bearWidth, 5, "F");
      currentBarX += bearWidth;
    }
    if (neutWidth > 0) {
      doc.setFillColor(107, 114, 128); // titanium gray
      doc.rect(currentBarX, y + 3, neutWidth, 5, "F");
    }

    // Add segment percentage markers below bar
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    
    doc.setTextColor(16, 185, 129);
    doc.text(`Bullish: ${report.probabilities.bullish}%`, startX, y + 13);
    
    doc.setTextColor(239, 68, 68);
    doc.text(`Bearish: ${report.probabilities.bearish}%`, startX + 65, y + 13, { align: "center" });
    
    doc.setTextColor(107, 114, 128);
    doc.text(`Neutral: ${report.probabilities.neutral}%`, endX, y + 13, { align: "right" });

    // Separator line
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.line(startX, y + 17, endX, y + 17);

    // 3. Dual-Column Grid System: Trade Targets (A) vs boundaries (B)
    y = 86;

    // --- COLUMN A: CORE TRADE PLAN TARGETS ---
    doc.setFillColor(249, 250, 251);
    doc.rect(startX, y, 85, 75, "F");
    doc.setDrawColor(229, 231, 235);
    doc.rect(startX, y, 85, 75, "S");

    // Panel Header
    doc.setFillColor(17, 24, 39);
    doc.rect(startX, y, 85, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text("CORE TRADE PLAN TARGETS", startX + 5, y + 5.5);

    // Entry Zone
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(16, 185, 129); // emerald
    doc.text(report.entryZone, startX + 6, y + 18);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(107, 114, 128);
    doc.text("ENTRY RANGE TARGET ZONE", startX + 6, y + 23);

    // Stop Loss
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(239, 68, 68); // Red
    doc.text(report.stopLoss, startX + 6, y + 33);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(107, 114, 128);
    doc.text("PROTECTIVE STOP LOSS BLOCK", startX + 6, y + 38);

    // Profit target sequence
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(55, 65, 81);
    doc.text("CALCULATED TARGET SEQUENCE", startX + 6, y + 47);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(17, 24, 39);
    doc.text(`T1: ${report.targets?.[0] || 'N/A'}`, startX + 6, y + 55);
    doc.text(`T2: ${report.targets?.[1] || 'N/A'}`, startX + 6, y + 62);
    doc.text(`T3: ${report.targets?.[2] || 'N/A'}`, startX + 6, y + 69);

    // Risk reward ratio text badge
    doc.setFillColor(236, 253, 245);
    doc.rect(startX + 52, y + 25, 27, 14, "F");
    doc.setDrawColor(167, 243, 208);
    doc.rect(startX + 52, y + 25, 27, 14, "S");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(4, 120, 87);
    doc.text(report.riskRewardRatio, startX + 65.5, y + 31, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(6, 95, 70);
    doc.text("R:R PROFILE RATIO", startX + 65.5, 34.5 + y, { align: "center" });


    // --- COLUMN B: HORIZONTAL TRADING BOUNDARIES ---
    doc.setFillColor(249, 250, 251);
    doc.rect(startX + 95, y, 85, 75, "F");
    doc.setDrawColor(229, 231, 235);
    doc.rect(startX + 95, y, 85, 75, "S");

    // Panel Header
    doc.setFillColor(17, 24, 39);
    doc.rect(startX + 95, y, 85, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text("HORIZONTAL TRADING BOUNDARIES", startX + 100, y + 5.5);

    // Support pillars column
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text("SUPPORT PILLARS (S)", startX + 101, y + 17);

    report.supportLevels?.slice(0, 3).forEach((lvl, idx) => {
      doc.setFillColor(236, 253, 245);
      doc.rect(startX + 101, y + 21 + (idx * 15), 10, 8, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(4, 120, 87);
      doc.text(`S${idx + 1}`, startX + 106, y + 26.5 + (idx * 15), { align: "center" });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(17, 24, 39);
      doc.text(lvl, startX + 115, y + 27 + (idx * 15));
    });

    // Resistances column
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text("RESISTANCE CEILINGS (R)", startX + 141, y + 17);

    report.resistanceLevels?.slice(0, 3).forEach((lvl, idx) => {
      doc.setFillColor(254, 242, 242);
      doc.rect(startX + 141, y + 21 + (idx * 15), 10, 8, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(185, 28, 28);
      doc.text(`R${idx + 1}`, startX + 146, y + 26.5 + (idx * 15), { align: "center" });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(17, 24, 39);
      doc.text(lvl, startX + 155, y + 27 + (idx * 15));
    });

    // 4. Market Formations and Structural Clarity Row
    y = 171;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(17, 24, 39);
    doc.text("Market Formations & Structural Clarity:", startX, y);

    // Card Columns: Left (Patterns) vs Right (Structure observations)
    // Patterns Block
    doc.setFillColor(249, 250, 251);
    doc.rect(startX, y + 4, 85, 48, "F");
    doc.setDrawColor(229, 231, 235);
    doc.rect(startX, y + 4, 85, 48, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text("CHART PATTERNS SPECTRUM", startX + 5, y + 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(55, 65, 81);
    
    report.patterns?.slice(0, 5).forEach((pat, index) => {
      doc.text(`• ${pat}`, startX + 7, y + 18 + (index * 6));
    });

    // Market Structure List block
    doc.setFillColor(249, 250, 251);
    doc.rect(startX + 95, y + 4, 85, 48, "F");
    doc.setDrawColor(229, 231, 235);
    doc.rect(startX + 95, y + 4, 85, 48, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text("STRUCTURAL TREND OBSERVATIONS", startX + 100, y + 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(55, 65, 81);

    let structureY = y + 17;
    report.marketStructure?.slice(0, 4).forEach((item) => {
      const itemLines = doc.splitTextToSize(item, 76);
      itemLines.forEach((line: string) => {
        if (structureY < y + 48) {
          doc.text(`* ${line}`, startX + 102, structureY);
          structureY += 5;
        }
      });
    });

    // 5. Header Footer Page 1
    doc.setDrawColor(229, 231, 235);
    doc.line(startX, 275, endX, 275);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(156, 163, 175);
    doc.text("AI CORE PRESTIGE INTUITION FRAMEWORK • SECURE LOG NO: ST-992", startX, 281);
    doc.text("Page 1 of 2", endX, 281, { align: "right" });


    // ----------------------------------------------------
    // PAGE 2: QUANTITATIVE INDICATOR SPECTRA & NARRATIVE
    // ----------------------------------------------------
    doc.addPage();

    // Draw Top Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(17, 24, 39);
    doc.text("Technical Oscillators Matrix", startX, 20);

    doc.setDrawColor(209, 213, 219);
    doc.line(startX, 23, endX, 23);

    // Drawing Indicators table header
    let tableY = 28;
    doc.setFillColor(17, 24, 39);
    doc.rect(startX, tableY, contentWidth, 8, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text("TECHNICAL INDICATOR CLASS", startX + 4, tableY + 5.5);
    doc.text("QUANTITATIVE SIGNAL LOG", startX + 54, tableY + 5.5);

    const indicatorData = [
      { name: "RSI (Relative Strength)", val: report.indicators.rsi },
      { name: "MACD (Crossovers)", val: report.indicators.macd },
      { name: "Moving Averages / EMAs", val: report.indicators.emas },
      { name: "Bollinger Bands Boundaries", val: report.indicators.bollinger },
      { name: "Volume Oscillation Index", val: report.indicators.volume }
    ];

    tableY += 8;
    
    indicatorData.forEach((row, idx) => {
      // Row backgrounds
      if (idx % 2 === 0) {
        doc.setFillColor(249, 250, 251);
        doc.rect(startX, tableY, contentWidth, 18, "F");
      }
      doc.setDrawColor(229, 231, 235);
      doc.rect(startX, tableY, contentWidth, 18, "S");

      // Cell name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(17, 24, 39);
      doc.text(row.name, startX + 4, tableY + 10);

      // Cell values with smart wrap-around text support
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(55, 65, 81);
      
      const lines = doc.splitTextToSize(row.val, 122);
      let valTextY = tableY + 6.5;
      lines.slice(0, 3).forEach((line: string) => {
        doc.text(line, startX + 54, valTextY);
        valTextY += 4.5;
      });

      tableY += 18;
    });

    // 6. Narrative Explanation block
    y = tableY + 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(17, 24, 39);
    doc.text("AI Technical Structural Narrative:", startX, y);

    const explanationLines = doc.splitTextToSize(report.analysisExplanation, 172);
    const boxHeight = (explanationLines.length * 4.8) + 8;

    doc.setFillColor(250, 250, 251);
    doc.rect(startX + 2.5, y + 4, contentWidth - 2.5, boxHeight, "F");
    
    // Color strip
    if (isBullish) {
      doc.setFillColor(16, 185, 129); // green
    } else if (isBearish) {
      doc.setFillColor(239, 68, 68); // red
    } else {
      doc.setFillColor(107, 114, 128); // gray
    }
    doc.rect(startX, y + 4, 2.5, boxHeight, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(55, 65, 81);
    
    let expLinesY = y + 10;
    explanationLines.forEach((line: string) => {
      doc.text(line, startX + 7, expLinesY);
      expLinesY += 4.8;
    });

    // 7. Coach advice / Insights block
    y = y + 4 + boxHeight + 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(17, 24, 39);
    doc.text("Coach's Strategic Execution Insights:", startX, y);

    const coachLines = doc.splitTextToSize(report.coachAdvice, 172);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(55, 65, 81);
    let coachY = y + 7;
    coachLines.slice(0, 6).forEach((line: string) => {
      doc.text(line, startX, coachY);
      coachY += 4.8;
    });

    // 8. Warning disclaimer region at bottom of page 2
    y = 248;
    doc.setFillColor(254, 242, 242);
    doc.rect(startX, y, contentWidth, 18, "F");
    doc.setDrawColor(252, 165, 165);
    doc.rect(startX, y, contentWidth, 18, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(185, 28, 28);
    doc.text("REGULATORY ADVISORY & MARGIN DISCLAIMER", startX + 4, y + 4.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(153, 27, 27);
    
    const disclaimer = "AI-generated technical intelligence results are calculated automatically using historical datasets for simulation and research. Past behavior never guarantees real outcomes. Speculation in open markets involves capital hazards; seek licensed professionals prior to capital allocation of assets.";
    const disclaimerLines = doc.splitTextToSize(disclaimer, 172);
    let disY = y + 8.5;
    disclaimerLines.forEach((line: string) => {
      doc.text(line, startX + 4, disY);
      disY += 3.8;
    });

    // Footer - Page 2 of 2
    doc.setDrawColor(229, 231, 235);
    doc.line(startX, 275, endX, 275);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(156, 163, 175);
    doc.text("AI CORE PRESTIGE INTUITION FRAMEWORK • SECURE LOG NO: ST-992", startX, 281);
    doc.text("Page 2 of 2", endX, 281, { align: "right" });

    // Save document
    doc.save(`Technical_Intelligence_${report.asset.replace(/\s+/g, "_")}.pdf`);
  } catch (err) {
    console.error("PDF generation failure context: ", err);
  }
};
