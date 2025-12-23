// --- 1. 语音引擎修复 (Anti-Garbage Collection) ---
const TTS = {
    currentUtterance: null, // 全局变量，防止被回收
    speak: function(text) {
        // 取消当前正在读的
        window.speechSynthesis.cancel();
        
        // 创建新语音
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US';
        u.rate = 0.9;
        u.volume = 1.0;
        
        // 尝试获取更自然的声音
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(v => v.name.includes('Google US English') || v.lang === 'en-US');
        if (preferred) u.voice = preferred;

        // 绑定防止回收
        this.currentUtterance = u;
        
        // 播放
        window.speechSynthesis.speak(u);
        
        // 显示调试信息
        showToast(`正在朗读: ${text}`);
        
        u.onend = () => { this.currentUtterance = null; };
    }
};

// 显示小提示
function showToast(msg) {
    const el = document.getElementById('debug-toast');
    if(el) {
        el.innerText = msg;
        el.style.opacity = 1;
        setTimeout(() => el.style.opacity = 0, 2000);
    }
}

// --- 2. 游戏数据 ---
const LEVELS = {
    animals: [
        { en: 'LION', cn: '狮子', icon: '🦁', color: 0xff9f43 },
        { en: 'CAT', cn: '猫咪', icon: '🐱', color: 0xff6b6b },
        { en: 'DOG', cn: '小狗', icon: '🐶', color: 0x54a0ff }
    ],
    food: [
        { en: 'APPLE', cn: '苹果', icon: '🍎', color: 0xff4757 },
        { en: 'PIZZA', cn: '披萨', icon: '🍕', color: 0xffa502 },
        { en: 'CAKE', cn: '蛋糕', icon: '🍰', color: 0xff9ff3 }
    ],
    magic: [
        { en: 'STAR', cn: '星星', icon: '⭐', color: 0xfeca57 },
        { en: 'GHOST', cn: '幽灵', icon: '👻', color: 0xffffff }
    ]
};
let currentPool = [];
let score = 0;
let isPaused = false;

// --- 3. 3D 场景 ---
import * as THREE from 'three';

const canvas = document.getElementById('output-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 18;

// 灯光
scene.add(new THREE.AmbientLight(0xffffff, 0.7));
const dLight = new THREE.DirectionalLight(0xffffff, 0.8);
dLight.position.set(10, 10, 10);
scene.add(dLight);

// --- 4. 主角：大眼萌宠 ---
const avatar = new THREE.Group();
const body = new THREE.Mesh(
    new THREE.SphereGeometry(1.2, 32, 32),
    new THREE.MeshPhongMaterial({ color: 0x00cec9, shininess: 100, emissive: 0x00cec9, emissiveIntensity: 0.3 })
);
avatar.add(body);
// 眼睛
const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
const pupilMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.35), eyeMat);
eyeL.position.set(-0.4, 0.2, 0.9);
const pL = new THREE.Mesh(new THREE.SphereGeometry(0.15), pupilMat);
pL.position.z = 0.3;
eyeL.add(pL);
avatar.add(eyeL);
const eyeR = eyeL.clone();
eyeR.position.set(0.4, 0.2, 0.9);
avatar.add(eyeR);
// 光环
const ring = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.1, 16, 100), new THREE.MeshBasicMaterial({ color: 0xffeaa7 }));
ring.rotation.x = Math.PI/2;
avatar.add(ring);

scene.add(avatar);

// --- 5. 气球系统 ---
const balloons = [];

function createEmojiTex(emoji) {
    const cvs = document.createElement('canvas');
    cvs.width = 256; cvs.height = 256;
    const ctx = cvs.getContext('2d');
    ctx.font = '160px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, 128, 140);
    return new THREE.CanvasTexture(cvs);
}

function spawnBalloon() {
    if (isPaused) return;
    const item = currentPool[Math.floor(Math.random() * currentPool.length)];
    const group = new THREE.Group();
    
    // 气球
    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1.8, 32, 32),
        new THREE.MeshPhongMaterial({ 
            color: item.color, transparent: true, opacity: 0.9,
            emissive: item.color, emissiveIntensity: 0.2 
        })
    );
    group.add(sphere);
    
    // 图标
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: createEmojiTex(item.icon) }));
    sprite.scale.set(2.2, 2.2, 1);
    group.add(sprite);

    // 位置：右侧飞入
    group.position.set(22, (Math.random()-0.5)*12, 0);
    group.userData = { word: item, speed: 0.1 + Math.random()*0.05 };

    scene.add(group);
    balloons.push(group);
}

