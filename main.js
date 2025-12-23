import * as THREE from 'three';

// --- 数据配置 ---
const WORD_DB = [
    { en: 'APPLE', cn: '苹果', pron: '/??p.?l/', color: 0xff4d4d },
    { en: 'BANANA', cn: '香蕉', pron: '/b??n?n.?/', color: 0xffeb3b },
    { en: 'CAR', cn: '汽车', pron: '/kɑ?r/', color: 0x2196f3 },
    { en: 'BIRD', cn: '小鸟', pron: '/b??rd/', color: 0x4caf50 },
    { en: 'STAR', cn: '星星', pron: '/stɑ?r/', color: 0xff9800 }
];

// --- 3D 引擎初始化 ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    canvas: document.querySelector('#game-canvas'), 
    antialias: true, alpha: true 
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ReinhardToneMapping;

// 动态星空背景
const createSpace = () => {
    const geo = new THREE.BufferGeometry();
    const pos = [];
    for(let i=0; i<2000; i++) pos.push((Math.random()-0.5)*100, (Math.random()-0.5)*100, (Math.random()-0.5)*100);
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    return new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true, opacity: 0.8 }));
};
scene.add(createSpace());

// 灯光：皮克斯光感关键
const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);
const spotLight = new THREE.SpotLight(0xffffff, 2);
spotLight.position.set(10, 10, 10);
scene.add(spotLight);

// 核心互动模型
const targetGroup = new THREE.Group();
const mesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2, 2),
    new THREE.MeshStandardMaterial({ 
        roughness: 0.1, metalness: 0.5, 
        emissive: 0x222222 
    })
);
targetGroup.add(mesh);
scene.add(targetGroup);
camera.position.z = 10;

// --- 交互系统 ---
let currentIdx = 0;
let score = 0;
const feedbackUI = document.getElementById('feedback-text');

function updateWord() {
    const data = WORD_DB[currentIdx];
    document.getElementById('word-en').innerText = data.en;
    document.getElementById('word-cn').innerText = data.cn;
    document.getElementById('pronunciation').innerText = data.pron;
    mesh.material.color.setHex(data.color);
    
    // 语音朗读
    const utter = new SpeechSynthesisUtterance(data.en);
    utter.lang = 'en-US';
    utter.rate = 0.8;
    window.speechSynthesis.speak(utter);
}

function onHit() {
    // 视觉反馈：爆炸与缩放
    targetGroup.scale.set(1.5, 0.5, 1.5); // Squash
    setTimeout(() => targetGroup.scale.set(1, 1, 1), 200);
    
    // 文字反馈
    feedbackUI.style.transform = 'translate(-50%, -50%) scale(1)';
    feedbackUI.style.opacity = '1';
    setTimeout(() => {
        feedbackUI.style.transform = 'translate(-50%, -50%) scale(0)';
        feedbackUI.style.opacity = '0';
    }, 500);

    score += 10;
    document.getElementById('score').innerText = score;
    
    currentIdx = (currentIdx + 1) % WORD_DB.length;
    targetGroup.position.x = (Math.random()-0.5) * 12;
    targetGroup.position.y = (Math.random()-0.5) * 6;
    updateWord();
}

// --- 手势识别逻辑 ---
const hands = new window.Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});
hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.7 });

hands.onResults((results) => {
    document.getElementById('loading-overlay').style.opacity = '0';
    setTimeout(() => document.getElementById('loading-overlay').style.display = 'none', 500);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const finger = results.multiHandLandmarks[0][8]; // 食指尖
        const x = (finger.x - 0.5) * 20;
        const y = -(finger.y - 0.5) * 12;
        
        const dist = Math.sqrt(Math.pow(x - targetGroup.position.x, 2) + Math.pow(y - targetGroup.position.y, 2));
        if (dist < 2.5) {
            onHit();
        }
    }
});

const cameraSetup = new window.Camera(document.getElementById('webcam'), {
    onFrame: async () => { await hands.send({image: document.getElementById('webcam')}); },
    width: 640, height: 480
});
cameraSetup.start();
updateWord();

function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.y += 0.02;
    renderer.render(scene, camera);
}
animate();