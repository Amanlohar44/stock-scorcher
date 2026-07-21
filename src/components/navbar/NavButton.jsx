import { NavLink } from "react-router-dom";

export default function NavButton({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative px-4 py-2 text-sm font-medium transition-all duration-300 ${
          isActive
            ? "text-yellow-400"
            : "text-zinc-300 hover:text-white"
        }`
      }
    >
      {children}
    </NavLink>
  );
}