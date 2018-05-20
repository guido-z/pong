window.onload = () => {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    const configuration = {
        backgroundColor: 'black',
        viewPort: {
            height: canvas.getAttribute('height'),
            width: canvas.getAttribute('width')
        },
        targetFramerate: 16
    };

    const game = new Game(configuration, ctx);
    game.run();
};

class Game {
    constructor(configuration, ctx) {
        this._configuration = configuration;
        this._ctx = ctx;
    }

    run() {
        setInterval(() => {
            this._update();
            this._draw();
        }, this._configuration.targetFramerate);
    }

    _update() { }

    _draw() {
        this._ctx.clearRect(0, 0, this._configuration.viewPort.width, this._configuration.viewPort.height);
        this._ctx.fillStyle = this._configuration.backgroundColor;
        this._ctx.fillRect(0, 0, this._configuration.viewPort.width, this._configuration.viewPort.height);
    }
}