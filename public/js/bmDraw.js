var bmDraw = {
    debug: true,
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
        }
    },

    init: function (canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.grid.cols.border = 3;
        this.grid.rows.border = 3;
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
    },

    getCorner: function (col, row) {
        var x = (this.grid.cols.width * col);
        x += this.grid.cols.border * (col);
        var y = (this.grid.rows.height * row);
        y += this.grid.rows.border * (row);
        return {
            x: x,
            y: y
        };
    },

    debugger: function(msg) {
        this.debug && console.log(msg);
    }
};