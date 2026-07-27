export async function getYahooQuote(symbol) {
  if (!symbol || typeof symbol !== "string") {
    throw new Error("Invalid symbol provided for Yahoo quote");
  }

  const cleanSymbol = symbol.trim().toUpperCase();

  // Fallback to localhost for development, can be configured via environment variables in production
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const response = await fetch(
    `${API_BASE_URL}/api/yahoo?symbol=${encodeURIComponent(cleanSymbol)}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Yahoo market data");
  }

  return await response.json();
}