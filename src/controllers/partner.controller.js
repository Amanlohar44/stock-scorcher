const admin = require('firebase-admin');
const db = admin.firestore();

// --- PARTNER FACING APIS ---

exports.applyForPartnership = async (req, res) => {
  try {
    const { uid, email, fullName, phone, promotionMethod, payoutDetails } = req.body;
    
    // Ensure the user submitting matches the authenticated token
    if (req.user.uid !== uid) {
      return res.status(403).json({ error: 'Forbidden: UID mismatch' });
    }

    const partnerRef = db.collection('partners').doc(uid);
    const doc = await partnerRef.get();

    if (doc.exists && doc.data().status !== 'suspended') {
      return res.status(400).json({ error: 'Application already exists' });
    }

    // Generate unique brand-aligned referral code
    const shortUid = uid.substring(0, 6).toUpperCase();
    const referralCode = `SCORCHER-${shortUid}`;

    await partnerRef.set({
      uid,
      email,
      fullName,
      phone,
      promotionMethod,
      payoutDetails,
      referralCode,
      status: 'pending',
      walletBalance: 0,
      totalEarned: 0,
      totalSalesCount: 0,
      appliedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Application Error:', error);
    res.status(500).json({ error: 'Failed to process application' });
  }
};

exports.getDashboardAnalytics = async (req, res) => {
  try {
    const { partnerId } = req.params;
    
    if (req.user.uid !== partnerId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const partnerDoc = await db.collection('partners').doc(partnerId).get();
    
    if (!partnerDoc.exists) {
      return res.status(404).json({ error: 'Partner profile not found' });
    }

    const data = partnerDoc.data();

    // Calculate dynamic conversion rate if needed, here we use base stats
    const clicksSnapshot = await db.collection('referral_clicks').where('partnerId', '==', partnerId).count().get();
    const totalClicks = clicksSnapshot.data().count;
    
    const conversionRate = totalClicks > 0 
      ? ((data.totalSalesCount / totalClicks) * 100).toFixed(2) 
      : 0;

    res.status(200).json({
      walletBalance: data.walletBalance,
      totalEarned: data.totalEarned,
      totalSalesCount: data.totalSalesCount,
      referralCode: data.referralCode,
      status: data.status,
      conversionRate,
      upiId: data.payoutDetails?.upiId || null
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

exports.getSalesHistory = async (req, res) => {
  try {
    const { partnerId } = req.params;

    if (req.user.uid !== partnerId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const salesSnapshot = await db.collection('sales')
      .where('partnerId', '==', partnerId)
      .orderBy('timestamp', 'desc')
      .limit(50)
      .get();

    const sales = salesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()
    }));

    res.status(200).json(sales);
  } catch (error) {
    console.error('Sales History Error:', error);
    res.status(500).json({ error: 'Failed to fetch sales history' });
  }
};

exports.requestWithdrawal = async (req, res) => {
  try {
    const partnerId = req.user.uid;
    const { amount } = req.body;
    const withdrawalAmount = Number(amount);

    if (isNaN(withdrawalAmount) || withdrawalAmount < 500) {
      return res.status(400).json({ error: 'Invalid amount. Minimum withdrawal is ₹500.' });
    }

    const partnerRef = db.collection('partners').doc(partnerId);
    const withdrawalRef = db.collection('withdrawals').doc(); // Auto-generate ID

    // Use a transaction to prevent race conditions allowing users to withdraw more than their balance
    await db.runTransaction(async (transaction) => {
      const partnerDoc = await transaction.get(partnerRef);
      
      if (!partnerDoc.exists) {
        throw new Error('Partner profile not found');
      }

      const currentBalance = partnerDoc.data().walletBalance;

      if (currentBalance < withdrawalAmount) {
        throw new Error('Insufficient wallet balance');
      }

      // Deduct balance
      transaction.update(partnerRef, {
        walletBalance: currentBalance - withdrawalAmount,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Create withdrawal record
      transaction.set(withdrawalRef, {
        withdrawalId: withdrawalRef.id,
        partnerId: partnerId,
        amount: withdrawalAmount,
        payoutDetails: partnerDoc.data().payoutDetails,
        status: 'pending',
        requestedAt: admin.firestore.FieldValue.serverTimestamp(),
        processedAt: null
      });
    });

    res.status(200).json({ message: 'Withdrawal requested successfully' });
  } catch (error) {
    console.error('Withdrawal Error:', error);
    res.status(400).json({ error: error.message || 'Failed to process withdrawal' });
  }
};


// --- ADMIN FACING APIS ---

exports.approvePartner = async (req, res) => {
  try {
    const { targetPartnerId } = req.body;
    
    await db.collection('partners').doc(targetPartnerId).update({
      status: 'approved',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).json({ message: 'Partner approved successfully' });
  } catch (error) {
    console.error('Approval Error:', error);
    res.status(500).json({ error: 'Failed to approve partner' });
  }
};

exports.processWithdrawal = async (req, res) => {
  try {
    const { withdrawalId, action, transactionRef } = req.body; // action: 'completed' or 'rejected'

    const withdrawalRef = db.collection('withdrawals').doc(withdrawalId);
    
    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(withdrawalRef);
      
      if (!doc.exists) throw new Error('Withdrawal not found');
      if (doc.data().status !== 'pending') throw new Error('Withdrawal already processed');

      if (action === 'completed') {
        transaction.update(withdrawalRef, {
          status: 'completed',
          transactionRef: transactionRef || 'Manual Bank Transfer',
          processedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      } else if (action === 'rejected') {
        // Refund the partner's wallet
        const partnerRef = db.collection('partners').doc(doc.data().partnerId);
        const partnerDoc = await transaction.get(partnerRef);
        
        transaction.update(partnerRef, {
          walletBalance: partnerDoc.data().walletBalance + doc.data().amount,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        transaction.update(withdrawalRef, {
          status: 'rejected',
          processedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    });

    res.status(200).json({ message: `Withdrawal ${action} successfully` });
  } catch (error) {
    console.error('Process Withdrawal Error:', error);
    res.status(400).json({ error: error.message || 'Failed to process withdrawal' });
  }
};