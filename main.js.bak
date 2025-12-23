import * as THREE from 'three';

// --- 1. 海量词库 (Encyclopedia) ---
const DB = {
    animals: [
        {en:'LION',cn:'狮子',i:'🦁',c:0xffa502},{en:'TIGER',cn:'老虎',i:'🐯',c:0xff6348},{en:'RABBIT',cn:'兔子',i:'🐰',c:0xffffff},
        {en:'PANDA',cn:'熊猫',i:'🐼',c:0x2f3542},{en:'CAT',cn:'猫咪',i:'🐱',c:0xff6b6b},{en:'DOG',cn:'小狗',i:'🐶',c:0x54a0ff},
        {en:'PIG',cn:'小猪',i:'🐷',c:0xffcccc},{en:'FROG',cn:'青蛙',i:'🐸',c:0x2ecc71},{en:'MONKEY',cn:'猴子',i:'🐵',c:0xe1b12c}
    ],
    fruits: [
        {en:'APPLE',cn:'苹果',i:'🍎',c:0xff4757},{en:'BANANA',cn:'香蕉',i:'🍌',c:0xffeaa7},{en:'GRAPE',cn:'葡萄',i:'🍇',c:0xa29bfe},
        {en:'PEACH',cn:'桃子',i:'🍑',c:0xfdcb6e},{en:'MELON',cn:'甜瓜',i:'🍈',c:0x55efc4},{en:'CHERRY',cn:'樱桃',i:'🍒',c:0xd63031}
    ],
    colors: [
        {en:'RED',cn:'红色',i:'🔴',c:0xff0000},{en:'BLUE',cn:'蓝色',i:'🔵',c:0x0000ff},{en:'GREEN',cn:'绿色',i:'🟢',c:0x00ff00},
        {en:'YELLOW',cn:'黄色',i:'🟡',c:0xffff00},{en:'PURPLE',cn:'紫色',i:'🟣',c:0x800080},{en:'ORANGE',cn:'橙色',i:'🟠',c:0xffa500}
    ],
    numbers: [
        {en:'ONE',cn:'一',i:'1️⃣',c:0x74b9ff},{en:'TWO',cn:'二',i:'2️⃣',c:0x0984e3},{en:'THREE',cn:'三',i:'3️⃣',c:0x6c5ce7},
        {en:'FOUR',cn:'四',i:'4️⃣',c:0xa29bfe},{en:'FIVE',cn:'五',i:'5️⃣',c:0x00cec9},{en:'TEN',cn:'十',i:'🔟',c:0xff7675}
    ],
    body: [
        {en:'EYE',cn:'眼睛',i:'👁️',c:0xffffff},{en:'EAR',cn:'耳朵',i:'👂',c:0xf7d794},{en:'HAND',cn:'手',i:'🖐️',c:0xffcccc},
        {en:'NOSE',cn:'鼻子',i:'👃',c:0xf5cd79},{en:'MOUTH',cn:'嘴巴',i:'👄',c:0xff6b81},{en:'FOOT',cn:'脚',i:'🦶',c:0xf7d794}
    ],
    vehicles: [
        {en:'CAR',cn:'汽车',i:'🚗',c:0xeb4d4b},{en:'BUS',cn:'巴士',i:'🚌',c:0xf9ca24},{en:'PLANE',cn:'飞机',i:'✈️',c:0x22a6b3},
        {en:'SHIP',cn:'轮船',i:'🚢',c:0x4834d4},{en:'BIKE',cn:'自行车',i:'🚲',c:0xbadc58},{en:'ROCKET',cn:'火箭',i:'🚀',c:0x686de0}
    ],
    nature: [
        {en:'SUN',cn:'太阳',i:'☀️',c:0xffdd59},{en:'MOON',cn:'月亮',i:'🌙',c:0xf39c12},{en:'TREE',cn:'树',i:'🌳',c:0x2ecc71},
        {en:'FLOWER',cn:'花',i:'🌸',c:0xff9ff3},{en:'RAIN',cn:'雨',i:'🌧️',c:0x74b9ff},{en:'SNOW',cn:'雪',i:'❄️',c:0xffffff}
    ],
    action: [
        {en:'RUN',cn:'跑',i:'🏃',c:0xff7979},{en:'JUMP',cn:'跳',i:'🦘',c:0xf6e58d},{en:'SWIM',cn:'游泳',i:'🏊',c:0x7ed6df},
        {en:'DANCE',cn:'跳舞',i:'💃',c:0xe056fd},{en:'EAT',cn:'吃',i:'🍽️',c:0xf0932b},{en:'SLEEP',cn:'睡觉',i:'💤',c:0x535c68}
    ]
};

