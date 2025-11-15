const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.PG_URI,
    ssl: {
        rejectUnauthorized: false,
    },
});

const execute = async (query, params = []) => {
    try {
        const client = await pool.connect();
        const result = await client.query(query, params);
        client.release();
        return result;
    } catch (error) {
        console.error('PostgreSQL query error:', error);
        throw error;
    }
};

module.exports = {
    execute,
    pool,
};