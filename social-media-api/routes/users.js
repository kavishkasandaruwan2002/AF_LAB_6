// users routes
const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');

const SECRET = 'my_secret_key_123'; // In production, use environment variable
let users = [];

// POST /api/users/register
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: 'Username and password required' });

  if (users.find(u => u.username === username))
    return res.status(409).json({ message: 'Username already taken' });

  users.push({ username, password }); // Note: hash passwords in production!
  res.status(201).json({ message: 'User registered successfully' });
});

// POST /api/users/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user)
    return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;