// db.js
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'monorail.proxy.rlwy.net',
    database: 'railway',
    password: 'VABbgCjkjLffcsYvmgjOYcWeUmolovRb',
    port: 13266,
});

module.exports = pool;
