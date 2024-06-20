// db.js
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'monorail.proxy.rlwy.net',
    database: 'railway',
    password: 'iVLJcjIHCfPxyWARweRYhRPEqKqEtQGT',
    port: 32498,
});

module.exports = pool;
