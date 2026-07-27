import { FaUsers, FaRupeeSign, FaBookOpen, FaCheckCircle } from "react-icons/fa";

export default function StatsCards({
  students,
  modules,
  totalRevenue,
}) {
  const paidCount = students.filter(
    (s) => s.paymentStatus === "paid"
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      
      {/* Students Card */}
      <div className="bg-zinc-950 border border-yellow-500/30 rounded-[2rem] p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden group hover:border-yellow-400/50 transition-all">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Total Students</span>
          <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 shadow-inner">
            <FaUsers size={18} />
          </div>
        </div>
        <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          {students.length}
        </p>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2">
          Registered Accounts
        </p>
      </div>

      {/* Revenue Card */}
      <div className="bg-zinc-950 border border-yellow-500/30 rounded-[2rem] p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden group hover:border-emerald-500/50 transition-all">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Total Revenue</span>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
            <FaRupeeSign size={18} />
          </div>
        </div>
        <p className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
          ₹{totalRevenue.toLocaleString("en-IN")}
        </p>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2">
          Masterclass Sales
        </p>
      </div>

      {/* Modules Card */}
      <div className="bg-zinc-950 border border-yellow-500/30 rounded-[2rem] p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden group hover:border-yellow-400/50 transition-all">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Course Modules</span>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
            <FaBookOpen size={18} />
          </div>
        </div>
        <p className="text-3xl sm:text-4xl font-black text-yellow-400 tracking-tight">
          {modules.length}
        </p>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2">
          Published Days
        </p>
      </div>

      {/* Paid Payments Card */}
      <div className="bg-zinc-950 border border-yellow-500/30 rounded-[2rem] p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden group hover:border-blue-500/50 transition-all">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Paid Enrollees</span>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner">
            <FaCheckCircle size={18} />
          </div>
        </div>
        <p className="text-3xl sm:text-4xl font-black text-blue-400 tracking-tight">
          {paidCount}
        </p>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2">
          Verified Orders
        </p>
      </div>

    </div>
  );
}