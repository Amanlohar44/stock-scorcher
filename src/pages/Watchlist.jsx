import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, Plus, Bell, BellRing, Trash2, TrendingUp, TrendingDown, 
  Search, Settings, ChevronRight, AlertCircle, X, Check
} from 'lucide-react';

// ==========================================
// MOCK DATA: WATCHLISTS & STOCKS
// ==========================================
const INITIAL_WATCHLISTS = [
  {
    id: 1,
    name: 'Core Portfolio',
    stocks: [
      { id: 101, symbol: 'RELIANCE', name: 'Reliance Industries', price: 2950.45, change: 1.2, volume: '5.4M', alertActive: true },
      { id: 102, symbol: 'TCS', name: 'Tata Consultancy Services', price: 3920.10, change: -0.5, volume: '2.1M', alertActive: false },
      { id: 103, symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', price: 1450.60, change: 2.1, volume: '18.5M', alertActive: false },
    ]
  },
  {
    id: 2,
    name: 'Breakout Scans',
    stocks: [
      { id: 201, symbol: 'ZOMATO', name: 'Zomato Ltd', price: 185.20, change: 4.5, volume: '45.2M', alertActive: true },
      { id: 202, symbol: 'IREDA', name: 'Indian Renewable Energy', price: 162.40, change: 5.0, volume: '88.1M', alertActive: true },
    ]
  },
  {
    id: 3,
    name: 'AI Top Picks',
    stocks: [
      { id: 301, symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', price: 1020.15, change: 1.8, volume: '12.4M', alertActive: false },
      { id: 302, symbol: 'HAL', name: 'Hindustan Aeronautics', price: 3450.80, change: -1.2, volume: '3.2M', alertActive: false },
      { id: 303, symbol: 'JIOFIN', name: 'Jio Financial Services', price: 375.90, change: 0.8, volume: '15.6M', alertActive: false },
    ]
  }
];

export default function Watchlist() {
  const [watchlists, setWatchlists] = useState(INITIAL_WATCHLISTS);
  const [activeTab, setActiveTab] = useState(INITIAL_WATCHLISTS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Alert Modal State
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [alertConfig, setAlertConfig] = useState({ type: 'price_above', value: '' });

  // Notifications State (Simulated)
  const [toastMessage, setToastMessage] = useState('');

  const activeWatchlist = watchlists.find(w => w.id === activeTab);
  
  const filteredStocks = activeWatchlist?.stocks.filter(stock => 
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleRemoveStock = (watchlistId, stockId) => {
    setWatchlists(watchlists.map(w => {
      if (w.id === watchlistId) {
        return { ...w, stocks: w.stocks.filter(s => s.id !== stockId) };
      }
      return w;
    }));
  };

  const openAlertModal = (stock) => {
    setSelectedStock(stock);
    setAlertConfig({ type: 'price_above', value: stock.price });
    setAlertModalOpen(true);
  };

  const saveAlert = () => {
    // Update local state to show active bell
    setWatchlists(watchlists.map(w => {
      if (w.id === activeTab) {
        return {
          ...w,
          stocks: w.stocks.map(s => s.id === selectedStock.id ? { ...s, alertActive: true } : s)
        };
      }
      return w;
    }));
    
    setAlertModalOpen(false);
    showToast(`Alert set for ${selectedStock.symbol} at ₹${alertConfig.value}`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-zinc-900 dark:text-zinc-50 pt-8 pb-20 px-4 sm:px-6 lg:px-8 relative">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Eye className="text-red-600" size={32} />
            My Watchlists
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm sm:text-base">
            Track live prices and set custom AI alerts for breakouts and volume spikes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-red-600 transition-colors font-medium text-sm shadow-sm">
            <Settings size={16} className="text-zinc-500" />
            Manage Lists
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium text-sm shadow-lg shadow-red-600/20">
            <Plus size={16} />
            New List
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        
        {/* TABS & SEARCH BAR */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex overflow-x-auto custom-scrollbar pb-2 lg:pb-0 gap-2">
            {watchlists.map(list => (
              <button
                key={list.id}
                onClick={() => setActiveTab(list.id)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-2 ${
                  activeTab === list.id 
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-black shadow-md' 
                    : 'bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {list.name}
                <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === list.id ? 'bg-zinc-800 dark:bg-zinc-200 text-white dark:text-black' : 'bg-zinc-100 dark:bg-zinc-800'}`}>
                  {list.stocks.length}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input 
              type="text" 
              placeholder="Search in watchlist..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* WATCHLIST TABLE */}
        <div className="bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto w-full custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800">
                  <th className="py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider">Symbol</th>
                  <th className="py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">LTP (₹)</th>
                  <th className="py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Change</th>
                  <th className="py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Volume</th>
                  <th className="py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider text-center">Alerts</th>
                  <th className="py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                <AnimatePresence mode="popLayout">
                  {filteredStocks.map((stock) => (
                    <motion.tr 
                      key={stock.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm group-hover:text-red-600 transition-colors cursor-pointer">{stock.symbol}</span>
                          <span className="text-xs text-zinc-500">{stock.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right font-medium text-sm">
                        {stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className={`inline-flex items-center gap-1 text-sm font-bold ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {stock.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          {stock.change >= 0 ? '+' : ''}{stock.change}%
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right text-sm text-zinc-600 dark:text-zinc-300 font-medium">
                        {stock.volume}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button 
                          onClick={() => openAlertModal(stock)}
                          className={`p-2 rounded-full transition-colors ${
                            stock.alertActive 
                              ? 'bg-red-100 text-red-600 dark:bg-red-900/30' 
                              : 'bg-zinc-100 text-zinc-400 hover:text-zinc-900 dark:bg-zinc-800 dark:hover:text-white'
                          }`}
                        >
                          {stock.alertActive ? <BellRing size={16} /> : <Bell size={16} />}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="px-3 py-1 bg-zinc-900 dark:bg-white text-white dark:text-black text-xs font-bold rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
                            B / S
                          </button>
                          <button 
                            onClick={() => handleRemoveStock(activeTab, stock.id)}
                            className="p-1.5 text-zinc-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="Remove from watchlist"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                
                {filteredStocks.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-zinc-500">
                      <p className="text-base font-medium text-zinc-900 dark:text-zinc-100">No stocks found</p>
                      <p className="text-sm mt-1">Search or add stocks to this watchlist.</p>
                      <button className="mt-4 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                        Add Stocks
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ALERT CREATION MODAL */}
      <AnimatePresence>
        {alertModalOpen && selectedStock && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-5 border-b border-zinc-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/50">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <BellRing className="text-red-600" size={18} /> 
                  Set Alert: {selectedStock.symbol}
                </h3>
                <button onClick={() => setAlertModalOpen(false)} className="p-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500">
                  <X size={18} />
                </button>
              </div>
              
              <div className="p-5 space-y-5">
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-3 flex items-center gap-3">
                  <AlertCircle className="text-red-600 shrink-0" size={18} />
                  <div>
                    <p className="text-xs text-red-600 dark:text-red-400 font-bold uppercase tracking-wider">Current Price</p>
                    <p className="text-lg font-black text-red-700 dark:text-red-300">₹{selectedStock.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Alert Condition</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setAlertConfig({...alertConfig, type: 'price_above'})}
                      className={`px-3 py-2 text-sm font-medium rounded-xl border transition-colors ${alertConfig.type === 'price_above' ? 'border-red-600 bg-red-600/10 text-red-600' : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                    >
                      Price crosses Above
                    </button>
                    <button 
                      onClick={() => setAlertConfig({...alertConfig, type: 'price_below'})}
                      className={`px-3 py-2 text-sm font-medium rounded-xl border transition-colors ${alertConfig.type === 'price_below' ? 'border-red-600 bg-red-600/10 text-red-600' : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                    >
                      Price crosses Below
                    </button>
                    <button 
                      onClick={() => setAlertConfig({...alertConfig, type: 'volume'})}
                      className={`px-3 py-2 text-sm font-medium rounded-xl border transition-colors ${alertConfig.type === 'volume' ? 'border-red-600 bg-red-600/10 text-red-600' : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                    >
                      Volume Breakout
                    </button>
                    <button 
                      onClick={() => setAlertConfig({...alertConfig, type: 'ai_signal'})}
                      className={`px-3 py-2 text-sm font-medium rounded-xl border flex items-center justify-center gap-1 transition-colors ${alertConfig.type === 'ai_signal' ? 'border-red-600 bg-red-600/10 text-red-600' : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                    >
                      AI Alert <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-600 text-white font-bold ml-1">PRO</span>
                    </button>
                  </div>
                </div>

                {alertConfig.type !== 'ai_signal' && (
                  <div>
                    <label className="block text-sm font-semibold mb-2">Target Value</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">₹</span>
                      <input 
                        type="number" 
                        value={alertConfig.value}
                        onChange={(e) => setAlertConfig({...alertConfig, value: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-8 pr-4 py-2.5 font-medium focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button 
                    onClick={saveAlert}
                    className="w-full py-3 bg-red-600 text-white rounded-xl font-bold transition-colors hover:bg-red-700 shadow-lg shadow-red-600/20"
                  >
                    Create Alert
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-zinc-900 dark:bg-white text-white dark:text-black px-4 py-3 rounded-xl shadow-2xl"
          >
            <div className="bg-green-500/20 text-green-500 p-1 rounded-full">
              <Check size={16} strokeWidth={3} />
            </div>
            <p className="text-sm font-bold">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}