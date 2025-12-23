import * as THREE from 'three';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

// --- 场景设置 ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    canvas: document.querySelector('#game-canvas'), 
    antialias: true,
    alpha: true 
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// 魔法星空背景
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
const starVertices = [];
for(let i=0; i<5000; i++) {
    starVertices.push((Math.random()-0.5)*100, (Math.random()-0.5)*100, (Math.random()-0.5)*100);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// 核心互动模型（糖果质感）
const geometry = new THREE.IcosahedronGeometry(1.5, 1);
const material = new THREE.MeshStandardMaterial({ 
    color: 0x00ffcc, 
    roughness: 0, 
    metalness: 0.5,
    emissive: 0x003322
});
const targetMesh = new THREE.Mesh(geometry, material);
scene.add(targetMesh);

// 灯光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xff00ff, 2, 20);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

camera.position.z = 8;

// --- 游戏逻辑 ---
let score = 0;
const words = ["GALAXY", "STAR", "PLANET", "ROCKET", "MAGIC"];
const wordText = document.querySelector('#target-word');
const scoreText = document.querySelector('#score');

// 粒子爆炸效果
function createExplosion(pos) {
    const particleCount = 20;
    const geo = new THREE.SphereGeometry(0.1, 8, 8);
    for(let i=0; i<particleCount; i++) {
        const mat = new THREE.MeshBasicMaterial({ color: 0xff00ff });
        const p = new THREE.Mesh(geo, mat);
        p.position.copy(pos);
        p.userData.velocity = new THREE.Vector3(
            (Math.random()-0.5)*0.2,
            (Math.random()-0.5)*0.2,
            (Math.random()-0.5)*0.2
        );
        scene.add(p);
        setTimeout(() => scene.remove(p), 1000);
    }
}

// --- 手势识别 ---
const videoElement = document.getElementById('webcam');
const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7
});

hands.onResults((results) => {
    document.getElementById('loading-overlay').style.display = 'none';
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const hand = results.multiHandLandmarks[0];
        // 转换坐标到 3D 空间
        const x = (hand[8].x - 0.5) * 15;
        const y = -(hand[8].y - 0.5) * 10;
        
        // 碰撞检测
        const dist = Math.sqrt(Math.pow(x - targetMesh.position.x, 2) + Math.pow(y - targetMesh.position.y, 2));
        if (dist < 2) {
            handleHit();
        }
    }
});

function handleHit() {
    createExplosion(targetMesh.position);
    score += 10;
    scoreText.innerText = score;
    
    // 随机新位置
    targetMesh.position.x = (Math.random()-0.5) * 10;
    targetMesh.position.y = (Math.random()-0.5) * 6;
    
    // 随机新单词
    wordText.innerText = words[Math.floor(Math.random()*words.length)];
    
    // 语音反馈
    const speech = new SpeechSynthesisUtterance(wordText.innerText);
    window.speechSynthesis.speak(speech);
}

const cameraSetup = new Camera(videoElement, {
    onFrame: async () => { await hands.send({image: videoElement}); },
    width: 640, height: 480
});
cameraSetup.start();

// 渲染循环
function animate() {
    requestAnimationFrame(animate);
    targetMesh.rotation.x += 0.01;
    targetMesh.rotation.y += 0.01;
    stars.rotation.y += 0.0005;
    renderer.render(scene, camera);
}
animate();