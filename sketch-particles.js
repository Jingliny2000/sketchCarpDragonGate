const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

const interpolate = require('color-interpolate');
const eases = require('eases');


const settings = {
	dimensions: [ 1400, 1080 ],
	animate: true,
};

const particles = [];
const cursor = { x: 2000, y: 2000 };


let elCanvas;
let image;

const loadImage = async (url) => {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject();
		img.src = url;
	});
};

const sketch = ({ width, height, canvas }) => {
	let x, y, particle, radius;
	
	const imageCanvas = document.createElement('canvas');
	const imageContext = imageCanvas.getContext('2d');

	imageCanvas.width = image.width;
	imageCanvas.height = image.height;

	imageContext.drawImage(image, 0, 0);

	const imageData = imageContext.getImageData(0, 0, image.width, image.height).data;

	const numCircles = 30;
	const gapCircle = 3;
	const gapDot = 3;
	let dotRadius = 15;
	let cirRadius = 0;
	const fitRadius = dotRadius;

	elCanvas = canvas;
	canvas.addEventListener('mousedown', onMouseDown);

	calculateParticles(numCircles, cirRadius, gapCircle, fitRadius, gapDot, width, height, imageData);

	return ({ context, width, height }) => {
		context.fillStyle = 'black';
		context.fillRect(0, 0, width, height);

		context.drawImage(imageCanvas, 0, 0);

		particles.sort((a, b) => a.scale - b.scale);

		particles.forEach(particle => {
			particle.update();
			particle.draw(context);
		});
	};
};

const onMouseDown = (e) => {
	window.addEventListener('mousemove', onMouseMove);
	window.addEventListener('mouseup', onMouseUp);

	onMouseMove(e);
};

const onMouseMove = (e) => {
	const x = (e.offsetX / elCanvas.offsetWidth)  * elCanvas.width;
	const y = (e.offsetY / elCanvas.offsetHeight) * elCanvas.height;

	cursor.x = x;
	cursor.y = y;

	console.log(cursor);
};

const onMouseUp = () => {
	window.removeEventListener('mousemove', onMouseMove);
	window.removeEventListener('mouseup', onMouseUp);

	cursor.x = 2000;
	cursor.y = 2000;
};

const calculateParticles = (numCircles, cirRadius, gapCircle, fitRadius, gapDot, width, height, imageData) => {
    for (let i = 0; i < numCircles; i++) {
		const circumference = Math.PI * 2 * cirRadius;
		const numFit = i ? Math.floor(circumference / (fitRadius * 2 + gapDot)) : 1;
		const fitSlice = Math.PI * 2 / numFit;
		let ix, iy, idx, r, g, b, colA, colB, colMap;

		for (let j = 0; j < numFit; j++) {
			const theta = fitSlice * j;

			x = Math.cos(theta) * cirRadius;
			y = Math.sin(theta) * cirRadius;

			x += width  * 0.5;
			y += height * 0.5;

			ix = Math.floor((x / width)  * image.width);
			iy = Math.floor((y / height) * image.height);
			idx = (iy * image.width + ix) * 4;

			r = imageData[idx + 0];
			g = imageData[idx + 1];
			b = imageData[idx + 2];
			colA = `rgb(${r}, ${g}, ${b})`;

			radius = math.mapRange(r, 0, 255, 1, 12);

			colMap = interpolate([colA]);

			particle = new Particle({ x, y, radius, colMap });
			particles.push(particle);
		}

		cirRadius += fitRadius * 2 + gapCircle;
		dotRadius = (1 - eases.quadOut(i / numCircles)) * fitRadius;
	}
}


const start = async () => {
	// image = await loadImage('images/image-3.png');
	// image = await loadImage('images/fish-1.png');
	// image = await loadImage('images/fish-4.png');
	// image = await loadImage('images/fish-2.png');
	image = await loadImage('images/fish-3.png');
	


	

	canvasSketch(sketch, settings);
};

start();


class Particle {
	constructor({ x, y, radius = 10, colMap }) {
		// position
		this.x = x;
		this.y = y;

		// acceleration
		this.ax = 0;
		this.ay = 0;

		// velocity
		this.vx = 0;
		this.vy = 0;

		// initial position
		this.ix = x;
		this.iy = y;

		this.radius = radius;
		this.scale = 1;
		this.colMap = colMap;
		this.color = colMap(0);

		this.minDist = random.range(100, 300);
		this.pushFactor = random.range(0.01, 0.02);
		this.pullFactor = random.range(0.002, 0.006);
		this.dampFactor = random.range(0.90, 0.95);
	}

	update() {
		let dx, dy, dd, distDelta;

		// pull
		dx = this.ix - this.x;
		dy = this.iy - this.y;
		dd = Math.sqrt(dx * dx + dy * dy);

		this.ax = dx * this.pullFactor;
		this.ay = dy * this.pullFactor;

		this.scale = math.mapRange(dd, 0, 200, 1, 5);

		this.color = this.colMap(math.mapRange(dd, 0, 200, 0, 1, true));

		// push 
		dx = this.x - cursor.x;
		dy = this.y - cursor.y;
		dd = Math.sqrt(dx * dx + dy * dy);

		distDelta = this.minDist - dd;

		if (dd < this.minDist) {
			this.ax += (dx / dd) * distDelta * this.pushFactor;
			this.ay += (dy / dd) * distDelta * this.pushFactor;
		}

		this.vx += this.ax;
		this.vy += this.ay;

		this.vx *= this.dampFactor;
		this.vy *= this.dampFactor;

		this.x += this.vx;
		this.y += this.vy;
	}

	draw(context) {
		context.save();
		context.translate(this.x, this.y);
		context.fillStyle = this.color;

		context.beginPath();
		context.arc(0, 0, this.radius * this.scale, 0, Math.PI * 2);
		context.fill();

		context.restore();
	}
}
