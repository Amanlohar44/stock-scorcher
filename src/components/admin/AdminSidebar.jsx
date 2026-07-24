import {
  FaChartPie,
  FaBookOpen,
  FaUsers,
  FaChartLine,
  FaCog,
  FaGlobe,
  FaSignOutAlt,
  FaTags,
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

        <h1 className="text-3xl font-bold text-yellow-400">
          Stock Scorcher
        </h1>

        <p className="text-gray-400 text-sm mt-2 mb-8">
          Admin Panel
        </p>

        <div className="space-y-2">

          {menu.map((item) => (

            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition ${
                active === item.id
                  ? "bg-yellow-400 text-black font-bold"
                  : "hover:bg-zinc-800 text-white"
              }`}
            >
              {item.icon}

              {item.title}

            </button>

          ))}

          <button
            onClick={() => window.open("/", "_blank")}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-xl hover:bg-zinc-800 transition"
          >
            <FaGlobe />

            Website

          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition"
          >
            <FaSignOutAlt />

            Logout

          </button>

        </div>

      </div>

    </aside>
  );
}