class Paddle {
    constructor(position) {
        this._position = position;
        this._height = 100;
        this._width = 20;
    }

    update() { }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.fillRect(this._position.x, this._position.y, this._width, this._height);
        ctx.restore();
    }
}

class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}