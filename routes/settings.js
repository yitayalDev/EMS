const router = require('express').Router();
const { changePassword } = require('../controllers/settingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/change-password', protect, changePassword);

module.exports = router;
