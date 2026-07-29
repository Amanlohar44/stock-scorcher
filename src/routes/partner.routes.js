const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partnerController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// ==========================================
// PARTNER FACING ROUTES (Requires standard Auth)
// ==========================================

// Apply for partnership
router.post('/apply', verifyToken, partnerController.applyForPartnership);

// Get Partner Dashboard Analytics
router.get('/analytics/:partnerId', verifyToken, partnerController.getDashboardAnalytics);

// Get Partner Sales History
router.get('/sales/:partnerId', verifyToken, partnerController.getSalesHistory);

// Request a payout
router.post('/withdraw', verifyToken, partnerController.requestWithdrawal);


// ==========================================
// ADMIN FACING ROUTES (Requires Admin Auth)
// ==========================================

// Approve a pending partner
router.post('/admin/approve', verifyToken, verifyAdmin, partnerController.approvePartner);

// Mark a withdrawal as completed/rejected (Updates Ledger)
router.post('/admin/withdrawal/process', verifyToken, verifyAdmin, partnerController.processWithdrawal);


module.exports = router;