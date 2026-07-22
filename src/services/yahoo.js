export async function getYahooQuote(symbol) {
  const response = await fetch(
    `http://localhost:5000/api/yahoo?symbol=${symbol}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Yahoo data");
  }

  return await response.json();
}