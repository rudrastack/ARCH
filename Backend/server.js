import app from './src/app.js';
import connectDB from './src/config/database.js';

const startServer = async () => {
    const PORT = process.env.PORT || 3000;

    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();