const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },

    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    resume: {
        type: String,
        required: true
    },

    coverLetter: {
        type: String
    },

    status: {
        type: String,
        enum: ['pending', 'shortlisted', 'rejected', 'accepted'],
        default: 'pending'
    }

}, { timestamps: true });

// One candidate can apply only once to a particular job
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;