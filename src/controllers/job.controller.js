const Job = require('../models/job');
const Company = require('../models/company');
const createJob = async(req, res) => {
    try {
        const {
            title,
            description,
            location,
            salary,
            jobType,
            skills,
            companyId
        } = req.body;

        if (!title || !description || !location || !companyId) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required job details'
            });
        }

        const company = await Company.findOne({
            _id: companyId,
            recruiter: req.user._id
        });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }

        if (!company.isVerified) {
            return res.status(403).json({
                success: false,
                message: 'Your company is not verified yet'
            });
        }

        const job = await Job.create({
            title,
            description,
            location,
            salary,
            jobType,
            skills,
            company: company._id,
            recruiter: req.user._id
        });

        return res.status(201).json({
            success: true,
            message: 'Job created successfully',
            job
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
const getMyJobs = async(req, res) => {
    try {
        const jobs = await Job.find({
            recruiter: req.user._id
        }).populate('company', 'name');

        return res.status(200).json({
            success: true,
            count: jobs.length,
            jobs
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
const closeJob = async(req, res) => {
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

        job.status = 'closed';
        await job.save();

        return res.status(200).json({
            success: true,
            message: 'Job closed successfully',
            job
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
const getAllJobs = async(req, res) => {
    try {
        const jobs = await Job.find({ status: 'open' })
            .populate('company', 'name description')
            .select('-__v');

        return res.status(200).json({
            success: true,
            count: jobs.length,
            jobs
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
const getJobById = async(req, res) => {
    try {
        const job = await Job.findOne({
            _id: req.params.jobId,
            status: 'open'
        }).populate('company', 'name description website');

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        return res.status(200).json({
            success: true,
            job
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = { createJob, getMyJobs, closeJob, getAllJobs, getJobById };