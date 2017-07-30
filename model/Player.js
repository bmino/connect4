var Chat = require('./Chat.js');
var KeyGen = require('./KeyGen.js');

var Player = {

    PLAYER_LIST: [],

    create: function (socket, username) {
        var player = {
            id: KeyGen.generateId(),
            socket: socket,
            username: username
        };
        this.PLAYER_LIST.push(player);
    },

    chat: function (speaker, recipient, msg) {
        var username = 'test username';
        // TODO: get a username from real player
        var chat = Chat.create(username, msg);

        speaker.emit('chat:msg:native', chat);
        recipient.emit('chat:msg:foreign', chat);
    },

    delete: function (socket) {
        for (var p in this.PLAYER_LIST) {
            var player = Player.PLAYER_LIST[p];
            if (player.socket.id === socket.id) delete Player.PLAYER_LIST[Player.PLAYER_LIST.indexOf(player)];
        }
    }

};

module.exports = Player;