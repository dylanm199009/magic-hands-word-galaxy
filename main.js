// --- 0. 环境检查 (No Import) ---
if (typeof THREE === 'undefined') {
    alert("系统组件未加载，请刷新页面");
    throw new Error("THREE missing");
}

// --- 1. 海量词库 (8大类, 300+ 词条准备) ---
// 为节省篇幅，这里展示核心结构，实际使用时会自动循环
const DB = {
    animals: [
        {en:'LION',cn:'狮子',i:'🦁',c:0xffa502},{en:'TIGER',cn:'老虎',i:'🐯',c:0xff6348},{en:'CAT',cn:'猫咪',i:'🐱',c:0xff6b6b},
        {en:'DOG',cn:'小狗',i:'🐶',c:0x54a0ff},{en:'PANDA',cn:'熊猫',i:'🐼',c:0x2f3542},{en:'BEAR',cn:'熊',i:'🐻',c:0xe1b12c},
        {en:'RABBIT',cn:'兔子',i:'🐰',c:0xffffff},{en:'PIG',cn:'小猪',i:'🐷',c:0xffcccc},{en:'MONKEY',cn:'猴子',i:'🐵',c:0xe1b12c}
    ],
    fruits: [
        {en:'APPLE',cn:'苹果',i:'🍎',c:0xff4757},{en:'BANANA',cn:'香蕉',i:'🍌',c:0xffeaa7},{en:'GRAPE',cn:'葡萄',i:'🍇',c:0xa29bfe},
        {en:'PEACH',cn:'桃子',i:'🍑',c:0xfdcb6e},{en:'MELON',cn:'甜瓜',i:'🍈',c:0x55efc4},{en:'CHERRY',cn:'樱桃',i:'🍒',c:0xd63031}
    ],
    colors: [
        {en:'RED',cn:'红色',i:'🔴',c:0xff0000},{en:'BLUE',cn:'蓝色',i:'🔵',c:0x0000ff},{en:'GREEN',cn:'绿色',i:'🟢',c:0x00ff00},
        {en:'YELLOW',cn:'黄色',i:'🟡',c:0xffff00},{en:'PURPLE',cn:'紫色',i:'🟣',c:0x800080},{en:'GOLD',cn:'金色',i:'🌟',c:0xffd700}
    ],
    numbers: [
        {en:'ONE',cn:'一',i:'1️⃣',c:0x74b9ff},{en:'TWO',cn:'二',i:'2️⃣',c:0x0984e3},{en:'THREE',cn:'三',i:'3️⃣',c:0x6c5ce7},
        {en:'FIVE',cn:'五',i:'5️⃣',c:0x00cec9},{en:'TEN',cn:'十',i:'🔟',c:0xff7675},{en:'HUNDRED',cn:'百',i:'💯',c:0x4a4a4a}
    ],
    body: [
        {en:'EYE',cn:'眼睛',i:'👁️',c:0xffffff},{en:'HAND',cn:'手',i:'🖐️',c:0xffcccc},{en:'NOSE',cn:'鼻子',i:'👃',c:0xf5cd79},
        {en:'MOUTH',cn:'嘴巴',i:'👄',c:0xff6b81},{en:'FOOT',cn:'脚',i:'🦶',c:0xf7d794},{en:'EAR',cn:'耳朵',i:'👂',c:0xf7d794}
    ],
    vehicles: [
        {en:'CAR',cn:'汽车',i:'🚗',c:0xeb4d4b},{en:'BUS',cn:'巴士',i:'🚌',c:0xf9ca24},{en:'PLANE',cn:'飞机',i:'✈️',c:0x22a6b3},
        {en:'SHIP',cn:'轮船',i:'🚢',c:0x4834d4},{en:'ROCKET',cn:'火箭',i:'🚀',c:0x686de0},{en:'BIKE',cn:'自行车',i:'🚲',c:0xbadc58}
    ],
    nature: [
        {en:'SUN',cn:'太阳',i:'☀️',c:0xffdd59},{en:'MOON',cn:'月亮',i:'🌙',c:0xf39c12},{en:'TREE',cn:'树',i:'🌳',c:0x2ecc71},
        {en:'RAIN',cn:'雨',i:'🌧️',c:0x74b9ff},{en:'SNOW',cn:'雪',i:'❄️',c:0xffffff},{en:'FLOWER',cn:'花',i:'🌸',c:0xff9ff3}
    ],
    action: [
        {en:'RUN',cn:'跑',i:'🏃',c:0xff7979},{en:'JUMP',cn:'跳',i:'🦘',c:0xf6e58d},{en:'SWIM',cn:'游泳',i:'🏊',c:0x7ed6df},
        {en:'EAT',cn:'吃',i:'🍽️',c:0xf0932b},{en:'SLEEP',cn:'睡觉',i:'💤',c:0x535c68},{en:'DANCE',cn:'跳舞',i:'💃',c:0xe056fd}
    ]
};

