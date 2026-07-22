// Indian Stocks
const indianStocks = [
  "RELIANCE",
  "TCS",
  "INFY",
  "HDFCBANK",
  "ICICIBANK",
  "SBIN",
  "LT",
  "ITC",
  "AXISBANK",
  "KOTAKBANK",
  "BHARTIARTL",
  "ASIANPAINT",
  "MARUTI",
  "TITAN",
  "WIPRO",
  "BAJFINANCE",
  "ULTRACEMCO",
  "HCLTECH",
  "SUNPHARMA",
];

// Indian Indices
const indianIndices = {
  NIFTY: "NSE:NIFTY",
  BANKNIFTY: "NSE:BANKNIFTY",
  FINNIFTY: "NSE:FINNIFTY",
  SENSEX: "BSE:SENSEX",
};

// Crypto
const cryptoPairs = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "SOLUSDT",
  "XRPUSDT",
  "DOGEUSDT",
  "ADAUSDT",
  "LINKUSDT",
  "AVAXUSDT",
];

// Forex
const forexPairs = {
  USDINR: "FX_IDC:USDINR",
  EURUSD: "FX:EURUSD",
  GBPUSD: "FX:GBPUSD",
  USDJPY: "FX:USDJPY",
  AUDUSD: "FX:AUDUSD",
  USDCAD: "FX:USDCAD",
};

// Commodities
const commodities = {
  GOLD: "TVC:GOLD",
  SILVER: "TVC:SILVER",
  XAUUSD: "OANDA:XAUUSD",
  XAGUSD: "OANDA:XAGUSD",
};

export default function getTradingViewSymbol(symbol) {
  if (!symbol) return "NASDAQ:AAPL";

  const s = symbol.toUpperCase().trim();

  // Indian Stocks
  if (indianStocks.includes(s)) {
    return `NSE:${s}`;
  }

  // Indian Indices
  if (indianIndices[s]) {
    return indianIndices[s];
  }

  // Crypto
  if (cryptoPairs.includes(s)) {
    return `BINANCE:${s}`;
  }

  // Forex
  if (forexPairs[s]) {
    return forexPairs[s];
  }

  // Commodities
  if (commodities[s]) {
    return commodities[s];
  }

  // Default US Stocks
  return `NASDAQ:${s}`;
}