function spawnParticles(pos, color) {
    for(let i=0; i<15; i++) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(0.4,0.4,0.4), new THREE.MeshBasicMaterial({color:color}));
        m.position.copy(pos);
        scene.add(m);
        gsap.to(m.position, {
            x: pos.x + (Math.random()-0.5)*8,
            y: pos.y + (Math.random()-0.5)*8,
            duration: 0.8
        });
        gsap.to(m.scale, {x:0, y:0, z:0, duration: 0.8, onComplete:()=>scene.remove(m)});
    }
}

// --- 6. 核心循环 ---
let handTarget = new THREE.Vector3(0,0,0);

function animate() {
    requestAnimationFrame(animate);
    
    // 主角移动
    avatar.position.lerp(handTarget, 0.15); // 0.15 平滑系数
    avatar.rotation.z = (avatar.position.x - handTarget.x) * -0.1; // 倾斜效果
    avatar.rotation.x = (avatar.position.y - handTarget.y) * 0.1;

    if (!isPaused) {
        for (let i = balloons.length - 1; i >= 0; i--) {
            const b = balloons[i];
            b.position.x -= b.userData.speed;
            
            // 碰撞 (距离小于2.8)
            if (b.position.distanceTo(avatar.position) < 2.8) {
                hitBalloon(b, i);
            } else if (b.position.x < -22) {
                scene.remove(b);
                balloons.splice(i, 1);
            }
        }
    }
    renderer.render(scene, camera);
}

function hitBalloon(obj, index) {
    const data = obj.userData.word;
    scene.remove(obj);
    balloons.splice(index, 1);
    
    // 特效
    spawnParticles(obj.position, data.color);
    score += 10;
    document.getElementById('score').innerText = score;
    
    // 朗读与展示
    showCard(data);
}

function showCard(data) {
    isPaused = true;
    
    document.getElementById('c-icon').innerText = data.icon;
    document.getElementById('c-word').innerText = data.en;
    document.getElementById('c-cn').innerText = data.cn;
    
    const card = document.getElementById('card-overlay');
    card.classList.add('active');
    
    // 核心：朗读
    TTS.speak(data.en);
    
    setTimeout(() => {
        card.classList.remove('active');
        isPaused = false;
    }, 2500);
}

// --- 7. 手势识别修复 ---
const videoEl = document.getElementById('input-video');
const debugCanvas = document.getElementById('debug-canvas');
const debugCtx = debugCanvas.getContext('2d');

const hands = new window.Hands({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});
hands.setOptions({ maxNumHands: 1, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });

hands.onResults(res => {
    // 1. 绘制调试雷达 (确认是否有手)
    debugCtx.clearRect(0, 0, debugCanvas.width, debugCanvas.height);
    if (res.multiHandLandmarks && res.multiHandLandmarks.length > 0) {
        const p = res.multiHandLandmarks[0][8]; // 食指
        
        // 画绿点在雷达上
        debugCtx.fillStyle = '#00ff00';
        debugCtx.beginPath();
        debugCtx.arc(p.x * 160, p.y * 120, 5, 0, Math.PI*2);
        debugCtx.fill();
        
        // 2. 映射到 3D 空间
        // 注意：Webcam 是镜像的，所以 X 轴要反转 (1 - p.x)
        // 范围扩大系数 1.8，让手不用伸太远
        const x = (0.5 - p.x) * 35; // 左右范围 35
        const y = -(p.y - 0.5) * 25; // 上下范围 25
        
        handTarget.set(x, y, 0);
        
        document.getElementById('status-log').innerText = "✅ 手势追踪中...";
    } else {
        document.getElementById('status-log').innerText = "👀 寻找手势...";
    }
});

const cameraUtils = new window.Camera(videoEl, {
    onFrame: async () => { await hands.send({image: videoEl}); },
    width: 640, height: 480
});

// --- 8. 启动逻辑 ---
window.startGame = (type) => {
    currentPool = LEVELS[type];
    
    // 解锁音频上下文 (必须在点击事件中)
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    ac.resume();
    
    // 预热语音
    TTS.speak("Ready");

    document.getElementById('lobby').style.display = 'none';
    document.getElementById('game-ui').style.display = 'block';
    
    cameraUtils.start();
    animate();
    setInterval(spawnBalloon, 1800);
};

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});