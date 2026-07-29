import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';

export default function PartnerLeaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(collection(db, "partners"), orderBy("totalSalesCount", "desc"), limit(10));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Filter out pending or 0 sales
        setLeaders(data.filter(p => p.status === 'approved' && p.totalSalesCount > 0));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-200 uppercase tracking-widest mb-4">Wall of Fame</h1>
          <p className="text-zinc-400 text-sm md:text-base">Top Certified Growth Partners driving maximum impact this month.</p>
        </div>

        {loading ? (
          <div className="text-center text-yellow-400 font-bold uppercase">Loading Leaders...</div>
        ) : leaders.length === 0 ? (
          <div className="text-center text-zinc-500">The leaderboard is currently empty. Be the first to make a sale!</div>
        ) : (
          <div className="bg-zinc-950 border border-yellow-500/20 rounded-[2rem] p-4 md:p-8 shadow-2xl">
            <div className="space-y-4">
              {leaders.map((leader, index) => (
                <div 
                  key={leader.id} 
                  onClick={() => navigate(`/partner/${leader.partnerId}`)}
                  className={`flex items-center justify-between p-4 md:p-6 rounded-2xl border transition-all cursor-pointer
                    ${index === 0 ? 'bg-yellow-400/10 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.2)]' : 
                      index === 1 ? 'bg-zinc-300/10 border-zinc-300' : 
                      index === 2 ? 'bg-orange-400/10 border-orange-400' : 
                      'bg-black border-white/5 hover:border-white/20'}`}
                >
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className={`w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-full font-black text-xl md:text-2xl 
                      ${index === 0 ? 'bg-yellow-400 text-black' : index === 1 ? 'bg-zinc-300 text-black' : index === 2 ? 'bg-orange-400 text-black' : 'bg-zinc-900 text-zinc-500'}`}>
                      #{index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg md:text-xl text-white">{leader.personalInfo?.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] md:text-xs font-black uppercase text-yellow-400 tracking-wider">Tier: {leader.level}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl md:text-3xl font-black text-white">{leader.totalSalesCount}</div>
                    <div className="text-[10px] md:text-xs text-zinc-500 font-bold uppercase">Sales</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}