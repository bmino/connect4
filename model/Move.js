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
            console.log('Err:move - somehow the move is for another game');
            return false;
        }

        if (game.turnPlayer.id !== socketId) {
            console.log('Err:move - players cannot move unless it is their turn');
            return;
        }

        // Space is already been taken
        if (game.board[move.col][move.row] !== undefined) {
            console.log('Err: move - (' + move.col + ', ' + move.row + ') has already been made');
            return false;
        }

        console.log('Making move');
        game.board[move.col][move.row] = socketId;
        var hostType = game.host.id === socketId ? ':native' : ':foreign';
        var opponentType = game.opponent.id === socketId ? ':native' : ':foreign';

        game.host.emit('move:draw' + hostType, move);
        game.opponent.emit('move:draw' + opponentType, move);
        return true;
    }

};

module.exports = Move;