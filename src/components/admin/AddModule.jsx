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
    <div className="bg-zinc-900 border border-yellow-500 rounded-2xl p-8 mb-10">

      <h2 className="text-3xl font-bold text-yellow-400 mb-6">
        ➕ Add New Module
      </h2>

      <div className="space-y-5">

        <input
          type="number"
          placeholder="Day Number (1,2,3...)"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className="w-full bg-black border border-yellow-500 rounded-xl p-4"
        />

        <input
          type="text"
          placeholder="Module Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-black border border-yellow-500 rounded-xl p-4"
        />

        <input
          type="text"
          placeholder="YouTube Video Link"
          value={video}
          onChange={(e) => setVideo(e.target.value)}
          className="w-full bg-black border border-yellow-500 rounded-xl p-4"
        />

        <input
          type="text"
          placeholder="PDF Link (Optional)"
          value={pdf}
          onChange={(e) => setPdf(e.target.value)}
          className="w-full bg-black border border-yellow-500 rounded-xl p-4"
        />

        <button
          onClick={handleAddModule}
          className="w-full bg-yellow-400 text-black py-4 rounded-xl font-bold hover:bg-yellow-300 transition"
        >
          ➕ Add Module
        </button>

      </div>

    </div>
  );
}