console.log("🔥 THIS IS MY SERVER FILE");
const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const axios = require("axios");
const { Resend } = require("resend");
require("dotenv").config();
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendPaymentEmail(email, amount, paymentId) {
  try {
    await resend.emails.send({
      from: "Stock Scorcher <onboarding@resend.dev>",
      to: email,
      subject: "Payment Successful - Stock Scorcher",
      html: `
        <h2>🎉 Payment Successful</h2>

        <p>Thank you for purchasing Stock Scorcher.</p>

        <p><strong>Amount:</strong> ₹${amount}</p>

        <p><strong>Payment ID:</strong> ${paymentId}</p>

        <p>Your course has been unlocked successfully.</p>

        <a href="https://stock-scorcher-eight.vercel.app/dashboard">
          Go To Dashboard
        </a>
      `,
    });

    console.log("✅ Email Sent");
  } catch (err) {
    console.error("Email Error:", err);
  }
}
const app = express();

app.use(cors({
  origin: [
    "https://stock-scorcher-eight.vercel.app",
    "http://localhost:5177"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

app.options("*", cors());
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

// ===================== YAHOO API =====================

app.get("/api/yahoo", async (req, res) => {
  try {
    const { symbol } = req.query;

    const response = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.NS`
    );

    const result = response.data.chart.result[0];
    const meta = result.meta;

    res.json({
      current: meta.regularMarketPrice,
      high: meta.regularMarketDayHigh,
      low: meta.regularMarketDayLow,
      open: meta.regularMarketOpen,
      previousClose: meta.previousClose,
      percent:
        ((meta.regularMarketPrice - meta.previousClose) /
          meta.previousClose) *
        100,
    });

  } catch (err) {
    console.log(err.message);

    res.status(500).json({
      error: "Yahoo API Error",
    });
  }
});

// =====================
// HISTORY API
// =====================

app.get("/api/history", async (req, res) => {
  try {
    const { symbol, market } = req.query;

    let yahooSymbol = symbol;

    // Indian Stocks
    if (market === "indian-stock") {
      yahooSymbol = `${symbol}.NS`;
    }

    // Forex
    else if (market === "forex") {
      yahooSymbol = `${symbol}=X`;
    }

    // Crypto (Yahoo format)
    else if (market === "crypto") {
      yahooSymbol = `${symbol}-USD`;
    }

    const response = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?range=6mo&interval=1d`
    );

    const result = response.data.chart.result[0];

    const closes =
      result.indicators.quote[0].close.filter(
        (x) => x !== null
      );

    res.json(closes);

  } catch (err) {
    console.log(err.message);

    res.status(500).json({
      error: "History API Error",
    });
  }
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

app.post("/verify-payment", async (req, res) => {
  console.log("🔥 VERIFY PAYMENT API HIT");
  console.log(req.body);

  const {
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  email,
  amount,
} = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

 if (expectedSignature === razorpay_signature) {
  console.log("✅ PAYMENT VERIFIED");

  if (email) {
    await sendPaymentEmail(
      email,
      amount,
      razorpay_payment_id
    );
  }

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