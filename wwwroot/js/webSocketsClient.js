const { Subject } = rxjs;

class WebSocketsClient {
    constructor(url) {
        this._socket = new WebSocket(url);    
        this._onOpen = new Subject();
        this._onMessage = new Subject();
        this._registerEvents();
    }

    get onopen() {
        return this._onOpen;
    }

    get onmessage() {
        return this._onMessage;
    }
    
    close() {
        this._connection.close();
    }

    getPlayerNumber() {
        this._send({ operation: 'getPlayerNumber' });
    }

    updatePaddlePosition(data) {
        this._send({
            operation: 'updatePaddlePosition',
            data: data
        });
    }

    _registerEvents() {
        this._socket.onopen = event => {
            this._onOpen.next();
        };

        this._socket.onmessage = ({ data }) => {
            this._onMessage.next(JSON.parse(data));
        };
    }

    _send(message) {
        this._socket.send(JSON.stringify(message));
    }
}