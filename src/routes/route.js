const express = require('express');
const router = express.Router();


const { register, login, getMe, refreshAccessToken, logout } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.midlleware');
router.get(
    '/admin-test',
    authenticate,
    authorize('admin'),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: 'Welcome Admin!'
        });
    }
);
router.get('/me', authenticate, getMe);

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshAccessToken);

router.post('/logout', authenticate, logout);

module.exports = router;