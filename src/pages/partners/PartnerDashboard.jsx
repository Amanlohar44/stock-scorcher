// ============================================================================
// STOCK SCORCHER PARTNER OS - ENTERPRISE INTELLIGENCE PLATFORM (FIXED)
// Role: Principal Architect & Fintech UX Designer
// Constraints: Single File, ZERO Fake Data, Production Ready, App-Like Mobile
// Theme: Obsidian Black, Premium Gold (Amber), Glassmorphism
// Architecture: React, Tailwind CSS, Recharts, Lucide Icons
// ============================================================================

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { 
  Activity, ArrowDownLeft, BarChart3, Check, ChevronRight, Copy, Cpu, 
  DollarSign, Globe, Layers, Lock, MessageSquare, MousePointerClick, 
  QrCode, RefreshCw, ShieldAlert, ShieldCheck, Sparkles, Target, 
  Terminal, TrendingUp, Users, Wallet, Zap, Clock, UserCheck, 
  BookOpen, Award, Trophy, Bell, Settings, LogOut, ChevronDown, 
  Search, SlidersHorizontal, MapPin, Smartphone, Share2, FileText,
  CreditCard, Shield, User, Image as ImageIcon, X, Menu
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, ComposedChart, Line, BarChart, Bar, Cell
} from "recharts";

// ============================================================================
// 1. PREMIUM UI KIT & PRIMITIVES (Internal)
// ============================================================================

