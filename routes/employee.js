const express = require('express');
const router = express.Router();
const controller = require('../controllers/employeeController');
const upload = require('../middleware/upload');

router.post('/', upload.single('image'), controller.createEmployee);
router.get('/', controller.getEmployees);
router.get('/:id', controller.getEmployee);
router.put('/:id', upload.single('image'), controller.updateEmployee);
router.delete('/:id', controller.deleteEmployee);

module.exports = router;