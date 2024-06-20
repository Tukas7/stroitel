// backend/routes/materialRoutes.js
const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.get('/', authenticateToken, materialController.getAllMaterials);

router.put('/:id', authenticateToken, materialController.updateMaterial); // Добавляем маршрут для обновления материала
router.delete('/:id', authenticateToken, authorizeRole(['admin']), materialController.deleteMaterial); // Добавляем маршрут для удаления материала

module.exports = router;
