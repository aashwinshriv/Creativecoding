const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");
const tweakpane = require("tweakpane");

const params = {
  cols: 55,
  rows: 40,
  scaleMin: 0.5,
  scaleMax: 17,
  freq: 0.004,
  rotationAmp: 0.1,

  frame: 0,
  animate: true,

  lineCap: "square",
  spacing: 0.07,
};

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    const cols = params.cols;
    const rows = params.rows;
    const numCells = cols * rows;

    const gridw = width * 0.8;
    const gridh = height * 0.8;
    const cellw = gridw / cols;
    const cellh = gridh / rows;

    const margx = (width - gridw) * 0.5;
    const margy = (height - gridh) * 0.5;

    context.translate(margx, margy);

    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = (col + 0.5) * cellw;
      const y = (row + 0.5) * cellh;
      const w = cellw * 0.8;
      const h = cellh * 0.8;

      const f = params.animate ? frame : params.frame;

      // const n = random.noise2D(x + frame * 5, y - frame * 5, params.freq);
      const n = random.noise3D(x, y, f * 5, params.freq);

      const angle = n * Math.PI * params.rotationAmp;
      const scale = math.mapRange(n, -1, 1, params.scaleMin, params.scaleMax);

      context.save();
      context.translate(x, y);
      context.rotate(angle);

      context.beginPath();
      context.moveTo(w * -params.spacing, 0);
      context.lineTo(w * params.spacing, 0);

      context.lineWidth = scale;
      context.lineCap = params.lineCap;

      context.strokeStyle = "black";
      context.stroke();
      context.fill();

      context.restore();
    }
  };
};

const createPane = () => {
  const pane = new tweakpane.Pane();

  let folder;

  folder = pane.addFolder({ title: "Grid" });
  folder.addInput(params, "lineCap", {
    options: { butt: "butt", round: "round", square: "square" },
  });

  folder.addInput(params, "cols", { min: 2, max: 100, step: 1 });
  folder.addInput(params, "rows", { min: 2, max: 100, step: 1 });

  folder.addInput(params, "spacing", { min: 0.05, max: 0.5 });
  folder.addInput(params, "scaleMin", { min: 0.5, max: 100 });
  folder.addInput(params, "scaleMax", { min: 2, max: 100 });

  folder = pane.addFolder({ title: "Noise" });
  folder.addInput(params, "freq", { min: -0.01, max: 0.01 });
  folder.addInput(params, "rotationAmp", { min: 0, max: 1 });

  folder.addInput(params, "animate");
  folder.addInput(params, "frame", { min: 0, max: 999 });
};

createPane();

canvasSketch(sketch, settings);
