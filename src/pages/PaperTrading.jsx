import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, TrendingUp, TrendingDown, ShoppingCart, 
  History, Activity, Award, CheckCircle2, ChevronDown, Crosshair
} from 'lucide-react';

// ==========================================
// INITIAL MOCK DATA
// ==========================================
const INITIAL_BALANCE = 1000000; // 10 Lakhs virtual margin
const INITIAL_POSITIONS = [
  { id: 1, symbol: 'RELIANCE', type: 'BUY', qty: 100, avgPrice: 2900.50, currentPrice: 2950.45, pnl: 4995 },
  { id: 2, symbol: 'HDFCBANK', type: 'SELL', qty: 200, avgPrice: 1500.00, currentPrice: 1450.60, pnl: 9880 },
];
const INITIAL_ORDERS = [
  { id: 101, time: '10:15 AM', symbol: 'RELIANCE', type: 'BUY', qty: 100, price: 2900.50, status: 'Completed' },
  { id: 102, time: '09:45 AM', symbol: 'HDFCBANK', type: 'SELL', qty: 200, price: 1500.00, status: 'Completed' },
];

export default function PaperTrading() {
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [positions, setPositions] = useState(INITIAL_POSITIONS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  
  // Order Entry Form State
  const [orderForm, setOrderForm] = useState({
    symbol: '',
    action: 'BUY', // BUY or SELL
    orderType: 'MARKET', // MARKET or LIMIT
    qty: '',
    price: ''
  });

  const [toastMessage, setToastMessage] = useState('');

  // ==========================================
  // CALCULATIONS
  // ==========================================
  const portfolioStats = useMemo(() => {
    let openPnl = 0;
    let investedMargin = 0;

    positions.forEach(pos => {
      openPnl += pos.pnl;
      investedMargin += (pos.avgPrice * pos.qty);
    });

    const netWorth = balance + openPnl + investedMargin;
    return { openPnl, investedMargin, netWorth };
  }, [balance, positions]);

  // ==========================================
  // TRADE EXECUTION LOGIC (SIMULATED)
  // ==========================================
  const handleExecuteTrade = (e) => {
    e.preventDefault();
    if (!orderForm.symbol || !orderForm.qty || orderForm.qty <= 0) {
      showToast("Please enter valid symbol and quantity");
      return;
    }

    const tradeQty = parseInt(orderForm.qty);
    // Simulate current market price if MARKET order (random value between 100 and 3000)
    const execPrice = orderForm.orderType === 'LIMIT' 
      ? parseFloat(orderForm.price) 
      : Math.floor(Math.random() * (3000 - 100 + 1) + 100); 
    
    const requiredMargin = tradeQty * execPrice;

    if (orderForm.action === 'BUY' && requiredMargin > balance) {
      showToast("Insufficient Virtual Margin!");
      return;
    }

    // Update Balance
    if (orderForm.action === 'BUY') {
      setBalance(prev => prev - requiredMargin);
    } else {
      // For short selling, we just add margin requirement logic, keeping it simple here
      setBalance(prev => prev - (requiredMargin * 0.2)); // 20% margin blocked for short
    }

    // Add to Positions
    const newPosition = {
      id: Date.now(),
      symbol: orderForm.symbol.toUpperCase(),
      type: orderForm.action,
      qty: tradeQty,
      avgPrice: execPrice,
      currentPrice: execPrice, // initial price is exec price
      pnl: 0
    };
    setPositions([newPosition, ...positions]);

    // Add to Orders History
    const newOrder = {
      id: Date.now() + 1,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      symbol: orderForm.symbol.toUpperCase(),
      type: orderForm.action,
      qty: tradeQty,
      price: execPrice,
      status: 'Completed'
    };
    setOrders([newOrder, ...orders]);

    showToast(`${orderForm.action} Order executed for ${tradeQty} ${orderForm.symbol.toUpperCase()} at ₹${execPrice}`);
    
    // Reset Form
    setOrderForm({ symbol: '', action: 'BUY', orderType: 'MARKET', qty: '', price: '' });
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-zinc-900 dark:text-zinc-50 pt-8 pb-20 px-4 sm:px-6 lg:px-8">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Activity className="text-red-600" size={32} />
            Paper Trading
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm sm:text-base">
            Practice strategies with ₹10,00,000 virtual money in real-time market conditions.
          </p>
        </div>

        {/* Global Stats Widget */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-5 py-3 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Available Margin</p>
              <p className="text-xl font-black">₹{balance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-5 py-3 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-xl">
              <Award size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Net Worth</p>
              <p className="text-xl font-black text-green-600 dark:text-green-500">₹{portfolioStats.netWorth.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: POSITIONS & ORDERS */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Active Positions */}
          <div className="bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-slate-50 dark:bg-zinc-950/50">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Crosshair className="text-red-600" size={20} /> Active Positions
              </h2>
              <div className="text-sm font-bold flex items-center gap-2">
                <span className="text-zinc-500">Day's P&L:</span>
                <span className={portfolioStats.openPnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {portfolioStats.openPnl >= 0 ? '+' : ''}₹{portfolioStats.openPnl.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
            
            <div className="overflow-x-auto w-full custom-scrollbar min-h-[200px]">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="py-3 px-6 text-xs font-bold text-zinc-500 uppercase">Symbol</th>
                    <th className="py-3 px-6 text-xs font-bold text-zinc-500 uppercase text-center">Type</th>
                    <th className="py-3 px-6 text-xs font-bold text-zinc-500 uppercase text-right">Qty</th>
                    <th className="py-3 px-6 text-xs font-bold text-zinc-500 uppercase text-right">Avg Price</th>
                    <th className="py-3 px-6 text-xs font-bold text-zinc-500 uppercase text-right">LTP</th>
                    <th className="py-3 px-6 text-xs font-bold text-zinc-500 uppercase text-right">P&L</th>
                    <th className="py-3 px-6 text-xs font-bold text-zinc-500 uppercase text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                  <AnimatePresence>
                    {positions.map((pos) => (
                      <motion.tr 
                        key={pos.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                      >
                        <td className="py-4 px-6 font-bold">{pos.symbol}</td>
                        <td className="py-4 px-6 text-center">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${pos.type === 'BUY' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                            {pos.type}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right font-medium">{pos.qty}</td>
                        <td className="py-4 px-6 text-right">₹{pos.avgPrice.toFixed(2)}</td>
                        <td className="py-4 px-6 text-right font-medium">₹{pos.currentPrice.toFixed(2)}</td>
                        <td className={`py-4 px-6 text-right font-bold ${pos.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {pos.pnl >= 0 ? '+' : ''}₹{pos.pnl.toLocaleString('en-IN')}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button className="px-3 py-1 bg-zinc-900 dark:bg-white text-white dark:text-black text-xs font-bold rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
                            Square Off
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                    {positions.length === 0 && (
                      <tr>
                        <td colSpan="7" className="py-12 text-center text-zinc-500">
                          <p className="font-medium text-zinc-900 dark:text-zinc-100">No active positions</p>
                          <p className="text-sm">Execute a trade to see it here.</p>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Book */}
          <div className="bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/50">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <History className="text-red-600" size={20} /> Today's Orders
              </h2>
            </div>
            <div className="overflow-x-auto custom-scrollbar min-h-[150px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="py-3 px-6 text-xs font-bold text-zinc-500 uppercase">Time</th>
                    <th className="py-3 px-6 text-xs font-bold text-zinc-500 uppercase">Symbol</th>
                    <th className="py-3 px-6 text-xs font-bold text-zinc-500 uppercase text-center">Side</th>
                    <th className="py-3 px-6 text-xs font-bold text-zinc-500 uppercase text-right">Qty</th>
                    <th className="py-3 px-6 text-xs font-bold text-zinc-500 uppercase text-right">Price</th>
                    <th className="py-3 px-6 text-xs font-bold text-zinc-500 uppercase text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                  <AnimatePresence>
                    {orders.map((order) => (
                      <motion.tr 
                        key={order.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                      >
                        <td className="py-3 px-6 text-sm text-zinc-500">{order.time}</td>
                        <td className="py-3 px-6 text-sm font-bold">{order.symbol}</td>
                        <td className="py-3 px-6 text-center">
                           <span className={order.type === 'BUY' ? 'text-green-500 font-bold text-sm' : 'text-red-500 font-bold text-sm'}>
                             {order.type}
                           </span>
                        </td>
                        <td className="py-3 px-6 text-right text-sm font-medium">{order.qty}</td>
                        <td className="py-3 px-6 text-right text-sm">₹{order.price.toFixed(2)}</td>
                        <td className="py-3 px-6 text-center">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-md">
                            <CheckCircle2 size={12} /> {order.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: ORDER ENTRY & LEADERBOARD */}
        <div className="space-y-6">
          
          {/* Order Entry Form */}
          <div className="bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-6 relative overflow-hidden">
            
            {/* Top red accent line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>

            <h2 className="font-bold text-xl flex items-center gap-2 mb-6">
              <ShoppingCart className="text-red-600" size={20} /> Place Order
            </h2>

            <form onSubmit={handleExecuteTrade} className="space-y-5">
              
              {/* Buy/Sell Toggles */}
              <div className="grid grid-cols-2 gap-2 bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setOrderForm({...orderForm, action: 'BUY'})}
                  className={`py-2 rounded-lg text-sm font-bold transition-all ${
                    orderForm.action === 'BUY' 
                      ? 'bg-green-500 text-white shadow-md' 
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  BUY
                </button>
                <button
                  type="button"
                  onClick={() => setOrderForm({...orderForm, action: 'SELL'})}
                  className={`py-2 rounded-lg text-sm font-bold transition-all ${
                    orderForm.action === 'SELL' 
                      ? 'bg-red-500 text-white shadow-md' 
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  SELL
                </button>
              </div>

              {/* Symbol Input */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Symbol</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. RELIANCE"
                  value={orderForm.symbol}
                  onChange={(e) => setOrderForm({...orderForm, symbol: e.target.value.toUpperCase()})}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all uppercase"
                />
              </div>

              {/* Order Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Order Type</label>
                  <div className="relative">
                    <select 
                      value={orderForm.orderType}
                      onChange={(e) => setOrderForm({...orderForm, orderType: e.target.value})}
                      className="w-full appearance-none bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all cursor-pointer"
                    >
                      <option value="MARKET">Market</option>
                      <option value="LIMIT">Limit</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Quantity</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    placeholder="0"
                    value={orderForm.qty}
                    onChange={(e) => setOrderForm({...orderForm, qty: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                  />
                </div>
              </div>

              {/* Price Input (Disabled if Market) */}
              <AnimatePresence>
                {orderForm.orderType === 'LIMIT' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 mt-1">Limit Price</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-zinc-500">₹</span>
                      <input 
                        type="number" 
                        required
                        min="0"
                        step="0.05"
                        placeholder="0.00"
                        value={orderForm.price}
                        onChange={(e) => setOrderForm({...orderForm, price: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-8 pr-4 py-3 font-bold focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <div className="pt-2">
                <button 
                  type="submit"
                  className={`w-full py-3.5 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-xl active:scale-95 ${
                    orderForm.action === 'BUY' 
                      ? 'bg-green-600 hover:bg-green-700 shadow-green-600/20' 
                      : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
                  }`}
                >
                  {orderForm.action} {orderForm.symbol || 'STOCK'}
                </button>
              </div>

            </form>
          </div>

          {/* Quick Rank / Leaderboard Widget */}
          <div className="bg-gradient-to-br from-zinc-900 to-black dark:from-zinc-900 dark:to-zinc-950 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-600/20 rounded-full blur-2xl"></div>
            
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4">Your Ranking</h3>
            <div className="flex items-end gap-3 mb-6">
              <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">
                #42
              </span>
              <span className="text-sm font-medium text-zinc-400 mb-1">out of 10k traders</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Weekly Return</span>
                <span className="font-bold text-green-400">+12.4%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Win Rate</span>
                <span className="font-bold text-white">68%</span>
              </div>
            </div>

            <button className="w-full mt-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors">
              View Leaderboard
            </button>
          </div>

        </div>
      </div>

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
              <CheckCircle2 size={16} strokeWidth={3} />
            </div>
            <p className="text-sm font-bold">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}