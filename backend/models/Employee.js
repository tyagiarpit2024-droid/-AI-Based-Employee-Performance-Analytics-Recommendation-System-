const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true
  },
  department: {
    type: String,
    required: [true, 'Please add a department']
  },
  skills: {
    type: [String],
    required: [true, 'Please add skills']
  },
  performanceScore: {
    type: Number,
    required: [true, 'Please add a performance score'],
    min: 1,
    max: 100
  },
  experience: {
    type: Number,
    required: [true, 'Please add experience in years']
  }
}, {
  timestamps: true
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
