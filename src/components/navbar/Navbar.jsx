import { useEffect, useState } from "react";
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

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-white/10 bg-[#050505]/80 backdrop-blur-2xl shadow-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          <Logo />

          <DesktopMenu />

          {/* Mobile Button */}
          <button
            onClick={() => setOpen(true)}
            className="rounded-xl border border-white/10 p-3 text-white transition hover:border-yellow-400 hover:text-yellow-400 lg:hidden"
          >
            <Menu size={22} />
          </button>

        </div>
      </motion.header>

      <MobileMenu open={open} setOpen={setOpen} />
    </>
  );
}