const getFolder = (resource, custom, client) => {
    return `${custom && custom === 'ok' && client ? `${process.env.DIR_UPLOAD_CUSTOM}/${client}` : process.env.DIR_PATH_BASE}/${resource}`;
}

module.exports = {
    getFolder
}