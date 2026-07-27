import React from "react";
import { NavLink } from "react-router-dom";

export default function NavButton({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative px-3 py-2 text-sm font-medium transition-all duration-300 ${
          isActive
            ? "text-yellow-400 font-bold drop-shadow-[0_0_10px_rgba(250,204,21,0.4)]"
            : "text-zinc-300 hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {children}
          {isActive && (
            <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
          )}
        </>
      )}
    </NavLink>
  );
}