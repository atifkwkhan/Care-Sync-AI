#!/bin/sh
set -e
cd /app

echo "Running database migrations..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f /app/src/db/migrations/001_create_users_table.sql || true

echo "Starting server..."
exec node /app/server.js 