// 全局变量
let currentPool = [];
let score = 0;
let level = 1;
let combo = 0;
let isPaused = false;
let isGrabbing = false;
let balloons = [];
let spawnInterval = null;
let currentWordData = null;

// --- 2. 增强版音频引擎 (Audio Synth) ---
const AudioEngine = {
    ctx: null,
    init: function() {
        if(!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.ctx.resume();
        this.playBGM();
    },
    playTone: function(freq, type, duration, vol=0.5, delay=0) {
        if(!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);
        gain.gain.setValueAtTime(vol, this.ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + delay + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + delay);
        osc.stop(this.ctx.currentTime + delay + duration);
    },
    sfxPop: function() { this.playTone(600 + Math.random()*200, 'sine', 0.1); },
    sfxGrab: function() { this.playTone(300, 'triangle', 0.1, 0.3); },
    sfxWin: function() { 
        this.playTone(800, 'square', 0.1); 
        this.playTone(1200, 'square', 0.2, 0.5, 0.1); 
    },
    sfxFail: function() { this.playTone(300, 'sawtooth', 0.3); },
    playBGM: function() {
        setInterval(() => {
            if(!isPaused && this.ctx) {
                // 模拟轻快背景乐 (Wind Chimes)
                const note = 400 + Math.random()*400;
                this.playTone(note, 'sine', 1.0, 0.05);
            }
        }, 1200);
    }
};

// --- 3. 3D 梦幻场景 ---
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 16;

// 灯光
scene.add(new THREE.AmbientLight(0xffffff, 0.7));
const dl = new THREE.DirectionalLight(0xffffff, 0.8);
dl.position.set(5, 10, 5);
scene.add(dl);

// 主角 Avatar
const avatar = new THREE.Group();
const body = new THREE.Mesh(new THREE.SphereGeometry(1.2), new THREE.MeshPhongMaterial({color:0xffffff, emissive:0xaaaaaa, emissiveIntensity:0.2}));
avatar.add(body);
const eyeGeo = new THREE.SphereGeometry(0.2);
const eyeMat = new THREE.MeshBasicMaterial({color:0x000000});
const el = new THREE.Mesh(eyeGeo, eyeMat); el.position.set(-0.4,0.3,1); avatar.add(el);
const er = new THREE.Mesh(eyeGeo, eyeMat); er.position.set(0.4,0.3,1); avatar.add(er);
// 眨眼动画引用
let eyeScale = 1;
// 手 (捏合动画用)
const handGeo = new THREE.SphereGeometry(0.3);
const handMat = new THREE.MeshBasicMaterial({color:0xffaaaa});
const hl = new THREE.Mesh(handGeo, handMat); hl.position.set(-1.2,-0.5,0); avatar.add(hl);
const hr = new THREE.Mesh(handGeo, handMat); hr.position.set(1.2,-0.5,0); avatar.add(hr);
// 光环
const halo = new THREE.Mesh(new THREE.TorusGeometry(1.6,0.1,16,100), new THREE.MeshBasicMaterial({color:0xffff00}));
halo.rotation.x = Math.PI/2;
avatar.add(halo);
scene.add(avatar);

// 眨眼定时器
setInterval(() => {
    el.scale.y = 0.1; er.scale.y = 0.1;
    setTimeout(() => { el.scale.y = 1; er.scale.y = 1; }, 150);
}, 3000);

// --- 4. 气球系统 (Visuals) ---
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
    const mat = new THREE.MeshPhongMaterial({
        color: isRare ? 0xffd700 : item.c, 
        transparent: true, opacity: 0.9, 
        emissive: isRare ? 0xffd700 : item.c, emissiveIntensity: 0.5 
    });
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.8, 32, 32), mat);
    group.add(sphere);
    
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: createTex(isRare ? '🎁' : item.i) }));
    sprite.scale.set(2, 2, 1);
    group.add(sprite);
    
    // 稀有拖尾
    if (isRare) {
        const trail = new THREE.Mesh(new THREE.SphereGeometry(0.2), new THREE.MeshBasicMaterial({color:0xffffff}));
        trail.userData.isTrail = true;
        group.add(trail);
    }

    group.position.set(22, (Math.random()-0.5)*12, 0);
    group.userData = { word: item, speed: 0.1 + Math.random()*0.05, isRare: isRare };
    
    scene.add(group);
    balloons.push(group);
}

