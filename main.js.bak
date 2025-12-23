// --- 0. 全局检查 ---
if (typeof THREE === 'undefined') throw new Error("THREE is not defined.");

// --- 1. 词库 + 稀有度 ---
const LEVELS = {
    animals: [
        { en: 'LION', cn: '狮子', icon: '🦁', color: 0xff9f43 },
        { en: 'PANDA', cn: '熊猫', icon: '🐼', color: 0x57606f },
        { en: 'CAT', cn: '猫咪', icon: '🐱', color: 0xff6b6b },
        { en: 'DOG', cn: '小狗', icon: '🐶', color: 0x54a0ff },
        { en: 'TIGER', cn: '老虎', icon: '🐯', color: 0xff6348, rare: 0.15 }, // 稀有度 15%
        { en: 'ELEPHANT', cn: '大象', icon: '🐘', color: 0xa4b0be, rare: 0.05 } // 稀有度 5%
    ],
    food: [
        { en: 'BURGER', cn: '汉堡', icon: '🍔', color: 0xff9f43, rare: 0.15 },
        { en: 'PIZZA', cn: '披萨', icon: '🍕', color: 0xff6b6b },
        { en: 'APPLE', cn: '苹果', icon: '🍎', color: 0xff4757 },
        { en: 'ICE CREAM', cn: '冰淇淋', icon: '🍦', color: 0x70a1ff, rare: 0.05 }
    ],
    magic: [
        { en: 'STAR', cn: '星星', icon: '⭐', color: 0xfeca57, rare: 0.2 },
        { en: 'GHOST', cn: '幽灵', icon: '👻', color: 0xffffff },
        { en: 'ALIEN', cn: '外星人', icon: '👽', color: 0x2ed573, rare: 0.1 }
    ]
};

let currentPool = [];
let score = 0;
let isPaused = false;

// --- 2. 语音系统 (全局变量防回收) ---
const TTS = {
    utterance: null,
    speak: function(text) {
        window.speechSynthesis.cancel();
        this.utterance = new SpeechSynthesisUtterance(text);
        this.utterance.lang = 'en-US';
        this.utterance.rate = 0.9;
        const voices = window.speechSynthesis.getVoices();
        const enVoice = voices.find(v => v.lang.includes('en-US'));
        if (enVoice) this.utterance.voice = enVoice;
        window.speechSynthesis.speak(this.utterance);
    }
};

// --- 3. 3D 场景 ---
const canvas = document.getElementById('output-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
camera.position.z = 18;

scene.add(new THREE.AmbientLight(0xffffff, 0.7));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(10, 10, 10);
scene.add(dirLight);

// --- 4. 主角：大眼萌宠 (Avatar) ---
const avatar = new THREE.Group();
// ... (avatar 创建代码保持不变，包括 eyes, blush, prop, jet) ...
// 修复 Avatar 创建代码，确保所有 Mesh 都添加到 group
function createAvatar() {
    const group = new THREE.Group();
    const bodyGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const bodyMat = new THREE.MeshPhongMaterial({ color: 0x00cec9, shininess: 100, emissive: 0x00cec9, emissiveIntensity: 0.3 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);

    const eyeGeo = new THREE.SphereGeometry(0.35, 32, 32);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat); eyeL.position.set(-0.4, 0.2, 0.9);
    const pupilL = new THREE.Mesh(new THREE.SphereGeometry(0.15), pupilMat); pupilL.position.set(0, 0, 0.3);
    eyeL.add(pupilL); group.add(eyeL);

    const eyeR = eyeL.clone(); eyeR.position.set(0.4, 0.2, 0.9);
    group.add(eyeR);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.1, 16, 100), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
    ring.rotation.x = Math.PI/2; ring.userData.isRing = true;
    group.add(ring);

    const light = new THREE.PointLight(0x00cec9, 1, 10);
    group.add(light);

    return group;
}
const avatar = createAvatar();
scene.add(avatar);


// --- 5. 气球与稀有度系统 ---
const balloons = [];
const particles = [];

// 气球创建函数 (支持稀有度)
function spawnBalloon() {
    if (isPaused) return;

    // 稀有度逻辑
    let type = 'normal';
    const rarity = Math.random();
    if (rarity < 0.05) type = 'rainbow'; // 5%
    else if (rarity < 0.20) type = 'gold'; // 15%

    const item = currentPool[Math.floor(Math.random() * currentPool.length)];
    let color = item.color;
    let icon = item.icon;

    if (type === 'gold') { color = 0xffd700; icon = '💰'; }
    if (type === 'rainbow') { color = 0xffffff; icon = '🎁'; } // 彩虹用宝箱

    const group = new THREE.Group();
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.8, 32, 32), new THREE.MeshPhongMaterial({
        color: color, transparent: true, opacity: 0.9,
        emissive: color, emissiveIntensity: 0.2
    }));
    group.add(sphere);

    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: createEmojiTexture(icon) }));
    sprite.scale.set(2, 2, 1);
    group.add(sprite);

    group.position.set(22, (Math.random()-0.5)*12, 0);
    group.userData = { word: item, type: type, speed: 0.1 + Math.random()*0.05 };
    
    scene.add(group);
    balloons.push(group);
}

