import * as THREE from 'three';

// 1. 词库配置（自带 Emoji 图片）
const DATA = [
    { en: 'APPLE', cn: '苹果', icon: '??', color: 0xff3b3b },
    { en: 'BANANA', cn: '香蕉', icon: '??', color: 0xffeb3b },
    { en: 'CAT', cn: '猫咪', icon: '??', color: 0xffa726 },
    { en: 'DOG', cn: '小狗', icon: '??', color: 0x8d6e63 },
    { en: 'WATERMELON', cn: '西瓜', icon: '??', color: 0x4caf50 }
];

// 2. 音频管理器 (生成合成音效，无需上传文件)
const playPopSound = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
};

// 3. 初始化 3D 场景
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('game-canvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// 添加梦幻背景光
const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);
const pointLight = new THREE.PointLight(0x00f2ff, 2);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// 创建“可爱球”物体
const ballGroup = new THREE.Group();
const ballGeo = new THREE.SphereGeometry(1.5, 32, 32);
const ballMat = new THREE.MeshPhysicalMaterial({
    color: 0xff3b3b, transmission: 0.6, thickness: 2, roughness: 0.1
});
const ballMesh = new THREE.Mesh(ballGeo, ballMat);
ballGroup.add(ballMesh);
scene.add(ballGroup);

camera.position.z = 12;

// 4. 游戏变量
let score = 0;
let currentIdx = 0;
let targetPos = new THREE.Vector3(0, 0, 0);
let moveSpeed = 0.05;

// 刷新单词显示
function showWordEffect() {
    const item = DATA[currentIdx];
    document.getElementById('w-icon').innerText = item.icon;
    document.getElementById('w-en').innerText = item.en;
    document.getElementById('w-cn').innerText = item.cn;
    ballMesh.material.color.setHex(item.color);

    // 发音逻辑
    const msg = new SpeechSynthesisUtterance(item.en);
    msg.lang = 'en-US';
    msg.rate = 0.8;
    window.speechSynthesis.speak(msg);

    // UI 动画
    gsap.fromTo("#word-info", { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.5, yoyo: true, repeat: 1, repeatDelay: 1.5 });
}

// 碰撞后的动作
function onCatch() {
    playPopSound();
    score += 10;
    document.getElementById('score').innerText = score;
    
    // 物理反馈
    gsap.to(ballMesh.scale, { x: 2, y: 0.1, z: 2, duration: 0.1, yoyo: true, repeat: 1 });
    
    showWordEffect();
    
    // 随机移动到新位置
    targetPos.x = (Math.random() - 0.5) * 12;
    targetPos.y = (Math.random() - 0.5) * 8;
    currentIdx = (currentIdx + 1) % DATA.length;
}

// 5. 手势识别
const hands = new window.Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});
hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.7 });

hands.onResults((results) => {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const indexTip = results.multiHandLandmarks[0][8];
        const hx = (indexTip.x - 0.5) * 22;
        const hy = -(indexTip.y - 0.5) * 15;

        // 碰撞检测
        const dist = Math.sqrt(Math.pow(hx - ballGroup.position.x, 2) + Math.pow(hy - ballGroup.position.y, 2));
        if (dist < 2.2) {
            onCatch();
        }
    }
});

// 6. 启动控制
const cameraSetup = new window.Camera(document.getElementById('webcam'), {
    onFrame: async () => { await hands.send({image: document.getElementById('webcam')}); },
    width: 640, height: 480
});

document.getElementById('start-btn').onclick = () => {
    // 关键：在这里激活音频
    const audioCtx = new AudioContext();
    audioCtx.resume();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance("")); // 预热发音引擎

    document.getElementById('start-overlay').style.display = 'none';
    document.getElementById('game-ui').style.display = 'block';
    cameraSetup.start();
};

// 7. 循环动画
function animate() {
    requestAnimationFrame(animate);
    
    // 让小球丝滑地滑动（类似漂浮效果）
    ballGroup.position.lerp(targetPos, 0.05);
    ballMesh.rotation.y += 0.02;
    ballMesh.rotation.x += 0.01;
    
    renderer.render(scene, camera);
}
animate();

// 自动随机游走逻辑
setInterval(() => {
    if(Math.random() > 0.7) {
        targetPos.x = (Math.random() - 0.5) * 12;
        targetPos.y = (Math.random() - 0.5) * 8;
    }
}, 2000);