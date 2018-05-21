class Game {
    constructor(configuration, ctx) {
        this._configuration = configuration;
        this._ctx = ctx;
    }

    init() {
        // Paddles
        this._paddle1 = new Paddle(new Position(10, 150));
        this._paddle2 = new Paddle(new Position(770, 150));
        this._activePaddle = this._paddle1;

        // UI
        const score1 = new UIComponent(new Position(330, 50));
        const score2 = new UIComponent(new Position(460, 50));

        this._ui = new UI([
            score1,
            score2
        ]);

        this._processInput();
    }

    run() {
        const callback = () => {
            this._update();
            this._draw();
            requestAnimationFrame(callback);
        };

        requestAnimationFrame(callback);
    }

    _update() {        
        this._paddle1.update();
        this._paddle2.update();
        this._ui.update();
    }

    _processInput() {
        MessageBus.instance
            .subscribe('keyDown')
            .subscribe(e => {
                if (e.keyCode === 38) this._activePaddle.moveUp();
                else if (e.keyCode === 40) this._activePaddle.moveDown();
            });
    }

    _draw() {
        // Field        
        this._ctx.clearRect(0, 0, this._configuration.viewPort.width, this._configuration.viewPort.height);
        this._ctx.fillStyle = this._configuration.backgroundColor;
        this._ctx.fillRect(0, 0, this._configuration.viewPort.width, this._configuration.viewPort.height);

        // Middle line
        this._ctx.beginPath();
        this._ctx.moveTo(400, 0);
        this._ctx.strokeStyle = 'white';
        this._ctx.lineTo(400, 400);
        this._ctx.stroke();

        // Game objects
        this._paddle1.draw(this._ctx);
        this._paddle2.draw(this._ctx);

        // UI
        this._ui.draw(this._ctx);
    }
}