// 全局状态
let currentPool = [];
let score = 0;
let level = 1;
let combo = 0;
let isPaused = false;
let isGrabbing = false; // 捏合状态

// --- 2. 程序化音频引擎 (Audio Synth) ---
// 不需要下载任何文件，代码生成 8-bit 可爱音效
const AudioEngine = {
    ctx: null,
    init: function() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.playBGM(); // 启动背景环境音
    },
    playTone: function(freq, type, duration, vol=0.5) {
        if(!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },
    sfxPop: function() { this.playTone(600 + Math.random()*200, 'sine', 0.1, 0.5); },
    sfxGrab: function() { this.playTone(300, 'triangle', 0.1, 0.3); },
    sfxWin: function() { 
        [0, 0.1, 0.2].forEach((t,i) => setTimeout(() => this.playTone(800+i*100, 'square', 0.3, 0.3), t*1000)); 
    },
    playBGM: function() {
        // 简单的环境风铃
        setInterval(() => {
            if(!isPaused) this.playTone(800 + Math.random()*400, 'sine', 1.5, 0.05);
        }, 3000);
    }
};

// --- 3. 3D 梦幻场景 ---
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 16;

// 场景装饰：梦幻草地 (InstancedMesh)
const grassGeo = new THREE.ConeGeometry(0.1, 0.5, 3);
const grassMat = new THREE.MeshBasicMaterial({ color: 0x55efc4 });
const grass = new THREE.InstancedMesh(grassGeo, grassMat, 200);
const dummy = new THREE.Object3D();
for(let i=0; i<200; i++) {
    dummy.position.set((Math.random()-0.5)*30, -10 + Math.random()*2, (Math.random()-0.5)*10);
    dummy.rotation.z = (Math.random()-0.5)*0.5;
    dummy.scale.setScalar(0.5 + Math.random());
    dummy.updateMatrix();
    grass.setMatrixAt(i, dummy.matrix);
}
scene.add(grass);

// 灯光
const ambLight = new THREE.AmbientLight(0xffffff, 0.8);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(5, 10, 5);
scene.add(ambLight);
scene.add(dirLight);

// --- 4. 萌宠化身 (Avatar) ---
const avatar = new THREE.Group();
// 身体
const body = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), new THREE.MeshPhongMaterial({color: 0xffffff, emissive: 0xaaaaaa, emissiveIntensity: 0.2}));
avatar.add(body);
// 眼睛 (支持眨眼)
const eyeL = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.4, 4, 8), new THREE.MeshBasicMaterial({color: 0x000000}));
eyeL.position.set(-0.4, 0.2, 0.9); eyeL.rotation.z = Math.PI/2;
avatar.add(eyeL);
const eyeR = eyeL.clone(); eyeR.position.set(0.4, 0.2, 0.9); avatar.add(eyeR);
// 手
const handGeo = new THREE.SphereGeometry(0.3);
const handL = new THREE.Mesh(handGeo, new THREE.MeshBasicMaterial({color:0xffaaaa}));
handL.position.set(-1.2, -0.5, 0);
avatar.add(handL);
const handR = handL.clone(); handR.position.set(1.2, -0.5, 0);
avatar.add(handR);

scene.add(avatar);

// 眨眼动画
setInterval(() => {
    eyeL.scale.y = 0.1; eyeR.scale.y = 0.1;
    setTimeout(() => { eyeL.scale.y = 1; eyeR.scale.y = 1; }, 150);
}, 3000);

// --- 5. 气球系统 (Bloom & Particles) ---
const balloons = [];
const particles = [];

function createTex(emoji) {
    const cvs = document.createElement('canvas'); cvs.width = 256; cvs.height = 256;
    const ctx = cvs.getContext('2d');
    ctx.font = '160px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(emoji, 128, 140);
    return new THREE.CanvasTexture(cvs);
}

