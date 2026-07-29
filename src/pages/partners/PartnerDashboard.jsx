import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function PartnerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [withdrawAmt, setWithdrawAmt] = useState('');
  
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await user.getIdToken();
        const res = await axios.get(`${API_BASE_URL}/api/partners/analytics/${user.uid}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (withdrawAmt < 500) return alert("Minimum withdrawal is ₹500");
    try {
      const token = await user.getIdToken();
      await axios.post(`${API_BASE_URL}/api/partners/withdraw`, { amount: withdrawAmt }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Withdrawal Requested Successfully!");
      window.location.reload(); // Refresh balance
    } catch (err) {
      alert(err.response?.data?.error || "Error processing request");
    }
  };

  if (loading) return <div className="min-h-screen bg-black text-yellow-400 flex justify-center items-center font-bold">Loading Partner Data...</div>;

  if (!data) return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4">
      <h2 className="text-2xl font-bold mb-4">Partner Profile Not Found</h2>
      <a href="/partner/apply" className="bg-yellow-400 text-black px-6 py-2 rounded-xl font-bold">Apply Now</a>
    </div>
  );

  const refLink = `https://stockscorcher.com/courses?ref=${data.partnerId}`;

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12 pt-28 lg:pt-32">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-black text-yellow-400 uppercase tracking-wider">Partner Dashboard</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-zinc-400 text-sm">Welcome, {data.personalInfo?.name}</span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${data.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                {data.status}
              </span>
            </div>
          </div>
          <div className="bg-zinc-950 border border-white/10 px-6 py-4 rounded-2xl text-right">
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Available Wallet Balance</p>
            <p className="text-4xl font-black text-green-400">₹{(data.walletBalance || 0).toLocaleString()}</p>
          </div>
        </header>

        {data.status === 'pending' && (
          <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-xl text-orange-400 text-sm font-bold">
            ⚠️ Your application is currently under review by the Admin team. You can still share your link, but payouts will be unlocked after approval.
          </div>
        )}

        <div className="bg-zinc-950 p-6 rounded-[2rem] border border-yellow-500/30">
          <h2 className="text-sm font-black uppercase text-zinc-400 mb-4">Your Unique Referral Link</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <input type="text" readOnly value={refLink} className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-yellow-400 font-mono text-sm outline-none" />
            <button onClick={() => { navigator.clipboard.writeText(refLink); alert('Link Copied!'); }} className="bg-yellow-400 hover:bg-yellow-300 text-black font-black uppercase tracking-wider px-8 py-3 rounded-xl transition-all cursor-pointer">
              Copy Link
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-zinc-950 p-6 rounded-[2rem] border border-white/10">
            <h2 className="text-lg font-black uppercase text-white mb-6">Performance Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-black p-4 rounded-xl border border-white/5">
                <span className="text-zinc-400 text-sm font-bold uppercase">Total Earned</span>
                <span className="text-xl font-black text-white">₹{(data.totalEarned || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center bg-black p-4 rounded-xl border border-white/5">
                <span className="text-zinc-400 text-sm font-bold uppercase">Total Course Sales</span>
                <span className="text-xl font-black text-white">{data.totalSalesCount || 0}</span>
              </div>
              <div className="flex justify-between items-center bg-black p-4 rounded-xl border border-white/5">
                <span className="text-zinc-400 text-sm font-bold uppercase">Current Tier</span>
                <span className="text-xl font-black text-yellow-400 uppercase">{data.level}</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-950 p-6 rounded-[2rem] border border-white/10">
            <h2 className="text-lg font-black uppercase text-white mb-6">Request Payout</h2>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Amount to Withdraw (₹)</label>
                <input type="number" min="500" max={data.walletBalance} value={withdrawAmt} onChange={(e) => setWithdrawAmt(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-400" placeholder="Minimum ₹500" required />
              </div>
              <p className="text-xs text-zinc-500">Money will be sent to your registered {data.payoutDetails?.type.toUpperCase()} within 24 hours.</p>
              <button type="submit" disabled={data.walletBalance < 500} className="w-full bg-green-500 hover:bg-green-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-black uppercase tracking-wider px-4 py-4 rounded-xl transition-all">
                Transfer to Bank
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}