const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const { getDashboardSummary } = require('../controllers/dashboardController');

router.get('/', protect, getDashboardSummary);

module.exports = router;
