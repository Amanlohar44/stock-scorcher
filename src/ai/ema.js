// =======================================
// EMA (Exponential Moving Average)
// Stock • Crypto • Forex
// =======================================

export function calculateEMA(prices, period = 20) {
  if (!prices || prices.length < period) {
    return null;
  }

  // Initial SMA
  const sma =
    prices
      .slice(0, period)
      .reduce((sum, price) => sum + price, 0) / period;

  const multiplier = 2 / (period + 1);

  let ema = sma;

  for (let i = period; i < prices.length; i++) {
    ema =
      (prices[i] - ema) * multiplier + ema;
  }

  return Number(ema.toFixed(2));
}