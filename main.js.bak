import * as THREE from 'three';

// --- 1. 海量词库 (Encyclopedia) ---
const DB = {
    animals: [
        {en:'LION',cn:'狮子',i:'🦁',c:0xffa502},{en:'TIGER',cn:'老虎',i:'🐯',c:0xff6348},{en:'CAT',cn:'猫咪',i:'🐱',c:0xff6b6b},
        {en:'DOG',cn:'小狗',i:'🐶',c:0x54a0ff},{en:'PANDA',cn:'熊猫',i:'🐼',c:0x2f3542},{en:'BEAR',cn:'熊',i:'🐻',c:0xe1b12c},
        {en:'RABBIT',cn:'兔子',i:'🐰',c:0xffffff},{en:'FOX',cn:'狐狸',i:'🦊',c:0xf78c6b},{en:'KOALA',cn:'考拉',i:'🐨',c:0xbb806e},
        {en:'PIG',cn:'小猪',i:'🐷',c:0xffcccc},{en:'COW',cn:'奶牛',i:'🐮',c:0xcd6133},{en:'SHEEP',cn:'绵羊',i:'🐑',c:0xf5f6fa},
        {en:'HORSE',cn:'马',i:'🐴',c:0x8d6e63},{en:'ZEBRA',cn:'斑马',i:'🦓',c:0x2f3640},{en:'GIRAFFE',cn:'长颈鹿',i:'🦒',c:0xf1c40f},
        {en:'MONKEY',cn:'猴子',i:'🐵',c:0xcc8e35},{en:'CHICKEN',cn:'小鸡',i:'🐔',c:0xf9ca24},{en:'DUCK',cn:'鸭子',i:'🦆',c:0x87d0e0},
        {en:'FROG',cn:'青蛙',i:'🐸',c:0x2ecc71},{en:'SNAKE',cn:'蛇',i:'🐍',c:0x34495e},{en:'WHALE',cn:'鲸鱼',i:'🐳',c:0x2c3e50},
        {en:'DOLPHIN',cn:'海豚',i:'🐬',c:0x3498db},{en:'FISH',cn:'鱼',i:'🐟',c:0x9b59b6},{en:'OCTOPUS',cn:'章鱼',i:'🐙',c:0xe74c3c},
        {en:'SHARK',cn:'鲨鱼',i:'🦈',c:0x95a5a6},{en:'CRAB',cn:'螃蟹',i:'🦀',c:0xe74c3c},{en:'BEE',cn:'蜜蜂',i:'🐝',c:0xf1c40f},
        {en:'BUTTERFLY',cn:'蝴蝶',i:'🦋',c:0x9b59b6},{en:'ANT',cn:'蚂蚁',i:'🐜',c:0x6c5ce7},{en:'OWL',cn:'猫头鹰',i:'🦉',c:0x636e72}
    ],
    fruits: [
        {en:'APPLE',cn:'苹果',i:'🍎',c:0xff4757},{en:'BANANA',cn:'香蕉',i:'🍌',c:0xffeaa7},{en:'GRAPE',cn:'葡萄',i:'🍇',c:0xa29bfe},
        {en:'ORANGE',cn:'橘子',i:'🍊',c:0xffa502},{en:'LEMON',cn:'柠檬',i:'🍋',c:0xfeca57},{en:'WATERMELON',cn:'西瓜',i:'🍉',c:0x2ed573},
        {en:'PEACH',cn:'桃子',i:'🍑',c:0xff9ff3},{en:'STRAWBERRY',cn:'草莓',i:'🍓',c:0xd63031},{en:'CHERRY',cn:'樱桃',i:'🍒',c:0xe17055},
        {en:'MANGO',cn:'芒果',i:'🥭',c:0xfdcb6e},{en:'PINEAPPLE',cn:'菠萝',i:'🍍',c:0xffd32a},{en:'KIWI',cn:'奇异果',i:'🥝',c:0x20bf6b},
        {en:'AVOCADO',cn:'牛油果',i:'🥑',c:0x05c46b},{en:'COCONUT',cn:'椰子',i:'🥥',c:0x40739e},{en:'PAPAYA',cn:'木瓜',i:'🥔',c:0xf0932b}
    ],
    colors: [
        {en:'RED',cn:'红色',i:'🔴',c:0xff0000},{en:'BLUE',cn:'蓝色',i:'🔵',c:0x0000ff},{en:'GREEN',cn:'绿色',i:'🟢',c:0x00ff00},
        {en:'YELLOW',cn:'黄色',i:'🟡',c:0xffff00},{en:'PURPLE',cn:'紫色',i:'🟣',c:0x800080},{en:'ORANGE',cn:'橙色',i:'🟠',c:0xffa500},
        {en:'BLACK',cn:'黑色',i:'⚫',c:0x000000},{en:'WHITE',cn:'白色',i:'⚪',c:0xffffff},{en:'BROWN',cn:'棕色',i:'🟤',c:0x8B4513},
        {en:'PINK',cn:'粉色',i:'💗',c:0xffc0cb},{en:'GREY',cn:'灰色',i:'⬜',c:0x808080},{en:'GOLD',cn:'金色',i:'🌟',c:0xdaa520}
    ],
    numbers: [
        {en:'ONE',cn:'一',i:'1️⃣',c:0x74b9ff},{en:'TWO',cn:'二',i:'2️⃣',c:0x0984e3},{en:'THREE',cn:'三',i:'3️⃣',c:0x6c5ce7},
        {en:'FOUR',cn:'四',i:'4️⃣',c:0xa29bfe},{en:'FIVE',cn:'五',i:'5️⃣',c:0x00cec9},{en:'SIX',cn:'六',i:'6️⃣',c:0xff7675},
        {en:'SEVEN',cn:'七',i:'7️⃣',c:0xfdcb6e},{en:'EIGHT',cn:'八',i:'8️⃣',c:0x6a0572},{en:'NINE',cn:'九',i:'9️⃣',c:0xab352f},
        {en:'TEN',cn:'十',i:'🔟',c:0x52b4bf},{en:'ZERO',cn:'零',i:'0️⃣',c:0x70a1ff},{en:'HUNDRED',cn:'百',i:'💯',c:0x4a4a4a}
    ],
    body: [
        {en:'EYE',cn:'眼睛',i:'👁️',c:0xffffff},{en:'EAR',cn:'耳朵',i:'👂',c:0xf7d794},{en:'HAND',cn:'手',i:'🖐️',c:0xffcccc},
        {en:'NOSE',cn:'鼻子',i:'👃',c:0xf5cd79},{en:'MOUTH',cn:'嘴巴',i:'👄',c:0xff6b81},{en:'FOOT',cn:'脚',i:'🦶',c:0xf7d794},
        {en:'ARM',cn:'手臂',i:'💪',c:0xffc107},{en:'LEG',cn:'腿',i:'🦵',c:0x9e9e9e},{en:'HEAD',cn:'头',i:'👤',c:0x607d8b},
        {en:'HAIR',cn:'头发',i:'💇',c:0x4a4a4a},{en:'FINGER',cn:'手指',i:'👆',c:0xeee8aa},{en:'TOOTH',cn:'牙齿',i:'🦷',c:0xffffff}
    ],
    vehicles: [
        {en:'CAR',cn:'汽车',i:'🚗',c:0xeb4d4b},{en:'BUS',cn:'巴士',i:'🚌',c:0xf9ca24},{en:'PLANE',cn:'飞机',i:'✈️',c:0x22a6b3},
        {en:'SHIP',cn:'轮船',i:'🚢',c:0x4834d4},{en:'BIKE',cn:'自行车',i:'🚲',c:0xbadc58},{en:'ROCKET',cn:'火箭',i:'🚀',c:0x686de0},
        {en:'TRAIN',cn:'火车',i:'🚂',c:0xbe2edd},{en:'TAXI',cn:'出租车',i:'🚕',c:0xfeca57},{en:'TRUCK',cn:'卡车',i:'🚚',c:0x303952}
    ],
    nature: [
        {en:'SUN',cn:'太阳',i:'☀️',c:0xffdd59},{en:'MOON',cn:'月亮',i:'🌙',c:0xf39c12},{en:'STAR',cn:'星星',i:'⭐',c:0xfeca57},
        {en:'CLOUD',cn:'云',i:'☁️',c:0xffffff},{en:'RAIN',cn:'雨',i:'🌧️',c:0x74b9ff},{en:'SNOW',cn:'雪',i:'❄️',c:0xffffff},
        {en:'TREE',cn:'树',i:'🌳',c:0x2ecc71},{en:'FLOWER',cn:'花',i:'🌸',c:0xff9ff3},{en:'GRASS',cn:'草',i:'🌿',c:0x00b894},
        {en:'MOUNTAIN',cn:'山',i:'⛰️',c:0x636e72},{en:'SEA',cn:'大海',i:'🌊',c:0x34ace0},{en:'RIVER',cn:'河流',i:'🏞️',c:0x48dbfb}
    ],
    action: [
        {en:'RUN',cn:'跑',i:'🏃',c:0xff7979},{en:'JUMP',cn:'跳',i:'🦘',c:0xf6e58d},{en:'SWIM',cn:'游泳',i:'🏊',c:0x7ed6df},
        {en:'DANCE',cn:'跳舞',i:'💃',c:0xe056fd},{en:'EAT',cn:'吃',i:'🍽️',c:0xf0932b},{en:'SLEEP',cn:'睡觉',i:'💤',c:0x535c68},
        {en:'READ',cn:'读',i:'📚',c:0xcc7b6d},{en:'WRITE',cn:'写',i:'✍️',c:0x778beb},{en:'SING',cn:'唱歌',i:'🎤',c:0xbadc58}
    ]
};


