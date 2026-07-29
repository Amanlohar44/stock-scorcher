import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function PartnerApply() {
  const navigate = useNavigate();
  const auth = getAuth();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    promotionMethod: '',
    payoutMethod: 'upi',
    upiId: '',
    bankName: '',
    accountNumber: '',
    ifscCode: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) setUser(currentUser);
      else navigate('/login?redirect=/partner/apply');
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = await user.getIdToken();
      await axios.post(`${API_BASE_URL}/api/partners/apply`, {
        uid: user.uid,
        email: user.email,
        fullName: formData.fullName,
        phone: formData.phone,
        promotionMethod: formData.promotionMethod,
        payoutDetails: {
          type: formData.payoutMethod,
          ...(formData.payoutMethod === 'upi' 
            ? { upiId: formData.upiId } 
            : { bankName: formData.bankName, accountNumber: formData.accountNumber, ifscCode: formData.ifscCode })
        }
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      alert("Application Submitted! You will be redirected to your dashboard.");
      navigate('/partner/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || "Application failed or already exists.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-black text-yellow-400 flex justify-center items-center font-bold">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black text-yellow-400 mb-4 uppercase tracking-wider">Certified Growth Partner</h1>
          <p className="text-zinc-400 text-sm">Apply to join the Stock Scorcher network and earn 20% commission on every sale.</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-zinc-950 p-8 rounded-[2rem] border border-yellow-500/30 shadow-2xl space-y-8">
          <div>
            <h2 className="text-lg font-bold text-yellow-400 uppercase tracking-wider mb-4 border-b border-white/10 pb-2">1. Personal Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Full Name</label>
                <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-yellow-400 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Email Address</label>
                <input disabled type="email" value={user?.email || ''} className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-3 text-zinc-600 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Phone Number</label>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-yellow-400 outline-none" />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-yellow-400 uppercase tracking-wider mb-4 border-b border-white/10 pb-2">2. Traffic Source</h2>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">How will you promote?</label>
            <textarea required rows="3" placeholder="e.g. YouTube channel, Telegram Group, Instagram..." value={formData.promotionMethod} onChange={e => setFormData({...formData, promotionMethod: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-yellow-400 outline-none"></textarea>
          </div>

          <div>
            <h2 className="text-lg font-bold text-yellow-400 uppercase tracking-wider mb-4 border-b border-white/10 pb-2">3. Payout Method</h2>
            <div className="flex gap-4 mb-6">
              <label className={`flex-1 p-4 border rounded-xl cursor-pointer text-center font-bold text-sm uppercase transition-all ${formData.payoutMethod === 'upi' ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400' : 'border-white/10 bg-black text-zinc-500'}`}>
                <input type="radio" name="payout" value="upi" checked={formData.payoutMethod === 'upi'} onChange={() => setFormData({...formData, payoutMethod: 'upi'})} className="hidden"/>
                UPI Transfer
              </label>
              <label className={`flex-1 p-4 border rounded-xl cursor-pointer text-center font-bold text-sm uppercase transition-all ${formData.payoutMethod === 'bank' ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400' : 'border-white/10 bg-black text-zinc-500'}`}>
                <input type="radio" name="payout" value="bank" checked={formData.payoutMethod === 'bank'} onChange={() => setFormData({...formData, payoutMethod: 'bank'})} className="hidden"/>
                Bank Account
              </label>
            </div>

            {formData.payoutMethod === 'upi' ? (
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">UPI ID</label>
                <input required={formData.payoutMethod === 'upi'} type="text" value={formData.upiId} onChange={e => setFormData({...formData, upiId: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-yellow-400 outline-none" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Bank Name</label>
                  <input required={formData.payoutMethod === 'bank'} type="text" value={formData.bankName} onChange={e => setFormData({...formData, bankName: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-yellow-400 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Account Number</label>
                  <input required={formData.payoutMethod === 'bank'} type="text" value={formData.accountNumber} onChange={e => setFormData({...formData, accountNumber: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-yellow-400 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">IFSC Code</label>
                  <input required={formData.payoutMethod === 'bank'} type="text" value={formData.ifscCode} onChange={e => setFormData({...formData, ifscCode: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-yellow-400 outline-none uppercase" />
                </div>
              </div>
            )}
          </div>

          <button type="submit" disabled={submitting} className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black uppercase tracking-wider px-6 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(250,204,21,0.3)] disabled:opacity-50 mt-8">
            {submitting ? 'Submitting...' : 'Submit Partner Application'}
          </button>
        </form>
      </div>
    </div>
  );
}