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
        for (var g in this.GAME_LIST) {
            var game = Game.GAME_LIST[g];
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
        this.GAME_LIST.push(game);
        socket.emit('game:host', {id: game.id});
        return game;
    },

    forfeit: function(game, socket) {
        delete this.GAME_LIST[this.GAME_LIST.indexOf(game)];
        if (game.host && socket.id === game.host.id) {
            game.opponent && game.opponent.emit('game:forfeit');
        }
        if (game.opponent && socket.id === game.opponent.id) {
            game.host && game.host.emit('game:forfeit');
        }
    },

    beginGame: function(game) {
        game.host.emit('game:begin');
        game.opponent.emit('game:begin');
        game.host.on('move:make', function(move) {
            Move.make(move, game, game.host.id) && Game.switchTurn(game);
        });
        game.opponent.on('move:make', function(move) {
            Move.make(move, game, game.opponent.id) && Game.switchTurn(game);
        });
        this.switchTurn(game);
    },

    switchTurn: function(game) {
        // Assigns random player for first turn
        if (game.turnPlayer === null) game.turnPlayer = Math.random() > .5 ? game.host : game.opponent;

        var previousPlayer = game.turnPlayer;

        // Switch players
        game.turnPlayer = previousPlayer === game.host ? game.opponent : game.host;

        previousPlayer.emit('game:turn', false);
        game.turnPlayer.emit('game:turn', true);
    }

};

function constructGame(socket) {
    return {
        id: KeyGen.generateId(),
        host: socket,
        opponent: null,
        turnPlayer: null,
        board: Move.createBoard()
    };
}

module.exports = Game;