import { useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
  FaTag,
} from "react-icons/fa";

export default function CouponManager({
  coupons,
  couponCode,
  setCouponCode,
  couponType,
  setCouponType,
  couponDiscount,
  setCouponDiscount,
  couponMinAmount,
  setCouponMinAmount,
  couponMaxUses,
  setCouponMaxUses,
  couponExpiry,
  setCouponExpiry,
  couponStatus,
  setCouponStatus,
  handleAddCoupon,
  handleDeleteCoupon,
  handleToggleCoupon,
  handleUpdateCoupon,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const startEdit = (coupon) => {
    setEditingId(coupon.id);
    setEditData({ ...coupon });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = () => {
    handleUpdateCoupon(editData);
    setEditingId(null);
  };

  return (
    <div className="space-y-8">
      {/* Create Coupon Section */}
      <div className="bg-zinc-950 border border-yellow-500/30 rounded-[2rem] p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <h2 className="text-2xl sm:text-3xl font-black text-yellow-400 uppercase tracking-wider mb-6 flex items-center gap-2">
          <FaTag size={22} /> Coupon Command Center
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Coupon Code</label>
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="e.g. SCORCHER50"
              className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm text-white focus:border-yellow-400 outline-none uppercase font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Discount Type</label>
            <select
              value={couponType}
              onChange={(e) => setCouponType(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm text-white focus:border-yellow-400 outline-none uppercase font-bold"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="flat">Flat Amount (₹)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Discount Value</label>
            <input
              type="number"
              value={couponDiscount}
              onChange={(e) => setCouponDiscount(e.target.value)}
              placeholder="e.g. 20 or 500"
              className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm text-white focus:border-yellow-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Min Cart Amount</label>
            <input
              type="number"
              value={couponMinAmount}
              onChange={(e) => setCouponMinAmount(e.target.value)}
              placeholder="e.g. 999"
              className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm text-white focus:border-yellow-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Max Uses Limit</label>
            <input
              type="number"
              value={couponMaxUses}
              onChange={(e) => setCouponMaxUses(e.target.value)}
              placeholder="e.g. 100"
              className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm text-white focus:border-yellow-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Expiry Date</label>
            <input
              type="date"
              value={couponExpiry}
              onChange={(e) => setCouponExpiry(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm text-white focus:border-yellow-400 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 pt-6 border-t border-white/10 gap-4">
          <div className="flex items-center gap-3">
            <input
              id="coupon-active"
              type="checkbox"
              checked={couponStatus}
              onChange={(e) => setCouponStatus(e.target.checked)}
              className="h-5 w-5 accent-yellow-400 cursor-pointer"
            />
            <label htmlFor="coupon-active" className="text-xs font-bold uppercase tracking-wider text-zinc-300 cursor-pointer">
              Active Coupon Status
            </label>
          </div>

          <button
            onClick={handleAddCoupon}
            className="flex items-center justify-center gap-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 px-8 py-3.5 font-black text-xs sm:text-sm text-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(250,204,21,0.25)] active:scale-95 cursor-pointer w-full sm:w-auto"
          >
            <FaPlus /> Create Coupon
          </button>
        </div>
      </div>

      {/* Coupons Table List */}
      <div className="bg-zinc-950 border border-yellow-500/30 rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-black text-white uppercase tracking-wider">Active & Existing Coupons</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-left text-zinc-300">
            <thead className="bg-zinc-900 text-[10px] uppercase font-black text-yellow-400 tracking-wider">
              <tr>
                <th className="px-5 py-4">Code</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Discount</th>
                <th className="px-5 py-4">Min Amt</th>
                <th className="px-5 py-4">Uses</th>
                <th className="px-5 py-4">Expiry</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 font-medium">
              {coupons.map((coupon) => {
                const editing = editingId === coupon.id;

                return (
                  <tr key={coupon.id} className="hover:bg-zinc-900/50 transition-colors">
                    {/* Code */}
                    <td className="px-5 py-4">
                      {editing ? (
                        <input
                          value={editData.code}
                          onChange={(e) =>
                            setEditData({ ...editData, code: e.target.value.toUpperCase() })
                          }
                          className="bg-black border border-white/10 rounded-lg px-3 py-2 w-full text-white font-bold uppercase"
                        />
                      ) : (
                        <span className="font-black text-yellow-400 uppercase tracking-wider">
                          {coupon.code}
                        </span>
                      )}
                    </td>

                    {/* Type */}
                    <td className="px-5 py-4 uppercase">
                      {editing ? (
                        <select
                          value={editData.type}
                          onChange={(e) =>
                            setEditData({ ...editData, type: e.target.value })
                          }
                          className="bg-black border border-white/10 rounded-lg px-3 py-2 text-white"
                        >
                          <option value="percentage">Percentage</option>
                          <option value="flat">Flat</option>
                        </select>
                      ) : (
                        coupon.type
                      )}
                    </td>

                    {/* Discount */}
                    <td className="px-5 py-4 font-bold text-white">
                      {editing ? (
                        <input
                          type="number"
                          value={editData.discount}
                          onChange={(e) =>
                            setEditData({ ...editData, discount: e.target.value })
                          }
                          className="bg-black border border-white/10 rounded-lg px-3 py-2 w-20 text-white"
                        />
                      ) : coupon.type === "percentage" ? (
                        `${coupon.discount}%`
                      ) : (
                        `₹${coupon.discount}`
                      )}
                    </td>

                    {/* Min Amount */}
                    <td className="px-5 py-4">
                      {editing ? (
                        <input
                          type="number"
                          value={editData.minAmount}
                          onChange={(e) =>
                            setEditData({ ...editData, minAmount: e.target.value })
                          }
                          className="bg-black border border-white/10 rounded-lg px-3 py-2 w-24 text-white"
                        />
                      ) : (
                        `₹${coupon.minAmount || 0}`
                      )}
                    </td>

                    {/* Uses */}
                    <td className="px-5 py-4">
                      {editing ? (
                        <input
                          type="number"
                          value={editData.maxUses}
                          onChange={(e) =>
                            setEditData({ ...editData, maxUses: e.target.value })
                          }
                          className="bg-black border border-white/10 rounded-lg px-3 py-2 w-20 text-white"
                        />
                      ) : (
                        <span className="font-bold text-zinc-400">
                          {coupon.usedCount || 0} / {coupon.maxUses || "∞"}
                        </span>
                      )}
                    </td>

                    {/* Expiry */}
                    <td className="px-5 py-4">
                      {editing ? (
                        <input
                          type="date"
                          value={editData.expiryDate}
                          onChange={(e) =>
                            setEditData({ ...editData, expiryDate: e.target.value })
                          }
                          className="bg-black border border-white/10 rounded-lg px-3 py-2 text-white"
                        />
                      ) : (
                        coupon.expiryDate
                      )}
                    </td>

                    {/* Status Toggle */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleCoupon(coupon.id, coupon.active)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all ${
                          coupon.active
                            ? "bg-green-500/20 border border-green-500/30 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.2)]"
                            : "bg-red-500/20 border border-red-500/30 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                        }`}
                      >
                        {coupon.active ? "Active" : "Disabled"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {editing ? (
                          <>
                            <button
                              onClick={saveEdit}
                              title="Save"
                              className="p-2.5 rounded-xl bg-green-500 text-black hover:bg-green-400 transition cursor-pointer shadow-md"
                            >
                              <FaSave size={14} />
                            </button>
                            <button
                              onClick={cancelEdit}
                              title="Cancel"
                              className="p-2.5 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition cursor-pointer"
                            >
                              <FaTimes size={14} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => startEdit(coupon)}
                            title="Edit"
                            className="p-2.5 rounded-xl bg-yellow-400 text-black hover:bg-yellow-300 transition cursor-pointer shadow-md"
                          >
                            <FaEdit size={14} />
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteCoupon(coupon.id)}
                          title="Delete"
                          className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition cursor-pointer shadow-md"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {coupons.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-zinc-500 font-light">
                    No active discount coupons found. Create one above!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}