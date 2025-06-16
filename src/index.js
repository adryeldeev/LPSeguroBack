
import express from 'express';
import cors from 'cors';
import leadRoutes from './routes/leadRoutes.js';
import userRoutes from './routes/userController.js';
import dotenv from 'dotenv';
dotenv.config();

// Initialize the Express application

const app = express();
app.use(cors());
app.use(express.json());


// Importing the lead routes
app.use( leadRoutes); // Use lead routes under /api endpoint
// Importing the user routes
app.use( userRoutes); // Use user routes under /api endpoint


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});