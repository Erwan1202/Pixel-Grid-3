const { connectMongo } = require('./db.mongo');
const { createTables } = require('./init.postgres');

const connectDB = async () => {
    try {
        await connectMongo();
        
        // Test de connexion PostgreSQL et création des tables
        await createTables();
        console.log('PostgreSQL connected and tables initialized successfully');

    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = {
    connectDB,
};