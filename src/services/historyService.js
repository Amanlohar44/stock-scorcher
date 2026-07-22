import marketDetector from "../utils/marketDetector";

export async function getHistoricalPrices(symbol) {
  const market = marketDetector(symbol);

  const response = await fetch(
    `http://localhost:5000/api/history?symbol=${symbol}&market=${market}`
  );

  if (!response.ok) {
    throw new Error("History API Error");
  }

  return await response.json();
}