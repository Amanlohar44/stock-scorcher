export default function Loader() {
  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl flex items-center justify-center z-50 selection:bg-yellow-400 selection:text-black">
      <div className="flex flex-col items-center space-y-4 px-6 text-center">

        {/* Glowing Spinner */}
        <div className="relative">
          <div className="absolute -inset-4 rounded-full bg-yellow-400/20 blur-xl animate-pulse" />
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin shadow-2xl" />
        </div>

        {/* Brand Heading */}
        <h2 className="mt-4 text-yellow-400 text-xl sm:text-2xl font-black tracking-tight uppercase">
          Stock Scorcher
        </h2>

        {/* Status Subtext */}
        <p className="text-zinc-400 text-xs sm:text-sm font-semibold tracking-widest uppercase animate-pulse">
          Loading Terminal...
        </p>

      </div>
    </div>
  );
}