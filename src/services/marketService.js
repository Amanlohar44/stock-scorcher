import {
  getStockQuote,
  getCompanyProfile,
} from "./finnhub";

import marketDetector from "../utils/marketDetector";

// =====================================================
// GET MARKET QUOTE
// =====================================================

export async function getMarketQuote(symbol) {
  if (!symbol) {
    throw new Error("Symbol is required");
  }

  const s = symbol.toUpperCase().trim();

  if (!s) {
    throw new Error("Invalid symbol");
  }

  const market = marketDetector(s);

  console.log("Searching Market:", {
    symbol: s,
    market,
  });

  // ===================================================
  // INDIAN STOCKS
  // ===================================================

  if (market === "indian-stock") {
    return await getStockQuote(`${s}.NS`);
  }

  // ===================================================
  // US STOCKS
  // ===================================================

  if (market === "us-stock") {
    return await getStockQuote(s);
  }

  // ===================================================
  // INDIAN / GLOBAL INDICES
  // ===================================================

  if (market === "index") {
    throw new Error(
      "Index market data is not connected yet."
    );
  }

  // ===================================================
  // CRYPTO
  // ===================================================

  if (market === "crypto") {
    throw new Error(
      "Crypto market data is not connected yet."
    );
  }

  // ===================================================
  // FOREX
  // ===================================================

  if (market === "forex") {
    throw new Error(
      "Forex market data is not connected yet."
    );
  }

  // ===================================================
  // COMMODITIES
  // ===================================================

  if (market === "commodity") {
    throw new Error(
      "Commodity market data is not connected yet."
    );
  }

  // ===================================================
  // DEFAULT
  // ===================================================

  return await getStockQuote(s);
}


// =====================================================
// GET COMPANY / ASSET INFORMATION
// =====================================================

export async function getMarketCompany(symbol) {
  if (!symbol) {
    throw new Error("Symbol is required");
  }

  const s = symbol.toUpperCase().trim();

  if (!s) {
    throw new Error("Invalid symbol");
  }

  const market = marketDetector(s);

  // ===================================================
  // INDIAN STOCKS
  // ===================================================

  if (market === "indian-stock") {
    return await getCompanyProfile(`${s}.NS`);
  }

  // ===================================================
  // US STOCKS
  // ===================================================

  if (market === "us-stock") {
    return await getCompanyProfile(s);
  }

  // ===================================================
  // OTHER MARKETS
  // ===================================================

  if (market === "crypto") {
    return {
      name: s,
      ticker: s,
      exchange: "CRYPTO",
      country: "Global",
      currency: "USDT",
      ipo: "N/A",
    };
  }

  if (market === "forex") {
    return {
      name: s,
      ticker: s,
      exchange: "FOREX",
      country: "Global",
      currency: "N/A",
      ipo: "N/A",
    };
  }

  if (market === "index") {
    return {
      name: s,
      ticker: s,
      exchange: "INDEX",
      country: "India",
      currency: "INR",
      ipo: "N/A",
    };
  }

  if (market === "commodity") {
    return {
      name: s,
      ticker: s,
      exchange: "COMMODITY",
      country: "Global",
      currency: "USD",
      ipo: "N/A",
    };
  }

  // ===================================================
  // FALLBACK
  // ===================================================

  return {
    name: s,
    ticker: s,
    exchange: market.toUpperCase(),
    country: "Global",
    currency: "N/A",
    ipo: "N/A",
  };
}