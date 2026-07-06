export default function ProgressBar({ progress }) {
  return (
    <div className="w-full bg-zinc-700 rounded-full h-3 overflow-hidden">
      <div
        className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}