import { motion } from "framer-motion";

const ticker = [
  { name: "NIFTY 50", value: "+1.28%", color: "text-green-400" },
  { name: "SENSEX", value: "+0.92%", color: "text-green-400" },
  { name: "BANKNIFTY", value: "+1.14%", color: "text-green-400" },

  { name: "BTC", value: "$118,420", color: "text-orange-400" },
  { name: "ETH", value: "$6,210", color: "text-cyan-400" },

  { name: "EUR/USD", value: "1.183", color: "text-blue-400" },
  { name: "GBP/USD", value: "1.372", color: "text-blue-400" },

  { name: "GOLD", value: "$3,420", color: "text-yellow-400" },
  { name: "CRUDE", value: "$82.41", color: "text-red-400" },

  { name: "NASDAQ", value: "+0.86%", color: "text-green-400" },
];

export default function MarketTicker() {
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-white/[0.03] backdrop-blur-2xl">

      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          duration: 30,
          ease: "linear",
        }}
        className="flex w-max"
      >
        {[...ticker, ...ticker].map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-8 py-3"
          >
            <span className="text-zinc-500">
              ●
            </span>

            <span className="font-semibold text-white">
              {item.name}
            </span>

            <span className={`${item.color} font-bold`}>
              {item.value}
            </span>
          </div>
        ))}
      </motion.div>

    </div>
  );
}