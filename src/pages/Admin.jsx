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

import CouponManager from "../components/admin/CouponManager";

export default function Admin() {

const navigate = useNavigate();

const [loading,setLoading]=useState(true);

const [active,setActive]=useState("dashboard");

const [mobileOpen,setMobileOpen]=useState(false);

const [modules,setModules]=useState([]);

const [students,setStudents]=useState([]);

const [coupons,setCoupons]=useState([]);

const [totalRevenue,setTotalRevenue]=useState(0);

const [search,setSearch]=useState("");

const [title,setTitle]=useState("");

const [day,setDay]=useState("");

const [video,setVideo]=useState("");

const [pdf,setPdf]=useState("");

const [editingId,setEditingId]=useState(null);

const [editTitle,setEditTitle]=useState("");

const [editVideo,setEditVideo]=useState("");

const [editPdf,setEditPdf]=useState("");

const [editDay,setEditDay]=useState("");

// Coupon Form

const [couponCode,setCouponCode]=useState("");

const [couponType,setCouponType]=useState("percentage");

const [couponDiscount,setCouponDiscount]=useState("");

const [couponMinAmount,setCouponMinAmount]=useState("");

const [couponMaxUses,setCouponMaxUses]=useState("");

const [couponExpiry,setCouponExpiry]=useState("");

const [couponStatus,setCouponStatus]=useState(true);

const handleLogout = async()=>{

await signOut(auth);

navigate("/login");

};

useEffect(()=>{

const unsubscribe=onAuthStateChanged(auth,async(user)=>{

if(!user){

navigate("/login");

return;

}

if(user.email!=="stockscorcher@gmail.com"){

alert("Access Denied");

navigate("/dashboard");

return;

}

await loadDashboard();

setLoading(false);

});

return ()=>unsubscribe();

},[]);

const loadDashboard=async()=>{

try{

// Modules

const moduleSnapshot=await getDocs(collection(db,"modules"));

const moduleData=moduleSnapshot.docs.map(doc=>({

id:doc.id,

...doc.data(),

}));

moduleData.sort((a,b)=>{

if(a.day!==b.day){

return a.day-b.day;

}

return a.title.localeCompare(b.title);

});

setModules(moduleData);

// Purchases

const purchaseSnapshot=await getDocs(collection(db,"purchases"));

const purchaseData=purchaseSnapshot.docs.map(doc=>({

id:doc.id,

...doc.data(),

}));

setStudents(purchaseData);

let revenue=0;

purchaseData.forEach(item=>{

revenue+=Number(item.course||0);

});

setTotalRevenue(revenue);

// Coupons

const couponSnapshot=await getDocs(collection(db,"coupons"));

const couponData=couponSnapshot.docs.map(doc=>({

id:doc.id,

...doc.data(),

}));

setCoupons(couponData);

}catch(err){
  
console.log(err);

}

};
// ===========================
// ADD MODULE
// ===========================

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

// ===========================
// DELETE MODULE
// ===========================

const handleDelete = async (id) => {

  if (!window.confirm("Delete Module?")) return;

  await deleteDoc(doc(db, "modules", id));

  loadDashboard();

};

// ===========================
// EDIT MODULE
// ===========================

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

  await updateDoc(

    doc(db, "modules", editingId),

    {

      day: Number(editDay),

      title: editTitle,

      video: videoLink,

      pdf: editPdf,

    }

  );

  setEditingId(null);

  setEditTitle("");

  setEditVideo("");

  setEditPdf("");

  setEditDay("");

  loadDashboard();

};

// ===========================
// ADD COUPON
// ===========================

