import dotenv from 'dotenv';
dotenv.config();

// Database operations should only be imported and used in server-side code
import pg from 'pg';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let pool;
function getPool() {
  if (!pool) {
    if (typeof window !== 'undefined') {
      throw new Error('Database operations not available on client');
    }
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
  return pool;
}

// Initialize database with migrations
export const initializeDatabase = async () => {
  if (typeof window !== 'undefined') {
    throw new Error('Database operations not available on client');
  }

  const client = await getPool().connect();
  try {
    // Run migrations in order
    const migrations = [
      '000_enable_uuid_extension.sql',
      '001_create_users_table.sql',
      '002_create_organizations_table.sql',
      '003_add_password_hash_to_organizations.sql',
      '004_create_doctors_table.sql',
      '005_create_treatments_table.sql',
      '006_create_patients_table.sql',
      '007_create_episodes_table.sql',
      '008_seed_sample_data.sql'
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
  const client = await getPool().connect();
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
  const result = await getPool().query(
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
  const result = await getPool().query(
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
  const client = await getPool().connect();
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
  const result = await getPool().query(
    'SELECT * FROM organizations WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

export const findOrganizationById = async (id) => {
  if (typeof window !== 'undefined') {
    throw new Error('Database operations not available on client');
  }
  const result = await getPool().query(
    'SELECT id, name, email, address, city, state, zip_code, phone, website FROM organizations WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

// Patient-related database functions
export const createPatient = async (patientData) => {
  if (typeof window !== 'undefined') {
    throw new Error('Database operations not available on client');
  }
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    
    const result = await client.query(
      `INSERT INTO patients (
        patient_id, first_name, last_name, date_of_birth, email, phone, 
        address, emergency_contact_name, emergency_contact_phone, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING id, patient_id, first_name, last_name, date_of_birth, status`,
      [
        patientData.patientId,
        patientData.firstName,
        patientData.lastName,
        patientData.dateOfBirth,
        patientData.email,
        patientData.phone,
        patientData.address,
        patientData.emergencyContactName,
        patientData.emergencyContactPhone,
        patientData.status || 'active'
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

export const getPatients = async (filters = {}) => {
  if (typeof window !== 'undefined') {
    throw new Error('Database operations not available on client');
  }
  
  let query = `
    SELECT 
      p.id, p.patient_id, p.first_name, p.last_name, p.date_of_birth, 
      p.status, p.created_at,
      EXTRACT(YEAR FROM AGE(p.date_of_birth)) as age,
      e.check_in_date,
      t.name as treatment_name,
      CONCAT(d.first_name, ' ', d.last_name) as doctor_name,
      e.episode_id
    FROM patients p
    LEFT JOIN episodes e ON p.id = e.patient_id AND e.status = 'active'
    LEFT JOIN treatments t ON e.treatment_id = t.id
    LEFT JOIN doctors d ON e.doctor_id = d.id
    WHERE 1=1
  `;
  
  const params = [];
  let paramCount = 0;

  // Add filters
  if (filters.search) {
    paramCount++;
    query += ` AND (
      p.first_name ILIKE $${paramCount} OR 
      p.last_name ILIKE $${paramCount} OR 
      p.patient_id ILIKE $${paramCount}
    )`;
    params.push(`%${filters.search}%`);
  }

  if (filters.status) {
    paramCount++;
    query += ` AND p.status = $${paramCount}`;
    params.push(filters.status);
  }

  if (filters.treatment) {
    paramCount++;
    query += ` AND t.name = $${paramCount}`;
    params.push(filters.treatment);
  }

  if (filters.dateFrom) {
    paramCount++;
    query += ` AND e.check_in_date >= $${paramCount}`;
    params.push(filters.dateFrom);
  }

  if (filters.dateTo) {
    paramCount++;
    query += ` AND e.check_in_date <= $${paramCount}`;
    params.push(filters.dateTo);
  }

  // Add ordering
  const orderBy = filters.orderBy || 'p.patient_id';
  const orderDirection = filters.orderDirection || 'ASC';
  query += ` ORDER BY ${orderBy} ${orderDirection}`;

  // Add pagination
  if (filters.limit) {
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(filters.limit);
  }

  if (filters.offset) {
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(filters.offset);
  }

  const result = await getPool().query(query, params);
  return result.rows;
};

export const getPatientById = async (id) => {
  if (typeof window !== 'undefined') {
    throw new Error('Database operations not available on client');
  }
  const result = await getPool().query(
    'SELECT * FROM patients WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

export const updatePatient = async (id, patientData) => {
  if (typeof window !== 'undefined') {
    throw new Error('Database operations not available on client');
  }
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    
    const result = await client.query(
      `UPDATE patients SET 
        first_name = $1, last_name = $2, date_of_birth = $3, 
        email = $4, phone = $5, address = $6, 
        emergency_contact_name = $7, emergency_contact_phone = $8, 
        status = $9, updated_at = CURRENT_TIMESTAMP
      WHERE id = $10 
      RETURNING *`,
      [
        patientData.firstName,
        patientData.lastName,
        patientData.dateOfBirth,
        patientData.email,
        patientData.phone,
        patientData.address,
        patientData.emergencyContactName,
        patientData.emergencyContactPhone,
        patientData.status,
        id
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

export const deletePatient = async (id) => {
  if (typeof window !== 'undefined') {
    throw new Error('Database operations not available on client');
  }
  const result = await getPool().query(
    'DELETE FROM patients WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
};

// Doctor-related database functions
export const getDoctors = async () => {
  if (typeof window !== 'undefined') {
    throw new Error('Database operations not available on client');
  }
  const result = await getPool().query(
    'SELECT id, first_name, last_name, specialty FROM doctors ORDER BY first_name, last_name'
  );
  return result.rows;
};

// Treatment-related database functions
export const getTreatments = async () => {
  if (typeof window !== 'undefined') {
    throw new Error('Database operations not available on client');
  }
  const result = await getPool().query(
    'SELECT id, name, category FROM treatments ORDER BY name'
  );
  return result.rows;
}; 