import express from 'express';
import cors from 'cors';
import connectToDatabase from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import "dotenv/config";

// Initialize express app
const app = express();

// Setup PORT 
const PORT = process.env.PORT || 5000;

// Connect to database
connectToDatabase();

// Middleware
// Enable CORS
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());

// Define routes
app.use('/api/auth', userRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
