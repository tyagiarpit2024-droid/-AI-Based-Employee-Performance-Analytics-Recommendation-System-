const express = require('express');
const router = express.Router();
const { getRecommendation } = require('../controllers/aiController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.post('/recommend', protect, getRecommendation);

module.exports = router;
