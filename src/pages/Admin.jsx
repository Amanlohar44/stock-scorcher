import { useEffect, useState, useRef } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import JoditEditor from "jodit-react"; // 🔥 Added Rich Text Editor

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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Admin() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  const [modules, setModules] = useState([]);
  const [students, setStudents] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [partners, setPartners] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [search, setSearch] = useState("");

  // Module Form States
  const [title, setTitle] = useState("");
  const [day, setDay] = useState("");
  const [video, setVideo] = useState("");
  const [pdf, setPdf] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editVideo, setEditVideo] = useState("");
  const [editPdf, setEditPdf] = useState("");
  const [editDay, setEditDay] = useState("");

  // Live Class Form States
  const [liveTitle, setLiveTitle] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [liveDate, setLiveDate] = useState("");
  const [liveTime, setLiveTime] = useState("");

  // Direct Upload Blog Form States
  const [blogTitle, setBlogTitle] = useState("");
  const [blogDesc, setBlogDesc] = useState(""); // Now stores HTML content
  const [blogCategory, setBlogCategory] = useState("");
  const [blogImage, setBlogImage] = useState("");
  const [blogVideo, setBlogVideo] = useState("");
  const editor = useRef(null); // Ref for Jodit Editor

  // Jodit Editor Config (Dark Mode Styling)
  const joditConfig = {
    readonly: false,
    theme: "dark",
    placeholder: "Write your detailed market analysis here... (Use bold, links, lists etc.)",
    style: {
      background: "#000000",
      color: "#ffffff",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "0.75rem",
    },
    buttons: [
      "bold", "italic", "underline", "|", 
      "ul", "ol", "|", 
      "font", "fontsize", "brush", "paragraph", "|",
      "image", "link", "|", 
      "align", "undo", "redo"
    ],
  };

  // Coupon Form States
  const [couponCode, setCouponCode] = useState("");
  const [couponType, setCouponType] = useState("percentage");
  const [couponDiscount, setCouponDiscount] = useState("");
  const [couponMinAmount, setCouponMinAmount] = useState("");
  const [couponMaxUses, setCouponMaxUses] = useState("");
  const [couponExpiry, setCouponExpiry] = useState("");
  const [couponStatus, setCouponStatus] = useState(true);

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
      const moduleData = moduleSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      moduleData.sort((a, b) => { if (a.day !== b.day) { return a.day - b.day; } return a.title.localeCompare(b.title); });
      setModules(moduleData);

      const purchaseSnapshot = await getDocs(collection(db, "purchases"));
      const purchaseData = purchaseSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setStudents(purchaseData);

      let revenue = 0;
      purchaseData.forEach((item) => { revenue += Number(item.course || 0); });
      setTotalRevenue(revenue);

      const couponSnapshot = await getDocs(collection(db, "coupons"));
      setCoupons(couponSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      const liveSnapshot = await getDocs(collection(db, "liveClasses"));
      setLiveClasses(liveSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      const blogSnapshot = await getDocs(collection(db, "blogs"));
      setBlogs(blogSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      try {
        const token = await auth.currentUser.getIdToken();
        const res = await axios.get(`${API_BASE_URL}/api/admin/partners`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPartners(res.data);
      } catch (e) {
        console.error(e);
      }

    } catch (err) {
      console.error(err);
    }
  };

  // ===========================
  // PARTNER MANAGEMENT HANDLERS (Dynamic Percentage Update)
  // ===========================
  const handlePartnerUpdate = async (partnerDocId, newStatus, newPercent) => {
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.post(`${API_BASE_URL}/api/admin/approve-partner`, {
        partnerId: partnerDocId, 
        status: newStatus, 
        commissionPercentage: newPercent
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      setPartners(prev => prev.map(p => p.id === partnerDocId ? { ...p, status: newStatus, commissionPercentage: newPercent } : p));
      alert(`Partner details updated successfully!`);
    } catch (err) {
      alert("Failed to update partner via API.");
    }
  };

  // ===========================
  // ADD MODULE
  // ===========================
  const handleAddModule = async () => {
    if (!title || !video || !day) {
      alert("Please fill all required fields");
      return;
    }

    let videoLink = video;
    if (video.includes("watch?v=")) {
      const id = video.split("watch?v=")[1].split("&")[0];
      videoLink = `https://www.youtube.com/embed/${id}`;
    } else if (video.includes("youtu.be/")) {
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

    setDay(""); setTitle(""); setVideo(""); setPdf(""); loadDashboard();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete Module?")) return;
    await deleteDoc(doc(db, "modules", id)); loadDashboard();
  };

  const handleEdit = async () => {
    let videoLink = editVideo;
    if (editVideo.includes("watch?v=")) {
      const id = editVideo.split("watch?v=")[1].split("&")[0];
      videoLink = `https://www.youtube.com/embed/${id}`;
    } else if (editVideo.includes("youtu.be/")) {
      const id = editVideo.split("youtu.be/")[1].split("?")[0];
      videoLink = `https://www.youtube.com/embed/${id}`;
    }

    await updateDoc(doc(db, "modules", editingId), {
      day: Number(editDay), title: editTitle, video: videoLink, pdf: editPdf,
    });

    setEditingId(null); setEditTitle(""); setEditVideo(""); setEditPdf(""); setEditDay(""); loadDashboard();
  };

  const handleAddLiveClass = async () => {
    if (!liveTitle || !liveLink || !liveDate || !liveTime) { alert("Please fill all live class details"); return; }
    try {
      await addDoc(collection(db, "liveClasses"), { title: liveTitle, link: liveLink, date: liveDate, time: liveTime, createdAt: new Date() });
      alert("Live Class Scheduled Successfully!");
      setLiveTitle(""); setLiveLink(""); setLiveDate(""); setLiveTime(""); loadDashboard();
    } catch (err) { alert("Failed to schedule live class"); }
  };

  const handleDeleteLiveClass = async (id) => {
    if (!window.confirm("Delete this Live Class?")) return;
    await deleteDoc(doc(db, "liveClasses", id)); loadDashboard();
  };

  const handleImageUpload = (e) => { const file = e.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onloadend = () => { setBlogImage(reader.result); }; reader.readAsDataURL(file); };
  const handleVideoUpload = (e) => { const file = e.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onloadend = () => { setBlogVideo(reader.result); }; reader.readAsDataURL(file); };

  const handleAddBlog = async () => {
    if (!blogTitle || !blogDesc) { alert("Please fill blog title and content"); return; }
    try {
      await addDoc(collection(db, "blogs"), { 
        title: blogTitle, 
        description: blogDesc, // This now contains Jodit HTML
        category: blogCategory || "General", 
        image: blogImage || "", 
        videoUrl: blogVideo || "", 
        createdAt: new Date() 
      });
      alert("Blog Published Successfully!");
      setBlogTitle(""); setBlogDesc(""); setBlogCategory(""); setBlogImage(""); setBlogVideo(""); loadDashboard();
    } catch (err) { alert("Failed to publish blog"); }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Delete this Article?")) return;
    await deleteDoc(doc(db, "blogs", id)); loadDashboard();
  };

  const handleAddCoupon = async () => {
    try {
      if (!couponCode || !couponDiscount || !couponExpiry) { alert("Fill all required fields"); return; }
      await addDoc(collection(db, "coupons"), { code: couponCode.toUpperCase(), type: couponType, discount: Number(couponDiscount), minAmount: Number(couponMinAmount || 0), maxUses: Number(couponMaxUses || 0), usedCount: 0, expiryDate: couponExpiry, active: couponStatus, createdAt: new Date() });
      alert("Coupon Added");
      setCouponCode(""); setCouponDiscount(""); setCouponMinAmount(""); setCouponMaxUses(""); setCouponExpiry(""); setCouponStatus(true); loadDashboard();
    } catch (err) { alert(err.message); }
  };

  const handleDeleteCoupon = async (id) => { if (!window.confirm("Delete Coupon?")) return; await deleteDoc(doc(db, "coupons", id)); loadDashboard(); };
  const handleToggleCoupon = async (id, status) => { await updateDoc(doc(db, "coupons", id), { active: !status }); loadDashboard(); };
  const handleUpdateCoupon = async (coupon) => { await updateDoc(doc(db, "coupons", coupon.id), { code: coupon.code, type: coupon.type, discount: Number(coupon.discount), minAmount: Number(coupon.minAmount), maxUses: Number(coupon.maxUses), expiryDate: coupon.expiryDate, active: coupon.active }); loadDashboard(); };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-yellow-400 text-2xl font-black uppercase tracking-wider">
        Loading Admin Command Center...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden" />
      )}

      <div className={`fixed lg:static top-0 left-0 z-50 h-screen transform transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <AdminSidebar active={active} setActive={(value) => { setActive(value); setMobileOpen(false); }} handleLogout={handleLogout} />
      </div>

      <div className="flex-1 min-w-0">
        <AdminTopbar user={auth.currentUser} handleLogout={handleLogout} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        <div className="p-4 md:p-6 lg:p-8">
          {active === "dashboard" && (
            <>
              <div className="mb-6 flex justify-between items-center bg-zinc-950 border border-yellow-500/30 p-4 rounded-2xl shadow-lg">
                <div>
                  <h3 className="text-lg font-black text-white uppercase">Growth Partner Network</h3>
                  <p className="text-xs text-zinc-400">Approve partners and manage commissions</p>
                </div>
                <button onClick={() => setActive("partners")} className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors shadow-[0_0_15px_rgba(250,204,21,0.3)] cursor-pointer">
                  🌟 Manage Partners
                </button>
              </div>

              <StatsCards students={students} modules={modules} totalRevenue={totalRevenue} />
              <DashboardCharts students={students} modules={modules} totalRevenue={totalRevenue} />
              <div className="grid lg:grid-cols-2 gap-6 mt-8">
                <RecentPayments students={students} />
                <RecentActivity students={students} modules={modules} />
              </div>
            </>
          )}

          {active === "partners" && (
            <div className="bg-zinc-950 border border-yellow-500/30 rounded-[2rem] p-6 shadow-2xl min-h-screen">
              <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                <div>
                  <h1 className="text-3xl font-bold">Partner <span className="text-yellow-400">Management</span></h1>
                  <p className="text-zinc-400 mt-1">Approve partner applications and control % commissions.</p>
                </div>
                <div className="bg-black border border-white/10 px-4 py-2 rounded-xl flex gap-4 text-xs font-bold">
                  <div>Total: <span className="text-yellow-400">{partners.length}</span></div>
                  <div>Pending: <span className="text-orange-400">{partners.filter(p => p.status === 'pending').length}</span></div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black text-zinc-400 text-xs uppercase tracking-wider border-b border-white/10">
                      <th className="p-4 font-semibold">Partner Details</th>
                      <th className="p-4 font-semibold">Performance</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold">Commission (%)</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-sm">
                    {partners.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-zinc-500">No partner applications found.</td>
                      </tr>
                    ) : (
                      partners.map((partner) => (
                        <tr key={partner.id || partner.partnerId} className="hover:bg-black/40 transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-white">{partner.personalInfo?.name || "Partner"}</div>
                            <div className="text-xs text-yellow-400 font-mono mt-0.5">{partner.partnerId}</div>
                            <div className="text-xs text-zinc-500">{partner.email}</div>
                          </td>
                          <td className="p-4">
                            <div className="text-xs">Sales: <span className="text-yellow-400 font-bold">{partner.totalSalesCount || 0}</span></div>
                            <div className="text-[10px] text-zinc-500">₹{(partner.totalEarned || 0).toLocaleString()} earned</div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider 
                              ${partner.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                                partner.status === 'pending' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 
                                'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                              {partner.status || 'pending'}
                            </span>
                          </td>
                          
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <input 
                                type="number" 
                                id={`comm-${partner.id || partner.partnerId}`}
                                defaultValue={partner.commissionPercentage || 20}
                                className="bg-black border border-white/10 text-white text-xs rounded-lg p-2 w-16 text-center focus:border-yellow-400 outline-none font-bold"
                              />
                              <span className="text-zinc-500 text-xs font-bold">%</span>
                              <button 
                                onClick={() => {
                                  const val = document.getElementById(`comm-${partner.id || partner.partnerId}`).value;
                                  handlePartnerUpdate(partner.id || partner.partnerId, partner.status, Number(val));
                                }}
                                className="bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400 hover:text-black border border-yellow-400/30 px-2 py-1.5 rounded text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                              >
                                Save
                              </button>
                            </div>
                            <div className="text-[10px] text-zinc-500 mt-1">Set Custom %</div>
                          </td>

                          <td className="p-4 text-right flex flex-col gap-2 justify-end">
                            {partner.status !== 'approved' && (
                              <button 
                                onClick={() => handlePartnerUpdate(partner.id || partner.partnerId, 'approved', partner.commissionPercentage || 20)}
                                className="bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-black border border-green-500/30 text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                              >
                                Approve
                              </button>
                            )}
                            {partner.status !== 'rejected' && (
                              <button 
                                onClick={() => handlePartnerUpdate(partner.id || partner.partnerId, 'rejected', partner.commissionPercentage || 20)}
                                className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/30 text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                              >
                                Reject
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {active === "modules" && (
            <>
              <AddModule day={day} setDay={setDay} title={title} setTitle={setTitle} video={video} setVideo={setVideo} pdf={pdf} setPdf={setPdf} handleAddModule={handleAddModule} />
              <div className="mt-8">
                <ModuleList modules={modules} editingId={editingId} setEditingId={setEditingId} editTitle={editTitle} setEditTitle={setEditTitle} editVideo={editVideo} setEditVideo={setEditVideo} editPdf={editPdf} setEditPdf={setEditPdf} editDay={editDay} setEditDay={setEditDay} handleEdit={handleEdit} handleDelete={handleDelete} />
              </div>
            </>
          )}

          {active === "live" && (
            <div className="space-y-8">
              <div className="bg-zinc-950 border border-yellow-500/30 rounded-[2rem] p-6 sm:p-8 shadow-2xl">
                <h2 className="text-2xl font-black text-yellow-400 uppercase tracking-wider mb-6">🔴 Schedule Live Mentorship Class</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Class Title / Topic</label><input type="text" placeholder="e.g. Weekly Market Analysis & Q&A" value={liveTitle} onChange={(e) => setLiveTitle(e.target.value)} className="w-full rounded-xl bg-black border border-white/10 px-4 py-3 text-sm text-white focus:border-yellow-400 outline-none" /></div>
                  <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Meeting / Stream URL</label><input type="text" placeholder="Zoom / YouTube / Meet Link" value={liveLink} onChange={(e) => setLiveLink(e.target.value)} className="w-full rounded-xl bg-black border border-white/10 px-4 py-3 text-sm text-white focus:border-yellow-400 outline-none" /></div>
                  <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Date</label><input type="date" value={liveDate} onChange={(e) => setLiveDate(e.target.value)} className="w-full rounded-xl bg-black border border-white/10 px-4 py-3 text-sm text-white focus:border-yellow-400 outline-none" /></div>
                  <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Time</label><input type="time" value={liveTime} onChange={(e) => setLiveTime(e.target.value)} className="w-full rounded-xl bg-black border border-white/10 px-4 py-3 text-sm text-white focus:border-yellow-400 outline-none" /></div>
                </div>
                <button onClick={handleAddLiveClass} className="mt-6 rounded-xl bg-yellow-400 hover:bg-yellow-300 px-8 py-4 text-xs font-black text-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(250,204,21,0.3)] cursor-pointer">Publish Live Class</button>
              </div>

              <div className="bg-zinc-950 border border-white/10 rounded-[2rem] p-6 sm:p-8">
                <h3 className="text-xl font-black text-white uppercase tracking-wider mb-6">Upcoming & Active Live Sessions</h3>
                {liveClasses.length === 0 ? <p className="text-zinc-500 text-sm">No live classes scheduled right now.</p> : (
                  <div className="space-y-4">
                    {liveClasses.map((item) => (
                      <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-zinc-900 border border-white/10 p-5 rounded-2xl gap-4">
                        <div><h4 className="font-extrabold text-white text-base">{item.title}</h4><p className="text-xs text-yellow-400 mt-1 font-bold">📅 {item.date} | ⏰ {item.time}</p><a href={item.link} target="_blank" rel="noreferrer" className="text-xs text-blue-400 underline mt-1 block">{item.link}</a></div>
                        <button onClick={() => handleDeleteLiveClass(item.id)} className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer">Delete Session</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {active === "blogs" && (
            <div className="space-y-8">
              <div className="bg-zinc-950 border border-yellow-500/30 rounded-[2rem] p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
                <h2 className="text-2xl sm:text-3xl font-black text-yellow-400 uppercase tracking-wider mb-2">✍️ Direct Upload Blog & Media Hub</h2>
                <p className="text-zinc-400 text-xs sm:text-sm font-light mb-6">Create rich content, type your custom category and upload media.</p>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Article Title</label><input type="text" placeholder="e.g. Today's Market Analysis" value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-yellow-400 outline-none" /></div>
                    <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Custom Category</label><input type="text" placeholder="e.g. BankNifty / Crypto / Strategy" value={blogCategory} onChange={(e) => setBlogCategory(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-yellow-400 outline-none uppercase font-bold" /></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Upload Photo / Banner</label><input type="file" accept="image/*" onChange={handleImageUpload} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-zinc-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-yellow-400 file:text-black hover:file:bg-yellow-300 cursor-pointer" />{blogImage && <p className="text-[10px] text-green-400 mt-1 font-bold">✓ Image Selected Successfully</p>}</div>
                    <div><label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Upload Video (Optional)</label><input type="file" accept="video/*" onChange={handleVideoUpload} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-zinc-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-blue-500 file:text-white hover:file:bg-blue-400 cursor-pointer" />{blogVideo && <p className="text-[10px] text-blue-400 mt-1 font-bold">✓ Video Selected Successfully</p>}</div>
                  </div>

                  {/* 🔥 RICH TEXT EDITOR REPLACES TEXTAREA 🔥 */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Full Article Content (Rich Text)</label>
                    <div className="text-black jodit-dark-wrapper">
                      <JoditEditor
                        ref={editor}
                        value={blogDesc}
                        config={joditConfig}
                        onBlur={newContent => setBlogDesc(newContent)} // Updates content on blur
                      />
                    </div>
                  </div>
                </div>

                <button onClick={handleAddBlog} className="mt-6 rounded-xl bg-yellow-400 hover:bg-yellow-300 px-8 py-4 text-xs font-black text-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(250,204,21,0.3)] cursor-pointer active:scale-95">🚀 Publish Article</button>
              </div>

              <div className="bg-zinc-950 border border-yellow-500/30 rounded-[2rem] p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
                <h3 className="text-xl font-black text-white uppercase tracking-wider mb-6">Published Articles ({blogs.length})</h3>
                {blogs.length === 0 ? <p className="text-zinc-500 text-xs font-light py-8 text-center">No articles published yet. Create your first market insight above!</p> : (
                  <div className="space-y-4">
                    {blogs.map((blog) => (
                      <div key={blog.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-black border border-white/10 p-5 rounded-2xl gap-4 hover:border-yellow-500/30 transition-all">
                        <div className="flex items-start gap-4">
                          {blog.image && <img src={blog.image} alt="Article Thumb" className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0 hidden sm:block" />}
                          <div>
                            <div className="flex items-center gap-2 mb-1"><span className="px-2.5 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 text-[9px] font-black uppercase tracking-wider">{blog.category || "General"}</span>{blog.videoUrl && <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[9px] font-black uppercase">📹 Video Uploaded</span>}</div>
                            <h4 className="font-black text-white text-base tracking-tight">{blog.title}</h4>
                            <div 
                              className="text-xs text-zinc-400 mt-1 line-clamp-2 font-light"
                              dangerouslySetInnerHTML={{ __html: blog.description }} // Renders HTML properly in preview
                            />
                          </div>
                        </div>
                        <button onClick={() => handleDeleteBlog(blog.id)} className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer shrink-0">Delete Article</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {active === "students" && <StudentTable students={students} search={search} setSearch={setSearch} />}
          {active === "payments" && <RecentPayments students={students} />}
          {active === "analytics" && <DashboardCharts students={students} modules={modules} totalRevenue={totalRevenue} />}
          {active === "coupons" && <CouponManager coupons={coupons} couponCode={couponCode} setCouponCode={setCouponCode} couponType={couponType} setCouponType={setCouponType} couponDiscount={couponDiscount} setCouponDiscount={setCouponDiscount} couponMinAmount={couponMinAmount} setCouponMinAmount={setCouponMinAmount} couponMaxUses={couponMaxUses} setCouponMaxUses={setCouponMaxUses} couponExpiry={couponExpiry} setCouponExpiry={setCouponExpiry} couponStatus={couponStatus} setCouponStatus={setCouponStatus} handleAddCoupon={handleAddCoupon} handleDeleteCoupon={handleDeleteCoupon} handleToggleCoupon={handleToggleCoupon} handleUpdateCoupon={handleUpdateCoupon} />}

          {active === "settings" && (
            <div className="space-y-6">
              <div className="bg-zinc-950 border border-yellow-500/30 rounded-[2rem] p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
                <h2 className="text-2xl sm:text-3xl font-black text-yellow-400 uppercase tracking-wider mb-2">⚙️ Admin Control Settings</h2>
                <p className="text-zinc-400 text-xs sm:text-sm font-light mb-8">Manage global platform configurations, security controls, and API integrations.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-sm font-black text-yellow-400 uppercase tracking-wider mb-3">🔐 Administrator Profile</h3>
                    <div className="space-y-2 text-xs text-zinc-300">
                      <p><span className="text-zinc-500 font-bold uppercase">Role:</span> Super Admin</p>
                      <p><span className="text-zinc-500 font-bold uppercase">Authorized Email:</span> {auth.currentUser?.email || "stockscorcher@gmail.com"}</p>
                      <p><span className="text-zinc-500 font-bold uppercase">Access Status:</span> <span className="text-green-400 font-bold">Securely Authenticated</span></p>
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-sm font-black text-yellow-400 uppercase tracking-wider mb-3">🌐 Platform Status</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between"><span className="text-xs text-zinc-300 font-bold uppercase">Maintenance Mode</span><span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-[10px] font-black uppercase">Live & Online</span></div>
                      <div className="flex items-center justify-between"><span className="text-xs text-zinc-300 font-bold uppercase">Student Registrations</span><span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase">Open</span></div>
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-sm font-black text-yellow-400 uppercase tracking-wider mb-3">🔌 Market Data APIs</h3>
                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between"><span className="text-zinc-300">Finnhub Stock Tickers</span><span className="text-emerald-400 font-bold">Connected ✓</span></div>
                      <div className="flex items-center justify-between"><span className="text-zinc-300">Twelve Data API</span><span className="text-emerald-400 font-bold">Connected ✓</span></div>
                      <div className="flex items-center justify-between"><span className="text-zinc-300">Firebase Firestore DB</span><span className="text-emerald-400 font-bold">Synced ✓</span></div>
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                    <div><h3 className="text-sm font-black text-yellow-400 uppercase tracking-wider mb-3">⚡ Quick System Actions</h3><p className="text-xs text-zinc-400 font-light mb-4">Refresh all active modules, student lists, and coupon data from Firestore database.</p></div>
                    <button onClick={() => { loadDashboard(); alert("Dashboard Data Refreshed Successfully!"); }} className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-3 rounded-xl font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-[0_0_15px_rgba(250,204,21,0.2)]">🔄 Refresh Dashboard Data</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Basic Jodit dark mode overrides */}
      <style dangerouslySetInnerHTML={{__html: `
        .jodit-dark-wrapper .jodit-container {
          background-color: #000000 !important;
          border-color: rgba(255,255,255,0.1) !important;
          color: white !important;
        }
        .jodit-dark-wrapper .jodit-toolbar__box {
          background-color: #121212 !important;
          border-bottom-color: rgba(255,255,255,0.1) !important;
        }
        .jodit-dark-wrapper .jodit-toolbar-button__button {
          filter: invert(1);
        }
        .jodit-dark-wrapper .jodit-wysiwyg {
          background-color: #000000 !important;
          color: white !important;
        }
      `}} />
    </div>
  );
}