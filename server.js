import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import authRoutes from './src/api/auth.js';
import organizationRoutes from './src/api/organizations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
app.use('/api/organizations', organizationRoutes);

// Serve static files from the React app (in production or when dist folder exists)
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Dist folder exists:', fs.existsSync(path.join(__dirname, 'dist')));
console.log('Current directory:', __dirname);

if (process.env.NODE_ENV === 'production' || fs.existsSync(path.join(__dirname, 'dist'))) {
  console.log('Serving static files from dist folder');
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, 'dist')));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    console.log('Serving React app for route:', req.path);
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  console.log('Not serving static files - NODE_ENV is not production and dist folder does not exist');
  
  // Fallback route for development or when static files aren't available
  app.get('*', (req, res) => {
    res.status(404).json({
      error: 'Not Found',
      message: 'Static files not available. Make sure to run "npm run build" and set NODE_ENV=production',
      path: req.path,
      nodeEnv: process.env.NODE_ENV,
      distExists: fs.existsSync(path.join(__dirname, 'dist'))
    });
  });
}

// Initialize database and start server
import { initializeDatabase } from './src/db/index.js';

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