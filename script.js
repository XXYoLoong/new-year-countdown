// 粒子类定义
class Particle {
    // 粒子构造函数
    constructor(x, y, radius, color, velocity, decay, gravity) {
        this.x = x; // 粒子的x坐标
        this.y = y; // 粒子的y坐标
        this.radius = radius; // 粒子的半径
        this.color = color; // 粒子的颜色
        this.velocity = velocity; // 粒子的速度对象，包含x和y方向的速度
        this.decay = decay || 0.015; // 粒子的衰减速率，默认值为0.015
        this.alpha = 1; // 粒子的透明度，初始值为1
        this.gravity = gravity || 0.05; // 粒子受到的重力加速度，默认值为0.05
    }
    // 绘制粒子的方法
    draw() {
        ctx.save(); // 保存当前绘图状态
        ctx.globalAlpha = this.alpha; // 设置绘图透明度
        ctx.beginPath(); // 开始绘制
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false); // 绘制圆形粒子
        ctx.fillStyle = this.color; // 设置填充颜色
        ctx.fill(); // 填充颜色
        ctx.restore(); // 恢复之前保存的绘图状态
    }
    // 更新粒子状态的方法
    update() {
        this.velocity.y += this.gravity; // 应用重力，使粒子下降
        this.x += this.velocity.x; // 更新粒子的x坐标
        this.y += this.velocity.y; // 更新粒子的y坐标
        this.alpha -= this.decay; // 更新粒子的透明度
        if (this.alpha <= this.decay) {
            this.alpha = 0; // 当透明度小于衰减速率时，将透明度设置为0
        }
        this.draw(); // 绘制更新后的粒子
    }
    // 判断粒子是否仍然存活（透明度大于0）
    isAlive() {
        return this.alpha > 0;
    }
}
// 烟花类定义
class Firework {
    // 烟花构造函数
    constructor(x, y, color, riseSpeed = -1, particleSize = 2) {
        this.x = x; // 烟花的x坐标
        this.y = y; // 烟花的y坐标
        this.color = color; // 烟花的颜色
        this.riseSpeed = riseSpeed; // 烟花上升速度
        this.particleSize = particleSize; // 爆炸后生成的粒子大小
        this.particles = []; // 存储爆炸后生成的粒子数组
        this.exploded = false; // 标记烟花是否已经爆炸
        this.velocity = { x: Math.random() * 2 - 1, y: this.riseSpeed }; // 烟花的速度，x轴速度模拟风
    }
    // 烟花爆炸方法
explode() {
    const pattern = Math.floor(Math.random() * 5); // 随机选择爆炸图案类型
const particleCount = 100 + Math.random() * 1000; // 确定爆炸生成的粒子数量
for (let i = 0; i < particleCount; i++) {
    let speed, angle;
    // 根据图案类型生成粒子速度和角度
    switch(pattern) {
        case 0: // 圆形
            speed = Math.random() * 5 + 2; // 粒子速度
            angle = Math.PI * 2 * i / particleCount; // 角度
            break;
        case 1: // 星星
            speed = Math.random() * 5 + 2; // 粒子速度
            angle = Math.PI * 2 * i / particleCount + Math.PI / 5; // 角度
            break;
        case 2: // 爱心
            speed = Math.random() * 3 + 1; // 粒子速度
            angle = Math.PI * 2 * i / particleCount; // 角度
            break;
        case 3: // 散射
            speed = Math.random() * 5 + 2; // 粒子速度
            angle = Math.PI * 2 * i / particleCount + Math.random() * Math.PI / 2 - Math.PI / 4; // 角度
            break;
        case 4: // 螺旋
            speed = Math.random() * 5 + 2; // 粒子速度
            angle = Math.PI * 2 * i / particleCount + Math.PI * 5 / 4 * Math.sin(Math.PI * 2 * i / particleCount); // 角度
            break;
        default:
            speed = Math.random() * 5 + 2; // 粒子速度
            angle = Math.PI * 2 * i / particleCount; // 默认角度
    }
    const decay = Math.random() * 0.04 + 0.01; // 粒子衰减速率
    const gravity = Math.random() * 0.05 + 0.03; // 粒子重力加速度
    // 创建新粒子并添加到粒子数组中
    this.particles.push(new Particle(this.x, this.y, this.particleSize, `hsl(${Math.random() * 360}, 100%, 50%)`, {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed
    }, decay, gravity));
}
}

