const admin = require('firebase-admin');
const db = admin.firestore();

// 1. Fetch Top 10 Partners for Leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    // Sort by revenue generated (Top performers first)
    const snapshot = await db.collection('partners')
      .where('status', '==', 'approved')
      .orderBy('metrics.revenueGenerated', 'desc')
      .limit(10)
      .get();

    const leaderboard = [];
    let rank = 1;

    snapshot.forEach((doc) => {
      const data = doc.data();
      leaderboard.push({
        rank: rank++,
        partnerId: data.partnerId,
        name: data.personalInfo.name,
        level: data.level,
        revenue: data.metrics.revenueGenerated,
        sales: data.metrics.totalSales
      });
    });

    return res.status(200).json({ success: true, data: leaderboard });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// 2. Fetch Public Profile for a specific partner
exports.getPartnerProfile = async (req, res) => {
  try {
    const { partnerId } = req.params;

    const snapshot = await db.collection('partners')
      .where('partnerId', '==', partnerId)
      .where('status', '==', 'approved')
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ success: false, message: 'Verified Partner not found' });
    }

    const data = snapshot.docs[0].data();

    // Send only public safe data
    const publicProfile = {
      partnerId: data.partnerId,
      name: data.personalInfo.name,
      instagram: data.socialLinks.instagram,
      level: data.level,
      studentsReferred: data.metrics.totalSales,
      joinedAt: data.createdAt
    };

    return res.status(200).json({ success: true, data: publicProfile });
  } catch (error) {
    console.error('Error fetching partner profile:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};