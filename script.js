// 定义粒子类
class Particle {
    constructor(x, y, color, velocity) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
        this.friction = 0.99;
        this.gravity = 0.05;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;

        if (this.alpha > 0) {
            this.draw();
        }
    }
}

// 定义烟花类
class Firework {
    constructor(x, y, targetY, color) {
        this.x = x;
        this.y = y;
        this.targetY = targetY;
        this.color = color;
        this.velocity = { x: (Math.random() - 0.5) * 3, y: Math.random() * -3 - 4 };
        this.particles = [];
        this.exploded = false;
    }

    draw() {
        if (!this.exploded) {
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(this.x, this.y, 4, 0, Math.PI * 2, false);
            ctx.fill();
        }
    }

    explode() {
        const effectType = Math.floor(Math.random() * 4); // 随机选择0到3之间的效果类型
        const particleCount = 100; // 每种效果的粒子数量
    
        for (let i = 0; i < particleCount; i++) {
            let velocity;
            switch (effectType) {
                case 0: // 标准圆形爆炸
                    const angle = Math.random() * Math.PI * 2;
                    const speed = Math.random() * 6 + 1;
                    velocity = { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };
                    break;
                case 1: // 心形爆炸
                    const angleHeart = Math.PI * i / (particleCount / 2);
                    const speedHeart = Math.sin(angleHeart) * 12;
                    velocity = { x: 16 * Math.pow(Math.sin(angleHeart), 3), y: -13 * Math.cos(angleHeart) + 5 * Math.cos(2 * angleHeart) - 2 * Math.cos(3 * angleHeart) - Math.cos(4 * angleHeart) };
                    break;
                case 2: // 螺旋形爆炸
                    const angleSpiral = 0.1 * i;
                    const speedSpiral = 0.2 * i;
                    velocity = { x: Math.cos(angleSpiral) * speedSpiral, y: Math.sin(angleSpiral) * speedSpiral };
                    break;
                case 3: // 随机散射爆炸
                    velocity = { x: (Math.random() - 0.5) * 12, y: (Math.random() - 0.5) * 12 };
                    break;
                default: // 默认为标准圆形爆炸
                    const defaultAngle = Math.random() * Math.PI * 2;
                    const defaultSpeed = Math.random() * 6 + 1;
                    velocity = { x: Math.cos(defaultAngle) * defaultSpeed, y: Math.sin(defaultAngle) * defaultSpeed };
            }
            this.particles.push(new Particle(this.x, this.y, this.color, velocity));
        }
    }
    

    update() {
        if (!this.exploded) {
            this.velocity.y += 0.1; // gravity
            this.x += this.velocity.x;
            this.y += this.velocity.y;

            if (this.y >= this.targetY) {
                this.exploded = true;
                this.explode();
            }
            this.draw();
        } else {
            this.particles.forEach((particle, index) => {
                particle.update();
                if (particle.alpha <= 0) {
                    this.particles.splice(index, 1);
                }
            });
        }
    }
}

const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];
let timerId;

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    fireworks.forEach((firework, index) => {
        firework.update();
        if (firework.exploded && firework.particles.length === 0) {
            fireworks.splice(index, 1);
        }
    });
}

function startFireworks() {
    timerId = setInterval(() => {
        const x = Math.random() * canvas.width;
        const y = canvas.height + 10;
        const targetY = canvas.height * (Math.random() * 0.5 + 0.1);
        const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        fireworks.push(new Firework(x, y, targetY, color));
    }, 400);
}

document.getElementById('previewButton').addEventListener('click', startFireworks);

// 获取页面上的倒计时元素
const countdownElement = document.getElementById('countdown');
// 设置目标日期为2024年2月9日23:59:59
const targetDate = new Date('2024-02-09T23:59:59').getTime();

// 倒计时更新函数
function updateCountdown() {
    const now = new Date().getTime(); // 获取当前时间戳
    const distance = targetDate - now; // 计算当前时间与目标时间的差值

    // 计算天、小时、分钟和秒
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // 更新倒计时显示
    countdownElement.innerHTML = `距离新年还有：${days}天 ${hours}小时 ${minutes}分 ${seconds}秒`;

    // 检查倒计时是否结束
    if (distance < 0) {
        clearInterval(timerId); // 停止倒计时
        countdownElement.innerHTML = "新年快乐！"; // 显示新年快乐的信息
        startFireworks(); // 触发烟花效果
    }
}

// 使用setInterval每秒更新倒计时
timerId = setInterval(updateCountdown, 1000);

animate();
