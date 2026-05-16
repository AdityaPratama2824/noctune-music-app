const mongoose = require('mongoose');
const PlaylistSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        tracks: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Track',
        }],
        isPublic: {
            type: Boolean,
            default: false,
        },
    },
    {timestamps: true}
);

const Playlist = mongoose.model('Playlist', PlaylistSchema);
module.exports = Playlist;