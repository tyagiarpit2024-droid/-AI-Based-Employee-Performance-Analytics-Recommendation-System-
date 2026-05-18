const express = require('express');
const router = express.Router();
const {
  getEmployees,
  searchEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController.js');
const { protect } = require('../middleware/authMiddleware.js');

// Protect all employee routes
router.use(protect);

router.route('/')
  .get(getEmployees)
  .post(addEmployee);

router.get('/search', searchEmployees);

router.route('/:id')
  .put(updateEmployee)
  .delete(deleteEmployee);

module.exports = router;
