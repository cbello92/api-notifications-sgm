const fs = require('fs');
const moment = require('moment-timezone');

const { NoticesJson } = require('../classes/notices-json');

const notifications = (client) => {
    let clientConnected = client ? client.handshake.headers.origin.replace(/^(https?|ftp):\/\//, "").replace(/\//g,'-') : undefined;

    let pathClient = `${process.env.DIR_UPLOAD_CUSTOM}/${clientConnected}`;
    /**************************************** PARA AVISOS PERSONALIZADOS ****************************************/


    let directories = fs.readdirSync(`${pathClient}`);
    directories = directories.filter(x => fs.existsSync(`${pathClient}/${x}`) && fs.lstatSync(`${pathClient}/${x}`).isDirectory() === true);
    for (let index = 0; index < directories.length; index++) {
        fs.watch(`${pathClient}/${directories[index]}`, { persistent: true }, (event, filename) => {
            let noticesJson = NoticesJson.getNoticesJson();
            if (filename && event === 'change') {
                let stat = fs.statSync(`${pathClient}/${directories[index]}/${filename}`);
                let dateUpdate = moment(stat.ctime).tz("America/Santiago").format("YYYY-MM-DD HH:mm:ss");
                dateUpdate = dateUpdate.replace(" ", "T");
                let object = {
                    "client": clientConnected,
                    "folder": `${directories[index]}`,
                    "pathFileRelative": filename,
                    "file": filename.split(/[\\]/g)[1],
                    "dateOriginal": `${dateUpdate}`,
                    "lastUpdate": `${dateUpdate.replace(/T.*/, '').split('-').reverse().join('-')} ${dateUpdate.split("T")[1]}`
                };

                if(directories[index].includes("avis")) {
                    object["noticesJson"] = noticesJson;
                }

                client.emit("customNotices", object);
            }
        });
    }

    fs.watch(`${process.env.DIR_UPLOAD_NOTICES}`, (event, filename) => {
        let noticesJson = NoticesJson.getNoticesJson();
        if (filename && event === 'change') {

            let stat = fs.statSync(`${process.env.DIR_UPLOAD_NOTICES}/${filename}`);
            let dateUpdate = moment(stat.ctime).tz("America/Santiago").format("YYYY-MM-DD HH:mm:ss");
            dateUpdate = dateUpdate.replace(" ", "T");
            let object = {
                "folder": "avisos",
                "nameFile": filename,
                "dateOriginal": `${dateUpdate}`,
                "lastUpdate": `${dateUpdate.replace(/T.*/, '').split('-').reverse().join('-')} ${dateUpdate.split("T")[1]}`,
                "noticesJson": noticesJson
            };

            client.emit("filesModified", object);
        }
    });


    fs.watch(`${process.env.DIR_UPLOAD_PROTOCOLS}`, (event, filename) => {
        if (filename && event === 'change') {

            let stat = fs.statSync(`${process.env.DIR_UPLOAD_PROTOCOLS}/${filename}`);
            let dateUpdate = moment(stat.ctime).tz("America/Santiago").format("YYYY-MM-DD HH:mm:ss");
            dateUpdate = dateUpdate.replace(" ", "T");
            let object = {
                "folder": "protocolos",
                "nameFile": filename,
                "dateOriginal": `${dateUpdate}`,
                "lastUpdate": `${dateUpdate.replace(/T.*/, '').split('-').reverse().join('-')} ${dateUpdate.split("T")[1]}`,
            };

            client.emit("filesModified", object);
        }
    });

    fs.watch(`${process.env.DIR_UPLOAD_RELEASES}`, (event, filename) => {
    
        if (filename && event === 'change') {
            let stat = fs.statSync(`${process.env.DIR_UPLOAD_RELEASES}/${filename}`);
            let dateUpdate = moment(stat.ctime).tz("America/Santiago").format("YYYY-MM-DD HH:mm:ss");
            dateUpdate = dateUpdate.replace(" ", "T");
            let object = {
                "folder": "comunicados",
                "nameFile": filename,
                "dateOriginal": `${dateUpdate}`,
                "lastUpdate": `${dateUpdate.replace(/T.*/, '').split('-').reverse().join('-')} ${dateUpdate.split("T")[1]}`,
            };

            client.emit("filesModified", object);
        }
    });

    fs.watch(`${process.env.DIR_UPLOAD_UPDATES}`, (event, filename) => {
      
        if (filename && event === 'change') {
            let stat = fs.statSync(`${process.env.DIR_UPLOAD_UPDATES}/${filename}`);
            let dateUpdate = moment(stat.ctime).tz("America/Santiago").format("YYYY-MM-DD HH:mm:ss");
            dateUpdate = dateUpdate.replace(" ", "T");
            let object = {
                "folder": "actualizaciones",
                "nameFile": filename,
                "dateOriginal": `${dateUpdate}`,
                "lastUpdate": `${dateUpdate.replace(/T.*/, '').split('-').reverse().join('-')} ${dateUpdate.split("T")[1]}`,
            };

            client.emit("filesModified", object);
        }
    });
}

module.exports = {
    notifications
}