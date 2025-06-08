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

# Create a simple Express server for serving the app and health checks
RUN echo 'const express = require("express");\n\
const path = require("path");\n\
const app = express();\n\
const PORT = process.env.PORT || 8080;\n\
\n\
// Health check endpoint\n\
app.get("/health", (req, res) => {\n\
  res.status(200).send("OK");\n\
});\n\
\n\
// Serve static files\n\
app.use(express.static(path.join(__dirname, "dist")));\n\
\n\
// Handle React routing\n\
app.get("*", (req, res) => {\n\
  res.sendFile(path.join(__dirname, "dist", "index.html"));\n\
});\n\
\n\
// Start server\n\
const server = app.listen(PORT, "0.0.0.0", () => {\n\
  console.log(`Server running on port ${PORT}`);\n\
});\n\
\n\
// Handle shutdown gracefully\n\
process.on("SIGTERM", () => {\n\
  console.log("Received SIGTERM signal, shutting down gracefully");\n\
  server.close(() => {\n\
    console.log("Server closed");\n\
    process.exit(0);\n\
  });\n\
});\n\
' > /app/server.js

# Create startup script
RUN echo '#!/bin/sh\n\
set -e\n\
cd /app\n\
echo "Running database migrations..."\n\
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f /app/src/db/migrations/001_create_users_table.sql || true\n\
echo "Starting server..."\n\
exec node /app/server.js\n\
' > /app/start.sh \
&& chmod +x /app/start.sh

# Expose the port
EXPOSE 8080

# Start the application
ENTRYPOINT ["/app/start.sh"] 