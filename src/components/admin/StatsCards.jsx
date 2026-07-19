export default function StatsCards({
  students,
  modules,
  totalRevenue,
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

      <div className="bg-zinc-900 border border-yellow-500 rounded-xl p-6 text-center">
        <h2 className="text-gray-400">Students</h2>

        <p className="text-3xl md:text-4xl font-bold text-yellow-400 mt-3">
          {students.length}
        </p>
      </div>

      <div className="bg-zinc-900 border border-yellow-500 rounded-xl p-6 text-center">
        <h2 className="text-gray-400">Revenue</h2>

        <p className="text-3xl md:text-4xl font-bold text-green-400 mt-3">
          ₹{totalRevenue}
        </p>
      </div>

      <div className="bg-zinc-900 border border-yellow-500 rounded-xl p-6 text-center">
        <h2 className="text-gray-400">Modules</h2>

        <p className="text-3xl md:text-4xl font-bold text-yellow-400 mt-3">
          {modules.length}
        </p>
      </div>

      <div className="bg-zinc-900 border border-yellow-500 rounded-xl p-6 text-center">
        <h2 className="text-gray-400">Payments</h2>

        <p className="text-3xl md:text-4xl font-bold text-green-400 mt-3">
          {
            students.filter(
              (s) => s.paymentStatus === "paid"
            ).length
          }
        </p>
      </div>

    </div>
  );
}