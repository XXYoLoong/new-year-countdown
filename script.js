// 定义烟花粒子
class Particle {
    constructor(x, y, radius, color, velocity, decay, gravity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.decay = decay || 0.015; // 粒子衰减速率
        this.alpha = 1;
        this.gravity = gravity || 0.05; // 重力加速度
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
        this.velocity.y += this.gravity; // 应用重力
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay;
        if (this.alpha <= this.decay) {
            this.alpha = 0;
        }
        this.draw();
    }

    isAlive() {
        return this.alpha > 0;
    }
}

class Firework {
    constructor(x, y, color,riseSpeed = -1, particleSize = 2) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.riseSpeed = riseSpeed; // 添加自定义上升速度(以下面creat为主)
        this.particleSize = particleSize; // 添加自定义粒子大小
        this.particles = []; // 爆炸生成的粒子数组
        this.exploded = false;
        // y 轴使用自定义上升速度，x 轴保持随机性以模拟风
        this.velocity = { x: Math.random() * 2 - 1, y: this.riseSpeed };
    }

    explode() {
        const particleCount = 100 + Math.random() * 1000; // 爆炸生成的粒子数量
        for (let i = 0; i < particleCount; i++) {
            const speed = Math.random() * 5 + 2;
            const decay = Math.random() * 0.04 + 0.01; // 粒子衰减速率
            const gravity = Math.random() * 0.05 + 0.03; // 粒子重力加速度
            this.particles.push(new Particle(this.x, this.y, 2, `hsl(${Math.random() * 360}, 100%, 50%)`, {
                x: Math.cos(Math.PI * 2 * i / particleCount) * speed,
                y: Math.sin(Math.PI * 2 * i / particleCount) * speed
            }, decay, gravity));
        }
    }

    update() {
        if (!this.exploded) {
            this.y += this.velocity.y;
            this.x += this.velocity.x;
            this.draw();

            // 确定爆炸的高度点
            if (this.y < canvas.height * (0.18 + Math.random() * 0.22)) {
                this.exploded = true;
                this.explode();
            }
        } else {
            this.particles = this.particles.filter(p => p.isAlive());
            this.particles.forEach(p => p.update());
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

//创建新的烟花
function createFirework() {
    const x = Math.random() * canvas.width;
    const y = canvas.height;
    const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    const riseSpeed = -Math.random() * 8 + 1; // 自定义上升速度，例如：-10到-18之间
    const particleSize = Math.random() * 3 + 2; // 自定义粒子大小，例如：2到5之间
    fireworks.push(new Firework(x, y, color, riseSpeed, particleSize));
}

// 预览按钮添加事件监听器，点击时触发烟花，用于测试烟花效果
document.getElementById('previewButton').addEventListener('click', createFirework);
// 倒计时结束后触发烟花效果
function triggerFireworks() {
    const fireworksCount = 5; // 定义触发的烟花数量
    for (let i = 0; i < fireworksCount; i++) {
        setTimeout(createFirework, i * 1000); // 每隔一秒触发一个烟花
    }
}

// 倒计时逻辑，假设倒计时结束后触发烟花
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
        triggerFireworks(); // 倒计时结束后触发烟花
    }
}

const interval = setInterval(updateCountdown, 1000);

animate();