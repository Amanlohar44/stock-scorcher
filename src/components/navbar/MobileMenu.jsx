import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "../ui/Button";

const links = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/#features" },
  { name: "Membership", href: "/#membership" },
  { name: "Courses", href: "/#courses" },
  { name: "Reviews", href: "/#testimonials" },
  { name: "FAQ", href: "/#faq" },
  { name: "Contact", href: "/#contact" },
];

export default function MobileMenu({ open, setOpen }) {
  return (
    <AnimatePresence>

      {open && (

        <>

          {/* Overlay */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          />

          {/* Drawer */}

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35 }}
            className="fixed right-0 top-0 z-50 flex h-screen w-[320px] flex-col border-l border-white/10 bg-[#050505]/95 p-6 backdrop-blur-3xl"
          >

            <div className="mb-10 flex items-center justify-between">

              <h2 className="text-xl font-black">
                STOCK SCORCHER
              </h2>

              <button onClick={() => setOpen(false)}>
                <X />
              </button>

            </div>

            <div className="flex flex-col gap-2">

              {links.map((item) => (

                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-zinc-300 transition hover:bg-white/5 hover:text-yellow-400"
                >
                  {item.name}
                </Link>

              ))}

            </div>

            <div className="mt-auto space-y-3">

              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  window.location.href = "/login";
                }}
              >
                Login
              </Button>

              <Button
                className="w-full"
                onClick={() => {
                  window.location.href = "/membership";
                }}
              >
                Become Premium
              </Button>

            </div>

          </motion.div>

        </>

      )}

    </AnimatePresence>
  );
}