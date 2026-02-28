const router = require('express').Router();
const {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
} = require('../controllers/departmentController');
const { protect, authorize, authorizeOrPermission } = require('../middleware/authMiddleware');

// -------------------- Admin + Employee + HR + IT --------------------
router.get('/', protect, authorize('admin', 'employee', 'hr', 'it_admin'), getDepartments);

// -------------------- Admin + HR + IT --------------------
router.post('/', protect, authorize('admin', 'hr', 'it_admin'), createDepartment);
router.put('/:id', protect, authorize('admin', 'hr', 'it_admin'), updateDepartment);
router.delete('/:id', protect, authorizeOrPermission(['admin'], 'delete_records'), deleteDepartment);

module.exports = router;
