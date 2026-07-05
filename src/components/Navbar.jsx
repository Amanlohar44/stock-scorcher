import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-4 md:px-8 py-4 md:py-5 border-b border-yellow-500/20 bg-black sticky top-0 z-50">
      <h1 className="text-xl md:text-3xl font-bold text-yellow-400">
        Stock Scorcher
      </h1>

      <ul className="hidden lg:flex gap-8 text-gray-300">
        <li className="hover:text-yellow-400 cursor-pointer">Home</li>
        <li className="hover:text-yellow-400 cursor-pointer">Features</li>
        <li className="hover:text-yellow-400 cursor-pointer">Courses</li>
        <li className="hover:text-yellow-400 cursor-pointer">Pricing</li>
        <li className="hover:text-yellow-400 cursor-pointer">Contact</li>
      </ul>

      <Link
        to="/login"
        className="bg-yellow-400 text-black px-4 md:px-5 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition text-sm md:text-base"
      >
        Login
      </Link>
    </nav>
  );
}