// Database operations should only be imported and used in server-side code
import pg from 'pg';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let pool;

// Only initialize pool on server-side
if (typeof window === 'undefined') {
  const { Pool } = pg;
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    ssl: {
      rejectUnauthorized: false
    }
  });
}

// Initialize database with migrations
export const initializeDatabase = async () => {
  if (typeof window !== 'undefined') {
    throw new Error('Database operations not available on client');
  }
  
  const client = await pool.connect();
  try {
    const migrationPath = path.join(__dirname, 'migrations', '001_create_users_table.sql');
    const migration = fs.readFileSync(migrationPath, 'utf8');
    await client.query(migration);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
};

// User-related database functions
export const createUser = async (userData) => {
  if (typeof window !== 'undefined') {
    throw new Error('Database operations not available on client');
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userData.password, salt);

    const result = await client.query(
      `INSERT INTO users (
        first_name, last_name, suffix, discipline, username, 
        password_hash, agency_employee_id, email, phone1, 
        phone2, employee_type
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
      RETURNING id, username, email`,
      [
        userData.firstName,
        userData.lastName,
        userData.suffix,
        userData.discipline,
        userData.username,
        passwordHash,
        userData.agencyEmployeeId,
        userData.email,
        userData.phone1,
        userData.phone2,
        userData.employeeType
      ]
    );

    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const findUserByUsername = async (username) => {
  if (typeof window !== 'undefined') {
    throw new Error('Database operations not available on client');
  }
  const result = await pool.query(
    'SELECT * FROM users WHERE username = $1',
    [username]
  );
  return result.rows[0];
};

export const validatePassword = async (password, hashedPassword) => {
  if (typeof window !== 'undefined') {
    throw new Error('Database operations not available on client');
  }
  return bcrypt.compare(password, hashedPassword);
};

export const findUserById = async (id) => {
  if (typeof window !== 'undefined') {
    throw new Error('Database operations not available on client');
  }
  const result = await pool.query(
    'SELECT id, username, email, first_name, last_name, discipline, employee_type, permissions FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

if (typeof window === 'undefined') {
  // Client-side stub
  export const createUser = () => Promise.reject(new Error('Database operations not available on client'));
  export const findUserByUsername = () => Promise.reject(new Error('Database operations not available on client'));
  export const validatePassword = () => Promise.reject(new Error('Database operations not available on client'));
  export const findUserById = () => Promise.reject(new Error('Database operations not available on client'));
} 