require("dotenv").config();

const { getApps, initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");

const firebaseApp = getApps().length === 0 ? initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
}) : getApps()[0];

const firestore = getFirestore(firebaseApp);
const firebaseAuth = getAuth(firebaseApp);

console.log("🔥 THIS IS MY SERVER FILE");

const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { Resend } = require("resend");

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors({
  origin: ["https://stock-scorcher-eight.vercel.app", "https://stockscorcher.com", "https://www.stockscorcher.com", "http://localhost:5177", "http://localhost:5174"],
  methods: ["GET", "POST", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.options("*", cors());
app.use(express.json());

app.get("/test", (req, res) => { res.send("Backend Working"); });

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function sendPaymentEmail(email, amount, paymentId) {
  try {
    await resend.emails.send({
      from: "Stock Scorcher <onboarding@resend.dev>",
      to: email,
      subject: "Payment Successful - Stock Scorcher",
      html: `<div style="font-family:Arial;padding:30px">
      <h2>🎉 Payment Successful</h2><p>Thank you for purchasing Stock Scorcher.</p>
      <table cellpadding="10" style="border-collapse:collapse" border="1">
      <tr><td><b>Paid Amount</b></td><td>₹${amount}</td></tr>
      <tr><td><b>Payment ID</b></td><td>${paymentId}</td></tr></table>
      <br><a href="https://stockscorcher.com/dashboard" style="background:#FFD700;color:black;padding:12px 20px;text-decoration:none;border-radius:8px;font-weight:bold;">Go To Dashboard</a></div>`,
    });
  } catch (err) { console.log(err); }
}

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decodedToken = await firebaseAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Unauthorized: Invalid token" });
  }
};

app.post("/create-order", async (req, res) => {
  try {
    const { amount, partnerId } = req.body;
    const finalAmount = Number(amount);
    if (!finalAmount || finalAmount < 1) return res.status(400).json({ success: false, message: "Invalid amount" });

    const order = await razorpay.orders.create({
      amount: Math.round(finalAmount * 100),
      currency: "INR",
      receipt: "receipt_" + Date.now(),
      notes: { partnerId: partnerId || "" }
    });
    res.json({ ...order, finalAmount });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email, amount, partnerId } = req.body;
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id).digest("hex");

    if (expectedSignature !== razorpay_signature) return res.status(400).json({ success: false, message: "Invalid Signature" });

    if (partnerId) {
      try {
        const partnerRef = firestore.collection("partners").doc(partnerId);
        const saleRef = firestore.collection("sales").doc(razorpay_order_id);

        await firestore.runTransaction(async (transaction) => {
          const partnerDoc = await transaction.get(partnerRef);
          const saleDoc = await transaction.get(saleRef);
          
          if (partnerDoc.exists && !saleDoc.exists) {
            const commissionPercentage = partnerDoc.data().commissionPercentage || 20; 
            const commissionAmount = (amount * commissionPercentage) / 100; 

            transaction.set(saleRef, { orderId: razorpay_order_id, partnerId, amountPaid: amount, commissionAmount, timestamp: FieldValue.serverTimestamp(), status: "successful" });
            transaction.update(partnerRef, {
              walletBalance: (partnerDoc.data().walletBalance || 0) + commissionAmount,
              totalEarned: (partnerDoc.data().totalEarned || 0) + commissionAmount,
              totalSalesCount: (partnerDoc.data().totalSalesCount || 0) + 1,
              updatedAt: FieldValue.serverTimestamp()
            });
          }
        });
      } catch (e) { console.error("Commission Error:", e); }
    }
    if (email) await sendPaymentEmail(email, amount, razorpay_payment_id);
    return res.json({ success: true, paidAmount: amount, message: "Verified" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Partner APIS
app.post("/api/partners/apply", verifyToken, async (req, res) => {
  try {
    const { uid, email, fullName, phone, promotionMethod, payoutDetails } = req.body;
    if (req.user.uid !== uid) return res.status(403).json({ error: "Forbidden" });
    const partnerRef = firestore.collection("partners").doc(uid);
    const shortUid = uid.substring(0, 6).toUpperCase();
    await partnerRef.set({
      uid, email, personalInfo: { name: fullName }, phone, promotionMethod, payoutDetails,
      partnerId: `SSC${shortUid}`, status: "pending", commissionPercentage: 20, 
      walletBalance: 0, totalEarned: 0, totalSalesCount: 0, appliedAt: FieldValue.serverTimestamp()
    });
    res.status(201).json({ message: "Submitted" });
  } catch (error) { res.status(500).json({ error: "Failed" }); }
});

// 🔥 NEW STATUS CHECK ROUTE 🔥
app.get("/api/partners/status/:uid", verifyToken, async (req, res) => {
  try {
    const { uid } = req.params;
    if (req.user.uid !== uid) return res.status(403).json({ error: "Forbidden" });

    const partnerDoc = await firestore.collection("partners").doc(uid).get();
    if (!partnerDoc.exists) {
      return res.status(404).json({ exists: false });
    }

    res.status(200).json({ exists: true, data: partnerDoc.data() });
  } catch (error) {
    res.status(500).json({ error: "Failed to check status" });
  }
});

app.get("/api/partners/analytics/:partnerId", verifyToken, async (req, res) => {
  try {
    const partnerDoc = await firestore.collection("partners").doc(req.params.partnerId).get();
    if (!partnerDoc.exists) return res.status(404).json({ error: "Not found" });
    res.status(200).json(partnerDoc.data());
  } catch (error) { res.status(500).json({ error: "Failed" }); }
});

app.post("/api/partners/withdraw", verifyToken, async (req, res) => {
  try {
    const partnerId = req.user.uid;
    const amount = Number(req.body.amount);
    const partnerRef = firestore.collection("partners").doc(partnerId);
    
    await firestore.runTransaction(async (transaction) => {
      const pDoc = await transaction.get(partnerRef);
      if (pDoc.data().walletBalance < amount) throw new Error("Insufficient");
      transaction.update(partnerRef, { walletBalance: pDoc.data().walletBalance - amount });
      transaction.set(firestore.collection("withdrawals").doc(), {
        partnerId, amount, status: "pending", requestedAt: FieldValue.serverTimestamp(), payoutDetails: pDoc.data().payoutDetails
      });
    });
    res.status(200).json({ message: "Requested" });
  } catch (error) { res.status(400).json({ error: error.message }); }
});

// Admin API
app.get("/api/admin/partners", verifyToken, async (req, res) => {
  try {
    if (req.user.email !== "stockscorcher@gmail.com") return res.status(403).json({ error: "Admin only" });
    const snapshot = await firestore.collection("partners").get();
    const partners = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(partners);
  } catch (error) { res.status(500).json({ error: "Failed to fetch" }); }
});

app.post("/api/admin/approve-partner", verifyToken, async (req, res) => {
  try {
    if (req.user.email !== "stockscorcher@gmail.com") return res.status(403).json({ error: "Admin only" });
    const { partnerId, status, commissionPercentage } = req.body;
    await firestore.collection("partners").doc(partnerId).update({
      status: status,
      commissionPercentage: Number(commissionPercentage) || 20,
      updatedAt: FieldValue.serverTimestamp()
    });
    res.status(200).json({ message: "Updated" });
  } catch (error) { res.status(500).json({ error: "Failed" }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { console.log(`🚀 Server Running on Port ${PORT}`); });