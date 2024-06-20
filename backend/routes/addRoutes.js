const express = require('express');
const router = express.Router();
const addController = require('../controllers/add');
const { authenticateToken, authorizeRole } = require('../middleware/auth')



router.put('/', authenticateToken, authorizeRole(['admin', 'manager']), addController.addMaterial);
module.exports = router;