#!/bin/sh
set -e
cd /app

echo "Running database migrations..."
if [ -n "$DB_PASSWORD" ] && [ -n "$DB_HOST" ] && [ -n "$DB_USER" ] && [ -n "$DB_NAME" ]; then
  PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f /app/src/db/migrations/001_create_users_table.sql || true
else
  echo "Warning: Database environment variables not set. Skipping migrations."
fi

echo "Starting server..."
exec node server.js 