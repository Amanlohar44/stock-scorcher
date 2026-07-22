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
    if (!symbol) return;

    setLoading(true);

    try {
      const stockData = await getMarketQuote(
        symbol.toUpperCase().trim()
      );

      const companyData = await getMarketCompany(
        symbol.toUpperCase().trim()
      );

      setStock(stockData);
      setCompany(companyData);

    } catch (err) {
      console.log(err);
      alert("Market data not found.");
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