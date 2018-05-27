class Paddle {
    constructor(position) {
        this._position = position;        
        this._speed = Vector2.zero;
        this._height = 100;
        this._width = 20;
    }

    get boundingBox() {
        return new Rectangle(this._position.x, this._position.y, this._width, this._height);
    }

    update() {
        this._move(this._speed.x, this._speed.y);
    }

    moveUp() {
        this._speed = new Vector2(0, -10);
    }

    moveDown() {
        this._speed = new Vector2(0, 10);
    }

    stop() {
        this._speed = Vector2.zero;
    }

    draw(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(this._position.x, this._position.y, this._width, this._height);
    }

    _move(x, y) {        
        this._position.move(x, y);
        MessageBus.instance.publish('paddlePositionChange', this._position);
    }
}

class Ball {
    constructor(position, direction) {
        this._position = position;
        this._velocity = 5;
        this._setSpeed(direction || new Vector2(1, -1));
        this._height = 15;
        this._width = 15;
    }

    get boundingBox() {
        return new Rectangle(this._position.x, this._position.y, this._width, this._height);
    }

    update() {
        this._position = this._position.add(this._speed);
    }

    checkCollisionAgainstPaddle(paddle) {
        if (this.boundingBox.intersects(paddle.boundingBox)) {
            this._speed.x *= -1;
        }
    }

    checkCollisionAgainstBounds(bounds) {        
        if (this._position.x <= 0 || this._position.x + this._width > bounds.width) {
            const playerNumber = this._position.x <= 0 ? 2 : 1;
            MessageBus.instance.publish('score', playerNumber);
        }

        else if (this._position.y <= 0 || this._position.y + this._height >= bounds.height) {
            this._speed.y *= -1;
        }
    }

    draw(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(this._position.x, this._position.y, this._width, this._height);
    }

    _setSpeed(direction) {
        this._speed = direction.normalize().multiply(this._velocity);
    }
}

class Position {
    constructor(x, y, bounds) {
        this.x = x;
        this.y = y;
        this._bounds = bounds;
    }

    move(x, y) {
        this.x += x;
        this.y += y;

        if (this._bounds) {
            this.y = Utilities.clamp(this.y, this._bounds.min, this._bounds.max);
        }
    }
}

class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static get zero() {
        return new Vector2(0, 0);
    }

    normalize() {
        const length = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
        return new Vector2(this.x / length, this.y / length);
    }

    add(vector) {
        return new Vector2(this.x + vector.x, this.y + vector.y);
    }

    multiply(number) {
        return new Vector2(number * this.x, number * this.y);
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Rectangle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    intersects(rectangle) {
        return !(this.x > rectangle.x + rectangle.width ||
            this.x + this.width < rectangle.x ||
            this.y > rectangle.y + rectangle.height ||
            this.y + this.height < rectangle.y);
    }

    _containsPoint(point) {
        const { x, y, width, height } = this;

        return
            point.x >= x &&
            point.x <= x + width &&
            point.y >= y &&
            point.y <= y + height;
    }
}

class Bound {
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }
}

class UI {
    constructor(uiComponents) {
        this._uiComponents = uiComponents;
        this._handleEvents();
    }

    draw(ctx) {
        for (let uiComponent of this._uiComponents) {
            uiComponent.draw(ctx);
        }
    }

    _handleEvents() {
        MessageBus.instance
            .subscribe('score')
            .subscribe(playerNumber => {
                this._uiComponents[playerNumber - 1].increaseValue();
            });
    }
}

class UIComponent {
    constructor(position) {
        this._position = position;
        this._value = 0;
    }

    increaseValue() {
        this._value++;
    }

    draw(ctx) {
        ctx.font = '30px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(this._value, this._position.x, this._position.y);
    }
}