// --- 2. 语音合成与识别 (TTS & SpeechRecognition) ---
const TTS = {
    currentUtterance: null,
    speaker: null, // Global speaker instance
    speak: function(text, onEndCallback = null) {
        window.speechSynthesis.cancel();
        this.currentUtterance = new SpeechSynthesisUtterance(text);
        this.currentUtterance.lang = 'en-US';
        this.currentUtterance.rate = 0.9;
        
        const voices = window.speechSynthesis.getVoices();
        const enVoice = voices.find(v => v.lang.includes('en-US') && v.localService); // 优先本地声音
        if (enVoice) this.currentUtterance.voice = enVoice;

        if (onEndCallback) this.currentUtterance.onend = onEndCallback;
        window.speechSynthesis.speak(this.currentUtterance);
    }
};

const SpeechRec = {
    recognition: null,
    isAvailable: false,
    init: function() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            this.isAvailable = true;
            console.log("Speech Recognition API available.");
        } else {
            console.warn("Speech Recognition API not available on this browser.");
            document.getElementById('mic-status').innerText = "❌ 语音识别不可用";
            document.getElementById('btn-mic').style.display = 'none';
        }
    },
    start: function(onResultCallback, onEndCallback) {
        if (!this.isAvailable) return;
        this.recognition.onresult = (event) => {
            const last = event.results.length - 1;
            const transcript = event.results[last][0].transcript;
            onResultCallback(transcript);
        };
        this.recognition.onend = onEndCallback;
        this.recognition.onerror = (event) => {
            console.error("Speech Recognition Error:", event.error);
            document.getElementById('mic-status').innerText = "识别失败，请重试";
            onEndCallback(null); // 通知外部识别失败
        };
        document.getElementById('mic-status').innerText = "👂 请跟读 (20秒)";
        this.recognition.start();
        
        // 20秒超时
        setTimeout(() => {
            if (this.recognition && this.recognition.recognizing) {
                this.recognition.stop();
                document.getElementById('mic-status').innerText = "超时，请重试";
                onEndCallback(null); // 通知外部超时
            }
        }, 20000);
    },
    stop: function() {
        if (this.recognition && this.recognition.recognizing) {
            this.recognition.stop();
        }
    }
};


