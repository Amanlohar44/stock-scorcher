import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState({});
  const [balance, setBalance] = useState(100000);
  const [loading, setLoading] = useState(true);

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

      const snap = await getDoc(doc(db, "users", user.uid));

      if (snap.exists()) {
        const data = snap.data();

        if (data.paperTrading) {
          setBalance(data.paperTrading.balance || 100000);
          setPortfolio(data.paperTrading.portfolio || {});
        }
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">

      <h1 className="text-4xl font-black text-yellow-400">
        Portfolio
      </h1>

      <p className="text-gray-400 mt-2">
        Your Paper Trading Holdings
      </p>

      <div className="mt-8 bg-zinc-900 rounded-3xl p-6 border border-yellow-500/20">

        <h2 className="text-xl font-bold">
          Virtual Balance
        </h2>

        <p className="text-4xl text-green-400 font-black mt-3">
          ₹{balance.toLocaleString()}
        </p>

      </div>

      <div className="mt-8">

        {loading ? (

          <p>Loading...</p>

        ) : Object.keys(portfolio).length === 0 ? (

          <div className="bg-zinc-900 rounded-3xl p-10 text-center">

            <h2 className="text-2xl font-bold">
              No Holdings
            </h2>

            <p className="text-gray-400 mt-3">
              Buy a stock to see it here.
            </p>

          </div>

        ) : (

          <div className="space-y-5">

            {Object.values(portfolio).map((item) => (

              <div
                key={item.symbol}
                className="bg-zinc-900 rounded-2xl p-6 border border-yellow-500/20 flex justify-between items-center"
              >

                <div>

                  <h2 className="text-2xl font-bold">
                    {item.symbol}
                  </h2>

                  <p className="text-gray-400">
                    {item.market}
                  </p>

                </div>

                <div className="text-right">

                  <p>
                    Qty :
                    <span className="text-yellow-400 font-bold">
                      {" "}
                      {item.quantity}
                    </span>
                  </p>

                  <p>
                    Buy :
                    <span className="text-green-400">
                      {" "}
                      ₹{item.buyPrice.toFixed(2)}
                    </span>
                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}