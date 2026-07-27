export default function DashboardCharts({
  students,
  modules,
  totalRevenue,
}) {
  const paidStudents = students.filter(
    (s) => s.paymentStatus === "paid"
  ).length;

  const paymentPercent =
    students.length === 0
      ? 0
      : Math.round((paidStudents / students.length) * 100);

  const revenueTarget = 10000000;

  const revenuePercent = Math.min(
    Math.round((totalRevenue / revenueTarget) * 100),
    100
  );

  const moduleTarget = 100;

  const modulePercent = Math.min(
    Math.round((modules.length / moduleTarget) * 100),
    100
  );

  return (
    <div className="grid lg:grid-cols-3 gap-6 mb-10">

      {/* Revenue Progress */}
      <div className="bg-zinc-950 border border-yellow-500/30 rounded-[2rem] p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-black uppercase tracking-wider text-yellow-400">
            Revenue Progress
          </h2>
          <span className="text-xs font-bold text-zinc-400">{revenuePercent}%</span>
        </div>

        <div className="w-full bg-zinc-900 border border-white/5 rounded-full h-3.5 p-0.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-600 to-green-400 h-full rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]"
            style={{
              width: `${revenuePercent}%`,
            }}
          />
        </div>

        <div className="mt-5 flex items-baseline justify-between">
          <p className="text-2xl font-black text-white tracking-tight">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </p>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            Target: ₹{revenueTarget.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Successful Payments */}
      <div className="bg-zinc-950 border border-yellow-500/30 rounded-[2rem] p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-black uppercase tracking-wider text-yellow-400">
            Successful Payments
          </h2>
          <span className="text-xs font-bold text-zinc-400">{paymentPercent}%</span>
        </div>

        <div className="w-full bg-zinc-900 border border-white/5 rounded-full h-3.5 p-0.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]"
            style={{
              width: `${paymentPercent}%`,
            }}
          />
        </div>

        <div className="mt-5 flex items-baseline justify-between">
          <p className="text-2xl font-black text-white tracking-tight">
            {paidStudents} <span className="text-xs text-zinc-400 font-normal">/ {students.length} Students</span>
          </p>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            Paid Status
          </span>
        </div>
      </div>

      {/* Course Progress */}
      <div className="bg-zinc-950 border border-yellow-500/30 rounded-[2rem] p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-black uppercase tracking-wider text-yellow-400">
            Course Masterclass
          </h2>
          <span className="text-xs font-bold text-zinc-400">{modulePercent}%</span>
        </div>

        <div className="w-full bg-zinc-900 border border-white/5 rounded-full h-3.5 p-0.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(250,204,21,0.4)]"
            style={{
              width: `${modulePercent}%`,
            }}
          />
        </div>

        <div className="mt-5 flex items-baseline justify-between">
          <p className="text-2xl font-black text-white tracking-tight">
            {modules.length} <span className="text-xs text-zinc-400 font-normal">Modules Active</span>
          </p>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            Target: {moduleTarget}
          </span>
        </div>
      </div>

    </div>
  );
}