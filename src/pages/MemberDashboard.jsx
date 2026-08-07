import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown, CreditCard, Link as LinkIcon, Users, 
  Download, Zap, CheckCircle2, Copy, Wallet, 
  TrendingUp, Activity, ChevronRight, AlertTriangle,
  History, X, IndianRupee
} from 'lucide-react';
import { 
  doc, getDoc, collection, getDocs, onSnapshot, 
  addDoc, updateDoc, increment, serverTimestamp 
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../firebase";
import MemberSidebar from "../components/member/MemberSidebar";
import MemberTopbar from "../components/member/MemberTopbar";

export default function MemberDashboard() {
  const navigate = useNavigate();

  // Firebase States
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Real-time Data States
  const [affiliateData, setAffiliateData] = useState({
    totalEarnings: 0,
    pendingPayout: 0,
    totalReferrals: 0,
    conversionRate: "0%",
    recentReferrals: []
  });
  const [invoices, setInvoices] = useState([]);
  
  // Layout & UI States
  const [openSidebar, setOpenSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Dashboard Metrics
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [portfolioValue, setPortfolioValue] = useState(1000000);

  // Withdrawal States
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    let unsubscribeUser = null;
    let unsubscribeAffiliate = null;
    let unsubscribeInvoices = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setLoading(false);
        navigate("/login");
        return;
      }

      setUser(currentUser);

      try {
        // 1. Real-time User Profile
        unsubscribeUser = onSnapshot(doc(db, "users", currentUser.uid), (docSnap) => {
          if (docSnap.exists()) setUserData(docSnap.data());
        });

        // 2. Real-time Affiliate Data (REAL DATA)
        unsubscribeAffiliate = onSnapshot(doc(db, "affiliates", currentUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            setAffiliateData(docSnap.data());
          }
        });

        // 3. Real-time Invoices (REAL DATA)
        unsubscribeInvoices = onSnapshot(collection(db, "users", currentUser.uid, "invoices"), (snapshot) => {
          const invData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setInvoices(invData.sort((a, b) => b.date - a.date)); // Sort newest first
        });

        // 4. Fetch Membership Details
        const memSnap = await getDoc(doc(db, "memberships", currentUser.uid));
        if (memSnap.exists()) setMembership(memSnap.data());

        // 5. Fetch Watchlist Count
        const watchSnap = await getDocs(collection(db, "users", currentUser.uid, "watchlist"));
        setWatchlistCount(watchSnap.size);

        // 6. Fetch Paper Trading Portfolio Value
        const paperSnap = await getDoc(doc(db, "paperTrading", currentUser.uid));
        if (paperSnap.exists()) {
          const data = paperSnap.data();
          const bal = data.balance ?? 1000000;
          const holdings = data.holdings ?? [];
          const mktCap = holdings.reduce((acc, item) => acc + item.quantity * (item.currentPrice || item.averageBuyPrice), 0);
          setPortfolioValue(bal + mktCap);
        }

      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUser) unsubscribeUser();
      if (unsubscribeAffiliate) unsubscribeAffiliate();
      if (unsubscribeInvoices) unsubscribeInvoices();
    };
  }, [navigate]);

  // ==========================================
  // REAL WITHDRAWAL LOGIC
  // ==========================================
  const handleWithdrawRequest = async (e) => {
    e.preventDefault();
    const amount = Number(withdrawAmount);
    
    if (amount < 500) {
      showToast("Minimum withdrawal amount is ₹500");
      return;
    }
    if (amount > affiliateData.pendingPayout) {
      showToast("Amount exceeds your pending balance!");
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Create a withdrawal request document
      await addDoc(collection(db, "withdrawals"), {
        uid: user.uid,
        email: user.email,
        name: userData?.fullName || "Partner",
        amount: amount,
        status: "Pending",
        requestedAt: serverTimestamp(),
        paymentMethod: "Bank Transfer" // You can expand this later
      });

      // 2. Deduct amount from user's affiliate pending payout
      await updateDoc(doc(db, "affiliates", user.uid), {
        pendingPayout: increment(-amount)
      });

      setShowWithdrawModal(false);
      setWithdrawAmount('');
      showToast("Withdrawal request submitted successfully!");
    } catch (error) {
      console.error("Withdrawal Error:", error);
      showToast("Failed to process request. Try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleCopyLink = () => {
    const link = `https://stockscorcher.com/?ref=ELITE_${user?.uid?.substring(0,6) || "USER"}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    showToast("Affiliate link copied!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      if (date?.toDate) return date.toDate().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
      return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    } catch { return "N/A"; }
  };

  const daysRemaining = membership?.expiryDate 
    ? Math.ceil(( (membership.expiryDate.toDate ? membership.expiryDate.toDate() : new Date(membership.expiryDate)) - new Date()) / (1000 * 60 * 60 * 24)) 
    : null;
  const isExpiringSoon = daysRemaining !== null && daysRemaining <= 7 && daysRemaining >= 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-zinc-800 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentDisplayName = userData?.fullName || user?.displayName || user?.email?.split("@")[0] || "Trader";
  const userReferralLink = `https://stockscorcher.com/?ref=ELITE_${user?.uid?.substring(0,6) || "USER"}`;

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden selection:bg-red-500/30 relative">
      
      <MemberSidebar open={openSidebar} setOpen={setOpenSidebar} />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto custom-scrollbar">
        <MemberTopbar toggleSidebar={() => setOpenSidebar(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          
          {/* 1. HERO HEADER */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-800/50">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-900/20 text-red-500 text-xs font-bold rounded-full uppercase tracking-widest mb-3 border border-red-900/30">
                <Crown size={12} /> Elite Member
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Hello, {currentDisplayName}
              </h1>
              <p className="text-zinc-400 mt-2 text-sm">
                Manage your Stock Scorcher tools, subscriptions, and partner earnings.
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => navigate("/stock-scanner")} className="px-5 py-2.5 bg-zinc-900 text-white border border-zinc-800 rounded-xl font-bold text-sm hover:bg-zinc-800 transition-colors shadow-sm flex items-center gap-2">
                <Activity size={16} /> Screener
              </button>
              <button onClick={() => navigate("/paper-trading")} className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 flex items-center gap-2">
                <Wallet size={16} /> Paper Trade
              </button>
            </div>
          </div>

          {/* EXPIRY ALERT */}
          {isExpiringSoon && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-red-500 shrink-0" size={20} />
                <div>
                  <h4 className="text-sm font-bold text-red-400">Subscription Expiring!</h4>
                  <p className="text-xs text-red-400/80 mt-0.5">Your elite access expires in {daysRemaining} days.</p>
                </div>
              </div>
              <button onClick={() => navigate("/membership")} className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors shrink-0">
                Renew Now
              </button>
            </div>
          )}

          {/* 2. TAB NAVIGATION */}
          <div className="flex space-x-2 bg-zinc-900/50 p-1.5 rounded-2xl border border-zinc-800/50 w-full sm:w-fit">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'affiliate', label: 'Partner Dashboard', icon: LinkIcon },
              { id: 'billing', label: 'Billing & Invoices', icon: CreditCard }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  activeTab === tab.id 
                    ? 'bg-zinc-800 text-white shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                }`}
              >
                <tab.icon size={16} className={activeTab === tab.id ? 'text-red-500' : ''} />
                <span className="hidden sm:block">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* 3. TAB CONTENT */}
          <div className="pt-2">
            <AnimatePresence mode="wait">
              
              {/* --- TAB 1: OVERVIEW --- */}
              {activeTab === 'overview' && (
                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-5">
                      <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Virtual Portfolio</p>
                      <h3 className="text-2xl font-black text-white">₹{portfolioValue.toLocaleString("en-IN", {maximumFractionDigits: 0})}</h3>
                    </div>
                    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-5">
                      <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Tracked Stocks</p>
                      <h3 className="text-2xl font-black text-white">{watchlistCount} Assets</h3>
                    </div>
                    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-5">
                      <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">AI Engine Status</p>
                      <h3 className="text-2xl font-black text-green-500 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span> Active
                      </h3>
                    </div>
                  </div>

                  {/* Current Plan Card */}
                  <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl group-hover:bg-red-600/10 transition-colors"></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
                      <div>
                        <p className="text-red-500 text-sm font-bold uppercase tracking-wider mb-2">Current Plan</p>
                        <h2 className="text-3xl font-black text-white mb-6">
                          {membership ? (membership.plan || "Scorcher Elite") : "Free Tier"}
                        </h2>
                        <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                          <div>
                            <p className="text-zinc-500 text-xs font-medium mb-1">Activated On</p>
                            <p className="text-sm font-bold text-zinc-300">{membership ? formatDate(membership.purchasedAt) : "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-zinc-500 text-xs font-medium mb-1">Valid Until</p>
                            <p className="text-sm font-bold text-zinc-300">{membership?.expiryDate ? formatDate(membership.expiryDate) : "Lifetime"}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 justify-center min-w-[200px]">
                        <button onClick={() => navigate("/membership")} className="w-full py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20">
                          {membership ? "Upgrade/Renew Plan" : "Unlock Elite Access"}
                        </button>
                        <button onClick={() => setActiveTab('billing')} className="w-full py-3 bg-zinc-800 text-white rounded-xl font-bold text-sm hover:bg-zinc-700 transition-colors">
                          View Billing History
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* --- TAB 2: PARTNER / AFFILIATE --- */}
              {activeTab === 'affiliate' && (
                <motion.div key="affiliate" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Earnings Card */}
                    <div className="md:col-span-2 bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl p-6 sm:p-8">
                      <div className="flex items-start justify-between mb-8">
                        <div>
                          <p className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-2">Total Earnings</p>
                          <h2 className="text-4xl font-black text-white">₹{(affiliateData?.totalEarnings || 0).toLocaleString('en-IN')}</h2>
                        </div>
                        <div className="bg-green-500/10 p-3 rounded-xl">
                          <Wallet className="text-green-500" size={24} />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
                        <div>
                          <p className="text-zinc-500 text-xs font-medium mb-1">Available to Withdraw</p>
                          <p className="text-xl font-bold text-green-400">₹{(affiliateData?.pendingPayout || 0).toLocaleString('en-IN')}</p>
                        </div>
                        <button 
                          onClick={() => setShowWithdrawModal(true)}
                          disabled={(affiliateData?.pendingPayout || 0) < 500}
                          className="px-6 py-2.5 bg-white text-black rounded-xl font-bold text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Withdraw
                        </button>
                      </div>
                    </div>

                    {/* Stats Card */}
                    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 flex flex-col justify-center">
                       <Users className="text-red-500 mb-3" size={24} />
                       <p className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-1">Total Referrals</p>
                       <h3 className="text-3xl font-black text-white mb-4">{affiliateData?.totalReferrals || 0}</h3>
                       <div className="flex items-center gap-2 text-sm font-bold text-green-500">
                         <TrendingUp size={16} /> {affiliateData?.conversionRate || "0%"} Conversion
                       </div>
                    </div>
                  </div>

                  {/* Link Generator */}
                  <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6 sm:p-8">
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                      <LinkIcon className="text-red-500" size={20} /> Your Affiliate Link
                    </h3>
                    <p className="text-zinc-400 text-sm mb-6">Earn 30% recurring commission for every user who joins Elite through your link.</p>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1 relative">
                        <input 
                          type="text" 
                          readOnly 
                          value={userReferralLink}
                          className="w-full bg-black border border-zinc-700 rounded-xl pl-4 pr-12 py-3.5 text-sm font-medium text-zinc-300 focus:outline-none focus:border-red-500"
                        />
                        <button 
                          onClick={handleCopyLink}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-white transition-colors bg-zinc-800 rounded-lg"
                        >
                          {copiedLink ? <CheckCircle2 className="text-green-500" size={18} /> : <Copy size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Recent Referrals List */}
                  {affiliateData?.recentReferrals?.length > 0 && (
                    <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6">
                      <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Recent Conversions</h3>
                      <div className="space-y-3">
                        {affiliateData.recentReferrals.map((ref, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-zinc-800/30 p-4 rounded-xl border border-zinc-800">
                            <div>
                              <p className="text-sm font-bold text-white">{ref.user}</p>
                              <p className="text-xs text-zinc-500 mt-1">{ref.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-green-400">+₹{ref.commission.toLocaleString('en-IN')}</p>
                              <p className="text-[10px] font-bold text-zinc-500 uppercase mt-1">{ref.plan}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* --- TAB 3: BILLING --- */}
              {activeTab === 'billing' && (
                <motion.div key="billing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl overflow-hidden">
                  <div className="p-6 border-b border-zinc-800/50 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <History className="text-red-500" size={20} /> Invoice History
                    </h3>
                  </div>
                  <div className="divide-y divide-zinc-800/50">
                    {invoices.map((inv) => (
                      <div key={inv.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-zinc-800/30 transition-colors">
                        <div>
                          <p className="font-bold text-white mb-1">{inv.plan || "Membership"}</p>
                          <div className="flex items-center gap-3 text-xs font-medium text-zinc-500">
                            <span>{formatDate(inv.date)}</span>
                            <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                            <span>{inv.id}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className="font-bold text-white">₹{Number(inv.amount).toLocaleString('en-IN')}</span>
                          <button className="text-zinc-500 hover:text-white transition-colors p-2 bg-zinc-900 rounded-lg">
                            <Download size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {invoices.length === 0 && (
                      <div className="p-8 text-center text-zinc-500 text-sm">
                        No billing history found in database.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* WITHDRAWAL MODAL */}
      <AnimatePresence>
        {showWithdrawModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
            >
              <button onClick={() => setShowWithdrawModal(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
              
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Wallet className="text-green-500" size={24} /> Withdraw Funds
              </h3>
              <p className="text-zinc-400 text-sm mb-6">Available Balance: <strong className="text-white">₹{(affiliateData?.pendingPayout || 0).toLocaleString('en-IN')}</strong></p>

              <form onSubmit={handleWithdrawRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Amount to Withdraw (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input 
                      type="number" 
                      required
                      min="500"
                      max={affiliateData?.pendingPayout || 0}
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="e.g. 5000"
                      className="w-full bg-black border border-zinc-800 rounded-xl pl-12 pr-4 py-3 font-bold text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-2">Minimum withdrawal is ₹500. Processing takes 2-3 business days.</p>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isProcessing || !withdrawAmount || Number(withdrawAmount) > affiliateData?.pendingPayout}
                  className="w-full py-3.5 bg-red-600 text-white rounded-xl font-bold transition-colors hover:bg-red-700 disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isProcessing ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Processing...</>
                  ) : "Submit Request"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 bg-white text-black px-4 py-3 rounded-xl shadow-2xl"
          >
            <div className="bg-green-500/20 text-green-600 p-1 rounded-full">
              <CheckCircle2 size={16} strokeWidth={3} />
            </div>
            <p className="text-sm font-bold">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}