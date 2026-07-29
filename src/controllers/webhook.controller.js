const crypto = require('crypto');
const admin = require('firebase-admin');

const db = admin.firestore();

// Commission configuration for Stock Scorcher Courses
const COMMISSION_RATES = {
  'course_basic': 0.20, // 20%
  'course_pro': 0.30,   // 30%
};

exports.handleRazorpayWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'];

  try {
    // 1. Verify Razorpay Signature
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest !== signature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = req.body.event;
    
    if (event === 'order.paid') {
      const paymentData = req.body.payload.payment.entity;
      const orderId = paymentData.order_id;
      const amountPaid = paymentData.amount / 100; // Convert paise to INR
      
      // Notes must contain the partnerId and courseId passed during checkout
      const partnerId = paymentData.notes.partnerId;
      const courseId = paymentData.notes.courseId;

      if (!partnerId) {
        // Organic sale, no commission required
        return res.status(200).json({ status: 'ignored - no partner' });
      }

      const commissionRate = COMMISSION_RATES[courseId] || 0.10; // Default 10%
      const commissionAmount = amountPaid * commissionRate;

      // 2. Execute Firestore Transaction for Data Integrity
      const partnerRef = db.collection('partners').doc(partnerId);
      const saleRef = db.collection('sales').doc(orderId);

      await db.runTransaction(async (transaction) => {
        const partnerDoc = await transaction.get(partnerRef);
        
        if (!partnerDoc.exists) {
          throw new Error('Partner does not exist');
        }

        const saleDoc = await transaction.get(saleRef);
        if (saleDoc.exists) {
          throw new Error('Sale already processed');
        }

        // Calculate new balance
        const currentBalance = partnerDoc.data().walletBalance || 0;
        const currentTotal = partnerDoc.data().totalEarned || 0;

        // Record the sale
        transaction.set(saleRef, {
          orderId: orderId,
          partnerId: partnerId,
          courseId: courseId,
          amountPaid: amountPaid,
          commissionAmount: commissionAmount,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          status: 'successful'
        });

        // Update Partner Wallet
        transaction.update(partnerRef, {
          walletBalance: currentBalance + commissionAmount,
          totalEarned: currentTotal + commissionAmount,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });

      return res.status(200).json({ status: 'commission_processed' });
    }

    res.status(200).json({ status: 'ignored' });

  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).json({ error: 'Internal server error processing webhook' });
  }
};