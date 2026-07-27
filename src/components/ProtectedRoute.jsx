import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-yellow-400 gap-4 selection:bg-yellow-400 selection:text-black">
        <div className="relative">
          <div className="absolute -inset-4 rounded-full bg-yellow-400/20 blur-xl animate-pulse" />
          <Loader2 className="relative h-10 w-10 animate-spin text-yellow-400" />
        </div>
        <p className="text-xs sm:text-sm font-black tracking-widest uppercase text-zinc-400 animate-pulse">
          Authenticating Session...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}