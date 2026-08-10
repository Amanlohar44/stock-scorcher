import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export default function PartnerApply() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Form States
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [promotionMethod, setPromotionMethod] = useState('Instagram Reels');
  const [upiId, setUpiId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        const token = await user.getIdToken();
        const res = await axios.get(`${API_BASE_URL}/api/partners/status/${user.uid}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data && res.data.exists) {
          navigate('/partner/dashboard', { replace: true });
          return;
        }
      } catch (err) {
        console.log("New partner application required.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const user = auth.currentUser;
    if (!user) {
      alert("Please login first.");
      navigate('/login');
      return;
    }

    try {
      const token = await user.getIdToken();
      
      const payload = {
        uid: user.uid,
        email: user.email || '',
        fullName: fullName.trim(),
        phone: phone.trim(),
        promotionMethod,
        payoutDetails: { type: 'upi', upiId: upiId.trim() }
      };

      const response = await axios.post(`${API_BASE_URL}/api/partners/apply`, payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201 || response.status === 200) {
        navigate('/partner/dashboard', { replace: true });
      }
    } catch (err) {
      console.error("Submission Error Details:", err.response || err);
      setErrorMsg(err.response?.data?.error || err.message || "Failed to submit application. Please check backend connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-amber-400 flex flex-col justify-center items-center font-bold space-y-4">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="uppercase text-xs tracking-widest">Checking Partner Status...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12 pt-28 lg:pt-32 flex justify-center items-center selection:bg-amber-400 selection:text-black">
      <div className="max-w-xl w-full bg-zinc-950 border border-amber-500/30 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-amber-950/20 relative overflow-hidden">
        {/* Glow Background Effect */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-amber-400/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 mb-6 text-center relative z-10">
          <span className="inline-block px-3 py-1 bg-amber-400/10 border border-amber-400/30 text-amber-400 rounded-full text-xs font-black tracking-widest uppercase">
            Growth Partner Program
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Apply for Partnership</h1>
          <p className="text-zinc-400 text-xs sm:text-sm">Join Stock Scorcher and earn high commissions based on your tier.</p>
        </div>

        {/* --- COMMISSION HIGHLIGHTS SECTION --- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 relative z-10">
          <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl flex flex-col items-center text-center hover:bg-white/[0.04] transition-colors">
            <div className="text-2xl font-black text-amber-400 mb-1">Upto 30%</div>
            <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Commission</div>
          </div>
          
          <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl flex flex-col items-center text-center hover:bg-white/[0.04] transition-colors">
            <div className="text-2xl font-black text-white mb-1">₹0</div>
            <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Joining Fee</div>
          </div>
          
          <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl flex flex-col items-center text-center hover:bg-white/[0.04] transition-colors">
            <div className="text-2xl font-black text-emerald-400 mb-1 flex items-center">
              <span className="text-lg mr-1">⚡</span> UPI
            </div>
            <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Weekly Payouts</div>
          </div>
        </div>

        {/* --- TIER BREAKDOWN BADGES --- */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 relative z-10">
          <div className="px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-[11px] font-bold text-yellow-500 tracking-wider flex items-center gap-1.5 shadow-inner">
            <span>🥇</span> GOLD : 10%
          </div>
          <div className="px-3 py-2 bg-zinc-400/10 border border-zinc-400/20 rounded-xl text-[11px] font-bold text-zinc-300 tracking-wider flex items-center gap-1.5 shadow-inner">
            <span>🥈</span> SILVER : 20%
          </div>
          <div className="px-3 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-[11px] font-bold text-cyan-400 tracking-wider flex items-center gap-1.5 shadow-inner">
            <span>💎</span> PLATINUM : 30%
          </div>
        </div>
        {/* --------------------------------------- */}

        {errorMsg && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 p-4 rounded-2xl text-red-400 text-xs font-bold flex items-center space-x-2 relative z-10">
            <span>⚠️</span>
            <span className="flex-1">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2 tracking-wider">Full Name</label>
            <input 
              type="text" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              required 
              placeholder="Enter your full name"
              className="w-full bg-black border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all placeholder:text-zinc-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2 tracking-wider">WhatsApp / Phone Number</label>
            <input 
              type="tel" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              required 
              placeholder="+91 XXXXX XXXXX"
              className="w-full bg-black border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-mono placeholder:text-zinc-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2 tracking-wider">Primary Promotion Method</label>
            <select 
              value={promotionMethod} 
              onChange={(e) => setPromotionMethod(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-bold uppercase cursor-pointer"
            >
              <option value="Instagram Reels">Instagram Reels / Page</option>
              <option value="YouTube Channel">YouTube Channel / Shorts</option>
              <option value="WhatsApp Community">WhatsApp Community / Broadcast</option>
              <option value="Telegram Channel">Telegram Channel</option>
              <option value="Other">Other Social Media</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2 tracking-wider">UPI ID (For Payouts)</label>
            <input 
              type="text" 
              value={upiId} 
              onChange={(e) => setUpiId(e.target.value)} 
              required 
              placeholder="username@oksbi"
              className="w-full bg-black border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-mono placeholder:text-zinc-600"
            />
            <p className="text-[11px] text-zinc-500 mt-1.5 pl-1">Make sure your UPI ID is active to receive automated commission payouts.</p>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-amber-400 hover:bg-amber-300 disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-black uppercase tracking-wider py-4 rounded-2xl transition-all shadow-lg shadow-amber-400/20 cursor-pointer mt-6 flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>Submitting Application...</span>
              </>
            ) : (
              <span>Submit Application</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}