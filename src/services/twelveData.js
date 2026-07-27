const API_KEY = import.meta.env.VITE_TWELVEDATA_API_KEY;

const BASE_URL = "https://api.twelvedata.com";

// =========================
// UNIVERSAL PRICE API
// =========================

export async function getTwelveDataQuote(symbol) {
  if (!symbol || typeof symbol !== "string") {
    console.error("Invalid symbol provided for Twelve Data quote");
    return null;
  }

  const cleanSymbol = symbol.trim().toUpperCase();

  try {
    const res = await fetch(
      `${BASE_URL}/price?symbol=${encodeURIComponent(cleanSymbol)}&apikey=${API_KEY}`
    );

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await res.json();

    if (data.status === "error") {
      throw new Error(data.message || "Twelve Data API error");
    }

    return {
      current: Number(data.price),
    };
  } catch (err) {
    console.error("Twelve Data Quote Error:", err);
    return null;
  }
}

// =========================
// UNIVERSAL TIME SERIES (CHART)
// =========================

export async function getTimeSeries(symbol) {
  if (!symbol || typeof symbol !== "string") {
    console.error("Invalid symbol provided for Twelve Data time series");
    return null;
  }

  const cleanSymbol = symbol.trim().toUpperCase();

  try {
    const res = await fetch(
      `${BASE_URL}/time_series?symbol=${encodeURIComponent(cleanSymbol)}&interval=1day&outputsize=30&apikey=${API_KEY}`
    );

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await res.json();

    if (data.status === "error") {
      throw new Error(data.message || "Twelve Data API error");
    }

    return data;
  } catch (err) {
    console.error("Twelve Data Time Series Error:", err);
    return null;
  }
}