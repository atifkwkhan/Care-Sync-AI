# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Build the React application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /app/dist

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Install PostgreSQL client for migrations
RUN apk add --no-cache postgresql-client

# Create a script to run migrations and start nginx
RUN echo '#!/bin/sh\n\
echo "Running database migrations..."\n\
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f /app/src/db/migrations/001_create_users_table.sql\n\
echo "Starting Nginx..."\n\
nginx -g "daemon off;"\n\
' > /start.sh

RUN chmod +x /start.sh

# Health check configuration
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["/start.sh"] 