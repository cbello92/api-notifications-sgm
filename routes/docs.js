const router = require('express').Router();
const { getFolder } = require('../helpers/utils');
const fs = require('fs');
const path = require('path');
let moment = require('moment-timezone');
const fileUpload = require('express-fileupload');
const { NoticesJson } = require('../classes/notices-json');

// let noticesJsonClass = NoticesJson.setNoticesJson(0, 0);

// const {
//     process.env.DIR_UPLOAD_CUSTOM,
//     DIR_UPLOAD_NOTICES,
//     DIR_UPLOAD_UPDATES,
//     DIR_UPLOAD_PROTOCOLS,
//     DIR_UPLOAD_RELEASES
// } = require('../helpers/constants');

router.delete('/deleteFile/:folder/:file', (req, res) => {
    try { 
        const { folder, file } = req.params;

        const { custom, client } = req.query;

        let resource = getFolder(folder, custom, client);

        let existsDirname = fs.existsSync(resource);
        
        if(!existsDirname) return res.status(404).send(`El archivo ${file} no existe en /${folder}`);

        fs.unlinkSync(`${resource}/${file}`);

        res.status(200).send(`${file} ha sido eliminado de /${folder}`);
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
});

router.post('/uploadFile/:folder', fileUpload(), (req, res) => {
    try { 
        const { folder } = req.params;

        const { custom, client } = req.query;

        let resource = getFolder(folder, custom, client);



        let existsDirname = fs.existsSync(resource);
        
        if(!existsDirname) return res.status(404).send(`El directorio ${folder} no existe`);
        
        if(!req.files) return res.status(400).send(`Debes indicar el archivo que deseas subir`);

        let filesUpload = req.files.file;

        if(Array.isArray(filesUpload)) {
            for(let i =0; i < filesUpload.length; i++) {
                if(fs.existsSync(`${resource}/${filesUpload[i].name}`)) {
                    fs.unlinkSync(`${resource}/${filesUpload[i].name}`);
                }
                filesUpload[i].mv(`${resource}/${filesUpload[i].name}`);
            }
        } else {
            if(fs.existsSync(`${resource}/${filesUpload.name}`)) {
                fs.unlinkSync(`${resource}/${filesUpload.name}`);
            }
            filesUpload.mv(`${resource}/${filesUpload.name}`);
        }

        res.status(200).send(`Archivo(s) subido(s) con exito`);
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
});

router.get('/notices', (req, res) => {
    
    try { 

        const { custom, client } = req.query;
        
        let resource = getFolder("avisos", custom, client);

        let existsDirname = fs.existsSync(`${resource}/notices.json`);
        
        if(!existsDirname) return res.status(404).send(`El directorio avisos no existe`);

        
        let jsonFile = JSON.parse(fs.readFileSync(`${resource}/notices.json`));
        let json = jsonFile;
        res.status(200).send(json);
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
});


router.get('/getClients', (req, res) => {
    
    try { 
        let resource = `${process.env.DIR_UPLOAD_CUSTOM}`;
        
        if(!resource) return res.status(404).send(`El directorio avisos no existe`);

        let folders = fs.readdirSync(resource);

        
        // let jsonFile = JSON.parse(fs.readFileSync(`${resource}/notices.json`));
        // let json = jsonFile;
        res.status(200).send(folders);
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
});


router.get('/notices/:date', (req, res) => {
    try { 
        const { date } = req.params;
        let resource = `${process.env.DIR_PATH_BASE}/avisos`;

        let existsDirname = fs.existsSync(`${resource}/notices.json`);
        
        if(!existsDirname) return res.status(404).send(`El directorio avisos no existe`);

        
        let jsonFile = JSON.parse(fs.readFileSync(`${resource}/notices.json`));
        let json = jsonFile;

        json = json.filter(x => x.dateString === date);

        res.status(200).send(json);
    } catch(e) {
        res.status(500).send(e);
    }
});


router.get('/getFolders', (req, res) => {
    try {          

        const { custom, client } = req.query;

        let resource = `${process.env.DIR_PATH_BASE}`;

        if(req.query && custom && client) {
            resource = `${process.env.DIR_UPLOAD_CUSTOM}/${client}`;
        }

        // console.log(resource);
        
        if(!resource) return res.status(404).send(`El recurso ${resource} no existe`);

        let existsDirname = fs.existsSync(resource);

        if(!existsDirname) return res.status(404).send(`El directorio ${resource} no existe`);

        let folders = fs.readdirSync(resource).filter(x => x !== 'clientes' && x !== 'personalizados');

        let newArray = [];

        for(let i = 0; i < folders.length; i++) {
            let stat = fs.statSync(`${resource}/${folders[i]}`);

            let files = fs.readdirSync(`${resource}/${folders[i]}`).filter(x => !x.includes('git'));

            files.sort(function(a, b) {
                return fs.statSync(`${resource}/${folders[i]}/${b}`).ctime.getTime() - 
                    fs.statSync(`${resource}/${folders[i]}/${a}`).ctime.getTime();
            });

            // console.log(files);

            let fileJson = files.find(x => x.includes("json") && folders[i].includes('avis'));
            let dateUpdate = files[0] && moment(fs.statSync(`${resource}/${folders[i]}/${files[0]}`).ctime).tz("America/Santiago").format("YYYY-MM-DD HH:mm:ss") 
            || moment(stat.ctime).tz("America/Santiago").format("YYYY-MM-DD HH:mm:ss");
            // let dateUpdate = fileJson ?
            // moment(fs.statSync(`${resource}/${folders[i]}/${fileJson}`).ctime).tz("America/Santiago").format("YYYY-MM-DD HH:mm:ss")
            // : moment(stat.ctime).tz("America/Santiago").format("YYYY-MM-DD HH:mm:ss");
            dateUpdate = dateUpdate.replace(" ", "T");

            newArray.push({
                "nameFolder": folders[i],
                "files": files,
                "jsonArray": fileJson ? JSON.parse(fs.readFileSync(`${resource}/${folders[i]}/${fileJson}`)) : undefined,
                "dateOriginal": `${dateUpdate}`,
                "lastUpdate": `${dateUpdate.replace(/T.*/, '').split('-').reverse().join('-')} ${dateUpdate.split("T")[1]}`,
            });
        }

        newArray.sort(function(a, b) {
            if(newArray.find(x => x.nameFolder === b.nameFolder) && newArray.find(x => x.nameFolder === a.nameFolder)) {
                return new Date(newArray.find(x => x.nameFolder === b.nameFolder).dateOriginal).getTime() - 
                new Date(newArray.find(x => x.nameFolder === a.nameFolder).dateOriginal).getTime();
            }
        });

        res.status(200).send(newArray);
    } catch(e) { 
        console.log(e);
        res.status(500).send(e);
    }
}); 

router.get('/:resource/getFiles', (req, res) => {
    try {   
        const { custom, client } = req.query;
        const { resource } = req.params;
        
        let path = getFolder(resource, custom, client);

        // console.log(path);
        
        if(!path) return res.status(404).send(`El recurso ${resource} no existe`);

        let existsDirname = fs.existsSync(path);

        if(!existsDirname) return res.status(404).send(`El directorio ${path} no existe`);

        let files = fs.readdirSync(path).filter(x => !x.includes("git"));

        files.sort(function(a, b) {
            return fs.statSync(`${path}/${b}`).ctime.getTime() - 
                fs.statSync(`${path}/${a}`).ctime.getTime();
        });

        let newArray = [];
        
        for(let i = 0; i < files.length; i++) {
            let stat = fs.statSync(`${path}/${files[i]}`);
            let dateUpdate = moment(stat.ctime).tz("America/Santiago").format("YYYY-MM-DD HH:mm:ss");
            dateUpdate = dateUpdate.replace(" ", "T");
            let fileType = files[i].split(".");
            let jsonFile = undefined;

            if(fileType[fileType.length-1] === 'json' && resource.includes("avis")) {
                jsonFile = JSON.parse(fs.readFileSync(`${path}/${files[i]}`));
                jsonFile = jsonFile
                .sort(function(a, b) {
                    return new Date(b.dateISOString).getTime() - 
                    new Date(a.dateISOString).getTime();
                });
            }

            newArray.push({
                "nameFile": files[i],
                "dataExtra": fileType[fileType.length-1] === 'json' ? jsonFile : undefined,
                "dateOriginal": `${dateUpdate}`,
                "lastUpdate": `${dateUpdate.replace(/T.*/, '').split('-').reverse().join('-')} ${dateUpdate.split("T")[1]}`,
            });
        }

        res.status(200).send(newArray);
    } catch(e) { 
        console.log(e);
        res.status(500).send(e);
    }
});

router.get('/:resource/:file', (req, res) => {
    try { 
        const { resource, file } = req.params;
        const { custom, client } = req.query;

        let pathResource = getFolder(resource, custom, client);

        // console.log(pathResource);

        if(!pathResource) return res.status(404).send(`El recurso ${pathResource} no existe`);

        
        let existsDirname = fs.existsSync(pathResource);
        
        if(!existsDirname) return res.status(404).send(`El recurso ${pathResource} no existe`);
        
        let files = fs.readdirSync(pathResource);
        
        let findFile = files.find(x => x === file);
        
        if(!findFile) return res.status(404).send(`El documento o archivo ${file} no existe`);
        
        let fileResource = `${pathResource}/${file}`;

        return res.sendFile(fileResource);
    } catch(e) { 
        res.status(500).send(e.message);
    }
});


router.delete('/noticeDelete/:noticeId', (req, res) => {
    try {

        const { noticeId } = req.params;
        const { custom, client } = req.query;

        let resource = getFolder("avisos", custom, client);

        let existsDirname = fs.existsSync(`${resource}/notices.json`);

        if (!existsDirname) return res.status(404).send(`El directorio avisos no existe`);

        let jsonFile = JSON.parse(fs.readFileSync(`${resource}/notices.json`));
        let json = jsonFile;

        let lengthJsonBefore = json.length;

        let findElement = json.find(x => x.id === parseInt(noticeId));

        if (!findElement) return res.status(404).send("El aviso no existe");

        let newArray = json.filter(x => x.id !== findElement.id);

        fs.writeFileSync(`${resource}/notices.json`, JSON.stringify(newArray, null, 2));

        // req.app.set("noticesJson", { "lengthBefore": lengthJsonBefore, "lengthAfter": newArray.length });

        NoticesJson.setNoticesJson(lengthJsonBefore, newArray.length);

        res.status(200).send(newArray);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.post('/pushNotice/:folder', (req, res) => {
    // console.log(app);
    try {
        const { custom, client } = req.query;
        const { folder } = req.params;

        let { body } = req;

        let resource = getFolder(folder, custom, client);

        let existsDirname = fs.existsSync(`${resource}/notices.json`);

        if (!existsDirname) {
            fs.writeFileSync(`${resource}/notices.json`, JSON.stringify([], null, 2));
        }


        let jsonFile = JSON.parse(fs.readFileSync(`${resource}/notices.json`));
        let json = jsonFile;
        let lengthJsonBefore = json.length;

        let verifyExistsNotice = json.find(x => x.message.toLowerCase() === body.message.toLowerCase());

        if (verifyExistsNotice) return res.status(404).send(`El aviso que desea registar ya existe`);

        let date = moment(new Date().toISOString()).tz("America/Santiago").format("YYYY-MM-DD HH:mm:ss");

        date = date.replace(" ", "T");

        if (json.length > 0) {
            json.sort(function (a, b) {
                return b.id - a.id;
            });

            body["id"] = json[0].id + 1;
        } else {
            body["id"] = json.length + 1;
        }


        body["dateISOString"] = date;
        body["dateString"] = date.split("T")[0];

        json.push(body);
        fs.unlinkSync(`${resource}/notices.json`);

        fs.writeFileSync(`${resource}/notices.json`, JSON.stringify(json, null, 2));
        NoticesJson.setNoticesJson(lengthJsonBefore, json.length);

        res.status(200).send(json);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});





module.exports = router;