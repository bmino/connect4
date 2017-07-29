var Board = {

    create: function(xSize, ySize) {
        xSize = xSize || 3;
        ySize = ySize || 3;
        var board = [];
        for (var x=0; x<xSize; x++) {
            board.push([]);
            for (var y=0; y<ySize; y++) {
                board[x].push(undefined);
            }
        }
        console.log(board);
        return board;
    },

    getWinner: function(board, socket) {
        var requiredAdjacent = 3;
        var x,y, diag_x, diag_y;
        var adjacent = {
            local: 0,
            previous: null,
            x: 0,
            y: 0,
            xy: 0,
            yx: 0
        };

        // Y Dimension Win
        for (x=0; x<board.length; x++) {
            adjacent.local = 0;
            adjacent.previous = board[x][0];
            for (y=0; y<board[x].length; y++) {
                if (board[x][y] === adjacent.previous && board[x][y] === socket.id) adjacent.y = Math.max(++adjacent.local, adjacent.y);
                else adjacent.local = 0;
                adjacent.previous = board[x][y];
            }
            if (adjacent.y >= requiredAdjacent) return socket;
        }

        // X Dimension Win
        for (y=0; y<board.length; y++) {
            adjacent.local = 0;
            adjacent.previous = board[0][y];
            for (x=0; x<board[y].length; x++) {
                if (board[x][y] === adjacent.previous && board[x][y] === socket.id) adjacent.x = Math.max(++adjacent.local, adjacent.x);
                else adjacent.local = 0;
                adjacent.previous = board[x][y];
            }
            if (adjacent.x >= requiredAdjacent) return socket;
        }

        // From X wall
        x=0;
        for (y=0; y<board.length; y++) {
            diag_x = x;
            diag_y = y;
            // Checking positive slope
            while (diag_x < board.length && diag_y < board.length && diag_x >= 0 && diag_y >= 0) {
                if (board[diag_x][diag_y] === adjacent.previous && board[diag_x][diag_y] === socket.id) adjacent.xy = Math.max(++adjacent.local, adjacent.xy);
                else adjacent.local = 0;
                adjacent.previous = board[diag_x++][diag_y++];
            }
            if (adjacent.xy >= requiredAdjacent) return socket;

            diag_x = x;
            diag_y = y;
            // Checking negative slope
            while (diag_x < board.length && diag_y < board.length && diag_x >= 0 && diag_y >= 0) {
                if (board[diag_x][diag_y] === adjacent.previous && board[diag_x][diag_y] === socket.id) adjacent.xy = Math.max(++adjacent.local, adjacent.xy);
                else adjacent.local = 0;
                adjacent.previous = board[diag_x++][diag_y--];
            }
            if (adjacent.x >= requiredAdjacent) return socket;
        }

        // From Y wall
        y=0;
        for (x=0; x<board.length; x++) {
            diag_x = x;
            diag_y = y;
            // Checking positive slope
            while (diag_x < board.length && diag_y < board.length && diag_x >= 0 && diag_y >= 0) {
                if (board[diag_x][diag_y] === adjacent.previous && board[diag_x][diag_y] === socket.id) adjacent.xy = Math.max(++adjacent.local, adjacent.yx);
                else adjacent.local = 0;
                adjacent.previous = board[diag_x++][diag_y++];
            }
            if (adjacent.yx >= requiredAdjacent) return socket;

            diag_x = x;
            diag_y = y;
            // Checking negative slope
            while (diag_x < board.length && diag_y < board.length && diag_x >= 0 && diag_y >= 0) {
                if (board[diag_x][diag_y] === adjacent.previous && board[diag_x][diag_y] === socket.id) adjacent.yx = Math.max(++adjacent.local, adjacent.yx);
                else adjacent.local = 0;
                adjacent.previous = board[diag_x--][diag_y++];
            }
            if (adjacent.yx >= requiredAdjacent) return socket;
        }

        return null;

    },

    move: function(move, game, socketId) {
        // Invalid game id
        if (!game) {
            console.log('Err:move - could not find game id ' + game.id);
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

module.exports = Board;