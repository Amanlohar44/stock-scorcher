export default function marketDetector(symbol = "") {
  const s = symbol.toUpperCase().trim();

  // Crypto
  if (
    s.endsWith("USDT") ||
    s.endsWith("BTC") ||
    s.endsWith("ETH")
  ) {
    return "crypto";
  }

  // Forex
  const forexPairs = [
    "USDINR",
    "EURUSD",
    "GBPUSD",
    "USDJPY",
    "AUDUSD",
    "USDCAD",
    "EURINR",
  ];

  if (forexPairs.includes(s)) {
    return "forex";
  }

  // Indices
  const indices = [
    "NIFTY",
    "BANKNIFTY",
    "FINNIFTY",
    "SENSEX",
    "NASDAQ",
    "SPX",
    "DJI",
  ];

  if (indices.includes(s)) {
    return "index";
  }

  // Indian Stocks
  const indianStocks = [
    "RELIANCE",
    "TCS",
    "INFY",
    "SBIN",
    "ITC",
    "HDFCBANK",
    "ICICIBANK",
    "LT",
    "AXISBANK",
    "KOTAKBANK",
  ];

  if (indianStocks.includes(s)) {
    return "indian-stock";
  }

  // Default
  return "us-stock";
}