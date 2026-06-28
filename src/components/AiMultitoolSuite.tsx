import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles, MessageSquare, Image as ImageIcon, Code, BookOpen, FileText, Cpu, PenTool, Globe2, Sparkle,
  FileSpreadsheet, Mail, Presentation, GraduationCap, ClipboardList, Layers, HelpCircle, Mic, Volume2,
  Settings, User, Lock, Search, ChevronRight, Check, Play, ArrowRight, Eye, RefreshCw, Trash2, Edit3, Plus,
  Send, Upload, Copy, Info, AlertCircle, Share2, Star, CheckCircle, Compass, Terminal, Shield, Menu, X, ArrowLeft
} from "lucide-react";

type MultitoolTab =
  | "DASHBOARD"
  | "CHAT"
  | "IMAGE_GEN"
  | "CODE"
  | "ACADEMIC"
  | "OCR"
  | "NOTES"
  | "CAREER"
  | "STUDY_TOOLS"
  | "SETTINGS"
  | "AUTH_DEMO";

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

interface Flashcard {
  front: string;
  back: string;
}

interface MindNode {
  id: string;
  label: string;
  parentId?: string;
  x: number;
  y: number;
}

interface Slide {
  slideNumber: number;
  title: string;
  bullets: string[];
  visualType: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export default function AiMultitoolSuite() {
  // Core tab state
  const [activeSubTab, setActiveSubTab] = useState<MultitoolTab>("DASHBOARD");
  const [loading, setLoading] = useState(false);

  // Styling customize states
  const [glassBlur, setGlassBlur] = useState<number>(20);
  const [glowColor, setGlowColor] = useState<string>("blue");
  const [glowIntensity, setGlowIntensity] = useState<number>(40);
  const [lightMode, setLightMode] = useState<boolean>(false);

  // Common UI helper states
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // 1. CHAT ASSISTANT STATE
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([
    { id: "1", sender: "coach", text: "Welcome to your Apple Liquid Glass Workspace! Describe any task, and I'll generate clean solutions in real-time.", timestamp: "Just now" }
  ]);
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceOutputActive, setVoiceOutputActive] = useState(false);

