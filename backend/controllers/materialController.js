// backend/controllers/materialController.js
const pool = require('../db');

exports.getAllMaterials = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM materials');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addMaterial = async (req, res) => {
    const { name, description, price, quantity } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO materials (name, description, price, quantity) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, description, price, quantity]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateMaterial = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, quantity } = req.body;

    try {
        const result = await pool.query(
            'UPDATE materials SET name = $1, description = $2, price = $3, quantity = $4 WHERE id = $5 RETURNING *',
            [name, description, price, quantity, id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteMaterial = async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query('DELETE FROM materials WHERE id = $1', [id]);
        res.status(200).json({ message: 'Material deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
