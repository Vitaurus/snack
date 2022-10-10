import {ctx} from "./modules/variables.js";
import {canvasWidth} from "./modules/variables.js";
import {canvasHeight} from "./modules/variables.js";
import {radius} from "./modules/variables.js";
import {acceleration} from "./modules/variables.js";

class Game {
    constructor(ctx, canvasWidth, canvasHeight, radius) {
        this.ctx = ctx;
        this.radius = radius;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.acceleration = acceleration;
        this.x = canvasWidth / 2;
        this.y = canvasHeight / 2;
        this.pi = Math.PI;
        this.arrayOfPixels = [];
        this.startAnimationTime = Date.now();
        this.meal = false;
        this.stop = false;
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, this.pi * 2, false);
        this.ctx.fillStyle = "#000";
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.closePath();
        this.arraySnackManage(this.x, this.y, this.x, this.y);
        this.move = true;
    }

    arraySnackManage(x, y, newX, newY, push = false, check = false, index = [1,1,1], meal = this.meal) {
        if (check) {
            return this.arrayOfPixels.find(({x, y}, key) => meal.x + this.radius > x - this.radius && meal.x - this.radius < x + this.radius && meal.y + this.radius > y - this.radius && meal.y - this.radius < y + this.radius && key !==index[0]&&key !== index[1]&& key !== index[2]);
        }
        if (this.arrayOfPixels.length === 0 || push) {
            this.arrayOfPixels.push({
                x: newX,
                y: newY,
            })
            return;
        }
        if (!push) {
            this.arrayOfPixels[0] = {x: newX, y: newY, oldX: x, oldY: y};
            this.arrayOfPixels.forEach((value, index) => {
                if (index !== 0) {
                    value.oldX = value.x;
                    value.x = this.arrayOfPixels[index - 1].oldX;
                    value.oldY = value.y;
                    value.y = this.arrayOfPixels[index - 1].oldY;
                }
            })
        }
    }

    manage(direction) {
        if ((direction === "ArrowRight" && this.direction === "ArrowLeft" || this.direction === "ArrowRight" && direction === "ArrowLeft" || direction === "ArrowUp" && this.direction === "ArrowDown" || this.direction === "ArrowUp" && direction === "ArrowDown") || !this.move) {
            return;
        }
        this.move = false;
        this.direction = direction;
        this.animation();
    }

    animation = () => {
       if (this.stop){
           return;
       }
        if (!this.meal) {
            this.meal = this.mealRandomDraw();
        }
        const currentTime = Date.now();
        if (currentTime - this.startAnimationTime >= 500 * this.acceleration) {
            this.move = true;
            let oldX = this.x;
            let oldY = this.y;
            if (this.direction === "ArrowRight") {
                oldX = this.x;
                this.x = this.x + this.radius * 2;
            }
            if (this.direction === "ArrowLeft") {
                oldX = this.x;
                this.x = this.x - this.radius * 2;
            }
            if (this.direction === "ArrowDown") {
                oldY = this.y;
                this.y = this.y + this.radius * 2;
            }
            if (this.direction === "ArrowUp") {
                oldY = this.y;
                this.y = this.y - this.radius * 2;
            }
            this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            this.snackDraw();
            this.mealRandomDraw();
            this.arraySnackManage(oldX, oldY, this.x, this.y);
            const checkCrush = this.arraySnackManage("", "", "", "", false, true, [0,1,2], {
                x: this.arrayOfPixels[0].x,
                y: this.arrayOfPixels[0].y,
            });
            if (checkCrush !== undefined) {
                this.stop = true;
                return;
            }
            if (Math.round(this.x) - Math.round(this.radius) < 0 || Math.round(this.x) + Math.round(this.radius) > this.canvasWidth || Math.round(this.y) - Math.round(this.radius) < 0 || Math.floor(this.y) + this.radius > this.canvasHeight) {
                this.stop = true;
                return;
            }
            if (this.arraySnackManage("", "", "", "", false, true)) {
                this.arraySnackManage("", "", this.x, this.y, true);
                this.meal = false;
            }
            this.startAnimationTime = Date.now();
        }
        return window.requestAnimationFrame(this.animation);
    }

    snackDraw() {
        this.arrayOfPixels.forEach(({x, y}) => {
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.radius, 0, this.pi * 2, false);
            this.ctx.stroke();
            this.ctx.fill();
            this.ctx.closePath();
        })
    }

    mealRandomDraw() {
        if (!this.meal) {
            this.randomValue = this.randomizer();
            while (!this.randomValue) {
                this.randomValue = this.randomizer();
            }
        }
        this.ctx.beginPath();
        this.ctx.arc(this.randomValue.x, this.randomValue.y, this.radius, 0, this.pi * 2, false);
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.closePath();
        return this.randomValue;
    }

    randomizer() {
        let randomX = Math.floor(Math.random() * this.canvasWidth);
        let randomY = Math.floor(Math.random() * this.canvasHeight);
        if (randomX <= this.radius) {
            randomX = randomX + this.radius;
        }
        if (randomX >= this.canvasWidth - this.radius) {
            randomX = randomX - this.radius;
        }
        if (randomY <= this.radius) {
            randomY = randomY + this.radius;
        }
        if (randomY >= this.canvasHeight - this.radius) {
            randomY = randomY - this.radius;
        }

        const findCoincidence = this.arrayOfPixels.find(({x, y}) => (randomX + this.radius >= x - this.radius && randomX - this.radius <= x + this.radius && randomY + this.radius >= y - this.radius && randomY - this.radius <= y + this.radius));
        if (findCoincidence) {
            return undefined;
        }
        return {x: randomX, y: randomY};
    }
}

const game = new Game(ctx, canvasWidth, canvasHeight, radius, acceleration);
game.render();
document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowRight":
            game.manage("ArrowRight");
            break;
        case "ArrowDown":
            game.manage("ArrowDown");
            break;
        case "ArrowLeft":
            game.manage("ArrowLeft");
            break;
        case "ArrowUp":
            game.manage("ArrowUp");
            break;
    }
});
const touchStart = {
    x:0,
    y:0,
}
document.addEventListener("touchstart", (e) => {
    touchStart.x=e.touches[0].pageX;
    touchStart.y=e.touches[0].pageY;
});
const deviation = 100;
document.addEventListener("touchmove", (e) => {
    const {x,y} = touchStart;
    const currentX = e.touches[0].pageX;
    const currentY = e.touches[0].pageY;
   if (currentX-x>=deviation){
       game.manage("ArrowRight");
       return;
   }
    if (x-currentX>=deviation){
        game.manage("ArrowLeft");
        return;
    }
    if (currentY-y>=deviation){
        game.manage("ArrowDown");
        return;
    }
    if (y-currentY>=deviation){
        game.manage("ArrowUp");
    }
})