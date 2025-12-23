import * as THREE from 'three';

// 1. 词库系统
const WORDS = [
    { en: 'APPLE', cn: '苹果', pron: '/??p.?l/', color: 0xff3e3e },
    { en: 'ORANGE', cn: '橙子', pron: '/???r.?nd?/', color: 0xff9100 },
    { en: 'ROCKET', cn: '火箭', pron: '/?rɑ?.k?t/', color: 0x00e5ff },
    { en: 'CHERRY', cn: '樱桃', pron: '/?t?er.i/', color: 0xff2b75 }
];

let currentIndex = 0;
let score = 0;

// 2. 场景初始化
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('game-canvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// 背景：流动星云
const starGeo = new THREE.BufferGeometry();
const starPos = [];
for(let i=0; i<3000; i++) starPos.push((Math.random()-0.5)*100, (Math.random()-0.5)*100, (Math.random()-0.5)*100);
starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0x888888, size: 0.1 }));
scene.add(stars);

// 核心 3D 物体：皮克斯质感球体
const targetGroup = new THREE.Group();
const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(2, 64, 64),
    new THREE.MeshPhysicalMaterial({ 
        color: 0xff3e3e, roughness: 0.2, transmission: 0.5, thickness: 1, metalness: 0.1 
    })
);
targetGroup.add(mesh);
scene.add(targetGroup);

const light = new THREE.PointLight(0xffffff, 2);
light.position.set(5, 5, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

camera.position.z = 10;

// 3. 核心功能：刷新单词与发音
function refreshGame() {
    const word = WORDS[currentIndex];
    document.getElementById('word-en').innerText = word.en;
    document.getElementById('word-cn').innerText = word.cn;
    document.getElementById('pron').innerText = word.pron;
    
    // 物理平滑变色
    gsap.to(mesh.material.color, { r: new THREE.Color(word.color).r, g: new THREE.Color(word.color).g, b: new THREE.Color(word.color).b, duration: 0.5 });
    
    // 发音
    const utter = new SpeechSynthesisUtterance(word.en);
    utter.lang = 'en-US';
    window.speechSynthesis.speak(utter);
}

// 4. 丝滑碰撞特效
function triggerExplosion() {
    // GSAP Q弹动画
    gsap.fromTo(targetGroup.scale, 
        { x: 0.5, y: 1.5, z: 0.5 }, 
        { x: 1, y: 1, z: 1, duration: 0.8, ease: "elastic.out(1, 0.3)" }
    );

    score += 10;
    document.getElementById('score').innerText = score;

    // 随机移动
    gsap.to(targetGroup.position, {
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 6,
        duration: 0.5,
        ease: "power2.out"
    });

    currentIndex = (currentIndex + 1) % WORDS.length;
    refreshGame();
}

// 5. 手势捕捉（平滑算法）
const videoElement = document.getElementById('webcam');
const hands = new window.Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.onResults((results) => {
    document.getElementById('loader').style.opacity = 0;
    setTimeout(() => document.getElementById('loader').style.display = 'none', 1000);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const finger = results.multiHandLandmarks[0][8]; // 食指
        const targetX = (finger.x - 0.5) * 22;
        const targetY = -(finger.y - 0.5) * 14;

        // 碰撞检测
        const dist = Math.sqrt(Math.pow(targetX - targetGroup.position.x, 2) + Math.pow(targetY - targetGroup.position.y, 2));
        if (dist < 2.5) {
            triggerExplosion();
        }
    }
});

const cameraSetup = new window.Camera(videoElement, {
    onFrame: async () => { await hands.send({image: videoElement}); },
    width: 640, height: 480
});
cameraSetup.start();

// 渲染循环
function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.y += 0.01;
    stars.rotation.y += 0.0002;
    renderer.render(scene, camera);
}
animate();
refreshGame();

// 响应式
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});