const router = require('express').Router();
const { getSalaries, createSalary, getMySalary } = require('../controllers/salaryController');
const { protect, authorize, authorizeOrPermission } = require('../middleware/authMiddleware');

// Admin routes
router.get('/', protect, authorizeOrPermission(['admin', 'hr', 'finance'], 'view_salary'), getSalaries);
router.post('/', protect, authorizeOrPermission(['admin', 'hr', 'finance'], 'manage_salary'), createSalary);

// Employee route
router.get('/my', protect, authorize('employee'), getMySalary); // ✅ employee only

module.exports = router;
