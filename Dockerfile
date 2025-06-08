FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Build the React application
RUN npm run build

# Install PostgreSQL client
RUN apk add --no-cache postgresql-client

# Create server.js file
COPY <<'EOF' /app/server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('Received SIGTERM signal, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
EOF

# Create start script
COPY <<'EOF' /app/start.sh
#!/bin/sh
set -e
cd /app

echo "Running database migrations..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f /app/src/db/migrations/001_create_users_table.sql || true

echo "Starting server..."
exec node /app/server.js
EOF

# Make start script executable and ensure proper line endings
RUN chmod +x /app/start.sh && \
    sed -i 's/\r$//' /app/start.sh

# Expose the port
EXPOSE 8080

# Start the application
CMD ["/bin/sh", "/app/start.sh"] 