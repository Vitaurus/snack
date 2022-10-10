export const select = document.querySelector("#select-speed");
export const canvas = document.querySelector("#canvas");
export const canvasWidth = canvas.width =  window.innerWidth-4;
const x = canvasWidth*0.0091;
export const radius = canvasWidth/(Math.round(canvasWidth/x));
let y = Math.floor((window.innerHeight-4)/(radius*2));
if (y%2===0){
    y=y-1;
}
export const canvasHeight = canvas.height = y*2*(radius);
export const ctx = canvas.getContext("2d");
