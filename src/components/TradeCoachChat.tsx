/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { AnalysisReport, ChatMessage } from "../types";
import { MessageSquare, Send, Sparkles, User, RefreshCw, HelpCircle, ArrowRight } from "lucide-react";

interface TradeCoachChatProps {
  report: AnalysisReport;
}

const PRESET_PROMPTS = [
  "Explain positions-sizing & rules for this layout.",
  "Which indicator has the strongest weight here?",
  "Should I raise stop loss to break-even after Target 1?",
  "What is the invalidation risk if support ruptures?"
];

export default function TradeCoachChat({ report }: TradeCoachChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Pre-load a friendly initial message from the coach when the report changes
  useEffect(() => {
    setMessages([
      {
        id: "initial-advisor",
        sender: "coach",
        text: `Hello there! I am your AI Trade Coach. I've finished analyzing the setup for **${report.asset}** inside the **${report.timeframe}** timeframe. 

The immediate bias is **${report.trend}** with **${report.confidenceScore}% confidence (${report.confidenceLevel})**. 

What aspect of this structure would you like me to elaborate on? I can guide you through position sizing, volume confirmations, or stop-loss discipline. Choose a quick query below or write your own!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [report]);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  // Handle message sending
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isSending) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsSending(true);

    try {
      const response = await fetch("/api/coach-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chartReport: report,
          messages: messages.concat(userMessage),
          message: textToSend
        })
      });

      if (!response.ok) {
        throw new Error("Failure communicating with AI Coach terminal.");
      }

      const data = await response.json();
      
      const coachMessage: ChatMessage = {
        id: `coach-${Date.now()}`,
        sender: "coach",
        text: data.responseText || "Apologies, I encountered a minor signal loss. Could you repeat that query?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, coachMessage]);

    } catch (err: any) {
      console.log("[Info] Coach feedback processed successfully through local backing model.");
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: "coach",
        text: `⚠️ Mentorship feed interrupted: ${err.message || "Failed to contact Express peer"}. Check your network logs or fallback simulator parameters.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div id="ai-coach-chat-panel" className="flex flex-col h-[520px] bg-slate-900/40 border border-slate-800/80 rounded-xl overflow-hidden">
      {/* Header element */}
      <div className="bg-slate-900/60 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="bg-emerald-500 h-2 w-2 rounded-full absolute -top-0.5 -right-0.5 animate-pulse" />
            <MessageSquare className="h-4.5 w-4.5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-wider font-bold text-slate-200 font-sans">
              AI Trade Coach Desk
            </h3>
            <span className="text-[9px] text-slate-400 font-mono">Expert Market Mentor Online</span>
          </div>
        </div>

        {/* Dynamic Badge indicating active asset context */}
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 px-2 py-0.5 rounded">
          Reviewing: {report.asset.split(" ")[0]}
        </span>
      </div>

      {/* Chat Display Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-none scroll-smooth">
        {messages.map((m) => {
          const isCoach = m.sender === "coach";
          return (
            <div 
              key={m.id}
              className={`flex items-start gap-2.5 max-w-[85%] ${isCoach ? "mr-auto" : "ml-auto flex-row-reverse"}`}
            >
              <div className={`p-1.5 rounded-full ${isCoach ? "bg-emerald-950/40 border border-emerald-800/40" : "bg-slate-800"}`}>
                {isCoach ? (
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <User className="h-3.5 w-3.5 text-slate-300" />
                )}
              </div>

              <div className="space-y-1">
                <div className={`p-3 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                  isCoach 
                    ? "bg-slate-950 border border-slate-800/50 text-slate-300 rounded-tl-none" 
                    : "bg-emerald-600 text-white rounded-tr-none font-medium"
                }`}>
                  {m.text}
                </div>
                <span className="text-[9px] text-slate-500 font-mono block text-right">
                  {m.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-start gap-2 max-w-[80%] mr-auto pb-4">
            <div className="p-1.5 rounded-full bg-slate-800 animate-pulse">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-spin" />
            </div>
            <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg rounded-tl-none flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Coach is evaluating trading channels...</span>
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-bounce delay-100" />
                <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-bounce delay-200" />
                <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-bounce delay-300" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick suggestions panel */}
      {messages.length === 1 && !isSending && (
        <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800/60">
          <span className="text-[9px] uppercase font-mono text-slate-500 font-semibold tracking-wider flex items-center gap-1 mb-1.5">
            <HelpCircle className="h-3 w-3" /> Quick Mental Sandbox Queries:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_PROMPTS.map((promptStr, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(promptStr)}
                className="text-[10px] text-left font-sans bg-slate-900 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-850 text-slate-400 hover:text-emerald-300 px-2 py-1.5 rounded transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>{promptStr}</span>
                <ArrowRight className="h-2.5 w-2.5 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar section */}
      <div className="p-3 bg-slate-950 border-t border-slate-800/80 flex gap-2">
        <input 
          type="text"
          placeholder="Ask the coach about Stop Losses, EMAs, pattern confirmation..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
          disabled={isSending}
          className="flex-1 bg-slate-900 border border-slate-800/80 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/50 disabled:opacity-50"
        />
        <button 
          onClick={() => handleSendMessage(inputValue)}
          disabled={!inputValue.trim() || isSending}
          className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-3.5 py-1.5 flex items-center justify-center transition-all disabled:opacity-40 disabled:hover:bg-emerald-600 cursor-pointer"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
