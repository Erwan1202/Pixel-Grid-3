require('dotenv').config();
const express = require('express');
const http = require('http'); 
//const { Server } = require('socket.io'); 

const corsMiddleware = require('./src/middlewares/cors.middleware'); 
const { connectDB } = require('./src/models/db.connect');
const authRoutes = require('./src/routes/auth.routes');
//const gridRoutes = require('./src/routes/grid.routes'); // Ajout des routes Grille
//const { swaggerSpec, swaggerUi } = require('./src/swagger'); // Ajout de Swagger

const app = express();
const port = process.env.PORT || 3001;

// --- Serveur HTTP & Socket.io ---
const server = http.createServer(app);
/* const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST'],
    },
});*/ 

// Middleware pour attacher l'objet io (Socket.io) à req
/* app.use((req, res, next) => {
    req.io = io;
    next();
}); */
// --- Middlewares Globaux ---
app.use(corsMiddleware);
app.use(express.json());

// Connexion BDD
connectDB();

// --- Routes ---
app.use('/api/auth', authRoutes);
//app.use('/api/grid', gridRoutes); // Montage des routes de la grille

// Documentation Swagger
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); 

// --- Middleware de Gestion d'Erreurs Centralisée ---
app.use((err, req, res, next) => {
    console.error(err.stack); 
    const statusCode = err.statusCode || 500;
    const message = err.message || 'An unexpected error occurred on the server.';
    if (statusCode === 500 && process.env.NODE_ENV === 'production') {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
    res.status(statusCode).json({ message });
});

// Démarrage du serveur via http.Server
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`CORS enabled for ${process.env.FRONTEND_URL}`);
});