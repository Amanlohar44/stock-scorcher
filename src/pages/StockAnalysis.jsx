import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Brain, TrendingUp, TrendingDown, Target, 
  ShieldAlert, Activity, Zap, BarChart2, Crosshair, 
  AlertTriangle, CheckCircle2, ChevronRight
} from 'lucide-react';

// ==========================================
// MOCK DATA: AI ANALYSIS REPORTS
// ==========================================
const MOCK_ANALYSIS_DB = {
  'RELIANCE': {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    price: 2950.45,
    change: 1.2,
    aiScore: 88,
    signal: 'Strong Buy',
    confidence: 92,
    riskLevel: 'Moderate',
    levels: {
      target: 3150.00,
      stoploss: 2840.00,
      support1: 2900.00,
      support2: 2850.00,
      resistance1: 3020.00,
      resistance2: 3100.00
    },
    pattern: {
      name: 'Cup and Handle Breakout',
      type: 'Bullish',
      description: 'Stock has successfully broken out of a 4-week cup and handle formation with 2x average volume. Immediate momentum is highly bullish.'
    },
    summary: 'Reliance shows exceptional relative strength compared to the Nifty 50. Fundamental catalysts in the retail and telecom sectors are aligning with technical breakouts. MACD crossover confirmed on the daily timeframe.',
    trend: { short: 'Bullish', medium: 'Bullish', long: 'Bullish' }
  },
  'TCS': {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    price: 3920.10,
    change: -0.5,
    aiScore: 65,
    signal: 'Hold',
    confidence: 78,
    riskLevel: 'Low',
    levels: {
      target: 4100.00,
      stoploss: 3800.00,
      support1: 3850.00,
      support2: 3750.00,
      resistance1: 4000.00,
      resistance2: 4150.00
    },
    pattern: {
      name: 'Descending Triangle',
      type: 'Bearish',
      description: 'Approaching the apex of a descending triangle. Volume is drying up, indicating a high probability of a sharp move soon. Wait for a clear breakout.'
    },
    summary: 'TCS is currently consolidating near its major moving averages. Global IT spending uncertainties are keeping the stock range-bound. RSI is neutral at 48. Accumulate on dips near support zones.',
    trend: { short: 'Neutral', medium: 'Bullish', long: 'Bullish' }
  },
  'HDFCBANK': {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    price: 1450.60,
    change: -2.1,
    aiScore: 42,
    signal: 'Sell',
    confidence: 85,
    riskLevel: 'High',
    levels: {
      target: 1320.00,
      stoploss: 1510.00,
      support1: 1400.00,
      support2: 1350.00,
      resistance1: 1480.00,
      resistance2: 1520.00
    },
    pattern: {
      name: 'Head and Shoulders',
      type: 'Bearish',
      description: 'Neckline breakdown confirmed on weekly charts. The pattern suggests further downside pressure over the next 2-3 weeks.'
    },
    summary: 'Heavy FII selling and margin compression concerns are weighing on HDFC Bank. The stock has slipped below its 200-day EMA. Bearish momentum is strong with ADX above 30.',
    trend: { short: 'Bearish', medium: 'Bearish', long: 'Neutral' }
  }
};

