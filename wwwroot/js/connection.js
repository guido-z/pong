const { Subject } = rxjs;

class Connection {
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

    send(message) {
        this._socket.send(message);
    }

    _registerEvents() {
        this._socket.onopen = event => {
            this._onOpen.next();
        };

        this._socket.onmessage = ({ data }) => {
            this._onMessage.next(JSON.parse(data));
        };
    }
}