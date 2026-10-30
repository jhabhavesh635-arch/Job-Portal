const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const RefreshToken = require('../models/refreshtoken');
const register = async(req, res) => {
    try {
        const { name, password } = req.body;
        const normalizedEmail = req.body.email?.trim().toLowerCase();

        if (!name || !normalizedEmail || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            role: 'candidate'
        });

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
};
const login = async(req, res) => {
    try {
        const { password } = req.body;
        const normalizedEmail = req.body.email?.trim().toLowerCase();

        if (!normalizedEmail || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        if (user.isBlocked) {
            return res.status(403).json({
                success: false,
                message: 'Your account is blocked'
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const accessToken = jwt.sign({
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET, { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign({
                userId: user._id
            },
            process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' }
        );

        const tokenHash = crypto
            .createHash('sha256')
            .update(refreshToken)
            .digest('hex');

        await RefreshToken.create({
            user: user._id,
            tokenHash,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
};
const getMe = async(req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: 'User profile fetched successfully',
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch profile'
        });
    }
};
// Generate new access token using refresh token
const refreshAccessToken = async(req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token required'
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const tokenHash = crypto
            .createHash('sha256')
            .update(refreshToken)
            .digest('hex');

        const storedToken = await RefreshToken.findOne({
            user: decoded.userId,
            tokenHash,
            expiresAt: { $gt: new Date() }
        });

        if (!storedToken) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }

        const user = await User.findById(decoded.userId);

        if (!user || user.isBlocked) {
            await RefreshToken.deleteOne({ _id: storedToken._id });

            return res.status(401).json({
                success: false,
                message: 'User not found or blocked'
            });
        }

        const accessToken = jwt.sign({
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET, { expiresIn: '15m' }
        );

        return res.status(200).json({
            success: true,
            message: 'New access token generated',
            accessToken
        });

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired refresh token'
        });
    }
};


// Logout and invalidate refresh token
const logout = async(req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token required'
            });
        }

        const tokenHash = crypto
            .createHash('sha256')
            .update(refreshToken)
            .digest('hex');

        await RefreshToken.deleteOne({
            user: req.user._id,
            tokenHash
        });

        return res.status(200).json({
            success: true,
            message: 'Logout successful'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
module.exports = { register, login, getMe, refreshAccessToken, logout };