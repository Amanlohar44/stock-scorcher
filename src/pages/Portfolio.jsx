import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, TrendingUp, TrendingDown, Plus, 
  Download, PieChart, Activity, IndianRupee, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

// ==========================================
// MOCK DATA: PRODUCTION-READY PORTFOLIO
// ==========================================
const INITIAL_HOLDINGS = [
  { id: 1, symbol: 'RELIANCE', name: 'Reliance Industries', avgPrice: 2450.00, currentPrice: 2950.45, qty: 50, sector: 'Energy' },
  { id: 2, symbol: 'TCS', name: 'Tata Consultancy Services', avgPrice: 3200.00, currentPrice: 3920.10, qty: 25, sector: 'IT' },
  { id: 3, symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', avgPrice: 1550.00, currentPrice: 1450.60, qty: 100, sector: 'Finance' },
  { id: 4, symbol: 'INFY', name: 'Infosys Ltd', avgPrice: 1600.00, currentPrice: 1420.30, qty: 40, sector: 'IT' },
  { id: 5, symbol: 'L&T', name: 'Larsen & Toubro', avgPrice: 2800.00, currentPrice: 3450.75, qty: 15, sector: 'Infrastructure' },
];

const SECTOR_COLORS = {
  'Energy': 'bg-red-500',
  'IT': 'bg-blue-500',
  'Finance': 'bg-emerald-500',
  'Infrastructure': 'bg-purple-500',
  'Other': 'bg-zinc-500'
};

export default function Portfolio() {
  const [holdings, setHoldings] = useState(INITIAL_HOLDINGS);
  const [showAddModal, setShowAddModal] = useState(false);

  // ==========================================
  // PORTFOLIO CALCULATIONS
  // ==========================================
  const portfolioStats = useMemo(() => {
    let totalInvested = 0;
    let currentValue = 0;
    let dayChangeAmount = 0; // Simulated day change (normally fetched from live market data)
    
    const sectorAllocation = {};

    holdings.forEach(stock => {
      const invested = stock.avgPrice * stock.qty;
      const current = stock.currentPrice * stock.qty;
      
      totalInvested += invested;
      currentValue += current;
      
      // Simulating a random daily change between -2% and +2% for UI demonstration
      const simulatedDailyReturn = current * (Math.random() * 0.04 - 0.02);
      dayChangeAmount += simulatedDailyReturn;

      // Sector calculation
      if (sectorAllocation[stock.sector]) {
        sectorAllocation[stock.sector] += current;
      } else {
        sectorAllocation[stock.sector] = current;
      }
    });

    const totalPnL = currentValue - totalInvested;
    const totalPnLPercentage = (totalPnL / totalInvested) * 100;
    const dayChangePercentage = (dayChangeAmount / currentValue) * 100;

    // Convert sector allocation to percentages
    const sectors = Object.keys(sectorAllocation).map(sector => ({
      name: sector,
      value: sectorAllocation[sector],
      percentage: ((sectorAllocation[sector] / currentValue) * 100).toFixed(1),
      color: SECTOR_COLORS[sector] || SECTOR_COLORS['Other']
    })).sort((a, b) => b.value - a.value);

    return { totalInvested, currentValue, totalPnL, totalPnLPercentage, dayChangeAmount, dayChangePercentage, sectors };
  }, [holdings]);

  // ==========================================
  // EXPORT REPORT LOGIC
  // ==========================================
  const exportPortfolio = () => {
    const headers = ['Symbol', 'Company', 'Quantity', 'Avg Price', 'Current Price', 'Invested', 'Current Value', 'P&L'];
    const csvData = holdings.map(s => [
      s.symbol, 
      s.name, 
      s.qty, 
      s.avgPrice.toFixed(2), 
      s.currentPrice.toFixed(2), 
      (s.avgPrice * s.qty).toFixed(2), 
      (s.currentPrice * s.qty).toFixed(2),
      ((s.currentPrice - s.avgPrice) * s.qty).toFixed(2)
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...csvData.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `portfolio_report_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-zinc-900 dark:text-zinc-50 pt-8 pb-20 px-4 sm:px-6 lg:px-8">
      
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Briefcase className="text-red-600" size={32} />
            My Portfolio
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm sm:text-base">
            Track your investments, analyze returns, and manage asset allocation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={exportPortfolio}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-red-600 dark:hover:border-red-600 transition-colors font-medium text-sm shadow-sm"
          >
            <Download size={16} className="text-red-600" />
            Report
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium text-sm shadow-lg shadow-red-600/20"
          >
            <Plus size={16} />
            Add Trade
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* TOP KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
            <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Current Value</p>
            <h3 className="text-2xl font-bold flex items-center">
              <IndianRupee size={22} className="mr-1" />
              {portfolioStats.currentValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </h3>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
            <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Total Invested</p>
            <h3 className="text-2xl font-bold flex items-center">
              <IndianRupee size={22} className="mr-1" />
              {portfolioStats.totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </h3>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-current to-transparent opacity-5 pointer-events-none" style={{ color: portfolioStats.totalPnL >= 0 ? '#22c55e' : '#ef4444' }}></div>
            <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Overall P&L</p>
            <div className="flex items-end gap-2">
              <h3 className={`text-2xl font-bold flex items-center ${portfolioStats.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {portfolioStats.totalPnL >= 0 ? '+' : ''}{portfolioStats.totalPnL.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </h3>
              <span className={`text-sm font-bold pb-1 flex items-center ${portfolioStats.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ({portfolioStats.totalPnLPercentage > 0 ? '+' : ''}{portfolioStats.totalPnLPercentage.toFixed(2)}%)
                {portfolioStats.totalPnL >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              </span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
            <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Today's P&L</p>
            <div className="flex items-end gap-2">
              <h3 className={`text-2xl font-bold flex items-center ${portfolioStats.dayChangeAmount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {portfolioStats.dayChangeAmount >= 0 ? '+' : ''}{portfolioStats.dayChangeAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </h3>
              <span className={`text-sm font-bold pb-1 flex items-center ${portfolioStats.dayChangeAmount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ({portfolioStats.dayChangePercentage > 0 ? '+' : ''}{portfolioStats.dayChangePercentage.toFixed(2)}%)
              </span>
            </div>
          </motion.div>
        </div>

        {/* MIDDLE SECTION: SECTOR ALLOCATION & AI INSIGHTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Sector Allocation Bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-2 bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
              <PieChart className="text-red-600" size={20} />
              Sector Allocation
            </h3>
            
            {/* Visual Bar */}
            <div className="w-full h-4 rounded-full flex overflow-hidden mb-6">
              {portfolioStats.sectors.map((sector, idx) => (
                <div 
                  key={idx} 
                  style={{ width: `${sector.percentage}%` }} 
                  className={`${sector.color} h-full transition-all duration-1000 ease-out`}
                  title={`${sector.name}: ${sector.percentage}%`}
                ></div>
              ))}
            </div>

            {/* Legends */}
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {portfolioStats.sectors.map((sector, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${sector.color}`}></div>
                  <span className="text-sm font-medium">{sector.name}</span>
                  <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400">{sector.percentage}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Insights (Simulated) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-bl-full -z-10 group-hover:bg-red-600/10 transition-colors"></div>
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Activity className="text-red-600" size={20} />
              AI Portfolio Score
            </h3>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-5xl font-black text-zinc-900 dark:text-white">82</span>
              <span className="text-lg font-bold text-zinc-500 mb-1">/100</span>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">●</span>
                <span className="text-zinc-600 dark:text-zinc-300">Excellent large-cap diversification.</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-yellow-500 mt-0.5">●</span>
                <span className="text-zinc-600 dark:text-zinc-300">Over-allocated in IT sector (32%). Consider hedging.</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-red-500 mt-0.5">●</span>
                <span className="text-zinc-600 dark:text-zinc-300">HDFCBANK is dragging overall momentum.</span>
              </li>
            </ul>
          </motion.div>

        </div>

        {/* BOTTOM SECTION: HOLDINGS TABLE */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="font-bold text-lg">Your Holdings</h2>
          </div>
          
          <div className="overflow-x-auto w-full custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800">
                  <th className="py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider">Asset</th>
                  <th className="py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Qty</th>
                  <th className="py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Avg Price</th>
                  <th className="py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">LTP</th>
                  <th className="py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Invested</th>
                  <th className="py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Current Value</th>
                  <th className="py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Overall P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                <AnimatePresence>
                  {holdings.map((stock) => {
                    const invested = stock.avgPrice * stock.qty;
                    const current = stock.currentPrice * stock.qty;
                    const pnlAmount = current - invested;
                    const pnlPercentage = (pnlAmount / invested) * 100;
                    const isProfit = pnlAmount >= 0;

                    return (
                      <motion.tr 
                        key={stock.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
                      >
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-sm group-hover:text-red-600 transition-colors">{stock.symbol}</span>
                            <span className="text-xs text-zinc-500 truncate max-w-[150px]">{stock.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right font-medium text-sm">{stock.qty}</td>
                        <td className="py-4 px-6 text-right text-sm">₹{stock.avgPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="py-4 px-6 text-right text-sm font-medium">₹{stock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="py-4 px-6 text-right text-sm text-zinc-500">₹{invested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                        <td className="py-4 px-6 text-right text-sm font-bold">₹{current.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex flex-col items-end">
                            <span className={`text-sm font-bold flex items-center gap-1 ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
                              {isProfit ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                              {isProfit ? '+' : ''}₹{Math.abs(pnlAmount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                            </span>
                            <span className={`text-xs font-bold ${isProfit ? 'text-green-500/80' : 'text-red-500/80'}`}>
                              {isProfit ? '+' : ''}{pnlPercentage.toFixed(2)}%
                            </span>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* ADD TRADE MODAL (SIMULATED UI) */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-xl font-bold mb-4">Add Manual Trade</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Stock Symbol</label>
                  <input type="text" placeholder="e.g. TATAMOTORS" className="w-full bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Quantity</label>
                    <input type="number" placeholder="0" className="w-full bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Buy Price</label>
                    <input type="number" placeholder="₹0.00" className="w-full bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600" />
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-xl font-medium transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700">Cancel</button>
                  <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-medium transition-colors hover:bg-red-700 shadow-lg shadow-red-600/20">Save Trade</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}