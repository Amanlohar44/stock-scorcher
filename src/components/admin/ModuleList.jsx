export default function ModuleList({
  modules,
  editingId,
  editTitle,
  setEditTitle,
  editVideo,
  setEditVideo,
  editPdf,
  setEditPdf,
  editDay,
  setEditDay,
  setEditingId,
  handleEdit,
  handleDelete,
}) {
  return (
    <div className="bg-zinc-900 border border-yellow-500 rounded-2xl p-8 mb-10">

      <h2 className="text-3xl font-bold text-yellow-400 mb-6">
        📚 All Modules
      </h2>

      <div className="space-y-4">

        {modules.length === 0 ? (

          <p className="text-gray-400">
            No Modules Added Yet
          </p>

        ) : (

          modules.map((module) => (

            <div
              key={module.id}
              className="bg-black border border-yellow-500 rounded-xl p-5"
            >

              <p className="text-yellow-400 font-semibold mb-2">
                📁 Day {module.day}
              </p>

              {editingId === module.id ? (

                <div className="space-y-4">

                  <input
                    type="number"
                    value={editDay}
                    onChange={(e) => setEditDay(e.target.value)}
                    className="w-full bg-zinc-900 border border-yellow-500 rounded-lg p-3"
                  />

                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-zinc-900 border border-yellow-500 rounded-lg p-3"
                  />

                  <input
                    type="text"
                    value={editVideo}
                    onChange={(e) => setEditVideo(e.target.value)}
                    className="w-full bg-zinc-900 border border-yellow-500 rounded-lg p-3"
                  />

                  <input
                    type="text"
                    value={editPdf}
                    onChange={(e) => setEditPdf(e.target.value)}
                    className="w-full bg-zinc-900 border border-yellow-500 rounded-lg p-3"
                  />

                  <div className="flex gap-3">

                    <button
                      onClick={handleEdit}
                      className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-lg font-bold"
                    >
                      💾 Save
                    </button>

                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditTitle("");
                        setEditVideo("");
                        setEditPdf("");
                        setEditDay("");
                      }}
                      className="bg-gray-600 hover:bg-gray-700 px-5 py-2 rounded-lg font-bold"
                    >
                      Cancel
                    </button>

                  </div>

                </div>

              ) : (

                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">

                  <div>

                    <h3 className="text-xl font-bold">
                      {module.title}
                    </h3>

                    <p className="text-gray-400 break-all mt-2">
                      {module.video}
                    </p>

                    {module.pdf && (
                      <p className="text-green-400 break-all mt-2">
                        📄 {module.pdf}
                      </p>
                    )}

                  </div>

                  <div className="flex gap-3">

                    <button
                      onClick={() => {
                        setEditingId(module.id);
                        setEditDay(module.day);
                        setEditTitle(module.title);
                        setEditVideo(module.video);
                        setEditPdf(module.pdf || "");
                      }}
                      className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg font-bold"
                    >
                      ✏ Edit
                    </button>

                    <button
                      onClick={() => handleDelete(module.id)}
                      className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg font-bold"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              )}

            </div>

          ))

        )}

      </div>

    </div>
  );
}