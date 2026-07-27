export default function AddModule({
  day,
  setDay,
  title,
  setTitle,
  video,
  setVideo,
  pdf,
  setPdf,
  handleAddModule,
}) {
  return (
    <div className="bg-zinc-950 border border-yellow-500/30 rounded-[2rem] p-6 sm:p-8 mb-10 shadow-2xl backdrop-blur-xl">
      <h2 className="text-2xl sm:text-3xl font-black text-yellow-400 uppercase tracking-wider mb-6">
        ➕ Add New Course Module
      </h2>

      <div className="space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Day Number</label>
          <input
            type="number"
            placeholder="e.g. 1, 2, 3..."
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm text-white focus:border-yellow-400 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Module Title</label>
          <input
            type="text"
            placeholder="e.g. Advanced Price Action & Candlesticks"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm text-white focus:border-yellow-400 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">YouTube Video Link</label>
          <input
            type="text"
            placeholder="Paste YouTube watch or share link"
            value={video}
            onChange={(e) => setVideo(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm text-white focus:border-yellow-400 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">PDF Study Notes Link (Optional)</label>
          <input
            type="text"
            placeholder="Paste Google Drive or PDF asset link"
            value={pdf}
            onChange={(e) => setPdf(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm text-white focus:border-yellow-400 outline-none transition-all"
          />
        </div>

        <button
          onClick={handleAddModule}
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-4 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(250,204,21,0.3)] cursor-pointer active:scale-95 mt-4"
        >
          ➕ Publish Module
        </button>
      </div>
    </div>
  );
}