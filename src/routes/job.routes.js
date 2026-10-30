const express = require('express');
const router = express.Router();

const {
    createJob,
    getMyJobs,
    closeJob,
    getAllJobs,
    getJobById
} = require('../controllers/job.controller');

const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.midlleware');
router.get('/', getAllJobs);

// Keep the specific route before /:jobId so Express does not treat
// 'my-jobs' as a job ID.
router.get('/my-jobs', authenticate, authorize('recruiter'), getMyJobs);

router.get('/:jobId', getJobById);

router.post('/', authenticate, authorize('recruiter'), createJob);

router.patch('/:jobId/close', authenticate, authorize('recruiter'), closeJob);

module.exports = router;