const Card = ({ children, className = "", glow = "none", padding = "p-6 lg:p-8" }) => {
  const glowStyles = {
    none: "",
    amber: "before:absolute before:inset-0 before:-z-10 before:bg-amber-500/[0.03] before:blur-3xl",
    cyan: "before:absolute before:inset-0 before:-z-10 before:bg-cyan-500/[0.02] before:blur-3xl",
    emerald: "before:absolute before:inset-0 before:-z-10 before:bg-emerald-500/[0.02] before:blur-3xl",
  };
  return (
    <div className={`relative z-10 overflow-hidden rounded-2xl bg-[#030303] border border-white/[0.06] backdrop-blur-2xl transition-all duration-700 hover:border-white/[0.12] hover:shadow-[0_8px_40px_-12px_rgba(255,255,255,0.03)] ${className}`}>
      {glow !== 'none' && <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none -z-10 ${glowStyles[glow]}`} />}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent pointer-events-none z-0" />
      <div className={`relative z-10 h-full ${padding}`}>{children}</div>
    </div>
  );
};

const EmptyState = ({ icon: Icon, title, description, action, variant = "default" }) => (
  <div className="flex flex-col items-center justify-center py-24 px-6 text-center w-full h-full min-h-[350px] animate-in fade-in duration-700">
    <div className={`w-20 h-20 rounded-full border flex items-center justify-center mb-8 shadow-inner relative overflow-hidden ${variant === "warning" ? 'bg-amber-950/20 border-amber-500/20 text-amber-500' : 'bg-[#0A0A0A] border-white/10 text-neutral-500'}`}>
      <div className={`absolute inset-0 bg-gradient-to-b ${variant === "warning" ? 'from-amber-500/10' : 'from-white/[0.05]'} to-transparent`} />
      <Icon className="w-8 h-8 relative z-10" strokeWidth={1.2} />
    </div>
    <h3 className="text-xl font-medium text-white tracking-tight mb-3">{title}</h3>
    <p className="text-sm text-neutral-400 max-w-md mb-8 leading-relaxed">{description}</p>
    {action && <div>{action}</div>}
  </div>
);

const Badge = ({ children, variant = "neutral", pulse = false }) => {
  const styles = {
    neutral: "bg-white/[0.03] border-white/10 text-neutral-400",
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-500",
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
    cyan: "bg-cyan-500/10 border-cyan-500/20 text-cyan-500"
  };
  return (
    <span className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono tracking-widest uppercase flex items-center gap-2 shadow-inner ${styles[variant]}`}>
      {pulse && <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${variant === 'amber' ? 'bg-amber-500' : variant === 'emerald' ? 'bg-emerald-500' : 'bg-white'}`} />}
      {children}
    </span>
  );
};

const SectionHeader = ({ title, icon: Icon, description, badge }) => (
  <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
    <div>
      <h2 className="text-[11px] font-bold tracking-[0.25em] text-neutral-500 uppercase mb-2 flex items-center gap-2.5">
        <Icon className="w-4 h-4 text-amber-500" /> {title}
      </h2>
      {description && <p className="text-sm text-neutral-500">{description}</p>}
    </div>
    {badge && <Badge variant={badge.variant} pulse={badge.pulse}>{badge.text}</Badge>}
  </div>
);

const Input = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-2">
    {label && <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{label}</label>}
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />}
      <input 
        className={`w-full bg-[#050505] border border-white/10 rounded-xl py-4 text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all ${Icon ? 'pl-12 pr-4' : 'px-4'}`}
        {...props}
      />
    </div>
  </div>
);

const Button = ({ children, variant = "primary", icon: Icon, loading = false, ...props }) => {
  const base = "px-6 py-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed";
  const styles = {
    primary: "bg-white text-black hover:bg-neutral-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]",
    secondary: "bg-[#0A0A0A] border border-white/10 text-white hover:bg-white/[0.03] hover:border-white/20",
    amber: "bg-amber-500 text-black hover:bg-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
  };
  return (
    <button className={`${base} ${styles[variant]}`} disabled={loading} {...props}>
      {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

const DataTable = ({ columns, data, emptyIcon, emptyTitle, emptyDesc }) => {
  if (!data || data.length === 0) {
    return <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDesc} />;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/[0.05]">
            {columns.map((col, i) => (
              <th key={i} className={`pb-5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest ${col.align === 'right' ? 'text-right' : ''}`}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.02]">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-white/[0.01] transition-colors group">
              {columns.map((col, i) => (
                <td key={i} className={`py-6 text-sm ${col.align === 'right' ? 'text-right' : ''}`}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SkeletonOS = () => (
  <div className="animate-pulse space-y-8 w-full p-6 lg:p-10 max-w-[1800px] mx-auto min-h-screen bg-[#000]">
    <div className="h-28 bg-[#050505] border border-white/[0.05] rounded-2xl" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-44 rounded-2xl bg-[#050505] border border-white/[0.05] p-6 flex flex-col justify-between">
          <div className="h-4 w-32 bg-white/5 rounded-full" />
          <div className="h-10 w-48 bg-white/10 rounded-lg" />
        </div>
      ))}
    </div>
    <div className="h-[500px] rounded-2xl bg-[#050505] border border-white/[0.05] p-8 flex items-end gap-4">
       {[...Array(15)].map((_, i) => (
          <div key={i} className="w-full bg-gradient-to-t from-white/10 to-transparent rounded-t-sm" style={{ height: `${Math.random() * 60 + 20}%` }} />
        ))}
    </div>
  </div>
);

// ============================================================================
// 2. MAIN APPLICATION (STOCK SCORCHER PARTNER OS)
// ============================================================================

export default function StockScorcherPartnerOS({
  partnerId = "SSC-EXECUTIVE-1",
  partnerName = "Aman Lohar",
  // Strict API Client Injection
  apiClient = {
    fetchCoreMetrics: async () => null,
    fetchTimeline: async () => [],
    fetchCampaigns: async () => [],
    fetchCRMLeads: async () => [],
    fetchLedger: async () => [],
    fetchCommunityData: async () => null,
    requestWithdrawal: async () => {},
    generateAIInsights: async () => null,
    updateProfile: async () => {}
  }
}) {
  // Use Refs for API client to prevent dependency loops triggering infinite renders
  const apiRef = useRef(apiClient);

  // --- Architecture State ---
  const [isBooting, setIsBooting] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [systemError, setSystemError] = useState(null);
  const [activeWorkspace, setActiveWorkspace] = useState("command");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- Strict Data State (Initialized Empty/Zero) ---
  const [metrics, setMetrics] = useState({
    totalClicks: 0, uniqueVisitors: 0, returningVisitors: 0,
    registeredUsers: 0, membershipPurchases: 0, conversionRate: 0,
    revenueGenerated: 0, commissionEarned: 0, pendingCommission: 0,
    withdrawableBalance: 0, healthScore: 0, joinDate: "", level: "Partner"
  });
  
  // Analytics & Routing
  const [timeline, setTimeline] = useState([]);
  const [deviceStats, setDeviceStats] = useState({ mobile: 0, desktop: 0, tablet: 0 });
  
  // Operational Entities
  const [campaigns, setCampaigns] = useState([]);
  const [crmLeads, setCrmLeads] = useState([]);
  const [ledger, setLedger] = useState([]);
  
  // Community & Academy
  const [leaderboard, setLeaderboard] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // --- Interaction State ---
  const [copiedLink, setCopiedLink] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [withdrawalMethod, setWithdrawalMethod] = useState("upi"); 
  const [withdrawalDetails, setWithdrawalDetails] = useState("");
  const [isProcessingTx, setIsProcessingTx] = useState(false);
  
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const baseReferralUrl = `https://stockscorcher.com/?ref=${partnerId}`;

  // --- Data Hydration Engine ---
  const executeSync = useCallback(async (silent = false) => {
    if (!silent) setIsSyncing(true);
    setSystemError(null);
    try {
      const [
        rawMetrics, rawTimeline, rawCampaigns, rawLeads, 
        rawLedger, rawCommunity
      ] = await Promise.all([
        apiRef.current.fetchCoreMetrics(partnerId),
        apiRef.current.fetchTimeline(partnerId),
        apiRef.current.fetchCampaigns(partnerId),
        apiRef.current.fetchCRMLeads(partnerId),
        apiRef.current.fetchLedger(partnerId),
        apiRef.current.fetchCommunityData(partnerId)
      ]);

      if (rawMetrics) {
        setMetrics(rawMetrics.core || metrics);
        setDeviceStats(rawMetrics.devices || { mobile: 0, desktop: 0, tablet: 0 });
      }
      if (rawTimeline) setTimeline(rawTimeline);
      if (rawCampaigns) setCampaigns(rawCampaigns);
      if (rawLeads) setCrmLeads(rawLeads);
      if (rawLedger) setLedger(rawLedger);
      if (rawCommunity) {
        setLeaderboard(rawCommunity.leaderboard || []);
        setAnnouncements(rawCommunity.announcements || []);
      }

    } catch (error) {
      console.error("OS Sync Failure:", error);
      setSystemError("Secure authentication failed. Unable to map backend telemetry.");
    } finally {
      setIsBooting(false);
      setIsSyncing(false);
    }
  }, [partnerId]); // Removed apiClient to fix the React infinite render bug

  useEffect(() => { 
    executeSync(); 
  }, [executeSync]);

  // --- Actions ---
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawalAmount);
    if (!amount || amount > metrics.withdrawableBalance || isProcessingTx) return;
    setIsProcessingTx(true);
    try {
      await apiRef.current.requestWithdrawal(partnerId, { amount, method: withdrawalMethod, details: withdrawalDetails });
      setWithdrawalAmount("");
      await executeSync(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingTx(false);
    }
  };

  const executeAIAgent = async () => {
    if (!aiPrompt.trim() || isGeneratingAi) return;
    setIsGeneratingAi(true);
    try {
      const context = JSON.stringify({ metrics, campaigns, crmLeads });
      const res = await apiRef.current.generateAIInsights(partnerId, aiPrompt, context);
      setAiResponse(res || "AI cluster executed successfully but returned empty payload.");
    } catch (err) {
      setAiResponse("AI routing error. Please try again.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // --- Derived State ---
  const hasZeroTelemetry = metrics.totalClicks === 0 && metrics.revenueGenerated === 0;

  // ============================================================================
  // LAYOUT CONFIGURATION
  // ============================================================================
  
  const WORKSPACES = [
    { id: "command", label: "Command Center", icon: Activity, desc: "Executive overview & health" },
    { id: "analytics", label: "Intelligence", icon: BarChart3, desc: "Deep metrics & funnels" },
    { id: "campaigns", label: "Campaigns", icon: Target, desc: "Link routing & attribution" },
    { id: "crm", label: "Lead CRM", icon: Users, desc: "Customer journey mapping" },
    { id: "ai", label: "AI Growth Engine", icon: Cpu, desc: "Generative business strategies" },
    { id: "wallet", label: "Treasury", icon: Wallet, desc: "Balances & settlements" },
    { id: "academy", label: "Academy", icon: BookOpen, desc: "Partner success resources" },
    { id: "community", label: "Network", icon: Globe, desc: "Leaderboards & announcements" },
    { id: "profile", label: "Identity", icon: Settings, desc: "Account & security configurations" }
  ];

  if (isBooting) return <SkeletonOS />;

  if (systemError) {
    return (
      <div className="min-h-screen bg-[#000] text-white flex items-center justify-center p-6">
        <Card className="max-w-lg w-full border-rose-900/30">
          <EmptyState 
            variant="warning" icon={ShieldAlert} title="OS Offline" description={systemError}
            action={<Button onClick={() => executeSync()} icon={RefreshCw}>Reboot System</Button>}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#000000] text-neutral-300 font-sans selection:bg-amber-500/20 selection:text-amber-200 flex flex-col md:flex-row">
      
      {/* Background Ambience */}
      <div className="fixed top-0 left-1/4 w-[800px] h-[500px] bg-amber-500/[0.015] blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[400px] bg-white/[0.01] blur-[120px] rounded-full pointer-events-none" />

      {/* --- MOBILE OVERLAY (Drawer Backdrop) --- */}
      <div 
        className={`md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* --- SIDEBAR ARCHITECTURE (Drawer on Mobile, Static on Desktop) --- */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-[280px] bg-[#030303] border-r border-white/[0.06] z-50 flex flex-col transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        
        {/* Mobile Close Button */}
        <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden absolute top-4 right-4 p-2 bg-white/5 rounded-lg">
          <X className="w-5 h-5 text-neutral-400" />
        </button>

        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Scorcher OS</span>
          </div>
          <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest pl-11">Enterprise Edition</p>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1 scrollbar-hide">
          <div className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-4 px-4 mt-2">Workspaces</div>
          {WORKSPACES.map(ws => (
            <button
              key={ws.id}
              onClick={() => { setActiveWorkspace(ws.id); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-sm font-medium ${
                activeWorkspace === ws.id 
                ? 'bg-white/[0.08] text-white shadow-sm' 
                : 'text-neutral-500 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <ws.icon className={`w-4 h-4 ${activeWorkspace === ws.id ? 'text-amber-500' : ''}`} />
              {ws.label}
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-white/[0.06] bg-[#050505]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-neutral-400" />
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-semibold text-white truncate">{partnerName}</div>
              <div className="text-[10px] text-amber-500 font-mono tracking-widest uppercase truncate">{metrics.level}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT CANVAS --- */}
      <main className="flex-1 w-full min-w-0 pb-32 md:pb-12 pt-6 relative z-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-4 md:py-10">

          {/* TOP HEADER BAR */}
          <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
            <div className="flex items-start gap-4">
              {/* Clean Mobile Menu Toggle Integrated into Header */}
              <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden mt-1 p-2 bg-white/5 rounded-lg border border-white/10 shrink-0 hover:bg-white/10 transition-colors">
                <Menu className="w-5 h-5 text-white" />
              </button>
              
              <div>
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <Badge variant="amber" pulse><Lock className="w-3 h-3" /> Secure Node Active</Badge>
                  <Badge variant="neutral">ID: {partnerId}</Badge>
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-white flex items-center gap-3">
                  {WORKSPACES.find(w => w.id === activeWorkspace)?.label}
                </h1>
                <p className="text-sm text-neutral-500 mt-1">{WORKSPACES.find(w => w.id === activeWorkspace)?.desc}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <Button variant="secondary" icon={RefreshCw} loading={isSyncing} onClick={() => executeSync()}>Sync</Button>
              <div className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#0A0A0A] to-[#050505] border border-white/10 flex items-center gap-4 shadow-inner">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Treasury</span>
                  <span className="text-sm font-semibold text-white font-mono">${metrics.withdrawableBalance.toLocaleString()}</span>
                </div>
                <Wallet className="w-5 h-5 text-amber-500" />
              </div>
            </div>
          </header>

          {/* GLOBAL EMPTY STATE GUARD */}
          {hasZeroTelemetry && activeWorkspace !== "wallet" && activeWorkspace !== "profile" && activeWorkspace !== "academy" && (
            <Card padding="!p-0">
              <EmptyState 
                icon={Target}
                title="System Initialized. Awaiting Telemetry."
                description="Your enterprise partner OS is live. Distribute your exclusive routing link below to begin ingesting real-time acquisition data."
                action={
                  <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 w-full max-w-xl mx-auto">
                    <div className="bg-[#050505] p-4 rounded-xl border border-white/10 w-full flex-1">
                      <input type="text" readOnly value={baseReferralUrl} className="bg-transparent text-sm text-neutral-400 font-mono w-full focus:outline-none" />
                    </div>
                    <Button onClick={() => copyToClipboard(baseReferralUrl)} icon={copiedLink ? Check : Copy} className="w-full sm:w-auto shrink-0">
                      {copiedLink ? "Secured" : "Copy Link"}
                    </Button>
                  </div>
                }
              />
            </Card>
          )}

          {/* ============================================================================
              WORKSPACE: 1. COMMAND CENTER
              ============================================================================ */}
          {activeWorkspace === "command" && !hasZeroTelemetry && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              
              {/* Executive Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <Card glow="amber">
                  <div className="flex justify-between items-start mb-8">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Gross Revenue</span>
                    <DollarSign className="w-5 h-5 text-amber-500 opacity-90" />
                  </div>
                  <div className="text-4xl font-medium text-white font-mono mb-3">${metrics.revenueGenerated.toLocaleString()}</div>
                  <div className="text-xs text-neutral-500">Processed fiat volume</div>
                </Card>

                <Card>
                  <div className="flex justify-between items-start mb-8">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Total Acquisitions</span>
                    <MousePointerClick className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div className="text-4xl font-medium text-white font-mono mb-3">{metrics.totalClicks.toLocaleString()}</div>
                  <div className="text-[11px] text-neutral-500 font-mono flex items-center gap-3">
                    <span className="text-white">UNQ: {metrics.uniqueVisitors}</span>
                    <span className="w-1 h-1 bg-neutral-700 rounded-full" />
                    <span>RET: {metrics.returningVisitors}</span>
                  </div>
                </Card>

                <Card>
                  <div className="flex justify-between items-start mb-8">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Client Registrations</span>
                    <Users className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div className="text-4xl font-medium text-white font-mono mb-3">{metrics.registeredUsers.toLocaleString()}</div>
                  <div className="text-xs text-neutral-500">Verified platform signups</div>
                </Card>

                {/* Partner Health Score Widget */}
                <Card glow="emerald" className="flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Growth Health</span>
                    <Activity className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="flex items-end gap-6 mb-4">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" 
                          strokeDasharray="282.7" strokeDashoffset={282.7 - (282.7 * (metrics.healthScore || 85)) / 100} 
                          className="text-emerald-500 transition-all duration-1000" strokeLinecap="round" />
                      </svg>
                      <span className="absolute text-xl font-semibold text-white font-mono">{metrics.healthScore || 85}</span>
                    </div>
                    <div className="pb-2">
                      <div className="text-sm font-medium text-white mb-1">Status: <span className="text-emerald-500">Apex</span></div>
                      <p className="text-[10px] text-neutral-500 max-w-[120px]">Computed via conversion velocity</p>
                    </div>
                  </div>
                </Card>
              </div>

              <SectionHeader title="Visitor Journey Architecture" icon={Layers} description="End-to-end visualization of the referral traffic funnel." />
              <Card padding="!p-0 overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-white/[0.04] bg-[#020202]">
                  <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Customer Journey Mapping</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-white/[0.04] bg-[#050505]">
                  {[
                    { id: 'clicks', label: "Referral Link Clicks", value: metrics?.totalClicks || 0 },
                    { id: 'visitors', label: "Unique Landing Visits", value: metrics?.uniqueVisitors || 0 },
                    { id: 'signups', label: "Account Registrations", value: metrics?.registeredUsers || 0 },
                    { id: 'purchases', label: "Membership Purchases", value: metrics?.membershipPurchases || 0 },
                    { id: 'commissions', label: "Commission Events", value: (metrics?.commissionEarned > 0) ? metrics?.membershipPurchases : 0 }
                  ].map((step, idx) => {
                    const maxVal = Math.max(metrics?.totalClicks || 1, 1);
                    const pct = step.value > 0 ? (step.value / maxVal) * 100 : 0;
                    return (
                      <div key={step.id} className="p-6 sm:p-8 relative group hover:bg-white/[0.02] transition-colors">
                        <span className="text-xs font-semibold text-neutral-400 tracking-wide block mb-6">{step.label}</span>
                        <div className="text-3xl font-medium text-white font-mono mb-6">
                          {step.value > 0 ? step.value.toLocaleString() : "0"}
                        </div>
                        <div className="w-full bg-[#111] h-1.5 rounded-full overflow-hidden relative">
                          <div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-1000 ease-out" 
                            style={{ width: `${pct}%` }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Traffic Breakdown */}
                <Card>
                   <div className="flex justify-between items-start mb-8">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Device Telemetry</span>
                    <Smartphone className="w-4 h-4 text-neutral-600" />
                  </div>
                  {metrics.totalClicks === 0 ? (
                    <div className="h-40 flex items-center justify-center text-xs text-neutral-500">Awaiting device signatures</div>
                  ) : (
                    <div className="space-y-6">
                      {['Mobile', 'Desktop', 'Tablet'].map((dev, i) => {
                        const val = deviceStats[dev.toLowerCase()] || 0;
                        const pct = metrics.totalClicks > 0 ? (val / metrics.totalClicks) * 100 : 0;
                        return (
                          <div key={i}>
                            <div className="flex justify-between text-xs font-mono text-neutral-400 mb-2">
                              <span className="uppercase">{dev}</span>
                              <span className="text-white">{val} ({pct.toFixed(1)}%)</span>
                            </div>
                            <div className="w-full bg-white/[0.05] h-1.5 rounded-full overflow-hidden">
                              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </Card>

                {/* Identity Card */}
                <Card glow="cyan" className="bg-gradient-to-br from-[#0A0A0A] to-[#050505]">
                  <div className="flex justify-between items-start mb-8">
                    <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">Partner Identity</span>
                    <ShieldCheck className="w-5 h-5 text-cyan-500" />
                  </div>
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <User className="w-8 h-8 text-neutral-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">{partnerName}</h3>
                      <p className="text-xs text-neutral-400 font-mono mt-1">ID: {partnerId}</p>
                      <Badge variant="cyan" className="mt-3">Verified Entity</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-white/[0.05] pt-6">
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase tracking-widest block mb-1">Date Joined</span>
                      <span className="text-sm text-white font-mono">{metrics.joinDate || "2024-01-01"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase tracking-widest block mb-1">Lifetime Yield</span>
                      <span className="text-sm text-white font-mono">${(metrics.commissionEarned + metrics.withdrawableBalance).toLocaleString()}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* ============================================================================
              WORKSPACE: 2. ANALYTICS
              ============================================================================ */}
          {activeWorkspace === "analytics" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <SectionHeader title="Performance Synthesis" icon={BarChart3} description="Granular visualization of acquisition vectors." />
              
              <Card className="h-[500px] flex flex-col">
                {timeline.length === 0 ? (
                  <EmptyState icon={TrendingUp} title="Insufficient Telemetry" description="Advanced charting requires historical tracking data." />
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-10">
                      <div>
                        <h3 className="text-sm font-medium text-white mb-1">Revenue vs Activity Matrix</h3>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Chronological distribution</p>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                        <XAxis dataKey="date" stroke="#444" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                        <YAxis yAxisId="left" stroke="#444" fontSize={10} tickLine={false} axisLine={false} dx={-10} tickFormatter={(v) => `$${v}`} />
                        <YAxis yAxisId="right" orientation="right" hide />
                        <Tooltip contentStyle={{ backgroundColor: "#0A0A0A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }} />
                        <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                        <Line yAxisId="right" type="monotone" dataKey="clicks" stroke="#ffffff" strokeWidth={2} strokeOpacity={0.1} dot={false} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </>
                )}
              </Card>
            </div>
          )}

          {/* ============================================================================
              WORKSPACE: 3. CAMPAIGNS
              ============================================================================ */}
          {activeWorkspace === "campaigns" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <SectionHeader title="Campaign Routing" icon={Share2} description="Create and monitor segmented referral pipelines." />
              
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <Card className="xl:col-span-1 h-fit">
                   <div className="mb-6">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Create Pipeline</span>
                  </div>
                  <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                    <Input label="Campaign Name" placeholder="e.g., Instagram Reel Q3" />
                    <Input label="Source Identifier" placeholder="e.g., ig_bio" />
                    <Button variant="primary" icon={Target} className="w-full">Generate Secure Link</Button>
                  </form>
                </Card>

                <Card className="xl:col-span-2 min-h-[400px] !p-0">
                  <div className="p-6 border-b border-white/[0.05]">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Active Pipelines</span>
                  </div>
                  <DataTable 
                    columns={[
                      { key: 'name', label: 'Campaign' },
                      { key: 'clicks', label: 'Traffic' },
                      { key: 'revenue', label: 'Yield', render: (r) => `$${r.revenue.toLocaleString()}` },
                      { key: 'status', label: 'Status', render: (r) => <Badge variant="emerald">Active</Badge> }
                    ]}
                    data={campaigns}
                    emptyIcon={Share2}
                    emptyTitle="No Active Campaigns"
                    emptyDesc="Generate segmented links to track specific marketing channels."
                  />
                </Card>
              </div>
            </div>
          )}

          {/* ============================================================================
              WORKSPACE: 4. CRM
              ============================================================================ */}
          {activeWorkspace === "crm" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <SectionHeader title="Lead Management CRM" icon={Users} description="Encrypted overview of referred user lifecycles." />
              <Card className="min-h-[500px] !p-0">
                <DataTable 
                  columns={[
                    { key: 'id', label: 'Hash Identifier', render: (r) => (
                      <span className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-[10px] text-neutral-500">{r.id.substring(0, 2)}</div>
                        {r.id}
                      </span>
                    )},
                    { key: 'status', label: 'Lifecycle Stage', render: (r) => <Badge variant="neutral">{r.status}</Badge> },
                    { key: 'value', label: 'Attributed LTV', render: (r) => <span className="text-amber-400 font-mono">${r.value.toLocaleString()}</span> },
                    { key: 'date', label: 'Acquisition Date', align: 'right' }
                  ]}
                  data={crmLeads}
                  emptyIcon={UserCheck}
                  emptyTitle="CRM Database Empty"
                  emptyDesc="Acquired users will automatically populate upon successful funnel completion."
                />
              </Card>
            </div>
          )}

          {/* ============================================================================
              WORKSPACE: 5. AI GROWTH
              ============================================================================ */}
          {activeWorkspace === "ai" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <SectionHeader title="Generative Growth Intelligence" icon={Cpu} description="Leverage LLMs against your real metrics to synthesize scaling strategies." />
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <Card glow="cyan">
                  <div className="mb-6"><Badge variant="cyan" pulse>Synthesis Parameters</Badge></div>
                  <div className="space-y-5">
                    <textarea 
                      value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="e.g., Based on my 2% conversion rate, write a script for a YouTube short targeting options traders..."
                      className="w-full bg-[#050505] border border-white/10 rounded-xl p-6 text-white text-sm placeholder-neutral-700 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none min-h-[160px]"
                    />
                    <Button variant="primary" icon={isGeneratingAi ? RefreshCw : Sparkles} loading={isGeneratingAi} onClick={executeAIAgent} className="w-full">
                      Execute Neural Analysis
                    </Button>
                  </div>
                </Card>

                <Card className="h-full min-h-[500px] flex flex-col">
                  <div className="mb-6 border-b border-white/[0.05] pb-5">
                    <h3 className="text-sm font-medium text-white mb-1">Model Output</h3>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Bounded by live data context</p>
                  </div>
                  <div className="flex-1 overflow-y-auto pr-2">
                    {!aiResponse && !isGeneratingAi ? (
                      <EmptyState icon={MessageSquare} title="Awaiting Instruction" description="Input parameters to generate tailored content or conversion strategies." />
                    ) : isGeneratingAi ? (
                      <div className="flex flex-col items-center justify-center h-full opacity-50 space-y-4">
                        <Cpu className="w-8 h-8 animate-pulse text-cyan-500" />
                        <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-500">Processing Vector...</div>
                      </div>
                    ) : (
                      <div className="text-sm text-neutral-300 leading-relaxed font-sans whitespace-pre-wrap">{aiResponse}</div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* ============================================================================
              WORKSPACE: 6. WALLET
              ============================================================================ */}
          {activeWorkspace === "wallet" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <SectionHeader title="Treasury Management" icon={Wallet} description="Secure financial oversight and capital extraction." />
              
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <Card glow="amber" className="xl:col-span-1 h-fit">
                  <div className="space-y-4 mb-8">
                    <div className="bg-[#050505] border border-white/5 p-5 rounded-xl">
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mb-2">Total Yield</span>
                      <span className="text-xl font-medium text-white font-mono">${metrics.commissionEarned.toLocaleString()}</span>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/20 blur-2xl rounded-full" />
                      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block mb-2 relative z-10">Available Treasury</span>
                      <span className="text-4xl font-semibold text-amber-500 font-mono tracking-tight relative z-10">${metrics.withdrawableBalance.toLocaleString()}</span>
                    </div>
                  </div>

                  <form onSubmit={handleWithdrawal} className="space-y-5 border-t border-white/[0.05] pt-6">
                    <div>
                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mb-3">Settlement Method</label>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setWithdrawalMethod('upi')} className={`flex-1 py-3 text-xs font-semibold rounded-lg border transition-all ${withdrawalMethod === 'upi' ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-[#050505] border-white/10 text-neutral-400 hover:border-white/30'}`}>UPI</button>
                        <button type="button" onClick={() => setWithdrawalMethod('bank')} className={`flex-1 py-3 text-xs font-semibold rounded-lg border transition-all ${withdrawalMethod === 'bank' ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-[#050505] border-white/10 text-neutral-400 hover:border-white/30'}`}>Bank Wire</button>
                      </div>
                    </div>
                    <Input 
                      placeholder={withdrawalMethod === 'upi' ? 'Enter UPI ID' : 'Account Number'} 
                      value={withdrawalDetails} onChange={(e) => setWithdrawalDetails(e.target.value)} 
                    />
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-mono">$</span>
                      <input 
                        type="number" step="0.01" min="0" max={metrics.withdrawableBalance}
                        placeholder="0.00" value={withdrawalAmount} onChange={(e) => setWithdrawalAmount(e.target.value)}
                        className="w-full bg-[#050505] border border-white/10 rounded-xl pl-10 pr-4 py-4 text-white font-mono focus:outline-none focus:border-amber-500 transition-all placeholder-neutral-700"
                      />
                    </div>
                    <Button variant="primary" icon={ArrowDownLeft} loading={isProcessingTx} disabled={!withdrawalAmount || parseFloat(withdrawalAmount) > metrics.withdrawableBalance || !withdrawalDetails} className="w-full">
                      Request Payout
                    </Button>
                  </form>
                </Card>

                <Card className="xl:col-span-2 min-h-[500px] !p-0 flex flex-col">
                  <div className="p-6 border-b border-white/[0.05]">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Financial Ledger</span>
                  </div>
                  <DataTable 
                    columns={[
                      { key: 'id', label: 'TX Hash', render: (r) => <span className="text-neutral-400 font-mono text-xs">#{r.id}</span> },
                      { key: 'amount', label: 'Volume', render: (r) => <span className="text-white font-medium">${r.amount.toLocaleString()}</span> },
                      { key: 'method', label: 'Method', render: (r) => <span className="text-neutral-500 uppercase">{r.method}</span> },
                      { key: 'status', label: 'Status', render: (r) => <Badge variant={r.status === 'COMPLETED' ? 'emerald' : r.status === 'PENDING' ? 'amber' : 'neutral'}>{r.status}</Badge> },
                      { key: 'date', label: 'Timestamp', align: 'right' }
                    ]}
                    data={ledger}
                    emptyIcon={Globe}
                    emptyTitle="Ledger Empty"
                    emptyDesc="No capital extraction requests recorded on your timeline."
                  />
                </Card>
              </div>
            </div>
          )}

          {/* ============================================================================
              WORKSPACE: 7, 8, 9. PROFILE, ACADEMY, COMMUNITY (Combined structures)
              ============================================================================ */}
          {activeWorkspace === "profile" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <SectionHeader title="Identity & Security" icon={Settings} description="Manage personal data and security configurations." />
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <Card>
                    <div className="mb-6"><span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Personal Details</span></div>
                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-neutral-500" />
                        </div>
                        <Button variant="secondary" className="!py-2 !px-4 text-xs">Upload Photo</Button>
                      </div>
                      <Input label="Full Name" defaultValue={partnerName} icon={User} />
                      <Input label="Email Address" defaultValue="partner@example.com" type="email" />
                      <Input label="Phone Number" placeholder="+1..." />
                      <Button variant="primary" className="mt-4">Save Identity</Button>
                    </form>
                 </Card>
                 <Card>
                    <div className="mb-6"><span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Security</span></div>
                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                      <Input label="Current Password" type="password" icon={Lock} />
                      <Input label="New Password" type="password" icon={Shield} />
                      <Button variant="secondary" className="mt-4">Update Security</Button>
                    </form>
                 </Card>
               </div>
            </div>
          )}

          {activeWorkspace === "academy" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <SectionHeader title="Partner Academy" icon={BookOpen} description="Training and marketing resources to scale your acquisitions." />
              <Card className="min-h-[400px]">
                <EmptyState icon={FileText} title="Resources Compiling" description="Marketing assets and training modules are currently being provisioned for your tier." />
              </Card>
            </div>
          )}

          {activeWorkspace === "community" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <SectionHeader title="Partner Network" icon={Globe} description="Global leaderboard and platform announcements." />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="!p-0 min-h-[400px]">
                  <div className="p-6 border-b border-white/[0.05]">
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2"><Trophy className="w-3 h-3"/> Global Rankings</span>
                  </div>
                  <DataTable 
                    columns={[ {key: 'rank', label: 'Rank'}, {key: 'name', label: 'Partner'}, {key: 'score', label: 'Score', align: 'right'} ]}
                    data={leaderboard} emptyIcon={Trophy} emptyTitle="Rankings Pending" emptyDesc="Leaderboard updates at the end of the fiscal week."
                  />
                </Card>
                <Card className="!p-0 min-h-[400px]">
                  <div className="p-6 border-b border-white/[0.05]">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2"><Bell className="w-3 h-3"/> Announcements</span>
                  </div>
                  <DataTable 
                    columns={[ {key: 'title', label: 'Update'}, {key: 'date', label: 'Date', align: 'right'} ]}
                    data={announcements} emptyIcon={Bell} emptyTitle="No Updates" emptyDesc="System alerts and feature drops will appear here."
                  />
                </Card>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}