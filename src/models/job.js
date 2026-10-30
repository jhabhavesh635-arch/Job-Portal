const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    salary: {
        type: String
    },

    jobType: {
        type: String,
        enum: ['full-time', 'part-time', 'internship'],
        default: 'full-time'
    },

    skills: [{
        type: String
    }],

    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },

    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    }

}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;