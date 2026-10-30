require('dotenv').config();

const app = require('./src/app');
const connectToDb = require('./src/config/db');

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await connectToDb();

        app.listen(PORT, () => {
            console.log(`HireFlow server is running on port ${PORT}`);
        });

    } catch (err) {
        console.error('Server startup failed:', err.message);
        process.exit(1);
    }
}

startServer();