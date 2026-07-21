import { FaUserCircle } from "react-icons/fa";

export default function MemberTopbar() {
  return (
    <div className="h-20 border-b border-yellow-500/20 flex items-center justify-between px-8">

      <h2 className="text-2xl font-bold">
        AI Trading Dashboard
      </h2>

      <FaUserCircle className="text-4xl text-yellow-400"/>

    </div>
  );
}