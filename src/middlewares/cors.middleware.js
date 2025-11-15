const cors = require('cors');

const whitelist = [
    process.env.FRONTEND_URL, 
];

const corsOptions = {
    origin: (origin, callback) => {
        const vercelPreviewRegex = /^https:\/\/pixel-grid-3-.*\.vercel\.app$/;

        if (whitelist.indexOf(origin) !== -1 || vercelPreviewRegex.test(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

module.exports = cors(corsOptions);