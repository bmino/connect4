var Move = require('./Move.js');
var KeyGen = require('./KeyGen.js');

var Game = {

    GAME_LIST: [],

    findGame: function(socket) {
        var game = Game.joinGame(socket);
        if (game === null) game = Game.createNewGame(socket);
        return game;
    },

    joinGame: function(socket) {
        for (var gameId in this.GAME_LIST) {
            var game = this.GAME_LIST[gameId];
            if (game.opponent === null) {
                // Can join this game
                game.opponent = socket;
                socket.emit('game:join', {id: game.id});
                this.beginGame(game);
                return game;
            }
        }
        // No games available to join
        return null;
    },

    createNewGame: function(socket) {
        var game = constructGame(socket);
        this.GAME_LIST[game.id] = game;
        socket.emit('game:host', {id: game.id});
        return game;
    },

    beginGame: function(game) {
        game.host.emit('game:begin');
        game.opponent.emit('game:begin');
        game.host.on('move:make', function(move) {
            Move.make(move, game);
        });
        game.opponent.on('move:make', function(move) {
            Move.make(move, game);
        });
    }

};

function constructGame(socket) {
    return {
        id: KeyGen.generateId(),
        host: socket,
        opponent: null,
        grid: [[], [], []]
    };
}

module.exports = Game;