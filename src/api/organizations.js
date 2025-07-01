import express from 'express';
import { createOrganization, findOrganizationByEmail } from '../db/index.js';

const router = express.Router();

// Organization registration endpoint
router.post('/register', async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ['name', 'address', 'city', 'state', 'zipCode', 'phone', 'email', 'password'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    // Check if password meets minimum requirements
    if (req.body.password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    // Check if organization email already exists
    const existingOrganization = await findOrganizationByEmail(req.body.email);
    if (existingOrganization) {
      return res.status(400).json({ message: 'Organization with this email already exists' });
    }

    const organization = await createOrganization(req.body);
    
    res.status(201).json({
      organization: {
        id: organization.id,
        name: organization.name,
        email: organization.email
      }
    });
  } catch (error) {
    console.error('Organization registration error:', error);
    if (error.code === '23505') { // PostgreSQL unique constraint violation
      res.status(400).json({ message: 'Organization with this email already exists' });
    } else {
      res.status(500).json({ message: 'Server error during organization registration' });
    }
  }
});

export default router; 