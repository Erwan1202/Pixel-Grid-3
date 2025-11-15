const cors = require('cors');

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

module.exports = cors(corsOptions);