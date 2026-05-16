const mongoose = require('mongoose');
const { unique } = require('next/dist/build/utils');
const validator = require('validator');

const UserSchema = new mongoose.Schema( 
    {
username: {
    type: String,
    required: true,
},
email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true,
    validate: {
        validator: validator.isEmail,
        message: 'Please enter a valid email'
    }
    },
password: {
    type: String,
    required: true,
    minlength: 6,   
},
recentsSearches: {
        type: [String], // Array of strings to store recent search queries
        default: [], // Default to an empty array
    },
},
{ timestamps: true }
)

const User = mongoose.model('User', UserSchema);
module.exports = User;