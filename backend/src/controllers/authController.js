const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const register = catchAsync(async (req, res, next) => {
    const { username, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ username, email, password: hashedPassword });

    
    const token = jwt.sign(
        {
            UserId: user.id,
            email: user.email,
        },
        process.env.JWT_SECRET, {
            expiresIn: '1h',
        },
    );
    
    return res.status(201).json({
        status: 'success',
        message: 'Registration successfully',
        data: {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
            token,
        },
    });
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        throw new AppError('Invalid email or password', 401);
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        throw new AppError('Incorrect password', 401);
    }
    const token = jwt.sign(
        {
            UserId: user.id,
            email: user.email,
        },
        process.env.JWT_SECRET, {
            expiresIn: '1h',
        },
    );
    return res.status(200).json({
        status: 'success',
        message: 'Login successfully',
        data: {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
            token,
        },
    });
});

module.exports = {
    register,
    login,
};