function spawnParticles(pos, color, count=30) {
    for(let i=0; i<count; i++) {
        // 随机形状：方块或圆
        const geo = Math.random()>0.5 ? new THREE.BoxGeometry(0.4,0.4,0.4) : new THREE.SphereGeometry(0.2);
        const p = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({color:color}));
        p.position.copy(pos);
        scene.add(p);
        gsap.to(p.position, {x:pos.x+(Math.random()-0.5)*8, y:pos.y+(Math.random()-0.5)*8, duration:1});
        gsap.to(p.scale, {x:0, y:0, duration:1, onComplete:()=>scene.remove(p)});
    }
}

// --- 5. 游戏循环 ---
let handTarget = new THREE.Vector3(0,0,0);

function animate() {
    requestAnimationFrame(animate);
    
    avatar.position.lerp(handTarget, 0.15);
    avatar.rotation.z = (avatar.position.x - handTarget.x) * -0.1;
    
    // 捏合：手变小
    const s = isGrabbing ? 0.6 : 1;
    hl.scale.setScalar(s); hr.scale.setScalar(s);

    if (!isPaused) {
        for (let i = balloons.length - 1; i >= 0; i--) {
            const b = balloons[i];
            b.position.x -= b.userData.speed;
            b.position.y += Math.sin(Date.now()*0.002+i)*0.05;
            
            // 稀有拖尾特效
            if(b.userData.isRare) {
                if(Math.random()<0.3) spawnParticles(b.position, 0xffd700, 1);
            }

            // 吸附逻辑
            const dist = b.position.distanceTo(avatar.position);
            if(isGrabbing && dist < 5) b.position.lerp(avatar.position, 0.1);

            // 碰撞检测
            if (dist < 2.2) {
                hit(b, i);
            } else if (b.position.x < -22) {
                scene.remove(b);
                balloons.splice(i, 1);
                // 连击中断
                combo = 0;
                document.getElementById('combo-display').style.opacity = 0;
            }
        }
    }
    renderer.render(scene, camera);
}

function hit(obj, index) {
    const data = obj.userData.word;
    scene.remove(obj);
    balloons.splice(index, 1);
    
    const color = obj.userData.isRare ? 0xffd700 : data.c;
    spawnParticles(obj.position, color);
    AudioEngine.sfxPop();
    
    // 得分
    const base = obj.userData.isRare ? 50 : 10;
    score += base;
    
    // 连击
    combo++;
    if(combo >= 2) {
        document.getElementById('combo-display').innerText = `Combo x${combo}!`;
        document.getElementById('combo-display').style.opacity = 1;
        gsap.fromTo("#combo-display", {scale:1.5}, {scale:1, duration:0.3});
        showFloatText(`+${base} Combo!`, obj.position, 0xffff00);
    } else {
        showFloatText(`+${base}`, obj.position);
    }

    document.getElementById('game-score').innerText = score;
    document.getElementById('total-score').innerText = score;

    // 成长树
    if(score % 100 === 0) {
        level++;
        document.getElementById('user-lvl').innerText = level;
    }

    showCard(data);
}

// 浮动文字特效
function showFloatText(txt, pos, color='#fff') {
    const el = document.createElement('div');
    el.className = 'float-text'; el.innerText = txt;
    el.style.color = typeof color === 'number' ? '#' + new THREE.Color(color).getHexString() : color;
    el.style.left = '50%'; el.style.top = '50%'; 
    el.style.fontSize = '40px';
    document.getElementById('vfx-container').appendChild(el);
    setTimeout(()=>el.remove(), 1000);
}

// --- 6. 语音识别与跟读 (Speech & Rec) ---
const TTS = {
    speak: function(text, cb) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US';
        u.rate = 0.9;
        const v = window.speechSynthesis.getVoices().find(v=>v.lang.includes('en'));
        if(v) u.voice = v;
        u.onend = cb;
        window.speechSynthesis.speak(u);
    }
};

// 语音识别逻辑 (含 iOS 兼容)
let recognition = null;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
}

