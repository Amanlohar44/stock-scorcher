import { FaEdit, FaTrash, FaSave, FaTimes, FaVideo, FaFilePdf, FaBook } from "react-icons/fa";

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
    <div className="bg-zinc-950 border border-yellow-500/30 rounded-[2rem] p-6 sm:p-8 mb-10 shadow-2xl backdrop-blur-xl">
      <h2 className="text-2xl sm:text-3xl font-black text-yellow-400 uppercase tracking-wider mb-6 flex items-center gap-2">
        <FaBook size={24} /> All Course Modules ({modules.length})
      </h2>

      <div className="space-y-4">
        {modules.length === 0 ? (
          <p className="text-zinc-500 text-sm font-light py-8 text-center">
            No Modules Added Yet. Start by publishing one above!
          </p>
        ) : (
          modules.map((module) => (
            <div
              key={module.id}
              className="bg-black border border-white/10 rounded-2xl p-6 transition-all hover:border-yellow-500/30 shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-3.5 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-[10px] font-black uppercase tracking-wider">
                  📁 Day {module.day}
                </span>
              </div>

              {editingId === module.id ? (
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Edit Day Number</label>
                    <input
                      type="number"
                      value={editDay}
                      onChange={(e) => setEditDay(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-yellow-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Edit Module Title</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-yellow-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Edit Video Link</label>
                    <input
                      type="text"
                      value={editVideo}
                      onChange={(e) => setEditVideo(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-yellow-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Edit PDF Link</label>
                    <input
                      type="text"
                      value={editPdf}
                      onChange={(e) => setEditPdf(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-yellow-400 outline-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleEdit}
                      className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-md"
                    >
                      <FaSave /> Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditTitle("");
                        setEditVideo("");
                        setEditPdf("");
                        setEditDay("");
                      }}
                      className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                    >
                      <FaTimes /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                      {module.title}
                    </h3>
                    <p className="text-xs text-zinc-400 break-all flex items-center gap-2 font-light">
                      <FaVideo className="text-yellow-400 shrink-0" /> {module.video}
                    </p>
                    {module.pdf && (
                      <p className="text-xs text-emerald-400 break-all flex items-center gap-2 font-medium">
                        <FaFilePdf className="shrink-0" /> {module.pdf}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => {
                        setEditingId(module.id);
                        setEditDay(module.day);
                        setEditTitle(module.title);
                        setEditVideo(module.video);
                        setEditPdf(module.pdf || "");
                      }}
                      className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-black px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-md active:scale-95"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(module.id)}
                      className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 hover:bg-red-500 hover:text-white text-red-400 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-md active:scale-95"
                    >
                      <FaTrash /> Delete
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