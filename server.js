require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const corsMiddleware = require('./src/middlewares/cors.middleware');
const { connectDB } = require('./src/models/db.connect');
const authRoutes = require('./src/routes/auth.routes');
const gridRoutes = require('./src/routes/grid.routes');

const app = express();
const port = process.env.PORT || 3001;
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST'],
    },
});

app.use(corsMiddleware);
app.use(express.json());

app.use((req, res, next) => {
    req.io = io;
    next();
});

connectDB();


app.use('/api/auth', authRoutes);
app.use('/api/grid', gridRoutes);

module.exports = server;