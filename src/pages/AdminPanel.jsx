import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";

export default function AdminPanel() {
  const [isAdmin, setIsAdmin] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      // 👇 Yahan apna email likho
      if (user.email !== "loharaman44@gmail.com") {
        setIsAdmin(false);
        return;
      }

      setIsAdmin(true);

      const snapshot = await getDocs(collection(db, "purchases"));

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(data);
    });
  }, []);

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  const totalRevenue = users.reduce(
    (sum, user) => sum + (user.course || 0),
    0
  );

  return (
    <div className="min-h-screen bg-black text-white p-8">

      <h1 className="text-4xl font-bold text-yellow-400 mb-8">
        Admin Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6 mb-10">

        <div className="bg-zinc-900 p-6 rounded-xl">
          <h2 className="text-xl">Total Purchases</h2>
          <p className="text-4xl font-bold text-yellow-400">
            {users.length}
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl">
          <h2 className="text-xl">Revenue</h2>
          <p className="text-4xl font-bold text-green-400">
            ₹{totalRevenue}
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl">
          <h2 className="text-xl">Customers</h2>
          <p className="text-4xl font-bold text-blue-400">
            {users.length}
          </p>
        </div>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full border border-yellow-500">

          <thead className="bg-yellow-400 text-black">

            <tr>
              <th className="p-3">Email</th>
              <th className="p-3">Course</th>
              <th className="p-3">Payment ID</th>
              <th className="p-3">Date</th>
            </tr>

          </thead>

          <tbody>

            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-zinc-700 text-center"
              >
                <td className="p-3">{user.email}</td>
                <td className="p-3">₹{user.course}</td>
                <td className="p-3">{user.paymentId}</td>
                <td className="p-3">
                  {new Date(user.purchasedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}