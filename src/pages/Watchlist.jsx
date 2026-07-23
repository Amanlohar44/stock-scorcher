import { useEffect, useState } from "react";
import {
  FaBookmark,
  FaTrash,
  FaNewspaper,
} from "react-icons/fa";

import {
  getWatchlist,
  removeFromWatchlist,
} from "../services/watchlist";

import MemberSidebar from "../components/member/MemberSidebar";
import MemberTopbar from "../components/member/MemberTopbar";

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    loadWatchlist();
  }, []);

  async function loadWatchlist() {
    try {
      setLoading(true);

      const data = await getWatchlist();

      setWatchlist(data || []);
    } catch (error) {
      console.error(
        "Watchlist Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(symbol) {
    try {
      setRemoving(symbol);

      const updated =
        await removeFromWatchlist(symbol);

      setWatchlist(updated || []);
    } catch (error) {
      console.error(
        "Remove Watchlist Error:",
        error
      );
    } finally {
      setRemoving(null);
    }
  }

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

            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-sm font-semibold text-yellow-400">

              <FaBookmark />

              Personal Watchlist

            </div>

            <h1 className="mt-5 text-3xl md:text-5xl font-black text-yellow-400">
              My Watchlist
            </h1>

            <p className="mt-3 text-gray-400 text-base md:text-lg">
              Monitor your favorite Stocks,
              Crypto, Forex and Index assets.
            </p>

          </div>


          {/* WATCHLIST COUNT */}

          <div className="mt-8">

            <div className="inline-flex items-center gap-3 rounded-2xl border border-yellow-500/20 bg-zinc-900 px-5 py-4">

              <FaBookmark className="text-yellow-400" />

              <div>

                <p className="text-sm text-gray-500">
                  Saved Assets
                </p>

                <p className="text-xl font-black">
                  {watchlist.length}
                </p>

              </div>

            </div>

          </div>


          {/* LOADING */}

          {loading && (

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

              {[1, 2, 3].map((item) => (

                <div
                  key={item}
                  className="h-48 rounded-3xl bg-zinc-900 animate-pulse"
                />

              ))}

            </div>

          )}


          {/* EMPTY */}

          {!loading &&
            watchlist.length === 0 && (

              <div className="mt-8 rounded-3xl border border-white/10 bg-zinc-900 p-10 text-center">

                <FaBookmark className="mx-auto text-5xl text-gray-600" />

                <h2 className="mt-5 text-2xl font-bold">
                  No Watchlist Yet
                </h2>

                <p className="mt-3 text-gray-400">
                  Add your favorite assets from
                  Stock Analysis to monitor them here.
                </p>

              </div>

            )}


          {/* WATCHLIST GRID */}

          {!loading &&
            watchlist.length > 0 && (

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {watchlist.map((item) => (

                  <div
                    key={item.symbol}
                    className="group rounded-3xl border border-yellow-500/20 bg-zinc-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400/50 hover:bg-yellow-400/5"
                  >

                    {/* TOP */}

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <h2 className="text-2xl font-black">
                          {item.symbol}
                        </h2>

                        <p className="mt-1 text-sm font-semibold text-yellow-400">
                          {item.market}
                        </p>

                      </div>

                      <FaBookmark className="text-xl text-yellow-400" />

                    </div>


                    {/* DATE */}

                    <div className="mt-6 rounded-2xl bg-black/30 p-4">

                      <p className="text-sm text-gray-500">
                        Added On
                      </p>

                      <p className="mt-2 font-semibold">
                        {item.addedAt
                          ? new Date(
                              item.addedAt
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "Recently Added"}
                      </p>

                    </div>


                    {/* REMOVE */}

                    <button
                      onClick={() =>
                        handleRemove(
                          item.symbol
                        )
                      }
                      disabled={
                        removing === item.symbol
                      }
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 font-semibold text-red-400 transition hover:bg-red-500 hover:text-white disabled:opacity-50"
                    >

                      <FaTrash />

                      {removing === item.symbol
                        ? "Removing..."
                        : "Remove from Watchlist"}

                    </button>

                  </div>

                ))}

              </div>

            )}

        </main>

      </div>

    </div>
  );
}