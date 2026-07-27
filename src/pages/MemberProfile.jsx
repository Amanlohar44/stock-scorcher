import React, { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaEnvelope,
  FaCrown,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaShieldAlt,
  FaCamera,
  FaGlobe,
  FaLock,
  FaSync,
  FaCheckCircle,
  FaSignOutAlt,
} from "react-icons/fa";

import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import MemberSidebar from "../components/member/MemberSidebar";
import MemberTopbar from "../components/member/MemberTopbar";

export default function MemberProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const [membership, setMembership] = useState(null);

  // Profile Form States
  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    country: "India",
    state: "",
    city: "",
    photoURL: "",
  });

  // Password Change States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [updatingPass, setUpdatingPass] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }
      setUser(currentUser);
      await loadProfileData(currentUser);
    });
    return () => unsubscribe();
  }, [navigate]);

  const loadProfileData = async (currentUser) => {
    try {
      const uid = currentUser.uid;
      
      // 1. Fetch User Profile Doc
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfile({
          fullName: docSnap.data().fullName || currentUser.displayName || "",
          phone: docSnap.data().phone || "",
          country: docSnap.data().country || "India",
          state: docSnap.data().state || "",
          city: docSnap.data().city || "",
          photoURL: docSnap.data().photoURL || currentUser.photoURL || "",
        });
      } else {
        setProfile({
          fullName: currentUser.displayName || "",
          phone: "",
          country: "India",
          state: "",
          city: "",
          photoURL: currentUser.photoURL || "",
        });
      }

      // 2. Fetch Membership Doc
      const membershipRef = doc(db, "memberships", uid);
      const memberSnap = await getDoc(membershipRef);
      if (memberSnap.exists()) {
        setMembership(memberSnap.data());
      }
    } catch (err) {
      console.error("Error loading profile data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({
          ...prev,
          photoURL: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = async () => {
    try {
      if (!auth.currentUser) return;
      setSaving(true);
      const uid = auth.currentUser.uid;

      await setDoc(doc(db, "users", uid), profile, { merge: true });

      alert("✅ Profile Updated Successfully");
      setEditing(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      alert("Please fill in both password fields.");
      return;
    }

    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters long.");
      return;
    }

    try {
      setUpdatingPass(true);
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      alert("✅ Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      console.error("Password update error:", error);
      alert("Failed to update password. Check your current password.");
    } finally {
      setUpdatingPass(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-yellow-400 border-t-transparent"></div>
          <p className="text-yellow-400 text-xs font-bold tracking-wider uppercase animate-pulse">Loading Elite Profile...</p>
        </div>
      </div>
    );
  }

  const avatarImage = profile.photoURL || user?.photoURL;

  return (
    <div className="min-h-screen bg-black text-white flex overflow-x-hidden selection:bg-yellow-400 selection:text-black">
      <MemberSidebar open={openSidebar} setOpen={setOpenSidebar} />

      <div className="flex-1 min-w-0 w-full">
        <MemberTopbar toggleSidebar={() => setOpenSidebar(true)} />

        <main className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-black">My Profile & Settings</h1>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">
                Manage your VIP member credentials, billing status, and security preferences.
              </p>
            </div>
            <button
              onClick={() => navigate("/member-dashboard")}
              className="flex items-center justify-center gap-2 rounded-2xl border border-yellow-400/30 bg-yellow-400/10 px-5 py-3 font-bold text-yellow-400 text-xs transition hover:bg-yellow-400 hover:text-black cursor-pointer shadow-lg"
            >
              <FaGlobe />
              Back to VIP Dashboard
            </button>
          </div>

          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 w-full">

            {/* Header Profile Banner */}
            <div className="bg-[#060606] rounded-3xl border border-yellow-500/30 p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-yellow-400/5 blur-[100px] pointer-events-none"></div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative group">
                    {avatarImage ? (
                      <img 
                        src={avatarImage} 
                        alt="Profile" 
                        className="h-28 w-28 md:h-32 md:w-32 rounded-full object-cover border-2 border-yellow-400/50 shadow-xl shrink-0" 
                      />
                    ) : (
                      <FaUserCircle className="text-8xl md:text-9xl text-yellow-400 shrink-0 drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]" />
                    )}

                    {editing && (
                      <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                        <FaCamera className="text-yellow-400 text-xl mb-1" />
                        <span className="text-[10px] text-white font-bold">Change Photo</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload} 
                          className="hidden" 
                        />
                      </label>
                    )}
                  </div>

                  <div className="flex-1 text-center md:text-left space-y-2">
                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                      {profile.fullName || user?.displayName || "Stock Scorcher Trader"}
                    </h2>

                    <p className="flex items-center justify-center md:justify-start gap-2.5 text-zinc-300 text-sm font-light">
                      <FaEnvelope className="text-yellow-400" />
                      {user?.email}
                    </p>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-bold uppercase tracking-wider">
                        <FaCrown /> VIP Elite Member
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider">
                        <FaShieldAlt /> Verified Account
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/30 hover:bg-red-500 hover:text-black text-red-400 px-5 py-3 rounded-2xl font-bold text-xs transition cursor-pointer shrink-0 shadow-lg"
                >
                  <FaSignOutAlt /> Secure Logout
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">

              {/* Personal Information Form Section */}
              <div className="bg-[#060606] rounded-3xl border border-yellow-500/20 p-6 sm:p-8 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                    <h3 className="text-xl sm:text-2xl font-black text-yellow-400 tracking-wide">
                      Personal Information
                    </h3>

                    {!editing ? (
                      <button
                        onClick={() => setEditing(true)}
                        className="bg-yellow-400 text-black px-4 py-2 rounded-xl font-extrabold text-xs hover:bg-yellow-300 transition-all shadow-[0_0_15px_rgba(250,204,21,0.25)] cursor-pointer flex items-center gap-1.5 active:scale-95"
                      >
                        <FaEdit /> Edit Profile
                      </button>
                    ) : (
                      <button
                        onClick={() => setEditing(false)}
                        className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl font-bold text-xs hover:bg-red-500 hover:text-black transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                      >
                        <FaTimes /> Cancel
                      </button>
                    )}
                  </div>

                  <div className="space-y-4 text-xs sm:text-sm">
                    <div>
                      <label className="text-zinc-400 font-medium block mb-1">Full Name</label>
                      {editing ? (
                        <input
                          type="text"
                          name="fullName"
                          value={profile.fullName}
                          onChange={handleChange}
                          className="w-full bg-[#030303] border border-yellow-500/30 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-400 transition-all"
                        />
                      ) : (
                        <p className="p-3 bg-white/5 rounded-xl text-white font-semibold border border-white/5">{profile.fullName || "Not Added"}</p>
                      )}
                    </div>

                    {editing && (
                      <div>
                        <label className="text-zinc-400 font-medium block mb-1">Upload Profile Photo from Gallery</label>
                        <label className="flex items-center justify-center gap-2 w-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 py-3 rounded-xl cursor-pointer hover:bg-yellow-400/20 transition-all font-bold">
                          <FaCamera /> Choose Image from Device
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                      </div>
                    )}

                    <div>
                      <label className="text-zinc-400 font-medium block mb-1">Phone Number</label>
                      {editing ? (
                        <input
                          type="text"
                          name="phone"
                          value={profile.phone}
                          onChange={handleChange}
                          className="w-full bg-[#030303] border border-yellow-500/30 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-400 transition-all"
                        />
                      ) : (
                        <p className="p-3 bg-white/5 rounded-xl text-white font-semibold border border-white/5 flex items-center gap-2">
                          <FaPhone className="text-yellow-400 text-xs" />
                          {profile.phone || "Not Added"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-zinc-400 font-medium block mb-1">Country</label>
                      {editing ? (
                        <input
                          type="text"
                          name="country"
                          value={profile.country}
                          onChange={handleChange}
                          className="w-full bg-[#030303] border border-yellow-500/30 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-400 transition-all"
                        />
                      ) : (
                        <p className="p-3 bg-white/5 rounded-xl text-white font-semibold border border-white/5">{profile.country || "India"}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-zinc-400 font-medium block mb-1">State</label>
                        {editing ? (
                          <input
                            type="text"
                            name="state"
                            value={profile.state}
                            onChange={handleChange}
                            className="w-full bg-[#030303] border border-yellow-500/30 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-400 transition-all"
                          />
                        ) : (
                          <p className="p-3 bg-white/5 rounded-xl text-white font-semibold border border-white/5">{profile.state || "-"}</p>
                        )}
                      </div>

                      <div>
                        <label className="text-zinc-400 font-medium block mb-1">City</label>
                        {editing ? (
                          <input
                            type="text"
                            name="city"
                            value={profile.city}
                            onChange={handleChange}
                            className="w-full bg-[#030303] border border-yellow-500/30 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-400 transition-all"
                          />
                        ) : (
                          <p className="p-3 bg-white/5 rounded-xl text-white font-semibold border border-white/5 flex items-center gap-2">
                            <FaMapMarkerAlt className="text-yellow-400 text-xs" />
                            {profile.city || "-"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {editing && (
                  <button
                    onClick={saveProfile}
                    disabled={saving}
                    className="mt-8 w-full bg-green-500 text-black py-3.5 rounded-2xl font-extrabold text-xs hover:bg-green-400 transition-all shadow-[0_0_20px_rgba(34,197,94,0.25)] flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    <FaSave className={saving ? "animate-spin" : ""} />
                    {saving ? "Saving Changes..." : "Save Changes"}
                  </button>
                )}
              </div>

              {/* Membership Billing & Security Settings Section */}
              <div className="space-y-8 flex flex-col justify-between">
                
                {/* Billing Status Box */}
                <div className="bg-[#060606] rounded-3xl border border-yellow-500/20 p-6 sm:p-8 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <FaShieldAlt className="text-yellow-400" /> Membership & Billing
                    </h3>
                    <span className="text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full flex items-center gap-1">
                      <FaCheckCircle /> Active Status
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-black/60 p-4 rounded-2xl border border-white/5 space-y-1">
                      <p className="text-zinc-500 font-semibold uppercase">Current Tier</p>
                      <p className="font-black text-yellow-400">{membership?.plan || "StockScorcher Elite (₹9,999)"}</p>
                    </div>

                    <div className="bg-black/60 p-4 rounded-2xl border border-white/5 space-y-1">
                      <p className="text-zinc-500 font-semibold uppercase">Payment ID / Hash</p>
                      <p className="font-mono text-white truncate">{membership?.paymentId || "Gateway Provisioned"}</p>
                    </div>
                  </div>
                </div>

                {/* Password Update Box */}
                <div className="bg-[#060606] rounded-3xl border border-yellow-500/20 p-6 sm:p-8 shadow-xl space-y-4">
                  <h3 className="text-lg font-black text-white flex items-center gap-2 border-b border-white/10 pb-4">
                    <FaLock className="text-yellow-400" /> Security Settings
                  </h3>

                  <form onSubmit={handlePasswordUpdate} className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-zinc-400 font-semibold">Current Password</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-yellow-400 transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-zinc-400 font-semibold">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-yellow-400 transition"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={updatingPass}
                      className="w-full bg-yellow-400 text-black py-3 rounded-xl font-black text-xs hover:bg-yellow-300 transition cursor-pointer shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                    >
                      <FaSync className={updatingPass ? "animate-spin" : ""} /> Update Password
                    </button>
                  </form>
                </div>

              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}