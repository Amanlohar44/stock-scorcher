const express = require('express');
const router = express.Router();
const adminPartnerController = require('../controllers/adminPartner.controller');

// Dhyan de: Hamesha check karein ki jo user ye API call kar raha hai wo ADMIN hai.
// const adminMiddleware = require('../middleware/admin.middleware');
// router.use(adminMiddleware); // Apply to all routes below

// GET: Fetch all partners
router.get('/all', adminPartnerController.getAllPartners);

// PATCH: Approve or Reject a partner
router.patch('/:partnerId/status', adminPartnerController.updatePartnerStatus);

// PATCH: Change partner level (Starter/Gold) and Commission
router.patch('/:partnerId/level', adminPartnerController.updatePartnerLevel);

module.exports = router;