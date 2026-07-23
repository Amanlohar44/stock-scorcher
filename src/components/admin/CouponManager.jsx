import { useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaCheck,
  FaTimes,
  FaSave,
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

    setEditData({
      ...coupon,
    });

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

      <div className="bg-zinc-900 border border-yellow-500/20 rounded-2xl p-6">

        <h2 className="text-3xl font-bold text-yellow-400 mb-6">

          Coupon Manager

        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

          <input
            value={couponCode}
            onChange={(e) =>
              setCouponCode(e.target.value.toUpperCase())
            }
            placeholder="Coupon Code"
            className="bg-zinc-800 rounded-xl p-3 outline-none"
          />

          <select
            value={couponType}
            onChange={(e) =>
              setCouponType(e.target.value)
            }
            className="bg-zinc-800 rounded-xl p-3 outline-none"
          >
            <option value="percentage">
              Percentage
            </option>

            <option value="flat">
              Flat Amount
            </option>
          </select>

          <input
            type="number"
            value={couponDiscount}
            onChange={(e) =>
              setCouponDiscount(e.target.value)
            }
            placeholder="Discount"
            className="bg-zinc-800 rounded-xl p-3 outline-none"
          />

          <input
            type="number"
            value={couponMinAmount}
            onChange={(e) =>
              setCouponMinAmount(e.target.value)
            }
            placeholder="Minimum Amount"
            className="bg-zinc-800 rounded-xl p-3 outline-none"
          />

          <input
            type="number"
            value={couponMaxUses}
            onChange={(e) =>
              setCouponMaxUses(e.target.value)
            }
            placeholder="Max Uses"
            className="bg-zinc-800 rounded-xl p-3 outline-none"
          />

          <input
            type="date"
            value={couponExpiry}
            onChange={(e) =>
              setCouponExpiry(e.target.value)
            }
            className="bg-zinc-800 rounded-xl p-3 outline-none"
          />
                  <div className="flex items-center gap-3">

          <input
            id="coupon-active"
            type="checkbox"
            checked={couponStatus}
            onChange={(e) =>
              setCouponStatus(e.target.checked)
            }
            className="h-5 w-5 accent-yellow-400"
          />

          <label
            htmlFor="coupon-active"
            className="text-zinc-300"
          >
            Coupon Active
          </label>

        </div>

        <button
          onClick={handleAddCoupon}
          className="flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 font-bold text-black hover:bg-yellow-300 transition"
        >
          <FaPlus />

          Add Coupon

        </button>

      </div>

    </div>

    <div className="bg-zinc-900 border border-yellow-500/20 rounded-2xl overflow-hidden">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-zinc-800">

            <tr>

              <th className="px-5 py-4 text-left">
                Code
              </th>

              <th className="px-5 py-4 text-left">
                Type
              </th>

              <th className="px-5 py-4 text-left">
                Discount
              </th>

              <th className="px-5 py-4 text-left">
                Min
              </th>

              <th className="px-5 py-4 text-left">
                Uses
              </th>

              <th className="px-5 py-4 text-left">
                Expiry
              </th>

              <th className="px-5 py-4 text-left">
                Status
              </th>

              <th className="px-5 py-4 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {coupons.map((coupon) => {

              const editing =
                editingId === coupon.id;

              return (

                <tr
                  key={coupon.id}
                  className="border-t border-zinc-800"
                >
                                      <td className="px-5 py-4">

                    {editing ? (

                      <input
                        value={editData.code}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            code: e.target.value.toUpperCase(),
                          })
                        }
                        className="bg-zinc-800 rounded-lg px-3 py-2 w-full"
                      />

                    ) : (

                      <span className="font-bold text-yellow-400">
                        {coupon.code}
                      </span>

                    )}

                  </td>

                  <td className="px-5 py-4">

                    {editing ? (

                      <select
                        value={editData.type}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            type: e.target.value,
                          })
                        }
                        className="bg-zinc-800 rounded-lg px-3 py-2"
                      >
                        <option value="percentage">
                          Percentage
                        </option>

                        <option value="flat">
                          Flat
                        </option>

                      </select>

                    ) : (

                      coupon.type

                    )}

                  </td>

                  <td className="px-5 py-4">

                    {editing ? (

                      <input
                        type="number"
                        value={editData.discount}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            discount: e.target.value,
                          })
                        }
                        className="bg-zinc-800 rounded-lg px-3 py-2 w-24"
                      />

                    ) : (

                      coupon.type === "percentage"
                        ? `${coupon.discount}%`
                        : `₹${coupon.discount}`

                    )}

                  </td>

                  <td className="px-5 py-4">

                    {editing ? (

                      <input
                        type="number"
                        value={editData.minAmount}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            minAmount: e.target.value,
                          })
                        }
                        className="bg-zinc-800 rounded-lg px-3 py-2 w-24"
                      />

                    ) : (

                      `₹${coupon.minAmount}`

                    )}

                  </td>

                  <td className="px-5 py-4">

                    {editing ? (

                      <input
                        type="number"
                        value={editData.maxUses}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            maxUses: e.target.value,
                          })
                        }
                        className="bg-zinc-800 rounded-lg px-3 py-2 w-24"
                      />

                    ) : (

                      <div>
                        {coupon.usedCount || 0} / {coupon.maxUses}
                      </div>

                    )}

                  </td>
                                    <td className="px-5 py-4">

                    {editing ? (

                      <input
                        type="date"
                        value={editData.expiryDate}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            expiryDate:e.target.value,
                          })
                        }
                        className="bg-zinc-800 rounded-lg px-3 py-2"
                      />

                    ) : (

                      coupon.expiryDate

                    )}

                  </td>


                  <td className="px-5 py-4">

                    <button
                      onClick={() =>
                        handleToggleCoupon(
                          coupon.id,
                          coupon.active
                        )
                      }
                      className={`px-4 py-2 rounded-full text-sm font-bold ${
                        coupon.active
                          ? "bg-green-500 text-black"
                          : "bg-red-500 text-white"
                      }`}
                    >

                      {coupon.active
                        ? "Active"
                        : "Disabled"}

                    </button>

                  </td>


                  <td className="px-5 py-4">

                    <div className="flex justify-center gap-3">


                      {editing ? (

                        <>

                          <button
                            onClick={saveEdit}
                            className="p-3 rounded-xl bg-green-500 text-black"
                          >
                            <FaSave />
                          </button>


                          <button
                            onClick={cancelEdit}
                            className="p-3 rounded-xl bg-zinc-700"
                          >
                            <FaTimes />
                          </button>

                        </>


                      ) : (

                        <button
                          onClick={() =>
                            startEdit(coupon)
                          }
                          className="p-3 rounded-xl bg-yellow-400 text-black"
                        >
                          <FaEdit />
                        </button>

                      )}


                      <button
                        onClick={() =>
                          handleDeleteCoupon(
                            coupon.id
                          )
                        }
                        className="p-3 rounded-xl bg-red-500 text-white"
                      >

                        <FaTrash />

                      </button>


                    </div>

                  </td>


                </tr>

              );

            })}


            {
              coupons.length === 0 && (

                <tr>

                  <td
                    colSpan="8"
                    className="text-center py-10 text-zinc-500"
                  >

                    No Coupons Created

                  </td>

                </tr>

              )
            }


          </tbody>

        </table>

      </div>

    </div>


  </div>

  );

}