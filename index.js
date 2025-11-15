const server = require('./server'); 
const port = process.env.PORT || 3001;

server.listen(port, '0.0.0.0', () => { 
    console.log(`Server running on port ${port}`);
});