const admin = require('firebase-admin');

// Verify standard user token
exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    return res.status(403).json({ error: 'Unauthorized: Invalid token' });
  }
};

// Verify admin status (Checks custom claims or a specific Firestore users collection)
exports.verifyAdmin = async (req, res, next) => {
  try {
    const userDoc = await admin.firestore().collection('users').doc(req.user.uid).get();
    
    if (!userDoc.exists || userDoc.data().isAdmin !== true) {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
    next();
  } catch (error) {
    console.error('Admin Verification Error:', error);
    return res.status(500).json({ error: 'Internal server error during authorization' });
  }
};