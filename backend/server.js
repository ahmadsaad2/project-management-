// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'auth_app'
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected...');
});

// REGISTER
app.post('/register', async (req, res) => {
  const { username, password, role, university_id, name } = req.body;

  // Validate input
  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4(); // Generate UUID

    const sql = `
      INSERT INTO users (id, username, password_hash, role, university_id, name)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [id, username, hashedPassword, role, university_id, name], (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'Username already exists' });
        }
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ success: true, message: 'User registered successfully' });
    });

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// LOGIN
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM users WHERE username = ?';

  db.query(sql, [username], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(404).json({ error: 'User not found' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({ success: true, user });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});