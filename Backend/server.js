import app from './src/app.js';
import connectDB from './src/config/database.js';

const startServer = async () => {

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
  
  await connectDB();
};

startServer();
