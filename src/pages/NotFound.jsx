import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-6">

      <h1 className="text-8xl font-bold text-yellow-400">
        404
      </h1>

      <h2 className="text-3xl font-bold mt-6">
        Page Not Found
      </h2>

      <p className="text-gray-400 mt-4 text-center max-w-md">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>

      <Link
        to="/"
        className="mt-8 bg-yellow-400 text-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-300 transition"
      >
        Go Back Home
      </Link>

    </div>
  );
}