// --- 0. 检查环境 (CDN模式下 THREE 是全局变量) ---
if (typeof THREE === 'undefined') {
    throw new Error("Three.js not loaded! Check network.");
}

// --- 1. 词库 (Unicode 编码防乱码) ---
const WORD_POOL = [
    { en: 'APPLE', cn: '\u82f9\u679c', icon: '🍎', pron: '/\u00e6pl/', color: 0xff8a80 }, // 苹果
    { en: 'BANANA', cn: '\u9999\u8549', icon: '🍌', pron: '/b\u0259\u02c8n\u00e6n\u0259/', color: 0xffd180 }, // 香蕉
    { en: 'CAT', cn: '\u732b\u54aa', icon: '🐱', pron: '/k\u00e6t/', color: 0x80deea }, // 猫
    { en: 'DOG', cn: '\u5c0f\u72d7', icon: '🐶', pron: '/d\u0254\u02d0\u0261/', color: 0xa1887f }, // 狗
    { en: 'CAR', cn: '\u6c7d\u8f66', icon: '🚗', pron: '/k\u0251\u02d0r/', color: 0x90caf9 }, // 汽车
    { en: 'STAR', cn: '\u661f\u661f', icon: '⭐', pron: '/st\u0251\u02d0r/', color: 0xfff59d } // 星星
];

// --- 2. 场景初始化 ---
const canvas = document.getElementById('game-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // 优化高清屏

// 灯光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.position.set(10, 10, 10);
scene.add(ambientLight);
scene.add(dirLight);
camera.position.z = 10;

// --- 3. 辅助功能：绘制 Emoji 贴图 ---
function createEmojiTexture(emoji, colorHex) {
    const cvs = document.createElement('canvas');
    cvs.width = 256; cvs.height = 256; // 提高分辨率
    const ctx = cvs.getContext('2d');
    
    // 画圆底
    ctx.fillStyle = '#' + new THREE.Color(colorHex).getHexString();
    ctx.beginPath();
    ctx.arc(128, 128, 120, 0, Math.PI * 2);
    ctx.fill();
    
    // 画 Emoji
    ctx.font = '140px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, 128, 138);
    
    const tex = new THREE.CanvasTexture(cvs);
    return tex;
}

// --- 4. 游戏对象管理 ---
const bubbles = [];
let score = 0;
let isPaused = false;

// 生成气泡
function spawnBubble() {
    if (isPaused) return;

    const data = WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)];
    const geo = new THREE.SphereGeometry(1.3, 32, 32);
    const mat = new THREE.MeshPhongMaterial({ 
        map: createEmojiTexture(data.icon, data.color),
        transparent: true, opacity: 0.95 
    });
    
    const b = new THREE.Mesh(geo, mat);
    // 初始位置：屏幕右外侧
    b.position.set(14, (Math.random() - 0.5) * 8, 0);
    
    b.userData = { 
        word: data, 
        speed: 0.05 + Math.random() * 0.04, // 随机速度
        yOffset: Math.random() * 100 // 波动相位
    };
    
    scene.add(b);
    bubbles.push(b);
}

// 手势光标 (魔法光球)
const cursorGroup = new THREE.Group();
const cursorMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
);
const cursorRing = new THREE.Mesh(
    new THREE.RingGeometry(0.5, 0.6, 32),
    new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide })
);
cursorGroup.add(cursorMesh);
cursorGroup.add(cursorRing);
scene.add(cursorGroup);

// --- 5. 核心循环 ---
const clock = new THREE.Clock();
let handPos = new THREE.Vector3(0, 0, 0);

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // 1. 光标跟随手势 (Lerp 平滑)
    cursorGroup.position.lerp(handPos, 0.15);
    cursorRing.rotation.z -= 0.05;

    if (!isPaused) {
        // 2. 气泡逻辑
        for (let i = bubbles.length - 1; i >= 0; i--) {
            const b = bubbles[i];
            
            // 向左飞行
            b.position.x -= b.userData.speed;
            // 上下正弦波动
            b.position.y += Math.sin(time * 3 + b.userData.yOffset) * 0.03;
            b.rotation.z -= 0.01;

            // 碰撞检测
            const dist = b.position.distanceTo(cursorGroup.position);
            
            // 距离小于 1.8 且 气泡还在屏幕内
            if (dist < 1.8 && b.position.x > -14) {
                // ---> 击中！ <---
                handleHit(b, i);
            }
            
            // 超出左边界移除
            if (b.position.x < -14) {
                scene.remove(b);
                bubbles.splice(i, 1);
            }
        }
    }
    
    renderer.render(scene, camera);
}

function handleHit(bubbleMesh, index) {
    // 移除气泡
    scene.remove(bubbleMesh);
    bubbles.splice(index, 1);
    
    // 加分
    score += 10;
    document.getElementById('score').innerText = score;
    
    // 播放音效 (合成音，无需文件)
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(500, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);

    // 展示卡片
    showCard(bubbleMesh.userData.word);
}

function showCard(wordData) {
    isPaused = true;
    
    // 更新 DOM
    document.getElementById('card-icon').innerText = wordData.icon;
    document.getElementById('card-en').innerText = wordData.en;
    document.getElementById('card-cn').innerText = wordData.cn;
    document.getElementById('card-pron').innerText = wordData.pron;
    
    // 显示动画
    const card = document.getElementById('learning-card');
    card.style.opacity = '1';
    card.style.pointerEvents = 'auto';
    card.style.transform = 'scale(1)';
    
    // 朗读
    const utter = new SpeechSynthesisUtterance(wordData.en);
    utter.lang = 'en-US';
    utter.rate = 0.8;
    window.speechSynthesis.speak(utter);
    
    // 2.5秒后恢复
    setTimeout(() => {
        card.style.opacity = '0';
        card.style.pointerEvents = 'none';
        card.style.transform = 'scale(0.8)';
        isPaused = false;
    }, 2500);
}

// --- 6. 手势识别 MediaPipe ---
const hands = new window.Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});
hands.setOptions({ maxNumHands: 1, minDetectionConfidence: 0.7 });

hands.onResults(results => {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const p = results.multiHandLandmarks[0][8]; // 食指指尖
        // 坐标映射
        const x = (p.x - 0.5) * 25; 
        const y = -(p.y - 0.5) * 15;
        handPos.set(x, y, 0);
    }
});

const cameraUtils = new window.Camera(document.getElementById('game-app').querySelector('video'), {
    onFrame: async () => { await hands.send({image: document.getElementById('game-app').querySelector('video')}); },
    width: 640, height: 480
});

// --- 7. 绑定开始按钮 (核心修复点) ---
// 不使用 window.startGame，而是直接绑定事件监听，更安全
document.getElementById('btn-go').addEventListener('click', () => {
    console.log("Game Starting...");
    
    // UI 切换
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('hud').style.display = 'block';
    
    // 启动引擎
    cameraUtils.start();
    animate();
    setInterval(spawnBubble, 2000); // 每2秒生成一个气泡
    
    // 预热音频
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    ctx.resume();
});

// 响应窗口大小变化
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});