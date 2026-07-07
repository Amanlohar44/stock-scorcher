console.log("🔥 THIS IS MY SERVER FILE");
const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ===================== Razorpay =====================

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

console.log("KEY:", process.env.RAZORPAY_KEY_ID);
console.log("SECRET:", process.env.RAZORPAY_KEY_SECRET);

// ===================== HOME =====================

app.get("/", (req, res) => {
  res.send("Backend Running ✅");
});

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// ===================== CREATE ORDER =====================

app.post("/create-order", async (req, res) => {
  console.log("🔥 CREATE ORDER HIT");

  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    console.log("✅ Order Created:", order.id);

    res.json(order);
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ===================== VERIFY PAYMENT =====================

console.log("✅ VERIFY ROUTE LOADED");

app.post("/verify-payment", (req, res) => {
  console.log("🔥 VERIFY PAYMENT API HIT");
  console.log(req.body);

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    console.log("✅ PAYMENT VERIFIED");

    return res.json({
      success: true,
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

// ===================== START SERVER =====================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server Running on Port ${PORT}`);
});