import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import PartnerDashboard from './PartnerDashboard';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function PartnerRouteWrapper() {
  const [partnerData, setPartnerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const checkPartnerStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const token = await user.getIdToken();
        const res = await axios.get(`${API_BASE_URL}/api/partners/analytics/${user.uid}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPartnerData(res.data);
      } catch (err) {
        // If 404, it means they are not a partner yet
        setPartnerData(null);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      checkPartnerStatus();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-amber-400 flex justify-center items-center font-bold">
        Loading Partner Portal...
      </div>
    );
  }

  // If user is logged in and has an existing partner record, show Dashboard directly
  if (partnerData) {
    return <PartnerDashboard />;
  }

  // Otherwise, show the Become a Partner / Apply page
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full bg-zinc-950 border border-white/10 p-8 rounded-[2rem] text-center space-y-6">
        <h2 className="text-2xl font-black">Join Stock Scorcher Growth Partners</h2>
        <p className="text-zinc-400 text-sm">Monetize your network by promoting AI-powered stock trading education.</p>
        <a 
          href="/partner/apply" 
          className="block w-full bg-amber-400 hover:bg-amber-300 text-black font-black uppercase tracking-wider py-4 rounded-xl transition-all shadow-lg shadow-amber-400/20"
        >
          Become a Partner
        </a>
      </div>
    </div>
  );
}