const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware to protect routes
exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route, no token'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.userId);

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'No user found with this id'
            });
        }

        next();

    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Not authorized to access this route, token failed'
        });
    }
};