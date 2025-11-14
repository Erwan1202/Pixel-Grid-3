require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./src/models/db.connect');
const authRoutes = require('./src/routes/auth.routes');
const app = express();
const port = process.env.PORT || 3001;

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
connectDB();
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack); 
    const statusCode = err.statusCode || 500;
    const message = err.message || 'An unexpected error occurred on the server.';
    if (statusCode === 500 && process.env.NODE_ENV === 'production') {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
    res.status(statusCode).json({ message });
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`CORS enabled for ${process.env.FRONTEND_URL}`);
});