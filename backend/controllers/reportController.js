// backend/controllers/reportController.js
const pool = require('../db');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.getAllReports = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM reports');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createReport = async (req, res) => {
    const { user_id, report_type, content } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO reports (user_id, report_type, content) VALUES ($1, $2, $3) RETURNING *',
            [user_id, report_type, content]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.generateReportPDF = async (req, res) => {
    try {
        const materialsResult = await pool.query('SELECT * FROM materials');
        const usersResult = await pool.query('SELECT * FROM users');
       
        const materials = materialsResult.rows;
        const users = usersResult.rows;
        

        const totalMaterials = materials.length;
        const totalUsers = users.length;
        const totalMaterialsQuantity = materials.reduce((acc, material) => acc + material.quantity, 0);
        const totalMaterialsPrice = materials.reduce((acc, material) => acc + material.price * material.quantity, 0);

        const doc = new PDFDocument();
        const filePath = path.join(__dirname, '../../report.pdf');
        doc.pipe(fs.createWriteStream(filePath));

        // Используем шрифт FreeSerif
        doc.font(path.join(__dirname, '../../fonts/FreeSerif.ttf'));

        doc.fontSize(20).text('Отчет по учетной системе строительных материалов', { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).text(`Дата: ${new Date().toLocaleDateString()}`, { align: 'right' });
        doc.moveDown();

        doc.fontSize(16).text('Общая информация:');
        doc.fontSize(12).text(`Всего материалов: ${totalMaterials}`);
        doc.fontSize(12).text(`Общее количество всех материалов: ${totalMaterialsQuantity}`);
        doc.fontSize(12).text(`Общая стоимость всех материалов: ${totalMaterialsPrice}`);
        doc.moveDown();

        doc.fontSize(16).text('Информация о сотрудниках:');
        doc.fontSize(12).text(`Всего сотрудников: ${totalUsers}`);
        doc.moveDown();

        
        doc.moveDown();

        doc.fontSize(16).text('Детальная информация о материалах:');
        materials.forEach(material => {
            doc.fontSize(12).text(`Название: ${material.name}`);
            doc.fontSize(12).text(`Описание: ${material.description}`);
            doc.fontSize(12).text(`Количество: ${material.quantity}`);
            doc.fontSize(12).text(`Цена: ${material.price}`);
            doc.moveDown();
        });

        doc.end();
        res.status(200).json({ message: 'Report generated successfully', filePath });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.downloadReport = (req, res) => {
    const filePath = path.join(__dirname, '../../report.pdf');
    fs.access(filePath, fs.constants.R_OK, err => {
        if (err) {
            return res.status(404).json({ error: 'Report not found or inaccessible' });
        }
        res.download(filePath, 'report.pdf', err => {
            if (err) {
                res.status(500).json({ error: err.message });
            }
        });
    });
};
