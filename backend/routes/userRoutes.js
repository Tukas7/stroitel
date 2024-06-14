// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.post('/register', authenticateToken, authorizeRole(['admin']), userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/', authenticateToken, authorizeRole(['admin']), userController.getAllUsers);
router.put('/:id', authenticateToken, authorizeRole(['admin']), userController.updateUser); // Добавляем маршрут для обновления пользователя
router.delete('/:id', authenticateToken, authorizeRole(['admin']), userController.deleteUser);

module.exports = router;
