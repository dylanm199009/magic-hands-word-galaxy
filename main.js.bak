// --- 0. 检查 THREE 是否存在 ---
if (typeof THREE === 'undefined') { throw new Error("Three.js load failed."); }

// --- 1. 数据配置 (Unicode 编码防乱码) ---
const WORDS = [
    { en: 'APPLE', cn: '\u82f9\u679c', icon: '🍎', pron: '/\u00e6pl/', color: 0xff4d4d },
    { en: 'BANANA', cn: '\u9999\u8549', icon: '🍌', pron: '/b\u0259\u02c8n\u00e6n\u0259/', color: 0xffd700 },
    { en: 'GRAPE', cn: '\u8461\u8404', icon: '🍇', pron: '/\u0261re\u026ap/', color: 0xba68c8 },
    { en: 'ROCKET', cn: '\u706b\u7bad', icon: '🚀', pron: '/\u02c8r\u0251\u02d0k\u026at/', color: 0x4fc3f7 },
    { en: 'STAR', cn: '\u661f\u661f', icon: '⭐', pron: '/st\u0251\u02d0r/', color: 0xfff176 },
    { en: 'CAT', cn: '\u732b\u54aa', icon: '🐱', pron: '/k\u00e6t/', color: 0xffb74d }
];

// --- 2. 场景与渲染器 ---
const canvas = document.getElementById('game-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // 高清渲染
camera.position.z = 12;

// 3A 级灯光
const ambLight = new THREE.AmbientLight(0xffffff, 0.7);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 7);
scene.add(ambLight);
scene.add(dirLight);

// --- 3. 辅助：Emoji 转 3D 贴图 ---
function createIconTexture(emoji) {
    const cvs = document.createElement('canvas');
    cvs.width = 128; cvs.height = 128;
    const ctx = cvs.getContext('2d');
    ctx.font = '100px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, 64, 70); // 纯 Emoji，无背景
    return new THREE.CanvasTexture(cvs);
}

// --- 4. 粒子系统 (爆炸特效) ---
const particles = [];
function spawnExplosion(pos, colorHex) {
    const geo = new THREE.SphereGeometry(0.15, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ color: colorHex });
    
    for (let i = 0; i < 20; i++) {
        const p = new THREE.Mesh(geo, mat);
        p.position.copy(pos);
        // 随机爆炸速度
        p.userData = {
            vel: new THREE.Vector3((Math.random()-0.5)*0.5, (Math.random()-0.5)*0.5, (Math.random()-0.5)*0.5),
            life: 1.0
        };
        scene.add(p);
        particles.push(p);
    }
}

// --- 5. 泡泡逻辑 (Crystal Bubbles) ---
const bubbles = [];
let isPaused = false;

function spawnBubble() {
    if (isPaused) return;

    const data = WORDS[Math.floor(Math.random() * WORDS.length)];
    const group = new THREE.Group();

    // 外层：水晶玻璃球 (Physical Material)
    const glassGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.9, // 透明传光
        opacity: 1,
        metalness: 0,
        roughness: 0,
        ior: 1.5,
        thickness: 0.5,
        transparent: true
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    group.add(glassMesh);

    // 内层：漂浮的图标 (Sprite)
    const iconMap = createIconTexture(data.icon);
    const iconMat = new THREE.SpriteMaterial({ map: iconMap });
    const iconSprite = new THREE.Sprite(iconMat);
    iconSprite.scale.set(1.5, 1.5, 1);
    group.add(iconSprite);

    // 初始化位置
    group.position.set(15, (Math.random() - 0.5) * 8, 0);
    group.userData = { 
        word: data, 
        speed: 0.04 + Math.random() * 0.03, 
        offset: Math.random() * 100 
    };

    scene.add(group);
    bubbles.push(group);
}

// --- 6. 游戏交互 (手势光标) ---
const cursor = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xffff00 })
);
// 光标拖尾
const trailGeo = new THREE.BufferGeometry();
const trailMat = new THREE.LineBasicMaterial({ color: 0xffff00 });
scene.add(cursor);

