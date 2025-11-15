require('dotenv').config();
const express = require('express');
const http = require('http');

const corsMiddleware = require('./src/middlewares/cors.middleware');
const { connectDB } = require('./src/models/db.connect');
const authRoutes = require('./src/routes/auth.routes');
const gridRoutes = require('./src/routes/grid.routes');

const app = express();
const port = process.env.PORT || 3001;
const server = http.createServer(app);

app.use(corsMiddleware);
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/grid', gridRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'An unexpected error occurred on the server.';
    if (statusCode === 500 && process.env.NODE_ENV === 'production') {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
    res.status(statusCode).json({ message });
});

module.exports = server;