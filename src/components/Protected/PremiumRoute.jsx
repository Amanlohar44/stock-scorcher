import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../../firebase";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import {
  onAuthStateChanged,
} from "firebase/auth";

export default function PremiumRoute({
  children,
}) {
  const [loading, setLoading] =
    useState(true);

  const [allowed, setAllowed] =
    useState(false);

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user) => {
          try {
            // -----------------------------
            // USER NOT LOGGED IN
            // -----------------------------

            if (!user) {
              setAllowed(false);
              setLoading(false);
              return;
            }

            // -----------------------------
            // GET MEMBERSHIP
            // -----------------------------

            const membershipRef =
              doc(
                db,
                "memberships",
                user.uid
              );

            const membershipSnap =
              await getDoc(
                membershipRef
              );

            // Membership document not found

            if (
              !membershipSnap.exists()
            ) {
              setAllowed(false);
              setLoading(false);
              return;
            }

            const data =
              membershipSnap.data();

            // -----------------------------
            // CHECK STATUS
            // -----------------------------

            if (
              data?.status !== "active"
            ) {
              setAllowed(false);
              setLoading(false);
              return;
            }

            // -----------------------------
            // CHECK EXPIRY
            // -----------------------------

            if (data?.expiryDate) {
              const expiryDate =
                new Date(
                  data.expiryDate
                );

              const now =
                new Date();

              // Membership expired

              if (
                expiryDate <= now
              ) {
                setAllowed(false);
                setLoading(false);
                return;
              }
            }

            // -----------------------------
            // MEMBERSHIP VALID
            // -----------------------------

            setAllowed(true);
            setLoading(false);

          } catch (error) {
            console.error(
              "Premium Route Error:",
              error
            );

            setAllowed(false);
            setLoading(false);
          }
        }
      );

    return unsubscribe;
  }, []);

  // -----------------------------
  // LOADING
  // -----------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">

        <div className="text-center">

          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-zinc-700 border-t-yellow-400" />

          <p className="text-yellow-400 font-semibold">
            Checking Membership...
          </p>

          <p className="text-gray-500 text-sm mt-2">
            Please wait
          </p>

        </div>

      </div>
    );
  }

  // -----------------------------
  // NOT LOGGED IN
  // -----------------------------

  if (!auth.currentUser) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // -----------------------------
  // NOT PREMIUM / EXPIRED
  // -----------------------------

  if (!allowed) {
    return (
      <Navigate
        to="/membership"
        replace
      />
    );
  }

  // -----------------------------
  // ACCESS GRANTED
  // -----------------------------

  return children;
}