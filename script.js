// script.js
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

// Responsif Canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let fireworks = [];
let particles = [];
let textY = canvas.height + 100;
let textSpeed = 3;
let textSize = Math.min(canvas.width, canvas.height) / 10;

class Firework {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = Math.random() * 3 + 2;
    this.vx = Math.random() * 4 - 2;
    this.vy = Math.random() * -6 - 4;
    this.gravity = 0.05;
    this.alpha = 1;
    this.life = Math.random() * 60 + 60;
    this.sparkles = [];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.alpha -= 0.01;
    this.life--;

    if (Math.random() > 0.9) {
      this.sparkles.push({
        x: this.x,
        y: this.y,
        radius: Math.random() * 2,
        alpha: 1,
      });
    }

    this.sparkles.forEach((s) => (s.alpha -= 0.02));
    this.sparkles = this.sparkles.filter((s) => s.alpha > 0);
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();

    this.sparkles.forEach((s) => {
      ctx.globalAlpha = s.alpha;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    });

    ctx.restore();
  }
}

function randomColor() {
  return `hsl(${Math.random() * 360}, 100%, 70%)`;
}

function createFireworks(x, y) {
  for (let i = 0; i < 100; i++) {
    fireworks.push(new Firework(x, y, randomColor()));
  }
}

function createParticles(x, y) {
  for (let i = 0; i < 50; i++) {
    particles.push({
      x,
      y,
      vx: Math.random() * 4 - 2,
      vy: Math.random() * 4 - 2,
      alpha: 1,
      radius: Math.random() * 3 + 1,
      color: randomColor(),
    });
  }
}

function drawParticles() {
  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 0.02;

    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.restore();

    if (p.alpha <= 0) {
      particles.splice(i, 1);
    }
  });
}

function drawText() {
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, "#ff9a9e");
  gradient.addColorStop(0.5, "#fad0c4");
  gradient.addColorStop(1, "#fbc2eb");

  ctx.save();
  ctx.font = `${textSize}px Arial, sans-serif`;
  ctx.fillStyle = gradient;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
  ctx.shadowBlur = 30;

  ctx.fillText("🎆 Happy New Year 2025 🎆", centerX, textY);

  if (textY > centerY) {
    textY -= textSpeed;
  } else {
    createParticles(centerX, textY);
  }

  ctx.restore();
}

function animate() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  fireworks = fireworks.filter((fw) => fw.alpha > 0 && fw.life > 0);
  fireworks.forEach((fw) => {
    fw.update();
    fw.draw();
  });

  drawParticles();
  drawText();

  requestAnimationFrame(animate);
}

setInterval(() => {
  const x = Math.random() * canvas.width;
  const y = (Math.random() * canvas.height) / 2;
  createFireworks(x, y);
}, 800);

canvas.addEventListener("click", (e) => {
  createFireworks(e.clientX, e.clientY);
});

// Interaksi dengan mouse
canvas.addEventListener("mousemove", (e) => {
  const x = e.clientX;
  const y = e.clientY;
  createFireworks(x, y);
});

// Start animation
animate();
