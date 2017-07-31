var Chat = require('./Chat.js');
var KeyGen = require('./KeyGen.js');

var Player = {

    PLAYER_LIST: [],

    create: function (socket, username) {
        socket.username = username;
    },

    chat: function (speaker, recipient, msg) {
        var username = 'test username';
        // TODO: get a username from real player
        var chat = Chat.create(username, msg);

        speaker.emit('chat:msg:native', chat);
        recipient.emit('chat:msg:foreign', chat);
    }

};

module.exports = Player;