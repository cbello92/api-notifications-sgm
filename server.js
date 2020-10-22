const express = require('express');
const socketIO = require("socket.io");
const app = express();
const cors = require('cors');
const routes = require('./routes/main');

const http = require('http');
let server = http.createServer(app);
const fs = require('fs');
require("dotenv").config();
require('./config/config');
const { NoticesJson } = require('./classes/notices-json');

NoticesJson.setNoticesJson(0, 0);

app.use(express.json());

app.use(cors());
app.use(routes);

if (!fs.existsSync(`${process.env.DIR_UPLOAD_NOTICES}/notices.json`)) {
    fs.writeFileSync(`${process.env.DIR_UPLOAD_NOTICES}/notices.json`, JSON.stringify([], null, 2));
}


if (!fs.existsSync(`${process.env.DIR_UPLOAD_CUSTOM}`)) {
    fs.mkdirSync(`${process.env.DIR_UPLOAD_CUSTOM}`);
}

module.exports.io = socketIO(server);

require('./sockets/socket');

app.get('/api/status', (req, res) => {
    res.status(200).send('API SGM DOCS en linea!!!');
});

server.listen(process.env.PORT, () => {
    console.log(`Server is running now in port ${process.env.PORT}`);
});

module.exports.app = server;