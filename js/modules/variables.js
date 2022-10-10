export const select = document.querySelector("#select-speed");
export const canvas = document.querySelector(".canvas");
export const ctx = canvas.getContext("2d");
export let canvasWidth;
export let canvasHeight;
export let radius;
if (window.innerWidth>window.innerHeight){
     canvasWidth = canvas.width =  window.innerWidth-4;
    const x = canvasWidth*0.0091;
     radius = canvasWidth/(Math.round(canvasWidth/x));
    let y = Math.floor((window.innerHeight-4)/(radius*2));
    if (y%2===0){
        y=y-1;
    }
     canvasHeight = canvas.height = y*2*(radius);
}
else {
     canvasHeight = canvas.height =  window.innerHeight-4;
    const x = canvasHeight*0.0091;
     radius = canvasHeight/(Math.round(canvasHeight/x));
    let y = Math.floor((window.innerWidth-4)/(radius*2));
    if (y%2===0){
        y=y-1;
    }
     canvasWidth = canvas.width = y*2*(radius);
}


