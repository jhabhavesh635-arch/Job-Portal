const express = require('express');
const router = express.Router();

const {
    getAllUsers,
    changeUserRole,
    updateUserBlockStatus,
    verifyCompany
} = require('../controllers/admin.controller');

const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.midlleware');

router.use(authenticate, authorize('admin'));

router.get('/users', getAllUsers);

router.patch('/users/:userId/role', changeUserRole);

router.patch('/users/:userId/block', updateUserBlockStatus);

router.patch('/companies/:companyId/verify', verifyCompany);

module.exports = router;