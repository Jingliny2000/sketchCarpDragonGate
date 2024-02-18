const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');

const settings = {
  // dimensions: [ 2048, 2048 ]
  dimensions: [ 1080, 1080 ]

};

const sketch = () => {

  let x, y, w, h;
  let radius, angle;

  return ({ context, width, height }) => {
    context.fillStyle = 'red';
    context.fillRect(0, 0, width, height);

    x = width * 0.5;
    y = height * 0.5;
    w = width * 0.6;
    h = height * 0.1;

    context.save();
    //put things to mid
    context.translate(x, y);
    // context.translate(w * -0.5, h * - 0.5);


    context.strokeStyle = 'blue';
    // context.strokeRect(w * -0.5,h * - 0.5,w,h);

    radius = 200;
    angle = math.degToRad(30);

    console.log(x, y);
    // x = Math.cos(angle) * radius;
    // y = Math.sin(angle) * radius;

    context.beginPath();
    
    context.moveTo(0, 0);
    context.lineTo(x ,y);


    // context.moveTo(w * -0.5,h * - 0.5);
    // context.lineTo(w * 0.5,h * - 0.5);

    // context.moveTo(0, 0);
    // context.lineTo(w ,0);



    //to see what's there/ to draw 
    context.stroke();


    context.restore();

  };
};

canvasSketch(sketch, settings);