// 粒子特效
function spawnParticles(pos, color) {
    for(let i=0; i<15; i++) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(0.4,0.4,0.4), new THREE.MeshBasicMaterial({color: color}));
        m.position.copy(pos);
        scene.add(m);
        gsap.to(m.position, {x: pos.x + (Math.random()-0.5)*6, y: pos.y + (Math.random()-0.5)*6, duration: 1});
        gsap.to(m.scale, {x:0, y:0, z:0, duration: 1, onComplete:()=>scene.remove(m)});
    }
}

// --- 6. 核心游戏循环 ---
const clock = new THREE.Clock();
let handTarget = new THREE.Vector3(0,0,0); // 目标位置

animate(); // 启动动画循环

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // 1. 主角移动 (灵敏跟随 + 视觉效果)
    avatar.position.lerp(handTarget, 0.15); // 跟随平滑度
    avatar.rotation.z = (avatar.position.x - handTarget.x) * -0.1; // 倾斜
    avatar.rotation.x = (avatar.position.y - handTarget.y) * 0.1;
    avatar.children.find(c => c.userData?.isRing).rotation.z -= 0.1; // 光环旋转

    if (!isPaused) {
        // 2. 气球逻辑
        for (let i = balloons.length - 1; i >= 0; i--) {
            const b = balloons[i];
            
            // 移动
            b.position.x -= b.userData.speed;
            b.position.y += Math.sin(time * 3 + b.userData.offset) * 0.05;

            // 碰撞检测
            if (b.position.distanceTo(avatar.position) < 2.8) { // 碰撞半径
                hitBalloon(b, i);
            }
            // 出界
            else if (b.position.x < -22) {
                scene.remove(b);
                balloons.splice(i, 1);
            }
        }
    }
    renderer.render(scene, camera);
}

function hitBalloon(obj, index) {
    const data = obj.userData.word;
    const type = obj.userData.type;
    
    // 视觉与音效
    scene.remove(obj);
    balloons.splice(index, 1);
    
    spawnParticles(obj.position, data.color);
    playTone(400 + (data.color % 300)); // 简单音效
    
    // 根据稀有度得分
    if (type === 'gold') { score += 50; showFloatText("+50", obj.position.x, obj.position.y, true); }
    else if (type === 'rainbow') { score += 100; showFloatText("+100", obj.position.x, obj.position.y, true); }
    else { score += 10; }
    document.getElementById('score').innerText = score;
    
    // 卡片显示
    showCard(data);
}

function showCard(data) {
    isPaused = true;
    const card = document.getElementById('card-popup');
    
    document.getElementById('c-icon').innerText = data.icon;
    document.getElementById('c-word').innerText = data.en;
    document.getElementById('c-cn').innerText = data.cn;
    
    card.classList.add('active');
    TTS.speak(data.en);
    
    setTimeout(() => {
        card.classList.remove('active');
        isPaused = false;
    }, 2500);
}

// --- 7. 音频与手势 ---
const TTS = { utterance: null, speak: function(text) { /* ... TTS.speak 代码不变 ... */ } }; // 保持 V12 的 TTS
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playTone(freq) { /* ... playTone 代码不变 ... */ }

const hands = new window.Hands({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});
hands.setOptions({ maxNumHands: 1, minDetectionConfidence: 0.5 });

hands.onResults(res => {
    const videoEl = document.getElementById('input-video');
    const debugCanvas = document.getElementById('debug-canvas');
    const debugCtx = debugCanvas.getContext('2d');

    // 确保视频流正确渲染 (避免黑屏)
    // MediaPipe 会把画面渲染到 input_video 上
    if (res.image) {
        // MediaPipe 渲染的画面是正常的，而不是镜像的
        // 我们需要将 input_video 的显示稍微调整
        // 关键：确保 video 元素是可见的（即使透明）
        videoEl.style.opacity = '0.001'; // 足够低以至于看不见，但元素存在
        videoEl.style.position = 'absolute'; // 确保它在最底层
        videoEl.style.top = '0'; videoEl.style.left = '0'; videoEl.style.width = '100%'; videoEl.style.height = '100%';
        videoEl.style.zIndex = '-1'; // 放到最底层

        // 绘制手部追踪点在调试画布上
        debugCtx.clearRect(0, 0, debugCanvas.width, debugCanvas.height);
        if (res.multiHandLandmarks && res.multiHandLandmarks.length > 0) {
            const p = res.multiHandLandmarks[0][8]; // 食指
            
            // 绘制绿点
            debugCtx.fillStyle = '#00ff00';
            debugCtx.beginPath();
            debugCtx.arc(p.x * debugCanvas.width, p.y * debugCanvas.height, 5, 0, Math.PI*2);
            debugCtx.fill();
            
            // 坐标映射
            const x = (0.5 - p.x) * 35; // 镜像翻转 + 范围扩大
            const y = -(p.y - 0.5) * 25;
            handTarget.set(x, y, 0);
            
            document.getElementById('status-log').innerText = "✅ 手势追踪中...";
        } else {
            document.getElementById('status-log').innerText = "👀 请将手置于画面中央";
        }
    }
});

const cameraUtils = new window.Camera(videoEl, {
    onFrame: async () => { await hands.send({image: videoEl}); },
    width: 640, height: 480
});

// --- 8. 启动函数 ---
window.startGame = (type) => {
    currentPool = LEVELS[type];
    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('game-hud').style.display = 'block';
    
    cameraUtils.start(); // 启动摄像头
    animate();           // 启动动画
    setInterval(spawnBalloon, 1500); // 气泡生成间隔
    
    audioCtx.resume(); // 解锁音频
    TTS.speak("Ready");
};

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});