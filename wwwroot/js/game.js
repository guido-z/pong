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