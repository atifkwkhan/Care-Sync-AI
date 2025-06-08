const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./src/api/auth');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send("OK");
});

// API routes
app.use('/api/auth', authRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Initialize database and start server
const { initializeDatabase } = require('./src/db');

const startServer = async () => {
  try {
    // Initialize database
    await initializeDatabase();
    console.log('Database initialized successfully');

    // Start server
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Handle shutdown gracefully
    process.on("SIGTERM", () => {
      console.log("Received SIGTERM signal, shutting down gracefully");
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 