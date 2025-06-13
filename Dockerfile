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

# The server.js and start.sh files are now copied from the local filesystem
# as they were created locally

# Make start script executable and ensure proper line endings
RUN chmod +x /app/start.sh && \
    sed -i 's/\r$//' /app/start.sh

# Expose the port
EXPOSE 80

# Start the application
CMD ["node", "server.js"] 