// --- 3. 游戏全局状态 ---
let currentCategory = 'animals';
let currentWordData = null; // 当前正在学习的单词
let wordBag = []; // 牌堆
let score = 0;
let level = 1;
let combo = 0;
let isPaused = false;
let isGrabbing = false; // 捏合手势
let grabTarget = null; // 当前被捏合的气球


// --- 4. 程序化音频引擎 (Synth Audio) ---
const AudioEngine = {
    ctx: null,
    init: function() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.playBGM(); // 启动背景环境音
    },
    playTone: function(freq, type, duration, vol=0.5, delay=0) {
        if(!this.ctx || this.ctx.state === 'suspended') return;
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
    sfxPop: function() { this.playTone(600 + Math.random()*200, 'sine', 0.1, 0.5); },
    sfxGrab: function() { this.playTone(300, 'triangle', 0.1, 0.3); }, // 抓取音
    sfxWin: function() { this.playTone(800, 'square', 0.1); this.playTone(900, 'square', 0.1, 0.8, 0.1); }, // 胜利音
    sfxCorrect: function() { this.playTone(900, 'sine', 0.2, 0.7); this.playTone(1200, 'sine', 0.2, 0.7, 0.1); },
    sfxPartial: function() { this.playTone(600, 'triangle', 0.1, 0.5); this.playTone(400, 'triangle', 0.1, 0.5, 0.1); },
    sfxError: function() { this.playTone(300, 'sawtooth', 0.3, 0.6); }, // 错误音
    playBGM: function() {
        // 模拟轻快背景音乐 (任天堂风格)
        setInterval(() => {
            if(!isPaused) {
                this.playTone(440, 'triangle', 0.3, 0.1);
                this.playTone(550, 'triangle', 0.3, 0.1, 0.3);
                this.playTone(660, 'triangle', 0.3, 0.1, 0.6);
            }
        }, 1500);
    }
};


