const { io } = require('../server');
const fs = require('fs');
const { notifications } = require('./notifications');
const { usersConnected } = require('./users-connected');

io.on('connection', (client) => {
    let clientConnected = client ? client.handshake.headers.origin.replace(/^(https?|ftp):\/\//, "").replace(/\//g, '-') : undefined;

    let pathClient = `${process.env.DIR_UPLOAD_CUSTOM}/${clientConnected}`;

    if (clientConnected && !fs.existsSync(pathClient)) {
        fs.mkdirSync(pathClient);
        fs.mkdirSync(`${pathClient}/avisos`);
        fs.mkdirSync(`${pathClient}/actualizaciones`);
        fs.mkdirSync(`${pathClient}/comunicados`);
        fs.mkdirSync(`${pathClient}/protocolos`);
        fs.writeFileSync(`${pathClient}/avisos/notices.json`, JSON.stringify([], null, 2));
    }

    notifications(client);

    usersConnected(client)
});