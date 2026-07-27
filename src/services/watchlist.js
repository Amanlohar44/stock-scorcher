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
    console.error("Error fetching watchlist:", error);
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

  if (!item || !item.symbol || !item.market) {
    throw new Error("Invalid watchlist item provided");
  }

  const cleanSymbol = item.symbol.toUpperCase().trim();
  const cleanMarket = item.market.trim();

  try {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    let watchlist = [];

    if (snap.exists()) {
      watchlist = snap.data().watchlist || [];
    }

    // Duplicate check
    const exists = watchlist.find(
      (x) =>
        x.symbol === cleanSymbol &&
        x.market === cleanMarket
    );

    if (exists) {
      return watchlist;
    }

    watchlist.push({
      symbol: cleanSymbol,
      market: cleanMarket,
      name: item.name ? item.name.trim() : cleanSymbol,
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
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    throw error;
  }
}

// =========================
// REMOVE WATCHLIST
// =========================

export async function removeFromWatchlist(symbol) {
  const user = auth.currentUser;

  if (!user || !symbol) return [];

  const cleanSymbol = symbol.toUpperCase().trim();

  try {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) return [];

    const watchlist = (snap.data().watchlist || []).filter(
      (item) => item.symbol !== cleanSymbol
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
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    return [];
  }
}