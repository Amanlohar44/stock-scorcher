import { FaCreditCard, FaCheckCircle, FaUser } from "react-icons/fa";

export default function RecentPayments({ students }) {
  const recentPayments = [...students]
    .filter((student) => student.paymentStatus === "paid")
    .sort(
      (a, b) =>
        new Date(b.purchasedAt || 0) -
        new Date(a.purchasedAt || 0)
    )
    .slice(0, 5);

  return (
    <div className="bg-zinc-950 border border-yellow-500/30 rounded-[2rem] p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
      <h2 className="text-xl sm:text-2xl font-black text-yellow-400 uppercase tracking-wider mb-6 flex items-center gap-2">
        <FaCreditCard size={20} /> Recent Successful Payments
      </h2>

      {recentPayments.length === 0 ? (
        <p className="text-zinc-500 text-xs font-light py-6 text-center">
          No payment records found yet.
        </p>
      ) : (
        <div className="space-y-4">
          {recentPayments.map((student) => (
            <div
              key={student.id}
              className="flex justify-between items-center border-b border-zinc-900 pb-4 last:border-b-0 last:pb-0"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <FaUser size={14} />
                </div>
                <div>
                  <h3 className="font-black text-white text-xs sm:text-sm tracking-tight">
                    {student.email}
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5 font-light">
                    Date: {student.purchasedAt ? new Date(student.purchasedAt).toLocaleDateString() : "-"}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-emerald-400 font-black text-sm sm:text-base tracking-tight">
                  +₹{Number(student.course || 0).toLocaleString("en-IN")}
                </p>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider mt-0.5">
                  <FaCheckCircle size={10} /> Verified Paid
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}