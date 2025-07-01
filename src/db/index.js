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
  
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }
  
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
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
    // Run migrations in order
    const migrations = [
      '001_create_users_table.sql',
      '002_create_organizations_table.sql'
    ];
    
    for (const migrationFile of migrations) {
      const migrationPath = path.join(__dirname, 'migrations', migrationFile);
      const migration = fs.readFileSync(migrationPath, 'utf8');
      await client.query(migration);
      console.log(`Migration ${migrationFile} completed successfully`);
    }
    
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

// Organization-related database functions
export const createOrganization = async (organizationData) => {
  if (typeof window !== 'undefined') {
    throw new Error('Database operations not available on client');
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(organizationData.password, salt);
    
    const result = await client.query(
      `INSERT INTO organizations (
        name, address, city, state, zip_code, phone, email, website, password_hash
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING id, name, email`,
      [
        organizationData.name,
        organizationData.address,
        organizationData.city,
        organizationData.state,
        organizationData.zipCode,
        organizationData.phone,
        organizationData.email,
        organizationData.website || null,
        passwordHash
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

export const findOrganizationByEmail = async (email) => {
  if (typeof window !== 'undefined') {
    throw new Error('Database operations not available on client');
  }
  const result = await pool.query(
    'SELECT * FROM organizations WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

export const findOrganizationById = async (id) => {
  if (typeof window !== 'undefined') {
    throw new Error('Database operations not available on client');
  }
  const result = await pool.query(
    'SELECT id, name, email, address, city, state, zip_code, phone, website FROM organizations WHERE id = $1',
    [id]
  );
  return result.rows[0];
}; 