function spawnBalloon() {
    if (isPaused) return;
    const item = currentPool[Math.floor(Math.random() * currentPool.length)];
    const isRare = Math.random() > 0.9;
    
    const group = new THREE.Group();
    // 气球发光材质
    const color = isRare ? 0xffd700 : item.c;
    const mat = new THREE.MeshPhongMaterial({ 
        color: color, transparent: true, opacity: 0.9,
        emissive: color, emissiveIntensity: 0.5, // 模拟 Bloom
        shininess: 100
    });
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.8, 32, 32), mat);
    group.add(sphere);
    
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: createTex(isRare ? '🎁' : item.i) }));
    sprite.scale.set(2, 2, 1);
    group.add(sprite);

    group.position.set(25, (Math.random()-0.5)*12, 0); // 宽屏幕适应
    group.userData = { word: item, speed: 0.1 + Math.random()*0.05, isRare: isRare };
    
    scene.add(group);
    balloons.push(group);
}

function spawnParticles(pos, color) {
    for(let i=0; i<30; i++) {
        const geo = Math.random()>0.5 ? new THREE.PlaneGeometry(0.3,0.3) : new THREE.SphereGeometry(0.2);
        const mat = new THREE.MeshBasicMaterial({color:color, side:THREE.DoubleSide});
        const p = new THREE.Mesh(geo, mat);
        p.position.copy(pos);
        p.rotation.set(Math.random()*3,0,0);
        scene.add(p);
        
        gsap.to(p.position, {
            x: pos.x + (Math.random()-0.5)*8,
            y: pos.y + (Math.random()-0.5)*8,
            duration: 1, ease: "power2.out"
        });
        gsap.to(p.scale, {x:0, y:0, duration: 1, onComplete:()=>scene.remove(p)});
    }
}

// --- 6. 游戏循环 (主逻辑) ---
let handTarget = new THREE.Vector3(0,0,0);

function animate() {
    requestAnimationFrame(animate);
    
    // 主角移动
    avatar.position.lerp(handTarget, 0.15);
    avatar.rotation.z = (avatar.position.x - handTarget.x) * -0.1;
    
    // 捏合动画：如果抓取，手变小
    const s = isGrabbing ? 0.5 : 1;
    handL.scale.setScalar(s); handR.scale.setScalar(s);

    if (!isPaused) {
        // 背景草地移动
        grass.position.x -= 0.05;
        if(grass.position.x < -10) grass.position.x = 0;

        for (let i = balloons.length - 1; i >= 0; i--) {
            const b = balloons[i];
            b.position.x -= b.userData.speed;
            b.position.y += Math.sin(Date.now()*0.002 + i)*0.03;

            // 磁力吸附：如果手靠近且处于“抓取”状态
            const dist = b.position.distanceTo(avatar.position);
            if(dist < 5 && isGrabbing) {
                b.position.lerp(avatar.position, 0.1); // 被吸过来
            }

            // 碰撞
            if (dist < 2.2) {
                if(isGrabbing) {
                    hit(b, i); // 只有捏合才能抓破！(或者改成只要碰就破，捏合是加分，为了孩子简单起见，这里设为碰就破)
                } else {
                    hit(b, i); // 简化：碰就破，捏合只是特效
                }
            } else if (b.position.x < -25) {
                scene.remove(b);
                balloons.splice(i, 1);
            }
        }
    }
    renderer.render(scene, camera);
}

function hit(obj, index) {
    const data = obj.userData.word;
    scene.remove(obj);
    balloons.splice(index, 1);
    
    spawnParticles(obj.position, obj.userData.isRare ? 0xffd700 : data.c);
    AudioEngine.sfxPop();
    
    // 分数逻辑
    const pts = obj.userData.isRare ? 50 : 10;
    score += pts;
    document.getElementById('game-score').innerText = score;
    showFloatText(`+${pts}`, obj.position);
    
    // 成长树逻辑
    document.getElementById('total-score').innerText = score;
    if(score % 100 === 0) {
        level++;
        document.getElementById('user-lvl').innerText = level;
        document.getElementById('magic-tree').style.transform = `scale(${1 + level*0.1})`;
        AudioEngine.sfxWin();
    }

    showCard(data);
}

