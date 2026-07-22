import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

// =========================
// GET WATCHLIST
// =========================

export async function getWatchlist() {
  const user = auth.currentUser;

  if (!user) return [];

  try {
    const userRef = doc(db, "users", user.uid);

    const snap = await getDoc(userRef);

    if (!snap.exists()) return [];

    return snap.data().watchlist || [];

  } catch (error) {
    console.log(error);
    return [];
  }
}

// =========================
// ADD WATCHLIST
// =========================

export async function addToWatchlist(item) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please login first");
  }

  const userRef = doc(db, "users", user.uid);

  const snap = await getDoc(userRef);

  let watchlist = [];

  if (snap.exists()) {
    watchlist = snap.data().watchlist || [];
  }

  // Duplicate check
  const exists = watchlist.find(
    (x) =>
      x.symbol === item.symbol &&
      x.market === item.market
  );

  if (exists) {
    return watchlist;
  }

  watchlist.push({
    symbol: item.symbol,
    market: item.market,
    name: item.name || item.symbol,
    addedAt: new Date().toISOString(),
  });

  await setDoc(
    userRef,
    {
      watchlist,
    },
    {
      merge: true,
    }
  );

  return watchlist;
}

// =========================
// REMOVE WATCHLIST
// =========================

export async function removeFromWatchlist(
  symbol
) {
  const user = auth.currentUser;

  if (!user) return [];

  const userRef = doc(db, "users", user.uid);

  const snap = await getDoc(userRef);

  if (!snap.exists()) return [];

  const watchlist =
    (snap.data().watchlist || []).filter(
      (item) => item.symbol !== symbol
    );

  await setDoc(
    userRef,
    {
      watchlist,
    },
    {
      merge: true,
    }
  );

  return watchlist;
}