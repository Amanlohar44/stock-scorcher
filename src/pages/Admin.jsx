import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

export default function Admin() {
  const handleLogout = async () => {
  await signOut(auth);
  navigate("/login");
};
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [video, setVideo] = useState("");
  const [pdf, setPdf] = useState("");

  const [modules, setModules] = useState([]);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const [totalRevenue, setTotalRevenue] = useState(0);

  const [editingId, setEditingId] = useState(null);

const [editTitle, setEditTitle] = useState("");

const [editVideo, setEditVideo] = useState("");

const [editPdf, setEditPdf] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      if (user.email !== "stockscorcher@gmail.com") {
        alert("⛔ Access Denied");
        navigate("/dashboard");
        return;
      }

      await loadDashboard();

      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const loadDashboard = async () => {
    try {
      // Modules
      const moduleSnapshot = await getDocs(collection(db, "modules"));

      const moduleData = moduleSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      

      setModules(moduleData);

      // Purchases
      const purchaseSnapshot = await getDocs(collection(db, "purchases"));

      const purchaseData = purchaseSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setStudents(purchaseData);

      let revenue = 0;

      purchaseData.forEach((item) => {
        revenue += Number(item.course || 0);
      });

      setTotalRevenue(revenue);
    } catch (err) {
      console.log(err);
    }
  };  
  
  const handleAddModule = async () => {
    if (!title || !video) {
      alert("Please fill Module Title and Video Link");
      return;
    }

    let videoLink = video;

    if (video.includes("watch?v=")) {
      const videoId = video.split("watch?v=")[1].split("&")[0];
      videoLink = `https://www.youtube.com/embed/${videoId}`;
    } else if (video.includes("youtu.be/")) {
      const videoId = video.split("youtu.be/")[1].split("?")[0];
      videoLink = `https://www.youtube.com/embed/${videoId}`;
    }

    try {
      await addDoc(collection(db, "modules"), {
        title,
        video: videoLink,
        pdf,
        createdAt: new Date(),
      });

      alert("✅ Module Added Successfully");

      setTitle("");
      setVideo("");
      setPdf("");

      loadDashboard();
    } catch (err) {
      console.log(err);
      alert("❌ Error adding module");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this module?")) return;

    try {
      await deleteDoc(doc(db, "modules", id));

      alert("✅ Module Deleted");

      loadDashboard();
    } catch (err) {
      console.log(err);
      alert("❌ Error deleting module");
    }
  };

  const handleEdit = async () => {
  if (!editTitle || !editVideo) {
    alert("Please fill all required fields");
    return;
  }

  let videoLink = editVideo;

  if (editVideo.includes("watch?v=")) {
    const id = editVideo.split("watch?v=")[1].split("&")[0];
    videoLink = `https://www.youtube.com/embed/${id}`;
  } else if (editVideo.includes("youtu.be/")) {
    const id = editVideo.split("youtu.be/")[1].split("?")[0];
    videoLink = `https://www.youtube.com/embed/${id}`;
  }

  try {
    await updateDoc(doc(db, "modules", editingId), {
      title: editTitle,
      video: videoLink,
      pdf: editPdf,
    });

    alert("✅ Module Updated");

    setEditingId(null);
    setEditTitle("");
    setEditVideo("");
    setEditPdf("");

    loadDashboard();
  } catch (err) {
    console.log(err);
    alert("❌ Update Failed");
  }
};


  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-3xl">
        Loading Admin Panel...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">

      <div className="flex justify-between items-center mb-8">
  <h1 className="text-5xl font-bold text-yellow-400">
    👑 Admin Dashboard
  </h1>

  <button
    onClick={handleLogout}
    className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl font-bold"
  >
    Logout
  </button>
</div>
    

      {/* Statistics */}

      <div className="grid md:grid-cols-4 gap-6 mb-10">

        <div className="bg-zinc-900 border border-yellow-500 rounded-xl p-6 text-center">
          <h2 className="text-gray-400">Students</h2>

          <p className="text-4xl font-bold text-yellow-400 mt-3">
            {students.length}
          </p>
        </div>

        <div className="bg-zinc-900 border border-yellow-500 rounded-xl p-6 text-center">
          <h2 className="text-gray-400">Revenue</h2>

          <p className="text-4xl font-bold text-green-400 mt-3">
            ₹{totalRevenue}
          </p>
        </div>

        <div className="bg-zinc-900 border border-yellow-500 rounded-xl p-6 text-center">
          <h2 className="text-gray-400">Modules</h2>

          <p className="text-4xl font-bold text-yellow-400 mt-3">
            {modules.length}
          </p>
        </div>

        <div className="bg-zinc-900 border border-yellow-500 rounded-xl p-6 text-center">
          <h2 className="text-gray-400">Payments</h2>

          <p className="text-4xl font-bold text-green-400 mt-3">
            {
              students.filter(
                (s) => s.paymentStatus === "paid"
              ).length
            }
          </p>
        </div>

      </div>

            {/* Add Module */}

      <div className="bg-zinc-900 border border-yellow-500 rounded-2xl p-8 mb-10">

        <h2 className="text-3xl font-bold text-yellow-400 mb-6">
          ➕ Add New Module
        </h2>

        <div className="space-y-5">

          <input
            type="text"
            placeholder="Module Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-black border border-yellow-500 rounded-xl p-4"
          />

          <input
            type="text"
            placeholder="YouTube Video Link"
            value={video}
            onChange={(e) => setVideo(e.target.value)}
            className="w-full bg-black border border-yellow-500 rounded-xl p-4"
          />

          <input
            type="text"
            placeholder="PDF Link (Optional)"
            value={pdf}
            onChange={(e) => setPdf(e.target.value)}
            className="w-full bg-black border border-yellow-500 rounded-xl p-4"
          />

          <button
            onClick={handleAddModule}
            className="w-full bg-yellow-400 text-black py-4 rounded-xl font-bold hover:bg-yellow-300 transition"
          >
            ➕ Add Module
          </button>

        </div>

      </div>

      {/* Module List */}

      <div className="bg-zinc-900 border border-yellow-500 rounded-2xl p-8 mb-10">

        <h2 className="text-3xl font-bold text-yellow-400 mb-6">
          📚 All Modules
        </h2>

        <div className="space-y-4">

          {modules.length === 0 ? (

            <p className="text-gray-400">
              No Modules Added Yet
            </p>

          ) : (

            modules.map((module) => (
  <div
    key={module.id}
    className="bg-black border border-yellow-500 rounded-xl p-5"
  >

    {editingId === module.id ? (

      <div className="space-y-4">

        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full bg-zinc-900 border border-yellow-500 rounded-lg p-3"
        />

        <input
          type="text"
          value={editVideo}
          onChange={(e) => setEditVideo(e.target.value)}
          className="w-full bg-zinc-900 border border-yellow-500 rounded-lg p-3"
        />

        <input
          type="text"
          value={editPdf}
          onChange={(e) => setEditPdf(e.target.value)}
          className="w-full bg-zinc-900 border border-yellow-500 rounded-lg p-3"
        />

        <div className="flex gap-3">

          <button
            onClick={handleEdit}
            className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-lg font-bold"
          >
            💾 Save
          </button>

          <button
            onClick={() => {
              setEditingId(null);
              setEditTitle("");
              setEditVideo("");
              setEditPdf("");
            }}
            className="bg-gray-600 hover:bg-gray-700 px-5 py-2 rounded-lg font-bold"
          >
            Cancel
          </button>

        </div>

      </div>

    ) : (

      <div className="flex justify-between items-center">

        <div>

          <h3 className="text-xl font-bold">
            {module.title}
          </h3>

          <p className="text-gray-400 break-all mt-2">
            {module.video}
          </p>

          {module.pdf && (
            <p className="text-green-400 mt-2 break-all">
              📄 {module.pdf}
            </p>
          )}

        </div>

        <div className="flex gap-3">

          <button
            onClick={() => {
              setEditingId(module.id);
              setEditTitle(module.title);
              setEditVideo(module.video);
              setEditPdf(module.pdf || "");
            }}
            className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg font-bold"
          >
            ✏ Edit
          </button>

          <button
            onClick={() => handleDelete(module.id)}
            className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg font-bold"
          >
            Delete
          </button>

        </div>

      </div>

    )}

  </div>
))
          )}

        </div>

      </div>

            {/* Students */}

      <div className="bg-zinc-900 border border-yellow-500 rounded-2xl p-8">

        <h2 className="text-3xl font-bold text-yellow-400 mb-6">
          👨‍🎓 Purchased Students
        </h2>

         <div className="mb-6">
  <input
    type="text"
    placeholder="🔍 Search student by email..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full bg-black border border-yellow-500 rounded-xl p-4"
  />
</div>

        <div className="overflow-x-auto">

          <table className="w-full border-collapse">

            <thead>

              <tr className="bg-yellow-400 text-black">

                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-center">Course</th>
                <th className="p-3 text-center">Payment</th>
                <th className="p-3 text-center">Payment ID</th>
                <th className="p-3 text-center">Purchased At</th>

              </tr>

            </thead>

            <tbody>

              {students.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    className="text-center py-8 text-gray-400"
                  >
                    No Purchases Yet
                  </td>

                </tr>

              ) : (

                students
  .filter((student) =>
    student.email?.toLowerCase().includes(search.toLowerCase())
  )
  .map((student) => (

                  <tr
                    key={student.id}
                    className="border-b border-zinc-700 hover:bg-zinc-800"
                  >

                    <td className="p-4">
                      {student.email}
                    </td>

                    <td className="text-center">
                      ₹{student.course}
                    </td>

                    <td className="text-center">

                      <span className="bg-green-600 px-3 py-1 rounded-full text-sm">
                        {student.paymentStatus}
                      </span>

                    </td>

                    <td className="text-center text-xs">
                      {student.paymentId}
                    </td>

                    <td className="text-center text-sm">
                      {student.purchasedAt
  ? new Date(student.purchasedAt).toLocaleDateString()
  : "-"}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

         
         
               </div>

      </div>

    </div>
  );
}