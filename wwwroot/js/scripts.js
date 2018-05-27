window.onload = () => {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    const configuration = {
        backgroundColor: 'black',
        viewPort: {
            height: canvas.getAttribute('height'),
            width: canvas.getAttribute('width')
        }
    };

    const connection = createConnection();

    connection.onopen.subscribe(() => {
        const game = new Game(configuration, connection, ctx);
        game.init();
    });
};

function createConnection() {
    const protocol = location.protocol === 'http:' ? 'ws:' : 'wss:';
    const host = location.host;
    const url = protocol + '//' + host + '/api/values';

    return new Connection(url);
}