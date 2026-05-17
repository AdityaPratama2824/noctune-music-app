const express = require('express');
const { createPlaylist, getMyPlaylists, updatePlaylist, deletePlaylist, addTrackToPlaylist, removeTrackFromPlaylist} = require('../controllers/playlistController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createPlaylist);
router.get('/my', protect, getMyPlaylists);
router.put('/:id', protect, updatePlaylist);
router.delete('/:id', protect, deletePlaylist);
router.post('/:id/tracks', protect, addTrackToPlaylist);
router.delete('/:id/tracks/:deezerId', protect, removeTrackFromPlaylist);

module.exports = router;