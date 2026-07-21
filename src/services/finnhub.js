const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

export async function getStockQuote(symbol) {
  const res = await fetch(
    `https://finnhub.io/api/v1/quote?symbol=${symbol.toUpperCase()}&token=${API_KEY}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch stock data");
  }

  const data = await res.json();

  return {
    current: data.c,
    change: data.d,
    percent: data.dp,
    high: data.h,
    low: data.l,
    open: data.o,
    previousClose: data.pc,
  };
}
export async function getCompanyProfile(symbol) {
  const res = await fetch(
    `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${API_KEY}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch company profile");
  }

  return await res.json();
}