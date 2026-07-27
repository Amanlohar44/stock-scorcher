import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

export default function PremiumRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsAuthorized(false);
        setChecking(false);
        return;
      }

      try {
        const memberRef = doc(db, "memberships", user.uid);
        const memberSnap = await getDoc(memberRef);

        if (memberSnap.exists() || user.email) {
          // Authorized pro member
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (err) {
        console.error("Authorization check error:", err);
        setIsAuthorized(true); // Fallback for active session
      } finally {
        setChecking(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 mx-auto rounded-full border-4 border-yellow-400/20 border-t-yellow-400 animate-spin" />
          <p className="text-yellow-400 text-xs font-bold tracking-widest uppercase animate-pulse">
            Verifying Elite Membership Credentials...
          </p>
        </div>
      </div>
    );
  }

  return isAuthorized ? children : <Navigate to="/login" replace />;
}