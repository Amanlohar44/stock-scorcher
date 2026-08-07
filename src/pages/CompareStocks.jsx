import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scale, Plus, X, TrendingUp, TrendingDown, 
  BarChart2, Zap, Brain, ChevronRight, Activity, PieChart
} from 'lucide-react';

// ==========================================
// MOCK DATA: COMPARISON METRICS
// ==========================================
const COMPARE_DATA = [
  {
    id: 1,
    symbol: 'RELIANCE',
    name: 'Reliance Industries',
    price: 2950.45,
    change: 1.2,
    marketCap: "₹19.8L Cr",
    pe: 28.5,
    pb: 2.1,
    roe: 9.5,
    roce: 10.2,
    debtToEq: 0.4,
    divYield: 0.3,
    revenueGrowth: 15.2,
    profitMargin: 8.4,
    promoterHolding: 50.3,
    aiScore: 88,
    verdict: "Strong Buy",
    color: "bg-blue-500"
  },
  {
    id: 2,
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    price: 3920.10,
    change: -0.5,
    marketCap: "₹14.5L Cr",
    pe: 31.2,
    pb: 14.5,
    roe: 46.8,
    roce: 58.2,
    debtToEq: 0.0,
    divYield: 1.4,
    revenueGrowth: 8.5,
    profitMargin: 20.1,
    promoterHolding: 72.3,
    aiScore: 65,
    verdict: "Hold",
    color: "bg-purple-500"
  },
  {
    id: 3,
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    price: 1450.60,
    change: 2.1,
    marketCap: "₹11.2L Cr",
    pe: 16.4,
    pb: 2.8,
    roe: 17.1,
    roce: 16.5,
    debtToEq: 8.5,
    divYield: 1.1,
    revenueGrowth: 22.4,
    profitMargin: 15.6,
    promoterHolding: 0.0, // FII/DII mostly
    aiScore: 42,
    verdict: "Sell",
    color: "bg-emerald-500"
  }
];

