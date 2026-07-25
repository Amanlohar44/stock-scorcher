require("dotenv").config();

const {
  getApps,
  initializeApp,
  cert,
} = require("firebase-admin/app");

const {
  getFirestore,
} = require("firebase-admin/firestore");

const firebaseApp =
  getApps().length === 0
    ? initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
      })
    : getApps()[0];

const firestore = getFirestore(firebaseApp);

console.log("🔥 THIS IS MY SERVER FILE");

const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { Resend } = require("resend");

const app = express();

const resend = new Resend(process.env.RESEND_API_KEY);

app.use(
  cors({
    origin: [
      "https://stock-scorcher-eight.vercel.app",
      "https://stockscorcher.com",
      "https://www.stockscorcher.com",
      "http://localhost:5177",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

app.options("*", cors());

app.use(express.json());

app.get("/test", (req, res) => {
  res.send("Backend Working");
});

// =====================
// Razorpay
// =====================

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

console.log("KEY:", process.env.RAZORPAY_KEY_ID);

// =====================
// Email
// =====================

async function sendPaymentEmail(
  email,
  amount,
  paymentId
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

      <table cellpadding="10"
      style="border-collapse:collapse"
      border="1">

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

    const { amount } = req.body;

    const finalAmount = Number(amount);

    if (!finalAmount || finalAmount < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount",
      });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(finalAmount * 100),
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    res.json({
      ...order,
      finalAmount,
    });

  } catch (error) {

    console.error(error);

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

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      email,
      amount,
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

    if (expectedSignature !== razorpay_signature) {
      console.log("❌ INVALID SIGNATURE");

      return res.status(400).json({
        success: false,
        message: "Invalid Signature",
      });
    }

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
      paidAmount: amount,
      message: "Payment Verified Successfully",
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
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