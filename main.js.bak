// --- 1. 海量词库数据库 (Categories) ---
const WORD_DB = {
    animals: [
        { en: 'LION', cn: '狮子', icon: '🦁', pron: '/ˈlaɪ.ən/', color: 0xffa502 },
        { en: 'TIGER', cn: '老虎', icon: '🐯', pron: '/ˈtaɪ.ɡər/', color: 0xff6348 },
        { en: 'RABBIT', cn: '兔子', icon: '🐰', pron: '/ˈræb.ɪt/', color: 0xffffff },
        { en: 'PANDA', cn: '熊猫', icon: '🐼', pron: '/ˈpæn.də/', color: 0x2f3542 },
        { en: 'MONKEY', cn: '猴子', icon: '🐵', pron: '/ˈmʌŋ.ki/', color: 0xe1b12c },
        { en: 'ELEPHANT', cn: '大象', icon: '🐘', pron: '/ˈel.ɪ.fənt/', color: 0xa4b0be }
    ],
    food: [
        { en: 'BURGER', cn: '汉堡', icon: '🍔', pron: '/ˈbɜː.ɡər/', color: 0xff9f43 },
        { en: 'PIZZA', cn: '披萨', icon: '🍕', pron: '/ˈpiːt.sə/', color: 0xff6b6b },
        { en: 'APPLE', cn: '苹果', icon: '🍎', pron: '/ˈæp.əl/', color: 0xff4757 },
        { en: 'ICE CREAM', cn: '冰淇淋', icon: '🍦', pron: '/ˈaɪs ˌkriːm/', color: 0x70a1ff },
        { en: 'CAKE', cn: '蛋糕', icon: '🍰', pron: '/keɪk/', color: 0xffcccc }
    ],
    vehicles: [
        { en: 'CAR', cn: '汽车', icon: '🚗', pron: '/kɑːr/', color: 0x3742fa },
        { en: 'BUS', cn: '巴士', icon: '🚌', pron: '/bʌs/', color: 0xffa502 },
        { en: 'ROCKET', cn: '火箭', icon: '🚀', pron: '/ˈrɑː.kɪt/', color: 0x5352ed },
        { en: 'PLANE', cn: '飞机', icon: '✈️', pron: '/pleɪn/', color: 0x1e90ff },
        { en: 'SHIP', cn: '轮船', icon: '🚢', pron: '/ʃɪp/', color: 0x2ed573 }
    ],
    nature: [
        { en: 'SUN', cn: '太阳', icon: '☀️', pron: '/sʌn/', color: 0xffdd59 },
        { en: 'MOON', cn: '月亮', icon: '🌙', pron: '/muːn/', color: 0xf39c12 },
        { en: 'TREE', cn: '大树', icon: '🌳', pron: '/triː/', color: 0x2ecc71 },
        { en: 'FLOWER', cn: '花朵', icon: '🌸', pron: '/ˈflaʊ.ər/', color: 0xff9ff3 },
        { en: 'RAIN', cn: '下雨', icon: '🌧️', pron: '/reɪn/', color: 0x74b9ff }
    ]
};

// 当前游戏数据
let currentLevelData = [];
let score = 0;
let isPaused = false;

// --- 2. 语音引擎管理器 (Fix TTS) ---
const TTS = {
    voices: [],
    init: function() {
        window.speechSynthesis.onvoiceschanged = () => {
            this.voices = window.speechSynthesis.getVoices();
        };
        this.voices = window.speechSynthesis.getVoices();
    },
    speak: function(text) {
        window.speechSynthesis.cancel(); // 停止上一个
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 0.9;
        // 尝试寻找英语声音
        const enVoice = this.voices.find(v => v.lang.includes('en-US') || v.lang.includes('en-GB'));
        if (enVoice) u.voice = enVoice;
        window.speechSynthesis.speak(u);
    }
};
TTS.init();

