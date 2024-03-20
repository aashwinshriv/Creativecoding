const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");

const settings = {
  dimensions: [1080, 1080],
};

let text = "A";
let fontSize = 500;
let fontWeight = "Thin";
let fontFamily = "Satoshi";

let manager;
const cell = 30;

const typeCanvas = document.createElement("canvas");
const typeContext = typeCanvas.getContext("2d");
// console.log(typeContext);

const sketch = ({ context, width, height }) => {
  //   cell = ;
  const cols = Math.floor(width / cell);
  const rows = Math.floor(height / cell);
  const colsr = width % cell;
  const rowsr = height % cell;

  const numCells = cols * rows;

  typeCanvas.width = cols;
  typeCanvas.height = rows;

  return ({ context, width, height }) => {
    context.clearRect(0, 0, width, height);
    typeContext.fillStyle = "black";
    typeContext.fillRect(0, 0, cols, rows);

    fontSize = cols;

    typeContext.fillStyle = "white";
    typeContext.font = `${fontSize}px ${fontFamily} ${fontWeight}`;

    typeContext.textBaseline = "middle";
    typeContext.textAlign = "center";

    const metrics = typeContext.measureText(text);
    const mx = metrics.actualBoundingBoxLeft * -1;
    const my = metrics.actualBoundingBoxAscent * -1;
    const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    const mh =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    const tx = (cols - mw) * 0.5 - mx;
    const ty = (rows - mh) * 0.5 - my;

    typeContext.save();
    typeContext.translate(tx, ty);

    typeContext.beginPath();
    typeContext.rect(mx, my, mw, mh);
    typeContext.stroke();

    typeContext.fillText(text, 0, 0);

    typeContext.restore();

    const typeData = typeContext.getImageData(0, 0, cols, rows).data;
    // console.log(typeData);

    // context.drawImage(typeCanvas, 0, 0);

    for (let i = 0; i < numCells; i++) {
      // console.log(i);
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cell;
      const y = row * cell;

      const r = typeData[i * 4 + 0];
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];
      const a = typeData[i * 4 + 3];

      // console.log(b);
      // console.log(g);
      if (r < 255 && r > 0) continue;

      context.fillStyle = `rgb(${r}, ${g}, ${b})`;

      context.save();
      context.translate(cell * 0.5, cell * 0.5);
      context.translate(x, y);

      // context.fillRect(0, 0, cell, cell);

      context.fillText(getGlyph(), 0, 0);

      context.restore();
    }

    fontSize = 1080;

    context.fillStyle = "black";
    context.font = `${fontSize}px ${fontFamily} ${fontWeight}`;
    context.textBaseline = "middle";
    context.textAlign = "center";

    const smetrics = context.measureText(text);
    const smx = smetrics.actualBoundingBoxLeft * -1;
    const smy = smetrics.actualBoundingBoxAscent * -1;
    const smw =
      smetrics.actualBoundingBoxLeft + smetrics.actualBoundingBoxRight;
    const smh =
      smetrics.actualBoundingBoxAscent + smetrics.actualBoundingBoxDescent;

    const sx = (width - smw) * 0.5 - smx + colsr;
    const sy = (height - smh) * 0.5 - smy - rowsr;

    context.save();
    context.translate(sx, sy);

    // context.beginPath();
    // context.rect(smx, smy, smw, smh);
    context.lineWidth = 2;
    context.strokeStyle = "black";

    context.strokeText(text, 0, 0);
    context.stroke();

    context.restore();

    // typeContext.beginPath();
    // context.fillStyle = "blue";
    // context.fillText(text, 0, 0);
    // context.stroke();
    // context.fill();
  };
};

const onKeyUp = (e) => {
  text = e.key.toUpperCase();
  manager.render();
};

document.addEventListener("keyup", onKeyUp);

const getGlyph = (v) => {
  const glyphs = "IITERATE".split("");

  return glyphs[getNextIndex(glyphs)];
  // return random.pick(glyphs);
  // return "iiterate";
};

let startnum = 0;

const getNextIndex = (array) => {
  const nextIndex = startnum % array.length; // Get the next index
  startnum++; // Increment the current index for the next call
  return nextIndex;
};

const start = async () => {
  manager = await canvasSketch(sketch, settings);
};

start();
