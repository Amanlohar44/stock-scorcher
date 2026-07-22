import { FaUserCircle, FaBars } from "react-icons/fa";

export default function MemberTopbar({
  toggleSidebar,
}) {
  return (
    <div className="h-16 md:h-20 border-b border-yellow-500/20 flex items-center justify-between px-4 md:px-8 bg-black sticky top-0 z-30">

      <div className="flex items-center gap-4">

        <button
          onClick={toggleSidebar}
          className="md:hidden text-2xl text-yellow-400"
        >
          <FaBars />
        </button>

        <h2 className="text-lg md:text-2xl font-bold">
          AI Trading Dashboard
        </h2>

      </div>

      <FaUserCircle className="text-3xl md:text-4xl text-yellow-400"/>

    </div>
  );
}