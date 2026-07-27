import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "./Logo";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-yellow-500/20 bg-[#030303]/90 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">

          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <Logo />
          </div>

          {/* Desktop Navigation Links */}
          <DesktopMenu />

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setOpen(true)}
            aria-label="Open Mobile Menu"
            className="rounded-xl border border-yellow-500/20 bg-zinc-950 p-3 text-white transition-all hover:border-yellow-400 hover:text-yellow-400 lg:hidden cursor-pointer shadow-lg active:scale-95"
          >
            <Menu size={22} />
          </button>

        </div>
      </motion.header>

      {/* Mobile Drawer Menu */}
      <MobileMenu open={open} setOpen={setOpen} />
    </>
  );
}