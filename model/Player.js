var Chat = require('./Chat.js');
var KeyGen = require('./KeyGen.js');

var Player = {

    PLAYER_LIST: [],

    login: function (socket, username) {
        // Already logged in
        if (this.PLAYER_LIST.indexOf(socket) !== -1) return;

        socket.username = username;
        this.PLAYER_LIST.push(socket);

        socket.on('player:logout', function() {
            Player.logout(socket);
        });

        console.log('Login from: ' + username);
        socket.emit('player:login:success', username);
    },

    chat: function (speaker, recipient, msg) {
        var chat = Chat.create(speaker.username, msg);

        speaker.emit('chat:msg:native', chat);
        recipient.emit('chat:msg:foreign', chat);
    },

    waitForLogin: function (socket) {
        return new Promise(function (resolve, reject) {
            socket.on('player:login:attempt', function(username) {
                Player.login(socket, username);
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