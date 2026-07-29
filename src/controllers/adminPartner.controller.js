const admin = require('firebase-admin');
const db = admin.firestore();

// 1. Fetch All Partners (For Admin Table)
exports.getAllPartners = async (req, res) => {
  try {
    const snapshot = await db.collection('partners').orderBy('createdAt', 'desc').get();
    
    const partners = [];
    snapshot.forEach((doc) => {
      partners.push({ id: doc.id, ...doc.data() });
    });

    return res.status(200).json({ success: true, data: partners });
  } catch (error) {
    console.error('Error fetching all partners:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// 2. Update Partner Status (Approve / Reject / Suspend)
exports.updatePartnerStatus = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const { status } = req.body; // 'approved', 'rejected', 'suspended'

    if (!['approved', 'rejected', 'suspended'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    await db.collection('partners').doc(partnerId).update({ status });

    return res.status(200).json({ success: true, message: `Partner status updated to ${status}` });
  } catch (error) {
    console.error('Error updating partner status:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// 3. Update Partner Level & Commission
exports.updatePartnerLevel = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const { level, commissionRate } = req.body; 

    // Validate level
    if (!['starter', 'silver', 'gold', 'elite'].includes(level)) {
      return res.status(400).json({ success: false, message: 'Invalid level' });
    }

    await db.collection('partners').doc(partnerId).update({ 
      level, 
      commissionRate: Number(commissionRate) 
    });

    return res.status(200).json({ success: true, message: 'Partner level and commission updated' });
  } catch (error) {
    console.error('Error updating partner level:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};