import {canvas, ctx} from "./modules/variables.js";
import {canvasWidth} from "./modules/variables.js";
import {canvasHeight} from "./modules/variables.js";
import {radius} from "./modules/variables.js";
import {select} from "./modules/variables.js";

class Game {
    constructor(ctx, canvasWidth, canvasHeight, radius, acceleration) {
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
        this.direction = [];
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, this.pi * 2, false);
        this.ctx.fillStyle = "#000";
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.closePath();
        this.arraySnackManage(this.x, this.y, this.x, this.y);
    }
    calcArrow(){
    const x = Math.round(this.canvasWidth/(radius*2));
    const y = Math.round(this.canvasHeight/(radius*2));
    const arrow = x*y;
        this.coeff = (Math.abs(0.1-this.acceleration))/arrow;
    }
    arraySnackManage(x, y, newX, newY, push = false, check = false, index = [1,1,1,1], meal = this.meal) {
        if (check) {
            return this.arrayOfPixels.find(({x, y}, key) => Math.floor(meal.x) + Math.floor(this.radius) > Math.ceil(x) - Math.floor(this.radius) && Math.ceil(meal.x) - Math.floor(this.radius) < Math.floor(x) + Math.floor(this.radius) && Math.floor(meal.y) + Math.floor(this.radius) > Math.ceil(y) - Math.floor(this.radius) && Math.ceil(meal.y) - Math.floor(this.radius) < Math.floor(y) + Math.floor(this.radius) && key !==index[0]&&key !== index[1]&& key !== index[2]&& key !== index[3]);
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
        if ((direction === "ArrowRight" && this.direction[0] === "ArrowLeft" && this.direction.length <=1 || this.direction[0] === "ArrowRight" && direction === "ArrowLeft" && this.direction.length <=1 || direction === "ArrowUp" && this.direction[0] === "ArrowDown" && this.direction.length <=1 || this.direction[0] === "ArrowUp" && direction === "ArrowDown") && this.direction.length <=1 ||this.direction.length>2) {
            return;
        }
        this.direction.push(direction);
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
            let oldX = this.x;
            let oldY = this.y;
            if (this.direction[0] === "ArrowRight") {
                oldX = this.x;
                this.x = this.x + this.radius * 2;
            }
            if (this.direction[0] === "ArrowLeft") {
                oldX = this.x;
                this.x = this.x - this.radius * 2;
            }
            if (this.direction[0] === "ArrowDown") {
                oldY = this.y;
                this.y = this.y + this.radius * 2;
            }
            if (this.direction[0] === "ArrowUp") {
                oldY = this.y;
                this.y = this.y - this.radius * 2;
            }
            if (this.direction.length>1){
                this.direction.shift();
            }
            this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            this.arraySnackManage(oldX, oldY, this.x, this.y);
            this.snackDraw();
            this.mealRandomDraw();
            const checkCrush = this.arraySnackManage("", "", "", "", false, true, [0,1,2,3], {
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
                this.acceleration = this.acceleration-this.coeff;
                this.meal = null;
               this.animation();
               return;
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
select.addEventListener("change",(e)=>{
    select.classList.add("dn");
    canvas.classList.remove("dn");
    const game = new Game(ctx, canvasWidth, canvasHeight, radius, e.target.value);
    game.render();
    game.calcArrow()
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
    const deviation = 35;
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
})
