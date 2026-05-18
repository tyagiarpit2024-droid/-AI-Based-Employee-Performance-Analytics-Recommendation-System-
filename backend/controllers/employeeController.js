const Employee = require('../models/Employee.js');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
const getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find({});
    res.status(200).json(employees);
  } catch (error) {
    next(error);
  }
};

// @desc    Search employees by department
// @route   GET /api/employees/search
// @access  Private
const searchEmployees = async (req, res, next) => {
  try {
    const { department } = req.query;
    if (!department) {
      res.status(400);
      throw new Error('Department query parameter is required');
    }
    // Case-insensitive search
    const employees = await Employee.find({ department: { $regex: new RegExp(department, 'i') } });
    res.status(200).json(employees);
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new employee
// @route   POST /api/employees
// @access  Private
const addEmployee = async (req, res, next) => {
  try {
    const { name, email, department, skills, performanceScore, experience } = req.body;

    if (!name || !email || !department || !skills || !performanceScore || !experience) {
      res.status(400);
      throw new Error('Please add all required fields');
    }

    const employeeExists = await Employee.findOne({ email });
    if (employeeExists) {
      res.status(400);
      throw new Error('Employee with this email already exists');
    }

    const employee = await Employee.create({
      name,
      email,
      department,
      skills,
      performanceScore,
      experience
    });

    res.status(201).json(employee);
  } catch (error) {
    next(error);
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private
const updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      res.status(404);
      throw new Error('Employee not found');
    }

    // Check if updating email to one that already exists
    if (req.body.email && req.body.email !== employee.email) {
      const emailExists = await Employee.findOne({ email: req.body.email });
      if (emailExists) {
        res.status(400);
        throw new Error('Email already in use by another employee');
      }
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedEmployee);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private
const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      res.status(404);
      throw new Error('Employee not found');
    }

    await employee.deleteOne();

    res.status(200).json({ id: req.params.id, message: 'Employee deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployees,
  searchEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee
};
