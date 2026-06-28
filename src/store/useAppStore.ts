import { create } from "zustand";
import { AppView, WorkspaceTab, ProcessingStep, AnalysisReport, SampleChartPreset, DashboardReport } from "../types";
import { SAMPLE_CHARTS } from "../utils/mockPresetData";

interface AppState {
  currentView: AppView;
  activeCores: SampleChartPreset[];
  customCoreTicker: string;
  customCoreTimeframe: string;
  customCoreTrend: "Bullish" | "Bearish" | "Neutral";
  activeReport: AnalysisReport;
  activeDashboard: DashboardReport | null;
  uploadedImage: string | null;
  activePresetId: string;
  isProcessing: boolean;
  processingStep: ProcessingStep;
  errorText: string | null;
  activeTab: WorkspaceTab;
  user: {
    uid?: string;
    name: string;
    email: string;
    avatarUrl: string;
    role?: string;
    status?: string;
    requestsCount?: number;
    createdAt?: string;
  } | null;
  isAuthModalOpen: boolean;

  // Actions
  setCurrentView: (view: AppView) => void;
  setActiveCores: (cores: SampleChartPreset[]) => void;
  setCustomCoreTicker: (ticker: string) => void;
  setCustomCoreTimeframe: (timeframe: string) => void;
  setCustomCoreTrend: (trend: "Bullish" | "Bearish" | "Neutral") => void;
  setActiveReport: (report: AnalysisReport) => void;
  setActiveDashboard: (dashboard: DashboardReport | null) => void;
  setUploadedImage: (image: string | null) => void;
  setActivePresetId: (id: string) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setProcessingStep: (step: ProcessingStep) => void;
  setErrorText: (error: string | null) => void;
  setActiveTab: (tab: WorkspaceTab) => void;
  setUser: (
    user: {
      uid?: string;
      name: string;
      email: string;
      avatarUrl: string;
      role?: string;
      status?: string;
      requestsCount?: number;
      createdAt?: string;
    } | null
  ) => void;
  setIsAuthModalOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentView: "HOMEPAGE",
  activeCores: SAMPLE_CHARTS,
  customCoreTicker: "",
  customCoreTimeframe: "1 Hour",
  customCoreTrend: "Bullish",
  activeReport: SAMPLE_CHARTS[0].presetReport,
  activeDashboard: null,
  uploadedImage: SAMPLE_CHARTS[0].imageUrl,
  activePresetId: "aapl-bullish",
  isProcessing: false,
  processingStep: "Initializing graphic scanner channels...",
  errorText: null,
  activeTab: "CHART",
  user: (() => {
    try {
      const cached = localStorage.getItem("freechartai_user");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.uid !== "offline-bypass-admin" && parsed?.email !== "ansfaayez1966@gmail.com") {
          return parsed;
        }
      }
    } catch {}
    return null;
  })(),
  isAuthModalOpen: false,

  setCurrentView: (view) => set({ currentView: view }),
  setActiveCores: (cores) => set({ activeCores: cores }),
  setCustomCoreTicker: (ticker) => set({ customCoreTicker: ticker }),
  setCustomCoreTimeframe: (timeframe) => set({ customCoreTimeframe: timeframe }),
  setCustomCoreTrend: (trend) => set({ customCoreTrend: trend }),
  setActiveReport: (report) => set({ activeReport: report }),
  setActiveDashboard: (dashboard) => set({ activeDashboard: dashboard }),
  setUploadedImage: (image) => set({ uploadedImage: image }),
  setActivePresetId: (id) => set({ activePresetId: id }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setProcessingStep: (step) => set({ processingStep: step }),
  setErrorText: (error) => set({ errorText: error }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setUser: (user) => {
    if (user) {
      localStorage.setItem("freechartai_user", JSON.stringify(user));
      try {
        localStorage.removeItem("freechartai_logged_out");
        const usersListStr = localStorage.getItem("freechartai_registered_users") || "[]";
        const usersList = JSON.parse(usersListStr);
        if (!usersList.some((u: any) => u.email === user.email)) {
          usersList.push({
            ...user,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          });
        } else {
          for (let i = 0; i < usersList.length; i++) {
            if (usersList[i].email === user.email) {
              usersList[i].lastLogin = new Date().toISOString();
            }
          }
        }
        localStorage.setItem("freechartai_registered_users", JSON.stringify(usersList));
      } catch (e) {
        console.error(e);
      }
    } else {
      localStorage.removeItem("freechartai_user");
    }
    set({ user });
  },
  setIsAuthModalOpen: (open) => set({ isAuthModalOpen: open }),
}));
