// Particle class to create individual particles for the fireworks
class Particle {
  constructor(x, y, color, velocity) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }

  // Method to draw individual particle
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.restore();
  }

  // Update the particle properties per frame
  update() {
    this.velocity.x *= 0.99;
    this.velocity.y *= 0.99;
    this.velocity.y += 0.1; // Simulate gravity
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.005; // Fade out effect
    if (this.alpha < 0) {
      this.alpha = 0;
    }
    this.draw();
  }
}

// Array to hold all the particles for the fireworks
let particles = [];

// Function to create the fireworks by generating particles
function createFireworks(x, y) {
  const particleCount = 100;
  const angleIncrement = (Math.PI * 2) / particleCount;
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff'];
  
  for (let i = 0; i < particleCount; i++) {
    const angle = angleIncrement * i;
    const color = colors[Math.floor(Math.random() * colors.length)];
    particles.push(
      new Particle(
        x, y, color,
        { x: Math.cos(angle) * Math.random() * 6, y: Math.sin(angle) * Math.random() * 6 }
      )
    );
  }
}

// Setup canvas and context
const canvas = document.getElementById('fireworks'); // ID matches the canvas element in the HTML
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Countdown logic
const countdownElement = document.getElementById('countdown');
const targetDate = new Date('Jan 1, 2024 00:00:00').getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance < 0) {
    clearInterval(countdownTimer);
    countdownElement.innerText = '新年快乐!';
    startFireworks();
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  countdownElement.innerText = `距离2024年新年还有: ${days}天 ${hours}小时 ${minutes}分 ${seconds}秒`;
}

const countdownTimer = setInterval(updateCountdown, 1000);

// Event listener for resize to adjust canvas size
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Animation loop to animate the particles
function animate() {
  requestAnimationFrame(animate);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Fade effect
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Update and draw particles
  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
  });
}

// Start the animation loop
animate();

// Function to start the fireworks from the button click event
function startFireworks() {
  createFireworks(canvas.width * Math.random(), canvas.height * Math.random());
}