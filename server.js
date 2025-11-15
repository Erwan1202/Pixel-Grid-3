require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors'); 

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

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || VERCEL_PREVIEW_REGEX.test(origin) || !origin) {
            callback(null, true);
        } else {
            console.error('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

const io = new Server(server, {
    cors: corsOptions,
});

app.options('/*', cors(corsOptions)); 

app.use(cors(corsOptions));

app.use(express.json());

app.use((req, res, next) => {
    req.io = io;
    next();
});

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