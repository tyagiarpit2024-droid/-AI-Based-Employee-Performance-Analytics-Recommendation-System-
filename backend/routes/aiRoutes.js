const express = require('express');
const router = express.Router();
const { getAIRecommendations } = require('../controllers/aiController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.post('/recommend', protect, getAIRecommendations);

module.exports = router;
