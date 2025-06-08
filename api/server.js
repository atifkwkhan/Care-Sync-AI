const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('../src/api/auth');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Initialize database and start server
const { initializeDatabase } = require('../src/db');

const startServer = async () => {
  try {
    // Initialize database
    await initializeDatabase();
    console.log('Database initialized successfully');

    // Start server
    app.listen(PORT, 'localhost', () => {
      console.log(`API Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start API server:', error);
    process.exit(1);
  }
};

startServer(); 