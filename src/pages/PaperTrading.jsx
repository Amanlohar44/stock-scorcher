import { useEffect, useState } from "react";
import {
  FaChartLine,
  FaWallet,
  FaArrowUp,
  FaArrowDown,
  FaSync,
} from "react-icons/fa";

import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { auth, db } from "../firebase";

import {
  getStockQuote,
} from "../services/finnhub";

import MemberSidebar from "../components/member/MemberSidebar";
import MemberTopbar from "../components/member/MemberTopbar";

export default function PaperTrading() {

  const [balance, setBalance] = useState(100000);

  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");

  const [holdings, setHoldings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchingPrice, setFetchingPrice] = useState(false);

  const [livePrice, setLivePrice] = useState(null);

  /* =========================
     LOAD FIREBASE DATA
  ========================= */

  useEffect(() => {

    const loadPaperTrading = async () => {

      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      try {

        const paperRef = doc(
          db,
          "paperTrading",
          user.uid
        );

        const paperSnap = await getDoc(paperRef);

        if (paperSnap.exists()) {

          const data = paperSnap.data();

          setBalance(
            data.balance ?? 100000
          );

          setHoldings(
            data.holdings ?? []
          );

        } else {

          await setDoc(
            paperRef,
            {
              uid: user.uid,
              email: user.email,
              balance: 100000,
              holdings: [],
              createdAt:
                new Date().toISOString(),
            }
          );

        }

      } catch (error) {

        console.error(
          "Paper Trading Load Error:",
          error
        );

        alert(
          "Failed to load paper trading data"
        );

      }

      setLoading(false);

    };

    loadPaperTrading();

  }, []);


  /* =========================
     SAVE FIREBASE DATA
  ========================= */

  const savePaperTrading = async (
    newBalance,
    newHoldings
  ) => {

    const user = auth.currentUser;

    if (!user) {
      alert("Please login first");
      return false;
    }

    try {

      setSaving(true);

      const paperRef = doc(
        db,
        "paperTrading",
        user.uid
      );

      await setDoc(
        paperRef,
        {
          uid: user.uid,
          email: user.email,
          balance: newBalance,
          holdings: newHoldings,
          updatedAt:
            new Date().toISOString(),
        },
        {
          merge: true,
        }
      );

      return true;

    } catch (error) {

      console.error(
        "Firebase Save Error:",
        error
      );

      alert(
        "Failed to save trading data"
      );

      return false;

    } finally {

      setSaving(false);

    }

  };


  /* =========================
     GET LIVE PRICE
  ========================= */

  const fetchLivePrice = async () => {

    if (!symbol.trim()) {

      alert(
        "Please enter stock symbol"
      );

      return;

    }

    try {

      setFetchingPrice(true);

      const data =
        await getStockQuote(
          symbol.toUpperCase()
        );

      if (
        !data.current ||
        data.current <= 0
      ) {

        alert(
          "Unable to find live price"
        );

        return;

      }

      setLivePrice(
        data.current
      );

    } catch (error) {

      console.error(error);

      alert(
        "Failed to fetch live stock price"
      );

    } finally {

      setFetchingPrice(false);

    }

  };


  /* =========================
     BUY STOCK
  ========================= */

  const handleBuy = async () => {

    if (
      !symbol ||
      !quantity
    ) {

      alert(
        "Please enter stock symbol and quantity"
      );

      return;

    }

    if (!livePrice) {

      alert(
        "Please fetch live price first"
      );

      return;

    }

    const buyQuantity =
      Number(quantity);

    if (
      buyQuantity <= 0
    ) {

      alert(
        "Quantity must be greater than 0"
      );

      return;

    }

    const totalCost =
      buyQuantity *
      livePrice;

    if (
      totalCost > balance
    ) {

      alert(
        "Insufficient Virtual Balance"
      );

      return;

    }

    const stockSymbol =
      symbol.toUpperCase();


    const existingHolding =
      holdings.find(
        (item) =>
          item.symbol ===
          stockSymbol
      );


    let updatedHoldings;


    if (existingHolding) {

      const oldInvestment =
        existingHolding.quantity *
        existingHolding.averageBuyPrice;


      const newQuantity =
        existingHolding.quantity +
        buyQuantity;


      const newAveragePrice =
        (
          oldInvestment +
          totalCost
        ) /
        newQuantity;


      updatedHoldings =
        holdings.map(
          (item) =>

            item.symbol ===
            stockSymbol

              ? {
                  ...item,

                  quantity:
                    newQuantity,

                  averageBuyPrice:
                    newAveragePrice,

                  currentPrice:
                    livePrice,
                }

              : item
        );

    } else {

      updatedHoldings = [

        ...holdings,

        {
          symbol:
            stockSymbol,

          quantity:
            buyQuantity,

          averageBuyPrice:
            livePrice,

          currentPrice:
            livePrice,
        },

      ];

    }


    const newBalance =
      balance -
      totalCost;


    setBalance(
      newBalance
    );

    setHoldings(
      updatedHoldings
    );


    const saved =
      await savePaperTrading(
        newBalance,
        updatedHoldings
      );


    if (saved) {

      alert(
        `✅ Bought ${buyQuantity} shares of ${stockSymbol}`
      );

      setSymbol("");

      setQuantity("");

      setLivePrice(null);

    }

  };


  /* =========================
     SELL STOCK
  ========================= */

  const handleSell = async () => {

    if (
      !symbol ||
      !quantity
    ) {

      alert(
        "Please enter stock symbol and quantity"
      );

      return;

    }

    if (!livePrice) {

      alert(
        "Please fetch live price first"
      );

      return;

    }


    const stockSymbol =
      symbol.toUpperCase();


    const sellQuantity =
      Number(quantity);


    const holdingIndex =
      holdings.findIndex(
        (item) =>
          item.symbol ===
          stockSymbol
      );


    if (
      holdingIndex === -1
    ) {

      alert(
        `You don't own any ${stockSymbol} shares`
      );

      return;

    }


    const holding =
      holdings[holdingIndex];


    if (
      sellQuantity <= 0
    ) {

      alert(
        "Quantity must be greater than 0"
      );

      return;

    }


    if (
      sellQuantity >
      holding.quantity
    ) {

      alert(
        `You only own ${holding.quantity} shares`
      );

      return;

    }


    const sellValue =
      sellQuantity *
      livePrice;


    const profitLoss =
      (
        livePrice -
        holding.averageBuyPrice
      ) *
      sellQuantity;


    let updatedHoldings;


    if (
      sellQuantity ===
      holding.quantity
    ) {

      updatedHoldings =
        holdings.filter(
          (_, index) =>
            index !==
            holdingIndex
        );

    } else {

      updatedHoldings =
        holdings.map(
          (item, index) =>

            index ===
            holdingIndex

              ? {
                  ...item,

                  quantity:
                    item.quantity -
                    sellQuantity,

                  currentPrice:
                    livePrice,
                }

              : item
        );

    }


    const newBalance =
      balance +
      sellValue;


    setBalance(
      newBalance
    );

    setHoldings(
      updatedHoldings
    );


    const saved =
      await savePaperTrading(
        newBalance,
        updatedHoldings
      );


    if (saved) {

      alert(
        `✅ Sold ${sellQuantity} ${stockSymbol} shares\nP&L: ₹${profitLoss.toFixed(2)}`
      );

      setSymbol("");

      setQuantity("");

      setLivePrice(null);

    }

  };


  /* =========================
     CALCULATE PORTFOLIO
  ========================= */

  const portfolioValue =
    holdings.reduce(
      (
        total,
        item
      ) =>

        total +
        (
          item.quantity *
          (
            item.currentPrice ||
            item.averageBuyPrice
          )
        ),

      0
    );


  const totalInvestment =
    holdings.reduce(
      (
        total,
        item
      ) =>

        total +
        (
          item.quantity *
          item.averageBuyPrice
        ),

      0
    );


  const totalProfitLoss =
    portfolioValue -
    totalInvestment;


  /* =========================
     REFRESH HOLDING PRICES
  ========================= */

  const refreshPrices = async () => {

    if (
      holdings.length === 0
    ) {

      alert(
        "No holdings to refresh"
      );

      return;

    }


    try {

      setFetchingPrice(true);


      const updatedHoldings =
        await Promise.all(

          holdings.map(
            async (item) => {

              try {

                const data =
                  await getStockQuote(
                    item.symbol
                  );

                return {

                  ...item,

                  currentPrice:
                    data.current,

                };

              } catch {

                return item;

              }

            }
          )

        );


      setHoldings(
        updatedHoldings
      );


      await savePaperTrading(
        balance,
        updatedHoldings
      );


      alert(
        "✅ Live prices updated"
      );

    } catch (error) {

      console.error(error);

      alert(
        "Failed to update prices"
      );

    } finally {

      setFetchingPrice(false);

    }

  };


  /* =========================
     LOADING
  ========================= */

  if (loading) {

    return (

      <div className="min-h-screen bg-black text-white flex items-center justify-center">

        <div className="text-center">

          <div className="h-12 w-12 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent mx-auto" />

          <p className="text-gray-400 mt-4">

            Loading Paper Trading...

          </p>

        </div>

      </div>

    );

  }


  /* =========================
     UI
  ========================= */

  return (

    <div className="min-h-screen bg-black text-white flex">


      <MemberSidebar />


      <div className="flex-1 min-w-0">


        <MemberTopbar />


        <main className="p-6 md:p-8">


          {/* HEADER */}

          <div className="mb-10">

            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-sm font-semibold text-yellow-400">

              📄 Paper Trading

            </div>


            <h1 className="mt-5 text-3xl md:text-5xl font-black">

              Practice Trading

            </h1>


            <p className="mt-3 text-gray-400 text-lg">

              Practice buying and selling stocks
              using virtual money.

            </p>

          </div>


          {/* STATS */}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">


            <div className="rounded-3xl border border-yellow-500/20 bg-zinc-900 p-6">

              <p className="text-gray-400">

                Available Balance

              </p>

              <h2 className="text-3xl font-black text-yellow-400 mt-2">

                ₹
                {balance.toLocaleString(
                  "en-IN"
                )}

              </h2>

            </div>


            <div className="rounded-3xl border border-yellow-500/20 bg-zinc-900 p-6">

              <p className="text-gray-400">

                Portfolio Value

              </p>

              <h2 className="text-3xl font-black text-white mt-2">

                ₹
                {portfolioValue.toLocaleString(
                  "en-IN",
                  {
                    maximumFractionDigits: 2,
                  }
                )}

              </h2>

            </div>


            <div className="rounded-3xl border border-yellow-500/20 bg-zinc-900 p-6">

              <p className="text-gray-400">

                Total Investment

              </p>

              <h2 className="text-3xl font-black text-white mt-2">

                ₹
                {totalInvestment.toLocaleString(
                  "en-IN",
                  {
                    maximumFractionDigits: 2,
                  }
                )}

              </h2>

            </div>


            <div className="rounded-3xl border border-yellow-500/20 bg-zinc-900 p-6">

              <p className="text-gray-400">

                Unrealized P&L

              </p>

              <h2
                className={`text-3xl font-black mt-2 ${
                  totalProfitLoss >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >

                {totalProfitLoss >= 0
                  ? "+"
                  : ""}

                ₹
                {totalProfitLoss.toLocaleString(
                  "en-IN",
                  {
                    maximumFractionDigits: 2,
                  }
                )}

              </h2>

            </div>

          </div>


          {/* TRADE PANEL */}

          <div className="mt-10 rounded-3xl border border-yellow-500/20 bg-zinc-900 p-6 md:p-8">


            <h2 className="text-2xl font-bold text-yellow-400">

              Execute Paper Trade

            </h2>


            <p className="text-gray-400 mt-2">

              Enter a stock symbol and quantity.
              Live price will be fetched automatically.

            </p>


            <div className="grid md:grid-cols-3 gap-5 mt-8">


              {/* SYMBOL */}

              <div>

                <label className="text-sm text-gray-400">

                  Stock Symbol

                </label>


                <input

                  value={symbol}

                  onChange={(e) => {

                    setSymbol(
                      e.target.value
                    );

                    setLivePrice(
                      null
                    );

                  }}

                  placeholder="Example: AAPL"

                  className="w-full mt-2 bg-black border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-yellow-400"

                />

              </div>


              {/* QUANTITY */}

              <div>

                <label className="text-sm text-gray-400">

                  Quantity

                </label>


                <input

                  type="number"

                  min="1"

                  value={quantity}

                  onChange={(e) =>
                    setQuantity(
                      e.target.value
                    )
                  }

                  placeholder="10"

                  className="w-full mt-2 bg-black border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-yellow-400"

                />

              </div>


              {/* LIVE PRICE */}

              <div>

                <label className="text-sm text-gray-400">

                  Live Price

                </label>


                <div className="flex gap-2 mt-2">


                  <div className="flex-1 bg-black border border-zinc-700 rounded-xl px-4 py-3 text-green-400 font-bold">

                    {livePrice
                      ? `₹${livePrice.toFixed(2)}`
                      : "Not Loaded"}

                  </div>


                  <button

                    onClick={
                      fetchLivePrice
                    }

                    disabled={
                      fetchingPrice
                    }

                    className="px-4 rounded-xl bg-yellow-400 text-black hover:bg-yellow-300 disabled:opacity-50"

                  >

                    <FaSync
                      className={
                        fetchingPrice
                          ? "animate-spin"
                          : ""
                      }
                    />

                  </button>


                </div>

              </div>


            </div>


            {/* BUY / SELL */}

            <div className="grid md:grid-cols-2 gap-4 mt-8">


              <button

                onClick={
                  handleBuy
                }

                disabled={
                  saving ||
                  fetchingPrice
                }

                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-bold py-4 rounded-xl transition"

              >

                <FaArrowUp />

                BUY STOCK

              </button>


              <button

                onClick={
                  handleSell
                }

                disabled={
                  saving ||
                  fetchingPrice
                }

                className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition"

              >

                <FaArrowDown />

                SELL STOCK

              </button>


            </div>


          </div>


          {/* HOLDINGS */}

          <div className="mt-10 rounded-3xl border border-yellow-500/20 bg-zinc-900 p-6 md:p-8">


            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">


              <h2 className="text-2xl font-bold text-yellow-400">

                My Holdings

              </h2>


              <button

                onClick={
                  refreshPrices
                }

                disabled={
                  fetchingPrice ||
                  holdings.length === 0
                }

                className="flex items-center justify-center gap-2 bg-yellow-400 text-black px-5 py-3 rounded-xl font-bold hover:bg-yellow-300 disabled:opacity-50"

              >

                <FaSync
                  className={
                    fetchingPrice
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh Prices

              </button>


            </div>


            {holdings.length === 0 ? (

              <div className="text-center py-12">

                <FaChartLine className="mx-auto text-5xl text-gray-700" />

                <p className="text-gray-500 mt-4">

                  No holdings yet.

                </p>

                <p className="text-gray-600 text-sm mt-2">

                  Buy your first stock to see it here.

                </p>

              </div>

            ) : (

              <div className="mt-6 space-y-4">


                {holdings.map(
                  (holding) => {

                    const currentPrice =
                      holding.currentPrice ||
                      holding.averageBuyPrice;


                    const investment =
                      holding.quantity *
                      holding.averageBuyPrice;


                    const currentValue =
                      holding.quantity *
                      currentPrice;


                    const pnl =
                      currentValue -
                      investment;


                    return (

                      <div

                        key={
                          holding.symbol
                        }

                        className="bg-black border border-zinc-800 rounded-2xl p-5"

                      >


                        <div className="grid md:grid-cols-6 gap-5 items-center">


                          <div>

                            <p className="text-gray-500 text-sm">

                              Stock

                            </p>

                            <h3 className="text-xl font-bold">

                              {holding.symbol}

                            </h3>

                          </div>


                          <div>

                            <p className="text-gray-500 text-sm">

                              Quantity

                            </p>

                            <p className="font-bold">

                              {holding.quantity}

                            </p>

                          </div>


                          <div>

                            <p className="text-gray-500 text-sm">

                              Avg Buy

                            </p>

                            <p className="font-bold">

                              ₹
                              {holding.averageBuyPrice.toFixed(
                                2
                              )}

                            </p>

                          </div>


                          <div>

                            <p className="text-gray-500 text-sm">

                              Current

                            </p>

                            <p className="font-bold text-yellow-400">

                              ₹
                              {currentPrice.toFixed(
                                2
                              )}

                            </p>

                          </div>


                          <div>

                            <p className="text-gray-500 text-sm">

                              P&L

                            </p>

                            <p
                              className={`font-bold ${
                                pnl >= 0
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >

                              {pnl >= 0
                                ? "+"
                                : ""}

                              ₹
                              {pnl.toFixed(
                                2
                              )}

                            </p>

                          </div>


                          <button

                            onClick={() => {

                              setSymbol(
                                holding.symbol
                              );

                              setQuantity(
                                holding.quantity
                              );

                              setLivePrice(
                                holding.currentPrice ||
                                holding.averageBuyPrice
                              );

                              window.scrollTo({
                                top: 0,
                                behavior:
                                  "smooth",
                              });

                            }}

                            className="bg-red-500 hover:bg-red-400 text-white font-bold py-3 rounded-xl"

                          >

                            Sell

                          </button>


                        </div>


                      </div>

                    );

                  }

                )}

              </div>

            )}

          </div>


        </main>

      </div>

    </div>

  );

}