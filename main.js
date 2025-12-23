// --- 1. 数据配置 (含稀有度) ---
const LEVELS = {
    animals: [
        { en: 'LION', cn: '狮子', icon: '🦁', color: 0xff9f43 },
        { en: 'PANDA', cn: '熊猫', icon: '🐼', color: 0x57606f },
        { en: 'CAT', cn: '猫咪', icon: '🐱', color: 0xff6b6b },
        { en: 'DOG', cn: '小狗', icon: '🐶', color: 0x54a0ff }
    ],
    food: [
        { en: 'PIZZA', cn: '披萨', icon: '🍕', color: 0xff9f43 },
        { en: 'APPLE', cn: '苹果', icon: '🍎', color: 0xff4757 },
        { en: 'DONUT', cn: '甜甜圈', icon: '🍩', color: 0xff9ff3 }
    ],
    magic: [
        { en: 'STAR', cn: '星星', icon: '⭐', color: 0xfeca57 },
        { en: 'GHOST', cn: '幽灵', icon: '👻', color: 0xffffff },
        { en: 'ALIEN', cn: '外星人', icon: '👽', color: 0x2ed573 }
    ]
};

// 当前关卡数据
let currentPool = [];
let score = 0;
let isPaused = false;

// --- 2. 3D 场景与高灵敏度配置 ---
const canvas = document.getElementById('game-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // 关键：高清

// 坐标映射范围 (根据摄像机Z轴距离计算，Z=18时，视野宽约35，高约20)
// 我们设置得稍微小一点，让手不用伸到屏幕最边缘就能控制
const VIEW_W = 32;
const VIEW_H = 18;
camera.position.z = 18;

// 灯光
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(10, 10, 10);
scene.add(dirLight);

// --- 3. 主角：大眼萌宠 (Avatar) ---
function createAvatar() {
    const group = new THREE.Group();
    
    // 身体 (发光核心)
    const body = new THREE.Mesh(
        new THREE.SphereGeometry(1.2, 32, 32),
        new THREE.MeshPhongMaterial({ 
            color: 0x00d2d3, 
            emissive: 0x00d2d3, emissiveIntensity: 0.5,
            shininess: 100
        })
    );
    group.add(body);

    // 大眼睛
    const eyeGeo = new THREE.SphereGeometry(0.35, 32, 32);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.4, 0.3, 0.9);
    const pupilL = new THREE.Mesh(new THREE.SphereGeometry(0.15), pupilMat);
    pupilL.position.z = 0.3;
    eyeL.add(pupilL);
    group.add(eyeL);

    const eyeR = eyeL.clone();
    eyeR.position.set(0.4, 0.3, 0.9);
    group.add(eyeR);

    // 光环
    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.8, 0.1, 16, 100),
        new THREE.MeshBasicMaterial({ color: 0xffff00 })
    );
    ring.rotation.x = Math.PI / 2;
    // 动画用
    ring.userData = { isRing: true }; 
    group.add(ring);

    // 点光源 (照亮周围气球)
    const light = new THREE.PointLight(0x00d2d3, 1, 10);
    group.add(light);

    return group;
}
const avatar = createAvatar();
scene.add(avatar);

// --- 4. 气球与惊喜系统 ---
const balloons = [];
const particles = [];

function createEmojiTexture(emoji) {
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

    // 随机逻辑：15% 金色，5% 彩虹，80% 普通
    const rand = Math.random();
    let type = 'normal';
    let scale = 1;
    let color = 0xffffff;
    
    if (rand > 0.95) type = 'rainbow'; // 5%
    else if (rand > 0.80) type = 'gold'; // 15%

    // 选词
    const item = currentPool[Math.floor(Math.random() * currentPool.length)];
    if (type === 'normal') color = item.color;
    if (type === 'gold') color = 0xffd700;
    if (type === 'rainbow') color = 0xffffff; // 彩虹会在update里变色

    const group = new THREE.Group();
    
    // 气球外壳
    const geo = new THREE.SphereGeometry(1.8, 32, 32);
    const mat = new THREE.MeshPhongMaterial({
        color: color,
        transparent: true, opacity: 0.9,
        emissive: color, emissiveIntensity: 0.2,
        shininess: 80
    });
    const mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);

    // 图标 (如果是彩虹气球，图标是宝箱)
    const iconChar = (type === 'rainbow') ? '🎁' : ((type === 'gold') ? '💰' : item.icon);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: createEmojiTexture(iconChar) }));
    sprite.scale.set(2, 2, 1);
    group.add(sprite);

    // 初始位置
    group.position.set(20, (Math.random()-0.5)*12, 0); // 从右飞入
    
    group.userData = { 
        word: item, 
        type: type, 
        speed: 0.1 + Math.random()*0.05,
        offset: Math.random() * 100 
    };

    scene.add(group);
    balloons.push(group);
}

// --- 5. 粒子与特效 (Juice) ---
function spawnExplosion(pos, color, count = 20) {
    for(let i=0; i<count; i++) {
        const geo = new THREE.PlaneGeometry(0.4, 0.4);
        const mat = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });
        const p = new THREE.Mesh(geo, mat);
        p.position.copy(pos);
        p.rotation.set(Math.random()*3, Math.random()*3, Math.random()*3);
        
        // 随机飞溅
        const vel = new THREE.Vector3((Math.random()-0.5)*10, (Math.random()-0.5)*10, (Math.random()-0.5)*10);
        
        scene.add(p);
        
        gsap.to(p.position, {
            x: p.position.x + vel.x,
            y: p.position.y + vel.y,
            z: p.position.z + vel.z,
            duration: 1,
            ease: "power2.out"
        });
        gsap.to(p.scale, { x:0, y:0, duration: 1, onComplete: () => scene.remove(p) });
    }
}

