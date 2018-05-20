const { Observable, fromEvent } = rxjs;

class MessageBus {
    constructor() {        
        this._events = {
            keyDown: fromEvent(document, 'keydown')
        };
    }

    static get instance() {
        this._instance = this._instance || new MessageBus();
        return this._instance;
    }

    subscribe(event) {
        return this._events[event];
    }
}