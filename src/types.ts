/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AppView = "HOMEPAGE" | "WORKSPACE" | "SPEC_WORKSTATION" | "ADMIN";

export type WorkspaceTab = "REPORT" | "SIMULATOR" | "COACH" | "CHART" | "DASHBOARD" | "MULTITOOL";

export type ProcessingStep = 
  | "Initializing graphic scanner channels..."
  | "Extracting candles, wicks, and timeframe indicators..."
  | "Aligning relative moving averages and overbought bounds..."
  | "Translating structures via Gemini technical network..."
  | "Securing view ports...";

export type LoaderType = 
  | "SPINNER" 
  | "PROGRESS" 
  | "SKELETON" 
  | "SHIMMER" 
  | "LOGO" 
  | "FULLSCREEN" 
  | "PROGRESSIVE" 
  | "CREATIVE";

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

// Component Props Interfaces
export interface ReportViewerProps {
  report: AnalysisReport;
}

export interface BacktestSimulatorProps {
  report: AnalysisReport;
}

export interface TradeCoachChatProps {
  report: AnalysisReport;
}

export interface ChartSandboxProps {
  uploadedImage: string | null;
  onAnalysisSuccess: (report: AnalysisReport) => void;
}

export interface NewsWidgetProps {
  query?: string;
}

export interface TradingViewChartProps {
  ticker: string;
}

export interface AICore3DProps {
  compact?: boolean;
}

export interface GeneratedChartDataPoint {
  label: string;
  value: number;
}

export interface GeneratedChart {
  id: string;
  prompt: string;
  chartType: "bar" | "line" | "pie";
  title: string;
  xAxisKey: string;
  yAxisKey: string;
  data: GeneratedChartDataPoint[];
  colors: string[];
  explanation: string;
  createdAt: string;
}

// AI Dashboard Generator Core Types
export interface KPIWidget {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: string;
}

export interface DashboardChart {
  id: string;
  type: "area" | "bar" | "line" | "pie";
  title: string;
  data: any[];
  keys: string[];
  keyLabels?: string[];
  colors: string[];
}

export interface DashboardInsights {
  summary: string;
  findings: string[];
  opportunities: string[];
  risks: string[];
  explanations: string[];
}

export interface DashboardReport {
  id: string;
  prompt?: string;
  title: string;
  template: string;
  kpis: KPIWidget[];
  charts: DashboardChart[];
  insights: DashboardInsights;
  summarySection: string;
  createdAt?: string;
}


