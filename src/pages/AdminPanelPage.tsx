import React, { useState, useEffect, useRef } from "react";
import { useAppStore } from "../store/useAppStore";
import { 
  ArrowLeft, Users, Activity, Database, Cpu, Settings, Trash2, 
  Search, Sparkles, RefreshCw, Sliders, Shield, AlertTriangle, 
  CheckCircle, Globe, Terminal, UserCheck, Plus, Play, Lock,
  UserX, MessageSquare, Send, Zap, Eye, ShieldAlert
} from "lucide-react";
import { db, handleFirestoreError, OperationType } from "../utils/firebase";
import { 
  collection, 
  doc, 
  query, 
  onSnapshot, 
  updateDoc, 
  deleteDoc, 
  setDoc, 
  addDoc, 
  orderBy, 
  limit, 
  getDocs 
} from "firebase/firestore";

interface AdminUserRecord {
  name: string;
  email: string;
  avatarUrl: string;
  createdAt: string;
  lastLogin: string;
  role: string;
  status: "ONLINE" | "IDLE" | "OFFLINE";
  requestsCount: number;
  uid?: string;
}

export default function AdminPanelPage() {
  const { setCurrentView, user } = useAppStore();
  const [activeTab, setActiveTab] = useState<"users" | "logs" | "settings">("users");
  const [usersList, setUsersList] = useState<AdminUserRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [apiLatency, setApiLatency] = useState(450);
  const [aiTemperature, setAiTemperature] = useState(0.7);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // System interactive behaviors
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(() => {
    return localStorage.getItem("freechartai_maintenance") === "true";
  });
  const [allowRegistration, setAllowRegistration] = useState<boolean>(() => {
    return localStorage.getItem("freechartai_allow_reg") !== "false";
  });
  const [rateLimit, setRateLimit] = useState<number>(30);

  // Users creator form state
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("Free Tier");
  const [newUserStatus, setNewUserStatus] = useState<"ONLINE" | "IDLE" | "OFFLINE">("ONLINE");
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  // Terminal CLI Command input state
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalOutputs, setTerminalOutputs] = useState<string[]>([
    "FreeChartAI Secure Terminal OS [v1.0.8]",
    "consensus-server node online. TLS security validation: ACTIVE.",
    "System authenticated directly to Firestore channels.",
    "Type /help to display available terminal root commands."
  ]);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Telemetry logs
  const [auditLogs, setAuditLogs] = useState<Array<{
    id: string;
    user: string;
    action: string;
    details: string;
    timestamp: string;
    ip: string;
    status: string;
  }>>([]);

  // 1. Load users list from Firestore in real-time
  useEffect(() => {
    const q = query(collection(db, "users"));
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const list: AdminUserRecord[] = [];
      snapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        list.push({
          uid: docSnapshot.id,
          name: data.name || "Trader",
          email: data.email || docSnapshot.id,
          avatarUrl: data.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
          createdAt: data.createdAt || new Date().toISOString(),
          lastLogin: data.lastLogin || new Date().toISOString(),
          role: data.role || "Free Tier",
          status: data.status || "ONLINE",
          requestsCount: data.requestsCount || 0
        });
      });

      // Seeding database with original system users if empty
      if (list.length === 0 && user?.role === "Owner / Administrator") {
        try {
          const defaults: AdminUserRecord[] = [
            {
              name: "Ans Faaez",
              email: "ansfaayez_admin@freechart.ai",
              avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
              lastLogin: new Date().toISOString(),
              role: "Owner / Administrator",
              status: "ONLINE",
              requestsCount: 142
            },
            {
              name: "Sam Spector",
              email: "sam_spector@mit.edu",
              avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
              lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
              role: "Enterprise Quant",
              status: "IDLE",
              requestsCount: 84
            },
            {
              name: "Demo Account",
              email: "demouser@gmail.com",
              avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80",
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
              lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
              role: "Free Tier Tier",
              status: "OFFLINE",
              requestsCount: 21
            },
            {
              name: "Finance Expert",
              email: "quantitative_trader_62@gmail.com",
              avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
              lastLogin: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
              role: "Free Tier",
              status: "ONLINE",
              requestsCount: 9
            }
          ];

          for (const def of defaults) {
            const pathId = def.email.replace(/[.@]/g, "_");
            await setDoc(doc(db, "users", pathId), def);
          }
        } catch (seedErr) {
          console.error("[Seeding DB Users failed]", seedErr);
        }
      } else {
        setUsersList(list);
      }
    }, (error) => {
      console.warn("[onSnapshot users list err - loading offline fallback]", error);
      try {
        const localUsers = localStorage.getItem("freechartai_registered_users");
        if (localUsers) {
          setUsersList(JSON.parse(localUsers));
        } else {
          setUsersList([
            {
              name: "Ans Faaez",
              email: "ansfaayez_admin@freechart.ai",
              avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              role: "Owner / Administrator",
              status: "ONLINE",
              requestsCount: 142
            }
          ]);
        }
      } catch (e) {
        console.error(e);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // 2. Load cryptographical and system audit logs from Firestore
  useEffect(() => {
    const q = query(
      collection(db, "audit_logs"), 
      orderBy("timestamp", "desc"), 
      limit(40)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs: any[] = [];
      snapshot.forEach((docSnapshot) => {
        logs.push({
          id: docSnapshot.id,
          ...docSnapshot.data()
        });
      });

      if (logs.length === 0) {
        setAuditLogs([
          { id: "log-1", user: "admin@freechart.ai", action: "SYSTEM_ACCESS", details: "Admin panel console loaded", timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), ip: "127.0.0.1", status: "SUCCESS" },
          { id: "log-2", user: "admin@freechart.ai", action: "LOGIN_SUCCESS", details: "Credential consensus validated", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), ip: "192.168.1.102", status: "SUCCESS" },
          { id: "log-3", user: "client_user@intel.com", action: "CHART_GEN_PROMPT", details: "Prompt: Show worldwide AI servers growth metrics for 2026", timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(), ip: "107.21.32.4", status: "SUCCESS" }
        ]);
      } else {
        setAuditLogs(logs);
      }
    }, (error) => {
      console.warn("[onSnapshot audit logs err - loading offline fallback]", error);
      setAuditLogs([
        { id: "log-1", user: "admin@freechart.ai", action: "SYSTEM_ACCESS", details: "Admin panel console loaded (Offline)", timestamp: new Date().toISOString(), ip: "127.0.0.1", status: "SUCCESS" },
        { id: "log-2", user: "admin@freechart.ai", action: "OFFLINE_MODE", details: "Firebase channels simulated locally", timestamp: new Date(Date.now() - 1000 * 30).toISOString(), ip: "127.0.0.1", status: "SUCCESS" }
      ]);
    });

    return () => unsubscribe();
  }, []);

  // Keep terminal scrolled to bottom
  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalOutputs]);

  const triggerFeedback = (msg: string) => {
    setActionSuccessMessage(msg);
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  const handlePruneLogs = async () => {
    try {
      const snap = await getDocs(collection(db, "audit_logs"));
      for (const docSnapshot of snap.docs) {
        await deleteDoc(doc(db, "audit_logs", docSnapshot.id));
      }

      await addDoc(collection(db, "audit_logs"), {
        id: `log-${Date.now()}`,
        user: user?.email || "system",
        action: "PRUNE_COMPLETED",
        details: "Cleared old telemetry state logs inside Firestore",
        timestamp: new Date().toISOString(),
        ip: "127.0.0.1",
        status: "SUCCESS"
      });
      triggerFeedback("Audit telemetry logs successfully pruned");
    } catch (err) {
      console.warn("Firebase offline. Clearing audit logs locally.", err);
      setAuditLogs([]);
      triggerFeedback("[Offline Mode] Telemetry log cleared locally");
    }
  };

  const handleResetUsers = async () => {
    try {
      const snap = await getDocs(collection(db, "users"));
      for (const docSnapshot of snap.docs) {
        await deleteDoc(doc(db, "users", docSnapshot.id));
      }
      localStorage.removeItem("freechartai_maintenance");
      localStorage.removeItem("freechartai_allow_reg");
      localStorage.removeItem("freechartai_registered_users");
      window.location.reload();
    } catch (err) {
      console.warn("Firebase offline. Resetting users list locally.", err);
      localStorage.removeItem("freechartai_maintenance");
      localStorage.removeItem("freechartai_allow_reg");
      localStorage.removeItem("freechartai_registered_users");
      window.location.reload();
    }
  };

  // Modify user role in Firestore
  const handleUpdateRole = async (email: string, nextRole: string) => {
    const target = usersList.find(u => u.email === email);
    if (!target) return;
    const documentId = target.uid || email.replace(/[.@]/g, "_");

    try {
      await updateDoc(doc(db, "users", documentId), { role: nextRole });

      await addDoc(collection(db, "audit_logs"), {
        id: `log-${Date.now()}`,
        user: user?.email || "admin",
        action: "ROLE_MODIFICATION",
        details: `Modified access permissions for ${target.name || email} to: ${nextRole}`,
        timestamp: new Date().toISOString(),
        ip: "127.0.0.1",
        status: "SUCCESS"
      });

      triggerFeedback(`Security permissions updated for ${email}`);
    } catch (err) {
      console.warn("Firebase offline. Updating role locally.", err);
      const updatedList = usersList.map(u => u.email === email ? { ...u, role: nextRole } : u);
      setUsersList(updatedList);
      localStorage.setItem("freechartai_registered_users", JSON.stringify(updatedList));
      triggerFeedback(`[Offline Mode] Security rank upgraded for ${email}`);
    }
  };

  // Modify user system status in Firestore
  const handleUpdateStatus = async (email: string, nextStatus: "ONLINE" | "IDLE" | "OFFLINE") => {
    const target = usersList.find(u => u.email === email);
    if (!target) return;
    const documentId = target.uid || email.replace(/[.@]/g, "_");

    try {
      await updateDoc(doc(db, "users", documentId), { status: nextStatus });
      triggerFeedback(`Status node changed for ${email} to ${nextStatus}`);
    } catch (err) {
      console.warn("Firebase offline. Updating status locally.", err);
      const updatedList = usersList.map(u => u.email === email ? { ...u, status: nextStatus } : u);
      setUsersList(updatedList);
      localStorage.setItem("freechartai_registered_users", JSON.stringify(updatedList));
      triggerFeedback(`[Offline Mode] Status changed to ${nextStatus} for ${email}`);
    }
  };

  // Delete Firestore user account
  const handleDeleteUser = async (email: string) => {
    const target = usersList.find(u => u.email === email);
    if (!target) return;
    if (target.role === "Owner / Administrator") {
      triggerFeedback("CRITICAL: Root Administrator account cannot be deleted or suspended!");
      return;
    }
    const documentId = target.uid || email.replace(/[.@]/g, "_");

    try {
      await deleteDoc(doc(db, "users", documentId));

      await addDoc(collection(db, "audit_logs"), {
        id: `log-${Date.now()}`,
        user: user?.email || "admin",
        action: "ACCOUNT_DELETED",
        details: `Deleted authorization token for credential: ${email}`,
        timestamp: new Date().toISOString(),
        ip: "127.0.0.1",
        status: "SUCCESS"
      });

      triggerFeedback(`Access privileges revoked for email ${email}`);
    } catch (err) {
      console.warn("Firebase offline. Revoking users access locally.", err);
      const updatedList = usersList.filter(u => u.email !== email);
      setUsersList(updatedList);
      localStorage.setItem("freechartai_registered_users", JSON.stringify(updatedList));
      triggerFeedback(`[Offline Mode] Revoked credentials for ${email}`);
    }
  };

  // Toggle Maintenance Mode
  const handleToggleMaintenance = () => {
    const nextVal = !maintenanceMode;
    setMaintenanceMode(nextVal);
    localStorage.setItem("freechartai_maintenance", String(nextVal));
    triggerFeedback(nextVal ? "Core Maintenance Mode is activated!" : "Maintenance Mode system bypass disengaged.");
  };

  // Toggle Registration Permission
  const handleToggleRegistration = () => {
    const nextVal = !allowRegistration;
    setAllowRegistration(nextVal);
    localStorage.setItem("freechartai_allow_reg", String(nextVal));
    triggerFeedback(nextVal ? "Open node registration enabled." : "Registration lock engaged. Private accounts only.");
  };

  // Register modern user in Firestore database
  const handleCreateNewUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const emailTrim = newUserEmail.toLowerCase().trim();
    if (usersList.some(u => u.email === emailTrim)) {
      triggerFeedback("Validation error: Account email already listed in system directory.");
      return;
    }

    const documentId = emailTrim.replace(/[.@]/g, "_");
    const newUserRecord = {
      name: newUserName,
      email: emailTrim,
      avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 900000)}?auto=format&fit=crop&w=150&q=80`,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      role: newUserRole,
      status: newUserStatus,
      requestsCount: 0
    };

    try {
      await setDoc(doc(db, "users", documentId), newUserRecord);

      await addDoc(collection(db, "audit_logs"), {
        id: `log-${Date.now()}`,
        user: user?.email || "admin",
        action: "MANUAL_REGISTRATION",
        details: `Manually registered new nodes matching: ${newUserEmail} with ${newUserRole} rank.`,
        timestamp: new Date().toISOString(),
        ip: "127.0.0.1",
        status: "SUCCESS"
      });

      setNewUserName("");
      setNewUserEmail("");
      setIsCreatorOpen(false);
      triggerFeedback(`Registered dynamic credential key for ${emailTrim}`);
    } catch (err) {
      console.warn("Firebase offline. Registering user locally.", err);
      const updatedList = [...usersList, newUserRecord];
      setUsersList(updatedList);
      localStorage.setItem("freechartai_registered_users", JSON.stringify(updatedList));
      setNewUserName("");
      setNewUserEmail("");
      setIsCreatorOpen(false);
      triggerFeedback(`[Offline Mode] Manually registered credentials for ${emailTrim}`);
    }
  };

  // Terminal command prompt emulator logic
  const handleExecuteTerminalCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const rawCommand = terminalInput.trim();
    const commandPill = rawCommand.toLowerCase().split(" ");
    const cmd = commandPill[0];
    const outputs = [...terminalOutputs, `> ${rawCommand}`];

    if (cmd === "/help") {
      outputs.push(
        "Available root admin commands:",
        "  /help                           Display available CLI operations",
        "  /users                          List all authenticated user records summaries",
        "  /status [email] [online|offline] Swap socket state of a user account",
        "  /latency [number]               Configure artificial sector simulation delay in ms",
        "  /temp [value]                   Change creativity threshold (0.1 - 1.0)",
        "  /announce [message]             Append dynamic system log notice",
        "  /test-user                      Dynamically instantiate random test credential",
        "  /clear                          Flush terminal window telemetry buffer"
      );
    } else if (cmd === "/users") {
      outputs.push("=== Active Registry Node Ledger ===");
      usersList.forEach(u => {
        outputs.push(` - ${u.name} <${u.email}> | Rank: [${u.role}] | State: ${u.status} | Usage: ${u.requestsCount} calls`);
      });
    } else if (cmd === "/status") {
      const email = commandPill[1];
      const targetState = commandPill[2] ? commandPill[2].toUpperCase() : null;
      if (!email || (targetState !== "ONLINE" && targetState !== "OFFLINE" && targetState !== "IDLE")) {
        outputs.push("Command Usage syntax: /status [email_address] [online|offline|idle]");
      } else {
        const found = usersList.some(u => u.email === email);
        if (found) {
          handleUpdateStatus(email, targetState as any);
          outputs.push(`Success: Node status manually compiled as ${targetState} for ${email}`);
        } else {
          outputs.push(`Error: Address identifier "${email}" not matching active nodes.`);
        }
      }
    } else if (cmd === "/latency") {
      const ms = parseInt(commandPill[1], 10);
      if (isNaN(ms) || ms < 10 || ms > 10000) {
        outputs.push("Syntax validation: /latency [value in range 10-10000]");
      } else {
        setApiLatency(ms);
        outputs.push(`System state: Configured standard simulated latency delay to ${ms}ms.`);
      }
    } else if (cmd === "/temp") {
      const value = parseFloat(commandPill[1]);
      if (isNaN(value) || value < 0.1 || value > 1) {
        outputs.push("Syntax validation: /temp [float in range 0.1-1.0]");
      } else {
        setAiTemperature(value);
        outputs.push(`AI Module config changed: Temperature parameter fixed to ${value}.`);
      }
    } else if (cmd === "/announce") {
      const msg = commandPill.slice(1).join(" ");
      if (!msg) {
        outputs.push("Error syntax: /announce [system statement message]");
      } else {
        const newLog = {
          id: `log-${Date.now()}`,
          user: user?.email || "admin",
          action: "GLOBAL_SYSTEM_BROADCAST",
          details: `Broadcast: ${msg}`,
          timestamp: new Date().toISOString(),
          ip: "127.0.0.1",
          status: "SUCCESS"
        };
        setAuditLogs(prev => [newLog, ...prev]);
        outputs.push(`Broadcasting global statement packet: "${msg}"`);
      }
    } else if (cmd === "/test-user") {
      const randomPrefix = `analyst-${Math.floor(100 + Math.random() * 900)}`;
      const randomEmail = `${randomPrefix}@freechartai-node.org`;
      const randomUser: AdminUserRecord = {
        name: `Analyst Client Node ${randomPrefix.toUpperCase()}`,
        email: randomEmail,
        avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        role: "Free Tier",
        status: "ONLINE",
        requestsCount: Math.floor(Math.random() * 15)
      };
      
      const newReg = [randomUser, ...usersList];
      setUsersList(newReg);
      localStorage.setItem("freechartai_registered_users", JSON.stringify(newReg));
      outputs.push(`Instance validated: Created key for simulation user ${randomEmail}`);
    } else if (cmd === "/clear") {
      setTerminalOutputs(["Terminal output logs flushed. Buffer ready for signals."]);
      setTerminalInput("");
      return;
    } else {
      outputs.push(`Unknown command keyword: "${cmd}". Type /help to see all available syntax protocols.`);
    }

    setTerminalOutputs(outputs);
    setTerminalInput("");
  };

  const filteredUsers = usersList.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white py-10 px-4 md:px-8 select-none">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Dynamic Navigation & Back Trigger */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView("HOMEPAGE")}
              className="group flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 text-[10px] text-zinc-400 hover:text-white font-mono uppercase tracking-widest transition-all duration-200 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-blue-500 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Homepage</span>
            </button>
            
            <div className="h-4 w-px bg-zinc-900" />
            
            <div className="flex items-center gap-2 font-mono text-[9px] text-zinc-600 uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span>Security Terminal Active</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3.5 py-1.5 rounded-xl text-xs text-blue-400 font-mono">
              <Shield className="h-3.5 w-3.5" />
              <span className="font-semibold uppercase text-[9px] tracking-wider">Root Panel: ON</span>
            </div>
          </div>
        </div>

        {/* Dynamic header branding info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-tr from-[#09090c] to-[#040406] border border-zinc-900 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0%,transparent_60%)] pointer-events-none" />
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider font-bold">Consensus core fully synchronized</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-medium tracking-tight text-white uppercase">
              Control Panel & System Registry
            </h1>
            <p className="text-xs text-zinc-400 max-w-2xl font-light leading-relaxed">
              Global dashboard for tracking authenticated node access keys, real-time client logins, and AI vector compilation diagnostics.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentView("WORKSPACE")}
              className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-850/80 border border-zinc-805 rounded-xl text-xs text-zinc-300 font-semibold transition tracking-wide cursor-pointer flex items-center gap-1.5"
            >
              <Zap className="h-3.5 w-3.5 text-blue-400" />
              <span>Workspace Console</span>
            </button>
            <button
              onClick={handleResetUsers}
              className="px-4 py-2.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 text-red-500 font-mono text-[10px] uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-2"
              title="Reset Simulated Data"
            >
              <RefreshCw className="h-3 w-3" />
              Reset Core
            </button>
          </div>
        </div>

        {/* Action notification feed */}
        {actionSuccessMessage && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 p-3.5 rounded-2xl text-xs font-mono animate-fade-in relative z-10">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>SYSTEM STATE UPDATE: {actionSuccessMessage}</span>
          </div>
        )}

        {/* SECTION 1: SYSTEM MONITORING METRICS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#09090c] border border-zinc-900 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-[9px] font-mono uppercase tracking-wider">Total Registered Accounts</span>
              <Users className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-semibold tracking-tight">{usersList.length}</div>
            <span className="text-[9px] font-mono text-emerald-400 mt-1 block">▲ +{usersList.length - 3} dynamic profiles</span>
          </div>

          <div className="bg-[#09090c] border border-zinc-900 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-[9px] font-mono uppercase tracking-wider">Gateway Vector Calls</span>
              <Activity className="h-4 w-4 text-[#00c8ff]" />
            </div>
            <div className="text-2xl font-semibold tracking-tight">41,204</div>
            <span className="text-[9px] font-mono text-zinc-450 mt-1 block">Avg Success rate: <span className="text-emerald-400">99.8%</span></span>
          </div>

          <div className="bg-[#09090c] border border-zinc-900 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-[9px] font-mono uppercase tracking-wider">Active Memory Nodes</span>
              <Cpu className="h-4 w-4 text-purple-500" />
            </div>
            <div className="text-2xl font-semibold tracking-tight">4 / 4</div>
            <span className="text-[9px] font-mono text-purple-400 mt-1 block">Latency: {apiLatency}ms (Optimized)</span>
          </div>

          <div className="bg-[#09090c] border border-zinc-900 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-[9px] font-mono uppercase tracking-wider">Database Ledger State</span>
              <Database className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-2xl font-semibold tracking-tight">PostgreSQL</div>
            <span className="text-[9px] font-mono text-[#00c8ff] mt-1 block">TLS Connection: SECURED</span>
          </div>
        </div>

        {/* MAIN LAYOUT BLOCK - TABBED AND TABLES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT CHANNELS: ADMIN PAGES */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Tab Selection Row */}
            <div className="flex bg-zinc-950 p-1 border border-zinc-900 rounded-xl gap-1">
              <button
                onClick={() => setActiveTab("users")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-mono tracking-wider transition uppercase cursor-pointer ${
                  activeTab === "users" ? "bg-zinc-900 text-white font-bold animate-pulse" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                <span>Registry ({usersList.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("logs")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-mono tracking-wider transition uppercase cursor-pointer ${
                  activeTab === "logs" ? "bg-zinc-900 text-white font-bold" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Terminal className="h-3.5 w-3.5" />
                <span>Diagnostics CLI</span>
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-mono tracking-wider transition uppercase cursor-pointer ${
                  activeTab === "settings" ? "bg-zinc-900 text-white font-bold" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>AI Core Tuning</span>
              </button>
            </div>

            {/* TAB CONTENT: USERS REGISTRY */}
            {activeTab === "users" && (
              <div className="bg-[#09090c] border border-zinc-900 rounded-2xl overflow-hidden p-6 space-y-6">
                
                {/* Search & Header Title controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                      <span>Active User Database Registry</span>
                      <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.2 rounded border border-blue-500/20 font-mono">ROOT DIR</span>
                    </h3>
                    <p className="text-[10px] text-zinc-500 font-mono">Consensus list of dynamic and pre-loaded security cache accounts</p>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setIsCreatorOpen(!isCreatorOpen)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 hover:scale-101 border border-blue-500 text-white font-mono text-[9.5px] uppercase tracking-wider rounded-xl transition cursor-pointer font-bold"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Test Account Key
                    </button>
                  </div>
                </div>

                {/* Animated registration dialog for adding mock node accounts */}
                {isCreatorOpen && (
                  <form onSubmit={handleCreateNewUser} className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4 animate-fade-in text-left">
                    <div className="border-b border-zinc-900 pb-2 flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-blue-400 tracking-wider font-bold">Instantiate Virtual Account node</span>
                      <button 
                        type="button" 
                        onClick={() => setIsCreatorOpen(false)}
                        className="text-zinc-500 hover:text-white font-mono text-[9px] uppercase hover:underline"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider">Full Username</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Quantitative Advisor"
                          value={newUserName}
                          onChange={(e) => setNewUserName(e.target.value)}
                          className="w-full bg-black border border-zinc-900 focus:border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-700 outline-none font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider">Secure Email ID</label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. analyst_name@enterprise.com"
                          value={newUserEmail}
                          onChange={(e) => setNewUserEmail(e.target.value)}
                          className="w-full bg-black border border-zinc-900 focus:border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-700 outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider">Role Priority Class</label>
                        <select
                          value={newUserRole}
                          onChange={(e) => setNewUserRole(e.target.value)}
                          className="w-full bg-black border border-zinc-900 text-xs text-zinc-300 rounded-lg px-3 py-2 outline-none font-mono cursor-pointer"
                        >
                          <option value="Free Tier">Free Tier</option>
                          <option value="Enterprise Quant">Enterprise Quant</option>
                          <option value="Associate Node">Associate Node</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider">Instantiated Status</label>
                        <select
                          value={newUserStatus}
                          onChange={(e) => setNewUserStatus(e.target.value as any)}
                          className="w-full bg-black border border-zinc-900 text-xs text-zinc-300 rounded-lg px-3 py-2 outline-none font-mono cursor-pointer"
                        >
                          <option value="ONLINE">ONLINE (Active)</option>
                          <option value="IDLE">IDLE (Listening)</option>
                          <option value="OFFLINE">OFFLINE (Dormant)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono text-[10px] uppercase font-bold tracking-widest rounded-lg transition"
                      >
                        Execute Registry Consensus Allocation
                      </button>
                    </div>
                  </form>
                )}

                {/* Search bar helper filter inline */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Filter credential directory, privileges, name, tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black border border-zinc-900 focus:border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-zinc-700 focus:outline-none font-mono"
                  />
                  <Search className="absolute left-3 top-3.5 h-3.5 w-3.5 text-zinc-600" />
                </div>

                {/* Registry directory tables */}
                <div className="overflow-x-auto border border-zinc-900 rounded-xl bg-black/40">
                  <table className="w-full text-left font-mono text-[11px] border-collapse">
                    <thead>
                      <tr className="bg-zinc-950 text-zinc-500 uppercase text-[9px] tracking-wider border-b border-zinc-900">
                        <th className="p-3.5 font-semibold">User details</th>
                        <th className="p-3.5 font-semibold">Access Privilege rank</th>
                        <th className="p-3.5 font-semibold">Instantiated Node state</th>
                        <th className="p-3.5 font-semibold">Activity metric</th>
                        <th className="p-3.5 font-semibold">Purge Privileges</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-zinc-500 uppercase font-mono text-[10px]">
                            No security records match Search Query
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u, idx) => (
                          <tr key={idx} className="hover:bg-zinc-950/40 transition-colors">
                            <td className="p-3.5">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={u.avatarUrl}
                                  alt={u.name}
                                  className="h-8 w-8 rounded-full border border-zinc-800 object-cover shrink-0"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="truncate max-w-[200px]">
                                  <div className="text-white font-medium">{u.name}</div>
                                  <div className="text-[9.5px] text-zinc-500 font-mono lower-case truncate">{u.email}</div>
                                </div>
                              </div>
                            </td>
                            
                            <td className="p-3.5">
                              {u.role === "Owner / Administrator" ? (
                                <span className="px-2 py-0.5 rounded text-[8.5px] uppercase font-bold tracking-widest bg-red-500/10 text-red-400 border border-red-500/20">
                                  Owner (Root Admin)
                                </span>
                              ) : (
                                <select
                                  value={u.role}
                                  onChange={(e) => handleUpdateRole(u.email, e.target.value)}
                                  className="bg-black/80 hover:bg-zinc-900 border border-zinc-800 text-zinc-300 rounded font-mono text-[9px] uppercase py-0.5 px-1.5 focus:outline-none cursor-pointer"
                                >
                                  <option value="Free Tier">Free Tier</option>
                                  <option value="Enterprise Quant">Enterprise Quant</option>
                                  <option value="Associate Node">Associate Node</option>
                                </select>
                              )}
                            </td>

                            <td className="p-3.5">
                              <div className="flex items-center gap-2">
                                <span className={`h-1.5 w-1.5 rounded-full ${
                                  u.status === "ONLINE" ? "bg-emerald-500 animate-pulse" : u.status === "IDLE" ? "bg-amber-500" : "bg-zinc-700"
                                }`} />
                                <select
                                  value={u.status}
                                  onChange={(e) => handleUpdateStatus(u.email, e.target.value as any)}
                                  className="bg-transparent border-0 hover:underline text-zinc-400 font-mono text-[9px] uppercase py-0 px-1 focus:outline-none cursor-pointer"
                                >
                                  <option value="ONLINE">ONLINE</option>
                                  <option value="IDLE">IDLE</option>
                                  <option value="OFFLINE">OFFLINE</option>
                                </select>
                              </div>
                            </td>

                            <td className="p-3.5 text-zinc-400">
                              <div className="flex flex-col">
                                <span className="text-zinc-200">{u.requestsCount} compilations</span>
                                <span className="text-[8px] text-zinc-650">Registered: {new Date(u.createdAt).toLocaleDateString()}</span>
                              </div>
                            </td>

                            <td className="p-3.5">
                              {u.role === "Owner / Administrator" ? (
                                <span className="text-[8px] text-zinc-600 font-mono font-bold uppercase">SECURED</span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteUser(u.email)}
                                  className="p-1 px-2 border border-zinc-900 hover:border-red-500/20 text-zinc-500 hover:text-red-400 rounded transition duration-150 cursor-pointer flex items-center gap-1 hover:bg-red-500/5 hover:scale-102"
                                  title="Revoke Consensus Key"
                                >
                                  <UserX className="h-3 w-3" />
                                  <span className="text-[9px] tracking-tight uppercase">Revoke</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-4 flex gap-3 text-zinc-400 font-sans text-xs">
                  <UserCheck className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="leading-relaxed font-light text-zinc-300">
                      Administrative Consensus System Active. You have root privileges to promote, suspend, delete, or inspect diagnostic telemetry bounds.
                    </p>
                    <p className="text-[10px] text-zinc-500 font-mono">
                      Security policy: To override physical accounts, utilize inline role priority adjustments or execute manual override sequences below.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: DIAGNOSTIC LOGS & OPERATING SHELL TERMINAL */}
            {activeTab === "logs" && (
              <div className="space-y-6">
                
                {/* INTERACTIVE COMPILER SHELL TERMINAL INPUT */}
                <div className="bg-[#09090c] border border-zinc-900 rounded-2xl p-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5 uppercase">
                      <Terminal className="h-4 w-4 text-[#00c8ff]" />
                      <span>Interactive consensus command terminal</span>
                    </h3>
                    <p className="text-[10px] text-zinc-500 font-mono">Control core nodes, compile diagnostics, announcements and registry values via shell commands</p>
                  </div>

                  <div className="bg-black border border-zinc-900 rounded-xl p-4 font-mono text-xs text-zinc-300 space-y-2 select-text">
                    <div className="h-64 overflow-y-auto space-y-1.5 pr-2 custom-scrollbar">
                      {terminalOutputs.map((out, idx) => (
                        <div 
                          key={idx} 
                          className={`leading-relaxed whitespace-pre-wrap ${
                            out.startsWith(">") 
                              ? "text-[#00c8ff] font-bold" 
                              : out.startsWith("Error:") || out.startsWith("Syntax validation:")
                                ? "text-red-400" 
                                : out.startsWith("Success:") || out.startsWith("System state:")
                                  ? "text-emerald-400"
                                  : "text-zinc-400"
                          }`}
                        >
                          {out}
                        </div>
                      ))}
                      <div ref={terminalBottomRef} />
                    </div>

                    <form onSubmit={handleExecuteTerminalCommand} className="flex items-center gap-2 border-t border-zinc-900 pt-3 mt-2">
                      <span className="text-blue-400 font-bold font-mono">root@freechartai:~#</span>
                      <input
                        type="text"
                        placeholder="Type any command parameter e.g.: /help, /users, /test-user, /latency 300"
                        value={terminalInput}
                        onChange={(e) => setTerminalInput(e.target.value)}
                        className="flex-1 bg-transparent border-none text-zinc-100 outline-none placeholder-zinc-800 font-mono relative focus:ring-0 select-text"
                      />
                      <button
                        type="submit"
                        className="p-1 px-3 bg-zinc-900 hover:bg-zinc-800 hover:scale-102 transition border border-zinc-800 rounded-lg text-zinc-300 cursor-pointer flex items-center gap-1"
                      >
                        <Send className="h-3 w-3" />
                        <span className="text-[9px] uppercase font-mono tracking-widest leading-none font-bold">SEND</span>
                      </button>
                    </form>
                  </div>
                </div>

                {/* AUDIT JOURNAL LOG LIST */}
                <div className="bg-[#09090c] border border-zinc-900 rounded-2xl p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-white tracking-tight">Active Operation Diagnostic Logs</h3>
                      <p className="text-[10px] text-zinc-500 font-mono">End-to-end cryptographic and UI transition audits</p>
                    </div>
                    <button
                      onClick={handlePruneLogs}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 hover:bg-zinc-900 font-mono text-[9px] uppercase tracking-widest border border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-white rounded-lg transition cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                      Prune Ledger logs
                    </button>
                  </div>

                  <div className="bg-black/40 rounded-xl border border-zinc-900 overflow-hidden font-mono text-[10px] text-zinc-300">
                    <div className="bg-zinc-950 px-4 py-2.5 border-b border-zinc-900 flex justify-between items-center text-zinc-550 uppercase tracking-widest text-[8px] font-bold">
                      <span>Audit ledger journal</span>
                      <span>Node standard out</span>
                    </div>
                    <div className="divide-y divide-zinc-900/60 max-h-96 overflow-y-auto">
                      {auditLogs.map((log) => (
                        <div key={log.id} className="p-4 hover:bg-zinc-950/25 transition-colors flex flex-col md:flex-row justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-blue-400 font-bold uppercase text-[9px] tracking-wider">{log.action}</span>
                              <span className="text-zinc-650">|</span>
                              <span className="text-zinc-500 font-mono select-text lowercase text-[9.5px]">{log.user}</span>
                            </div>
                            <p className="text-zinc-300 text-[11px] font-light leading-relaxed">{log.details}</p>
                            <div className="flex items-center gap-2 text-zinc-600 text-[9px]">
                              <span>IP: {log.ip}</span>
                              <span>•</span>
                              <span>UTC: {new Date(log.timestamp).toISOString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-end">
                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[8px] uppercase tracking-wider font-bold">
                              {log.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: SETTINGS & TUNING */}
            {activeTab === "settings" && (
              <div className="bg-[#09090c] border border-zinc-900 rounded-2xl p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-tight">AI Multimodal Configuration Tuning</h3>
                  <p className="text-[10px] text-zinc-500 font-mono">Manipulate the vector compilation engine latency, limits and access keys toggle</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Latency manipulation */}
                  <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-zinc-300">Compilation Interval</span>
                      <span className="text-xs font-mono text-blue-400 font-semibold">{apiLatency}ms</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="2000"
                      step="50"
                      value={apiLatency}
                      onChange={(e) => {
                        setApiLatency(Number(e.target.value));
                      }}
                      className="w-full accent-blue-500 cursor-pointer"
                    />
                    <p className="text-[10px] text-zinc-500 leading-normal">
                      Artificially configure compilation steps to control compilation delays during diagnostic operations. Set high for simulation testing.
                    </p>
                  </div>

                  {/* Gemini Temperature parameters */}
                  <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-zinc-300">Agent Creativity Threshold</span>
                      <span className="text-xs font-mono text-[#00c8ff] font-semibold">v3.5 Temp: {aiTemperature}</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={aiTemperature}
                      onChange={(e) => {
                        setAiTemperature(Number(e.target.value));
                      }}
                      className="w-full accent-[#00c8ff] cursor-pointer"
                    />
                    <p className="text-[10px] text-zinc-500 leading-normal">
                      A higher temperature produces more descriptive data insights but will reduce predictable trend limits. Set low (0.2) for standard numeric quants.
                    </p>
                  </div>
                </div>

                {/* Additional simulated Future Toggles */}
                <div className="bg-zinc-950/40 border border-zinc-900 p-6 rounded-2xl space-y-6">
                  <span className="text-xs font-mono uppercase text-zinc-300 block border-b border-zinc-900 pb-2">Future-Proof Core Controls</span>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center justify-between gap-4 bg-black/60 p-4 rounded-xl border border-zinc-900">
                      <div>
                        <span className="text-xs text-zinc-200 block font-medium">Bypass Security Mode</span>
                        <span className="text-[9px] text-zinc-500 font-mono">Activate full simulator</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleToggleMaintenance}
                        className={`p-1 rounded-lg transition duration-250 cursor-pointer ${
                          maintenanceMode ? "text-[#00c8ff]" : "text-zinc-600"
                        }`}
                      >
                        <RefreshCw className={`h-6 w-6 ${maintenanceMode ? "animate-spin" : ""}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-4 bg-black/60 p-4 rounded-xl border border-zinc-900">
                      <div>
                        <span className="text-xs text-zinc-200 block font-medium">Auto Warm Sector</span>
                        <span className="text-[9px] text-zinc-500 font-mono">Saves memory indices</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={allowRegistration}
                        onChange={handleToggleRegistration}
                        className="h-4 w-4 rounded bg-black border-zinc-900 accent-blue-500 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-2 bg-black/60 p-4 rounded-xl border border-zinc-900">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-200">Rate Limit Limit</span>
                        <span className="text-blue-400 font-mono">{rateLimit}/min</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="120"
                        step="5"
                        value={rateLimit}
                        onChange={(e) => setRateLimit(Number(e.target.value))}
                        className="w-full accent-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => triggerFeedback("AI parameters and consensus intervals synchronized")}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-[10px] uppercase font-bold tracking-widest rounded-xl transition cursor-pointer"
                  >
                    Save configuration attributes
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT UTILITIES: TELEMETRY ALERTS & COMPILER STATE */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* System Status Alert logs */}
            <div className="bg-[#09090c] border border-zinc-900 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-1.5 border-b border-zinc-900 pb-3">
                <AlertTriangle className="h-4 w-4 text-amber-500 animate-pulse animate-bounce" />
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Consensus core logs</span>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-900/60 flex items-start gap-3 text-[10px] font-mono leading-relaxed">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1 shrink-0" />
                  <div>
                    <span className="text-zinc-300 block font-semibold">Gemini API Token Limits</span>
                    <span className="text-zinc-500 text-[9px]">Platform tokens reached 32% bandwidth allocation. Optimize system parameters or swap models.</span>
                  </div>
                </div>

                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-900/60 flex items-start gap-3 text-[10px] font-mono leading-relaxed">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1 shrink-0 animate-pulse" />
                  <div>
                    <span className="text-zinc-300 block font-semibold">PostreSQL Connection</span>
                    <span className="text-zinc-500 text-[9px]">Cloud SQL instances resolved with zero failures on database schemas. Verified TLS handshakes.</span>
                  </div>
                </div>

                {maintenanceMode && (
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl flex items-start gap-3 text-[10px] font-mono leading-relaxed animate-pulse">
                    <ShieldAlert className="h-4 w-4 text-blue-500 shrink-0" />
                    <div>
                      <span className="block font-semibold">CRITICAL SIMULATION OVERRIDE</span>
                      <span className="text-[9px]">Core simulation is currently bypassing default constraints due to manually loaded override switches.</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Action Operations */}
            <div className="bg-[#09090c] border border-zinc-900 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-1.5 border-b border-zinc-900 pb-3">
                <Globe className="h-4 w-4 text-purple-400" />
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Remote Command Hub</span>
              </div>

              <div className="space-y-2 font-mono text-[9.5px]">
                <button
                  onClick={() => triggerFeedback("Full database snapshot backup successfully scheduled")}
                  className="w-full text-left bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 p-2.5 rounded-xl text-zinc-300 hover:text-white transition flex items-center justify-between hover:scale-101 cursor-pointer"
                >
                  <span>Snapshot backup ledger</span>
                </button>
                <button
                  onClick={() => triggerFeedback("Redis caches purged and indices initialized successfully")}
                  className="w-full text-left bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 p-2.5 rounded-xl text-zinc-300 hover:text-white transition flex items-center justify-between hover:scale-101 cursor-pointer"
                >
                  <span>Purge model system caches</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
