const countdownElement = document.getElementById('countdown');
const targetDate = new Date('Feb 9, 2024 23:59:59').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    countdownElement.innerHTML = `距离新年还有：${days}天${hours}小时${minutes}分${seconds}秒`;

    if (distance < 0) {
        clearInterval(interval);
        countdownElement.style.display = 'none';
        triggerFireworks();
    }
}

const interval = setInterval(updateCountdown, 1000);

// 定义烟花粒子
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1; // 初始不透明度为完全不透明
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    // 更新粒子位置
    update() {
        this.draw();
        this.velocity.x *= 0.99; // x 轴速度逐渐减小
        this.velocity.y *= 0.99; // y 轴速度逐渐减小，模拟阻力
        this.velocity.y += 0.1; // 模拟重力影响
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.005; // 逐渐减少不透明度，模拟烟花消散
    }
}

const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particles = [];

function init() {
    particles = [];
}

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // 使用半透明覆盖创建拖尾效果
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1); // 当不透明度为0时移除粒子
        } else {
            particle.update();
        }
    });
}

init();
animate();

function createFirework() {
    const particleCount = 100; // 烟花粒子数量
    for (let i = 0; i < particleCount; i++) {
        const velocity = {
            x: (Math.random() - 0.5) * (Math.random() * 6),
            y: (Math.random() - 0.5) * (Math.random() * 6)
        };
        particles.push(new Particle(canvas.width / 2, canvas.height / 2, 5, `hsl(${Math.random() * 360}, 50%, 50%)`, velocity));
    }
}

// 预览按钮添加事件监听器，点击时触发烟花
document.getElementById('previewButton').addEventListener('click', function() {
    createFirework();
});
