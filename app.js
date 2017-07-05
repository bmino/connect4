var express = require('express');
var app = express();
var server = require('http').Server(app);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
app.use(express.static('public'));

server.listen(2000);


var SOCKET_LIST = [];
var GAME_LIST = [];

var io = require('socket.io')(server, {});
io.sockets.on('connect', function(socket) {
    console.log('New connection');

    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    /* Tries to join existing game if possible */
    if (!joinGame(socket)) {
        var createdGame = createNewGame(socket);
    }

    socket.on('move:make', function(move) {
        var gameId = move.game;
        var game = GAME_LIST[gameId];
        // Invalid game id
        if (!game) {
            console.log('Err:move - could not find game id ' + gameId);
            return;
        }
        // Space is already been taken
        if (game.grid[move.col][move.row]) {
            console.log('Err: move - (' + move.col + ', ' + move.row + ') has already been made');
            return;
        }
        game.grid[move.col][move.row] = gameId;
        game.host.emit('move:draw', move);
        game.opponent.emit('move:draw', move);
    });


    socket.on('disconnect', function() {
        delete SOCKET_LIST[socket.id];
        // Notify games player was a part of
    });

});


function joinGame(socket) {
    for (var gameId in GAME_LIST) {
        var game = GAME_LIST[gameId];
        if (game.opponent === null) {
            // Can join
            game.opponent = socket;
            socket.emit('game:join', {id: gameId});
            return true;
        }
    }
    // No games available to join
    return false;
}

function createNewGame(socket) {
    /* Create New Game */
    var game = {
        host: socket,
        opponent: null,
        grid: [[], [], []]
    };
    var gameId = Math.random();
    GAME_LIST[gameId] = game;
    socket.emit('game:host', {id: gameId});
    return game;
}