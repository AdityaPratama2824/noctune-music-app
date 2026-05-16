const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        const dbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/noctune';
        await mongoose.connect(dbUri);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = { connectDB };