const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  // dimensions: [ 2048, 2048 ]
  dimensions: [ 1080, 1080 ],
  animate: true,

};

const sketch = () => {

  let x, y, w, h;
  let radius, angle, rx, ry;
  const num = 20;

  return ({ context, width, height }) => {
    context.fillStyle = 'red';
    context.fillRect(0, 0, width, height);

    // x = width * 0.5;
    // y = height * 0.5;
    // w = width * 0.6;
    // h = height * 0.1;
    

    // context.strokeRect(w * -0.5,h * - 0.5,w,h);

    // radius = 200;
    // angle = math.degToRad(14);

    // console.log(x, y);
    // rx = Math.cos(angle) * w;
    // ry = Math.sin(angle) * w;

    // context.translate(rx * -0.5, (ry + h) * - 0.5);

    // context.beginPath();
    
    // context.moveTo(0, 0);
    // context.lineTo(rx ,ry);
    // context.lineTo(rx ,ry);
    // context.lineTo(rx ,ry + h );
    // context.lineTo(0, h);
    // context.closePath();
    
    


    // context.moveTo(w * -0.5,h * - 0.5);
    // context.lineTo(w * 0.5,h * - 0.5);

    // context.moveTo(0, 0);
    // context.lineTo(w ,0);
    degree = 30;

    for (let i = 0; i < num; i++ ) {

      context.save();
      //put things to mid
      context.translate(x, y);
      // context.translate(w * -0.5, h * - 0.5);
  
  
      context.strokeStyle = 'blue';

      x = random.range(0, width);
      y = random.range(0, height);
      w = random.range(200, 600);
      h = random.range(40, 200);
      drawSkewedRect({context, w, h, degree});


      //to see what's there/ to draw 
      context.stroke();
  
  
      context.restore();
    }
   

  };
};


const drawSkewedRect = ({ context, w = 600, h = 200, degree = -45}) => {
    const angle = math.degToRad(degree);

    // console.log(x, y);
    const rx = Math.cos(angle) * w;
    const ry = Math.sin(angle) * w;

    context.save();
    context.translate(rx * -0.5, (ry + h) * - 0.5);

    context.beginPath();
    
    context.moveTo(0, 0);
    context.lineTo(rx ,ry);
    context.lineTo(rx ,ry);
    context.lineTo(rx ,ry + h );
    context.lineTo(0, h);
    context.closePath();

    context.restore();
}
canvasSketch(sketch, settings);
