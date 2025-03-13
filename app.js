import express from 'express';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import { seedAdminUser } from './utils/adminSeed.js';
import questionSheetRoutes from './routes/questionSheetRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import examRoutes from './routes/examRoutes.js'

dotenv.config();

// Initialize Express app
const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Set specific allowed origin
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});


// Connect to MongoDB and seed admin user
const initializeServer = async () => {
  // Connect to database
  await connectDatabase();
  
  // Create admin user if it doesn't exist
  await seedAdminUser();
};

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/questionsheets', questionSheetRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/exams', examRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT;

// Initialize database and start server
initializeServer()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize server:', err);
    process.exit(1);
  });