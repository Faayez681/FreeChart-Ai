import React, { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { X, Sparkle, Mail, Lock, ShieldCheck, RefreshCw, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { auth } from "../utils/firebase";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "firebase/auth";

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, setUser } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authMethod, setAuthMethod] = useState<"google" | "email" | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleGoogleSignIn = async () => {
    setAuthMethod("google");
    setIsSubmitting(true);
    setErrorMsg(null);
    setErrorCode(null);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
      setIsAuthModalOpen(false);
    } catch (err: any) {
      console.warn("[Google Auth Error]", err);
      setErrorMsg(err.message || "Failed to authenticate with Google.");
      setErrorCode(err.code || "AUTH_ERROR");
    } finally {
      setIsSubmitting(false);
      setAuthMethod(null);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setAuthMethod("email");
    setIsSubmitting(true);
    setErrorMsg(null);
    setErrorCode(null);

    const checkEmail = email.trim();
    try {
      try {
        await signInWithEmailAndPassword(auth, checkEmail, password);
      } catch (signInErr: any) {
        // If account does not exist, auto-create (convenience signup)
        if (
          signInErr.code === "auth/user-not-found" || 
          signInErr.code === "auth/invalid-credential" ||
          signInErr.code === "auth/invalid-email"
        ) {
          await createUserWithEmailAndPassword(auth, checkEmail, password);
        } else {
          throw signInErr;
        }
      }
      setIsAuthModalOpen(false);
    } catch (err: any) {
      console.warn("[Email Auth Error]", err);
      setErrorMsg(err.message || "Credential verification failed.");
      setErrorCode(err.code || "AUTH_ERROR");
    } finally {
      setIsSubmitting(false);
      setAuthMethod(null);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            if (!isSubmitting) setIsAuthModalOpen(false);
          }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md bg-[#09090c] border border-zinc-900 rounded-3xl p-8 overflow-hidden select-none shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
        >
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-[radial-gradient(circle_at_center,rgba(0,102,238,0.15)_0%,transparent_60%)] pointer-events-none" />

          {/* Close button */}
          <button
            onClick={() => setIsAuthModalOpen(false)}
            disabled={isSubmitting}
            className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-950/60 hover:bg-zinc-900 border border-zinc-900 text-zinc-400 hover:text-white transition cursor-pointer flex items-center justify-center active:scale-95 disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Brand/Icons Header */}
          <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              <Sparkle className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-display font-medium text-white tracking-tight uppercase">
                Access Platform Core
              </h2>
              <p className="text-xs text-zinc-400 mt-1 max-w-[280px] mx-auto leading-relaxed">
                Unlock advanced vector generation layouts and persistent workspace modules.
              </p>
            </div>
          </div>

          {/* Loading Overlap */}
          {isSubmitting ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 font-mono text-xs text-zinc-400">
              <div className="flex items-center gap-2 text-blue-400 animate-pulse">
                <RefreshCw className="h-5 w-5 animate-spin" />
              </div>
              <span className="uppercase tracking-widest text-[9px] text-[#00c8ff] font-bold">
                {authMethod === "google"
                  ? "Resolving Google Auth Gateway..."
                  : "Securing account credentials..."}
              </span>
              <p className="text-[10px] text-zinc-650 mt-1 text-center max-w-[80%]">
                Confirm consensus prompts or wait for the automatic validation link.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Custom Diagnostic Alerts for complex container cross-origin issues */}
              {errorMsg === "POPUP_BLOCKED" && (
                <div className="flex flex-col bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-xl text-[11px] font-mono leading-relaxed space-y-2 animate-fade-in text-left">
                  <div className="flex items-center gap-2 font-bold text-amber-500 uppercase text-[10px]">
                    <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
                    <span>Popup Blocked by Browser</span>
                  </div>
                  <p>Your browser blocked the authentication screen popup.</p>
                  <p className="text-zinc-400">
                    <strong className="text-zinc-200">Solution:</strong> Enable popups for this page, or click <strong className="text-blue-400">"Open App"</strong> at the top right of AI Studio to run inside a separate, clean tab!
                  </p>
                </div>
              )}

              {errorMsg === "UNAUTHORIZED_DOMAIN" && (
                <div className="flex flex-col bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-[11px] font-mono leading-relaxed space-y-2.5 animate-fade-in text-left">
                  <div className="flex items-center gap-2 font-bold text-red-500 uppercase text-[10px]">
                    <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
                    <span>Domain Unauthorized in Firebase</span>
                  </div>
                  <p>This developer app domain needs authorization inside your Firebase settings:</p>
                  <div className="bg-black border border-zinc-900 rounded-lg p-2.5 text-zinc-200 font-bold select-all break-all cursor-text text-center text-xs">
                    {window.location.hostname}
                  </div>
                  <p className="text-zinc-400 mt-1">
                    <strong className="text-zinc-200">How to fix fast:</strong> Go to your <strong className="text-white">Firebase Console</strong> &rarr; <strong className="text-white">Authentication</strong> &rarr; <strong className="text-white">Settings</strong> &rarr; <strong className="text-white">Authorized domains</strong>, click <strong className="text-blue-400">"Add domain"</strong> and input the code above!
                  </p>
                </div>
              )}

              {errorMsg === "IFRAME_COOKIE_BLOCKED" && (
                <div className="flex flex-col bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-xl text-[11px] font-mono leading-relaxed space-y-2 animate-fade-in text-left">
                  <div className="flex items-center gap-2 font-bold text-amber-500 uppercase text-[10px]">
                    <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
                    <span>Third-Party Blocked (Iframe Sandbox)</span>
                  </div>
                  <p>Your browser is blocking authentication tokens inside this embedded iframe.</p>
                  <p className="text-zinc-400">
                    <strong className="text-zinc-200">Quickest Bypass:</strong> Look at the top right of your workspace and click <strong className="text-blue-400">"Open App"</strong> to launch the web client in a top-level tab. Login works immediately!
                  </p>
                </div>
              )}

              {/* Standard text error message */}
              {errorMsg && !["POPUP_BLOCKED", "UNAUTHORIZED_DOMAIN", "IFRAME_COOKIE_BLOCKED"].includes(errorMsg) && (
                <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-[11px] font-mono leading-relaxed animate-fade-in text-left">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold uppercase text-[9px] text-red-500">Authentication Error Details</p>
                    <p>{errorMsg}</p>
                    {errorCode && <p className="text-zinc-500 text-[9px]">Code: {errorCode}</p>}
                    <p className="text-zinc-400 mt-1 select-none">
                      Tip: If you continue to see errors inside this embedded frame, click <strong className="text-zinc-200">"Open App"</strong> in the top-right to run in a standalone browser tab.
                    </p>
                  </div>
                </div>
              )}

              {/* Google Sign In action */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 bg-white text-black hover:bg-zinc-100 font-semibold font-mono text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl transition-all cursor-pointer border border-white/25 active:scale-98 duration-200"
              >
                {/* Standard Google G SVG Icon */}
                <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>

              {/* Or separator */}
              <div className="flex items-center gap-3">
                <span className="h-px bg-zinc-900 flex-1" />
                <span className="font-mono text-[9px] text-zinc-650 uppercase tracking-widest">
                  Or use secure address
                </span>
                <span className="h-px bg-zinc-900 flex-1" />
              </div>

              {/* standard Form */}
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider block">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="e.g. name@enterprise.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black border border-zinc-900 focus:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-700 focus:outline-none font-mono"
                    />
                    <Mail className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-zinc-600" />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider block">
                    Password Code
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black border border-zinc-900 focus:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-700 focus:outline-none font-mono"
                    />
                    <Lock className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-zinc-600" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 font-bold font-mono text-xs uppercase tracking-wider rounded-xl transition-all bg-zinc-900 hover:bg-zinc-850 hover:border-zinc-805 text-white cursor-pointer hover:border border border-zinc-900 select-none active:scale-98 duration-200 shadow-lg"
                >
                  Verify Access Code
                </button>
              </form>
            </div>
          )}

          {/* Secure details info */}
          <div className="mt-8 border-t border-zinc-900/60 pt-4 flex items-center justify-center gap-2 font-mono text-[9px] text-zinc-600">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>ENCRYPTED END-TO-END VIA SECURE LAB SIGNALS</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
