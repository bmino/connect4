var Board = require('./Board.js');
var Player = require('./Player.js');
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

    beginGame: function(game) {
        // Active Board Commands
        game.host.on('board:move', function(move) {
            Board.move(move, game, game.host.id) && Game.switchTurn(game);
        });
        game.opponent.on('board:move', function(move) {
            Board.move(move, game, game.opponent.id) && Game.switchTurn(game);
        });

        // Activate Chat Commands
        game.host.on('chat:speak', function(msg) {
            Player.chat(game.host, game.opponent, msg);
        });
        game.opponent.on('chat:speak', function(msg) {
            Player.chat(game.opponent, game.host, msg);
        });

        game.host.emit('game:begin');
        game.opponent.emit('game:begin');

        this.switchTurn(game);
    },

    switchTurn: function(game) {
        // Assigns random player for first turn
        if (game.turnPlayer === null) game.turnPlayer = Math.random() > .5 ? game.host : game.opponent;

        if (this.isDone(game, game.turnPlayer)) return;

        // Switch players
        var previousPlayer = game.turnPlayer;
        game.turnPlayer = previousPlayer === game.host ? game.opponent : game.host;

        previousPlayer.emit('game:turn', false);
        game.turnPlayer.emit('game:turn', true);
    },

    isDone: function(game, socket) {
        var winner = Board.getWinner(game.board, socket);
        if (winner) this.winner(game, winner);
        return winner;
    },

    winner: function(game, winnerSocket) {
        console.log('winner');
        endGame(game, winnerSocket, 'game:win', 'game:lose');
    },

    forfeit: function(game, socket) {
        console.log('forfeit');
        endGame(game, socket, 'game:forfeit', 'game:forfeit');
    }


};

function constructGame(socket) {
    return {
        id: KeyGen.generateId(),
        host: socket,
        opponent: null,
        turnPlayer: null,
        board: Board.create()
    };
}

function endGame(game, socket, socketMsg, otherMsg) {
    var gameIndex = Game.GAME_LIST.indexOf(game);

    // Game has not begun
    if (gameIndex === -1) return;

    delete Game.GAME_LIST[gameIndex];

    if (game.host && socket.id === game.host.id) {
        game.host.emit(socketMsg);
        game.opponent && game.opponent.emit(otherMsg);
    }
    if (game.opponent && socket.id === game.opponent.id) {
        game.opponent.emit(socketMsg);
        game.host && game.host.emit(otherMsg);
    }
}

module.exports = Game;