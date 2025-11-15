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

const allowedOrigins = [
    process.env.FRONTEND_URL, 
    'http://localhost:5173'
];
const VERCEL_PREVIEW_REGEX = /^https:\/\/pixel-grid-3-.*\.vercel\.app$/;

const corsOriginLogic = (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || VERCEL_PREVIEW_REGEX.test(origin) || !origin) {
        callback(null, true);
    } else {
        console.error('CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
    }
};

const io = new Server(server, {
    cors: {
        origin: corsOriginLogic,
        methods: ['GET', 'POST'],
    },
});

app.use(express.json());

app.use((req, res, next) => {
    req.io = io;
    next();
});

connectDB();
        
app.use('/api/auth', authRoutes);
app.use('/api/grid', gridRoutes);

module.exports = server;