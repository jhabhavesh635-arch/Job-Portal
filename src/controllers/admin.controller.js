const User = require('../models/user');
const Company = require('../models/company');

// Get all users
const getAllUsers = async(req, res) => {
    try {
        const users = await User.find().select('-password');

        return res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Change user role
const changeUserRole = async(req, res) => {
    try {
        const { role } = req.body;

        const allowedRoles = ['candidate', 'recruiter', 'admin'];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role'
            });
        }

        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.role = role;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'User role updated',
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
            message: 'Server error'
        });
    }
};

// Block or unblock user
const updateUserBlockStatus = async(req, res) => {
    try {
        const { isBlocked } = req.body;

        if (typeof isBlocked !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'isBlocked must be true or false'
            });
        }

        if (req.params.userId === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Admin cannot block their own account'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.userId, { isBlocked }, { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: isBlocked ? 'User blocked' : 'User unblocked',
            user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Verify company
const verifyCompany = async(req, res) => {
    try {
        const company = await Company.findByIdAndUpdate(
            req.params.companyId, { isVerified: true }, { new: true }
        );

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Company verified successfully',
            company
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = {
    getAllUsers,
    changeUserRole,
    updateUserBlockStatus,
    verifyCompany
};