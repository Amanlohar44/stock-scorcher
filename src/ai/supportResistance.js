// =======================================
// Support & Resistance
// Stock • Crypto • Forex
// =======================================

export function calculateSupportResistance(prices) {
  if (!prices || prices.length < 20) {
    return null;
  }

  const recentPrices = prices.slice(-20);

  const support = Math.min(...recentPrices);
  const resistance = Math.max(...recentPrices);

  return {
    support: Number(support.toFixed(2)),
    resistance: Number(resistance.toFixed(2)),
  };
}