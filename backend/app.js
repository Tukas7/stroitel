// backend/app.js
const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const userRoutes = require('./routes/userRoutes');
const materialRoutes = require('./routes/materialRoutes');
const reportRoutes = require('./routes/reportRoutes');
const { authenticateToken, authorizeRole } = require('./middleware/auth');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'your_jwt_secret';

// Middleware для проверки токена и роли


// Используем маршруты для пользователей, материалов и отчетов
app.use('/api/users', userRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/reports', authenticateToken, authorizeRole(['admin', 'manager']), reportRoutes);

// Маршруты для HTML-страниц
app.get('/materials', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/materials.html'));
});

app.get('/materials/add', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/add_material.html'));
});

app.get('/reports', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/reports.html'));
});

app.get('/users/manage', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/manage_users.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
