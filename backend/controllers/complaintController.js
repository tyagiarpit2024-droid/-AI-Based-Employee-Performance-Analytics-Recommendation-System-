const Complaint = require('../models/Complaint');

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    next(err);
  }
};

// @desc    Search complaints by location
// @route   GET /api/complaints/search
// @access  Private
const searchComplaintsByLocation = async (req, res, next) => {
  try {
    const location = req.query.location;
    const complaints = await Complaint.find({ 
      location: { $regex: location, $options: 'i' } 
    }).sort({ createdAt: -1 });
    
    res.json(complaints);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      res.status(404);
      throw new Error('Complaint not found');
    }
    res.json(complaint);
  } catch (err) {
    next(err);
  }
};

// @desc    Create a complaint
// @route   POST /api/complaints
// @access  Private
const createComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.create(req.body);
    res.status(201).json(complaint);
  } catch (err) {
    next(err);
  }
};

// @desc    Update a complaint
// @route   PUT /api/complaints/:id
// @access  Private
const updateComplaint = async (req, res, next) => {
  try {
    let complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      res.status(404);
      throw new Error('Complaint not found');
    }

    complaint = await Complaint.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true, runValidators: true }
    );

    res.json(complaint);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a complaint
// @route   DELETE /api/complaints/:id
// @access  Private
const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      res.status(404);
      throw new Error('Complaint not found');
    }

    await complaint.deleteOne();
    res.json({ message: 'Complaint removed' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getComplaints,
  searchComplaintsByLocation,
  getComplaintById,
  createComplaint,
  updateComplaint,
  deleteComplaint
};
