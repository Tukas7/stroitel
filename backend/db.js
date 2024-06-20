// db.js
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'viaduct.proxy.rlwy.net',
    database: 'stroi',
    password: 'VABbgCjkjLffcsYvmgjOYcWeUmolovRb',
    port: 13266,
});

module.exports = pool;
