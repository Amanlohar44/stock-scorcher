import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-5 border-b border-yellow-500/20 bg-black sticky top-0 z-50">

      <h1 className="text-3xl font-bold text-yellow-400">
        Stock Scorcher
      </h1>

      <ul className="hidden md:flex gap-8 text-gray-300">

        <li>
          <a href="#home" className="hover:text-yellow-400">
            Home
          </a>
        </li>

        <li>
          <a href="#features" className="hover:text-yellow-400">
            Features
          </a>
        </li>

        <li>
          <a href="#courses" className="hover:text-yellow-400">
            Courses
          </a>
        </li>

        <li>
          <a href="#pricing" className="hover:text-yellow-400">
            Pricing
          </a>
        </li>

        <li>
          <a href="#contact" className="hover:text-yellow-400">
            Contact
          </a>
        </li>

      </ul>

      <Link
        to="/login"
        className="bg-yellow-400 text-black px-5 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
      >
        Login
      </Link>

    </nav>
  );
}