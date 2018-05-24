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
        if (!this._events[event]) {
            this._events[event] = new Subject();
        }
        return this._events[event];
    }

    publish(event, payload) {
        if (this._events[event]) {
            this._events[event].next(payload);
        }
    }
}