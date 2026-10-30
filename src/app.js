const express = require('express');
const app = express();

app.use(express.json());
const authRoutes = require('./routes/route');
const applicationRoutes = require('./routes/application.route');
const companyRoutes = require('./routes/company.route');
const jobRoutes = require('./routes/job.routes');
const adminRoutes = require('./routes/admin.route');

app.use('/api/jobs', jobRoutes);

app.use('/api/companies', companyRoutes);

app.use('/api/applications', applicationRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.get('/', (req, res) => {
    res.send('welcome to the HireFlow Backend!');
});
app.get('/api', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to HireFlow API',
        version: '1.0.0'
    });
});
app.post('/api/test', (req, res) => {
    const data = req.body;

    res.status(201).json({
        success: true,
        message: 'Data received successfully',
        receivedData: data
    });
});
module.exports = app;