// --- 5. 3D 场景与渲染器 ---
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
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

// --- 6. 萌宠化身 (Avatar) ---
const avatar = new THREE.Group();
const body = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), new THREE.MeshPhongMaterial({color: 0xffffff, emissive: 0xaaaaaa, emissiveIntensity: 0.2}));
avatar.add(body);
// 眼睛 (支持眨眼)
const eyeL = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.4, 4, 8), new THREE.MeshBasicMaterial({color: 0x000000}));
eyeL.position.set(-0.4, 0.2, 0.9); eyeL.rotation.z = Math.PI/2;
avatar.add(eyeL);
const eyeR = eyeL.clone(); eyeR.position.set(0.4, 0.2, 0.9); avatar.add(eyeR);
// 手
const handMat = new THREE.MeshBasicMaterial({color:0xffaaaa});
const handL = new THREE.Mesh(new THREE.SphereGeometry(0.3), handMat); handL.position.set(-1.2, -0.5, 0); avatar.add(handL);
const handR = handL.clone(); handR.position.set(1.2, -0.5, 0); avatar.add(handR);

scene.add(avatar);

// 眨眼动画
setInterval(() => {
    eyeL.scale.y = 0.1; eyeR.scale.y = 0.1;
    setTimeout(() => { eyeL.scale.y = 1; eyeR.scale.y = 1; }, 150);
}, 3000);

// --- 7. 气球系统 (Bloom & Particles) ---
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
    const item = getNextWord(); // 从牌堆取词
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
    group.userData = { word: item, speed: 0.1 + Math.random()*0.05, isRare: isRare, type: isRare ? 'rare' : 'normal' };
    
    scene.add(group);
    balloons.push(group);
}

function spawnParticles(pos, color, count=30, shape='star') {
    for(let i=0; i<count; i++) {
        let geo;
        if(shape === 'star') geo = new THREE.SphereGeometry(0.2); // 模拟星星
        else geo = new THREE.PlaneGeometry(0.3,0.3); // 彩带
        
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
        gsap.to(p.scale, {x:0, y:0, duration: 1, onComplete: () => scene.remove(p)});
    }
}

// --- 8. 游戏循环 (主逻辑) ---
let handTarget = new THREE.Vector3(0,0,0);
let lastHandPosition = new THREE.Vector3(0,0,0); // 用于计算速度
let grabAttempt = null; // 记录尝试抓取的气球
let comboTimer = null;

