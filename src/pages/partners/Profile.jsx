import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

export default function VerifiedProfile() {
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const q = query(collection(db, "partners"), where("partnerId", "==", partnerId));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          if(data.status === 'approved') {
            setPartner(data);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPartner();
  }, [partnerId]);

  const handleBuyCourse = () => {
    // Navigate to courses and append the ref code to URL securely
    navigate(`/courses?ref=${partnerId}`);
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-yellow-400 font-bold uppercase tracking-widest">Verifying Partner...</div>;

  if (!partner) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-black text-red-500 mb-4">404 - Partner Not Found</h1>
      <p className="text-zinc-400 mb-8">This partner ID is invalid or currently inactive.</p>
      <button onClick={() => navigate('/courses')} className="bg-yellow-400 text-black px-8 py-3 rounded-xl font-bold">Go To Courses</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-950 border border-yellow-500/30 rounded-[2rem] p-8 shadow-[0_0_50px_rgba(250,204,21,0.1)] text-center relative overflow-hidden">
        
        {/* Verification Badge */}
        <div className="absolute top-0 right-0 bg-yellow-400 text-black text-[10px] font-black uppercase px-6 py-1 transform translate-x-[30%] translate-y-[100%] rotate-45 tracking-widest shadow-lg">
          Verified
        </div>

        <div className="w-24 h-24 bg-zinc-900 rounded-full mx-auto mb-6 flex items-center justify-center border-2 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.3)]">
          <span className="text-4xl">🏆</span>
        </div>

        <h1 className="text-2xl font-black text-white uppercase tracking-wider mb-1">{partner.personalInfo?.name}</h1>
        <p className="text-zinc-400 text-xs font-mono mb-6">ID: {partner.partnerId}</p>

        <div className="bg-black border border-white/10 rounded-xl p-4 mb-8">
          <p className="text-sm text-zinc-300 leading-relaxed italic">
            "I am an officially certified Stock Scorcher Growth Partner. Join the community today and master the stock market with our premium courses."
          </p>
        </div>

        <button 
          onClick={handleBuyCourse}
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(250,204,21,0.4)] transition-all transform hover:scale-105 active:scale-95"
        >
          Enroll Now via {partner.personalInfo?.name.split(" ")[0]}
        </button>
      </div>
    </div>
  );
}