// =======================================
// AI Analysis Engine
// Stock • Crypto • Forex
// =======================================

import { calculateRSI } from "./rsi";
import { calculateEMA } from "./ema";
import { calculateMACD } from "./macd";
import { calculateSupportResistance } from "./supportResistance";

export function generateAIAnalysis(prices) {
  if (!prices || !Array.isArray(prices) || prices.length < 35) {
    return null;
  }

  const currentPrice = prices[prices.length - 1];

  const rsi = calculateRSI(prices) ?? 50;
  const ema20 = calculateEMA(prices, 20) ?? currentPrice;
  const ema50 = calculateEMA(prices, 50) ?? currentPrice;
  const macd = calculateMACD(prices) || { signal: "Neutral" };
  const levels = calculateSupportResistance(prices) || {
    support: currentPrice * 0.98,
    resistance: currentPrice * 1.02,
  };

  let score = 0;
  const reasons = [];

  // RSI Analysis
  if (rsi > 30 && rsi < 70) {
    score += 25;
    reasons.push("Healthy RSI Range");
  } else if (rsi <= 30) {
    score += 15;
    reasons.push("Oversold Zone (Potential Reversal)");
  } else {
    reasons.push("Overbought Zone");
  }

  // EMA Trend Analysis
  if (currentPrice > ema20) {
    score += 25;
    reasons.push("Price Above Short-term EMA20");
  }

  if (currentPrice > ema50) {
    score += 20;
    reasons.push("Price Above Long-term EMA50");
  }

  // MACD Momentum
  if (macd.signal === "Bullish") {
    score += 30;
    reasons.push("Bullish MACD Crossover");
  } else if (macd.signal === "Bearish") {
    reasons.push("Bearish MACD Momentum");
  }

  // Clamp score between 0 and 100
  const confidenceScore = Math.min(Math.max(score, 0), 100);

  let signal = "HOLD";
  if (confidenceScore >= 75) {
    signal = "BUY";
  } else if (confidenceScore <= 35) {
    signal = "SELL";
  }

  const support = levels.support ?? currentPrice * 0.98;
  const resistance = levels.resistance ?? currentPrice * 1.02;

  return {
    signal,
    confidence: confidenceScore,
    rsi: Number(rsi.toFixed(2)),
    ema20: Number(ema20.toFixed(2)),
    ema50: Number(ema50.toFixed(2)),
    macd,
    support: Number(support.toFixed(2)),
    resistance: Number(resistance.toFixed(2)),
    target: Number((resistance * 1.02).toFixed(2)),
    stopLoss: Number((support * 0.98).toFixed(2)),
    risk:
      confidenceScore >= 75
        ? "Low"
        : confidenceScore >= 50
        ? "Medium"
        : "High",
    reasons,
  };
}