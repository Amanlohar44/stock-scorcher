import React, { useState, useEffect } from 'react';

export default function PartnerManager() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mocking Admin API Data for UI rendering
    setTimeout(() => {
      setPartners([
        {
          partnerId: 'SSC10482',
          personalInfo: { name: 'Rahul Sharma', email: 'rahul@example.com' },
          status: 'pending',
          level: 'starter',
          commissionRate: 500,
          metrics: { totalSales: 0, revenueGenerated: 0 },
          createdAt: '2026-07-28'
        },
        {
          partnerId: 'SSC99210',
          personalInfo: { name: 'Priya Patel', email: 'priya@example.com' },
          status: 'approved',
          level: 'gold',
          commissionRate: 1000,
          metrics: { totalSales: 45, revenueGenerated: 450000 },
          createdAt: '2026-06-15'
        }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const handleStatusChange = (partnerId, newStatus) => {
    // Real App Me: Backend API call to /api/v1/admin/partners/:partnerId/status
    setPartners(prev => prev.map(p => p.partnerId === partnerId ? { ...p, status: newStatus } : p));
    alert(`Status updated to ${newStatus}`);
  };

  const handleLevelChange = (partnerId, newLevel) => {
    // Default rates based on level
    const rates = { starter: 500, silver: 750, gold: 1000, elite: 1500 };
    const newRate = rates[newLevel];
    
    // Real App Me: Backend API call to /api/v1/admin/partners/:partnerId/level
    setPartners(prev => prev.map(p => p.partnerId === partnerId ? { ...p, level: newLevel, commissionRate: newRate } : p));
    alert(`${partnerId} upgraded to ${newLevel.toUpperCase()} (₹${newRate}/sale)`);
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0A0A0A] flex justify-center items-center text-[#D4AF37] font-bold">Loading Partner Data...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-[#2A2A2A] pb-6">
          <div>
            <h1 className="text-3xl font-bold">Partner <span className="text-[#D4AF37]">Management</span></h1>
            <p className="text-gray-400 mt-1">Approve applications and manage commission tiers.</p>
          </div>
          <div className="bg-[#141414] border border-[#2A2A2A] px-4 py-2 rounded-lg flex gap-4 text-sm">
            <div>Total Partners: <span className="text-[#D4AF37] font-bold">{partners.length}</span></div>
            <div>Pending Approval: <span className="text-red-400 font-bold">{partners.filter(p => p.status === 'pending').length}</span></div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1A1A1A] text-gray-400 text-xs uppercase tracking-wider border-b border-[#2A2A2A]">
                  <th className="p-4 font-semibold">Partner Details</th>
                  <th className="p-4 font-semibold">Performance</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Tier & Commission</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2A]">
                {partners.map((partner) => (
                  <tr key={partner.partnerId} className="hover:bg-[#1A1A1A] transition-colors">
                    
                    {/* Details */}
                    <td className="p-4">
                      <div className="font-bold text-gray-200">{partner.personalInfo.name}</div>
                      <div className="text-xs text-gray-500 font-mono mt-1">{partner.partnerId}</div>
                      <div className="text-xs text-gray-500">{partner.personalInfo.email}</div>
                    </td>

                    {/* Performance */}
                    <td className="p-4">
                      <div className="text-sm">Sales: <span className="text-[#D4AF37] font-bold">{partner.metrics.totalSales}</span></div>
                      <div className="text-xs text-gray-500">₹{partner.metrics.revenueGenerated.toLocaleString()} rev</div>
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider 
                        ${partner.status === 'approved' ? 'bg-green-500/20 text-green-500' : 
                          partner.status === 'pending' ? 'bg-orange-500/20 text-orange-400' : 
                          'bg-red-500/20 text-red-500'}`}>
                        {partner.status}
                      </span>
                    </td>

                    {/* Level & Commission Dropdown */}
                    <td className="p-4">
                      <select 
                        value={partner.level}
                        onChange={(e) => handleLevelChange(partnerId, e.target.value)}
                        className="bg-[#0A0A0A] border border-[#2A2A2A] text-white text-xs rounded p-1 mb-1 focus:border-[#D4AF37] outline-none w-full"
                      >
                        <option value="starter">Starter (₹500)</option>
                        <option value="silver">Silver (₹750)</option>
                        <option value="gold">Gold (₹1000)</option>
                        <option value="elite">Elite (Custom)</option>
                      </select>
                      <div className="text-xs text-gray-500 text-right">Current: ₹{partner.commissionRate}</div>
                    </td>

                    {/* Action Buttons */}
                    <td className="p-4 text-right flex flex-col gap-2 justify-end">
                      {partner.status === 'pending' && (
                        <button 
                          onClick={() => handleStatusChange(partner.partnerId, 'approved')}
                          className="bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-black border border-green-500/50 text-xs px-3 py-1 rounded transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      {partner.status !== 'rejected' && (
                        <button 
                          onClick={() => handleStatusChange(partner.partnerId, 'rejected')}
                          className="bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-black border border-red-500/50 text-xs px-3 py-1 rounded transition-colors"
                        >
                          {partner.status === 'pending' ? 'Reject' : 'Suspend'}
                        </button>
                      )}
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}