import marketDetector from "../utils/marketDetector";

export async function getHistoricalPrices(symbol) {
  if (!symbol || typeof symbol !== "string") {
    throw new Error("Invalid symbol provided for historical data");
  }

  const cleanSymbol = symbol.trim().toUpperCase();
  const market = marketDetector(cleanSymbol);

  // Fallback to localhost for development, can be configured via environment variables in production
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const response = await fetch(
    `${API_BASE_URL}/api/history?symbol=${encodeURIComponent(cleanSymbol)}&market=${encodeURIComponent(market)}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch historical market data");
  }

  return await response.json();
}