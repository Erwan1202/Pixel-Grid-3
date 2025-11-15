const cors = require('cors');

const allowedOrigin = process.env.FRONTEND_URL.replace(/\/$/, ""); 

const corsOptions = {
    origin: allowedOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

module.exports = cors(corsOptions);