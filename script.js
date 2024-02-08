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
    constructor(x, y, radius, color, velocity, decay) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.decay = decay || 0.015; // 粒子消失的速度
        this.alpha = 1;
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

    update() {
        this.draw();
        this.velocity.x *= 0.99; 
        this.velocity.y *= 0.99;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay; // 逐渐减少粒子的不透明度
    }
}

class Firework {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.particles = []; // 爆炸生成的粒子数组
        this.exploded = false;
        this.velocity = { x: 0, y: -Math.random() * 3 - 4 }; // 上升速度
    }

    explode() {
        for (let i = 0; i < 100; i++) { // 创建100个粒子模拟爆炸效果
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 6 + 2; // 粒子速度
            this.particles.push(new Particle(this.x, this.y, 5, `hsl(${Math.random() * 360}, 50%, 50%)`, {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed
            }));
        }
    }

    update() {
        if (!this.exploded) {
            this.y += this.velocity.y;
            this.draw();

            // 确定爆炸的高度点，至少上升超过页面高度的40%，不能超过页面的82%
            const explodeHeightMin = canvas.height - canvas.height * 0.82;
            const explodeHeightMax = canvas.height - canvas.height * 0.4;

            if (this.y < explodeHeightMax && this.y > explodeHeightMin) {
                this.exploded = true;
                this.explode();
            }
        } else {
            this.particles.forEach(particle => particle.update());
            this.particles = this.particles.filter(particle => particle.alpha > 0); // 移除不透明度为0的粒子
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    fireworks.forEach((firework, index) => {
        firework.update();
        if (firework.exploded && firework.particles.length === 0) {
            fireworks.splice(index, 1); // 移除已经爆炸且粒子消失的烟花
        }
    });
}

function createFirework() {
    const x = Math.random() * canvas.width;
    const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
    fireworks.push(new Firework(x, canvas.height, color));
}

// 预览按钮添加事件监听器，点击时触发烟花
document.getElementById('previewButton').addEventListener('click', function() {
    createFirework();
});

animate();