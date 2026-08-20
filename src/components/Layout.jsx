import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  const location = useLocation();

  const appRoutes = [
    "/dashboard",
    "/member-dashboard",
    "/member-profile",
    "/stock-analysis",
    "/paper-trading",
    "/portfolio",
    "/watchlist",
    "/market-news",
    "/stock-scanner",
    "/community",
    "/research-vault",
    "/ai-assistant",
  ];

  const isAppRoute = appRoutes.some(
    (route) =>
      location.pathname === route ||
      location.pathname.startsWith(`${route}/`)
  );

  if (isAppRoute) {
    return (
      <div className="mobile-app-shell min-h-screen bg-[#030303] text-white">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-yellow-400 selection:text-black flex flex-col">
      <Navbar />

      <main className="min-w-0 w-full flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}