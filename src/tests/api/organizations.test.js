import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import organizationRoutes from '../../api/organizations.js';
import authRoutes from '../../api/auth.js';

// Create test app
const app = express();
app.use(express.json());
app.use('/api/organizations', organizationRoutes);
app.use('/api/auth', authRoutes);

// Mock database functions
vi.mock('../../db/index.js', () => ({
  createOrganization: vi.fn(),
  findOrganizationByEmail: vi.fn(),
  validatePassword: vi.fn()
}));

import { createOrganization, findOrganizationByEmail, validatePassword } from '../../db/index.js';

describe('Organization API Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('POST /api/organizations/register', () => {
    const validOrganizationData = {
      name: 'Test Hospital',
      address: '123 Main St',
      city: 'Test City',
      state: 'CA',
      zipCode: '12345',
      phone: '555-1234',
      email: 'test@hospital.com',
      password: 'testpassword123'
    };

    it('should register a new organization successfully', async () => {
      const mockOrganization = {
        id: '1ed5e540-d4ac-4ba7-8060-56745ef53816',
        name: 'Test Hospital',
        email: 'test@hospital.com'
      };

      findOrganizationByEmail.mockResolvedValue(null);
      createOrganization.mockResolvedValue(mockOrganization);

      const response = await request(app)
        .post('/api/organizations/register')
        .send(validOrganizationData)
        .expect(201);

      expect(response.body).toEqual({
        organization: {
          id: mockOrganization.id,
          name: mockOrganization.name,
          email: mockOrganization.email
        }
      });

      expect(createOrganization).toHaveBeenCalledWith(validOrganizationData);
    });

    it('should return 400 if required fields are missing', async () => {
      const incompleteData = {
        name: 'Test Hospital',
        email: 'test@hospital.com'
        // Missing other required fields
      };

      const response = await request(app)
        .post('/api/organizations/register')
        .send(incompleteData)
        .expect(400);

      expect(response.body.message).toContain('is required');
    });

    it('should return 400 if password is too short', async () => {
      const dataWithShortPassword = {
        ...validOrganizationData,
        password: '123'
      };

      const response = await request(app)
        .post('/api/organizations/register')
        .send(dataWithShortPassword)
        .expect(400);

      expect(response.body.message).toBe('Password must be at least 8 characters long');
    });

    it('should return 400 if organization email already exists', async () => {
      const existingOrganization = {
        id: 'existing-id',
        name: 'Existing Hospital',
        email: 'test@hospital.com'
      };

      findOrganizationByEmail.mockResolvedValue(existingOrganization);

      const response = await request(app)
        .post('/api/organizations/register')
        .send(validOrganizationData)
        .expect(400);

      expect(response.body.message).toBe('Organization with this email already exists');
    });

    it('should handle database errors gracefully', async () => {
      findOrganizationByEmail.mockResolvedValue(null);
      createOrganization.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/organizations/register')
        .send(validOrganizationData)
        .expect(500);

      expect(response.body.message).toBe('Server error during organization registration');
    });
  });

  describe('POST /api/auth/organization/login', () => {
    const validLoginData = {
      email: 'test@hospital.com',
      password: 'testpassword123'
    };

    it('should login organization successfully', async () => {
      const mockOrganization = {
        id: '1ed5e540-d4ac-4ba7-8060-56745ef53816',
        name: 'Test Hospital',
        email: 'test@hospital.com',
        address: '123 Main St',
        city: 'Test City',
        state: 'CA',
        password_hash: 'hashedpassword'
      };

      findOrganizationByEmail.mockResolvedValue(mockOrganization);
      validatePassword.mockResolvedValue(true);

      const response = await request(app)
        .post('/api/auth/organization/login')
        .send(validLoginData)
        .expect(200);

      expect(response.body).toEqual({
        organization: {
          id: mockOrganization.id,
          name: mockOrganization.name,
          email: mockOrganization.email,
          address: mockOrganization.address,
          city: mockOrganization.city,
          state: mockOrganization.state
        }
      });

      expect(validatePassword).toHaveBeenCalledWith(validLoginData.password, mockOrganization.password_hash);
    });

    it('should return 400 if email or password is missing', async () => {
      const incompleteData = {
        email: 'test@hospital.com'
        // Missing password
      };

      const response = await request(app)
        .post('/api/auth/organization/login')
        .send(incompleteData)
        .expect(400);

      expect(response.body.message).toBe('Email and password are required');
    });

    it('should return 401 if organization does not exist', async () => {
      findOrganizationByEmail.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/organization/login')
        .send(validLoginData)
        .expect(401);

      expect(response.body.message).toBe('Invalid email or password');
    });

    it('should return 401 if password is incorrect', async () => {
      const mockOrganization = {
        id: '1ed5e540-d4ac-4ba7-8060-56745ef53816',
        name: 'Test Hospital',
        email: 'test@hospital.com',
        password_hash: 'hashedpassword'
      };

      findOrganizationByEmail.mockResolvedValue(mockOrganization);
      validatePassword.mockResolvedValue(false);

      const response = await request(app)
        .post('/api/auth/organization/login')
        .send(validLoginData)
        .expect(401);

      expect(response.body.message).toBe('Invalid email or password');
    });

    it('should handle database errors gracefully', async () => {
      findOrganizationByEmail.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/auth/organization/login')
        .send(validLoginData)
        .expect(500);

      expect(response.body.message).toBe('Server error during login');
    });
  });
}); 