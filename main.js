import * as THREE from 'three';

// 1. 扩充词库
const LEVELS = [
    { name: "森林动物", data: [
        { en: 'BEAR', cn: '熊', icon: '??', pron: '/ber/' },
        { en: 'TIGER', cn: '老虎', icon: '??', pron: '/?ta?ɡ?r/' },
        { en: 'RABBIT', cn: '兔子', icon: '?r?b?t/' },
        { en: 'LION', cn: '狮子', icon: '??', pron: '/?la??n/' }
    ]},
    { name: "美味水果", data: [
        { en: 'APPLE', cn: '苹果', icon: '??', pron: '/??pl/' },
        { en: 'GRAPE', cn: '葡萄', icon: '??', pron: '/ɡre?p/' },
        { en: 'CHERRY', cn: '樱桃', icon: '?t?eri/' }
    ]},
    { name: "交通工具", data: [
        { en: 'PLANE', cn: '飞机', icon: '??', pron: '/ple?n/' },
        { en: 'SHIP', cn: '轮船', icon: '??', pron: '/??p/' },
        { en: 'ROCKET', cn: '火箭', icon: '??', pron: '/?rɑ?k?t/' }
    ]}
];

// 2. 引擎初始化
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('game-canvas'), antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// 环境光
scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const sunLight = new THREE.DirectionalLight(0xffffff, 0.5);
sunLight.position.set(5, 5, 5);
scene.add(sunLight);

// 创建飞行向导 (3D 小球/灵动角色)
const guideGroup = new THREE.Group();
const guideMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 32, 32),
    new THREE.MeshToonMaterial({ color: 0x38bdf8 })
);
guideGroup.add(guideMesh);
scene.add(guideGroup);

// 漂浮的气泡目标
const bubbleGeo = new THREE.SphereGeometry(1.5, 32, 32);
const bubbleMat = new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.4, shininess: 100 });
const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
scene.add(bubble);

camera.position.z = 15;

// 3. 游戏核心逻辑
let currentLevel = 0;
let currentIndex = 0;
let score = 0;
let isFlipping = false;
let handX = 0, handY = 0;

window.startGame = (lv) => {
    // 激活音频
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtx.resume();
    window.speechSynthesis.getVoices(); // 预热

    currentLevel = lv;
    currentIndex = 0;
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('hud').style.display = 'block';
    document.getElementById('level-name').innerText = LEVELS[lv].name;
    
    spawnBubble();
    cameraSetup.start();
};

function spawnBubble() {
    bubble.position.set((Math.random()-0.5)*15, (Math.random()-0.5)*10, 0);
    bubble.scale.set(1, 1, 1);
    isFlipping = false;
}

function handleHit() {
    if (isFlipping) return;
    isFlipping = true;

    const data = LEVELS[currentLevel].data[currentIndex];
    
    // UI 赋值
    document.getElementById('w-icon').innerText = data.icon;
    document.getElementById('w-en').innerText = data.en;
    document.getElementById('w-cn').innerText = data.cn;
    document.getElementById('w-pron').innerText = data.pron;

    // 翻转卡片效果
    const card = document.getElementById('card-container');
    card.classList.add('active');
    setTimeout(() => card.classList.add('flipped'), 100);

    // 发音
    const msg = new SpeechSynthesisUtterance(data.en);
    msg.lang = 'en-US';
    msg.rate = 0.8;
    window.speechSynthesis.speak(msg);

    // 加分
    score += 10;
    document.getElementById('score').innerText = score;

    // 气泡爆裂效果
    gsap.to(bubble.scale, { x: 0, y: 0, z: 0, duration: 0.3 });

    // 重置并移动到下一个
    setTimeout(() => {
        card.classList.remove('flipped');
        setTimeout(() => {
            card.classList.remove('active');
            currentIndex = (currentIndex + 1) % LEVELS[currentLevel].data.length;
            spawnBubble();
        }, 300);
    }, 2500);
}

// 4. 手势与跟随系统
const hands = new window.Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});
hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.7 });

hands.onResults((results) => {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const finger = results.multiHandLandmarks[0][8];
        handX = (finger.x - 0.5) * 28;
        handY = -(finger.y - 0.5) * 18;
    }
});

const cameraSetup = new window.Camera(document.getElementById('webcam'), {
    onFrame: async () => { await hands.send({image: document.getElementById('webcam')}); },
    width: 640, height: 480
});

function animate() {
    requestAnimationFrame(animate);
    
    // 角色跟随手势（Lerp 丝滑插值）
    guideGroup.position.x += (handX - guideGroup.position.x) * 0.15;
    guideGroup.position.y += (handY - guideGroup.position.y) * 0.15;
    
    // 简单的摆动（赋予生命力）
    guideMesh.rotation.z = Math.sin(Date.now()*0.005) * 0.2;
    
    // 碰撞检测
    if (!isFlipping) {
        const dist = guideGroup.position.distanceTo(bubble.position);
        if (dist < 2.5) handleHit();
    }
    
    renderer.render(scene, camera);
}
animate();