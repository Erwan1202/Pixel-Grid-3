const server = require('./server'); 
const port = process.env.PORT || 3001;

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`CORS enabled for ${process.env.FRONTEND_URL}`);
});