// db.js
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'monorail.proxy.rlwy.net',
    database: 'railway',
    password: 'aoAXvxnEKrTwEXehFtLnJlbwMJFLzmXq',
    port: 48757,
});

module.exports = pool;
