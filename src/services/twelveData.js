const API_KEY = import.meta.env.VITE_TWELVEDATA_API_KEY;

const BASE_URL = "https://api.twelvedata.com";

// Universal Price API
export async function getTwelveDataQuote(symbol) {
  try {
    const res = await fetch(
      `${BASE_URL}/price?symbol=${symbol}&apikey=${API_KEY}`
    );

    const data = await res.json();

    if (data.status === "error") {
      throw new Error(data.message);
    }

    return {
      current: Number(data.price),
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Universal Time Series (Chart)
export async function getTimeSeries(symbol) {
  try {
    const res = await fetch(
      `${BASE_URL}/time_series?symbol=${symbol}&interval=1day&outputsize=30&apikey=${API_KEY}`
    );

    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}