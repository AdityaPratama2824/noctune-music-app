const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Playlist name is required.'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Playlist must have an owner (User).'],
        },

tracks: [
    {
        youtubeId: {
            type: String,
            required: [true, 'YouTube ID is required!']
        },
        title: {
            type: String,
            required: [true, 'Title is required!']
        },
        artist: {
            type: String,
            required: [true, 'Artist is required!']
        },
        thumbnail: {
            type: String,
            default: ''
        },
        duration: {
            type: Number,
            default: 0
        }
    }
]
    },
    {
        timestamps: true,
    }
);
const Playlist = mongoose.model('Playlist', PlaylistSchema);
module.exports = Playlist;