const axios = require('axios');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const searchMusic = catchAsync(async (req, res, next) => {
    const { q } = req.query;
    if (!q) {
        throw new AppError('Query parameter is required ?q=keyword', 400);
    }
    const response = await axios.get(`https://api.deezer.com/search?q=${encodeURIComponent(q)}`);
if (!response.data || !response.data.data) {
        throw new AppError('Failed to fetch music data', 500);
    }
const tracks = response.data.data.map((track) => ({
        id: track.id,
        title: track.title,
        duration: track.duration,
        preview: track.preview,
        artist: {
            id: track.artist.id,
            name: track.artist.name,
        },
        album: {
            id: track.album.id,
            title: track.album.title,
            cover: track.album.cover,
        },
    }));
    return res.status(200).json({
        success: true,
        results: tracks.length,
        data: tracks,
    });
});

module.exports = {
    searchMusic,
};