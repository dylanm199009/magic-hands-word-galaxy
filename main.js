import * as THREE from 'three';

const WORD_LIST = [
    { en: 'APPLE', cn: '苹果', icon: '??', pron: '/??p.?l/', color: 0xff3e3e },
    { en: 'BIRD', cn: '小鸟', icon: '??', pron: '/b??rd/', color: 0x4caf50 },
    { en: 'CAR', cn: '汽车', icon: '??', pron: '/kɑ?r/', color: 0x2196f3 },
    { en: 'SUN', cn: '太阳', icon: '??', pron: '/s?n/', color: 0xffeb3b },
    { en: 'CAT', cn: '猫咪', icon: '??', pron: '/k?t/', color: 0xff9800 }
];

let score = 0;
let currentIndex = 0;
let isGameRunning = false;

// --- 3D 核心 ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('game-canvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// 魔法光球（跟随手势）
const magicOrb = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x00f2ff })
);
scene.add(magicOrb);

// 目标星体
const targetGroup = new THREE.Group();
const mesh = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.5, 0.5, 100, 16),
    new THREE.MeshStandardMaterial({ color: 0xff3e3e, roughness: 0.1, metalness: 0.5 })
);
targetGroup.add(mesh);
scene.add(targetGroup);

scene.add(new THREE.AmbientLight(0xffffff, 1));
camera.position.z = 12;

// --- 逻辑：平滑算法 ---
let lerpPos = { x: 0, y: 0 };
function updateHandMovement(x, y) {
    // 线性插值（Lerp）让手感极度丝滑
    lerpPos.x += (x - lerpPos.x) * 0.2;
    lerpPos.y += (y - lerpPos.y) * 0.2;
    magicOrb.position.set(lerpPos.x, lerpPos.y, 0);

    // 碰撞检查
    const dist = magicOrb.position.distanceTo(targetGroup.position);
    if (dist < 2.5 && isGameRunning) {
        collectWord();
    }
}

function collectWord() {
    isGameRunning = false; // 防止连续触发
    
    // 1. 物理特效
    gsap.to(targetGroup.scale, { x: 2, y: 0.2, z: 2, duration: 0.2, yoyo: true, repeat: 1 });
    
    // 2. 单词声音
    const utter = new SpeechSynthesisUtterance(WORD_LIST[currentIndex].en);
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
    
    // 3. 反馈 UI
    score += 10;
    document.getElementById('score').innerText = score;
    gsap.fromTo("#combo-text", { scale: 0, opacity: 1 }, { scale: 1, opacity: 0, duration: 0.8 });

    // 4. 下一个单词
    setTimeout(() => {
        currentIndex = (currentIndex + 1) % WORD_LIST.length;
        refreshUI();
        targetGroup.position.set((Math.random()-0.5)*12, (Math.random()-0.5)*8, 0);
        isGameRunning = true;
    }, 1000);
}

function refreshUI() {
    const data = WORD_LIST[currentIndex];
    document.getElementById('word-emoji').innerText = data.icon;
    document.getElementById('word-en').innerText = data.en;
    document.getElementById('word-cn').innerText = data.cn;
    document.getElementById('word-pron').innerText = data.pron;
    mesh.material.color.setHex(data.color);
}

// --- 手势启动逻辑 ---
const hands = new window.Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});
hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.8 });

hands.onResults((results) => {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const finger = results.multiHandLandmarks[0][8];
        updateHandMovement((finger.x - 0.5) * 25, -(finger.y - 0.5) * 15);
    }
});

const cameraSetup = new window.Camera(document.getElementById('input_video'), {
    onFrame: async () => { await hands.send({image: document.getElementById('input_video')}); }
});

// --- 启动按钮事件 ---
document.getElementById('btn-start').onclick = () => {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-ui').style.display = 'block';
    isGameRunning = true;
    cameraSetup.start(); // 现在才正式请求摄像头
    refreshUI();
};

function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.y += 0.02;
    renderer.render(scene, camera);
}
animate();