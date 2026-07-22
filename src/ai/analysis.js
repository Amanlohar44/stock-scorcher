// =======================================
// AI Analysis Engine
// Stock • Crypto • Forex
// =======================================

import { calculateRSI } from "./rsi";
import { calculateEMA } from "./ema";
import { calculateMACD } from "./macd";
import { calculateSupportResistance } from "./supportResistance";

export function generateAIAnalysis(prices) {
  if (!prices || prices.length < 35) {
    return null;
  }

  const currentPrice = prices[prices.length - 1];

  const rsi = calculateRSI(prices);

  const ema20 = calculateEMA(prices, 20);

  const ema50 = calculateEMA(prices, 50);

  const macd = calculateMACD(prices);

  const levels =
    calculateSupportResistance(prices);

  let score = 0;

  const reasons = [];

  // RSI

  if (rsi > 30 && rsi < 70) {
    score += 25;
    reasons.push("Healthy RSI");
  }

  // EMA

  if (currentPrice > ema20) {
    score += 25;
    reasons.push("Price Above EMA20");
  }

  if (currentPrice > ema50) {
    score += 20;
    reasons.push("Price Above EMA50");
  }

  // MACD

  if (macd.signal === "Bullish") {
    score += 30;
    reasons.push("Bullish MACD");
  }

  let signal = "HOLD";

  if (score >= 80) {
    signal = "BUY";
  }

  else if (score <= 30) {
    signal = "SELL";
  }

  return {

    signal,

    confidence: score,

    rsi,

    ema20,

    ema50,

    macd,

    support: levels.support,

    resistance: levels.resistance,

    target:
      Number(
        (levels.resistance * 1.02).toFixed(2)
      ),

    stopLoss:
      Number(
        (levels.support * 0.98).toFixed(2)
      ),

    risk:
      score >= 80
        ? "Low"
        : score >= 50
        ? "Medium"
        : "High",

    reasons,
  };
}