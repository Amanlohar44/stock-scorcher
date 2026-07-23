console.log("🔥 THIS IS MY SERVER FILE");

const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const axios = require("axios");
const { Resend } = require("resend");
require("dotenv").config();

const app = express();

const resend = new Resend(process.env.RESEND_API_KEY);

app.use(
  cors({
    origin: [
      "https://stock-scorcher-eight.vercel.app",
      "http://localhost:5177",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.options("*", cors());

app.use(express.json());

// =====================
// Razorpay
// =====================

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

console.log("KEY:", process.env.RAZORPAY_KEY_ID);
console.log("SECRET:", process.env.RAZORPAY_KEY_SECRET);

// =====================
// Email
// =====================

async function sendPaymentEmail(
  email,
  amount,
  paymentId,
  coupon = "",
  originalPrice = amount,
  discount = 0
) {
  try {
    await resend.emails.send({
      from: "Stock Scorcher <onboarding@resend.dev>",
      to: email,
      subject: "Payment Successful - Stock Scorcher",

      html: `
      <div style="font-family:Arial;padding:30px">

      <h2>🎉 Payment Successful</h2>

      <p>Thank you for purchasing Stock Scorcher.</p>

      <table
      cellpadding="10"
      style="border-collapse:collapse"
      border="1">

      <tr>
      <td><b>Original Price</b></td>
      <td>₹${originalPrice}</td>
      </tr>

      <tr>
      <td><b>Coupon</b></td>
      <td>${coupon || "No Coupon"}</td>
      </tr>

      <tr>
      <td><b>Discount</b></td>
      <td>${discount}%</td>
      </tr>

      <tr>
      <td><b>Paid Amount</b></td>
      <td>₹${amount}</td>
      </tr>

      <tr>
      <td><b>Payment ID</b></td>
      <td>${paymentId}</td>
      </tr>

      </table>

      <br>

      <a
      href="https://stock-scorcher-eight.vercel.app/dashboard"
      style="
      background:#FFD700;
      color:black;
      padding:12px 20px;
      text-decoration:none;
      border-radius:8px;
      font-weight:bold;
      ">

      Go To Dashboard

      </a>

      </div>
      `,
    });

    console.log("✅ Email Sent");
  } catch (err) {
    console.log(err);
  }
}

// =====================
// CREATE ORDER
// =====================

app.post("/create-order", async (req, res) => {
  console.log("🔥 CREATE ORDER HIT");

  try {
    const { amount, coupon } = req.body;

    let finalAmount = Number(amount);

    // =====================
    // Coupon Validation
    // =====================

    if (coupon) {
  const code = coupon.trim().toUpperCase();

  if (code !== "AL35") {
    return res.status(400).json({
      success: false,
      message: "Invalid Coupon",
    });
  }
}
    const options = {
      amount: finalAmount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    console.log("✅ Order Created:", order.id);

    res.json({
      ...order,
      finalAmount,
      coupon: coupon || null,
    });

  } catch (error) {

    console.error("CREATE ORDER ERROR:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });

  }

});

// =====================
// VERIFY PAYMENT
// =====================

console.log("✅ VERIFY ROUTE LOADED");

app.post("/verify-payment", async (req, res) => {

  console.log("🔥 VERIFY PAYMENT API HIT");
  console.log(req.body);

  const {
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  email,
  amount,
  coupon,
  originalPrice,
  discount,
} = req.body;

  const body =
    razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET
    )
    .update(body)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {

    console.log("✅ PAYMENT VERIFIED");

    if (email) {

      await sendPaymentEmail(
  email,
  amount,
  razorpay_payment_id,
  coupon,
  originalPrice,
  discount
);

    }

    return res.json({
      success: true,
      couponUsed: coupon || null,
      paidAmount: amount,
      message: "Payment Verified Successfully",
    });

  } else {

    console.log("❌ INVALID SIGNATURE");

    return res.status(400).json({
      success: false,
      message: "Invalid Signature",
    });

  }

});

// =====================
// START SERVER
// =====================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server Running on Port ${PORT}`);
});