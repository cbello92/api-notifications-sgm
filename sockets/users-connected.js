const { UserConnected } = require('../classes/user-connected')
const userConnected = new UserConnected();

const usersConnected = (client) => {

    client.on('userConnected', (data, callback) => {
        let users = userConnected.setUsersConnected(data, client.id);

        if (data && data.municipality) {
            // console.log(data.municipality)

            client.join(data.municipality);

            // console.log(users)
            client.broadcast.to(data.municipality).emit('listUsersConnected', users);
            callback(users);
        }

    });

    client.on('disconnect', () => {
        let userDisconnect = userConnected.setUsersDisconnected(client.id);

        if (userDisconnect) {
            client.broadcast.to(userDisconnect.municipality).emit('userDisconnect', userDisconnect);

            let users = userConnected.getUsersConnectedByMunicipality(userDisconnect.municipality);
            client.broadcast.to(userDisconnect.municipality).emit('listUsersConnected', users);
        }
    });

    client.on("start-metting", (data) => {
        let userFrom = userConnected.getUserById(client.id);
        let userTo = userConnected.getUserById(data.to);
        client.to(data.to).emit("start-metting-made", {
            offer: data.offer,
            userFrom,
            userTo,
            socketOrigin: client.id
        });
    });

    client.on("metting-answer", (data) => {
        client.to(data.to).emit("metting-made", {
            socketOrigin: client.id,
            answer: data.answer,
            userFrom: data.userFrom,
            userTo: data.userTo
        });
    });

    client.on("reject-call", (data) => {
        client.to(data.to).emit("call-rejected", {
            socketOrigin: client.id,
            userFrom: data.userFrom,
            userTo: data.userTo
        });
    });


}

module.exports = {
    usersConnected
}