    // 更新烟花状态的方法
    update() {
        if (!this.exploded) {
            this.y += this.velocity.y; // 更新烟花的y坐标，使其上升
            this.x += this.velocity.x; // 更新烟花的x坐标，模拟风效果
            this.draw(); // 绘制上升中的烟花
            // 判断烟花是否达到爆炸高度
            if (this.y < canvas.height * (0.18 + Math.random() * 0.22)) {
                this.exploded = true; // 标记烟花为已爆炸
                this.explode(); // 触发烟花爆炸
            }
        } else {
            // 更新所有粒子的状态，并移除已经“死亡”的粒子
            this.particles = this.particles.filter(p => p.isAlive());
            this.particles.forEach(p => p.update());
        }
    }
    // 绘制上升中的烟花方法
    draw() {
        ctx.save(); // 保存当前绘图状态
        ctx.globalAlpha = 1; // 设置绘图透明度为不透明
        ctx.beginPath(); // 开始绘制
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2, false); // 绘制表示烟花的小圆点
        ctx.fillStyle = this.color; // 设置填充颜色
        ctx.fill(); // 填充颜色
        ctx.restore(); // 恢复之前保存的绘图状态
    }
}
// 获取canvas元素并设置其宽高
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let fireworks = []; // 存储所有烟花的数组
// 动画循环函数，用于不断更新画布上的内容
function animate() {
    requestAnimationFrame(animate); // 请求下一帧动画
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // 设置画布覆盖颜色（用于创建尾迹效果）
    ctx.fillRect(0, 0, canvas.width, canvas.height); // 覆盖整个画布
    // 遍历所有烟花，更新它们的状态，并在必要时将它们从数组中移除
    fireworks.forEach((firework, index) => {
        firework.update();
        if (firework.exploded && firework.particles.length === 0) {
            fireworks.splice(index, 1); // 移除已经爆炸且粒子消失的烟花
        }
    });
}
// 创建新烟花的函数，用于在画布上添加新的烟花
function createFirework() {
    const x = Math.random() * canvas.width; // 在画布宽度范围内随机选择x坐标
    const y = canvas.height; // y坐标设置为画布底部
    const color = `hsl(${Math.random() * 360}, 100%, 50%)`; // 随机选择颜色
    const riseSpeed = -Math.random() * 8 + 1; // 随机生成上升速度
    const particleSize = Math.random() * 3 + 2; // 随机生成粒子大小
    // 创建新的烟花并添加到烟花数组中
    fireworks.push(new Firework(x, y, color, riseSpeed, particleSize));
}
function launchFireworks() {
    const initialFireworks = 30; // 第一次触发时的烟花数量
    // 立即生成初始数量的烟花粒子
    for (let i = 0; i < initialFireworks; i++) {
        createFirework();
    }
    // 定时生成新的烟花粒子
    const interval = setInterval(() => {
        createFirework();
        // 可以在这里添加逻辑来停止生成新的烟花粒子，例如设置一个生成烟花的总数限制
    }, 200); // 每隔1秒生成一个新的烟花粒子
}

// 触发烟花效果的函数，用于在特定条件下（如倒计时结束）启动一系列烟花
function triggerFireworks() {
    const fireworksCount = 5; // 定义触发的烟花数量
    for (let i = 0; i < fireworksCount; i++) {
        // 每隔一秒触发一个烟花，创建连续的烟花效果
        setTimeout(createFirework, i * 1000);
    }
}

// 倒计时逻辑，假设倒计时结束后触发烟花
const countdownElement = document.getElementById('countdown');
const targetDate = new Date('Feb 9, 2024 23:59:59').getTime();

// 倒计时更新函数，用于显示距离目标日期的时间并在到达时触发烟花
function updateCountdown() {
    const now = new Date().getTime(); // 获取当前时间
    const distance = targetDate - now; // 计算距离目标日期的时间差
    // 计算天、小时、分钟和秒
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    // 更新倒计时显示
    countdownElement.innerHTML = `距离新年还有：${days}天${hours}小时${minutes}分${seconds}秒`;
    // 如果时间差小于0，说明目标日期已到达
    if (distance < 0) {
        clearInterval(interval); // 停止倒计时更新
        countdownElement.style.display = 'none'; // 隐藏倒计时显示
        document.getElementById('greetings').style.display = 'block'; // 显示新年祝福信息
        launchFireworks(); // 使用 launchFireworks 函数触发烟花效果
    }
}
const interval = setInterval(updateCountdown, 1000); // 每秒更新倒计时

animate(); // 开始动画循环