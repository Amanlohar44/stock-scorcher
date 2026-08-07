import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Bot, User, Sparkles, TrendingUp, BookOpen, 
  Activity, AlertCircle, RefreshCw 
} from 'lucide-react';

// ==========================================
// MOCK AI LOGIC & RESPONSES
// ==========================================
const generateAIResponse = (query) => {
  const q = query.toLowerCase();
  
  if (q.includes('buy') && q.includes('hdfc')) {
    return "Based on my current technical analysis, HDFC Bank (HDFCBANK) is showing **bearish momentum** in the short term. The stock has slipped below its 200-day EMA and is facing resistance at ₹1480. \n\n**Recommendation:** Hold or wait for a strong reversal pattern near the ₹1350-1400 support zone before initiating fresh long positions.";
  }
  if (q.includes('rsi') || q.includes('relative strength index')) {
    return "The **Relative Strength Index (RSI)** is a momentum oscillator that measures the speed and change of price movements. It oscillates between zero and 100.\n\n• **Above 70:** Considered Overbought (Potential sell signal).\n• **Below 30:** Considered Oversold (Potential buy signal).\n\n*Pro tip: RSI works best when combined with trendlines and MACD crossovers.*";
  }
  if (q.includes('analyze') && (q.includes('reliance') || q.includes('ril'))) {
    return "**Reliance Industries (RELIANCE) Analysis:**\n\n• **Trend:** Strongly Bullish\n• **AI Score:** 88/100\n• **Current Pattern:** Cup and Handle Breakout\n• **Target:** ₹3150 | **Stoploss:** ₹2840\n\nThe stock is showing exceptional relative strength compared to the Nifty 50, driven by fundamental catalysts in the retail and telecom sectors.";
  }
  if (q.includes('options') || q.includes('futures')) {
    return "**Futures and Options (F&O)** are financial derivatives.\n\n• **Futures:** An obligation to buy/sell an asset at a predetermined price on a specific date.\n• **Options:** Gives you the *right* (but not obligation) to buy (Call) or sell (Put) an asset at a specific price.\n\n*Warning: F&O trading involves high risk and requires strict risk management.*";
  }

  return "I am Scorcher AI, your advanced financial assistant. I can help you analyze stocks, explain technical indicators, summarize market news, or review your portfolio risk. \n\nCould you please provide a specific stock symbol or a financial concept you'd like to learn about?";
};

const SUGGESTED_PROMPTS = [
  { icon: TrendingUp, text: "Analyze RELIANCE chart" },
  { icon: BookOpen, text: "Explain RSI indicator" },
  { icon: Activity, text: "Should I buy HDFCBANK?" },
  { icon: AlertCircle, text: "Explain Futures & Options" },
];

export default function AiAssistant() {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      role: 'ai', 
      content: "Hello! I am **Scorcher AI**. I can analyze charts, scan for patterns, explain complex trading concepts, or give you live technical views on any Indian stock. How can I help you today?" 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (e, text = inputValue) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;

    // Add User Message
    const newUserMessage = { id: Date.now(), role: 'user', content: text };
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI Processing Time
    setTimeout(() => {
      const aiResponseText = generateAIResponse(text);
      const newAiMessage = { id: Date.now() + 1, role: 'ai', content: aiResponseText };
      setMessages(prev => [...prev, newAiMessage]);
      setIsTyping(false);
    }, 1500); // 1.5 second delay for realism
  };

  const handleClearChat = () => {
    setMessages([
      { id: Date.now(), role: 'ai', content: "Chat cleared. What would you like to explore next?" }
    ]);
  };

  // Format text to handle bold (**) and newlines (\n) basic markdown
  const formatMessage = (content) => {
    return content.split('\n').map((line, i) => {
      const formattedLine = line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="font-bold text-zinc-900 dark:text-white">{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      return <React.Fragment key={i}>{formattedLine}<br /></React.Fragment>;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-zinc-900 dark:text-zinc-50 pt-8 pb-24 px-4 sm:px-6 lg:px-8 flex flex-col">
      
      {/* HEADER */}
      <div className="max-w-5xl mx-auto w-full mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Sparkles className="text-red-600" size={32} />
            Scorcher AI
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm sm:text-base">
            Your personal financial analyst and market expert.
          </p>
        </div>
        <button 
          onClick={handleClearChat}
          className="p-2 text-zinc-500 hover:text-red-600 dark:hover:text-red-500 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-colors shadow-sm"
          title="Clear Chat"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* MAIN CHAT CONTAINER */}
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden h-[calc(100vh-220px)] min-h-[500px]">
        
        {/* MESSAGES AREA */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-6">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm border ${
                  msg.role === 'user' 
                    ? 'bg-red-600 border-red-700 text-white' 
                    : 'bg-zinc-900 dark:bg-white border-zinc-800 dark:border-zinc-200 text-white dark:text-black'
                }`}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>

                {/* Message Bubble */}
                <div className={`px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-red-600 text-white rounded-tr-sm'
                    : 'bg-slate-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-tl-sm'
                }`}>
                  {formatMessage(msg.content)}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 max-w-[85%] mr-auto"
            >
              <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm border bg-zinc-900 dark:bg-white border-zinc-800 dark:border-zinc-200 text-white dark:text-black">
                <Bot size={20} />
              </div>
              <div className="px-5 py-4 rounded-2xl rounded-tl-sm bg-slate-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 flex items-center gap-1.5 shadow-sm">
                <motion.div className="w-2 h-2 bg-red-600 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                <motion.div className="w-2 h-2 bg-red-600 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                <motion.div className="w-2 h-2 bg-red-600 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT AREA */}
        <div className="p-4 sm:p-6 border-t border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
          
          {/* Suggested Prompts (Hidden on small mobile if not at start) */}
          {messages.length < 3 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(null, prompt.text)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-red-600 dark:hover:border-red-600 transition-colors text-zinc-600 dark:text-zinc-300"
                >
                  <prompt.icon size={14} className="text-red-600" />
                  {prompt.text}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={(e) => handleSendMessage(e)} className="relative flex items-end gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about stocks, indicators, or portfolio advice..."
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-4 pr-12 py-4 font-medium focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="shrink-0 p-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:hover:bg-red-600 shadow-lg shadow-red-600/20"
            >
              <Send size={20} />
            </button>
          </form>
          <div className="text-center mt-3">
             <span className="text-[11px] text-zinc-400 font-medium">
               Scorcher AI can make mistakes. Consider verifying critical financial information before taking trades.
             </span>
          </div>
        </div>
      </div>

    </div>
  );
}