function animate() {
    requestAnimationFrame(animate);
    const deltaTime = 0.016; // 假设60fps

    // 1. 主角移动
    avatar.position.lerp(handTarget, 0.15); // 跟随平滑度
    avatar.rotation.z = (avatar.position.x - handTarget.x) * -0.1; // 倾斜
    avatar.children.find(c => c.userData?.rot).rotation.z -= 0.1; // 光环旋转

    // 手部姿态：捏合时手收缩
    const s = isGrabbing ? 0.5 : 1;
    handL.scale.setScalar(s); handR.scale.setScalar(s);
    handL.position.x = isGrabbing ? -0.8 : -1.2;
    handR.position.x = isGrabbing ? 0.8 : 1.2;

    if (!isPaused) {
        // 2. 气球逻辑
        for (let i = balloons.length - 1; i >= 0; i--) {
            const b = balloons[i];
            
            // 移动
            b.position.x -= b.userData.speed;
            b.position.y += Math.sin(Date.now()*0.002 + i) * 0.05; // 增加波动幅度
            b.rotation.z += 0.01; // 自转

            // 稀有气球拖尾
            if(b.userData.isRare) {
                if(Math.random() < 0.2) spawnParticles(b.position, (Math.random()*0xffffff), 1, 'point'); // 彩虹轨迹
            }

            // 接近时脉动
            const distToAvatar = b.position.distanceTo(avatar.position);
            if(distToAvatar < 6) {
                b.scale.setScalar(1 + Math.sin(Date.now()*0.005)*0.1);
                // 播放接近音效
                if(distToAvatar < 3 && !b.userData.isApproaching) {
                    AudioEngine.playTone(150, 'sawtooth', 0.5, 0.1); // 低频嗡嗡声
                    b.userData.isApproaching = true;
                }
            } else {
                b.scale.setScalar(1);
                b.userData.isApproaching = false;
            }

            // 碰撞检测 (如果捏合了，气球会吸附，否则直接击破)
            if (distToAvatar < 2.2) { // 扩大碰撞半径
                if(isGrabbing) {
                    // 气球被吸附
                    b.position.lerp(avatar.position, 0.2);
                    if(grabTarget === null) {
                        grabTarget = b;
                        AudioEngine.sfxGrab();
                    }
                } else {
                    // 直接击破
                    hitBalloon(b, i);
                }
            } else {
                if(grabTarget === b && !isGrabbing) { // 放开了捏合
                    hitBalloon(b, i);
                    grabTarget = null;
                }
            }
            
            // 出界
            if (b.position.x < -25) {
                scene.remove(b);
                balloons.splice(i, 1);
                combo = 0; // 漏掉一个，连击中断
                document.getElementById('combo-display').style.opacity = 0;
            }
        }
    }
    renderer.render(scene, camera);
}

// 击破气球
function hitBalloon(obj, index) {
    const data = obj.userData.word;
    
    scene.remove(obj);
    balloons.splice(index, 1);
    
    // 特效
    spawnParticles(obj.position, obj.userData.isRare ? 0xffd700 : data.c, 30, 'star'); // 星形粒子
    AudioEngine.sfxPop(); // 气球破裂音效
    
    // 连击奖励
    combo++;
    if(combo >= 2) {
        document.getElementById('combo-display').innerText = `⭐ Combo x${combo}!`;
        document.getElementById('combo-display').style.opacity = 1;
        gsap.fromTo("#combo-display", {scale:1.2}, {scale:1, duration:0.3});
    } else {
        document.getElementById('combo-display').style.opacity = 0;
    }

    // 显示卡片并触发跟读
    showCard(data);
}


// --- 9. 学习卡片与跟读逻辑 ---
let currentTTSWord = ""; // 当前正在跟读的单词
let recognitionTimeout = null;

