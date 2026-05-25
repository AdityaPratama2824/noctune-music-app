const Playlist = require('../models/playlist');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/CatchAsync');

const createPlaylist = catchAsync(async (req, res, next) => {
    const { name, description } = req.body;

    const playlist = await Playlist.create({
        name,
        description,
        user: req.user.id,
    });

    res.status(201).json({
        status: 'success',
        message: 'Playlist created successfully',
        data: {
            playlist,
        },
    });
});

const getMyPlaylists = catchAsync(async (req, res, next) => {
    const playlists = await Playlist.find({ user: req.user.id });
    res.status(200).json({
        status: 'success',
        results: playlists.length,
        data: {
            playlists,
        },
    });
});

const updatePlaylist = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const playlist = await Playlist.findOne({ _id: id, user: req.user.id });

    if (!playlist) {
        throw new AppError('Playlist not found or you do not have permission to update it', 404);
    }
    playlist.name = name || playlist.name;
    playlist.description = description || playlist.description;
    await playlist.save();
    res.status(200).json({
        status: 'success',
        message: 'Playlist updated successfully',
        data: {
            playlist,
        },
    });
});

const deletePlaylist = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const playlist = await Playlist.findOneAndDelete({ _id: id, user: req.user.id });
    if (!playlist) {
        throw new AppError('Playlist not found or you do not have permission to delete it', 404);
    }
    res.status(200).json({
        status: 'success',
        message: 'Playlist deleted successfully',
    });
});

const addTrackToPlaylist = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { youtubeId, title, artist, thumbnail, duration } = req.body;
    const playlist = await Playlist.findOne({ _id: id, user: req.user.id });
    if (!playlist) {
        throw new AppError('Playlist not found or you do not have permission to modify it', 404);
    }
    const isTrackExist = playlist.tracks.find(track => track.youtubeId === youtubeId);
    if (isTrackExist) {
        throw new AppError('Track already exists in the playlist', 400);
    }
    playlist.tracks.push({ youtubeId, title, artist, thumbnail, duration });

    await playlist.save();

    res.status(200).json({
        status: 'success',
        message: 'Track added to playlist successfully',
        data: {
            playlist,
        },
    });
});


const removeTrackFromPlaylist = catchAsync(async (req, res, next) => {
    const { id, youtubeId } = req.params;
    const playlist = await Playlist.findOne({ _id: id, user: req.user.id });
    if (!playlist) {
        throw new AppError('Playlist not found or you do not have permission to modify it', 404);
    }
    const initialLength = playlist.tracks.length;   
    playlist.tracks = playlist.tracks.filter(track => track.youtubeId.toString() !== youtubeId.toString());
    if (playlist.tracks.length === initialLength) {
        throw new AppError('Song not found in the playlist', 404);
    }

    await playlist.save();
    res.status(200).json({
        status: 'success',
        message: 'Track removed from playlist successfully',
        data: {
            playlist,
        },
    });
});

module.exports = {
    createPlaylist,
    getMyPlaylists,
    updatePlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
};