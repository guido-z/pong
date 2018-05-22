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

    const socket = createConnection();

    const game = new Game(configuration, socket, ctx);
    game.init();
    game.run();
};

function createConnection() {
    const protocol = location.protocol === 'http:' ? 'ws:' : 'wss:';
    const host = location.host;
    const url = protocol + '//' + host + '/api/values';

    return new WebSocket(url);
}