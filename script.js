const countdownElement = document.getElementById('countdown');
const targetDate = new Date('Feb 9, 2024 23:59:59').getTime(); // 修改日期

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

function triggerFireworks() {
    particlesJS.load('fireworks', 'particles.json', function() {
        console.log('callback - particles.js config loaded');
    });

    setTimeout(() => {
        document.getElementById('fireworks').style.display = 'none';
        document.getElementById('greetings').style.display = 'block';
    }, 10000); // 假设烟花效果持续10秒
}

// 新增预览烟花效果按钮的事件监听
document.getElementById('previewButton').addEventListener('click', function() {
    triggerFireworks();
});
