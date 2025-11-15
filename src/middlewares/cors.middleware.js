const cors = require('cors');

const DEFAULT_WHITELIST = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
];

const vercelPreviewRegex = /^https:\/\/pixel-grid-3-.*\.vercel\.app$/;

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        const whitelist = DEFAULT_WHITELIST.filter(Boolean);
        if (whitelist.includes(origin) || vercelPreviewRegex.test(origin)) {
            return callback(null, true);
        }

        console.warn(`CORS blocked request from origin: ${origin}`);
        return callback(new Error('Not allowed by CORS'));
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 200,
};

module.exports = cors(corsOptions);