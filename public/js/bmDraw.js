var bmDraw = {
    debug: false,
    canvas: null,
    ctx: null,

    grid: {
        cols: {
            count: 0,
            width: 0,
            border: 0
        },
        rows: {
            count: 0,
            width: 0,
            border: 0
        },
        state: []
    },

    init: function (canvas, ctx, border) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.grid.cols.border = border;
        this.grid.rows.border = border;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid(3, 3);
    },

    drawGrid: function (cols, rows) {
        var width = this.canvas.scrollWidth;
        var height = this.canvas.scrollHeight;

        this.grid.cols.count = cols;
        this.grid.cols.width = (width - ((cols-1) * this.grid.cols.border)) / cols;
        this.debugger('grid.cols.width: ' + this.grid.cols.width);

        this.grid.rows.count = rows;
        this.grid.rows.height = (height - ((rows-1) * this.grid.rows.border)) / rows;
        this.debugger('grid.rows.height: ' + this.grid.rows.height);

        this.grid.state = [];
        for (var c=0; c<cols; c++) {
            this.grid.state[c] = [];
            for (var r=0; r<rows; r++) {
                this.grid.state[c][r] = '';
            }
        }

        var x = 0;
        for (var i=0; i<cols-1; i++) {
            x += this.grid.cols.width;
            ctx.fillRect(x, 0, this.grid.cols.border, height);
            x += this.grid.cols.border;
        }

        var y = 0;
        for (var j=0; j<rows-1; j++) {
            y += this.grid.rows.height;
            ctx.fillRect(0, y, width, this.grid.rows.border);
            y += this.grid.rows.border;
        }
    },

    mark: function(col, row) {
        var originalColor = this.ctx.fillStyle;
        var corner = this.getCorner(col, row);
        var width = this.grid.cols.width;
        var height = this.grid.rows.height;
        this.debugger('marking corner: (' + corner.x + ', ' + corner.y + ')');
        this.debugger('marking width: ' + width);
        this.debugger('marking height: ' + height);

        this.ctx.fillStyle = '#EE0000';
        this.ctx.fillRect(corner.x, corner.y, width, height);
        this.ctx.fillStyle = originalColor;

        this.grid.state[col][row] = 'X';
        this.debug && this.debugGrid();
    },

    identifyGridFromMouse: function(x, y) {
        this.debugger('Identifying grid at mouse position (' + x + ', ' + y + ')');
        var col = Math.floor(x / (this.canvas.scrollWidth / this.grid.cols.count));
        col = Math.min(col, this.grid.cols.count-1);
        var row = Math.floor(y / (this.canvas.scrollHeight / this.grid.rows.count));
        row = Math.min(row, this.grid.rows.count-1);

        this.debugger('Identified grid position (' + col + ', ' + row + ')');

        return {x: col, y: row};
    },

    getCorner: function (col, row) {
        var x = (this.grid.cols.width * col) + (this.grid.cols.border * col);
        var y = (this.grid.rows.height * row) + (this.grid.rows.border * row);
        return {x: x, y: y};
    },

    debugger: function(msg) {
        this.debug && console.log(msg);
    },

    debugGrid: function() {
        if (!this.debug) return;

        var rowString = '';
        for (var c=0; c<this.grid.cols.count; c++) {
            rowString = '[';
            for (var r=0; r<this.grid.rows.count; r++) {
                if (this.grid.state[r][c].length === 0) rowString += '-';
                else rowString += this.grid.state[r][c];
            }
            rowString += ']';
            console.log(rowString);
        }
    }
};