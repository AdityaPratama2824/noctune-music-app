const express = require('express');
const { searchMusic, getTrendingMusic } = require('../controllers/musicController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();


router.get('/search', protect, searchMusic);
router.get('/trending', protect, getTrendingMusic);

module.exports = router;