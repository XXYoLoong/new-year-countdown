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

// 更新 triggerFireworks 函数以使用新的烟花效果
function triggerFireworks() {
    createFirework(); // 直接调用 createFirework 函数展示烟花

    setTimeout(() => {
        document.getElementById('greetings').style.display = 'block';
    }, 10000); // 假设烟花效果持续10秒后显示新年祝福语
}

// 如果需要，更新 'previewButton' 的事件监听器以触发新的烟花效果
document.getElementById('previewButton').addEventListener('click', function() {
    triggerFireworks();
});