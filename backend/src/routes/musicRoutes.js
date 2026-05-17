const express = require('express');
const { searchMusic } = require('../controllers/musicController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();


router.get('/search', protect, searchMusic);

module.exports = router;