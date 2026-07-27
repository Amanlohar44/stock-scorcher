import {
  FaChartPie,
  FaBookOpen,
  FaUsers,
  FaChartLine,
  FaCog,
  FaGlobe,
  FaSignOutAlt,
  FaTags,
  FaVideo,
  FaPenFancy,
} from "react-icons/fa";

export default function AdminSidebar({
  active,
  setActive,
  handleLogout,
}) {
  const menu = [
    {
      id: "dashboard",
      icon: <FaChartPie />,
      title: "Dashboard",
    },
    {
      id: "modules",
      icon: <FaBookOpen />,
      title: "Modules",
    },
    {
      id: "live",
      icon: <FaVideo />,
      title: "Live Classes",
    },
    {
      id: "blogs",
      icon: <FaPenFancy />,
      title: "Blogs",
    },
    {
      id: "students",
      icon: <FaUsers />,
      title: "Students",
    },
    {
      id: "analytics",
      icon: <FaChartLine />,
      title: "Analytics",
    },
    {
      id: "coupons",
      icon: <FaTags />,
      title: "Coupons",
    },
    {
      id: "settings",
      icon: <FaCog />,
      title: "Settings",
    },
  ];

  return (
    <aside className="w-72 max-w-[85vw] h-screen bg-zinc-950 border-r border-yellow-500/20 overflow-y-auto">
      <div className="p-6">
        <h1 className="text-3xl font-black text-yellow-400 uppercase tracking-wider">
          Stock Scorcher
        </h1>

        <p className="text-zinc-400 text-xs mt-2 mb-8 uppercase tracking-widest">
          Admin Command Center
        </p>

        <div className="space-y-2 text-xs font-bold uppercase tracking-wider">
          {menu.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition cursor-pointer ${
                active === item.id
                  ? "bg-yellow-400 text-black font-black shadow-[0_0_20px_rgba(250,204,21,0.3)]"
                  : "hover:bg-zinc-900 text-zinc-300 hover:text-white"
              }`}
            >
              {item.icon}
              {item.title}
            </button>
          ))}

          <button
            onClick={() => window.open("/", "_blank")}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-xl hover:bg-zinc-900 text-zinc-300 hover:text-white transition cursor-pointer"
          >
            <FaGlobe />
            Website
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white transition cursor-pointer"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}