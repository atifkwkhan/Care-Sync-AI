import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// --- MOCKS FIRST! ---
let mockClient;
let mockPoolQuery;
let mockConnect;

// Reset mocks before each test
beforeEach(() => {
  mockClient = {
    query: vi.fn(),
    release: vi.fn()
  };
  mockPoolQuery = vi.fn();
  mockConnect = vi.fn(() => mockClient);
});

vi.mock('pg', () => {
  const Pool = vi.fn().mockImplementation(() => ({
    connect: () => mockConnect(),
    query: (...args) => mockPoolQuery(...args)
  }));
  return {
    Pool,
    default: { Pool }
  };
});

vi.mock('bcryptjs', async () => {
  const actual = await vi.importActual('bcryptjs');
  return {
    ...actual,
    genSalt: vi.fn(),
    hash: vi.fn(),
    compare: vi.fn()
  };
});

// --- THEN import your code ---
import { createOrganization, findOrganizationByEmail, findOrganizationById } from '../../db/index.js';

// Mock window as undefined for server-side testing
Object.defineProperty(global, 'window', {
  value: undefined,
  writable: true
});

// --- TESTS ---
describe('Organization Database Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // The mock client is already set up in the global beforeEach
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('createOrganization', () => {
    const organizationData = {
      name: 'Test Hospital',
      address: '123 Main St',
      city: 'Test City',
      state: 'CA',
      zipCode: '12345',
      phone: '555-1234',
      email: 'test@hospital.com',
      password: 'testpassword123',
      website: 'https://testhospital.com'
    };

    it('should create an organization successfully', async () => {
      const mockResult = {
        rows: [{
          id: '1ed5e540-d4ac-4ba7-8060-56745ef53816',
          name: 'Test Hospital',
          email: 'test@hospital.com'
        }]
      };

      const bcrypt = await import('bcryptjs');
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedpassword');

      mockClient.query
        .mockResolvedValueOnce() // BEGIN
        .mockResolvedValueOnce(mockResult) // INSERT
        .mockResolvedValueOnce(); // COMMIT

      const result = await createOrganization(organizationData);

      expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
      expect(mockClient.query).toHaveBeenCalledWith(
        `INSERT INTO organizations (
        name, address, city, state, zip_code, phone, email, website, password_hash
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING id, name, email`,
        [
          'Test Hospital',
          '123 Main St',
          'Test City',
          'CA',
          '12345',
          '555-1234',
          'test@hospital.com',
          'https://testhospital.com',
          expect.any(String) // Accept any string for the hash
        ]
      );
      expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
      expect(mockClient.release).toHaveBeenCalled();
      expect(result).toEqual(mockResult.rows[0]);
    });

    it('should handle database errors and rollback', async () => {
      const bcrypt = await import('bcryptjs');
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedpassword');

      mockClient.query
        .mockResolvedValueOnce() // BEGIN
        .mockRejectedValueOnce(new Error('Database error')) // INSERT
        .mockResolvedValueOnce(); // ROLLBACK

      await expect(createOrganization(organizationData)).rejects.toThrow('Database error');

      expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should handle null website', async () => {
      const organizationDataWithoutWebsite = {
        ...organizationData,
        website: undefined
      };

      const mockResult = {
        rows: [{
          id: '1ed5e540-d4ac-4ba7-8060-56745ef53816',
          name: 'Test Hospital',
          email: 'test@hospital.com'
        }]
      };

      const bcrypt = await import('bcryptjs');
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedpassword');

      mockClient.query
        .mockResolvedValueOnce() // BEGIN
        .mockResolvedValueOnce(mockResult) // INSERT
        .mockResolvedValueOnce(); // COMMIT

      const result = await createOrganization(organizationDataWithoutWebsite);

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO organizations'),
        expect.arrayContaining([null]) // website should be null
      );
      expect(mockClient.release).toHaveBeenCalled();
      expect(result).toEqual(mockResult.rows[0]);
    });
  });

  describe('findOrganizationByEmail', () => {
    it('should find organization by email', async () => {
      const mockOrganization = {
        id: '1ed5e540-d4ac-4ba7-8060-56745ef53816',
        name: 'Test Hospital',
        email: 'test@hospital.com',
        address: '123 Main St',
        city: 'Test City',
        state: 'CA',
        password_hash: 'hashedpassword'
      };

      const mockResult = {
        rows: [mockOrganization]
      };

      mockPoolQuery.mockResolvedValue(mockResult);

      const result = await findOrganizationByEmail('test@hospital.com');

      expect(mockPoolQuery).toHaveBeenCalledWith(
        'SELECT * FROM organizations WHERE email = $1',
        ['test@hospital.com']
      );
      expect(result).toEqual(mockOrganization);
    });

    it('should return null if organization not found', async () => {
      const mockResult = {
        rows: []
      };

      mockPoolQuery.mockResolvedValue(mockResult);

      const result = await findOrganizationByEmail('nonexistent@hospital.com');

      expect(mockPoolQuery).toHaveBeenCalledWith(
        'SELECT * FROM organizations WHERE email = $1',
        ['nonexistent@hospital.com']
      );
      expect(result).toBeUndefined();
    });
  });

  describe('findOrganizationById', () => {
    it('should find organization by id', async () => {
      const mockOrganization = {
        id: '1ed5e540-d4ac-4ba7-8060-56745ef53816',
        name: 'Test Hospital',
        email: 'test@hospital.com',
        address: '123 Main St',
        city: 'Test City',
        state: 'CA',
        zip_code: '12345',
        phone: '555-1234',
        website: 'https://testhospital.com'
      };

      const mockResult = {
        rows: [mockOrganization]
      };

      mockPoolQuery.mockResolvedValue(mockResult);

      const result = await findOrganizationById('1ed5e540-d4ac-4ba7-8060-56745ef53816');

      expect(mockPoolQuery).toHaveBeenCalledWith(
        'SELECT id, name, email, address, city, state, zip_code, phone, website FROM organizations WHERE id = $1',
        ['1ed5e540-d4ac-4ba7-8060-56745ef53816']
      );
      expect(result).toEqual(mockOrganization);
    });

    it('should return null if organization not found by id', async () => {
      const mockResult = {
        rows: []
      };

      mockPoolQuery.mockResolvedValue(mockResult);

      const result = await findOrganizationById('nonexistent-id');

      expect(mockPoolQuery).toHaveBeenCalledWith(
        'SELECT id, name, email, address, city, state, zip_code, phone, website FROM organizations WHERE id = $1',
        ['nonexistent-id']
      );
      expect(result).toBeUndefined();
    });
  });
}); 