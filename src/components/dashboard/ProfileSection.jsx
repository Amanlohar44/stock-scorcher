import { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaEnvelope,
  FaCrown,
  FaCalendarAlt,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";

import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function ProfileSection({ user }) {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    country: "India",
    state: "",
    city: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const uid = auth.currentUser.uid;

      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfile(docSnap.data());
      } else {
        setProfile({
          fullName: user?.displayName || "",
          phone: "",
          country: "India",
          state: "",
          city: "",
        });
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  const saveProfile = async () => {
    try {
      const uid = auth.currentUser.uid;

      await setDoc(doc(db, "users", uid), profile);

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
      <div className="text-center text-2xl py-20">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">

      {/* Header */}

      <div className="bg-zinc-900 rounded-2xl border border-yellow-500 p-8">

        <div className="flex flex-col md:flex-row items-center gap-8">

          <FaUserCircle className="text-9xl text-yellow-400" />

          <div className="flex-1">

            <h2 className="text-4xl font-bold">
              {profile.fullName || "Stock Scorcher User"}
            </h2>

            <p className="flex items-center gap-3 mt-4 text-gray-300">
              <FaEnvelope />
              {user?.email}
            </p>

            <p className="flex items-center gap-3 mt-3 text-yellow-400">
              <FaCrown />
              Premium Member
            </p>

            <p className="flex items-center gap-3 mt-3 text-gray-400">
              <FaCalendarAlt />
              Welcome to Stock Scorcher
            </p>

          </div>

        </div>

      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">

                {/* Personal Information */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-700 p-6">

          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-yellow-400">
              Personal Information
            </h3>

            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300"
              >
                <FaEdit className="inline mr-2" />
                Edit
              </button>
            ) : (
              <button
                onClick={() => setEditing(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                <FaTimes className="inline mr-2" />
                Cancel
              </button>
            )}
          </div>

          <div className="space-y-4">

            <div>
              <label className="text-gray-400">Full Name</label>

              {editing ? (
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  className="w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 outline-none"
                />
              ) : (
                <p className="mt-2">{profile.fullName || "-"}</p>
              )}
            </div>

            <div>
              <label className="text-gray-400">Phone</label>

              {editing ? (
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 outline-none"
                />
              ) : (
                <p className="mt-2 flex items-center gap-2">
                  <FaPhone className="text-yellow-400" />
                  {profile.phone || "Not Added"}
                </p>
              )}
            </div>

            <div>
              <label className="text-gray-400">Country</label>

              {editing ? (
                <input
                  type="text"
                  name="country"
                  value={profile.country}
                  onChange={handleChange}
                  className="w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 outline-none"
                />
              ) : (
                <p className="mt-2">{profile.country}</p>
              )}
            </div>

            <div>
              <label className="text-gray-400">State</label>

              {editing ? (
                <input
                  type="text"
                  name="state"
                  value={profile.state}
                  onChange={handleChange}
                  className="w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 outline-none"
                />
              ) : (
                <p className="mt-2">{profile.state || "-"}</p>
              )}
            </div>

            <div>
              <label className="text-gray-400">City</label>

              {editing ? (
                <input
                  type="text"
                  name="city"
                  value={profile.city}
                  onChange={handleChange}
                  className="w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 outline-none"
                />
              ) : (
                <p className="mt-2 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-yellow-400" />
                  {profile.city || "-"}
                </p>
              )}
            </div>

            {editing && (
              <button
                onClick={saveProfile}
                className="mt-6 bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-bold"
              >
                <FaSave className="inline mr-2" />
                Save Changes
              </button>
            )}

          </div>

        </div>

        {/* Learning Statistics */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-700 p-6">

          <h3 className="text-2xl font-bold text-yellow-400 mb-6">
            Learning Statistics
          </h3>

          <div className="grid grid-cols-2 gap-5">

            <div className="bg-zinc-800 rounded-xl p-5 text-center">
              <h2 className="text-4xl font-bold text-yellow-400">1</h2>
              <p className="text-gray-400 mt-2">Courses</p>
            </div>

            <div className="bg-zinc-800 rounded-xl p-5 text-center">
              <h2 className="text-4xl font-bold text-green-400">0</h2>
              <p className="text-gray-400 mt-2">Completed</p>
            </div>

            <div className="bg-zinc-800 rounded-xl p-5 text-center">
              <h2 className="text-4xl font-bold text-blue-400">84%</h2>
              <p className="text-gray-400 mt-2">Progress</p>
            </div>

            <div className="bg-zinc-800 rounded-xl p-5 text-center">
              <h2 className="text-4xl font-bold text-purple-400">0</h2>
              <p className="text-gray-400 mt-2">Certificates</p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}