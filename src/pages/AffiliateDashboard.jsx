import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";

export default function AffiliateDashboard() {
  const [user, setUser] = useState(null);
  const [copied, setCopied] = useState(false);
  const [referralCode, setReferralCode] = useState("");

  useEffect(() => {
    const auth = getAuth();
    if (auth.currentUser) {
      setUser(auth.currentUser);
      setReferralCode(auth.currentUser.uid.substring(0, 8).toUpperCase());
    } else {
      setReferralCode("SCORCHER-AL11");
    }
  }, []);

  const referralLink = `https://stockscorcher.com/invite/${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    // pt-32 ensures it stays below your navbar
    <div className="min-h-screen bg-[#000000] text-white font-sans pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Affiliate Overview</h1>
            <p className="text-gray-400 text-sm">Welcome back, {user?.displayName || "Partner"}. Track your referrals and earnings.</p>
          </div>
          
          {/* BALANCE WIDGET */}
          <div className="bg-[#111111] border border-gray-800 rounded-2xl p-4 flex items-center gap-6 shadow-sm w-full md:w-auto">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Available to Withdraw</p>
              <p className="text-2xl font-bold text-white">₹12,500.00</p>
            </div>
            <button className="bg-white text-black hover:bg-gray-200 px-6 py-2.5 rounded-xl text-sm font-bold transition-colors">
              Withdraw
            </button>
          </div>
        </div>

        {/* ================= STATS GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { title: "Total Earnings", value: "₹45,200", subtitle: "+₹4,500 this month" },
            { title: "Total Referrals", value: "128", subtitle: "+12 new signups" },
            { title: "Link Clicks", value: "1,452", subtitle: "Last 30 days" },
            { title: "Conversion Rate", value: "8.8%", subtitle: "Highly optimized" }
          ].map((stat, index) => (
            <div key={index} className="bg-[#111111] border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
              <h3 className="text-sm text-gray-400 font-medium mb-3">{stat.title}</h3>
              <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.subtitle}</p>
            </div>
          ))}
        </div>

        {/* ================= MAIN CONTENT SPLIT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN (LINK GENERATOR) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6 md:p-8">
              <div className="w-12 h-12 bg-[#FBBF24]/10 text-[#FBBF24] rounded-full flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
              </div>
              <h2 className="text-lg font-bold mb-2">Your Referral Link</h2>
              <p className="text-sm text-gray-400 mb-6">Share this link with your audience. You earn a 20% commission on every course purchased through it.</p>
              
              <div className="bg-black border border-gray-700 rounded-xl p-1 mb-4 flex items-center focus-within:border-[#FBBF24] transition-colors">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="w-full bg-transparent border-none text-gray-300 text-sm px-4 py-3 focus:outline-none"
                />
              </div>
              
              <button
                onClick={handleCopy}
                className="w-full bg-[#FBBF24] text-black font-bold py-3.5 rounded-xl hover:bg-yellow-500 transition-colors text-sm"
              >
                {copied ? "Link Copied!" : "Copy Referral Link"}
              </button>
            </div>

            {/* QUICK PROMO TIPS */}
            <div className="bg-[#111111] border border-gray-800 rounded-2xl p-6">
              <h3 className="font-bold mb-4">Quick Tips</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex gap-3">
                  <span className="text-[#FBBF24]">✓</span> Add the link to your Instagram bio.
                </li>
                <li className="flex gap-3">
                  <span className="text-[#FBBF24]">✓</span> Share it in WhatsApp & Telegram trading groups.
                </li>
                <li className="flex gap-3">
                  <span className="text-[#FBBF24]">✓</span> Mention the course in your YouTube videos.
                </li>
              </ul>
            </div>

          </div>

          {/* RIGHT COLUMN (DATA TABLE) */}
          <div className="lg:col-span-2 bg-[#111111] border border-gray-800 rounded-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#151515]">
              <h2 className="text-lg font-bold">Recent Transactions</h2>
              <button className="text-sm text-gray-400 hover:text-white transition-colors">View All</button>
            </div>
            
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#111111] text-gray-500 text-xs uppercase tracking-wider">
                    <th className="py-4 px-6 font-medium">Date</th>
                    <th className="py-4 px-6 font-medium">Customer</th>
                    <th className="py-4 px-6 font-medium">Course</th>
                    <th className="py-4 px-6 font-medium">Status</th>
                    <th className="py-4 px-6 font-medium text-right">Commission</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { date: "Oct 28, 2026", user: "Ravi S.", course: "Advanced Masterclass", status: "Completed", amount: "₹1,200", color: "text-green-500", bg: "bg-green-500/10" },
                    { date: "Oct 27, 2026", user: "Amit K.", course: "AI Setup Guide", status: "Pending", amount: "₹450", color: "text-yellow-500", bg: "bg-yellow-500/10" },
                    { date: "Oct 25, 2026", user: "Neha M.", course: "Elite Access", status: "Completed", amount: "₹1,200", color: "text-green-500", bg: "bg-green-500/10" },
                    { date: "Oct 22, 2026", user: "Vikram P.", course: "Advanced Masterclass", status: "Completed", amount: "₹1,200", color: "text-green-500", bg: "bg-green-500/10" },
                    { date: "Oct 20, 2026", user: "Pooja D.", course: "AI Setup Guide", status: "Completed", amount: "₹450", color: "text-green-500", bg: "bg-green-500/10" },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-gray-800 hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-6 text-gray-400">{row.date}</td>
                      <td className="py-4 px-6 font-medium">{row.user}</td>
                      <td className="py-4 px-6 text-gray-400">{row.course}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${row.color} ${row.bg}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-white">{row.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Table Footer */}
            <div className="p-4 border-t border-gray-800 text-center">
              <p className="text-xs text-gray-500">Showing last 5 transactions</p>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}