function showFloatText(txt, pos) {
    const el = document.createElement('div');
    el.className = 'float-text'; el.innerText = txt;
    el.style.left = '50%'; el.style.top = '50%'; // 简化定位
    el.style.color = '#ffeb3b'; el.style.fontSize = '40px'; el.style.position = 'absolute';
    el.style.animation = 'floatUp 1s forwards';
    document.getElementById('vfx-container').appendChild(el);
    setTimeout(()=>el.remove(), 1000);
}

// --- 7. 教育与语音 ---
const TTS = {
    speak: function(text) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US';
        const v = window.speechSynthesis.getVoices().find(v=>v.lang.includes('en'));
        if(v) u.voice = v;
        window.speechSynthesis.speak(u);
    }
};

let currentWord = "";
function showCard(data) {
    isPaused = true;
    currentWord = data.en;
    document.getElementById('card-icon').innerText = data.i;
    document.getElementById('card-en').innerText = data.en;
    document.getElementById('card-cn').innerText = data.cn;
    
    const modal = document.getElementById('study-modal');
    modal.classList.add('active');
    
    TTS.speak(data.en);
    // iOS 不支持自动语音识别，所以这里只做展示，2.5秒后自动关闭
    // 或者用户点击麦克风假装跟读
}

window.startSpeech = () => {
    // 模拟识别成功
    document.getElementById('mic-status').innerText = "👂 听到了...";
    setTimeout(() => {
        document.getElementById('mic-status').innerText = "🌟 Great Job!";
        AudioEngine.sfxWin();
        setTimeout(window.closeCard, 1000);
    }, 1000);
};

window.closeCard = () => {
    document.getElementById('study-modal').classList.remove('active');
    isPaused = false;
};

// --- 8. 手势识别 (iOS 修复版) ---
const videoEl = document.getElementById('input-video');
const radarCtx = document.getElementById('radar-canvas').getContext('2d');

const hands = new window.Hands({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});
hands.setOptions({ maxNumHands: 1, minDetectionConfidence: 0.5 });

hands.onResults(res => {
    radarCtx.clearRect(0,0,120,90);
    if (res.multiHandLandmarks && res.multiHandLandmarks.length > 0) {
        const p = res.multiHandLandmarks[0];
        const indexTip = p[8];
        const thumbTip = p[4];
        
        // 1. 计算坐标 (镜像翻转)
        // 扩大映射范围：(0.5 - x) * 35 -> 这样手在屏幕中间就能覆盖 3D 世界大部分
        handTarget.set((0.5 - indexTip.x) * 35, -(indexTip.y - 0.5) * 20, 0);

        // 2. 捏合检测 (Pinch)
        const dist = Math.hypot(indexTip.x - thumbTip.x, indexTip.y - thumbTip.y);
        isGrabbing = dist < 0.05;

        // 3. 雷达显示
        radarCtx.fillStyle = isGrabbing ? '#ff0000' : '#00ff00';
        radarCtx.beginPath();
        radarCtx.arc(indexTip.x*120, indexTip.y*90, 5, 0, Math.PI*2);
        radarCtx.fill();
        
        document.getElementById('system-log').innerText = "✅ 追踪中";
    } else {
        document.getElementById('system-log').innerText = "👀 寻找手势...";
    }
});

// 原生 iOS 摄像头启动
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: 640, height: 480 }
        });
        videoEl.srcObject = stream;
        videoEl.onloadedmetadata = () => {
            videoEl.play();
            predict();
        };
    } catch(e) {
        alert("摄像头启动失败: " + e);
    }
}

async function predict() {
    await hands.send({image: videoEl});
    requestAnimationFrame(predict);
}

// --- 9. 启动逻辑 ---
window.startGame = (cat) => {
    currentPool = DB[cat];
    document.getElementById('lobby-screen').style.display = 'none';
    document.getElementById('game-ui').style.display = 'block';
    
    AudioEngine.init(); // 启动音频
    startCamera();      // 启动相机
    
    function loop() {
        animate();
        requestAnimationFrame(loop);
    }
    animate();
    setInterval(spawnBalloon, 1800);
};

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});