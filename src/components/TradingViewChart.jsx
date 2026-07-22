import { useEffect, useRef } from "react";
import getTradingViewSymbol from "../utils/getTradingViewSymbol";

export default function TradingViewChart({ symbol }) {
  const container = useRef(null);

  useEffect(() => {
    if (!container.current) return;

    container.current.innerHTML = "";

    const tradingViewSymbol = getTradingViewSymbol(symbol);

    const script = document.createElement("script");

    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";

    script.type = "text/javascript";
    script.async = true;

    script.innerHTML = JSON.stringify({
      width: "100%",
      height: 850,

      symbol: tradingViewSymbol,

      interval: "D",

      timezone: "Asia/Kolkata",

      theme: "dark",

      style: "1",

      locale: "en",

      enable_publishing: false,

      allow_symbol_change: true,

      withdateranges: true,

      hide_side_toolbar: false,

      hide_top_toolbar: false,

      save_image: false,

      studies: [
        "RSI@tv-basicstudies",
        "MACD@tv-basicstudies",
        "MASimple@tv-basicstudies"
      ],

      support_host: "https://www.tradingview.com",
    });

    container.current.appendChild(script);

  }, [symbol]);

  return (
    <div className="mt-8 rounded-3xl overflow-hidden border border-yellow-500/20 bg-zinc-900 p-2">
      <div
        ref={container}
        className="w-full"
        style={{
          height: "850px",
        }}
      />
    </div>
  );
}