const router = require('express').Router();
const controller = require('../controllers/employeeController');
const { protect, authorize, checkPermission, authorizeOrPermission } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../public/upload')),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.post('/', protect, authorizeOrPermission(['admin', 'hr'], 'manage_users'), upload.single('image'), controller.createEmployee);
router.get('/', protect, authorize('admin', 'hr', 'it_admin'), controller.getEmployees);
router.get('/:id', protect, authorize('admin', 'hr', 'it_admin', 'employee'), controller.getEmployee);
router.put('/:id', protect, authorizeOrPermission(['admin', 'hr'], 'manage_users'), upload.single('image'), controller.updateEmployee);
router.put('/:id/permissions', protect, authorize('admin'), controller.updatePermissions);
router.delete('/:id', protect, authorizeOrPermission(['admin', 'it_admin'], 'delete_records'), controller.deleteEmployee);

module.exports = router;
