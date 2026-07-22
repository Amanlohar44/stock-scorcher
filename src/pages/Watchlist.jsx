import { useEffect, useState } from "react";
import {
  getWatchlist,
  removeFromWatchlist,
} from "../services/watchlist";

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWatchlist();
  }, []);

  async function loadWatchlist() {
    setLoading(true);

    const data = await getWatchlist();

    setWatchlist(data);

    setLoading(false);
  }

  async function handleRemove(symbol) {
    const updated =
      await removeFromWatchlist(symbol);

    setWatchlist(updated);
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">

      <h1 className="text-4xl font-black text-yellow-400">
        ⭐ My Watchlist
      </h1>

      <p className="text-gray-400 mt-2">
        Stocks • Crypto • Forex • Index
      </p>

      {loading ? (

        <div className="mt-10">
          Loading...
        </div>

      ) : watchlist.length === 0 ? (

        <div className="mt-10 bg-zinc-900 rounded-3xl p-10 text-center">

          <h2 className="text-2xl font-bold">
            No Watchlist Yet
          </h2>

          <p className="text-gray-400 mt-3">
            Add your favorite assets.
          </p>

        </div>

      ) : (

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">

          {watchlist.map((item) => (

            <div
              key={item.symbol}
              className="bg-zinc-900 border border-yellow-500/20 rounded-3xl p-6"
            >

              <div className="flex justify-between items-center">

                <div>

                  <h2 className="text-2xl font-bold">
                    {item.symbol}
                  </h2>

                  <p className="text-yellow-400 mt-1">
                    {item.market}
                  </p>

                </div>

                <button
                  onClick={() =>
                    handleRemove(item.symbol)
                  }
                  className="bg-red-500 hover:bg-red-400 px-4 py-2 rounded-xl"
                >
                  Remove
                </button>

              </div>

              <div className="mt-6">

                <p className="text-gray-400">
                  Added
                </p>

                <p className="mt-2">
                  {new Date(
                    item.addedAt
                  ).toLocaleDateString()}
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}