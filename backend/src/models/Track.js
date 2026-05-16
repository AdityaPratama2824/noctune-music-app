const mongoose = require('mongoose');

const TrackSchema = new mongoose.Schema(
    {
        deezerId: {
            type: Number,
            required: true,
            unique: true,
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
    },
    cover: {
        type: String,
    },
    preview: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    likesCount: {
        type: Number,
        default: 0,
    },
}
    )
TrackSchema.pre('save', function (next) {
        this.likesCount = this.likedBy.length;
        next();
    });

const Track = mongoose.model('Track', TrackSchema);
module.exports = Track;