// --- 3. 3D 场景核心 ---
const canvas = document.getElementById('game-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
camera.position.z = 16; // 稍微拉远一点视野

// 3A 灯光
scene.add(new THREE.AmbientLight(0xffffff, 0.7));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

// --- 4. 可爱化身系统 (Cute Avatar) ---
// 我们用代码画一个“大眼萌飞船”
function createAvatar() {
    const group = new THREE.Group();

    // 身体 (白色圆球)
    const bodyGeo = new THREE.SphereGeometry(1, 32, 32);
    const bodyMat = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 100 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);

    // 眼睛 (两个黑色小球)
    const eyeGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.35, 0.1, 0.85);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(0.35, 0.1, 0.85);
    group.add(eyeL);
    group.add(eyeR);

    // 腮红 (粉色)
    const blushGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const blushMat = new THREE.MeshBasicMaterial({ color: 0xff9ff3 });
    const blushL = new THREE.Mesh(blushGeo, blushMat);
    blushL.position.set(-0.6, -0.1, 0.75);
    const blushR = new THREE.Mesh(blushGeo, blushMat);
    blushR.position.set(0.6, -0.1, 0.75);
    group.add(blushL);
    group.add(blushR);

    // 头顶螺旋桨
    const propGeo = new THREE.BoxGeometry(2.5, 0.1, 0.2);
    const propMat = new THREE.MeshBasicMaterial({ color: 0xffdd59 });
    const prop = new THREE.Mesh(propGeo, propMat);
    prop.position.y = 1.1;
    prop.userData = { isProp: true }; // 标记一下方便旋转
    group.add(prop);

    // 底部喷射口
    const jetGeo = new THREE.CylinderGeometry(0.4, 0.6, 0.5, 16);
    const jetMat = new THREE.MeshBasicMaterial({ color: 0x7f8c8d });
    const jet = new THREE.Mesh(jetGeo, jetMat);
    jet.position.y = -0.8;
    group.add(jet);

    return group;
}

const avatar = createAvatar();
scene.add(avatar); // 默认在场景中

// --- 5. 气球与游戏逻辑 ---
const balloons = [];
const particles = [];

// 创建 Emoji 贴图
function createEmojiTexture(emoji) {
    const cvs = document.createElement('canvas');
    cvs.width = 256; cvs.height = 256;
    const ctx = cvs.getContext('2d');
    ctx.font = '180px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, 128, 140);
    return new THREE.CanvasTexture(cvs);
}

function spawnBalloon() {
    if (isPaused) return;

    // 从当前关卡数据随机选
    const item = currentLevelData[Math.floor(Math.random() * currentLevelData.length)];
    
    const group = new THREE.Group();
    
    // 彩色外壳
    const geo = new THREE.SphereGeometry(1.6, 32, 32);
    const mat = new THREE.MeshPhongMaterial({ 
        color: item.color, 
        transparent: true, opacity: 0.8, shininess: 80,
        emissive: item.color, emissiveIntensity: 0.3
    });
    const sphere = new THREE.Mesh(geo, mat);
    group.add(sphere);

    // 内部图标
    const spriteMap = createEmojiTexture(item.icon);
    const spriteMat = new THREE.SpriteMaterial({ map: spriteMap });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(2, 2, 1);
    group.add(sprite);

    // 初始位置
    group.position.set(18, (Math.random()-0.5)*10, 0); // 从右边飞入
    group.userData = { word: item, speed: 0.08 + Math.random()*0.05 };

    scene.add(group);
    balloons.push(group);
}

// 粒子特效
function spawnParticles(pos, color) {
    for(let i=0; i<20; i++) {
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.3, 0.3),
            new THREE.MeshBasicMaterial({ color: color })
        );
        mesh.position.copy(pos);
        mesh.rotation.set(Math.random(), Math.random(), Math.random());
        
        // 随机炸开
        gsap.to(mesh.position, {
            x: pos.x + (Math.random()-0.5) * 6,
            y: pos.y + (Math.random()-0.5) * 6,
            duration: 1
        });
        gsap.to(mesh.scale, { x:0, y:0, z:0, duration: 1, onComplete: () => scene.remove(mesh) });
        scene.add(mesh);
    }
}

