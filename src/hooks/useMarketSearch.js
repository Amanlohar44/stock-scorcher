import { useState } from "react";
import {
  getMarketQuote,
  getMarketCompany,
} from "../services/marketService";

export default function useMarketSearch() {
  const [loading, setLoading] = useState(false);
  const [stock, setStock] = useState(null);
  const [company, setCompany] = useState(null);

  async function searchMarket(symbol) {
    if (!symbol || typeof symbol !== "string") return;

    const cleanSymbol = symbol.toUpperCase().trim();
    if (!cleanSymbol) return;

    setLoading(true);

    try {
      // Fetch both quote and company info in parallel for maximum performance
      const [stockData, companyData] = await Promise.all([
        getMarketQuote(cleanSymbol),
        getMarketCompany(cleanSymbol),
      ]);

      setStock(stockData || null);
      setCompany(companyData || null);
    } catch (err) {
      console.error("Market search error:", err);
      alert("Market data not found for symbol: " + cleanSymbol);
      setStock(null);
      setCompany(null);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    stock,
    company,
    searchMarket,
  };
}