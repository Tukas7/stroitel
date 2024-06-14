// backend/controllers/userController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const JWT_SECRET = 'your_jwt_secret';

exports.registerUser = async (req, res) => {
    const { username, password, role, first_name, last_name, email, phone } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const result = await pool.query(
            'INSERT INTO users (username, password, role, first_name, last_name, email, phone) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [username, hashedPassword, role, first_name, last_name, email, phone]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user.id, role: user.role, username: username }, JWT_SECRET);
            res.json({ token });
        } else {
            res.status(400).json({ error: 'Invalid Credentials' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, role, first_name, last_name, email, phone } = req.body;
    try {
        const result = await pool.query(
            'UPDATE users SET username = $1, role = $2, first_name = $3, last_name = $4, email = $5, phone = $6 WHERE id = $7 RETURNING *',
            [username, role, first_name, last_name, email, phone, id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
