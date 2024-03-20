const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");

const dotNumber = 40;

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

// const animate = () => {
//   console.log("Aashwin");
//   requestAnimationFrame(animate);
// };
// animate();

const sketch = ({ context, width, height }) => {
  const agents = [];

  for (let i = 0; i < dotNumber; i++) {
    const x = random.range(0, width);
    const y = random.range(0, height);

    agents.push(new Agent(x, y));
  }

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];

      for (let j = i + 1; j < agents.length; j++) {
        const other = agents[j];

        const dist = agent.pos.getDistance(other.pos);

        if (dist > 200) continue;

        context.lineWidth = math.mapRange(dist, 0, 200, 10, 1);

        context.beginPath();
        context.moveTo(agent.pos.x, agent.pos.y);
        context.lineTo(other.pos.x, other.pos.y);
        context.strokeStyle = "black";
        context.stroke();
        // context.fill();
      }
    }

    agents.forEach((agent) => {
      agent.reflect(width, height);
      agent.update();
      agent.draw(context);
    });
  };
};

canvasSketch(sketch, settings);

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getDistance(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

class Agent {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.radius = random.range(5, 15);
    this.velocity = new Vector(random.range(-1, 1), random.range(-1, 1));
  }

  update() {
    this.pos.x += this.velocity.x;
    this.pos.y += this.velocity.y;
  }

  reflect(width, height) {
    if (this.pos.x >= width || this.pos.x <= 0) {
      this.velocity.x *= -1;
    }

    if (this.pos.y >= height || this.pos.y <= 0) {
      this.velocity.y *= -1;
    }
  }

  draw(context) {
    context.strokeStyle = "teal";

    context.save();
    context.translate(this.pos.x, this.pos.y);

    context.lineWidth = 2;

    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.restore();
  }
}
