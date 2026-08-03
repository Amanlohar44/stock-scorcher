import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

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
        fullName,
        phone,
        promotionMethod,
        payoutDetails: { type: 'upi', upiId }
      };

      const response = await axios.post(`${API_BASE_URL}/api/partners/apply`, payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201 || response.status === 200) {
        alert("Partner Application Submitted Successfully!");
        navigate('/partner/dashboard', { replace: true });
      }
    } catch (err) {
      console.error("Submission Error Details:", err.response || err);
      setErrorMsg(err.response?.data?.error || err.message || "Failed to submit application. Please check backend console.");
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
    <div className="min-h-screen bg-black text-white p-6 lg:p-12 pt-28 lg:pt-32 flex justify-center items-center">
      <div className="max-w-xl w-full bg-zinc-950 border border-amber-500/30 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-60 h-60 bg-amber-400/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 mb-8 text-center">
          <span className="px-3 py-1 bg-amber-400/10 border border-amber-400/30 text-amber-400 rounded-full text-xs font-black tracking-widest uppercase">
            Growth Partner Program
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Apply for Partnership</h1>
          <p className="text-zinc-400 text-xs sm:text-sm">Join Stock Scorcher and earn high commissions on every course sale.</p>
        </div>

        {errorMsg && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-400 text-xs font-bold break-words">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Full Name</label>
            <input 
              type="text" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              required 
              placeholder="Enter your full name"
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-amber-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">WhatsApp / Phone Number</label>
            <input 
              type="text" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              required 
              placeholder="+91 XXXXX XXXXX"
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-amber-400 transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Primary Promotion Method</label>
            <select 
              value={promotionMethod} 
              onChange={(e) => setPromotionMethod(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-amber-400 transition-all font-bold uppercase"
            >
              <option value="Instagram Reels">Instagram Reels / Page</option>
              <option value="YouTube Channel">YouTube Channel / Shorts</option>
              <option value="WhatsApp Community">WhatsApp Community / Broadcast</option>
              <option value="Telegram Channel">Telegram Channel</option>
              <option value="Other">Other Social Media</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">UPI ID (For Payouts)</label>
            <input 
              type="text" 
              value={upiId} 
              onChange={(e) => setUpiId(e.target.value)} 
              required 
              placeholder="username@oksbi"
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-amber-400 transition-all font-mono"
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-amber-400 hover:bg-amber-300 disabled:bg-zinc-800 text-black font-black uppercase tracking-wider py-4 rounded-xl transition-all shadow-lg shadow-amber-400/20 cursor-pointer mt-4"
          >
            {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}