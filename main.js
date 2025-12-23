import * as THREE from 'three';

// 注意：这里删掉了 import Hands 和 Camera

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    canvas: document.querySelector('#game-canvas'), 
    antialias: true,
    alpha: true 
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// 魔法星空
const starGeometry = new THREE.BufferGeometry();
const starVertices = [];
for(let i=0; i<3000; i++) {
    starVertices.push((Math.random()-0.5)*100, (Math.random()-0.5)*100, (Math.random()-0.5)*100);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 }));
scene.add(stars);

// 核心互动模型
const targetMesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.5, 1),
    new THREE.MeshStandardMaterial({ color: 0x00ffcc, roughness: 0, metalness: 0.5 })
);
scene.add(targetMesh);
scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const pLight = new THREE.PointLight(0xff00ff, 2);
pLight.position.set(5, 5, 5);
scene.add(pLight);
camera.position.z = 8;

let score = 0;
const words = ["GALAXY", "STAR", "PLANET", "ROCKET", "MAGIC"];
const wordText = document.querySelector('#target-word');
const scoreText = document.querySelector('#score');

// --- 手势识别 (使用全局对象) ---
const videoElement = document.getElementById('webcam');
// 使用 window 上的全局对象
const hands = new window.Hands({
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
        const x = (hand[8].x - 0.5) * 15;
        const y = -(hand[8].y - 0.5) * 10;
        const dist = Math.sqrt(Math.pow(x - targetMesh.position.x, 2) + Math.pow(y - targetMesh.position.y, 2));
        if (dist < 2) {
            score += 10;
            scoreText.innerText = score;
            targetMesh.position.x = (Math.random()-0.5) * 10;
            targetMesh.position.y = (Math.random()-0.5) * 6;
            wordText.innerText = words[Math.floor(Math.random()*words.length)];
            window.speechSynthesis.speak(new SpeechSynthesisUtterance(wordText.innerText));
        }
    }
});

const cameraSetup = new window.Camera(videoElement, {
    onFrame: async () => { await hands.send({image: videoElement}); },
    width: 640, height: 480
});
cameraSetup.start();

function animate() {
    requestAnimationFrame(animate);
    targetMesh.rotation.y += 0.01;
    stars.rotation.y += 0.0005;
    renderer.render(scene, camera);
}
animate();