export default function CompareStocks() {
  const [stocks, setStocks] = useState(COMPARE_DATA);
  const [searchQuery, setSearchQuery] = useState('');

  const removeStock = (id) => {
    setStocks(stocks.filter(s => s.id !== id));
  };

  const getHighlightColor = (value, isPositiveGood = true) => {
    if (value > 20) return isPositiveGood ? 'text-green-500 font-black' : 'text-red-500 font-black';
    if (value < 5) return isPositiveGood ? 'text-red-500 font-black' : 'text-green-500 font-black';
    return 'text-zinc-900 dark:text-white font-bold';
  };

  const MetricRow = ({ label, icon: Icon, dataKey, format = 'number', isPositiveGood = true }) => (
    <div className="flex flex-col md:flex-row border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors">
      <div className="w-full md:w-64 p-4 md:p-5 flex items-center gap-2 text-sm font-bold text-zinc-500 bg-slate-50/50 dark:bg-zinc-950/20 md:border-r border-zinc-100 dark:border-zinc-800/50">
        {Icon && <Icon size={16} />} {label}
      </div>
      <div className="flex-1 flex overflow-x-auto custom-scrollbar">
        {stocks.map(stock => (
          <div key={stock.id} className="flex-1 min-w-[150px] p-4 md:p-5 text-center border-r border-zinc-100 dark:border-zinc-800/50 last:border-0">
            <span className={`text-base ${
              format === 'number' || format === 'percentage' 
                ? getHighlightColor(stock[dataKey], isPositiveGood)
                : 'font-bold'
            }`}>
              {format === 'percentage' ? `${stock[dataKey]}%` : stock[dataKey]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-zinc-900 dark:text-zinc-50 pt-8 pb-24 px-4 sm:px-6 lg:px-8">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Scale className="text-red-600" size={32} />
            Stock Comparison
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm sm:text-base">
            Compare up to 5 stocks side-by-side on 20+ parameters with AI verdicts.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-2xl shadow-sm">
          <input 
            type="text" 
            placeholder="Add stock to compare..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none focus:outline-none px-3 py-1.5 text-sm font-medium w-48 lg:w-64"
          />
          <button className="bg-red-600 text-white p-2 rounded-xl hover:bg-red-700 transition-colors shadow-sm">
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* MAIN COMPARISON MATRIX */}
        <div className="bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex flex-col relative">
          
          {/* Top Sticky Header (Stock Cards) */}
          <div className="flex flex-col md:flex-row border-b border-zinc-200 dark:border-zinc-800 sticky top-16 z-30 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md">
            <div className="w-full md:w-64 p-5 flex items-center text-sm font-bold text-zinc-500 md:border-r border-zinc-200 dark:border-zinc-800 uppercase tracking-wider">
              Metrics
            </div>
            <div className="flex-1 flex overflow-x-auto custom-scrollbar">
              <AnimatePresence>
                {stocks.map(stock => (
                  <motion.div 
                    key={stock.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex-1 min-w-[200px] p-5 text-center border-r border-zinc-200 dark:border-zinc-800 last:border-0 relative group"
                  >
                    <button 
                      onClick={() => removeStock(stock.id)}
                      className="absolute top-3 right-3 p-1 text-zinc-400 hover:text-red-600 bg-white dark:bg-zinc-800 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                    
                    <div className={`w-10 h-1 rounded-full mx-auto mb-3 ${stock.color}`}></div>
                    <h3 className="font-black text-lg text-zinc-900 dark:text-white mb-1">{stock.symbol}</h3>
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-bold">₹{stock.price.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                      <span className={`text-xs font-bold ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Data Rows */}
          <div className="flex flex-col">
            {/* Section: Valuation */}
            <div className="bg-slate-100 dark:bg-zinc-950/80 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-zinc-500">
              Valuation & Size
            </div>
            <MetricRow label="Market Cap" icon={PieChart} dataKey="marketCap" format="string" />
            <MetricRow label="P/E Ratio" icon={BarChart2} dataKey="pe" isPositiveGood={false} />
            <MetricRow label="P/B Ratio" icon={BarChart2} dataKey="pb" isPositiveGood={false} />
            <MetricRow label="Dividend Yield" icon={Zap} dataKey="divYield" format="percentage" />

            {/* Section: Fundamentals */}
            <div className="bg-slate-100 dark:bg-zinc-950/80 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-zinc-500">
              Efficiency & Health
            </div>
            <MetricRow label="ROE (Return on Equity)" icon={Activity} dataKey="roe" format="percentage" />
            <MetricRow label="ROCE" icon={Activity} dataKey="roce" format="percentage" />
            <MetricRow label="Debt to Equity" icon={Scale} dataKey="debtToEq" isPositiveGood={false} />
            <MetricRow label="Promoter Holding" icon={PieChart} dataKey="promoterHolding" format="percentage" />

            {/* Section: Growth */}
            <div className="bg-slate-100 dark:bg-zinc-950/80 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-zinc-500">
              Growth Metrics
            </div>
            <MetricRow label="Revenue Growth (YoY)" icon={TrendingUp} dataKey="revenueGrowth" format="percentage" />
            <MetricRow label="Net Profit Margin" icon={TrendingUp} dataKey="profitMargin" format="percentage" />
          </div>
        </div>

        {/* AI VERDICT SECTION */}
        <div className="bg-gradient-to-br from-zinc-900 to-black dark:from-zinc-900 dark:to-zinc-950 text-white rounded-2xl shadow-xl relative overflow-hidden group p-6 sm:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl group-hover:bg-red-600/20 transition-all"></div>
          
          <h2 className="text-xl font-bold flex items-center gap-3 mb-8">
            <Brain className="text-red-500" size={24} /> 
            AI Comparative Verdict
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stocks.map(stock => (
              <div key={stock.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col backdrop-blur-sm relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 ${stock.color}`}></div>
                
                <h3 className="font-bold text-lg mb-4">{stock.symbol}</h3>
                
                <div className="flex items-end gap-2 mb-6">
                  <span className={`text-4xl font-black ${
                    stock.aiScore >= 80 ? 'text-green-400' : 
                    stock.aiScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {stock.aiScore}
                  </span>
                  <span className="text-sm font-medium text-zinc-400 mb-1">/100</span>
                </div>

                <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-400 uppercase">AI Signal</span>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                    stock.verdict.includes('Buy') ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                    stock.verdict.includes('Sell') ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                    'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                  }`}>
                    {stock.verdict}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-zinc-300 text-sm leading-relaxed">
              <strong>Summary:</strong> Based on the current comparison, <strong className="text-white">RELIANCE</strong> shows the strongest fundamental growth and technical breakout momentum with an AI score of 88. <strong>TCS</strong> remains a solid defensive play with zero debt and high ROE, while <strong>HDFCBANK</strong> is currently facing technical headwinds despite strong revenue growth.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}