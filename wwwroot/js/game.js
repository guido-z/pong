class Game {
    constructor(configuration, connection, ctx) {
        this._configuration = configuration;
        this._connection = connection;
        this._ctx = ctx;
        this._ready = false;
    }

    init() {
        this._createGameObjects();        
        this._connection.onmessage.subscribe(data => { this._handleMessage(data); });
        this._handleEvents();

        // Get player number        
        this._connection.send({
            operation: 'playerNumber'            
        });

        window.onbeforeunload = () => {
            this._connection.close();
        };
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

    _createGameObjects() {
        this._paddles = [
            new Paddle(new Position(10, 150)),
            new Paddle(new Position(770, 150))
        ];

        this._ui = new UI([
            new UIComponent(new Position(330, 50)),
            new UIComponent(new Position(460, 50))
        ]);
    }

    _handleMessage(data) {
        switch (data.message) {
            case 'playerNumber':
                this._activePaddle = this._paddles[data.playerNumber - 1];
                this._playerNumber = data.playerNumber;                
                this._ready = true;
                break
            case 'updatePaddlePosition':
                this._paddles[data.playerNumber - 1]._position = data.position;
                break;
        }
    }

    _handleEvents() {
        MessageBus.instance
            .subscribe('keyDown')
            .subscribe(e => {
                if (e.keyCode === 38) this._activePaddle.moveUp();
                else if (e.keyCode === 40) this._activePaddle.moveDown();
            });

        MessageBus.instance
            .subscribe('paddlePositionChange')
            .subscribe(position => {
                this._connection.send({
                    operation: 'updatePaddlePosition',
                    data: {
                        playerNumber: this._playerNumber,
                        position: position
                    }
                });
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