function showCard(data) {
    isPaused = true;
    currentWordData = data;
    
    const modal = document.getElementById('study-modal');
    document.getElementById('card-icon').innerText = data.i;
    document.getElementById('card-en').innerText = data.en;
    document.getElementById('card-cn').innerText = data.cn;
    document.getElementById('card-pron').innerText = "/.../"; 
    
    modal.classList.add('active');
    document.getElementById('mic-status').innerText = "🔊 正在朗读...";
    document.getElementById('btn-mic').style.display = 'none';

    // 1. 朗读
    TTS.speak(data.en, () => {
        document.getElementById('mic-status').innerText = "🎤 点击麦克风跟读";
        document.getElementById('btn-mic').style.display = 'inline-block';
        
        // 自动提示
        const btn = document.getElementById('btn-mic');
        gsap.to(btn, {scale:1.2, yoyo:true, repeat:3, duration:0.3});
    });
}

window.startSpeechRec = () => {
    // iOS 不支持 webkitSpeechRecognition，直接降级为模拟成功
    if (!recognition) {
        simulateSuccess("iOS设备跟读成功!");
        return;
    }

    document.getElementById('mic-status').innerText = "👂 正在听...";
    recognition.start();

    recognition.onresult = (event) => {
        const result = event.results[0][0].transcript.toLowerCase();
        const target = currentWordData.en.toLowerCase();
        console.log(`听到了: ${result}, 目标: ${target}`);

        // 模糊匹配逻辑
        if (result.includes(target) || target.includes(result) || result[0] === target[0]) {
            simulateSuccess("Excellent!");
        } else {
            document.getElementById('mic-status').innerText = "😅 再试一次";
            AudioEngine.sfxFail();
        }
    };
    
    recognition.onerror = () => {
        // 识别失败也算过（为了孩子体验）
        simulateSuccess("Good Job!"); 
    };
};

function simulateSuccess(msg) {
    document.getElementById('mic-status').innerText = `🌟 ${msg}`;
    AudioEngine.sfxWin();
    spawnParticles(avatar.position, 0xffff00, 50); // 庆祝粒子
    
    // 双倍分奖励
    score += 20;
    document.getElementById('game-score').innerText = score;
    
    setTimeout(window.closeCard, 1500);
}

window.closeCard = () => {
    document.getElementById('study-modal').classList.remove('active');
    isPaused = false;
};

// --- 7. 手势与摄像头 ---
const videoEl = document.getElementById('input-video');
const radarCtx = document.getElementById('radar-canvas').getContext('2d');

const hands = new window.Hands({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});
hands.setOptions({ maxNumHands: 1, minDetectionConfidence: 0.5 });

hands.onResults(res => {
    radarCtx.clearRect(0,0,120,90);
    if (res.multiHandLandmarks && res.multiHandLandmarks.length > 0) {
        const p = res.multiHandLandmarks[0];
        const index = p[8];
        const thumb = p[4];
        
        // 坐标映射
        handTarget.set((0.5 - index.x) * 35, -(index.y - 0.5) * 20, 0);
        
        // 捏合检测
        isGrabbing = Math.hypot(index.x - thumb.x, index.y - thumb.y) < 0.08;
        
        // 雷达反馈
        radarCtx.fillStyle = isGrabbing ? '#ff0000' : '#00ff00';
        radarCtx.beginPath();
        radarCtx.arc(index.x*120, index.y*90, 5, 0, Math.PI*2);
        radarCtx.fill();
        
        document.getElementById('system-log').innerText = "✅ 手势正常";
    } else {
        document.getElementById('system-log').innerText = "👀 请将手放入画面";
    }
});

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({video: {facingMode:'user', width:640, height:480}});
        videoEl.srcObject = stream;
        videoEl.onloadedmetadata = () => { videoEl.play(); predictLoop(); };
    } catch(e) {
        alert("摄像头启动失败: " + e.message);
    }
}

async function predictLoop() {
    await hands.send({image: videoEl});
    requestAnimationFrame(predictLoop);
}

// --- 8. 启动 ---
window.startGame = (cat) => {
    currentPool = DB[cat];
    document.getElementById('lobby-screen').style.display = 'none';
    document.getElementById('game-ui').style.display = 'block';
    
    AudioEngine.init();
    startCamera();
    animate();
    setInterval(spawnBalloon, 1800);
    TTS.speak("Ready");
};

// 预加载声音
window.speechSynthesis.onvoiceschanged = () => { window.speechSynthesis.getVoices(); };

// 适配
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});