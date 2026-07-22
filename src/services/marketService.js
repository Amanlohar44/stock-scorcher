import marketDetector from "../utils/marketDetector";

import {
  getStockQuote,
  getCompanyProfile,
} from "./finnhub";

import { getYahooQuote } from "./yahoo";

// Future APIs
// import { getCryptoQuote } from "./binance";
// import { getForexQuote } from "./twelveData";

export async function getMarketQuote(symbol) {
  const market = marketDetector(symbol);

  switch (market) {
    // ==========================
    // Crypto
    // ==========================
    case "crypto":
      // return await getCryptoQuote(symbol);
      return await getStockQuote(symbol);

    // ==========================
    // Forex
    // ==========================
    case "forex":
      // return await getForexQuote(symbol);
      return await getStockQuote(symbol);

    // ==========================
    // Indian Stocks
    // ==========================
    case "indian-stock":
      return await getYahooQuote(symbol);

    // ==========================
    // Indices
    // ==========================
    case "index":
      return await getYahooQuote(symbol);

    // ==========================
    // US Stocks
    // ==========================
    case "us-stock":
    default:
      return await getStockQuote(symbol);
  }
}

export async function getMarketCompany(symbol) {
  const market = marketDetector(symbol);

  switch (market) {
    // ==========================
    // Crypto
    // ==========================
    case "crypto":
      return {
        name: symbol,
        ticker: symbol,
        exchange: "BINANCE",
        country: "Global",
        currency: "USDT",
      };

    // ==========================
    // Forex
    // ==========================
    case "forex":
      return {
        name: symbol,
        ticker: symbol,
        exchange: "FOREX",
        country: "Global",
        currency: "Various",
      };

    // ==========================
    // Indian Stocks
    // ==========================
    case "indian-stock":
      return {
        name: symbol,
        ticker: symbol,
        exchange: "NSE",
        country: "India",
        currency: "INR",
      };

    // ==========================
    // Indices
    // ==========================
    case "index":
      return {
        name: symbol,
        ticker: symbol,
        exchange: "INDEX",
        country: "India",
      };

    // ==========================
    // US Stocks
    // ==========================
    case "us-stock":
    default:
      return await getCompanyProfile(symbol);
  }
}