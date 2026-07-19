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

  const revenueTarget = 100000;

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

      {/* Revenue */}

      <div className="bg-zinc-900 border border-yellow-500 rounded-2xl p-6">

        <h2 className="text-xl font-bold text-yellow-400 mb-5">
          Revenue Progress
        </h2>

        <div className="w-full bg-zinc-800 rounded-full h-4">

          <div
            className="bg-green-500 h-4 rounded-full"
            style={{
              width: `${revenuePercent}%`,
            }}
          />

        </div>

        <p className="mt-4 text-gray-300">
          ₹{totalRevenue}
        </p>

      </div>

      {/* Students */}

      <div className="bg-zinc-900 border border-yellow-500 rounded-2xl p-6">

        <h2 className="text-xl font-bold text-yellow-400 mb-5">
          Successful Payments
        </h2>

        <div className="w-full bg-zinc-800 rounded-full h-4">

          <div
            className="bg-blue-500 h-4 rounded-full"
            style={{
              width: `${paymentPercent}%`,
            }}
          />

        </div>

        <p className="mt-4 text-gray-300">
          {paidStudents} / {students.length}
        </p>

      </div>

      {/* Modules */}

      <div className="bg-zinc-900 border border-yellow-500 rounded-2xl p-6">

        <h2 className="text-xl font-bold text-yellow-400 mb-5">
          Course Progress
        </h2>

        <div className="w-full bg-zinc-800 rounded-full h-4">

          <div
            className="bg-yellow-400 h-4 rounded-full"
            style={{
              width: `${modulePercent}%`,
            }}
          />

        </div>

        <p className="mt-4 text-gray-300">
          {modules.length} Modules
        </p>

      </div>

    </div>
  );
}