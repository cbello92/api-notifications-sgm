const { NODE_ENV } = require('../active.env');
const path = require('path');

const envs = {
    prod: {
        PORT: 5001,
        DIR_PATH_BASE: path.resolve(__dirname, "../uploads/"),
        DIR_UPLOAD_CUSTOM: path.resolve(__dirname, "../uploads/personalizados"),
        DIR_UPLOAD_NOTICES: path.resolve(__dirname, "../uploads/avisos"),
        DIR_UPLOAD_UPDATES: path.resolve(__dirname, "../uploads/actualizaciones"),
        DIR_UPLOAD_PROTOCOLS: path.resolve(__dirname, "../uploads/protocolos"),
        DIR_UPLOAD_RELEASES: path.resolve(__dirname, "../uploads/comunicados")
    },
    dev: {
        PORT: 5002,
        DIR_PATH_BASE: path.resolve(__dirname, "../uploads/"),
        DIR_UPLOAD_CUSTOM: path.resolve(__dirname, "../uploads/personalizados"),
        DIR_UPLOAD_NOTICES: path.resolve(__dirname, "../uploads/avisos"),
        DIR_UPLOAD_UPDATES: path.resolve(__dirname, "../uploads/actualizaciones"),
        DIR_UPLOAD_PROTOCOLS: path.resolve(__dirname, "../uploads/protocolos"),
        DIR_UPLOAD_RELEASES: path.resolve(__dirname, "../uploads/comunicados")
    }
}

exports.deployment = envs[NODE_ENV];