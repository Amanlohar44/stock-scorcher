import { useEffect, useRef } from "react";

export default function TradingViewChart({ symbol }) {
  const container = useRef();

  useEffect(() => {
    container.current.innerHTML = "";

    const script = document.createElement("script");

    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";

    script.async = true;

    script.innerHTML = JSON.stringify({
      width: "100%",
height: 700,
      symbol: `NASDAQ:${symbol}`,
      interval: "D",
      timezone: "Asia/Kolkata",
      theme: "dark",
      style: "1",
      locale: "en",
      withdateranges: true,
      hide_top_toolbar: false,
      allow_symbol_change: true,
      hide_side_toolbar: false,
      save_image: false,
      support_host: "https://www.tradingview.com",
    });

    container.current.appendChild(script);
  }, [symbol]);

  return (
  <div className="bg-zinc-900 border border-yellow-500/20 rounded-3xl overflow-hidden mt-10">

    <div
      ref={container}
      className="tradingview-widget-container w-full h-[700px]"
    />

  </div>
);
}