let score = 0;
let handPos = new THREE.Vector3(100, 100, 0); // 初始在屏幕外

// 核心循环
function animate() {
    requestAnimationFrame(animate);
    
    // 1. 光标跟随 (Lerp)
    cursor.position.lerp(handPos, 0.2);

    // 2. 粒子更新
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.position.add(p.userData.vel); // 移动
        p.userData.life -= 0.03; // 寿命衰减
        p.scale.setScalar(p.userData.life); // 变小
        if (p.userData.life <= 0) {
            scene.remove(p);
            particles.splice(i, 1);
        }
    }

    if (!isPaused) {
        // 3. 泡泡更新
        for (let i = bubbles.length - 1; i >= 0; i--) {
            const b = bubbles[i];
            
            // 移动逻辑：波浪式前进
            b.position.x -= b.userData.speed;
            b.position.y += Math.sin(performance.now() * 0.002 + b.userData.offset) * 0.02;
            b.rotation.z += 0.01;
            b.rotation.x += 0.01;

            // 碰撞检测
            if (b.position.distanceTo(cursor.position) < 1.8) {
                handleCatch(b, i);
            }
            
            // 出界移除
            if (b.position.x < -15) {
                scene.remove(b);
                bubbles.splice(i, 1);
            }
        }
    }
    
    renderer.render(scene, camera);
}

// 捕获逻辑
function handleCatch(bubble, index) {
    const data = bubble.userData.word;
    
    // 1. 爆炸特效
    spawnExplosion(bubble.position, data.color);
    
    // 2. 移除泡泡
    scene.remove(bubble);
    bubbles.splice(index, 1);
    
    // 3. 加分音效 (合成音)
    playSynthSound();
    
    // 4. 更新分数
    score += 10;
    document.getElementById('score').innerText = score;
    
    // 5. 进入“学习模式” (暂停游戏，显示卡片)
    showLearningCard(data);
}

function showLearningCard(data) {
    isPaused = true;
    
    // 更新卡片内容
    document.getElementById('card-icon').innerText = data.icon;
    document.getElementById('card-en').innerText = data.en;
    document.getElementById('card-cn').innerText = data.cn;
    document.getElementById('card-pron').innerText = data.pron;
    
    // 动画显示
    const card = document.getElementById('learning-card');
    card.classList.add('show');
    
    // 朗读 (确保发音)
    speakWord(data.en);
    
    // 3秒后恢复游戏
    setTimeout(() => {
        card.classList.remove('show');
        isPaused = false;
    }, 3000);
}

// --- 7. 音频核心 (解决没声音的关键) ---
function speakWord(text) {
    window.speechSynthesis.cancel(); // 打断之前的
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.9;
    u.volume = 1.0;
    window.speechSynthesis.speak(u);
}

function playSynthSound() {
    // 简单的“叮”声
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
}

// --- 8. MediaPipe 初始化 ---
const hands = new window.Hands({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});
hands.setOptions({ maxNumHands: 1, minDetectionConfidence: 0.7 });
hands.onResults(res => {
    if (res.multiHandLandmarks && res.multiHandLandmarks.length > 0) {
        const p = res.multiHandLandmarks[0][8];
        handPos.set((p.x - 0.5) * 25, -(p.y - 0.5) * 15, 0);
    }
});
const cam = new window.Camera(document.getElementById('webcam'), {
    onFrame: async () => { await hands.send({image: document.getElementById('webcam')}); },
    width: 640, height: 480
});

// --- 9. 启动按钮 (最重要的声音解锁) ---
document.getElementById('btn-start').addEventListener('click', () => {
    // 1. 界面切换
    document.getElementById('start-screen').style.display = 'none';
    
    // 2. 强制播放一个空声音，解锁 AudioContext
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    ctx.resume().then(() => {
        console.log('AudioContext Unlocked');
    });
    
    // 3. 强制触发一次语音引擎 (预热)
    speakWord(""); 

    // 4. 启动游戏
    cam.start();
    animate();
    setInterval(spawnBubble, 2500); // 开始生成泡泡
});

// 响应调整
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});