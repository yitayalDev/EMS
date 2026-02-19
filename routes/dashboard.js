const router = require('express').Router();
const {
  getAdminSummary,
  getEmployeeSummary,
  getChartData
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/admin', protect, authorize('admin'), getAdminSummary);
router.get('/charts', protect, authorize('admin'), getChartData);
router.get('/employee/:employeeId', protect, authorize('employee'), getEmployeeSummary);

module.exports = router;
