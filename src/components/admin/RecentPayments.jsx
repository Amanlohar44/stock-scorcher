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
    <div className="bg-zinc-900 border border-yellow-500 rounded-2xl p-8">

      <h2 className="text-2xl font-bold text-yellow-400 mb-6">
        💳 Recent Payments
      </h2>

      {recentPayments.length === 0 ? (

        <p className="text-gray-400">
          No Payments Yet
        </p>

      ) : (

        <div className="space-y-4">

          {recentPayments.map((student) => (

            <div
              key={student.id}
              className="flex justify-between items-center border-b border-zinc-700 pb-3"
            >

              <div>

                <h3 className="font-semibold">
                  {student.email}
                </h3>

                <p className="text-sm text-gray-400">
                  {student.purchasedAt
                    ? new Date(
                        student.purchasedAt
                      ).toLocaleDateString()
                    : "-"}
                </p>

              </div>

              <div className="text-right">

                <p className="text-green-400 font-bold">
                  ₹{student.course}
                </p>

                <p className="text-xs text-gray-400">
                  Paid
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}