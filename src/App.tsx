import React, { lazy, Suspense, useEffect } from "react";
import { useAppStore } from "./store/useAppStore";
import CustomCursor from "./components/CustomCursor";
import HeaderAssembly from "./components/HeaderAssembly";
import AuthModal from "./components/AuthModal";
import { auth, db } from "./utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const HomePage = lazy(() => import("./pages/HomePage"));
const WorkspacePage = lazy(() => import("./pages/WorkspacePage"));
const SpecWorkstationPage = lazy(() => import("./pages/SpecWorkstationPage"));
const AdminPanelPage = lazy(() => import("./pages/AdminPanelPage"));

export default function App() {
  const currentView = useAppStore((state) => state.currentView);
  const setCurrentView = useAppStore((state) => state.setCurrentView);
  const setUser = useAppStore((state) => state.setUser);

  // Synchronize Auth Channels with Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              name: data.name || firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Trader",
              email: data.email || firebaseUser.email || "",
              avatarUrl: data.avatarUrl || firebaseUser.photoURL || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
              role: data.role || "Free Tier",
              status: data.status || "ONLINE",
              requestsCount: data.requestsCount || 0,
              createdAt: data.createdAt || new Date().toISOString()
            });
          } else {
            // New user registration auto-instantiation
            const initialProfile = {
              name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Trader",
              email: firebaseUser.email || "",
              avatarUrl: firebaseUser.photoURL || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
              role: "Free Tier",
              status: "ONLINE",
              requestsCount: 1,
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString()
            };

            await setDoc(userDocRef, initialProfile);
            setUser({
              uid: firebaseUser.uid,
              ...initialProfile
            });
          }
        } catch (error) {
          console.error("[Auth Sync Exception]", error);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-blue-600 selection:text-white font-sans antialiased overflow-x-hidden">
      <HeaderAssembly />

      <Suspense fallback={
        <div className="flex-1 flex flex-col justify-center items-center font-mono text-xs text-zinc-500 bg-black min-h-[85vh] space-y-4">
          <div className="h-6 w-6 rounded bg-zinc-100/5 border border-blue-500/25 animate-spin flex items-center justify-center">
            <span className="text-blue-400">✦</span>
          </div>
          <span className="uppercase tracking-widest text-[9px]">CONNECTING SYNC CHANNELS...</span>
        </div>
      }>
        {currentView === "HOMEPAGE" && <HomePage />}
        {currentView === "WORKSPACE" && <WorkspacePage />}
        {currentView === "ADMIN" && <AdminPanelPage />}
        {currentView === "SPEC_WORKSTATION" && (
          <SpecWorkstationPage onBackToLab={() => setCurrentView("WORKSPACE")} />
        )}
      </Suspense>

      <AuthModal />
      <CustomCursor />
    </div>
  );
}
export { App };
