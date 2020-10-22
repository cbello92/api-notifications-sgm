const { deployment } = require('./env');

process.env.PORT = deployment.PORT;
process.env.DIR_PATH_BASE = deployment.DIR_PATH_BASE;
process.env.DIR_UPLOAD_CUSTOM = deployment.DIR_UPLOAD_CUSTOM;
process.env.DIR_UPLOAD_NOTICES = deployment.DIR_UPLOAD_NOTICES;
process.env.DIR_UPLOAD_UPDATES = deployment.DIR_UPLOAD_UPDATES;
process.env.DIR_UPLOAD_PROTOCOLS = deployment.DIR_UPLOAD_PROTOCOLS;
process.env.DIR_UPLOAD_RELEASES = deployment.DIR_UPLOAD_RELEASES;
process.env.TIME_ZONE = "America/Santiago";
