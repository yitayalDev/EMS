const router = require('express').Router();
const { getSalaries, createSalary, getMySalary } = require('../controllers/salaryController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Admin routes
router.get('/', protect, authorize('admin'), getSalaries);
router.post('/', protect, authorize('admin'), createSalary);

// Employee route
router.get('/my', protect, authorize('employee'), getMySalary); // ✅ employee only

module.exports = router;
