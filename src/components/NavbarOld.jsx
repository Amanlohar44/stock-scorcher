import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";

import {
  HiMenu,
  HiX,
  HiChevronDown,
} from "react-icons/hi";

import {
  FaUserCircle,
  FaBell,
  FaSearch,
  FaRobot,
} from "react-icons/fa";

import { MdDashboard } from "react-icons/md";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import { auth } from "../firebase";
import logo from "../assets/logo.png";

export default function Navbar() {

  const [user, setUser] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);

  const [marketOpen, setMarketOpen] = useState(false);

  const profileRef = useRef(null);

  const marketRef = useRef(null);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
      }
    );

    return () => unsubscribe();

  }, []);

  useEffect(() => {

    function handleClick(event) {

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }

      if (
        marketRef.current &&
        !marketRef.current.contains(event.target)
      ) {
        setMarketOpen(false);
      }

    }

    document.addEventListener(
      "mousedown",
      handleClick
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClick
      );

  }, []);

  const handleLogout = async () => {

    await signOut(auth);

    setProfileOpen(false);

    setMenuOpen(false);

  };

  return (

    <nav className="sticky top-0 z-50 w-full border-b border-yellow-500/10 bg-black/80 backdrop-blur-xl">

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
                {/* ================= LOGO ================= */}

        <Link
          to="/"
          className="flex items-center gap-3 flex-shrink-0"
        >

          <img
            src={logo}
            alt="Stock Scorcher"
            className="h-11 w-11 object-contain"
          />

          <div className="hidden sm:block">

            <h1 className="text-xl font-black tracking-wide text-yellow-400">
              Stock Scorcher
            </h1>

            <p className="text-xs text-zinc-400">
              Learn • Analyze • Grow
            </p>

          </div>

        </Link>

        {/* ================= DESKTOP MENU ================= */}

        <div className="hidden lg:flex items-center gap-8">

          <a
  href="/#home"
  className="text-white hover:text-yellow-400 transition"
>
  Home
</a>

          <a
  href="/#courses"
  className="text-white hover:text-yellow-400 transition"
>
  Courses
</a>

          <NavLink
            to="/membership"
            className={({ isActive }) =>
              `rounded-full px-4 py-2 font-semibold transition ${
                isActive
                  ? "bg-yellow-400 text-black"
                  : "border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
              }`
            }
          >
            👑 Membership
          </NavLink>

          {/* Markets */}

          <div
            className="relative"
            ref={marketRef}
          >

            <button
              onClick={() => setMarketOpen(!marketOpen)}
              className="flex items-center gap-2 font-medium text-white hover:text-yellow-400 transition"
            >
              Markets

              <HiChevronDown
                className={`transition duration-300 ${
                  marketOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {marketOpen && (

              <div className="absolute right-0 mt-4 w-56 rounded-2xl border border-yellow-400/20 bg-zinc-900 shadow-2xl overflow-hidden">

                <Link
                  to="/stocks"
                  className="block px-5 py-3 text-white hover:bg-yellow-400 hover:text-black"
                >
                  📈 Stocks
                </Link>

                <Link
                  to="/crypto"
                  className="block px-5 py-3 text-white hover:bg-yellow-400 hover:text-black"
                >
                  ₿ Crypto
                </Link>

                <Link
                  to="/forex"
                  className="block px-5 py-3 text-white hover:bg-yellow-400 hover:text-black"
                >
                  💱 Forex
                </Link>

              </div>

            )}

          </div>

        </div>

        {/* ================= RIGHT ACTIONS ================= */}

        <div className="flex items-center gap-3">
                    {/* ================= SEARCH ================= */}

          <button
            className="hidden lg:flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-white transition-all duration-300 hover:border-yellow-400 hover:text-yellow-400"
          >
            <FaSearch />
          </button>

          {/* ================= AI BUTTON ================= */}

          <Link
            to="/ai"
            className="hidden lg:flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-5 font-bold text-black transition-all duration-300 hover:scale-105"
          >
            <FaRobot />
            AI
          </Link>

          {/* ================= NOTIFICATION ================= */}

          <button
            className="hidden lg:flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-white transition-all duration-300 hover:border-yellow-400 hover:text-yellow-400"
          >
            <FaBell />
          </button>

          {/* ================= PROFILE ================= */}

          <div
            className="relative hidden lg:block"
            ref={profileRef}
          >

            {user ? (

              <>

                <button
                  onClick={() =>
                    setProfileOpen(!profileOpen)
                  }
                  className="flex items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 transition-all duration-300 hover:border-yellow-400"
                >

                  <FaUserCircle className="text-3xl text-yellow-400" />

                  <div className="text-left">

                    <p className="text-sm font-semibold text-white">
                      {user.displayName ||
                        user.email.split("@")[0]}
                    </p>

                    <p className="text-xs text-zinc-400">
                      Premium User
                    </p>

                  </div>

                </button>

                {profileOpen && (

                  <div className="absolute right-0 mt-4 w-64 overflow-hidden rounded-2xl border border-yellow-400/20 bg-zinc-900 shadow-2xl">

                    <Link
                      to="/dashboard"
                      onClick={() =>
                        setProfileOpen(false)
                      }
                      className="flex items-center gap-3 px-5 py-4 text-white transition hover:bg-yellow-400 hover:text-black"
                    >
                      <MdDashboard />
                      Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full px-5 py-4 text-left text-red-400 transition hover:bg-red-500 hover:text-white"
                    >
                      Logout
                    </button>

                  </div>

                )}

              </>

            ) : (

              <Link
                to="/login"
                className="hidden lg:flex h-11 items-center justify-center rounded-xl bg-yellow-400 px-6 font-bold text-black transition-all duration-300 hover:bg-yellow-300"
              >
                Login
              </Link>

            )}

          </div>

          {/* ================= MOBILE MENU ================= */}

          <button
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            className="lg:hidden text-3xl text-yellow-400"
          >

            {menuOpen ? <HiX /> : <HiMenu />}

          </button>

        </div>

      </div>

            {/* ================= MOBILE DRAWER ================= */}

      {menuOpen && (

        <div className="lg:hidden border-t border-yellow-500/10 bg-black/95 backdrop-blur-xl">

          <div className="flex flex-col gap-2 px-5 py-6">

            <a
  href="/#home"
  onClick={() => setMenuOpen(false)}
  className="rounded-xl px-4 py-3 text-white transition hover:bg-yellow-400 hover:text-black"
>
  Home
</a>

            <a
  href="/#courses"
  onClick={() => setMenuOpen(false)}
  className="rounded-xl px-4 py-3 text-white transition hover:bg-yellow-400 hover:text-black"
>
  Courses
</a>

            <Link
              to="/membership"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl bg-yellow-400/10 px-4 py-3 font-semibold text-yellow-400 transition hover:bg-yellow-400 hover:text-black"
            >
              👑 Membership
            </Link>

            <Link
              to="/stocks"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-white transition hover:bg-yellow-400 hover:text-black"
            >
              📈 Stocks
            </Link>

            <Link
              to="/crypto"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-white transition hover:bg-yellow-400 hover:text-black"
            >
              ₿ Crypto
            </Link>

            <Link
              to="/forex"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-white transition hover:bg-yellow-400 hover:text-black"
            >
              💱 Forex
            </Link>

            <div className="my-3 h-px bg-zinc-800"></div>

            {user ? (

              <>

                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl bg-yellow-400 px-4 py-3 text-center font-bold text-black"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="rounded-xl bg-red-500 px-4 py-3 font-semibold text-white"
                >
                  Logout
                </button>

              </>

            ) : (

              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl bg-yellow-400 px-4 py-3 text-center font-bold text-black"
              >
                Login
              </Link>

            )}

          </div>

        </div>

      )}

    </nav>

  );

}