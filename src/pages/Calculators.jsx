import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, PieChart, ShieldAlert, Target, 
  IndianRupee, TrendingUp, Info, ChevronRight, Activity 
} from 'lucide-react';

export default function Calculators() {
  const [activeTab, setActiveTab] = useState('position');

  // ==========================================
  // STATE: POSITION SIZING CALCULATOR
  // ==========================================
  const [posState, setPosState] = useState({
    accountSize: 100000,
    riskPercent: 1,
    entryPrice: 1500,
    stopLoss: 1450,
  });

  // ==========================================
  // STATE: SIP CALCULATOR
  // ==========================================
  const [sipState, setSipState] = useState({
    monthlyInvestment: 5000,
    expectedRate: 12,
    timePeriod: 10,
  });

  // ==========================================
  // STATE: COMPOUND INTEREST (LUMPSUM)
  // ==========================================
  const [compState, setCompState] = useState({
    principal: 100000,
    expectedRate: 12,
    timePeriod: 10,
  });

  // ==========================================
  // CALCULATIONS LOGIC
  // ==========================================
  const positionResult = useMemo(() => {
    const riskAmount = (posState.accountSize * posState.riskPercent) / 100;
    const riskPerShare = Math.abs(posState.entryPrice - posState.stopLoss);
    
    let shares = 0;
    if (riskPerShare > 0) {
      shares = Math.floor(riskAmount / riskPerShare);
    }
    
    const totalPositionSize = shares * posState.entryPrice;
    const leverageRequired = totalPositionSize > posState.accountSize 
      ? (totalPositionSize / posState.accountSize).toFixed(2) 
      : 0;

    return { riskAmount, riskPerShare, shares, totalPositionSize, leverageRequired };
  }, [posState]);

  const sipResult = useMemo(() => {
    const P = sipState.monthlyInvestment;
    const i = (sipState.expectedRate / 100) / 12; // monthly rate
    const n = sipState.timePeriod * 12; // total months

    const investedAmount = P * n;
    // SIP Formula: M = P × ({[1 + i]^n - 1} / i) × (1 + i)
    let maturityAmount = 0;
    if (i === 0) {
      maturityAmount = investedAmount;
    } else {
      maturityAmount = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    }
    
    const estimatedReturns = maturityAmount - investedAmount;
    const investedPercent = (investedAmount / maturityAmount) * 100 || 0;

    return { investedAmount, estimatedReturns, maturityAmount, investedPercent };
  }, [sipState]);

  const compResult = useMemo(() => {
    const P = compState.principal;
    const r = compState.expectedRate / 100;
    const t = compState.timePeriod;

    // A = P(1 + r)^t
    const maturityAmount = P * Math.pow(1 + r, t);
    const estimatedReturns = maturityAmount - P;
    const investedPercent = (P / maturityAmount) * 100 || 0;

    return { investedAmount: P, estimatedReturns, maturityAmount, investedPercent };
  }, [compState]);

  // ==========================================
  // UI COMPONENTS
  // ==========================================
  const TabButton = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl font-bold transition-all ${
        activeTab === id 
          ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
          : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
      }`}
    >
      <Icon size={20} className={activeTab === id ? 'text-white' : 'text-red-600'} />
      {label}
      {activeTab === id && <ChevronRight size={18} className="ml-auto" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-zinc-900 dark:text-zinc-50 pt-8 pb-24 px-4 sm:px-6 lg:px-8">
      
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
          <Calculator className="text-red-600" size={32} />
          Trading Calculators
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm sm:text-base">
          Precision tools for risk management, wealth planning, and return forecasting.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SIDEBAR TABS */}
        <div className="lg:col-span-4 space-y-3">
          <TabButton id="position" icon={ShieldAlert} label="Position Sizing" />
          <TabButton id="sip" icon={PieChart} label="SIP Calculator" />
          <TabButton id="compound" icon={Target} label="Lumpsum Growth" />

          {/* Educational Widget */}
          <div className="mt-8 bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hidden lg:block">
            <h3 className="font-bold flex items-center gap-2 mb-3">
              <Info className="text-red-600" size={18} />
              Why Use Calculators?
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Professional traders never enter a trade without calculating their exact risk. Position sizing ensures that a single losing trade doesn't wipe out your account. For investors, SIP and compounding calculators provide a clear roadmap to financial freedom.
            </p>
          </div>
        </div>

        {/* MAIN CALCULATOR AREA */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            
            {/* 1. POSITION SIZING CALCULATOR */}
            {activeTab === 'position' && (
              <motion.div
                key="position"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex flex-col"
              >
                <div className="p-6 sm:p-8 border-b border-zinc-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/50 flex items-center justify-between">
                   <h2 className="text-xl font-bold flex items-center gap-2">
                     <ShieldAlert className="text-red-600" /> Position Size Calculator
                   </h2>
                   <span className="px-3 py-1 bg-zinc-200 dark:bg-zinc-800 text-xs font-bold rounded-lg uppercase tracking-wider">Risk Management</span>
                </div>

                <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Inputs */}
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Total Capital (₹)</label>
                      <input 
                        type="number" 
                        value={posState.accountSize}
                        onChange={(e) => setPosState({...posState, accountSize: Number(e.target.value)})}
                        className="w-full bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Risk per Trade (%)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={posState.riskPercent}
                        onChange={(e) => setPosState({...posState, riskPercent: Number(e.target.value)})}
                        className="w-full bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Entry Price (₹)</label>
                        <input 
                          type="number" 
                          value={posState.entryPrice}
                          onChange={(e) => setPosState({...posState, entryPrice: Number(e.target.value)})}
                          className="w-full bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Stop Loss (₹)</label>
                        <input 
                          type="number" 
                          value={posState.stopLoss}
                          onChange={(e) => setPosState({...posState, stopLoss: Number(e.target.value)})}
                          className="w-full bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Outputs */}
                  <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-600/10 rounded-full blur-2xl group-hover:bg-red-600/20 transition-all"></div>
                    
                    <h3 className="text-sm font-bold text-red-900 dark:text-red-400 uppercase tracking-wider mb-6">Trade Plan</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Max Risk Amount</p>
                        <p className="text-3xl font-black text-red-600">₹{positionResult.riskAmount.toLocaleString('en-IN')}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 border-t border-red-200 dark:border-red-900/50 pt-4">
                        <div>
                          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Quantity (Shares)</p>
                          <p className="text-xl font-bold text-zinc-900 dark:text-white">{positionResult.shares}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Total Position Size</p>
                          <p className="text-xl font-bold text-zinc-900 dark:text-white">₹{positionResult.totalPositionSize.toLocaleString('en-IN')}</p>
                        </div>
                      </div>

                      {positionResult.leverageRequired > 1 && (
                        <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 p-3 rounded-xl text-xs font-bold flex items-start gap-2">
                          <ShieldAlert size={16} className="shrink-0" />
                          <p>Warning: This position requires {positionResult.leverageRequired}x margin. You might need intraday leverage to execute this.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. SIP CALCULATOR */}
            {activeTab === 'sip' && (
              <motion.div
                key="sip"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex flex-col"
              >
                <div className="p-6 sm:p-8 border-b border-zinc-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/50 flex items-center justify-between">
                   <h2 className="text-xl font-bold flex items-center gap-2">
                     <PieChart className="text-red-600" /> SIP Calculator
                   </h2>
                   <span className="px-3 py-1 bg-zinc-200 dark:bg-zinc-800 text-xs font-bold rounded-lg uppercase tracking-wider">Wealth Creation</span>
                </div>

                <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Inputs */}
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Monthly Investment</label>
                        <span className="font-bold text-red-600">₹{sipState.monthlyInvestment.toLocaleString('en-IN')}</span>
                      </div>
                      <input 
                        type="range" min="500" max="100000" step="500" 
                        value={sipState.monthlyInvestment} onChange={(e) => setSipState({...sipState, monthlyInvestment: Number(e.target.value)})}
                        className="w-full accent-red-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Expected Return Rate (p.a)</label>
                        <span className="font-bold text-red-600">{sipState.expectedRate}%</span>
                      </div>
                      <input 
                        type="range" min="1" max="30" step="0.5" 
                        value={sipState.expectedRate} onChange={(e) => setSipState({...sipState, expectedRate: Number(e.target.value)})}
                        className="w-full accent-red-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Time Period</label>
                        <span className="font-bold text-red-600">{sipState.timePeriod} Years</span>
                      </div>
                      <input 
                        type="range" min="1" max="40" step="1" 
                        value={sipState.timePeriod} onChange={(e) => setSipState({...sipState, timePeriod: Number(e.target.value)})}
                        className="w-full accent-red-600"
                      />
                    </div>
                  </div>

                  {/* Outputs */}
                  <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-full blur-2xl group-hover:bg-green-500/20 transition-all"></div>
                    
                    <h3 className="text-sm font-bold text-green-900 dark:text-green-400 uppercase tracking-wider mb-6">Maturity Details</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Total Value</p>
                        <p className="text-4xl font-black text-green-600">₹{Math.round(sipResult.maturityAmount).toLocaleString('en-IN')}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Invested Amount</p>
                          <p className="text-lg font-bold text-zinc-900 dark:text-white">₹{Math.round(sipResult.investedAmount).toLocaleString('en-IN')}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Est. Returns</p>
                          <p className="text-lg font-bold text-zinc-900 dark:text-white">₹{Math.round(sipResult.estimatedReturns).toLocaleString('en-IN')}</p>
                        </div>
                      </div>

                      {/* Visual Progress Bar */}
                      <div className="pt-2">
                        <div className="w-full h-3 bg-green-200 dark:bg-green-900/50 rounded-full overflow-hidden flex">
                          <div style={{ width: `${sipResult.investedPercent}%` }} className="h-full bg-zinc-400 dark:bg-zinc-600" title="Invested Amount"></div>
                          <div style={{ width: `${100 - sipResult.investedPercent}%` }} className="h-full bg-green-500" title="Wealth Gained"></div>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-zinc-500 mt-2">
                          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-zinc-400"></div> Invested</span>
                          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Returns</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. COMPOUND INTEREST CALCULATOR */}
            {activeTab === 'compound' && (
              <motion.div
                key="compound"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex flex-col"
              >
                <div className="p-6 sm:p-8 border-b border-zinc-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/50 flex items-center justify-between">
                   <h2 className="text-xl font-bold flex items-center gap-2">
                     <Target className="text-red-600" /> Lumpsum Growth
                   </h2>
                   <span className="px-3 py-1 bg-zinc-200 dark:bg-zinc-800 text-xs font-bold rounded-lg uppercase tracking-wider">Compounding</span>
                </div>

                <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Inputs */}
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Total Investment</label>
                        <span className="font-bold text-red-600">₹{compState.principal.toLocaleString('en-IN')}</span>
                      </div>
                      <input 
                        type="range" min="10000" max="10000000" step="10000" 
                        value={compState.principal} onChange={(e) => setCompState({...compState, principal: Number(e.target.value)})}
                        className="w-full accent-red-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Expected Return Rate (p.a)</label>
                        <span className="font-bold text-red-600">{compState.expectedRate}%</span>
                      </div>
                      <input 
                        type="range" min="1" max="50" step="1" 
                        value={compState.expectedRate} onChange={(e) => setCompState({...compState, expectedRate: Number(e.target.value)})}
                        className="w-full accent-red-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Time Period</label>
                        <span className="font-bold text-red-600">{compState.timePeriod} Years</span>
                      </div>
                      <input 
                        type="range" min="1" max="40" step="1" 
                        value={compState.timePeriod} onChange={(e) => setCompState({...compState, timePeriod: Number(e.target.value)})}
                        className="w-full accent-red-600"
                      />
                    </div>
                  </div>

                  {/* Outputs */}
                  <div className="bg-gradient-to-br from-zinc-900 to-black dark:from-zinc-900 dark:to-zinc-950 text-white rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/10 rounded-full blur-3xl group-hover:bg-red-600/20 transition-all"></div>
                    
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                      <Activity size={16} className="text-red-500" /> Magic of Compounding
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm font-semibold text-zinc-400 mb-1">Future Value</p>
                        <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">
                          ₹{Math.round(compResult.maturityAmount).toLocaleString('en-IN')}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 border-t border-zinc-800 pt-4">
                        <div>
                          <p className="text-xs font-semibold text-zinc-500 mb-1">Principal Amount</p>
                          <p className="text-lg font-bold text-white">₹{Math.round(compResult.investedAmount).toLocaleString('en-IN')}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-zinc-500 mb-1">Wealth Earned</p>
                          <p className="text-lg font-bold text-green-400">+₹{Math.round(compResult.estimatedReturns).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}