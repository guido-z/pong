﻿class Paddle {
    constructor(position) {
        this._position = position;
        this._height = 100;
        this._width = 20;
    }

    draw(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(this._position.x, this._position.y, this._width, this._height);
    }

    moveUp() {
        this._position.move(0, -10);
    }

    moveDown() {
        this._position.move(0, 10);
    }
}

class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    move(x, y) {
        this.x += x;
        this.y += y;
    }
}

class UI {
    constructor(uiComponents) {
        this._uiComponents = uiComponents;
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
        ctx.font = '30px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(this._value, this._position.x, this._position.y);
    }
}