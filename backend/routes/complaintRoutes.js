const express = require('express');
const router = express.Router();
const {
  getComplaints,
  searchComplaintsByLocation,
  getComplaintById,
  createComplaint,
  updateComplaint,
  deleteComplaint
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');

// Route order matters: specific routes (/search) must come before parameterized routes (/:id)
router.route('/').get(protect, getComplaints).post(protect, createComplaint);
router.route('/search').get(protect, searchComplaintsByLocation);
router.route('/:id').get(protect, getComplaintById).put(protect, updateComplaint).delete(protect, deleteComplaint);

module.exports = router;
