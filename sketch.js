const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");

// COLORS
const bgColor = "black";
const colorArray = ["red", "yellow", "green", "cyan", "blue", "white"];
const randomColor1 = colorArray[Math.floor(Math.random() * colorArray.length)];
const randomColor2 = colorArray[Math.floor(Math.random() * colorArray.length)];
const arcColor = "white";

const settings = {
  dimensions: [1080, 1080],
};

const sketch = () => {
  return ({ context, width, height }) => {
    const fill = context.createLinearGradient(0, 0, width, height);
    fill.addColorStop(0, "#BABABA");
    fill.addColorStop(1, "black");

    context.fillStyle = fill;
    context.fillRect(0, 0, width, height);

    context.fillStyle = randomColor1;

    const cx = width * 0.5;
    const cy = width * 0.5;
    const w = width * 0.005;
    const h = height * 0.15;
    let x, y, radius;

    const num = 40;

    for (let i = 0; i < num; i++) {
      const slice = math.degToRad(360 / num);
      const angle = slice * i;

      radius = width * 0.3 * random.range(0.7, 1.3);
      x = cx + radius * Math.sin(angle);
      y = cy + radius * Math.cos(angle);

      context.save();
      context.translate(x, y);
      context.rotate(-angle);
      context.scale(random.range(0.3, 1.5), random.range(0.2, 0.5));

      context.beginPath();
      context.rect(-w * 0.5, random.range(0, -h * 0.5), w, h);
      context.fill();
      context.restore();

      context.save();
      context.translate(cx, cy);
      context.rotate(-angle);

      context.lineWidth = random.range(1, 15);

      context.beginPath();
      context.arc(
        0,
        0,
        radius * random.range(0.7, 1.3),
        slice * random.range(1, -7),
        slice * random.range(1, 5)
      );
      context.strokeStyle = randomColor2;
      context.stroke();

      context.restore();
    }
  };
};

canvasSketch(sketch, settings);
