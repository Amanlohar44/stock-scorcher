export default function RecentActivity({
  students,
  modules,
}) {
  const recentModules = [...modules]
    .sort(
      (a, b) =>
        new Date(b.createdAt?.seconds * 1000 || 0) -
        new Date(a.createdAt?.seconds * 1000 || 0)
    )
    .slice(0, 3);

  const recentStudents = [...students]
    .sort(
      (a, b) =>
        new Date(b.purchasedAt || 0) -
        new Date(a.purchasedAt || 0)
    )
    .slice(0, 3);

  return (
    <div className="bg-zinc-900 border border-yellow-500 rounded-2xl p-8">

      <h2 className="text-2xl font-bold text-yellow-400 mb-6">
        🕒 Recent Activity
      </h2>

      <div className="space-y-4">

        {recentStudents.map((student) => (
          <div
            key={student.id}
            className="border-b border-zinc-700 pb-3"
          >
            <p className="font-semibold">
              👨‍🎓 {student.email}
            </p>

            <p className="text-sm text-gray-400">
              Purchased Course ₹{student.course}
            </p>
          </div>
        ))}

        {recentModules.map((module) => (
          <div
            key={module.id}
            className="border-b border-zinc-700 pb-3"
          >
            <p className="font-semibold">
              📚 {module.title}
            </p>

            <p className="text-sm text-gray-400">
              Added to Day {module.day}
            </p>
          </div>
        ))}

      </div>

    </div>
  );
}