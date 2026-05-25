const express = require('express');
const router = express.Router();
const { searchMusic, getTrendingMusic, getRecentSearches, clearRecentSearches } = require('../controllers/musicController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');
module.exports = router;

router.get('/search', optionalProtect, searchMusic);
router.get('/trending', getTrendingMusic);
router.get('/recent-searches', protect, getRecentSearches);
router.delete('/recent-searches', protect, clearRecentSearches);