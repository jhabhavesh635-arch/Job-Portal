require('dotenv').config();

const connectToDb = require('../config/db');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const createAdmin = async() => {
    try {
        await connectToDb();

        const existingAdmin = await User.findOne({
            role: 'admin'
        });

        if (existingAdmin) {
            console.log('Admin already exists');
            return;
        }

        const hashedPassword = await bcrypt.hash(
            process.env.ADMIN_PASSWORD,
            12
        );

        await User.create({
            name: process.env.ADMIN_NAME,
            email: process.env.ADMIN_EMAIL,
            password: hashedPassword,
            role: 'admin'
        });

        console.log('Admin created successfully');

    } catch (error) {
        console.error('Admin creation failed:', error.message);
    } finally {
        const mongoose = require('mongoose');
        await mongoose.disconnect();
    }
};

createAdmin();