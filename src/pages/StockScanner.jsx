import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, Download, Star, Search, ChevronDown, 
  TrendingUp, Activity, BarChart2, Save, X, Settings2
} from 'lucide-react';

// ==========================================
// MOCK DATA: PRODUCTION-READY DATASET
// ==========================================
const STOCK_DATA = [
  { id: 1, symbol: 'RELIANCE', name: 'Reliance Industries', price: 2950.45, change: 1.2, pe: 28.5, pb: 2.1, roe: 9.5, roce: 10.2, debt: 0.4, eps: 103.5, mcap: 1985000, volume: 5400000, rsi: 58, macd: 'Bullish', sector: 'Energy' },
  { id: 2, symbol: 'TCS', name: 'Tata Consultancy Services', price: 3920.10, change: -0.5, pe: 31.2, pb: 14.5, roe: 46.8, roce: 58.2, debt: 0.0, eps: 125.4, mcap: 1450000, volume: 2100000, rsi: 45, macd: 'Bearish', sector: 'IT' },
  { id: 3, symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', price: 1450.60, change: 2.1, pe: 16.4, pb: 2.8, roe: 17.1, roce: 16.5, debt: 8.5, eps: 88.2, mcap: 1120000, volume: 18500000, rsi: 62, macd: 'Bullish', sector: 'Finance' },
  { id: 4, symbol: 'INFY', name: 'Infosys Ltd', price: 1420.30, change: -1.2, pe: 24.1, pb: 6.8, roe: 31.8, roce: 40.5, debt: 0.1, eps: 58.9, mcap: 590000, volume: 6200000, rsi: 38, macd: 'Bearish', sector: 'IT' },
  { id: 5, symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1080.90, change: 0.8, pe: 18.2, pb: 3.1, roe: 18.9, roce: 15.2, debt: 6.2, eps: 59.4, mcap: 760000, volume: 12000000, rsi: 55, macd: 'Bullish', sector: 'Finance' },
  { id: 6, symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1150.20, change: 3.4, pe: 45.6, pb: 4.5, roe: 12.4, roce: 14.8, debt: 1.2, eps: 25.2, mcap: 650000, volume: 8900000, rsi: 72, macd: 'Bullish', sector: 'Telecom' },
  { id: 7, symbol: 'ITC', name: 'ITC Ltd', price: 410.80, change: 0.2, pe: 26.5, pb: 7.2, roe: 29.5, roce: 38.2, debt: 0.0, eps: 15.5, mcap: 510000, volume: 14500000, rsi: 48, macd: 'Neutral', sector: 'FMCG' },
  { id: 8, symbol: 'L&T', name: 'Larsen & Toubro', price: 3450.75, change: 1.8, pe: 35.2, pb: 4.8, roe: 14.5, roce: 15.6, debt: 1.1, eps: 98.1, mcap: 480000, volume: 3200000, rsi: 65, macd: 'Bullish', sector: 'Infrastructure' },
];

const QUICK_FILTERS = [
  { name: 'Undervalued Gems', filters: { peMax: 20, pbMax: 2, roeMin: 15 } },
  { name: 'High Growth IT', filters: { sector: 'IT', roeMin: 25, epsMin: 50 } },
  { name: 'Debt Free Leaders', filters: { debtMax: 0.1, mcapMin: 100000 } },
  { name: 'Bullish Momentum', filters: { rsiMin: 60, macd: 'Bullish' } }
];

export default function StockScanner() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    peMax: 100, pbMax: 20, roeMin: 0, debtMax: 10, epsMin: 0, mcapMin: 0, rsiMin: 0, macd: 'All', sector: 'All'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [savedScans, setSavedScans] = useState([]);

  // ==========================================
  // FILTERING LOGIC
  // ==========================================
  const filteredStocks = useMemo(() => {
    return STOCK_DATA.filter(stock => {
      const matchesSearch = stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            stock.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPE = stock.pe <= activeFilters.peMax;
      const matchesPB = stock.pb <= activeFilters.pbMax;
      const matchesROE = stock.roe >= activeFilters.roeMin;
      const matchesDebt = stock.debt <= activeFilters.debtMax;
      const matchesEPS = stock.eps >= activeFilters.epsMin;
      const matchesMcap = stock.mcap >= activeFilters.mcapMin;
      const matchesRSI = stock.rsi >= activeFilters.rsiMin;
      const matchesMACD = activeFilters.macd === 'All' || stock.macd === activeFilters.macd;
      const matchesSector = activeFilters.sector === 'All' || stock.sector === activeFilters.sector;

      return matchesSearch && matchesPE && matchesPB && matchesROE && matchesDebt && 
             matchesEPS && matchesMcap && matchesRSI && matchesMACD && matchesSector;
    });
  }, [searchQuery, activeFilters]);

  // ==========================================
  // EXPORT CSV LOGIC
  // ==========================================
  const exportToCSV = () => {
    const headers = ['Symbol', 'Name', 'Price', 'Change %', 'P/E', 'P/B', 'ROE %', 'Debt/Eq', 'RSI'];
    const csvData = filteredStocks.map(s => [
      s.symbol, s.name, s.price, s.change, s.pe, s.pb, s.roe, s.debt, s.rsi
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...csvData.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `stock_scorcher_scan_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const applyQuickFilter = (preset) => {
    setActiveFilters(prev => ({ ...prev, ...preset.filters }));
  };

  const handleFilterChange = (key, value) => {
    setActiveFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-zinc-900 dark:text-zinc-50 pt-8 pb-20 px-4 sm:px-6 lg:px-8">
      
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
              <Activity className="text-red-600" size={32} />
              Advanced Stock Screener
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm sm:text-base">
              Filter Indian markets using AI-powered technical and fundamental parameters.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-red-600 dark:hover:border-red-600 transition-colors font-medium text-sm shadow-sm"
            >
              <Download size={16} className="text-red-600" />
              Export CSV
            </button>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium text-sm shadow-lg shadow-red-600/20"
            >
              <Settings2 size={16} />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        </div>

        {/* QUICK FILTERS */}
        <div className="flex flex-wrap items-center gap-2 mt-6">
          <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mr-2 flex items-center gap-1">
            <Star size={14} className="text-yellow-500" /> Quick Scans:
          </span>
          {QUICK_FILTERS.map((qf, idx) => (
            <button
              key={idx}
              onClick={() => applyQuickFilter(qf)}
              className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {qf.name}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        
        {/* FILTERS SIDEBAR / DRAWER */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, x: -20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: '100%', maxWidth: '320px' }}
              exit={{ opacity: 0, x: -20, width: 0 }}
              className="flex-shrink-0 w-full lg:w-80 bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden h-fit"
            >
              <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Filter size={18} className="text-red-600" /> Parameters
                </h3>
                <button onClick={() => setShowFilters(false)} className="lg:hidden p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                  <X size={16} />
                </button>
              </div>
              
              <div className="p-5 space-y-6 max-h-[60vh] lg:max-h-[70vh] overflow-y-auto custom-scrollbar">
                
                {/* Fundamental Filters */}
                <div>
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Fundamentals</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <label className="font-medium">Max P/E Ratio</label>
                        <span className="text-red-600 font-bold">{activeFilters.peMax}</span>
                      </div>
                      <input type="range" min="0" max="150" value={activeFilters.peMax} onChange={(e) => handleFilterChange('peMax', Number(e.target.value))} className="w-full accent-red-600" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <label className="font-medium">Min ROE (%)</label>
                        <span className="text-red-600 font-bold">{activeFilters.roeMin}%</span>
                      </div>
                      <input type="range" min="0" max="50" value={activeFilters.roeMin} onChange={(e) => handleFilterChange('roeMin', Number(e.target.value))} className="w-full accent-red-600" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <label className="font-medium">Max Debt to Equity</label>
                        <span className="text-red-600 font-bold">{activeFilters.debtMax}</span>
                      </div>
                      <input type="range" min="0" max="10" step="0.1" value={activeFilters.debtMax} onChange={(e) => handleFilterChange('debtMax', Number(e.target.value))} className="w-full accent-red-600" />
                    </div>
                  </div>
                </div>

                {/* Technical Filters */}
                <div>
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Technicals</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <label className="font-medium">Min RSI (14)</label>
                        <span className="text-red-600 font-bold">{activeFilters.rsiMin}</span>
                      </div>
                      <input type="range" min="0" max="100" value={activeFilters.rsiMin} onChange={(e) => handleFilterChange('rsiMin', Number(e.target.value))} className="w-full accent-red-600" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">MACD Signal</label>
                      <select 
                        value={activeFilters.macd} 
                        onChange={(e) => handleFilterChange('macd', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-600"
                      >
                        <option value="All">All Signals</option>
                        <option value="Bullish">Bullish Crossover</option>
                        <option value="Bearish">Bearish Crossover</option>
                        <option value="Neutral">Neutral</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl font-medium text-sm transition-transform active:scale-95">
                  <Save size={16} /> Save Filter
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN RESULTS TABLE */}
        <motion.div layout className="flex-1 bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              Scan Results <span className="px-2 py-0.5 rounded-full bg-red-600/10 text-red-600 text-xs">{filteredStocks.length} Stocks</span>
            </h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input 
                type="text" 
                placeholder="Search symbol..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto w-full custom-scrollbar flex-1">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800">
                  <th className="py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider">Company</th>
                  <th className="py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider">Price (₹)</th>
                  <th className="py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider">P/E</th>
                  <th className="py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider">ROE %</th>
                  <th className="py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider">Debt/Eq</th>
                  <th className="py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider">RSI</th>
                  <th className="py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider">Signal</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredStocks.map((stock) => (
                    <motion.tr 
                      key={stock.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group cursor-pointer"
                    >
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm group-hover:text-red-600 transition-colors">{stock.symbol}</span>
                          <span className="text-xs text-zinc-500 truncate max-w-[150px]">{stock.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                          <span className={`text-xs font-bold ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {stock.change >= 0 ? '+' : ''}{stock.change}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm font-medium">{stock.pe}</td>
                      <td className="py-4 px-6 text-sm font-medium text-green-500">{stock.roe}%</td>
                      <td className="py-4 px-6 text-sm font-medium">{stock.debt}</td>
                      <td className="py-4 px-6 text-sm">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                          stock.rsi > 70 ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 
                          stock.rsi < 30 ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 
                          'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
                        }`}>
                          {stock.rsi}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          stock.macd === 'Bullish' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' :
                          stock.macd === 'Bearish' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' :
                          'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
                        }`}>
                          {stock.macd === 'Bullish' ? <TrendingUp size={12} /> : <BarChart2 size={12} />}
                          {stock.macd}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredStocks.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-zinc-500">
                      <Search className="mx-auto h-8 w-8 text-zinc-400 mb-3" />
                      <p className="text-base font-medium text-zinc-900 dark:text-zinc-100">No stocks found</p>
                      <p className="text-sm">Try adjusting your filters or search query.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

    </div>
  );
}