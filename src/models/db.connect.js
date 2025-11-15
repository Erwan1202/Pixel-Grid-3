const { connectMongo } = require('./db.mongo');
const { createTables } = require('./init.postgres');

const connectDB = async () => {
    try {
        await connectMongo();
        await createTables();

    } catch (error) {
        console.error('Database connection failed:', error.message);
    }
};

module.exports = {
    connectDB,
};