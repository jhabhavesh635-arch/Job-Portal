const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true
    },

    website: {
        type: String,
        trim: true
    },

    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    isVerified: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

const Company = mongoose.model('Company', companySchema);

module.exports = Company;