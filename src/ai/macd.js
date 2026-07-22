// =======================================
// MACD (Moving Average Convergence Divergence)
// Stock • Crypto • Forex
// =======================================

import { calculateEMA } from "./ema";

export function calculateMACD(prices) {
  if (!prices || prices.length < 35) {
    return null;
  }

  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);

  if (ema12 === null || ema26 === null) {
    return null;
  }

  const macd = ema12 - ema26;

  return {
    macd: Number(macd.toFixed(2)),
    signal:
      macd > 0
        ? "Bullish"
        : "Bearish",
  };
}