export default function StockAnalysis() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [analysis, setAnalysis] = useState(MOCK_ANALYSIS_DB['RELIANCE']); // Default view
  const [searchError, setSearchError] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError('');
    
    // Simulate API Call / AI Processing Time
    setTimeout(() => {
      const upperQuery = searchQuery.toUpperCase();
      if (MOCK_ANALYSIS_DB[upperQuery]) {
        setAnalysis(MOCK_ANALYSIS_DB[upperQuery]);
      } else {
        setSearchError(`No detailed AI data available for "${upperQuery}". Try RELIANCE, TCS, or HDFCBANK.`);
      }
      setIsSearching(false);
    }, 1200);
  };

  const getSignalColor = (signal) => {
    if (signal.includes('Buy')) return 'text-green-500 bg-green-500/10 border-green-500/20';
    if (signal.includes('Sell')) return 'text-red-500 bg-red-500/10 border-red-500/20';
    return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-zinc-900 dark:text-zinc-50 pt-8 pb-20 px-4 sm:px-6 lg:px-8">
      
      {/* HEADER & SEARCH BAR */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
              <Brain className="text-red-600" size={32} />
              AI Stock Analysis
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm sm:text-base max-w-xl">
              Get deep technical and fundamental insights powered by the Scorcher AI engine. Instant support, resistance, and pattern detection.
            </p>
          </div>

          <div className="w-full md:w-96">
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text" 
                placeholder="Search symbol (e.g., RELIANCE)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-4 pr-12 py-3.5 font-medium focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all shadow-sm"
              />
              <button 
                type="submit" 
                disabled={isSearching}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isSearching ? <Activity size={18} className="animate-spin" /> : <Search size={18} />}
              </button>
            </form>
            {searchError && (
              <p className="text-red-500 text-xs mt-2 font-medium px-2">{searchError}</p>
            )}
          </div>
        </div>
      </div>

      {/* ANALYSIS CONTENT */}
      <AnimatePresence mode="wait">
        {analysis && !isSearching && (
          <motion.div 
            key={analysis.symbol}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="max-w-7xl mx-auto space-y-6"
          >
            {/* HERO METRICS CARD */}
            <div className="bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 sm:p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                
                {/* Stock Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-black">{analysis.symbol}</h2>
                    <span className="text-zinc-500 font-medium">NSE</span>
                  </div>
                  <p className="text-zinc-500 dark:text-zinc-400 font-medium text-lg mb-6">{analysis.name}</p>
                  
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-bold tracking-tight">₹{analysis.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    <span className={`text-xl font-bold flex items-center mb-1 ${analysis.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {analysis.change >= 0 ? <TrendingUp size={24} className="mr-1" /> : <TrendingDown size={24} className="mr-1" />}
                      {analysis.change >= 0 ? '+' : ''}{analysis.change}%
                    </span>
                  </div>
                </div>

                {/* AI Signal Widget */}
                <div className="w-full lg:w-auto flex items-center gap-6 bg-slate-50 dark:bg-zinc-950/50 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  <div className="text-center">
                    <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wider">AI Score</p>
                    <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90 absolute inset-0">
                        <circle cx="40" cy="40" r="36" fill="transparent" stroke="currentColor" strokeWidth="6" className="text-zinc-200 dark:text-zinc-800" />
                        <circle cx="40" cy="40" r="36" fill="transparent" stroke="currentColor" strokeWidth="6" strokeDasharray="226" strokeDashoffset={226 - (226 * analysis.aiScore) / 100} className={`${getScoreColor(analysis.aiScore)} transition-all duration-1000 ease-out`} strokeLinecap="round" />
                      </svg>
                      <span className={`text-2xl font-black ${getScoreColor(analysis.aiScore)}`}>{analysis.aiScore}</span>
                    </div>
                  </div>
                  
                  <div className="w-px h-16 bg-zinc-200 dark:bg-zinc-800"></div>

                  <div>
                    <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wider">Recommendation</p>
                    <div className={`px-4 py-2 rounded-xl border text-xl font-black tracking-tight ${getSignalColor(analysis.signal)}`}>
                      {analysis.signal}
                    </div>
                    <div className="mt-2 text-xs font-bold text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                      <CheckCircle2 size={12} /> {analysis.confidence}% Confidence
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* MAIN ANALYSIS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Technical Levels */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
                    <Crosshair className="text-red-600" size={20} />
                    Trade Setup
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Target size={18} className="text-green-600 dark:text-green-400" />
                        <span className="font-bold text-green-700 dark:text-green-300">Target</span>
                      </div>
                      <span className="font-black text-green-700 dark:text-green-300">₹{analysis.levels.target}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl">
                      <div className="flex items-center gap-2">
                        <ShieldAlert size={18} className="text-red-600 dark:text-red-400" />
                        <span className="font-bold text-red-700 dark:text-red-300">Stoploss</span>
                      </div>
                      <span className="font-black text-red-700 dark:text-red-300">₹{analysis.levels.stoploss}</span>
                    </div>
                  </div>

                  <hr className="my-5 border-zinc-200 dark:border-zinc-800" />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold text-zinc-500 uppercase mb-2">Resistance</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                          <span>R2</span>
                          <span className="text-zinc-900 dark:text-white">₹{analysis.levels.resistance2}</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium">
                          <span>R1</span>
                          <span className="text-zinc-900 dark:text-white">₹{analysis.levels.resistance1}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-500 uppercase mb-2">Support</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                          <span>S1</span>
                          <span className="text-zinc-900 dark:text-white">₹{analysis.levels.support1}</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium">
                          <span>S2</span>
                          <span className="text-zinc-900 dark:text-white">₹{analysis.levels.support2}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                    <Activity className="text-red-600" size={20} />
                    Trend Analysis
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(analysis.trend).map(([term, sentiment]) => (
                      <div key={term} className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize text-zinc-600 dark:text-zinc-300">{term} Term</span>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          sentiment === 'Bullish' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' :
                          sentiment === 'Bearish' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' :
                          'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30'
                        }`}>
                          {sentiment}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Pattern Detection & Summary */}
              <div className="lg:col-span-2 space-y-6">
                
                <div className="bg-gradient-to-br from-zinc-900 to-black dark:from-zinc-900 dark:to-zinc-950 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl -z-10 group-hover:bg-red-600/20 transition-colors duration-500"></div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="text-yellow-400" size={20} />
                    <h3 className="text-lg font-bold">AI Pattern Detected</h3>
                  </div>
                  
                  <div className="mt-4 flex items-start gap-4">
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm shrink-0">
                      <BarChart2 size={32} className={analysis.pattern.type === 'Bullish' ? 'text-green-400' : 'text-red-400'} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black tracking-tight mb-1">{analysis.pattern.name}</h4>
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold mb-3 ${analysis.pattern.type === 'Bullish' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {analysis.pattern.type} Signal
                      </span>
                      <p className="text-zinc-300 text-sm leading-relaxed max-w-2xl">
                        {analysis.pattern.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm">
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <Brain className="text-red-600" size={20} />
                    Scorcher AI Summary
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {analysis.summary}
                  </p>
                  
                  <div className="mt-8 flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="text-red-600" size={20} />
                      <div>
                        <p className="text-sm font-bold text-red-900 dark:text-red-300">Risk Assessment: {analysis.riskLevel}</p>
                        <p className="text-xs text-red-700 dark:text-red-400 mt-0.5">Always strictly maintain stoploss levels.</p>
                      </div>
                    </div>
                    <button className="hidden sm:flex items-center gap-1 text-sm font-bold text-red-600 hover:text-red-700 transition-colors">
                      Trade Now <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEARCH LOADER */}
      <AnimatePresence>
        {isSearching && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="relative">
              <div className="w-16 h-16 border-4 border-zinc-200 dark:border-zinc-800 border-t-red-600 rounded-full animate-spin"></div>
              <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-600" size={24} />
            </div>
            <p className="mt-4 font-bold text-zinc-500 animate-pulse">Running AI Models...</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}