function showCard(data) {
    isPaused = true;
    currentTTSWord = data.en;
    
    document.getElementById('card-icon').innerText = data.i;
    document.getElementById('card-en').innerText = data.en;
    document.getElementById('card-pron').innerText = data.pron || ''; // 确保有音标
    document.getElementById('card-cn').innerText = data.cn;
    
    const modal = document.getElementById('study-modal');
    modal.classList.add('active');
    
    // 1. 先朗读一遍
    document.getElementById('mic-status').innerText = "🔊 正在朗读单词...";
    TTS.speak(data.en, () => {
        // 2. 朗读完毕后提示跟读
        document.getElementById('mic-status').innerText = "🎤 请跟读！";
        if (SpeechRec.isAvailable) {
            document.getElementById('btn-mic').style.display = 'inline-block';
        } else {
            document.getElementById('btn-mic').style.display = 'none'; // iOS 上不可用，隐藏麦克风
            document.getElementById('mic-status').innerText = "iOS设备语音识别不可用，请点击确认。";
        }
        document.getElementById('btn-skip').style.display = 'inline-block';
    });
}

window.startSpeechRecognition = () => {
    SpeechRec.start((transcript) => {
        // 语音识别结果
        console.log("Recognized:", transcript);
        checkPronunciation(transcript);
    }, (result) => {
        // 识别结束或超时
        if (result === null) { // 超时或错误
            processSpeechResult(null);
        }
    });
};

function checkPronunciation(recognizedText) {
    const targetWord = currentTTSWord.toLowerCase();
    const recognized = recognizedText.toLowerCase();

    // 简易模糊匹配 (可替换为 Levenshtein distance 库)
    const isCorrect = recognized.includes(targetWord) || targetWord.includes(recognized);
    
    // 复杂的模糊匹配: Levenshtein distance (用于更精确的评分)
    // function levenshtein(a, b) { /* ... */ }
    // const dist = levenshtein(targetWord, recognized);
    // const accuracy = 1 - (dist / Math.max(targetWord.length, recognized.length));
    const accuracy = isCorrect ? 0.9 : 0.3; // 简单模拟准确率

    if (accuracy > 0.8) { // 完美
        score += (10 + combo * 5) * 2; // 双倍分
        document.getElementById('game-score').innerText = score;
        spawnParticles(avatar.position, 0xffd700, 50, 'star'); // 星星雨
        showFloatText(`+${(10 + combo * 5) * 2} PERFECT!`, avatar.position);
        AudioEngine.sfxCorrect();
        processSpeechResult("perfect");
    } else if (accuracy > 0.5) { // 良好
        score += (10 + combo * 5) / 2; // 半分
        document.getElementById('game-score').innerText = score;
        showFloatText(`+${(10 + combo * 5) / 2} Good!`, avatar.position);
        AudioEngine.sfxPartial();
        processSpeechResult("good");
    } else { // 错误
        showFloatText("Try Again!", avatar.position);
        AudioEngine.sfxError();
        processSpeechResult("wrong");
    }
}

function processSpeechResult(resultType) {
    const micStatus = document.getElementById('mic-status');
    if (resultType === "perfect") {
        micStatus.innerText = "🌟 完美!";
        combo++; // 连击
    } else if (resultType === "good") {
        micStatus.innerText = "👍 不错!";
        combo++;
    } else if (resultType === "wrong" || resultType === null) {
        micStatus.innerText = "😅 再试一次...";
        combo = 0; // 连击中断
        TTS.speak(currentWordData.en, () => {
             // 错误时自动重播单词，并再次启动麦克风
             micStatus.innerText = "🎤 请跟读！";
             SpeechRec.start(checkPronunciation, (res)=>processSpeechResult(res));
        });
        return; // 不关闭卡片，等待重试
    }
    document.getElementById('combo-display').style.opacity = combo >=2 ? 1 : 0;
    document.getElementById('combo-display').innerText = `⭐ Combo x${combo}!`;

    setTimeout(window.closeCard, 1500); // 1.5秒后关闭卡片
}

window.closeCard = () => {
    SpeechRec.stop(); // 停止识别
    document.getElementById('study-modal').classList.remove('active');
    isPaused = false;
    currentWordData = null;
    combo = 0; // 连击中断
    document.getElementById('combo-display').style.opacity = 0;
};


