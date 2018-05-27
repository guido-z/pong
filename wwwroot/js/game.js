class Game {
    constructor(configuration, connection, ctx) {
        this._configuration = configuration;
        this._connection = connection;
        this._ctx = ctx;
        this._previous = Date.now();

        this._waitingForPlayersCallback = () => {
            this._drawWaitingScreen();
            requestAnimationFrame(this._waitingForPlayersCallback);
        };

        this._gameCallback = () => {
            this._setDelta();
            this._update();
            this._draw();
            requestAnimationFrame(this._gameCallback);
        };        
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

        this._drawWaitingScreen();
    }

    run() {
        requestAnimationFrame(this._gameCallback);
    }

    _setDelta() {
        this._now = Date.now();
        this._delta = (this._now - this._previous) / 1000;
        this._previous = this._now;
    }
    
    _update() {
        this._activePaddle.update();

        this._ball.update(this._delta);

        this._paddles.forEach(paddle => {
            this._ball.checkCollisionAgainstPaddle(paddle);
        });

        this._ball.checkCollisionAgainstBounds(this._configuration.viewPort);
    }

    _createGameObjects() {
        this._paddles = [
            new Paddle(new Position(10, 150, new Bound(0, 300))),
            new Paddle(new Position(770, 150, new Bound(0, 300)))
        ];

        this._ball = new Ball(new Vector2(400, 150));

        this._ui = new UI([
            new UIComponent(new Position(330, 50)),
            new UIComponent(new Position(460, 50))
        ]);
    }

    _handleMessage(data) {
        const messageHandlers = {
            playerNumber: this._onPlayerConnected,
            updatePaddlePosition: this._onUpdatePaddlePosition
        };

        messageHandlers[data.message].bind(this)(data);
    }

    _onPlayerConnected(data) {
        if (!this._activePaddle) {
            this._activePaddle = this._paddles[data.playerNumber - 1];
            this._playerNumber = data.playerNumber;
        }

        if (data.playerNumber === 2) {
            this._callback = this._gameCallback;
            setTimeout(() => this.run(), 3000);            
        }
    }

    _onUpdatePaddlePosition(data) {
        this._paddles[data.playerNumber - 1]._position = data.position;
    }

    _handleEvents() {
        MessageBus.instance
            .subscribe('keyDown')
            .subscribe(this._onKeyDown.bind(this));

        MessageBus.instance
            .subscribe('keyUp')
            .subscribe(this._onKeyUp.bind(this));

        MessageBus.instance
            .subscribe('paddlePositionChange')
            .subscribe(this._sendActivePaddlePosition.bind(this));

        MessageBus.instance
            .subscribe('score')
            .subscribe(this._resetBall.bind(this));
    }

    _onKeyDown(e) {
        if (e.keyCode === 38) {
            this._activePaddle.moveUp();
        }
        else if (e.keyCode === 40) {
            this._activePaddle.moveDown();
        }
    }

    _onKeyUp(e) {
        if (e.keyCode === 38 || e.keyCode === 40) {
            this._activePaddle.stop();
        }
    }

    _sendActivePaddlePosition(position) {
        this._connection.send({
            operation: 'updatePaddlePosition',
            data: {
                playerNumber: this._playerNumber,
                position: position
            }
        });
    }

    _resetBall(playerNumber) {
        const newDirection = playerNumber === 1 ? new Vector2(-1, -1) : new Vector2(1, -1);
        this._ball = new Ball(new Vector2(400, 150), newDirection);
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
        this._ball.draw(this._ctx);

        // UI
        this._ui.draw(this._ctx);
    }

    _drawWaitingScreen() {
        this._ctx.clearRect(0, 0, this._configuration.viewPort.width, this._configuration.viewPort.height);
        this._ctx.fillStyle = this._configuration.backgroundColor;
        this._ctx.fillRect(0, 0, this._configuration.viewPort.width, this._configuration.viewPort.height);

        this._ctx.font = '30px Arial';
        this._ctx.fillStyle = 'white';
        this._ctx.fillText('Waiting for players...', 270, 200);
    }
}