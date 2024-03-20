const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const color = require("canvas-sketch-util/color");
const risoColors = require("riso-colors");

const settings = {
  dimensions: [2040, 1080],
};

const sketch = ({ context, width, height }) => {
  let x, y, w, h;
  let shadowColor;

  const num = 30;

  const rects = [];

  const rectColors = ["#bababa", "#000000", "#ffffff", "#038d83"];

  const bgColor = "#ffffff";

  for (i = 0; i < num; i++) {
    x = random.range(0, width);
    y = random.range(0, height);
    w = random.range(100, 200);
    h = random.range(40, 100);

    fill = random.pick(rectColors);
    stroke = random.pick(rectColors);

    blend = random.value() < 0.5 ? "multiply" : "source-over";

    rects.push({ x, y, w, h, fill, stroke, blend });
  }

  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    angle = -30;

    rects.forEach((rect) => {
      const { x, y, w, h, fill, stroke, blend } = rect;

      context.save();
      context.translate(x, y);
      context.strokeStyle = stroke;

      context.globalCompositeOperation = blend;
      drawI({ context, w, h, angle });

      shadowColor = color.offsetHSL(fill, 0, 0, -20);
      shadowColor.rgba[3] = 0.5;

      context.shadowColor = color.style(shadowColor.rgba);
      context.shadowOffsetX = -10;
      context.shadowY = 20;

      context.fillStyle = fill;
      context.strokeStyle = stroke;
      context.stroke();
      context.fill();

      context.lineWidth = 2;
      context.strokeStyle = "black";
      context.stroke();

      context.restore();
    });
  };
};

const drawSkewedRectangle = ({ context, w = 100, h = 20, angle = 45 }) => {
  degrees = math.degToRad(angle);

  rx = Math.cos(degrees) * w;
  ry = Math.sin(degrees) * w;

  context.save();

  context.translate(w * -0.5, h * -0.5);

  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(rx, ry);
  context.lineTo(rx, ry + h);
  context.lineTo(0, h);

  context.closePath();
  context.stroke();
  context.restore();
};

const drawI = ({ context, w = 100, h = 20, angle = 45 }) => {
  degrees = math.degToRad(angle);

  ispan = w / 6;
  iinset = w / 2 - ispan;
  iheight = h * 3;

  rx = Math.cos(degrees) * w;
  ry = Math.sin(degrees) * w;

  context.save();

  context.translate(w * -0.5, h * -0.5);

  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(rx, ry);
  context.lineTo(rx, ry + h);
  context.lineTo(
    (w - iinset) * Math.cos(degrees),
    (w - iinset) * Math.sin(degrees) + h
  );
  context.lineTo(
    (w - iinset) * Math.cos(degrees),
    (w - iinset) * Math.sin(degrees) + h + iheight
  );
  context.lineTo(w * Math.cos(degrees), w * Math.sin(degrees) + h + iheight);
  context.lineTo(
    w * Math.cos(degrees),
    w * Math.sin(degrees) + 2 * h + iheight
  );
  context.lineTo(0, 2 * h + iheight);
  context.lineTo(0, h + iheight);
  context.lineTo(
    iinset * Math.cos(degrees),
    iinset * Math.sin(degrees) + h + iheight
  );
  context.lineTo(iinset * Math.cos(degrees), iinset * Math.sin(degrees) + h);

  context.lineTo(0, h);

  context.closePath();
  context.stroke();
  context.restore();
};

canvasSketch(sketch, settings);
