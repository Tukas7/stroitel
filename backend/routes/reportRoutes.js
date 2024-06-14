// backend/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.get('/', authenticateToken, authorizeRole(['admin', 'manager']), reportController.getAllReports);
router.post('/', authenticateToken, authorizeRole(['admin', 'manager']), reportController.createReport);
router.get('/generate', authenticateToken, authorizeRole(['admin', 'manager']), reportController.generateReportPDF);
router.get('/download', authenticateToken, authorizeRole(['admin', 'manager']), reportController.downloadReport);

module.exports = router;
