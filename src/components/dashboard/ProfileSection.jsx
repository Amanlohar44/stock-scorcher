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
} from "react-icons/fa";

import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function ProfileSection({ user, progress = 0, completedLessons = [], modulesList = [] }) {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    country: "India",
    state: "",
    city: "",
    photoURL: "",
  });

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      if (!auth.currentUser) return;
      const uid = auth.currentUser.uid;

      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfile({
          fullName: docSnap.data().fullName || user?.displayName || "",
          phone: docSnap.data().phone || "",
          country: docSnap.data().country || "India",
          state: docSnap.data().state || "",
          city: docSnap.data().city || "",
          photoURL: docSnap.data().photoURL || user?.photoURL || "",
        });
      } else {
        setProfile({
          fullName: user?.displayName || "",
          phone: "",
          country: "India",
          state: "",
          city: "",
          photoURL: user?.photoURL || "",
        });
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  // Handle direct image upload from gallery/device
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
          photoURL: reader.result, // Base64 string for direct preview & saving
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = async () => {
    try {
      if (!auth.currentUser) return;
      const uid = auth.currentUser.uid;

      await setDoc(doc(db, "users", uid), profile, { merge: true });

      alert("✅ Profile Updated Successfully");
      setEditing(false);
    } catch (err) {
      alert(err.message);
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
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-yellow-400 border-t-transparent"></div>
        <p className="text-yellow-400 text-xs font-bold tracking-wider uppercase animate-pulse">Loading Profile...</p>
      </div>
    );
  }

  const avatarImage = profile.photoURL || user?.photoURL;
  const totalModules = modulesList.length > 0 ? modulesList.length : 1;
  const calculatedProgress = progress > 0 ? progress : Math.round((completedLessons.length / totalModules) * 100);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">

      {/* Header Profile Banner */}
      <div className="bg-[#060606] rounded-3xl border border-yellow-500/30 p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-yellow-400/5 blur-[100px] pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
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
                <FaCrown /> Pro Member
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider">
                <FaShieldAlt /> Verified Account
              </span>
            </div>
          </div>
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
              className="mt-8 w-full bg-green-500 text-black py-3.5 rounded-2xl font-extrabold text-xs hover:bg-green-400 transition-all shadow-[0_0_20px_rgba(34,197,94,0.25)] flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <FaSave /> Save Changes
            </button>
          )}

        </div>

        {/* Fully Automated Learning Statistics Section */}
        <div className="bg-[#060606] rounded-3xl border border-yellow-500/20 p-6 sm:p-8 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-yellow-400 mb-6 pb-4 border-b border-white/10 tracking-wide">
              Learning Statistics
            </h3>

            <div className="grid grid-cols-2 gap-5">

              <div className="bg-[#030303] border border-white/5 rounded-2xl p-6 text-center shadow-md">
                <span className="text-3xl sm:text-4xl font-black text-yellow-400 block">{modulesList.length > 0 ? modulesList.length : 1}</span>
                <span className="text-zinc-400 text-xs font-light mt-2 block uppercase tracking-wider">Courses Enrolled</span>
              </div>

              <div className="bg-[#030303] border border-white/5 rounded-2xl p-6 text-center shadow-md">
                <span className="text-3xl sm:text-4xl font-black text-green-400 block">{completedLessons.length}</span>
                <span className="text-zinc-400 text-xs font-light mt-2 block uppercase tracking-wider">Completed Lessons</span>
              </div>

              <div className="bg-[#030303] border border-white/5 rounded-2xl p-6 text-center shadow-md">
                <span className="text-3xl sm:text-4xl font-black text-blue-400 block">{calculatedProgress}%</span>
                <span className="text-zinc-400 text-xs font-light mt-2 block uppercase tracking-wider">Total Progress</span>
              </div>

              <div className="bg-[#060606] border border-purple-500/30 rounded-2xl p-6 text-center shadow-md">
                <span className="text-3xl sm:text-4xl font-black text-purple-400 block">👑</span>
                <span className="text-purple-300 text-xs font-bold mt-2 block uppercase tracking-wider">VIP Access</span>
              </div>

            </div>
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-yellow-400/5 border border-yellow-400/10 text-center">
            <p className="text-xs text-zinc-300">
              Need help updating your account details or resetting your password? <span className="text-yellow-400 font-bold cursor-pointer hover:underline">Contact Support</span>
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}