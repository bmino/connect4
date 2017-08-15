var express = require('express');
var app = express();
var server = require('http').Server(app);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static('public'));
app.use('/npm/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/npm/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));

server.listen(process.env.PORT || 2000);

var KeyGen = require('./model/KeyGen.js');
var Game = require('./model/Game.js');
var Player = require('./model/Player.js');

var SOCKET_LIST = [];

var io = require('socket.io')(server, {});
io.sockets.on('connect', function(socket) {
    console.log('New connection');

    socket.id = KeyGen.generateId();
    SOCKET_LIST[socket.id] = socket;
    var game;

    /* Waits for Player login */
    Player.waitForLogin(socket)
        .then(function(username) {
            /* Tries to join existing game, then hosts game */
            game = Game.findGame(socket);
        });


    socket.on('disconnect', function() {
        Game.forfeit(game, socket);
        Player.logout(socket);
        delete SOCKET_LIST[socket.id];
    });

});


