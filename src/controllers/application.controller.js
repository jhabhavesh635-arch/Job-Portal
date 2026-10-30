const Application = require('../models/application');
const Job = require('../models/job');
const applyForJob = async(req, res) => {
    try {
        const { jobId } = req.params;
        const { resume, coverLetter } = req.body;

        if (typeof resume !== 'string' || !resume.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Resume is required'
            });
        }

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }
        if (job.status !== 'open') {
            return res.status(400).json({
                success: false,
                message: 'This job is not open for applications'
            });
        }
        const existingApplication = await Application.findOne({
            job: jobId,
            candidate: req.user._id
        });

        if (existingApplication) {
            return res.status(409).json({
                success: false,
                message: 'You have already applied for this job'
            });
        }
        const application = await Application.create({
            job: jobId,
            candidate: req.user._id,
            resume,
            coverLetter
        });
        return res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            application
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'You have already applied for this job'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
const getApplicants = async(req, res) => {
    try {
        const job = await Job.findOne({
            _id: req.params.jobId,
            recruiter: req.user._id
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        const applications = await Application.find({
            job: job._id
        }).populate('candidate', 'name email');

        return res.status(200).json({
            success: true,
            count: applications.length,
            applications
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
const updateApplicationStatus = async(req, res) => {
    try {
        const { status } = req.body;

        const allowedStatus = ['shortlisted', 'rejected', 'accepted'];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid application status'
            });
        }

        const application = await Application.findById(req.params.applicationId)
            .populate('job');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        if (!application.job) {
            return res.status(404).json({
                success: false,
                message: 'Related job not found'
            });
        }

        if (application.job.recruiter.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You cannot update this application'
            });
        }

        application.status = status;
        await application.save();

        return res.status(200).json({
            success: true,
            message: 'Application status updated',
            application
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
const getMyApplications = async(req, res) => {
    try {
        const applications = await Application.find({
                candidate: req.user._id
            })
            .populate({
                path: 'job',
                select: 'title location salary status',
                populate: {
                    path: 'company',
                    select: 'name'
                }
            });

        return res.status(200).json({
            success: true,
            count: applications.length,
            applications
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
module.exports = { applyForJob, getApplicants, updateApplicationStatus, getMyApplications };