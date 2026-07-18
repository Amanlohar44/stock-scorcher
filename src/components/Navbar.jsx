import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import logo from "../assets/logo.png";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
const [user, setUser] = useState(null);
const [profileOpen, setProfileOpen] = useState(false);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  return () => unsubscribe();
}, []);

const handleLogout = async () => {
  await signOut(auth);
  setProfileOpen(false);
};

  return (
    <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-yellow-500/20">

      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">

        {/* Logo */}
        <div className="flex items-center gap-2 min-w-0">
  <img
    src={logo}
    alt="Stock Scorcher"
    className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-contain flex-shrink-0"
  />

  <h1 className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-yellow-400 truncate">
    Stock Scorcher
  </h1>
</div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-6 lg:gap-10 text-white font-medium">

          <li><a href="#home" className="hover:text-yellow-400 duration-300">Home</a></li>
          <li><a href="#features" className="hover:text-yellow-400 duration-300">Features</a></li>
          <li><a href="#courses" className="hover:text-yellow-400 duration-300">Courses</a></li>
          <li><a href="#pricing" className="hover:text-yellow-400 duration-300">Pricing</a></li>
          <li><a href="#contact" className="hover:text-yellow-400 duration-300">Contact</a></li>

        </ul>

        {/* Desktop Login */}
       <div className="hidden md:block relative">

  {user ? (

    <>
      <button
        onClick={() => setProfileOpen(!profileOpen)}
        className="flex items-center gap-2 text-white hover:text-yellow-400"
      >
        <FaUserCircle className="text-4xl" />
        <span className="font-semibold">
          {user.displayName || user.email.split("@")[0]}
        </span>
      </button>

      {profileOpen && (
        <div className="absolute right-0 mt-3 w-48 bg-zinc-900 border border-yellow-400 rounded-xl overflow-hidden shadow-xl">

          <Link
            to="/dashboard"
            className="block px-5 py-3 hover:bg-yellow-400 hover:text-black"
            onClick={() => setProfileOpen(false)}
          >
            Dashboard
          </Link>

          <button
            onClick={handleLogout}
            className="w-full text-left px-5 py-3 hover:bg-red-500 hover:text-white"
          >
            Logout
          </button>

        </div>
      )}
    </>

  ) : (

    <Link
      to="/login"
      className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-semibold hover:bg-yellow-300 duration-300"
    >
      Login
    </Link>

  )}

</div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-yellow-400 text-3xl flex-shrink-0"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black border-t border-yellow-500/20">

          <div className="flex flex-col py-4">

            <a
  href="#home"
  onClick={() => setMenuOpen(false)}
  className="px-6 py-3 hover:text-yellow-400 text-white"
>Home</a>
            <a href="#features" className="px-6 py-3 hover:text-yellow-400 text-white">Features</a>
            <a href="#courses" className="px-6 py-3 hover:text-yellow-400 text-white">Courses</a>
            <a href="#pricing" className="px-6 py-3 hover:text-yellow-400 text-white">Pricing</a>
            <a href="#contact" className="px-6 py-3 hover:text-yellow-400 text-white">Contact</a>

            <div className="px-6 pt-4">

  {user ? (

    <>
      <Link
  to="/dashboard"
  onClick={() => setMenuOpen(false)}
        className="block text-center bg-yellow-400 text-black py-3 rounded-xl font-semibold mb-3"
      >
        Dashboard
      </Link>

      <button
        onClick={handleLogout}
        className="w-full bg-red-500 text-white py-3 rounded-xl"
      >
        Logout
      </button>
    </>

  ) : (

    <Link
  to="/login"
  onClick={() => setMenuOpen(false)}
      className="block text-center bg-yellow-400 text-black py-3 rounded-xl font-semibold"
    >
      Login
    </Link>

  )}

</div>

          </div>
        </div>
      )}
    </nav>
  );
}