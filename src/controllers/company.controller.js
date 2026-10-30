const Company = require('../models/company');
const createCompany = async(req, res) => {
    try {
        const { name, description, website } = req.body;
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'Company name and description are required'
            });
        }
        const existingCompany = await Company.findOne({
            name: name,
            recruiter: req.user._id
        });

        if (existingCompany) {
            return res.status(409).json({
                success: false,
                message: 'You have already registered this company'
            });
        }
        const company = await Company.create({
            name,
            description,
            website,
            recruiter: req.user._id
        });

        return res.status(201).json({
            success: true,
            message: 'Company registered successfully',
            company
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
module.exports = { createCompany };