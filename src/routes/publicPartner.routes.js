const express = require('express');
const router = express.Router();
const publicPartnerController = require('../controllers/publicPartner.controller');

// GET: /api/v1/public/partners/leaderboard
router.get('/leaderboard', publicPartnerController.getLeaderboard);

// GET: /api/v1/public/partners/profile/:partnerId
router.get('/profile/:partnerId', publicPartnerController.getPartnerProfile);

module.exports = router;