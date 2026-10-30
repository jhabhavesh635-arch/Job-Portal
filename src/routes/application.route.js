const express = require('express');
const router = express.Router();

const { applyForJob, getApplicants, updateApplicationStatus, getMyApplications } = require('../controllers/application.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.midlleware');
router.post(
    '/apply/:jobId',
    authenticate,
    authorize('candidate'),
    applyForJob
);
router.get(
    '/:jobId/applicants',
    authenticate,
    authorize('recruiter'),
    getApplicants
);
router.patch(
    '/:applicationId/status',
    authenticate,
    authorize('recruiter'),
    updateApplicationStatus
);
router.get(
    '/my-applications',
    authenticate,
    authorize('candidate'),
    getMyApplications
);
module.exports = router;