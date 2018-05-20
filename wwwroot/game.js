class Game {
    constructor(configuration, ctx) {
        this._configuration = configuration;
        this._ctx = ctx;
    }

    init() {
        this._paddle1 = new Paddle(new Position(10, 150));
        this._paddle2 = new Paddle(new Position(770, 150));
    }

    run() {
        setInterval(() => {
            this._update();
            this._draw();
        }, this._configuration.targetFramerate);
    }

    _update() {
        this._paddle1.update();
        this._paddle2.update();
    }

    _draw() {
        this._ctx.clearRect(0, 0, this._configuration.viewPort.width, this._configuration.viewPort.height);
        this._ctx.fillStyle = this._configuration.backgroundColor;
        this._ctx.fillRect(0, 0, this._configuration.viewPort.width, this._configuration.viewPort.height);

        this._paddle1.draw(this._ctx);
        this._paddle2.draw(this._ctx);
    }
}

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