// 浮动文字特效
function showFloatText(text, x, y, isBig = false) {
    const div = document.createElement('div');
    div.className = 'float-text';
    div.innerText = text;
    div.style.left = (window.innerWidth/2 + x * 20) + 'px'; // 简单映射
    div.style.top = (window.innerHeight/2 - y * 20) + 'px';
    if (isBig) {
        div.style.fontSize = "80px";
        div.style.color = "#ff0000";
    }
    document.getElementById('floating-text-container').appendChild(div);
    setTimeout(() => div.remove(), 1000);
}

// 屏幕震动
function screenShake() {
    document.body.classList.add('shake');
    setTimeout(() => document.body.classList.remove('shake'), 500);
}

// --- 6. 游戏循环 ---
const clock = new THREE.Clock();
let handTarget = new THREE.Vector3(0, 0, 0);

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // 1. 主角移动 (灵敏跟随)
    // Lerp系数 0.2 -> 提高响应速度
    avatar.position.lerp(handTarget, 0.2);
    // 动态倾斜
    avatar.rotation.z = (avatar.position.x - handTarget.x) * -0.15;
    avatar.rotation.x = (avatar.position.y - handTarget.y) * 0.15;
    // 光环旋转
    avatar.children.find(c => c.userData.isRing).rotation.z -= 0.1;

    if (!isPaused) {
        // 2. 气球更新
        for (let i = balloons.length - 1; i >= 0; i--) {
            const b = balloons[i];
            
            // 移动
            b.position.x -= b.userData.speed;
            b.position.y += Math.sin(time * 3 + b.userData.offset) * 0.05; // 增加波动幅度
            
            // 彩虹气球变色
            if (b.userData.type === 'rainbow') {
                b.children[0].material.color.setHSL((time * 0.5) % 1, 1, 0.5);
            }

            // 碰撞检测 (距离 < 2.5)
            if (b.position.distanceTo(avatar.position) < 2.5) {
                hitBalloon(b, i);
            }
            // 出界
            else if (b.position.x < -20) {
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
    
    // 移除
    scene.remove(obj);
    balloons.splice(index, 1);
    
    // 特效逻辑
    if (type === 'normal') {
        score += 10;
        spawnExplosion(obj.position, data.color, 20);
        showFloatText("+10", obj.position.x, obj.position.y);
        playTone(400, 'sine');
    } else if (type === 'gold') {
        score += 50;
        spawnExplosion(obj.position, 0xffd700, 50); // 大量粒子
        showFloatText("+50 GOLD!", obj.position.x, obj.position.y, true);
        screenShake();
        playTone(600, 'square');
    } else if (type === 'rainbow') {
        score += 100;
        spawnExplosion(obj.position, 0xffffff, 100); // 巨量粒子
        showFloatText("SUPER!!", 0, 0, true);
        screenShake();
        playTone(800, 'sawtooth');
    }
    
    document.getElementById('score').innerText = score;

    // 展示卡片
    showCard(data);
}

function showCard(data) {
    isPaused = true;
    
    document.getElementById('card-icon').innerText = data.icon;
    document.getElementById('card-en').innerText = data.en;
    document.getElementById('card-cn').innerText = data.cn;
    
    const card = document.getElementById('study-card');
    card.classList.add('active');
    
    // 朗读
    const u = new SpeechSynthesisUtterance(data.en);
    u.rate = 0.8;
    // 强制使用英文语音，防止读成中文
    const voices = window.speechSynthesis.getVoices();
    const en = voices.find(v => v.lang.includes('en'));
    if(en) u.voice = en;
    window.speechSynthesis.speak(u);

    setTimeout(() => {
        card.classList.remove('active');
        isPaused = false;
    }, 2000); // 2秒后恢复，节奏更快
}

// 简单的音频合成器
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playTone(freq, type='sine') {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
}

// --- 7. 手势识别 (高灵敏度配置) ---
const hands = new window.Hands({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});
hands.setOptions({ maxNumHands: 1, minDetectionConfidence: 0.6 }); // 降低置信度以防丢帧

hands.onResults(res => {
    if (res.multiHandLandmarks && res.multiHandLandmarks.length > 0) {
        const p = res.multiHandLandmarks[0][8]; // 食指
        
        // 关键优化：坐标映射扩大 1.5 倍，确保能碰到屏幕边缘
        // 原始映射范围是 0~1，我们把它映射到 -VIEW_W/2 ~ VIEW_W/2
        // 为了提高灵敏度，我们把输入范围缩小，输出范围不变
        // 比如手只需移动到 0.8 的位置，游戏里就已经到边缘了
        const sensitiveX = (p.x - 0.5) * 1.5; 
        const sensitiveY = (p.y - 0.5) * 1.5;
        
        // 限制在最大视野范围内
        const x = Math.max(Math.min(sensitiveX, 0.6), -0.6) * VIEW_W;
        const y = -Math.max(Math.min(sensitiveY, 0.6), -0.6) * VIEW_H;
        
        handTarget.set(x, y, 0);
    }
});

const camElement = document.getElementById('cam-debug');
const cameraUtils = new window.Camera(camElement, {
    onFrame: async () => { await hands.send({image: camElement}); },
    width: 640, height: 480
});

// --- 8. 启动逻辑 ---
window.startGame = (type) => {
    currentPool = LEVELS[type];
    document.getElementById('lobby').style.display = 'none';
    document.getElementById('game-ui').style.display = 'block';
    
    // 启动
    cameraUtils.start();
    animate();
    setInterval(spawnBalloon, 1500); // 1.5秒一个，节奏加快
    
    // 声音预热
    audioCtx.resume();
    playTone(0);
};

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});