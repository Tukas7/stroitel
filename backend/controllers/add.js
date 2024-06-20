const pool = require('../db');

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