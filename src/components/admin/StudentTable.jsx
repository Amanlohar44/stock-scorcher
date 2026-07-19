export default function StudentTable({
  students,
  search,
  setSearch,
}) {
  const filteredStudents = students.filter((student) =>
    student.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-zinc-900 border border-yellow-500 rounded-2xl p-8">

      <h2 className="text-3xl font-bold text-yellow-400 mb-6">
        👨‍🎓 Purchased Students
      </h2>

      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search student by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-black border border-yellow-500 rounded-xl p-4"
        />
      </div>

      <div className="overflow-x-auto">

        <table className="w-full border-collapse">

          <thead>

            <tr className="bg-yellow-400 text-black">

              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-center">Course</th>
              <th className="p-3 text-center">Payment</th>
              <th className="p-3 text-center">Payment ID</th>
              <th className="p-3 text-center">Purchased At</th>

            </tr>

          </thead>

          <tbody>

            {filteredStudents.length === 0 ? (

              <tr>

                <td
                  colSpan="5"
                  className="text-center py-8 text-gray-400"
                >
                  No Students Found
                </td>

              </tr>

            ) : (

              filteredStudents.map((student) => (

                <tr
                  key={student.id}
                  className="border-b border-zinc-700 hover:bg-zinc-800"
                >

                  <td className="p-4">
                    {student.email}
                  </td>

                  <td className="text-center">
                    ₹{student.course}
                  </td>

                  <td className="text-center">

                    <span className="bg-green-600 px-3 py-1 rounded-full text-sm">
                      {student.paymentStatus}
                    </span>

                  </td>

                  <td className="text-center text-xs">
                    {student.paymentId}
                  </td>

                  <td className="text-center text-sm">
                    {student.purchasedAt
                      ? new Date(student.purchasedAt).toLocaleDateString()
                      : "-"}
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}