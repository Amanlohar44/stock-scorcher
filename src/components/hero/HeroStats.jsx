import {
  FaUsers,
  FaRobot,
  FaChartLine,
  FaShieldAlt,
} from "react-icons/fa";

const stats = [
  {
    icon: <FaUsers className="text-3xl text-yellow-400" />,
    number: "10K+",
    title: "Active Traders",
  },
  {
    icon: <FaRobot className="text-3xl text-cyan-400" />,
    number: "94%",
    title: "AI Accuracy",
  },
  {
    icon: <FaChartLine className="text-3xl text-green-400" />,
    number: "24/7",
    title: "Market Scanner",
  },
  {
    icon: <FaShieldAlt className="text-3xl text-purple-400" />,
    number: "100%",
    title: "Secure Platform",
  },
];

export default function HeroStats() {
  return (
    <div className="mx-auto mt-20 grid max-w-7xl grid-cols-2 gap-5 px-6 lg:grid-cols-4">
      {stats.map((item) => (
        <div
          key={item.title}
          className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-yellow-400"
        >
          {item.icon}

          <h2 className="mt-4 text-4xl font-black">
            {item.number}
          </h2>

          <p className="mt-2 text-zinc-400">
            {item.title}
          </p>
        </div>
      ))}
    </div>
  );
}