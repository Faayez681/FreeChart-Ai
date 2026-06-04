/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ConfidenceScores {
  trend: number;      // weight: 30%
  volume: number;     // weight: 20%
  pattern: number;    // weight: 20%
  indicator: number;  // weight: 15%
  momentum: number;   // weight: 15%
}

export interface SetupProbabilities {
  bullish: number;
  bearish: number;
  neutral: number;
}

export interface IndicatorDetails {
  rsi: string;
  macd: string;
  emas: string;
  bollinger: string;
  volume: string;
}

export interface AnalysisReport {
  asset: string;
  timeframe: string;
  trend: "Bullish" | "Bearish" | "Neutral";
  confidenceScore: number;
  confidenceLevel: "Weak" | "Moderate" | "Strong" | "Very Strong";
  scores: ConfidenceScores;
  probabilities: SetupProbabilities;
  marketStructure: string[];
  patterns: string[];
  supportLevels: string[];
  resistanceLevels: string[];
  risk: "Low" | "Medium" | "High";
  entryZone: string;
  stopLoss: string;
  targets: string[];
  riskRewardRatio: string;
  indicators: IndicatorDetails;
  recommendationText: string;
  analysisExplanation: string;
  coachAdvice: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "coach";
  text: string;
  timestamp: string;
}

export interface SampleChartPreset {
  id: string;
  name: string;
  category: "Stock" | "Crypto" | "Forex";
  ticker: string;
  timeframe: string;
  imageUrl: string;
  description: string;
  presetReport: AnalysisReport;
}
