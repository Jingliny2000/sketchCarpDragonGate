const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const Color = require('canvas-sketch-util/color');

const risoColors = require('riso-colors');
const seed = random.getRandomSeed();

const settings = {
  // dimensions: [ 2048, 2048 ]
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: seed,
};

const sketch = ({ context, width, height }) => {
  random.setSeed(seed);

  let x, y, w, h, blend, fill, stroke;
  let radius, angle, rx, ry;
  const num = 20;
  // const num = 1;


  const rectColors = [
    random.pick(risoColors),
    random.pick(risoColors),
    random.pick(risoColors),
    random.pick(risoColors),
    random.pick(risoColors),
  ];


  const  rects = [];

  const bgColor = random.pick(risoColors).hex;

  const mask = {
    radius: width * 0.4,
    sides: 8,
    x: width * 0.5,
    y: height * 0.58,
  };


  for (let i = 0; i < num; i++ ) {
    x = random.range(0, width);
    y = random.range(0, height);
    w = random.range(600, height);
    h = random.range(40, 200);
    // x = 300;
    // y = 400;
    // w = 200;
    // h = 50;
    fill = random.pick(rectColors).hex;
    stroke = random.pick(rectColors).hex;
    // fill = "red";
    // stroke = "blue";

    
    blend = (random.value() > 0.5) ? 'overlay' : 'source-over';
    rects.push({x, y, w, h, fill, stroke, blend});
  }


  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    context.save();
    context.translate(mask.x, mask.y);

    // context.beginPath();
    // context.moveTo(0, -300);
    // context.lineTo(300, 200);
    // context.lineTo(-300, 200);
    // context.closePath();
    drawPolygon({context, radius: mask.radius, sides: mask.sides});

  

    //things draw after clip will be inside of it
    context.clip();

    
    degree = 30;

    // for (let i = 0; i < num; i++ ) {

    //   context.save();
    //   //put things to mid
    //   context.translate(x, y);
    //   // context.translate(w * -0.5, h * - 0.5);
  
  
    //   context.strokeStyle = 'blue';

    //   x = random.range(0, width);
    //   y = random.range(0, height);
    //   w = random.range(200, 600);
    //   h = random.range(40, 200);
    //   drawSkewedRect({context, w, h, degree});


    //   //to see what's there/ to draw 
    //   context.stroke();
  
  
    //   context.restore();
    // }
    rects.forEach(rect => {
      const {x, y, w, h, fill, stroke, blend } = rect;
      let shadowColor;

      context.save();
      //put things to mid
      // context.translate(w * -0.5, h * - 0.5);
      // context.translate(width * -0.5, height * -0.5);
      context.translate(-mask.x, -mask.y);

      context.translate(x, y);
  
      context.strokeStyle = stroke;
      context.fillStyle = fill;
      context.lineWidth = 10;

      // context.globalCompositeOperation = 'overlay';
      context.globalCompositeOperation = blend;


      // x = random.range(0, width);
      // y = random.range(0, height);
      // w = random.range(200, 600);
      // h = random.range(40, 200);
      drawSkewedRect({context, w, h, degree});

      shadowColor = Color.offsetHSL(fill, 0, 0, -20);
      shadowColor.rgba[3] = 0.5; 
      
      context.shadowColor = Color.style(shadowColor.rgba);

      // context.shadowColor = "black";

      context.shadowOffsetX = -10;
      context.shadowOffsetY = 20;
      
      context.fill();
      context.shadowColor  = null;
      context.stroke();

      context.globalCompositeOperation = 'source-over';

      context.lineWidth  = 2;
      context.strokeStyle = 'black';


      //to see what's there/ to draw 
      context.stroke();
      // context.fill();
    
    
        context.restore();
    });

    context.restore();

    // polygon outline
    context.save();

    context.translate(mask.x, mask.y);
    context.lineWidth = 20;
    drawPolygon({ context, radius: mask.radius - context.lineWidth, sides: mask.sides });
    context.globalCompositeOperation = 'color-burn';
		context.strokeStyle = rectColors[0].hex;
    // context.strokeStyle = 'black';
    context.stroke();

    context.restore();

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

const drawPolygon = ({ context, radius = 100, sides = 3}) => {

  const slice = Math.PI * 2 / sides;

  context.beginPath();
  context.moveTo(0, -radius);

  for (let i = 1; i < sides; i++) {
    const theta = i * slice - Math.PI * 0.5 ;
    context.lineTo(Math.cos(theta) * radius, Math.sin(theta) * radius);
  }
  context.closePath()
}

canvasSketch(sketch, settings);
