var KeyGen = require('./KeyGen.js');

var Move = {

    createBoard: function() {
        return [[], [], []];
    },

    make: function(move, game, socketId) {
        // Invalid game id
        if (!game) {
            console.log('Err:move - could not find game id ' + game.id);
            return false;
        }
        if (game.id !== move.game) {
            console.log('Err:move somehow the move is for another game');
            return false;
        }
        // TODO: Wrong turn

        // Space is already been taken
        if (game.board[move.col][move.row] !== undefined) {
            console.log('Err: move - (' + move.col + ', ' + move.row + ') has already been made');
            return false;
        }

        console.log('Making move');
        game.board[move.col][move.row] = socketId;
        game.host.emit('move:draw', move);
        game.opponent.emit('move:draw', move);
        return true;
    }

};

function constructMove() {
    return {
        id: KeyGen.generateId(),
        col: null,
        row: null
    };
}

module.exports = Move;