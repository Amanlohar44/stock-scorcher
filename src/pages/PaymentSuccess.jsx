import { Link } from "react-router-dom";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">

      <div className="bg-zinc-900 border border-green-500 rounded-2xl p-10 max-w-xl w-full text-center">

        <div className="text-7xl mb-6">
          🎉
        </div>

        <h1 className="text-4xl font-bold text-green-400">
          Payment Successful
        </h1>

        <p className="text-gray-300 mt-5 text-lg">
          Thank you for purchasing the
          <span className="text-yellow-400 font-bold">
            {" "}Stock Scorcher Premium Course
          </span>.
        </p>

        <p className="text-gray-400 mt-4">
          Your payment has been verified successfully.
          Your course is now unlocked.
        </p>

        <div className="mt-10">

          <Link to="/dashboard">
            <button className="w-full bg-yellow-400 text-black py-4 rounded-xl font-bold hover:bg-yellow-300 transition">
              🚀 Go To Dashboard
            </button>
          </Link>

        </div>

      </div>

    </div>
  );
}