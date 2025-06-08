const express = require('express');
const router = express.Router();
const { createUser, findUserByUsername, validatePassword } = require('../db');

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await findUserByUsername(username);

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isValid = await validatePassword(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Send user data without sensitive information
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        discipline: user.discipline,
        employeeType: user.employee_type,
        permissions: user.permissions
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const user = await createUser(req.body);
    
    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        discipline: req.body.discipline,
        employeeType: req.body.employeeType
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

module.exports = router; 