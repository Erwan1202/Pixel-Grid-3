const { execute } = require('./db.postgres');

const createTables = async () => {
    const userTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'user',
            refresh_token VARCHAR(255) NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;

    const pixelTableQuery = `
        CREATE TABLE IF NOT EXISTS pixel (
            id SERIAL PRIMARY KEY,
            x_coord INT NOT NULL,
            y_coord INT NOT NULL,
            color VARCHAR(7) NOT NULL,
            user_id INT REFERENCES users(id) ON DELETE SET NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            UNIQUE (x_coord, y_coord)
        );
    `;

    await execute(userTableQuery);
    console.log('PostgreSQL table users created or exists.');

    await execute(pixelTableQuery);
    console.log('PostgreSQL table pixel created or exists.');
};

module.exports = {
    createTables,
};