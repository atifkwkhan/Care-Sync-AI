# Build stage
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Install PostgreSQL client for migrations
RUN apk add --no-cache postgresql-client

# Create a script to run migrations and start the app
RUN echo '#!/bin/sh\n\
echo "Running database migrations..."\n\
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f /app/src/db/migrations/001_create_users_table.sql\n\
echo "Starting the application..."\n\
npm start\n\
' > /app/start.sh

RUN chmod +x /app/start.sh

EXPOSE 3000

CMD ["/app/start.sh"] 