var Chat = require('./Chat.js');
var KeyGen = require('./KeyGen.js');

var Player = {

    PLAYER_LIST: [],

    create: function (socket, username) {
        socket.username = username;
        this.PLAYER_LIST.push(socket);
    },

    chat: function (speaker, recipient, msg) {
        var chat = Chat.create(speaker.username, msg);

        speaker.emit('chat:msg:native', chat);
        recipient.emit('chat:msg:foreign', chat);
    },

    login: function (socket) {
        return new Promise(function (resolve, reject) {
            socket.on('player:login', function(username) {
                console.log('Login from: ' + username);
                Player.create(socket, username);
                resolve(username);
            });
        });
    },

    logout: function (socket) {
        var playerIndex = this.PLAYER_LIST.indexOf(socket);

        // Player has not logged in
        if (playerIndex === -1) return;

        delete this.PLAYER_LIST[playerIndex];
        console.log('Logout from: ' + socket.username);
    }

};

module.exports = Player;