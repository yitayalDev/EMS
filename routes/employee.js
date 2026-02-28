const express = require('express');
const router = express.Router();
const controller = require('../controllers/employeeController');
const upload = require('../middleware/upload');

const { protect, authorize, authorizeOrPermission } = require('../middleware/authMiddleware');

router.get('/ping', (req, res) => res.json({ message: 'Employee Route Active', version: '1.3' }));

router.post('/', protect, authorize('admin'), upload.single('image'), controller.createEmployee);
router.get('/', protect, authorize('admin'), controller.getEmployees);
router.get('/:id', protect, authorize('admin'), controller.getEmployee);
router.put('/:id', protect, authorize('admin'), upload.single('image'), controller.updateEmployee);
router.delete('/:id', protect, authorize('admin'), controller.deleteEmployee);

module.exports = router;