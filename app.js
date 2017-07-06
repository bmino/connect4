var express = require('express');
var app = express();
var server = require('http').Server(app);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
app.use(express.static('public'));

server.listen(2000);

var Game = require('./model/Game.js');


var SOCKET_LIST = [];

var io = require('socket.io')(server, {});
io.sockets.on('connect', function(socket) {
    console.log('New connection');

    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    /* Tries to join existing game, then hosts game */
    var game = Game.findGame(socket);
    console.log('Entered a game id: ' + game.id);


    socket.on('disconnect', function() {
        delete SOCKET_LIST[socket.id];
        // Notify games player was a part of
    });

});


