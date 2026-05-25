const User = require('../models/User');
const YTMusic = require('ytmusic-api');
const ytmusic = new YTMusic();
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/CatchAsync');

let isYTMusicInitialized = false;

const initializeYTMusic = catchAsync(async () => {
    if (!isYTMusicInitialized) {
        try {
            await ytmusic.initialize();
        } catch (err) {
            await ytmusic.default.initialize();
        }
        isYTMusicInitialized = true;
    }
});

const parseArtistName = (track) => {
    if (track.artists && Array.isArray(track.artists) && track.artists.length > 0) {
        return track.artists
            .map(art => {
                if (typeof art === 'object' && art !== null) {
                    return art.name || 'Unknown Artist';
                }
                return art || 'Unknown Artist';
            })
            .filter(Boolean)
            .join(', ');
    } else if (track.artist) {
        return typeof track.artist === 'object' ? track.artist.name : track.artist;
    }
    return 'Unknown Artist';
};

const searchMusic = catchAsync(async (req, res, next) => {
    const { query } = req.query;

    if (!query) {
        return next(new AppError('Please provide a search query', 400));
    }

    await initializeYTMusic();
    const results = await ytmusic.searchSongs(query);
    const safeResults = results || [];

    const tracks = safeResults.map(track => {
        const highestThumbnail = track.thumbnails && track.thumbnails.length > 0 
            ? track.thumbnails[track.thumbnails.length - 1].url 
            : '';

        return {
            youtubeId: track.videoId || '',
            title: track.name || 'Unknown Title',
            artist: parseArtistName(track),
            album: track.album && track.album.name ? track.album.name : 'Single',
            thumbnail: highestThumbnail,
            duration: track.duration || 0,
        };
    });

    if (req.user && tracks.length > 0) { 
        const user = await User.findById(req.user.id);
        if (user) {
            user.recentSearches = user.recentSearches.filter(item => item.toLowerCase() !== query.toLowerCase());
            user.recentSearches.unshift(query);
            if (user.recentSearches.length > 5) user.recentSearches.pop();
            await user.save({ validateBeforeSave: false });
        }
    }

    return res.status(200).json({
        status: 'success',
        results: tracks.length,
        data: { tracks }
    });
});

const getTrendingMusic = catchAsync(async (req, res, next) => {
    await initializeYTMusic();

    const results = await ytmusic.searchSongs("Top Hits Indonesia");
    const safeResults = results || [];
    
    const trendingTracks = safeResults.slice(0, 10).map(track => {
        const highestThumbnail = track.thumbnails && track.thumbnails.length > 0 
            ? track.thumbnails[track.thumbnails.length - 1].url 
            : '';

        return {
            youtubeId: track.videoId || '',
            title: track.name || 'Unknown Title',
            artist: parseArtistName(track),
            album: track.album && track.album.name ? track.album.name : 'Single',
            thumbnail: highestThumbnail,
            duration: track.duration || 0,
        };
    });

    return res.status(200).json({
        status: 'success',
        results: trendingTracks.length,
        data: { tracks: trendingTracks }
    });
});


const getRecentSearches = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('recentSearches');
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    
    res.status(200).json({
        status: 'success',
        data: {
            recentSearches: user.recentSearches
        }
    });
});

const clearRecentSearches = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    user.recentSearches = [];
    await user.save({ validateBeforeSave: false });
    
    res.status(200).json({
        status: 'success',
        message: 'Recent searches cleared successfully',
    });
});

module.exports = {
    searchMusic,
    getTrendingMusic,
    getRecentSearches,
    clearRecentSearches,
};