require("dotenv").config();

const DIR_UPLOAD_CUSTOM = process.env.DIR_UPLOAD_CUSTOM;
const DIR_UPLOAD_NOTICES = process.env.DIR_UPLOAD_NOTICES;
const DIR_UPLOAD_UPDATES = process.env.DIR_UPLOAD_UPDATES;
const DIR_UPLOAD_PROTOCOLS = process.env.DIR_UPLOAD_PROTOCOLS;
const DIR_UPLOAD_RELEASES = process.env.DIR_UPLOAD_RELEASES;

module.exports = {
    DIR_UPLOAD_CUSTOM,
    DIR_UPLOAD_NOTICES,
    DIR_UPLOAD_UPDATES,
    DIR_UPLOAD_PROTOCOLS,
    DIR_UPLOAD_RELEASES
}