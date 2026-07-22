import { useState } from "react";
import {
  FaChartLine,
  FaRobot,
  FaWallet,
  FaBookmark,
  FaNewspaper,
  FaFileInvoiceDollar,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function MemberSidebar({
  open,
  setOpen,
}) {
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Live Market",
      icon: <FaChartLine />,
      path: "/stock-analysis",
    },
    {
      name: "AI Analysis",
      icon: <FaRobot />,
      path: "/stock-analysis",
    },
    {
      name: "Paper Trading",
      icon: <FaFileInvoiceDollar />,
      path: "/paper-trading",
    },
    {
      name: "Portfolio",
      icon: <FaWallet />,
      path: "/portfolio",
    },
    {
      name: "Watchlist",
      icon: <FaBookmark />,
      path: "/watchlist",
    },
    {
      name: "Market News",
      icon: <FaNewspaper />,
      path: "/market-news",
    },
  ];

  return (
    <>
      {/* Overlay */}

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/70 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}

      <aside
        className={`fixed md:static top-0 left-0 z-50 h-screen w-72 bg-zinc-950 border-r border-yellow-500/20 p-6 flex flex-col transition-transform duration-300
        ${
          open
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Mobile Close */}

        <div className="flex items-center justify-between md:block">

          <div>

            <h2 className="text-3xl font-black text-yellow-400">
              Stock Scorcher
            </h2>

            <p className="text-gray-500 mt-2 text-sm tracking-widest">
              PRO MEMBER
            </p>

          </div>

          <button
            className="md:hidden text-2xl text-white"
            onClick={() => setOpen(false)}
          >
            <FaTimes />
          </button>

        </div>

        {/* Navigation */}

        <nav className="mt-10 space-y-2">

          {menuItems.map((item) => (

            <button
              key={item.name}
              onClick={() => {
                navigate(item.path);
                setOpen(false);
              }}
              className="w-full flex items-center gap-4 rounded-xl px-4 py-3 text-gray-400 hover:bg-yellow-400/10 hover:text-yellow-400 transition"
            >
              <span className="text-lg">
                {item.icon}
              </span>

              <span>
                {item.name}
              </span>

            </button>

          ))}

        </nav>

        {/* Bottom */}

        <div className="mt-auto">

          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-400/5 p-5">

            <p className="text-yellow-400 font-bold">
              Premium Access 👑
            </p>

            <p className="text-gray-500 text-sm mt-2">
              You have access to premium trading tools.
            </p>

          </div>

        </div>

      </aside>
    </>
  );
}