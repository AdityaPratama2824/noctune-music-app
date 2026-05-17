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
        deezerId: track.id,
        title: track.title,
        artist: track.artist.name,
        album: track.album.title,
        cover: track.album.cover_medium,
        preview: track.preview,
        duration: track.duration,
    }));
    return res.status(200).json({
        success: true,
        results: tracks.length,
        data: tracks,
    });
});

const getTrendingMusic = catchAsync(async (req, res, next) => {
    const response = await axios.get('https://api.deezer.com/chart/0/tracks');
if (!response.data || !response.data.data) {
        throw new AppError('Failed to fetch trending music data', 500);
    }

    const trendingTracks = response.data.data.map((track) => ({
        deezerId: track.id,
        title: track.title,
        artist: track.artist.name,
        album: track.album.title,
        cover: track.album.cover_medium,
        preview: track.preview,
        duration: track.duration,
    }));
    return res.status(200).json({
        success: true,
        results: trendingTracks.length,
        data: trendingTracks,
    });
});

module.exports = { searchMusic, getTrendingMusic };