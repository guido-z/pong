class Game {
    constructor(configuration, socket, ctx) {
        this._configuration = configuration;
        this._socket = socket;
        this._ctx = ctx;
    }

    init() {
        this._paddles = [
            new Paddle(new Position(10, 150)),
            new Paddle(new Position(770, 150))
        ];

        // Get player number        
        this._socket.onopen = () => {
            this._socket.send('playerNumber');
        };

        this._socket.onmessage = ({ data }) => {
            const playerNumber = JSON.parse(data).PlayerNumber;
            this._activePaddle = this._paddles[playerNumber - 1];
        };

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
    }

    _handleMessage() {

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
        this._paddles.forEach(paddle => paddle.draw(this._ctx));

        // UI
        this._ui.draw(this._ctx);
    }
}