// --- 10. 系统工具 ---
// 牌堆洗牌
function refillBag() {
    wordBag = [...DB[currentCategory]];
    for (let i = wordBag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [wordBag[i], wordBag[j]] = [wordBag[j], wordBag[i]];
    }
    console.log(`Bag refilled with ${wordBag.length} words for category: ${currentCategory}`);
}
function getNextWord() {
    if (wordBag.length === 0) refillBag();
    return wordBag.pop();
}

// 显示浮动文字 (分数/COMBO)
function showFloatText(txt, pos, color = '#ffeb3b', size = '40px') {
    const el = document.createElement('div');
    el.className = 'float-text';
    el.innerText = txt;
    el.style.left = (window.innerWidth / 2 + pos.x * (window.innerWidth / 32)) + 'px'; // 映射3D到屏幕
    el.style.top = (window.innerHeight / 2 - pos.y * (window.innerHeight / 18)) + 'px';
    el.style.color = color; el.style.fontSize = size;
    document.getElementById('vfx-container').appendChild(el);
    setTimeout(() => el.remove(), 1000);
}


// --- 11. iOS 摄像头启动 ---
const videoEl = document.getElementById('input-video');
const radarCtx = document.getElementById('radar-canvas').getContext('2d');

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } } });
        videoEl.srcObject = stream;
        videoEl.onloadedmetadata = () => { videoEl.play(); predictLoop(); };
        document.getElementById('system-log').innerText = "✅ 摄像头已启动，请举起手！";
        return true;
    } catch (e) {
        console.error("Camera access denied or error:", e);
        document.getElementById('system-log').innerText = `❌ 摄像头启动失败: ${e.message}`;
        alert("请允许摄像头权限，否则无法游戏。");
        return false;
    }
}

// MediaPipe 识别循环
const hands = new window.Hands({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});
hands.setOptions({ maxNumHands: 1, minDetectionConfidence: 0.6, minTrackingConfidence: 0.5 }); // 降低置信度提高灵敏
hands.onResults(res => {
    radarCtx.clearRect(0,0,120,90);
    if (res.multiHandLandmarks && res.multiHandLandmarks.length > 0) {
        const p = res.multiHandLandmarks[0];
        const indexTip = p[8];
        const thumbTip = p[4];
        
        // 1. 手势坐标映射 (镜像翻转 + 灵敏度放大)
        handTarget.set((0.5 - indexTip.x) * 32, -(indexTip.y - 0.5) * 20, 0); // 映射到 32x20 区域

        // 2. 捏合检测
        const distPinch = Math.hypot(indexTip.x - thumbTip.x, indexTip.y - thumbTip.y);
        isGrabbing = distPinch < 0.08; // 捏合阈值
        
        // 3. 雷达显示
        radarCtx.fillStyle = isGrabbing ? '#ff0000' : '#00ff00';
        radarCtx.beginPath();
        radarCtx.arc(indexTip.x*120, indexTip.y*90, 5, 0, Math.PI*2); radarCtx.fill();
        
        document.getElementById('system-log').innerText = "✅ 手势追踪中...";
    } else {
        document.getElementById('system-log').innerText = "👀 请将手置于画面中央";
    }
});

async function predictLoop() {
    if (videoEl.readyState >= 2) { // 确保视频已加载
        await hands.send({image: videoEl});
    }
    requestAnimationFrame(predictLoop);
}


// --- 12. 启动逻辑 ---
window.startGame = async (category) => {
    currentCategory = category;
    refillBag(); // 初始化牌堆
    
    // 1. 初始化语音识别 (只做一次)
    if (!SpeechRec.recognition) SpeechRec.init();

    // 2. 启动摄像头
    const camStarted = await startCamera();
    if (!camStarted) return;

    // 3. 初始化音频引擎 (必须在用户点击后)
    AudioEngine.init();

    // 4. 界面切换
    document.getElementById('lobby-screen').style.display = 'none';
    document.getElementById('game-ui').style.display = 'block';
    
    // 5. 启动循环
    animate(); // 3D 渲染
    predictLoop(); // 手势识别帧
    setInterval(spawnBalloon, 1800); // 气球生成
};

// 响应窗口大小变化
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 加载时初始化语音合成
window.speechSynthesis.onvoiceschanged = () => { TTS.init(); };
TTS.init(); // 提前加载声音