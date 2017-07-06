var Move = {
    make: function(move, game) {

        // Invalid game id
        if (!game) {
            console.log('Err:move - could not find game id ' + game.id);
            return;
        }
        // Space is already been taken
        if (game.grid[move.col][move.row]) {
            console.log('Err: move - (' + move.col + ', ' + move.row + ') has already been made');
            return;
        }

        console.log('Making move');
        game.grid[move.col][move.row] = game.id;
        game.host.emit('move:draw', move);
        game.opponent.emit('move:draw', move);
    }

};

function constructMove() {
    return {
        id: Math.random(),
        col: null,
        row: null
    };
}

module.exports = Move;