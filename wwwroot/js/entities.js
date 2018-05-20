class Paddle {
    constructor(position) {
        this._position = position;
        this._height = 100;
        this._width = 20;
    }

    update() { }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.fillRect(this._position.x, this._position.y, this._width, this._height);
        ctx.restore();
    }
}

class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class UI {
    constructor(uiComponents) {
        this._uiComponents = uiComponents;
    }

    update() {
    }

    draw(ctx) {
        for (let uiComponent of this._uiComponents) {
            uiComponent.draw(ctx);
        }
    }
}

class UIComponent {
    constructor(position) {
        this._position = position;
        this._value = 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.font = '30px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(this._value, this._position.x, this._position.y);
        ctx.restore();
    }
}