// --- 6. 核心循环 ---
const clock = new THREE.Clock();
let handPos = new THREE.Vector3(0, -20, 0); // 初始在屏幕下

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // 1. 化身逻辑 (Avatar Logic)
    // Lerp 平滑跟随
    avatar.position.lerp(handPos, 0.15);
    // 螺旋桨旋转
    avatar.children.find(c => c.userData.isProp).rotation.y += 0.3;
    // 身体根据移动方向轻微倾斜
    avatar.rotation.z = (avatar.position.x - handPos.x) * -0.1;
    avatar.rotation.x = (avatar.position.y - handPos.y) * 0.1;
    // 悬浮呼吸感
    avatar.position.y += Math.sin(time * 5) * 0.02;

    if (!isPaused) {
        // 2. 气球逻辑
        for (let i = balloons.length - 1; i >= 0; i--) {
            const b = balloons[i];
            
            // 向左飞
            b.position.x -= b.userData.speed;
            // 上下浮动
            b.position.y += Math.sin(time*2 + i) * 0.03;

            // 碰撞检测 (Avatar 半径约 1.2, 气球半径 1.6)
            if (b.position.distanceTo(avatar.position) < 2.5) {
                popBalloon(b, i);
            }
            // 出界
            else if (b.position.x < -18) {
                scene.remove(b);
                balloons.splice(i, 1);
            }
        }
    }
    
    renderer.render(scene, camera);
}

function popBalloon(obj, index) {
    const data = obj.userData.word;
    
    // 视觉消除
    scene.remove(obj);
    balloons.splice(index, 1);
    
    // 特效
    spawnParticles(obj.position, data.color);
    
    // 音效 (简单的合成音)
    playTone(400 + Math.random()*200);

    // 展示卡片
    showCard(data);
}

function showCard(data) {
    isPaused = true;
    score += 10;
    document.getElementById('score').innerText = score;

    // UI 更新
    document.getElementById('c-icon').innerText = data.icon;
    document.getElementById('c-en').innerText = data.en;
    document.getElementById('c-cn').innerText = data.cn;
    document.getElementById('c-pron').innerText = data.pron;

    const popup = document.getElementById('card-popup');
    popup.classList.add('show');

    // 发音
    TTS.speak(data.en);

    setTimeout(() => {
        popup.classList.remove('show');
        isPaused = false;
    }, 2500);
}

function playTone(freq) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
}


// --- 7. 手势识别 ---
const hands = new window.Hands({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});
hands.setOptions({ maxNumHands: 1, minDetectionConfidence: 0.7 });
hands.onResults(res => {
    document.getElementById('cam-status').innerText = "✅ 摄像头已就绪，请举起手！";
    if (res.multiHandLandmarks && res.multiHandLandmarks.length > 0) {
        const p = res.multiHandLandmarks[0][8]; // 食指
        // 坐标映射
        const x = (p.x - 0.5) * 30; // 扩大范围
        const y = -(p.y - 0.5) * 20;
        handPos.set(x, y, 0);
    }
});

const camElement = document.getElementById('cam-feed');
const cameraUtils = new window.Camera(camElement, {
    onFrame: async () => { await hands.send({image: camElement}); },
    width: 640, height: 480
});

// --- 8. 全局控制 ---

// 供 HTML 按钮调用
window.selectLevel = (category) => {
    // 1. 设置数据
    currentLevelData = WORD_DB[category];
    console.log("Category selected:", category);

    // 2. 界面切换
    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('game-hud').style.display = 'block';

    // 3. 启动引擎
    cameraUtils.start();
    animate();
    setInterval(spawnBalloon, 2000);

    // 4. 激活音频上下文 (解决发音问题)
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    ctx.resume();
    TTS.speak("Ready Go"); // 预热
};

// 响应式调整
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});