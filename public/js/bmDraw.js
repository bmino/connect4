var bmDraw = {
    debug: true,
    canvas: null,
    ctx: null,

    grid: {
        thickness: 0,
        cols: {
            size: 0,
            count: 0
        },
        rows: {
            size: 0,
            count: 0
        }
    },

    init: function (canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.drawGrid(3, 3, 3);
    },

    drawGrid: function (cols, rows, gridSize) {
        this.grid.thickness = gridSize;
        this.grid.cols.count = cols;
        this.grid.rows.count = rows;
        this.grid.cols.size = this.canvas.scrollWidth;
        this.grid.rows.size = this.canvas.scrollHeight;

        var x = 0;
        var y = 0;
        var width = this.canvas.scrollWidth;
        var height = this.canvas.scrollHeight;

        this.grid.cols.size = (width - ((cols-1) * gridSize)) / cols;
        this.debug && console.log('grid.cols.size: ' + this.grid.cols.size);

        this.grid.rows.size = (height - ((rows-1) * gridSize)) / rows;
        this.debug && console.log('grid.rows.size: ' + this.grid.rows.size);


        for (var i=0; i<cols-1; i++) {
            x += this.grid.cols.size;
            ctx.fillRect(x, 0, gridSize, height);
        }

        for (var i=0; i<rows-1; i++) {
            y += this.grid.rows.size;
            ctx.fillRect(0, y, width, gridSize);
        }
    },

    mark: function(col, row) {
        var originalColor = this.ctx.fillStyle;
        var corner = this.getCorner(col, row);
        var width = this.grid.cols.size - this.grid.thickness;
        var height = this.grid.rows.size - this.grid.thickness;
        this.debug && console.log('marking corner: ', corner);
        this.debug && console.log('marking width: ' + width);
        this.debug && console.log('marking height: ' + height);

        this.ctx.fillStyle = '#EE0000';
        this.ctx.fillRect(corner.x, corner.y, width, height);
        this.ctx.fillStyle = originalColor;
    },

    getCorner: function (col, row) {
        var border = this.grid.thickness;
        var x = (border * col) + (this.grid.cols.size * col);
        var y = (border * row) + (this.grid.rows.size * row);
        return {
            x: x,
            y: y
        };
    }
};