const handleAddCoupon = async () => {

  try {

    console.log("Add Coupon Clicked");

    if (
      !couponCode ||
      !couponDiscount ||
      !couponExpiry
    ) {
      alert("Fill all required fields");
      return;
    }

    await addDoc(collection(db, "coupons"), {

      code: couponCode.toUpperCase(),

      type: couponType,

      discount: Number(couponDiscount),

      minAmount: Number(couponMinAmount || 0),

      maxUses: Number(couponMaxUses || 0),

      usedCount: 0,

      expiryDate: couponExpiry,

      active: couponStatus,

      createdAt: new Date(),

    });

    console.log("Coupon Added Successfully");

    alert("Coupon Added");

    setCouponCode("");

    setCouponDiscount("");

    setCouponMinAmount("");

    setCouponMaxUses("");

    setCouponExpiry("");

    setCouponStatus(true);

    loadDashboard();

  } catch (err) {

    console.log(err);

    alert(err.message);

  }

};

// ===========================
// DELETE COUPON
// ===========================

const handleDeleteCoupon = async (id) => {

  if (!window.confirm("Delete Coupon?")) return;

  await deleteDoc(doc(db, "coupons", id));

  loadDashboard();

};

// ===========================
// TOGGLE COUPON
// ===========================

const handleToggleCoupon = async (
  id,
  status
) => {

  await updateDoc(doc(db, "coupons", id), {

    active: !status,

  });

  loadDashboard();

};

// ===========================
// UPDATE COUPON
// ===========================

const handleUpdateCoupon = async (
  coupon
) => {

  await updateDoc(doc(db, "coupons", coupon.id), {

    code: coupon.code,

    type: coupon.type,

    discount: Number(coupon.discount),

    minAmount: Number(coupon.minAmount),

    maxUses: Number(coupon.maxUses),

    expiryDate: coupon.expiryDate,

    active: coupon.active,

  });

  loadDashboard();

};

// ===========================
// LOADING
// ===========================

if (loading) {

  return (

    <div className="min-h-screen bg-black flex items-center justify-center text-white text-3xl">

      Loading Admin Panel...

    </div>

  );

}
return (

<div className="min-h-screen bg-black text-white flex">

  {/* Mobile Overlay */}

  {mobileOpen && (

    <div
      onClick={() => setMobileOpen(false)}
      className="fixed inset-0 bg-black/60 z-40 lg:hidden"
    />

  )}

  {/* Sidebar */}

  <div
    className={`
      fixed lg:static
      top-0 left-0
      z-50
      h-screen
      transform
      transition-transform
      duration-300
      ${
        mobileOpen
          ? "translate-x-0"
          : "-translate-x-full lg:translate-x-0"
      }
    `}
  >

    <AdminSidebar
      active={active}
      setActive={(value) => {
        setActive(value);
        setMobileOpen(false);
      }}
      handleLogout={handleLogout}
    />

  </div>

  {/* Right Section */}

  <div className="flex-1 min-w-0">

    <AdminTopbar
      user={auth.currentUser}
      handleLogout={handleLogout}
      mobileOpen={mobileOpen}
      setMobileOpen={setMobileOpen}
    />

    <div className="p-4 md:p-6 lg:p-8">

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

          <div className="grid lg:grid-cols-2 gap-6 mt-8">

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

          <div className="mt-8">

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
            {/* Coupons */}

      {active === "coupons" && (

        <CouponManager

          coupons={coupons}

          couponCode={couponCode}
          setCouponCode={setCouponCode}

          couponType={couponType}
          setCouponType={setCouponType}

          couponDiscount={couponDiscount}
          setCouponDiscount={setCouponDiscount}

          couponMinAmount={couponMinAmount}
          setCouponMinAmount={setCouponMinAmount}

          couponMaxUses={couponMaxUses}
          setCouponMaxUses={setCouponMaxUses}

          couponExpiry={couponExpiry}
          setCouponExpiry={setCouponExpiry}

          couponStatus={couponStatus}
          setCouponStatus={setCouponStatus}

          handleAddCoupon={handleAddCoupon}
          handleDeleteCoupon={handleDeleteCoupon}
          handleToggleCoupon={handleToggleCoupon}
          handleUpdateCoupon={handleUpdateCoupon}

        />

      )}

      {/* Settings */}

      {active === "settings" && (

        <div className="bg-zinc-900 border border-yellow-500 rounded-2xl p-8">

          <h2 className="text-3xl font-bold text-yellow-400 mb-4">
            Admin Settings
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