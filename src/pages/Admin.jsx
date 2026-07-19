import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { auth, db } from "../firebase";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminTopbar from "../components/admin/AdminTopbar";
import StatsCards from "../components/admin/StatsCards";
import DashboardCharts from "../components/admin/DashboardCharts";
import RecentPayments from "../components/admin/RecentPayments";
import RecentActivity from "../components/admin/RecentActivity";
import AddModule from "../components/admin/AddModule";
import ModuleList from "../components/admin/ModuleList";
import StudentTable from "../components/admin/StudentTable";

export default function Admin() {

const navigate = useNavigate();

const [loading, setLoading] = useState(true);

const [active, setActive] = useState("dashboard");

const [modules, setModules] = useState([]);

const [students, setStudents] = useState([]);

const [title, setTitle] = useState("");

const [day, setDay] = useState("");

const [video, setVideo] = useState("");

const [pdf, setPdf] = useState("");

const [editingId, setEditingId] = useState(null);

const [editTitle, setEditTitle] = useState("");

const [editVideo, setEditVideo] = useState("");

const [editPdf, setEditPdf] = useState("");

const [editDay, setEditDay] = useState("");

const [search, setSearch] = useState("");

const [totalRevenue, setTotalRevenue] = useState(0);

const handleLogout = async () => {

await signOut(auth);

navigate("/login");

};

useEffect(() => {

const unsubscribe = onAuthStateChanged(auth, async (user) => {

if (!user) {

navigate("/login");

return;

}

if (user.email !== "stockscorcher@gmail.com") {

alert("Access Denied");

navigate("/dashboard");

return;

}

await loadDashboard();

setLoading(false);

});

return () => unsubscribe();

}, []);

const loadDashboard = async () => {

try {

const moduleSnapshot = await getDocs(collection(db, "modules"));

const moduleData = moduleSnapshot.docs.map((doc) => ({

id: doc.id,

...doc.data(),

}));

moduleData.sort((a, b) => {

if (a.day !== b.day) return a.day - b.day;

return a.title.localeCompare(b.title, undefined, {

numeric: true,

sensitivity: "base",

});

});

setModules(moduleData);

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

if (!title || !video || !day) {

alert("Please fill all fields");

return;

}

let videoLink = video;

if (video.includes("watch?v=")) {

const id = video.split("watch?v=")[1].split("&")[0];

videoLink = `https://www.youtube.com/embed/${id}`;

}

else if (video.includes("youtu.be/")) {

const id = video.split("youtu.be/")[1].split("?")[0];

videoLink = `https://www.youtube.com/embed/${id}`;

}

await addDoc(collection(db, "modules"), {

day: Number(day),

title,

video: videoLink,

pdf,

createdAt: new Date(),

});

setDay("");

setTitle("");

setVideo("");

setPdf("");

loadDashboard();

};

const handleDelete = async (id) => {

if (!window.confirm("Delete Module?")) return;

await deleteDoc(doc(db, "modules", id));

loadDashboard();

};

const handleEdit = async () => {

let videoLink = editVideo;

if (editVideo.includes("watch?v=")) {

const id = editVideo.split("watch?v=")[1].split("&")[0];

videoLink = `https://www.youtube.com/embed/${id}`;

}

else if (editVideo.includes("youtu.be/")) {

const id = editVideo.split("youtu.be/")[1].split("?")[0];

videoLink = `https://www.youtube.com/embed/${id}`;

}

await updateDoc(doc(db, "modules", editingId), {

day: Number(editDay),

title: editTitle,

video: videoLink,

pdf: editPdf,

});

setEditingId(null);

setEditTitle("");

setEditVideo("");

setEditPdf("");

setEditDay("");

loadDashboard();

};
if (loading) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white text-3xl">
      Loading Admin Panel...
    </div>
  );
}

return (
  <div className="min-h-screen bg-black text-white flex">

    {/* Sidebar */}

    <AdminSidebar
      active={active}
      setActive={setActive}
      handleLogout={handleLogout}
    />

    {/* Right Side */}

    <div className="flex-1">

      <AdminTopbar
        user={auth.currentUser}
        handleLogout={handleLogout}
      />

      <div className="p-6 lg:p-8">

        {/* Dashboard */}

        {active === "dashboard" && (

          <>

            <StatsCards
              students={students}
              modules={modules}
              totalRevenue={totalRevenue}
            />

            <DashboardCharts
              students={students}
              modules={modules}
              totalRevenue={totalRevenue}
            />

            <div className="grid lg:grid-cols-2 gap-6 mb-10">

              <RecentPayments
                students={students}
              />

              <RecentActivity
                students={students}
                modules={modules}
              />

            </div>

          </>

        )}

        {/* Modules */}

        {active === "modules" && (

          <>
                      <AddModule
              day={day}
              setDay={setDay}
              title={title}
              setTitle={setTitle}
              video={video}
              setVideo={setVideo}
              pdf={pdf}
              setPdf={setPdf}
              handleAddModule={handleAddModule}
            />

            <div className="mt-10">

              <ModuleList
                modules={modules}
                editingId={editingId}
                setEditingId={setEditingId}

                editTitle={editTitle}
                setEditTitle={setEditTitle}

                editVideo={editVideo}
                setEditVideo={setEditVideo}

                editPdf={editPdf}
                setEditPdf={setEditPdf}

                editDay={editDay}
                setEditDay={setEditDay}

                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />

            </div>

          </>

        )}

        {/* Students */}

        {active === "students" && (

          <StudentTable
            students={students}
            search={search}
            setSearch={setSearch}
          />

        )}

        {/* Payments */}

        {active === "payments" && (

          <RecentPayments
            students={students}
          />

        )}

        {/* Analytics */}

        {active === "analytics" && (

          <DashboardCharts
            students={students}
            modules={modules}
            totalRevenue={totalRevenue}
          />

        )}

        {/* Settings */}

        {active === "settings" && (

          <div className="bg-zinc-900 border border-yellow-500 rounded-2xl p-8">

            <h2 className="text-3xl font-bold text-yellow-400 mb-5">
              ⚙ Admin Settings
            </h2>

            <p className="text-gray-400">
              More settings will be added here...
            </p>

          </div>

        )}

      </div>

    </div>

  </div>

);

}