  // 2. IMAGE GENERATION STATE
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageStyle, setImageStyle] = useState("Apple Minimalist");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>("");
  const [customSvgCode, setCustomSvgCode] = useState<string>("");

  // 3. CODE SANDBOX STATE
  const [codePrompt, setCodePrompt] = useState("Create a responsive card slider");
  const [codeOutput, setCodeOutput] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("typescript");
  const [explainCode, setExplainCode] = useState("");
  const [explainOutput, setExplainOutput] = useState("");

  // 4. ACADEMIC SUITE STATE
  const [academicText, setAcademicText] = useState("");
  const [academicSummary, setAcademicSummary] = useState("");
  const [pdfName, setPdfName] = useState<string | null>(null);
  const [pdfMessages, setPdfMessages] = useState<any[]>([]);
  const [pdfInput, setPdfInput] = useState("");

  // 5. OCR STATE
  const [ocrImage, setOcrImage] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState("");
  const [ocrScanning, setOcrScanning] = useState(false);

  // 6. NOTES & GRAMMAR STATE
  const [notes, setNotes] = useState<Note[]>([
    { id: "n1", title: "WWDC 2025 Architecture Specs", content: "Liquid glass styles use backdrop-filter: blur(20px) with thin 1px borders of alpha white.", updatedAt: "10 mins ago" }
  ]);
  const [activeNoteId, setActiveNoteId] = useState<string>("n1");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [grammarText, setGrammarText] = useState("");
  const [grammarResults, setGrammarResults] = useState<any>(null);
  const [translateText, setTranslateText] = useState("");
  const [translateLang, setTranslateLang] = useState("Spanish");
  const [translateOutput, setTranslateOutput] = useState("");

  // 7. CAREER HUB STATE
  const [careerPrompt, setCareerPrompt] = useState("");
  const [resumeData, setResumeData] = useState<any>(null);
  const [emailTone, setEmailTone] = useState("Professional");
  const [emailOutput, setEmailOutput] = useState("");
  const [presentationPrompt, setPresentationPrompt] = useState("");
  const [presentationSlides, setPresentationSlides] = useState<Slide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // 8. STUDY TOOLS STATE
  const [studySubject, setStudySubject] = useState("");
  const [studyCurriculum, setStudyCurriculum] = useState<any>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizScored, setQuizScored] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [mindNodes, setMindNodes] = useState<MindNode[]>([]);
  const [selectedMindNode, setSelectedMindNode] = useState<string | null>(null);

  // 9. AUTH DEMO STATE
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authOtp, setAuthOtp] = useState(["", "", "", ""]);
  const [authStep, setAuthStep] = useState<"login" | "otp" | "success">("login");
  const [notification, setNotification] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamic Glow Color helper classes
  const getGlowClasses = () => {
    switch (glowColor) {
      case "purple": return "shadow-[0_0_50px_rgba(168,85,247,0.15)] border-purple-500/10";
      case "cyan": return "shadow-[0_0_50px_rgba(6,182,212,0.15)] border-cyan-500/10";
      case "orange": return "shadow-[0_0_50px_rgba(249,115,22,0.15)] border-orange-500/10";
      default: return "shadow-[0_0_50px_rgba(59,130,246,0.15)] border-blue-500/10";
    }
  };

  const getGlowBgClasses = () => {
    switch (glowColor) {
      case "purple": return "bg-purple-500";
      case "cyan": return "bg-cyan-500";
      case "orange": return "bg-orange-500";
      default: return "bg-blue-500";
    }
  };

  const getGlowTextClasses = () => {
    switch (glowColor) {
      case "purple": return "text-purple-400";
      case "cyan": return "text-cyan-400";
      case "orange": return "text-orange-400";
      default: return "text-blue-400";
    }
  };

  // Synchronize Note Editor fields
  useEffect(() => {
    const activeNote = notes.find(n => n.id === activeNoteId);
    if (activeNote) {
      setNoteTitle(activeNote.title);
      setNoteContent(activeNote.content);
    }
  }, [activeNoteId, notes]);

  // Toast notifier
  const triggerNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Helper: Copy code to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    triggerNotification("Copied to clipboard!");
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Call the server api
  const callMultitoolApi = async (tool: string, payload: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/multitool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool, ...payload })
      });
      const data = await response.json();
      setLoading(false);
      if (data.error) {
        triggerNotification(data.error);
        return null;
      }
      return data;
    } catch (e) {
      setLoading(false);
      triggerNotification("Connection failed. Using local simulation.");
      console.error(e);
      return null;
    }
  };

  // Speech Output Helper (Using Web Speech Synthesis)
  const speakText = (text: string) => {
    if (!window.speechSynthesis) {
      triggerNotification("Web speech not supported in your browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[#*`_]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText.substring(0, 200));
    utterance.onstart = () => setVoiceOutputActive(true);
    utterance.onend = () => setVoiceOutputActive(false);
    window.speechSynthesis.speak(utterance);
  };

  // --- FEATURE 1: CHAT SUBMIT ---
  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { id: Date.now().toString(), sender: "user" as const, text: chatInput, timestamp: "Just now" };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");

    const data = await callMultitoolApi("chat", { prompt: chatInput, history: chatMessages });
    if (data && data.text) {
      setChatMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: "coach" as const, text: data.text, timestamp: "Just now" }]);
      if (voiceOutputActive) speakText(data.text);
    }
  };

  // Simulated Voice Input Action
  const toggleVoiceInput = () => {
    if (!voiceActive) {
      setVoiceActive(true);
      triggerNotification("Listening... Say something.");
      setTimeout(() => {
        setChatInput("Create a beautiful modern presentation slide about artificial intelligence.");
        setVoiceActive(false);
        triggerNotification("Speech recognized successfully!");
      }, 3000);
    } else {
      setVoiceActive(false);
    }
  };

  // --- FEATURE 2: IMAGE GENERATOR ---
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setLoading(true);
    // Let's generate a stunning, responsive SVG layout representing the Apple style.
    const cleanPrompt = imagePrompt.trim();
    const query = cleanPrompt.toLowerCase();

    // Dynamically draft premium custom vector design
    let svgGraphic = "";
    if (query.includes("cyber") || query.includes("neon") || query.includes("computer")) {
      svgGraphic = `<svg viewBox="0 0 400 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#09090b;border-radius:24px">
        <defs>
          <radialGradient id="cyberGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#00c8ff" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="120" fill="url(#cyberGlow)"/>
        <circle cx="200" cy="200" r="80" stroke="#00c8ff" stroke-width="2" fill="none" opacity="0.8"/>
        <line x1="100" y1="200" x2="300" y2="200" stroke="#8b5cf6" stroke-width="1" opacity="0.4" stroke-dasharray="4"/>
        <line x1="200" y1="100" x2="200" y2="300" stroke="#8b5cf6" stroke-width="1" opacity="0.4" stroke-dasharray="4"/>
        <text x="200" y="205" fill="#ffffff" font-family="monospace" font-size="11" text-anchor="middle" letter-spacing="4">NEON CORE ONLINE</text>
      </svg>`;
    } else if (query.includes("nature") || query.includes("forest") || query.includes("peace") || query.includes("green")) {
      svgGraphic = `<svg viewBox="0 0 400 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#051610;border-radius:24px">
        <circle cx="200" cy="230" r="130" fill="#10b981" opacity="0.1"/>
        <path d="M200 120 L270 280 L130 280 Z" fill="#10b981" opacity="0.4"/>
        <path d="M200 160 L250 280 L150 280 Z" fill="#34d399" opacity="0.6"/>
        <circle cx="200" cy="90" r="15" fill="#fcd34d" opacity="0.8"/>
        <text x="200" y="340" fill="#a7f3d0" font-family="sans-serif" font-size="12" text-anchor="middle" letter-spacing="2">SERENE NATURE MATRIX</text>
      </svg>`;
    } else {
      // Default modern liquid glass refraction graphic
      svgGraphic = `<svg viewBox="0 0 400 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#0B0B0F;border-radius:24px">
        <defs>
          <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.25"/>
            <stop offset="50%" stop-color="#ec4899" stop-opacity="0.1"/>
            <stop offset="100%" stop-color="#00c8ff" stop-opacity="0.3"/>
          </linearGradient>
        </defs>
        <rect x="50" y="50" width="300" height="300" rx="32" fill="url(#glassGrad)"/>
        <rect x="50" y="50" width="300" height="300" rx="32" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.15"/>
        <circle cx="200" cy="200" r="45" fill="#ffffff" opacity="0.08" stroke="#ffffff" stroke-width="1"/>
        <text x="200" y="320" fill="#e4e4e7" font-family="sans-serif" font-size="10" text-anchor="middle" letter-spacing="3" opacity="0.6">APPLE LIQUID DESIGN v1.0</text>
      </svg>`;
    }

    setTimeout(() => {
      setCustomSvgCode(svgGraphic);
      setGeneratedImageUrl(`data:image/svg+xml;utf8,${encodeURIComponent(svgGraphic)}`);
      setLoading(false);
      triggerNotification("Liquid vector compiled successfully!");
    }, 1500);
  };

  // --- FEATURE 3: CODE GENERATOR ---
  const handleGenerateCode = async () => {
    const data = await callMultitoolApi("code_gen", { prompt: codePrompt });
    if (data && data.text) {
      setCodeOutput(data.text);
    }
  };

  const handleExplainCode = async () => {
    if (!explainCode.trim()) return;
    const data = await callMultitoolApi("code_explain", { code: explainCode });
    if (data && data.text) {
      setExplainOutput(data.text);
    }
  };

  // --- FEATURE 4: ACADEMIC SUITE (SUMMARIZE & PDF CHAT) ---
  const handleSummarize = async () => {
    if (!academicText.trim()) return;
    const data = await callMultitoolApi("summarize", { text: academicText });
    if (data && data.text) {
      setAcademicSummary(data.text);
    }
  };

  const handlePdfUploadSimulation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfName(file.name);
      setPdfMessages([
        { id: "1", sender: "coach", text: `Successfully indexed PDF: **"${file.name}"**. I've extracted its content. Ask me anything about this document!`, timestamp: "Just now" }
      ]);
      triggerNotification(`Uploaded ${file.name}`);
    }
  };

  const handlePdfChatSubmit = async () => {
    if (!pdfInput.trim() || !pdfName) return;
    const studentMsg = { id: Date.now().toString(), sender: "user" as const, text: pdfInput, timestamp: "Just now" };
    setPdfMessages(prev => [...prev, studentMsg]);
    setPdfInput("");

    const data = await callMultitoolApi("pdf_chat", { prompt: pdfInput, text: `Context: PDF Document named ${pdfName}` });
    if (data && data.text) {
      setPdfMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: "coach" as const, text: data.text, timestamp: "Just now" }]);
    }
  };

  // --- FEATURE 5: OCR SCANNED IMAGE ---
  const handleOcrFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setOcrImage(event.target.result as string);
          setOcrScanning(true);
          setOcrText("");
          triggerNotification("Scanning image w/ OCR channels...");
          setTimeout(async () => {
            const data = await callMultitoolApi("ocr", { image: event.target?.result });
            setOcrScanning(false);
            if (data && data.text) {
              setOcrText(data.text);
            } else {
              setOcrText("OCR Extracted text:\n\n✦ STANDARD TERMS AND DESIGN GUIDELINES\n✦ Apple WWDC 2025 Liquid Glass UI Guidelines\n✦ Version 1.0.5\n\nThis specification enforces frosted glass layers (blur 20px) with subtle highlights. Avoid solid dark margins and optimize touch targets on responsive devices.");
            }
          }, 2000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // --- FEATURE 6: NOTES & GRAMMAR ---
  const handleSaveNote = () => {
    if (!noteTitle.trim()) return;
    setNotes(prev => prev.map(n => n.id === activeNoteId ? { ...n, title: noteTitle, content: noteContent, updatedAt: "Just now" } : n));
    triggerNotification("Note synchronized successfully!");
  };

  const handleCreateNote = () => {
    const newId = `note-${Date.now()}`;
    const newNote = { id: newId, title: "Untitled Study Note", content: "", updatedAt: "Just now" };
    setNotes(prev => [...prev, newNote]);
    setActiveNoteId(newId);
  };

  const handleDeleteNote = (id: string) => {
    if (notes.length <= 1) {
      triggerNotification("Must retain at least one study notebook.");
      return;
    }
    setNotes(prev => prev.filter(n => n.id !== id));
    setActiveNoteId(notes[0].id);
    triggerNotification("Note cleared.");
  };

  const handleRefineNoteAI = async () => {
    if (!noteContent.trim()) return;
    const data = await callMultitoolApi("notes_refine", { text: noteContent });
    if (data && data.text) {
      setNoteContent(data.text);
      setNotes(prev => prev.map(n => n.id === activeNoteId ? { ...n, content: data.text } : n));
      triggerNotification("Note beautified by AI!");
    }
  };

  const handleGrammarCheck = async () => {
    if (!grammarText.trim()) return;
    const data = await callMultitoolApi("grammar", { text: grammarText });
    if (data) {
      setGrammarResults(data);
    }
  };

  const handleTranslate = async () => {
    if (!translateText.trim()) return;
    const data = await callMultitoolApi("translate", { text: translateText, options: { language: translateLang } });
    if (data && data.text) {
      setTranslateOutput(data.text);
    }
  };

  // --- FEATURE 7: CAREER HUB ---
  const handleBuildResume = async () => {
    if (!careerPrompt.trim()) return;
    const data = await callMultitoolApi("resume", { prompt: careerPrompt });
    if (data) {
      setResumeData(data);
    }
  };

  const handleWriteEmail = async () => {
    if (!careerPrompt.trim()) return;
    const data = await callMultitoolApi("email", { prompt: careerPrompt, options: { tone: emailTone } });
    if (data && data.text) {
      setEmailOutput(data.text);
    }
  };

  const handleGeneratePresentation = async () => {
    if (!presentationPrompt.trim()) return;
    const data = await callMultitoolApi("presentation", { prompt: presentationPrompt, options: { slideCount: 4 } });
    if (data && data.slides) {
      setPresentationSlides(data.slides);
      setCurrentSlideIndex(0);
    }
  };

  // --- FEATURE 8: STUDY TOOLS ---
  const handleGenerateStudyPlan = async () => {
    if (!studySubject.trim()) return;
    const data = await callMultitoolApi("study", { prompt: studySubject });
    if (data) {
      setStudyCurriculum(data);
    }

    // Simultaneously fetch flashcards, quiz, and mindmap
    const fcData = await callMultitoolApi("flashcard", { prompt: studySubject });
    if (fcData && fcData.cards) setFlashcards(fcData.cards);

    const quizData = await callMultitoolApi("quiz", { prompt: studySubject });
    if (quizData && quizData.quiz) setQuizQuestions(quizData.quiz);

    const mindData = await callMultitoolApi("mindmap", { prompt: studySubject });
    if (mindData && mindData.nodes) setMindNodes(mindData.nodes);
  };

  // Quiz interactive grading
  const handleSelectQuizOption = (index: number) => {
    if (quizScored) return;
    setSelectedQuizOption(index);
  };

  const handleQuizNext = () => {
    if (selectedQuizOption === quizQuestions[currentQuizIndex].answerIndex) {
      setQuizScore(prev => prev + 1);
    }
    setSelectedQuizOption(null);
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      setQuizScored(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedQuizOption(null);
    setQuizScored(false);
    setQuizScore(0);
  };

  // Mind map dynamic node coordination dragging
  const handleMindNodeClick = (id: string) => {
    setSelectedMindNode(id);
    const node = mindNodes.find(n => n.id === id);
    if (node) {
      triggerNotification(`Active conceptual node: "${node.label}"`);
    }
  };

  // --- FEATURE 9: SIMULATED AUTH DEMO ---
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim()) {
      triggerNotification("Email and password fields are required.");
      return;
    }
    setAuthStep("otp");
    triggerNotification("OTP security code triggered. Check your email.");
  };

  const handleOtpInput = (val: string, idx: number) => {
    const updated = [...authOtp];
    updated[idx] = val.slice(-1);
    setAuthOtp(updated);

    // Auto focus next box
    if (val && idx < 3) {
      const nextBox = document.getElementById(`otp-${idx + 1}`);
      nextBox?.focus();
    }

    // If fully filled, trigger login success sequence
    if (updated.every(v => v !== "")) {
      setTimeout(() => {
        setAuthStep("success");
        triggerNotification("OTP authentication verified successfully!");
      }, 800);
    }
  };

  return (
    <div className={`flex flex-col lg:flex-row min-h-[80vh] rounded-3xl border border-zinc-900 bg-[#07070a] text-zinc-300 relative overflow-hidden shadow-2xl ${lightMode ? "bg-zinc-50 text-zinc-800 border-zinc-200" : ""}`} ref={containerRef}>
      
      {/* Toast Notification Assembly */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full border shadow-2xl z-50 flex items-center gap-2.5 backdrop-blur-xl text-xs font-semibold ${
              lightMode ? "bg-white/95 border-zinc-200 text-zinc-900" : "bg-zinc-950/95 border-zinc-800 text-white"
            }`}
          >
            <Sparkle className="h-4.5 w-4.5 text-blue-500 animate-pulse" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIDEBAR NAVIGATION: Cupertino Premium Minimal Drawer */}
      <aside className={`w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-zinc-900/60 p-6 flex flex-col justify-between gap-6 relative z-10 ${lightMode ? "border-zinc-200/60 bg-zinc-100/50" : "bg-black/20"}`}>
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-900/40 pb-4">
            <div className="flex items-center gap-2.5">
              <span className={`h-2.5 w-2.5 rounded-full animate-pulse ${getGlowBgClasses()}`} />
              <span className="font-display font-medium text-xs tracking-widest text-white uppercase select-none">AI STUDIO SUITE</span>
            </div>
            <span className="px-1.5 py-0.5 bg-zinc-900/80 rounded-sm font-mono text-[9px] text-zinc-500 font-bold border border-zinc-800">WWDC25</span>
          </div>

          <nav className="space-y-1">
            {[
              { id: "DASHBOARD", label: "Dashboard Hub", icon: Compass },
              { id: "CHAT", label: "AI Chat Room", icon: MessageSquare, badge: "Free" },
              { id: "IMAGE_GEN", label: "Image Studio", icon: ImageIcon },
              { id: "CODE", label: "Code Laboratory", icon: Code },
              { id: "ACADEMIC", label: "PDF & Academic", icon: BookOpen },
              { id: "OCR", label: "OCR Text Scan", icon: Cpu },
              { id: "NOTES", label: "Notebook & Translate", icon: PenTool },
              { id: "CAREER", label: "Resume & slide", icon: FileText },
              { id: "STUDY_TOOLS", label: "Quiz & mindmap", icon: GraduationCap },
              { id: "SETTINGS", label: "Studio Glass Tokens", icon: Settings },
              { id: "AUTH_DEMO", label: "Gateway Login", icon: Lock }
            ].map((navItem) => {
              const Icon = navItem.icon;
              const isActive = activeSubTab === navItem.id;
              return (
                <button
                  key={navItem.id}
                  onClick={() => {
                    setActiveSubTab(navItem.id as MultitoolTab);
                    setSearchQuery("");
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs transition-all relative group cursor-pointer ${
                    isActive
                      ? lightMode ? "bg-blue-600 text-white font-medium shadow-md" : "bg-white/5 border border-white/5 text-white font-medium"
                      : lightMode ? "text-zinc-600 hover:bg-zinc-200/50" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3 relative z-10">
                    <Icon className={`h-4.5 w-4.5 ${isActive ? getGlowTextClasses() : "text-zinc-500 group-hover:text-zinc-300"}`} />
                    <span className="font-sans font-medium tracking-wide">{navItem.label}</span>
                  </div>
                  {navItem.badge && (
                    <span className="relative z-10 px-1.5 py-0.5 bg-blue-900/30 text-blue-400 text-[8px] uppercase font-bold rounded">
                      {navItem.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footprint credit indicator */}
        <div className="border-t border-zinc-900/40 pt-4 font-mono text-[9px] text-zinc-650 flex flex-col gap-1 select-none">
          <span>COGNITIVE FLOW: SECURE</span>
          <span className="text-[8px] opacity-60">OPTIMIZED FOR STUDENTS & PROS</span>
        </div>
      </aside>

      {/* CORE ACTIVE VIEWPORT PANEL */}
      <main className="flex-1 p-6 md:p-8 flex flex-col justify-between relative z-10">
        
        {/* Loading overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#07070a]/70 backdrop-blur-md z-40 flex flex-col items-center justify-center space-y-4"
            >
              <div className="h-7 w-7 rounded-lg border border-blue-500/25 animate-spin flex items-center justify-center">
                <span className="text-blue-400">✦</span>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">Compiling Cognitive Matrix...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* VIEW TAB 0: GENERAL DASHBOARD OVERVIEW */}
        {activeSubTab === "DASHBOARD" && (
          <div className="space-y-6 text-left">
            <div className="space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-blue-400 font-bold">EXECUTIVE WORKSPACE</span>
              <h1 className="text-2xl font-display font-medium text-white tracking-tight">Liquid Glass Studio Overview</h1>
              <p className="text-xs text-zinc-500 max-w-2xl">A futuristic playground compiling 17 high-capacity student and professional toolkits, styled under the premium WWDC 2025 guidelines.</p>
            </div>

            {/* Premium Widgets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 relative overflow-hidden group hover:border-zinc-800 transition">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-2xl rounded-full" />
                <MessageSquare className="h-6 w-6 text-blue-400 mb-4" />
                <h3 className="text-sm font-semibold text-white mb-1">AI Chat Companion</h3>
                <p className="text-xs text-zinc-500 mb-4 leading-relaxed">Chat with a free optimized Gemini model. Built-in templates, streaming interactions, and formatting parameters.</p>
                <button onClick={() => setActiveSubTab("CHAT")} className="text-blue-400 hover:text-blue-300 text-xs font-mono font-semibold flex items-center gap-1 cursor-pointer">
                  <span>Enter Room</span> <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 relative overflow-hidden group hover:border-zinc-800 transition">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-2xl rounded-full" />
                <GraduationCap className="h-6 w-6 text-purple-400 mb-4" />
                <h3 className="text-sm font-semibold text-white mb-1">Study Companion</h3>
                <p className="text-xs text-zinc-500 mb-4 leading-relaxed">Generate personalized syllabus curriculums, interactive flipping flashcards, mind maps, and MCQ quizzes.</p>
                <button onClick={() => setActiveSubTab("STUDY_TOOLS")} className="text-purple-400 hover:text-purple-300 text-xs font-mono font-semibold flex items-center gap-1 cursor-pointer">
                  <span>Open Toolkit</span> <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 relative overflow-hidden group hover:border-zinc-800 transition">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-2xl rounded-full" />
                <PenTool className="h-6 w-6 text-cyan-400 mb-4" />
                <h3 className="text-sm font-semibold text-white mb-1">Notebook & OCR</h3>
                <p className="text-xs text-zinc-500 mb-4 leading-relaxed">Draft persistent academic diaries, translate in 5 languages, scan scanned images to extract clean text.</p>
                <button onClick={() => setActiveSubTab("NOTES")} className="text-cyan-400 hover:text-cyan-300 text-xs font-mono font-semibold flex items-center gap-1 cursor-pointer">
                  <span>View Notes</span> <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>

            {/* Quick status bar */}
            <div className="bg-zinc-950/60 border border-zinc-900/60 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-[10px] uppercase text-zinc-400">COGNITIVE SYSTEMS: ONLINE</span>
              </div>
              <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-mono">
                <span>API CHANNEL: SECURED (GEMINI)</span>
                <span>SPEED: 180 TOKENS/SEC</span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW TAB 1: AI CHAT ASSISTANT */}
        {activeSubTab === "CHAT" && (
          <div className="flex flex-col h-full min-h-[550px] justify-between gap-4 text-left">
            <div className="space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-blue-400 font-bold">COMPANION BOT</span>
              <h2 className="text-xl font-display font-medium text-white tracking-tight">AI Chat Assistant</h2>
              <p className="text-xs text-zinc-500">Powered by the optimized Gemini model for clean coding and educational Q&A.</p>
            </div>

            {/* Chat Messages Frame */}
            <div className="flex-1 overflow-y-auto max-h-[350px] space-y-4 border border-zinc-900 bg-zinc-950/40 p-5 rounded-2xl shadow-inner scrollbar-thin">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 max-w-xl ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center border text-xs shrink-0 ${
                    msg.sender === "user" ? "bg-blue-600 border-blue-500 text-white" : "bg-zinc-900 border-zinc-800 text-zinc-300"
                  }`}>
                    {msg.sender === "user" ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.sender === "user" ? "bg-blue-900/20 border border-blue-900/40 text-white" : "bg-zinc-900/40 border border-zinc-900/60 text-zinc-300"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input and Controls */}
            <div className="space-y-2">
              <div className="flex gap-2.5">
                <div className="flex-1 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 focus-within:border-blue-500/50 rounded-xl px-4 py-2 flex items-center gap-2.5 transition">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleChatSubmit()}
                    placeholder="Ask about equations, coding bugs, history reviews..."
                    className="flex-1 bg-transparent text-xs text-white outline-none border-none py-1.5 focus:ring-0"
                  />
                  
                  {/* Sound Wave indicator */}
                  {voiceActive && (
                    <div className="flex gap-0.5 items-end h-3 w-5">
                      <span className="w-0.5 h-1.5 bg-blue-500 animate-bounce" />
                      <span className="w-0.5 h-3 bg-blue-400 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-0.5 h-2 bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  )}

                  <button onClick={toggleVoiceInput} className="p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-white transition cursor-pointer" title="Voice input">
                    <Mic className="h-4 w-4" />
                  </button>
                </div>

                <button onClick={handleChatSubmit} className="px-5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-[10px] uppercase tracking-wider font-bold rounded-xl transition cursor-pointer flex items-center gap-2">
                  <span>Send</span>
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* TTS Switcher */}
              <div className="flex items-center gap-2 pl-1 select-none">
                <button
                  onClick={() => {
                    setVoiceOutputActive(!voiceOutputActive);
                    triggerNotification(voiceOutputActive ? "Voice output deactivated" : "Voice output activated!");
                  }}
                  className={`p-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition cursor-pointer ${
                    voiceOutputActive ? "bg-blue-900/20 border-blue-500/30 text-blue-400" : "bg-transparent border-zinc-900 text-zinc-500 hover:text-zinc-400"
                  }`}
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  <span className="text-[9px] uppercase font-mono tracking-wider font-bold">Voice Output {voiceOutputActive ? "ON" : "OFF"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW TAB 2: IMAGE GENERATOR */}
        {activeSubTab === "IMAGE_GEN" && (
          <div className="space-y-6 text-left">
            <div className="space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-blue-400 font-bold">CREATIVE TOOL</span>
              <h2 className="text-xl font-display font-medium text-white tracking-tight">Image Studio</h2>
              <p className="text-xs text-zinc-500">Draft high-fidelity abstract vector designs and compile custom SVGs directly inside the cockpit.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Vector Design Prompt</label>
                  <textarea
                    rows={4}
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="Describe vector layouts (e.g., Cyberpunk circle matrix, Serene nature mountain)..."
                    className="w-full bg-zinc-950 border border-zinc-900 rounded-xl p-4 text-xs text-white placeholder-zinc-600 outline-none focus:border-zinc-800 transition leading-relaxed resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Design Theme Style</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Apple Minimalist", "Neon Cyberpunk", "Cosmic Oracle", "Forest Oasis"].map((style) => (
                      <button
                        key={style}
                        onClick={() => setImageStyle(style)}
                        className={`py-2 px-3.5 rounded-xl border text-xs text-center transition cursor-pointer font-medium ${
                          imageStyle === style
                            ? "bg-blue-900/10 border-blue-500/40 text-blue-400"
                            : "bg-zinc-950 border-zinc-900 text-zinc-400 hover:bg-zinc-900"
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={handleGenerateImage} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  <span>Generate Vector Image</span>
                </button>
              </div>

              <div className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-5 flex flex-col justify-between min-h-[280px]">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5">
                  <span className="font-mono text-[9px] text-[#00c8ff] uppercase tracking-widest font-bold">STUDIO PREVIEW CANVAS</span>
                  {customSvgCode && (
                    <button onClick={() => copyToClipboard(customSvgCode)} className="p-1 hover:bg-zinc-900 rounded text-zinc-400 hover:text-white transition cursor-pointer" title="Copy raw SVG code">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex-1 flex items-center justify-center p-4">
                  {generatedImageUrl ? (
                    <div className="w-48 h-48 rounded-xl overflow-hidden shadow-2xl relative group">
                      <img src={generatedImageUrl} alt="Compiled Design" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                        <button onClick={() => {
                          const blob = new Blob([customSvgCode], { type: "image/svg+xml" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = "liquid_glass_design.svg";
                          a.click();
                        }} className="px-3 py-1.5 bg-blue-600 text-white text-[9px] uppercase font-mono tracking-wider font-bold rounded-lg hover:scale-105 active:scale-95 transition">
                          Download SVG
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center font-mono text-[10px] text-zinc-600 space-y-2 select-none">
                      <div className="h-10 w-10 mx-auto rounded bg-zinc-900 border border-zinc-850/50 flex items-center justify-center animate-pulse">
                        <Sparkle className="h-5 w-5 text-zinc-650" />
                      </div>
                      <p>COMPILER DISPATCH READY</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW TAB 3: CODE LABORATORY */}
        {activeSubTab === "CODE" && (
          <div className="space-y-6 text-left">
            <div className="space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-blue-400 font-bold">SOFTWARE LAB</span>
              <h2 className="text-xl font-display font-medium text-white tracking-tight">Code Laboratory</h2>
              <p className="text-xs text-zinc-500">Formulate high-efficiency scripts or paste complex snippets to receive detailed structural refactoring summaries.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="space-y-4">
                <div className="space-y-2 border-b border-zinc-900 pb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Generate Code Requirements</label>
                    <select
                      value={codeLanguage}
                      onChange={(e) => setCodeLanguage(e.target.value)}
                      className="bg-zinc-950 border border-zinc-900 rounded-lg text-[9px] text-zinc-400 font-mono px-2 py-1 outline-none"
                    >
                      <option value="typescript">TypeScript</option>
                      <option value="python">Python</option>
                      <option value="html">HTML / CSS</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    value={codePrompt}
                    onChange={(e) => setCodePrompt(e.target.value)}
                    placeholder="Enter specs e.g., Create a bubble sort function with benchmarks..."
                    className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 text-xs text-white focus:border-zinc-800 outline-none transition"
                  />
                  <button onClick={handleGenerateCode} className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-200 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border border-zinc-800 transition cursor-pointer">
                    Generate Code
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Explain Raw Snippet</label>
                  <textarea
                    rows={4}
                    value={explainCode}
                    onChange={(e) => setExplainCode(e.target.value)}
                    placeholder="Paste script code blocks here to trigger professional educational reviews..."
                    className="w-full bg-zinc-950 border border-zinc-900 rounded-xl p-4 text-xs text-white placeholder-zinc-650 outline-none focus:border-zinc-800 transition leading-relaxed resize-none font-mono"
                  />
                  <button onClick={handleExplainCode} className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition cursor-pointer">
                    Explain Code Snippet
                  </button>
                </div>
              </div>

              {/* Code output window */}
              <div className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-5 flex flex-col justify-between min-h-[380px]">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5 mb-4">
                  <span className="font-mono text-[9px] text-[#00c8ff] uppercase tracking-widest font-bold">CONSOLE MONITOR</span>
                  {(codeOutput || explainOutput) && (
                    <button onClick={() => copyToClipboard(codeOutput || explainOutput)} className="p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-white transition cursor-pointer" title="Copy output">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto font-mono text-[11px] text-zinc-350 leading-relaxed max-h-[320px] whitespace-pre-wrap select-text text-left">
                  {codeOutput ? (
                    <div className="space-y-2">
                      <span className="px-1.5 py-0.5 bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 rounded text-[9px] font-bold">COMPILE_SUCCESS</span>
                      <pre className="p-3 bg-black/40 rounded-xl border border-zinc-900/40 overflow-x-auto">{codeOutput}</pre>
                    </div>
                  ) : explainOutput ? (
                    <div className="space-y-2 text-zinc-400 prose prose-invert max-w-none text-xs leading-relaxed">
                      <span className="px-1.5 py-0.5 bg-blue-950/40 text-blue-400 border border-blue-900/30 rounded text-[9px] font-bold">AI_EXPLAINER</span>
                      <div className="p-3 bg-black/40 rounded-xl border border-zinc-900/40 overflow-x-auto whitespace-pre-wrap">{explainOutput}</div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-2 select-none pt-12">
                      <Terminal className="h-6 w-6 text-zinc-700 animate-pulse" />
                      <span>LOGS CLEAR. INITIATE AN ACTION.</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW TAB 4: PDF & ACADEMIC */}
        {activeSubTab === "ACADEMIC" && (
          <div className="space-y-6 text-left">
            <div className="space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-blue-400 font-bold">ACADEMIC HUB</span>
              <h2 className="text-xl font-display font-medium text-white tracking-tight">Academic Companion</h2>
              <p className="text-xs text-zinc-500">Paste study readings to generate dense bullet outlines, or drop simulated academic files to query sections directly.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Paste Study Reading Materials</label>
                  <textarea
                    rows={6}
                    value={academicText}
                    onChange={(e) => setAcademicText(e.target.value)}
                    placeholder="Paste academic reviews, history chapters, or scientific papers..."
                    className="w-full bg-zinc-950 border border-zinc-900 rounded-xl p-4 text-xs text-white placeholder-zinc-650 outline-none focus:border-zinc-800 transition leading-relaxed resize-none"
                  />
                  <button onClick={handleSummarize} className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition cursor-pointer">
                    Compile Bullet Outline
                  </button>
                </div>

                {/* PDF Upload Segment */}
                <div className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                    <span className="font-mono text-[9px] text-[#00c8ff] uppercase tracking-widest font-bold">PDF INDEXER CHANNELS</span>
                  </div>

                  <div className="border border-dashed border-zinc-800 rounded-xl p-6 text-center hover:bg-zinc-900/10 transition relative group">
                    <input
                      type="file"
                      accept=".pdf,.txt"
                      onChange={handlePdfUploadSimulation}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="h-6 w-6 text-zinc-500 mx-auto mb-2.5 group-hover:text-zinc-350 transition" />
                    <span className="text-[10px] block text-zinc-400 font-medium font-sans">
                      {pdfName ? `Active Index: ${pdfName}` : "Drag & Drop Academic PDF or click to browse"}
                    </span>
                    <span className="text-[8px] text-zinc-600 block font-mono mt-1">SUPPORTED FORMATS: PDF, TXT (MAX 10MB)</span>
                  </div>
                </div>
              </div>

              {/* Outputs box */}
              <div className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-5 flex flex-col justify-between min-h-[380px]">
                {pdfName ? (
                  // PDF chat viewport
                  <div className="flex flex-col h-full justify-between gap-4">
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5 mb-2">
                      <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest font-bold">CHAT: {pdfName}</span>
                      <button onClick={() => setPdfName(null)} className="text-[8px] font-mono uppercase bg-red-950/40 text-red-400 px-1.5 py-0.5 rounded border border-red-900/30">Clear</button>
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[220px] space-y-3 p-3 bg-black/20 rounded-xl scrollbar-thin">
                      {pdfMessages.map((msg) => (
                        <div key={msg.id} className={`flex gap-2 max-w-sm ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}>
                          <div className={`p-3 rounded-xl text-[11px] leading-normal ${
                            msg.sender === "user" ? "bg-blue-900/10 border border-blue-900/30 text-white" : "bg-zinc-900/30 border border-zinc-900/40 text-zinc-300"
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={pdfInput}
                        onChange={(e) => setPdfInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handlePdfChatSubmit()}
                        placeholder="Query chapters or definitions in PDF..."
                        className="flex-1 bg-zinc-950 border border-zinc-900 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-zinc-800 transition"
                      />
                      <button onClick={handlePdfChatSubmit} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] uppercase font-mono tracking-wider font-bold transition cursor-pointer">
                        Ask
                      </button>
                    </div>
                  </div>
                ) : (
                  // Academic summary text outline
                  <div className="flex flex-col h-full justify-between">
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5 mb-2">
                      <span className="font-mono text-[9px] text-[#00c8ff] uppercase tracking-widest font-bold">STUDY BRIEF OUTLINES</span>
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[300px] text-left text-xs text-zinc-350 leading-relaxed whitespace-pre-wrap select-text p-3 bg-black/10 rounded-xl">
                      {academicSummary ? (
                        <div className="p-1 bg-black/40 rounded-lg border border-zinc-900/40">{academicSummary}</div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-650 space-y-2 pt-16 select-none">
                          <BookOpen className="h-6 w-6 text-zinc-700 animate-pulse" />
                          <span>PASTE OR INDEX FILES TO REVIEWS CORE DEFINITIONS.</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* VIEW TAB 5: OCR SCANNED TEXT SCAN */}
        {activeSubTab === "OCR" && (
          <div className="space-y-6 text-left">
            <div className="space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-blue-400 font-bold">COMPUTER VISION</span>
              <h2 className="text-xl font-display font-medium text-white tracking-tight">OCR Text Scans</h2>
              <p className="text-xs text-zinc-500">Transcribe scanned textbook screenshots or document snippets into raw searchable copyable paragraphs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-4">
                <div className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-6 text-center hover:bg-zinc-900/10 transition relative group border-dashed">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleOcrFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="h-7 w-7 text-zinc-500 mx-auto mb-3.5 group-hover:text-zinc-350 transition animate-bounce" />
                  <span className="text-xs block text-zinc-400 font-medium">
                    {ocrImage ? "Image indexed! Rewriting text..." : "Drag & Drop or click to upload scanned screenshot image"}
                  </span>
                  <span className="text-[9px] text-zinc-600 block font-mono mt-1.5 uppercase">IMAGE COMPILER: PNG, JPG (MAX 5MB)</span>
                </div>

                {ocrImage && (
                  <div className="rounded-2xl border border-zinc-900 overflow-hidden h-44 bg-zinc-950 flex items-center justify-center p-4">
                    <img src={ocrImage} alt="OCR Scanned Thumbnail" className="h-full object-contain rounded-lg shadow-lg" referrerPolicy="no-referrer" />
                  </div>
                )}
              </div>

              {/* OCR transcription outputs */}
              <div className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-5 flex flex-col justify-between min-h-[300px]">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5 mb-4">
                  <span className="font-mono text-[9px] text-[#00c8ff] uppercase tracking-widest font-bold">TRANSCRIPTION FEED</span>
                  {ocrText && (
                    <button onClick={() => copyToClipboard(ocrText)} className="p-1 hover:bg-zinc-900 rounded text-zinc-400 hover:text-white transition cursor-pointer" title="Copy raw text">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto text-left text-xs font-mono text-zinc-400 leading-relaxed whitespace-pre-wrap select-text p-3 bg-black/10 rounded-xl">
                  {ocrScanning ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-2 pt-12">
                      <RefreshCw className="h-5 w-5 text-blue-400 animate-spin" />
                      <span className="text-[9px] text-zinc-550">EXTRACTING CHARACTER CODES...</span>
                    </div>
                  ) : ocrText ? (
                    <div className="p-1 bg-black/40 rounded border border-zinc-900/40">{ocrText}</div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-650 space-y-2 pt-16 select-none">
                      <Cpu className="h-6 w-6 text-zinc-700 animate-pulse" />
                      <span>NO RUNTIME TEXT DETECTED. INITIATE AN UPLOAD SCREENSHOTS.</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW TAB 6: STUDY NOTEBOOK & TRANSLATOR */}
        {activeSubTab === "NOTES" && (
          <div className="space-y-6 text-left">
            <div className="space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-blue-400 font-bold">KNOWLEDGE ARCHIVES</span>
              <h2 className="text-xl font-display font-medium text-white tracking-tight">Notebook & Translator</h2>
              <p className="text-xs text-zinc-500">Draft rich academic study notebook portfolios, translate text in 5 major languages with natural semantic preserves.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Notebook directory */}
              <div className="lg:col-span-4 bg-zinc-950/60 border border-zinc-900 rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                  <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-bold">STUDY LISTS</span>
                  <button onClick={handleCreateNote} className="p-1 bg-zinc-900 hover:bg-zinc-800 rounded border border-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer" title="New Note">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="space-y-1.5 max-h-[180px] overflow-y-auto scrollbar-thin">
                  {notes.map(note => (
                    <div key={note.id} className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition cursor-pointer group ${
                      activeNoteId === note.id ? "bg-white/5 border-white/5 text-white" : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-350"
                    }`} onClick={() => setActiveNoteId(note.id)}>
                      <div className="flex flex-col gap-0.5 max-w-[120px] truncate">
                        <span className="font-medium truncate">{note.title || "Untitled Note"}</span>
                        <span className="text-[8px] text-zinc-600 font-mono">{note.updatedAt}</span>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }} className="p-1 hover:bg-zinc-900 rounded text-zinc-550 hover:text-red-400 opacity-0 group-hover:opacity-100 transition">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Note Editor */}
              <div className="lg:col-span-8 space-y-3.5 bg-zinc-950/60 border border-zinc-900 rounded-2xl p-5">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5">
                  <span className="font-mono text-[9px] text-[#00c8ff] uppercase tracking-widest font-bold">NOTEBOOK EDIT CHANNELS</span>
                  <div className="flex gap-2">
                    <button onClick={handleRefineNoteAI} className="px-2.5 py-1 bg-blue-950/40 hover:bg-blue-900/20 text-blue-400 border border-blue-900/30 rounded-lg text-[9px] font-mono tracking-wider uppercase font-bold transition flex items-center gap-1 cursor-pointer">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Refine with AI</span>
                    </button>
                    <button onClick={handleSaveNote} className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-[9px] font-mono tracking-wider uppercase font-bold transition cursor-pointer">
                      Save
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="Note Title..."
                    className="w-full bg-transparent text-sm font-semibold text-white outline-none border-b border-zinc-900 pb-1"
                  />
                  <textarea
                    rows={4}
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Draft study points here..."
                    className="w-full bg-transparent text-xs text-zinc-350 outline-none resize-none font-sans leading-relaxed"
                  />
                </div>
              </div>

            </div>

            {/* Deep Translator Segment */}
            <div className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col md:flex-row items-center justify-between border-b border-zinc-900 pb-2.5 gap-2.5">
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-bold">POLYGLOT TRANSLATION CORE</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-600 font-mono">TARGET:</span>
                  <select
                    value={translateLang}
                    onChange={(e) => setTranslateLang(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg text-[9px] text-zinc-300 font-mono px-2 py-1 outline-none"
                  >
                    <option value="Spanish">Spanish (Español)</option>
                    <option value="French">French (Français)</option>
                    <option value="German">German (Deutsch)</option>
                    <option value="Japanese">Japanese (日本語)</option>
                    <option value="Mandarin">Mandarin (中文)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <textarea
                  rows={3}
                  value={translateText}
                  onChange={(e) => setTranslateText(e.target.value)}
                  placeholder="Enter text to translate..."
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-xl p-3 text-xs text-white placeholder-zinc-650 outline-none focus:border-zinc-800 transition leading-relaxed resize-none font-sans"
                />
                
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-3 text-xs text-zinc-300 leading-relaxed text-left min-h-[80px] relative select-text font-sans">
                  {translateOutput ? (
                    <div className="space-y-1.5">
                      <p>{translateOutput}</p>
                      <button onClick={() => speakText(translateOutput)} className="absolute bottom-2.5 right-2.5 p-1 hover:bg-zinc-900 rounded text-zinc-500 hover:text-white transition" title="Speak translation">
                        <Volume2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-zinc-600 font-mono text-[10px] select-none">TRANSLATION WILL RENDER HERE...</span>
                  )}
                </div>
              </div>

              <button onClick={handleTranslate} className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition cursor-pointer">
                Translate Text
              </button>
            </div>

          </div>
        )}

        {/* VIEW TAB 7: RESUME, EMAIL, SLIDE */}
        {activeSubTab === "CAREER" && (
          <div className="space-y-6 text-left">
            <div className="space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-blue-400 font-bold">CAREER ROAD</span>
              <h2 className="text-xl font-display font-medium text-white tracking-tight">Career Hub</h2>
              <p className="text-xs text-zinc-500">Draft professional resume profiles, generate precise business emails, or build interactive presentation guides.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Enter Target Job / email Topic</label>
                <input
                  type="text"
                  value={careerPrompt}
                  onChange={(e) => setCareerPrompt(e.target.value)}
                  placeholder="e.g., Software Architect Stanford CS, email explaining dashboard optimization..."
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 text-xs text-white focus:border-zinc-800 outline-none transition"
                />
              </div>

              <div className="flex flex-wrap gap-2.5">
                <button onClick={handleBuildResume} className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border border-zinc-800 hover:border-zinc-700 rounded-xl text-[10px] font-mono tracking-wider font-semibold uppercase transition cursor-pointer flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-zinc-400" />
                  <span>Build Resume</span>
                </button>
                <button onClick={handleWriteEmail} className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border border-zinc-800 hover:border-zinc-700 rounded-xl text-[10px] font-mono tracking-wider font-semibold uppercase transition cursor-pointer flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-zinc-400" />
                  <span>Draft business email</span>
                </button>
                <button onClick={() => { setPresentationPrompt(careerPrompt); handleGeneratePresentation(); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-mono tracking-wider font-semibold uppercase transition cursor-pointer flex items-center gap-1.5">
                  <Presentation className="h-4 w-4 text-white" />
                  <span>Generate slide deck</span>
                </button>
              </div>
            </div>

            {/* Resume & email output panel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
              
              <div className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-5 min-h-[250px]">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5 mb-4">
                  <span className="font-mono text-[9px] text-[#00c8ff] uppercase tracking-widest font-bold">PROFESSIONAL DOSSIER</span>
                </div>

                {resumeData ? (
                  <div className="space-y-4 text-xs select-text text-left text-zinc-350">
                    <div className="border-b border-zinc-900 pb-3">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">{resumeData.name}</h3>
                      <p className="text-[10px] text-blue-400 font-mono tracking-wide">{resumeData.title}</p>
                      <p className="text-[11px] text-zinc-500 mt-2 italic font-sans leading-relaxed">{resumeData.summary}</p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-mono text-[9px] uppercase font-bold text-zinc-500">EXPERIENCE RECORD</h4>
                      {resumeData.experience?.map((exp: any, i: number) => (
                        <div key={i} className="space-y-1 pl-2 border-l border-zinc-850">
                          <div className="flex items-center justify-between font-mono text-[10px]">
                            <span className="text-white font-semibold">{exp.role}</span>
                            <span className="text-zinc-500">{exp.duration}</span>
                          </div>
                          <p className="text-[10px] text-zinc-400 font-medium">{exp.company}</p>
                          <ul className="list-disc pl-4 space-y-0.5 text-zinc-500 text-[10px]">
                            {exp.bullets?.map((b: string, j: number) => <li key={j}>{b}</li>)}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : emailOutput ? (
                  <div className="space-y-3 text-xs leading-relaxed text-zinc-400 text-left whitespace-pre-wrap select-text p-3 bg-black/40 rounded-xl border border-zinc-900/40 relative">
                    <div className="font-mono text-[9px] uppercase text-zinc-500 font-bold border-b border-zinc-900 pb-1.5 mb-2">EMAIL COPY</div>
                    <p className="font-sans text-zinc-300 leading-relaxed">{emailOutput}</p>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-650 space-y-2 pt-12 select-none">
                    <User className="h-6 w-6 text-zinc-700 animate-pulse" />
                    <span>TRIGGER AN ACTION TO LOAD PROFESSIONAL DATA.</span>
                  </div>
                )}
              </div>

              {/* Slide Presentation view */}
              <div className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-5 flex flex-col justify-between min-h-[250px]">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5 mb-4">
                  <span className="font-mono text-[9px] text-[#00c8ff] uppercase tracking-widest font-bold">SLIDE PRESENTATION DECK</span>
                </div>

                {presentationSlides.length > 0 ? (
                  <div className="flex-1 flex flex-col justify-between h-full">
                    {/* Active slide card with glass glow depending on visualType */}
                    <div className="p-5 rounded-2xl bg-[#0a0a0d] border border-zinc-900/60 min-h-[160px] text-left relative overflow-hidden shadow-xl">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl pointer-events-none" />
                      <div className="space-y-2 relative z-10">
                        <span className="font-mono text-[8px] uppercase tracking-widest text-zinc-500">SLIDE {presentationSlides[currentSlideIndex].slideNumber} / {presentationSlides.length}</span>
                        <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide">{presentationSlides[currentSlideIndex].title}</h3>
                        <ul className="list-disc pl-4 space-y-1.5 text-zinc-400 text-[10px] sm:text-xs">
                          {presentationSlides[currentSlideIndex].bullets?.map((b, i) => <li key={i}>{b}</li>)}
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <span className="text-[10px] font-mono text-zinc-600 font-medium">VISUAL: {presentationSlides[currentSlideIndex].visualType?.toUpperCase() || "AURORA"}</span>
                      <div className="flex gap-1.5">
                        <button
                          disabled={currentSlideIndex === 0}
                          onClick={() => setCurrentSlideIndex(prev => prev - 1)}
                          className="px-2.5 py-1 bg-zinc-900 disabled:opacity-40 rounded text-[9px] font-mono tracking-wider font-bold uppercase transition"
                        >
                          Prev
                        </button>
                        <button
                          disabled={currentSlideIndex === presentationSlides.length - 1}
                          onClick={() => setCurrentSlideIndex(prev => prev + 1)}
                          className="px-2.5 py-1 bg-blue-600 text-white disabled:opacity-40 rounded text-[9px] font-mono tracking-wider font-bold uppercase transition"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-650 space-y-2 pt-12 select-none">
                    <Presentation className="h-6 w-6 text-zinc-700 animate-pulse" />
                    <span>NO PRESENTATION SLIDES COMPILED.</span>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* VIEW TAB 8: QUIZ, FLASHCARDS, MINDMAPS */}
        {activeSubTab === "STUDY_TOOLS" && (
          <div className="space-y-6 text-left">
            <div className="space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-blue-400 font-bold">KNOWLEDGE ACCELERATORS</span>
              <h2 className="text-xl font-display font-medium text-white tracking-tight">Academic study Tools</h2>
              <p className="text-xs text-zinc-500">Generate randomized exam sets, flip interactive flashcards, or inspect visual nodes mapping concepts.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Course / Subject of Focus</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={studySubject}
                    onChange={(e) => setStudySubject(e.target.value)}
                    placeholder="e.g., Quantum Mechanics, US Civil War, Spanish Grammar basics..."
                    className="flex-1 bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 text-xs text-white focus:border-zinc-800 outline-none transition"
                  />
                  <button onClick={handleGenerateStudyPlan} className="px-5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-[10px] font-bold uppercase tracking-widest rounded-xl transition cursor-pointer">
                    Generate Study Suite
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
              
              {/* QUIZ WIDGET */}
              <div className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-5 min-h-[300px] flex flex-col justify-between">
                <div className="border-b border-zinc-900 pb-2.5 mb-3 flex items-center justify-between">
                  <span className="font-mono text-[9px] text-[#00c8ff] uppercase tracking-widest font-bold">EXAM MCQS</span>
                </div>

                {quizQuestions.length > 0 ? (
                  <div className="flex-1 flex flex-col justify-between">
                    {!quizScored ? (
                      <div className="space-y-3">
                        <span className="font-mono text-[8px] text-zinc-500">QUESTION {currentQuizIndex + 1} / {quizQuestions.length}</span>
                        <h4 className="text-[11px] sm:text-xs font-semibold text-white tracking-wide leading-relaxed">{quizQuestions[currentQuizIndex].question}</h4>
                        
                        <div className="space-y-1.5">
                          {quizQuestions[currentQuizIndex].options?.map((opt, i) => {
                            const isSelected = selectedQuizOption === i;
                            return (
                              <button
                                key={i}
                                onClick={() => handleSelectQuizOption(i)}
                                className={`w-full text-left p-2.5 rounded-lg text-[10px] sm:text-xs transition border cursor-pointer ${
                                  isSelected
                                    ? "bg-blue-900/10 border-blue-500/40 text-blue-400"
                                    : "bg-black/20 border-zinc-900 text-zinc-400 hover:bg-zinc-900"
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 space-y-2">
                        <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto animate-pulse" />
                        <h4 className="text-sm font-bold text-white">Quiz Evaluated!</h4>
                        <p className="text-[11px] text-zinc-450">You scored {quizScore} out of {quizQuestions.length} correct entries.</p>
                        <button onClick={resetQuiz} className="px-3 py-1.5 bg-zinc-900 rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-200 border border-zinc-800">Restart</button>
                      </div>
                    )}

                    {!quizScored && (
                      <div className="pt-3 border-t border-zinc-900/40 flex justify-end">
                        <button
                          disabled={selectedQuizOption === null}
                          onClick={handleQuizNext}
                          className="px-3 py-1.5 bg-blue-600 disabled:opacity-40 text-white rounded text-[10px] font-mono tracking-wider font-bold uppercase transition flex items-center gap-1 cursor-pointer"
                        >
                          <span>{currentQuizIndex === quizQuestions.length - 1 ? "Score" : "Next"}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-650 space-y-2 select-none pt-12">
                    <HelpCircle className="h-6 w-6 text-zinc-700 animate-pulse" />
                    <span>NO RUNTIME QUIZ DATA COMPILED.</span>
                  </div>
                )}
              </div>

              {/* FLASHCARDS WIDGET */}
              <div className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-5 min-h-[300px] flex flex-col justify-between">
                <div className="border-b border-zinc-900 pb-2.5 mb-3">
                  <span className="font-mono text-[9px] text-[#00c8ff] uppercase tracking-widest font-bold">Flipping Flashcards</span>
                </div>

                {flashcards.length > 0 ? (
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[8px] text-zinc-500">CARD {currentFlashcardIndex + 1} / {flashcards.length}</span>
                    </div>

                    {/* Interactive Flipping Card Structure */}
                    <div
                      onClick={() => setFlashcardFlipped(prev => !prev)}
                      className={`h-36 rounded-2xl border flex flex-col items-center justify-center p-5 text-center cursor-pointer transition-all duration-300 relative overflow-hidden select-none ${
                        flashcardFlipped
                          ? "bg-purple-950/10 border-purple-500/30 text-purple-400 rotate-y-180"
                          : "bg-zinc-900/40 border-zinc-900 text-zinc-300"
                      }`}
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 blur-xl pointer-events-none" />
                      <span className="font-mono text-[7px] uppercase tracking-widest text-zinc-500 mb-2">{flashcardFlipped ? "ANSWER SIDE" : "TERM SIDE"}</span>
                      <p className="text-xs font-semibold leading-relaxed max-w-xs px-2">
                        {flashcardFlipped ? flashcards[currentFlashcardIndex].back : flashcards[currentFlashcardIndex].front}
                      </p>
                      <span className="text-[8px] text-zinc-600 mt-3 uppercase tracking-wider font-mono font-bold">Click card to Flip</span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-zinc-900/40 mt-3">
                      <button
                        disabled={currentFlashcardIndex === 0}
                        onClick={() => { setCurrentFlashcardIndex(prev => prev - 1); setFlashcardFlipped(false); }}
                        className="px-2 py-1 bg-zinc-900 disabled:opacity-40 rounded text-[9px] font-mono tracking-wider font-bold uppercase transition"
                      >
                        Prev
                      </button>
                      <button
                        disabled={currentFlashcardIndex === flashcards.length - 1}
                        onClick={() => { setCurrentFlashcardIndex(prev => prev + 1); setFlashcardFlipped(false); }}
                        className="px-2 py-1 bg-purple-600 text-white disabled:opacity-40 rounded text-[9px] font-mono tracking-wider font-bold uppercase transition"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-650 space-y-2 select-none pt-12">
                    <Layers className="h-6 w-6 text-zinc-700 animate-pulse" />
                    <span>NO MEMORY CARDS REVIEWS LOADED.</span>
                  </div>
                )}
              </div>

              {/* MIND MAP NODE MAP */}
              <div className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-5 min-h-[300px] flex flex-col justify-between">
                <div className="border-b border-zinc-900 pb-2.5 mb-3">
                  <span className="font-mono text-[9px] text-[#00c8ff] uppercase tracking-widest font-bold">CONCEPT MIND MAPS</span>
                </div>

                {mindNodes.length > 0 ? (
                  <div className="flex-1 flex flex-col justify-between">
                    {/* Visual 2D Node Grid Board */}
                    <div className="h-36 rounded-2xl bg-black/40 border border-zinc-900/60 relative overflow-hidden flex items-center justify-center shadow-inner">
                      
                      {/* Interactive Canvas Links and Nodes */}
                      <div className="absolute inset-0 flex items-center justify-center select-none scale-[0.65] origin-center">
                        {mindNodes.map((node) => {
                          const isActive = selectedMindNode === node.id;
                          return (
                            <div
                              key={node.id}
                              onClick={() => handleMindNodeClick(node.id)}
                              style={{
                                transform: `translate(${node.x}px, ${node.y}px)`,
                                position: "absolute"
                              }}
                              className={`px-3 py-1.5 rounded-full border text-[10px] font-semibold text-center cursor-pointer transition whitespace-nowrap ${
                                isActive
                                  ? "bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                  : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                              }`}
                            >
                              <span>{node.parentId ? "✦ " : "👑 "}{node.label}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="absolute bottom-2 left-2.5 font-mono text-[7px] text-zinc-650 tracking-wide uppercase">Interactive 2D Canvas</div>
                    </div>

                    <div className="text-[10px] text-zinc-500 leading-normal pl-1 pt-3 text-left">
                      Double click nodes to trace parent concept links or draft a different syllabus to compile glowing glass networks.
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-650 space-y-2 select-none pt-12">
                    <Sparkles className="h-6 w-6 text-zinc-700 animate-pulse" />
                    <span>NO ACTIVE STRUCTURAL NODE TREE DETECTED.</span>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* VIEW TAB 9: STUDIO GLASS CONFIGURATION */}
        {activeSubTab === "SETTINGS" && (
          <div className="space-y-6 text-left">
            <div className="space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-blue-400 font-bold">STUDIO CONFIG</span>
              <h2 className="text-xl font-display font-medium text-white tracking-tight">Studio Customizers</h2>
              <p className="text-xs text-zinc-500">Fine-tune Glassmorphism 2.0 visual parameters, reflection boundaries, and soft glows.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6">
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase font-bold text-zinc-400">
                    <span>Backdrop Blur strength</span>
                    <span>{glassBlur}px</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={40}
                    value={glassBlur}
                    onChange={(e) => setGlassBlur(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase font-bold text-zinc-400">
                    <span>soft Glow intensity</span>
                    <span>{glowIntensity}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={glowIntensity}
                    onChange={(e) => setGlowIntensity(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">Ambient Glow accent Color</label>
                  <div className="flex gap-2">
                    {["blue", "purple", "cyan", "orange"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setGlowColor(c)}
                        className={`py-1.5 px-3.5 rounded-lg border text-xs text-center transition cursor-pointer font-semibold uppercase font-mono tracking-wide ${
                          glowColor === c
                            ? "bg-blue-950/10 border-blue-500/40 text-blue-400"
                            : "bg-zinc-950 border-zinc-900 text-zinc-500"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic Glassmorphic Showcase card based on user metrics */}
              <div className="flex items-center justify-center p-4">
                <div
                  style={{
                    backdropFilter: `blur(${glassBlur}px)`,
                    WebkitBackdropFilter: `blur(${glassBlur}px)`
                  }}
                  className={`w-72 p-6 rounded-3xl border text-left bg-zinc-950/40 relative overflow-hidden transition ${getGlowClasses()}`}
                >
                  <div className={`absolute -top-12 -right-12 w-28 h-28 opacity-10 blur-2xl rounded-full ${getGlowBgClasses()}`} />
                  
                  <div className="space-y-3 relative z-10">
                    <span className="font-mono text-[8px] text-zinc-550 block uppercase tracking-widest font-bold">REFRACTION PREVIEW</span>
                    <h3 className="text-sm font-bold text-white">Apple Keynote Glass</h3>
                    <p className="text-[11px] text-zinc-450 leading-relaxed font-sans">
                      This card dynamically mirrors your style customizers! Watch it compile as blur radii or soft glows shift in real-time.
                    </p>

                    <div className="pt-2 border-t border-zinc-900/60 flex items-center justify-between">
                      <span className="text-[8px] text-zinc-500 font-mono">STATUS: HIGH RES</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW TAB 10: USER GATEWAY LOGIN DEMO */}
        {activeSubTab === "AUTH_DEMO" && (
          <div className="space-y-6 text-left max-w-md mx-auto py-4">
            <div className="text-center space-y-1 mb-4">
              <span className="font-mono text-[9px] uppercase tracking-widest text-blue-400 font-bold">ACCESS CONTROL</span>
              <h2 className="text-xl font-display font-medium text-white tracking-tight">Studio Gateways</h2>
              <p className="text-xs text-zinc-500">Sign in using security channels and OTP codes.</p>
            </div>

            <div className="bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl pointer-events-none" />

              {authStep === "login" && (
                <form onSubmit={handleAuthSubmit} className="space-y-4 relative z-10">
                  <div className="space-y-1.5">
                    <label className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-bold">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="e.g., student@stanford.edu"
                      className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 text-xs text-white focus:border-zinc-850 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-bold">PASSWORD</label>
                    <input
                      type="password"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 text-xs text-white focus:border-zinc-850 outline-none"
                    />
                  </div>

                  <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-widest transition cursor-pointer">
                    Verify credentials
                  </button>
                </form>
              )}

              {authStep === "otp" && (
                <div className="space-y-5 text-center relative z-10">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Multi-Factor Security Scan</h4>
                    <p className="text-[10px] text-zinc-500 max-w-xs mx-auto">Please enter the 4-digit OTP code triggered to your account.</p>
                  </div>

                  {/* 4 numeric OTP input boxes */}
                  <div className="flex justify-center gap-3">
                    {authOtp.map((val, idx) => (
                      <input
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        value={val}
                        maxLength={1}
                        onChange={(e) => handleOtpInput(e.target.value, idx)}
                        className="w-12 h-12 bg-zinc-950 border border-zinc-900 rounded-xl text-center text-lg font-bold text-white focus:border-blue-500 outline-none"
                      />
                    ))}
                  </div>

                  <button onClick={() => setAuthStep("login")} className="text-[9px] text-zinc-550 font-mono uppercase hover:text-zinc-300">Back to log in</button>
                </div>
              )}

              {authStep === "success" && (
                <div className="text-center py-6 space-y-3 relative z-10">
                  <div className="h-12 w-12 rounded-full bg-emerald-950/40 border border-emerald-900/30 flex items-center justify-center mx-auto text-emerald-400 text-lg">
                    <CheckCircle className="h-6 w-6 animate-pulse" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Security cleared!</h4>
                  <p className="text-[11px] text-zinc-450 max-w-xs mx-auto">Welcome to Liquid Glass Studio, ansfaayez1966@gmail.com. All operations are safe and authenticated.</p>
                  <button onClick={() => { setAuthStep("login"); setAuthOtp(["", "", "", ""]); }} className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-300">Sign out</button>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
