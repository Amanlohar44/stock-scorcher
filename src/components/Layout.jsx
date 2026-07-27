import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import Footer from "./Footer"; 

export default function Layout({ children }) {
  const location = useLocation();

  // In specific routes par public Navbar aur Footer nahi dikhega
  const hideLayoutRoutes = ["/login", "/signup", "/register", "/forgot-password", "/dashboard", "/admin", "/member-dashboard"];
  
  // Exact match ya agar path in dashboards se start hota hai
  const shouldHideLayout = 
    hideLayoutRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/member-dashboard") ||
    location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-yellow-400 selection:text-black flex flex-col justify-between overflow-x-hidden">
      <div>
        {!shouldHideLayout && <Navbar />}
        <main className="min-w-0 w-full">
          {children}
        </main>
      </div>
      {!shouldHideLayout && <Footer />}
    </div>
  );
}