const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/CatchAsync');

const protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        throw new AppError('Not authorized, token missing', 401);
    }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'noctune_secret');
        const user = await User.findById(decoded.UserId).select('-password');
        if (!user) {
            throw new AppError('User not found', 401);
        }   
        req.user = user;
        next();
    });

    const optionalProtect = catchAsync(async (req, res, next) => {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return next();
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'noctune_secret');
            const CurrentUser = await User.findById(decoded.UserId);

            if (CurrentUser) {
                req.user = CurrentUser;
            }
        } catch (err) {
            req.user = undefined;
        }
            next();
        });

module.exports = { protect, optionalProtect };