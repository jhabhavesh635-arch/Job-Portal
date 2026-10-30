const express = require('express');
const router = express.Router();

const { createCompany } = require('../controllers/company.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.midlleware');

router.post(
    '/',
    authenticate,
    authorize('recruiter'),
    createCompany
);

module.exports = router;