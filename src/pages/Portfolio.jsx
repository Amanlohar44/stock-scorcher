import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

import MemberSidebar from "../components/member/MemberSidebar";
import MemberTopbar from "../components/member/MemberTopbar";

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState({});
  const [balance, setBalance] = useState(100000);
  const [loading, setLoading] = useState(true);
  const [openSidebar, setOpenSidebar] = useState(false);

  useEffect(() => {
    loadPortfolio();
  }, []);

  async function loadPortfolio() {
    try {
      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      const snap = await getDoc(
        doc(db, "users", user.uid)
      );

      if (snap.exists()) {
        const data = snap.data();

        if (data.paperTrading) {
          setBalance(
            data.paperTrading.balance || 100000
          );

          setPortfolio(
            data.paperTrading.portfolio || {}
          );
        }
      }
    } catch (err) {
      console.error("Portfolio Error:", err);
    } finally {
      setLoading(false);
    }
  }

  const holdings = Object.values(portfolio);

  return (
    <div className="min-h-screen bg-black text-white flex overflow-x-hidden">

      {/* =========================
          SIDEBAR
      ========================= */}

      <MemberSidebar
        open={openSidebar}
        setOpen={setOpenSidebar}
      />

      {/* =========================
          MAIN
      ========================= */}

      <div className="flex-1 min-w-0 w-full">

        {/* TOPBAR */}

        <MemberTopbar
          toggleSidebar={() =>
            setOpenSidebar(true)
          }
        />

        {/* CONTENT */}

        <main className="p-4 sm:p-6 md:p-8">

          {/* HEADER */}

          <div>

            <div className="inline-flex items-center rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-sm font-semibold text-yellow-400">
              📊 Paper Trading Portfolio
            </div>

            <h1 className="mt-5 text-3xl md:text-5xl font-black text-yellow-400">
              My Portfolio
            </h1>

            <p className="mt-3 text-gray-400 text-base md:text-lg">
              Track your virtual holdings and paper
              trading balance.
            </p>

          </div>


          {/* BALANCE */}

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="rounded-3xl border border-yellow-500/20 bg-zinc-900 p-6">

              <p className="text-gray-400">
                Virtual Balance
              </p>

              <p className="mt-3 text-3xl md:text-4xl font-black text-green-400">
                ₹{balance.toLocaleString("en-IN")}
              </p>

            </div>


            <div className="rounded-3xl border border-yellow-500/20 bg-zinc-900 p-6">

              <p className="text-gray-400">
                Total Holdings
              </p>

              <p className="mt-3 text-3xl md:text-4xl font-black text-yellow-400">
                {holdings.length}
              </p>

            </div>

          </div>


          {/* HOLDINGS */}

          <div className="mt-10">

            <h2 className="text-2xl font-bold">
              Your Holdings
            </h2>

            <p className="mt-2 text-gray-400">
              Your current paper trading positions.
            </p>

          </div>


          {/* LOADING */}

          {loading && (

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">

              {[1, 2].map((item) => (

                <div
                  key={item}
                  className="h-40 rounded-3xl bg-zinc-900 animate-pulse"
                />

              ))}

            </div>

          )}


          {/* EMPTY */}

          {!loading &&
            holdings.length === 0 && (

              <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-900 p-10 text-center">

                <div className="text-5xl">
                  📊
                </div>

                <h2 className="mt-5 text-2xl font-bold">
                  No Holdings Yet
                </h2>

                <p className="mt-3 text-gray-400">
                  Your paper trading holdings will
                  appear here after you buy an asset.
                </p>

              </div>

            )}


          {/* HOLDINGS GRID */}

          {!loading &&
            holdings.length > 0 && (

              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">

                {holdings.map((item) => (

                  <div
                    key={item.symbol}
                    className="rounded-3xl border border-yellow-500/20 bg-zinc-900 p-6 transition hover:-translate-y-1 hover:border-yellow-400/50"
                  >

                    {/* TOP */}

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <h2 className="text-2xl font-black">
                          {item.symbol}
                        </h2>

                        <p className="mt-1 text-yellow-400">
                          {item.market}
                        </p>

                      </div>

                      <div className="rounded-xl bg-yellow-400/10 px-3 py-2 text-sm font-bold text-yellow-400">
                        HOLDING
                      </div>

                    </div>


                    {/* DETAILS */}

                    <div className="mt-6 grid grid-cols-2 gap-4">

                      <div className="rounded-2xl bg-black/30 p-4">

                        <p className="text-sm text-gray-500">
                          Quantity
                        </p>

                        <p className="mt-2 font-bold text-yellow-400">
                          {item.quantity}
                        </p>

                      </div>


                      <div className="rounded-2xl bg-black/30 p-4">

                        <p className="text-sm text-gray-500">
                          Buy Price
                        </p>

                        <p className="mt-2 font-bold text-green-400">
                          ₹
                          {Number(
                            item.buyPrice || 0
                          ).toFixed(2)}
                        </p>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

        </main>

      </div>

    </div>
  );
}