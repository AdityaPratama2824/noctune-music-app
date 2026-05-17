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
                deezerId: {
                    type: String, 
                    required: true,
                },
                title: {
                    type: String,
                    required: true,
                },
                artist: {
                    type: String,
                    required: true,
                },
                album: {
                    type: String,
                    required: true,
                },
                cover: {
                    type: String, 
                },
                preview: {
                    type: String, 
                },
                duration: {
                    type: Number, 
                },
                addedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);
const Playlist = mongoose.model('Playlist', PlaylistSchema);
module.exports = Playlist;