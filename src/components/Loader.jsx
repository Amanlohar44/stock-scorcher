export default function Loader() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="flex flex-col items-center">

        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>

        <h2 className="mt-6 text-yellow-400 text-2xl font-bold">
          Stock Scorcher
        </h2>

        <p className="text-gray-400 mt-2">
          Loading...
        </p>

      </div>
    </div>
  );
}