import * as THREE from 'three';

// --- 1. 海量词库 (Encyclopedia) ---
// 每个分类至少 30 个单词
const DATABASE = {
    animals: [
        {en:'LION',cn:'狮子',i:'🦁'},{en:'TIGER',cn:'老虎',i:'🐯'},{en:'CAT',cn:'猫咪',i:'🐱'},
        {en:'DOG',cn:'小狗',i:'🐶'},{en:'PANDA',cn:'熊猫',i:'🐼'},{en:'BEAR',cn:'熊',i:'🐻'},
        {en:'RABBIT',cn:'兔子',i:'🐰'},{en:'FOX',cn:'狐狸',i:'🦊'},{en:'KOALA',cn:'考拉',i:'🐨'},
        {en:'PIG',cn:'小猪',i:'🐷'},{en:'COW',cn:'奶牛',i:'🐮'},{en:'SHEEP',cn:'绵羊',i:'🐑'},
        {en:'HORSE',cn:'马',i:'🐴'},{en:'ZEBRA',cn:'斑马',i:'🦓'},{en:'GIRAFFE',cn:'长颈鹿',i:'🦒'},
        {en:'MONKEY',cn:'猴子',i:'🐵'},{en:'CHICKEN',cn:'小鸡',i:'🐔'},{en:'DUCK',cn:'鸭子',i:'🦆'},
        {en:'FROG',cn:'青蛙',i:'🐸'},{en:'SNAKE',cn:'蛇',i:'🐍'},{en:'WHALE',cn:'鲸鱼',i:'🐳'},
        {en:'DOLPHIN',cn:'海豚',i:'🐬'},{en:'FISH',cn:'鱼',i:'🐟'},{en:'OCTOPUS',cn:'章鱼',i:'🐙'},
        {en:'SHARK',cn:'鲨鱼',i:'🦈'},{en:'CRAB',cn:'螃蟹',i:'🦀'},{en:'BEE',cn:'蜜蜂',i:'🐝'},
        {en:'BUTTERFLY',cn:'蝴蝶',i:'🦋'},{en:'ANT',cn:'蚂蚁',i:'🐜'},{en:'OWL',cn:'猫头鹰',i:'🦉'}
    ],
    food: [
        {en:'APPLE',cn:'苹果',i:'🍎'},{en:'BANANA',cn:'香蕉',i:'🍌'},{en:'GRAPE',cn:'葡萄',i:'🍇'},
        {en:'ORANGE',cn:'橘子',i:'🍊'},{en:'LEMON',cn:'柠檬',i:'🍋'},{en:'WATERMELON',cn:'西瓜',i:'🍉'},
        {en:'PEACH',cn:'桃子',i:'🍑'},{en:'STRAWBERRY',cn:'草莓',i:'🍓'},{en:'CHERRY',cn:'樱桃',i:'🍒'},
        {en:'PIZZA',cn:'披萨',i:'🍕'},{en:'BURGER',cn:'汉堡',i:'🍔'},{en:'FRIES',cn:'薯条',i:'🍟'},
        {en:'HOTDOG',cn:'热狗',i:'🌭'},{en:'SANDWICH',cn:'三明治',i:'🥪'},{en:'TACO',cn:'塔可',i:'🌮'},
        {en:'BREAD',cn:'面包',i:'🍞'},{en:'EGG',cn:'鸡蛋',i:'🥚'},{en:'CHEESE',cn:'奶酪',i:'🧀'},
        {en:'ICE CREAM',cn:'冰淇淋',i:'🍦'},{en:'CAKE',cn:'蛋糕',i:'🍰'},{en:'COOKIE',cn:'饼干',i:'🍪'},
        {en:'CHOCOLATE',cn:'巧克力',i:'🍫'},{en:'CANDY',cn:'糖果',i:'🍬'},{en:'DONUT',cn:'甜甜圈',i:'🍩'},
        {en:'MILK',cn:'牛奶',i:'🥛'},{en:'JUICE',cn:'果汁',i:'🧃'},{en:'COFFEE',cn:'咖啡',i:'☕'},
        {en:'TEA',cn:'茶',i:'🍵'},{en:'RICE',cn:'米饭',i:'🍚'},{en:'NOODLES',cn:'面条',i:'🍜'}
    ],
    daily: [
        {en:'BED',cn:'床',i:'🛏️'},{en:'CHAIR',cn:'椅子',i:'🪑'},{en:'TABLE',cn:'桌子',i:'🛋️'},
        {en:'DOOR',cn:'门',i:'🚪'},{en:'WINDOW',cn:'窗户',i:'🪟'},{en:'HOUSE',cn:'房子',i:'🏠'},
        {en:'KEY',cn:'钥匙',i:'🔑'},{en:'BOOK',cn:'书',i:'📖'},{en:'PEN',cn:'钢笔',i:'🖊️'},
        {en:'PENCIL',cn:'铅笔',i:'✏️'},{en:'BAG',cn:'书包',i:'🎒'},{en:'CLOCK',cn:'时钟',i:'⏰'},
        {en:'PHONE',cn:'手机',i:'📱'},{en:'COMPUTER',cn:'电脑',i:'💻'},{en:'TV',cn:'电视',i:'📺'},
        {en:'CAMERA',cn:'相机',i:'📷'},{en:'LIGHT',cn:'电灯',i:'💡'},{en:'BATTERY',cn:'电池',i:'🔋'},
        {en:'MONEY',cn:'钱',i:'💰'},{en:'GIFT',cn:'礼物',i:'🎁'},{en:'BALLOON',cn:'气球',i:'🎈'},
        {en:'TOY',cn:'玩具',i:'🧸'},{en:'UMBRELLA',cn:'雨伞',i:'☂️'},{en:'GLASSES',cn:'眼镜',i:'👓'},
        {en:'SHIRT',cn:'衬衫',i:'👕'},{en:'DRESS',cn:'裙子',i:'👗'},{en:'SHOE',cn:'鞋子',i:'👟'},
        {en:'HAT',cn:'帽子',i:'🧢'},{en:'SOCK',cn:'袜子',i:'🧦'},{en:'RING',cn:'戒指',i:'💍'}
    ],
    nature: [
        {en:'SUN',cn:'太阳',i:'☀️'},{en:'MOON',cn:'月亮',i:'🌙'},{en:'STAR',cn:'星星',i:'⭐'},
        {en:'CLOUD',cn:'云',i:'☁️'},{en:'RAIN',cn:'雨',i:'🌧️'},{en:'SNOW',cn:'雪',i:'❄️'},
        {en:'WIND',cn:'风',i:'💨'},{en:'FIRE',cn:'火',i:'🔥'},{en:'WATER',cn:'水',i:'💧'},
        {en:'TREE',cn:'树',i:'🌳'},{en:'FLOWER',cn:'花',i:'🌸'},{en:'GRASS',cn:'草',i:'🌿'},
        {en:'LEAF',cn:'叶子',i:'🍃'},{en:'MOUNTAIN',cn:'山',i:'⛰️'},{en:'SEA',cn:'大海',i:'🌊'},
        {en:'EARTH',cn:'地球',i:'🌍'},{en:'RAINBOW',cn:'彩虹',i:'🌈'},{en:'ROCK',cn:'石头',i:'🪨'},
        {en:'SAND',cn:'沙子',i:'🏖️'},{en:'ISLAND',cn:'岛屿',i:'🏝️'},{en:'VOLCANO',cn:'火山',i:'🌋'}
    ],
    numbers: [
        {en:'ONE',cn:'一',i:'1️⃣'},{en:'TWO',cn:'二',i:'2️⃣'},{en:'THREE',cn:'三',i:'3️⃣'},
        {en:'FOUR',cn:'四',i:'4️⃣'},{en:'FIVE',cn:'五',i:'5️⃣'},{en:'SIX',cn:'六',i:'6️⃣'},
        {en:'SEVEN',cn:'七',i:'7️⃣'},{en:'EIGHT',cn:'八',i:'8️⃣'},{en:'NINE',cn:'九',i:'9️⃣'},
        {en:'TEN',cn:'十',i:'🔟'},{en:'ZERO',cn:'零',i:'0️⃣'},{en:'PLUS',cn:'加',i:'➕'},
        {en:'MINUS',cn:'减',i:'➖'},{en:'EQUAL',cn:'等于',i:'🟰'},{en:'HUNDRED',cn:'百',i:'💯'}
    ]
};

// --- 2. 牌堆洗牌系统 (Bag Shuffle) ---
let wordBag = []; // 当前待抽取的词
let currentCategory = 'animals';

function refillBag() {
    wordBag = [...DATABASE[currentCategory]]; // 复制一份完整列表
    // Fisher-Yates 洗牌算法
    for (let i = wordBag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [wordBag[i], wordBag[j]] = [wordBag[j], wordBag[i]];
    }
    console.log(`Refilled bag with ${wordBag.length} words.`);
}

function getNextWord() {
    if (wordBag.length === 0) refillBag();
    return wordBag.pop(); // 取出一个，保证不重复
}

// --- 3. 原生摄像头调用 (iOS Fix) ---
const videoElement = document.getElementById('ios-video');

async function startNativeCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'user', // 前置摄像头
                width: { ideal: 640 },
                height: { ideal: 480 }
            }
        });
        videoElement.srcObject = stream;
        // 必须手动 play，否则 iOS 黑屏
        await videoElement.play();
        
        document.getElementById('status-log').innerText = "✅ 摄像头已启动";
        return true;
    } catch (err) {
        console.error(err);
        document.getElementById('status-log').innerText = "❌ 摄像头启动失败: " + err.message;
        alert("请允许摄像头权限，否则无法游戏。iOS用户请确保在Safari或Chrome中打开。");
        return false;
    }
}

// --- 4. 3D 场景与主角 ---
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 18;

// 环境光
scene.add(new THREE.AmbientLight(0xffffff, 0.7));
scene.add(new THREE.DirectionalLight(0xffffff, 0.8));

// 主角 (Avatar)
const avatar = new THREE.Group();
const body = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 32, 32),
    new THREE.MeshPhongMaterial({ color: 0x00a8ff, shininess: 100, emissive: 0x00a8ff, emissiveIntensity: 0.2 })
);
avatar.add(body);
// 眼睛
const eyeGeo = new THREE.SphereGeometry(0.4, 16, 16);
const eyeMat = new THREE.MeshBasicMaterial({ color: 'white' });
const pupilMat = new THREE.MeshBasicMaterial({ color: 'black' });
const eyeL = new THREE.Mesh(eyeGeo, eyeMat); eyeL.position.set(-0.5, 0.3, 1.1);
const pupL = new THREE.Mesh(new THREE.SphereGeometry(0.2), pupilMat); pupL.position.z = 0.35; eyeL.add(pupL);
avatar.add(eyeL);
const eyeR = eyeL.clone(); eyeR.position.set(0.5, 0.3, 1.1); avatar.add(eyeR);
// 光环
const ring = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.15, 16, 100), new THREE.MeshBasicMaterial({ color: 0xfbc531 }));
ring.rotation.x = Math.PI/2; ring.userData.rot = true;
avatar.add(ring);
scene.add(avatar);

// --- 5. 气球系统 ---
const balloons = [];
function createTex(emoji) {
    const cvs = document.createElement('canvas'); cvs.width = 256; cvs.height = 256;
    const ctx = cvs.getContext('2d');
    ctx.font = '160px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(emoji, 128, 140);
    return new THREE.CanvasTexture(cvs);
}

function spawnBalloon() {
    if (isPaused) return;
    const item = getNextWord(); // 使用洗牌算法获取不重复单词
    
    // 稀有度
    const r = Math.random();
    let color = 0xffffff;
    if (r > 0.95) color = 0xffd700; // 金色
    else if (r > 0.90) color = 0x00d2d3; // 青色
    else color = Math.random() * 0xffffff; // 普通随机色

    const group = new THREE.Group();
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.8, 32, 32), new THREE.MeshPhongMaterial({
        color: color, transparent: true, opacity: 0.9, shininess: 80
    }));
    group.add(sphere);
    
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: createTex(item.i) }));
    sprite.scale.set(2.2, 2.2, 1);
    group.add(sprite);

    // 适配手机屏幕：Y轴范围稍微小一点
    group.position.set(20, (Math.random()-0.5) * 8, 0);
    group.userData = { word: item, speed: 0.1 + Math.random()*0.05, type: r > 0.9 ? 'special' : 'normal' };
    
    scene.add(group);
    balloons.push(group);
}

// 爆炸特效
function boom(pos, color) {
    for(let i=0; i<15; i++) {
        const p = new THREE.Mesh(new THREE.BoxGeometry(0.5,0.5,0.5), new THREE.MeshBasicMaterial({color:color}));
        p.position.copy(pos);
        scene.add(p);
        gsap.to(p.position, {x:pos.x+(Math.random()-0.5)*8, y:pos.y+(Math.random()-0.5)*8, duration:0.8});
        gsap.to(p.scale, {x:0, y:0, z:0, duration:0.8, onComplete:()=>scene.remove(p)});
    }
}

// --- 6. 游戏循环 ---
let handX = 0, handY = 0;
let isPaused = false;
let score = 0;

function animate() {
    requestAnimationFrame(animate);
    
    // 主角移动
    avatar.position.x += (handX - avatar.position.x) * 0.15;
    avatar.position.y += (handY - avatar.position.y) * 0.15;
    avatar.rotation.z = (avatar.position.x - handX) * -0.1;
    avatar.children.find(c=>c.userData.rot).rotation.z -= 0.1;

    if (!isPaused) {
        for (let i = balloons.length - 1; i >= 0; i--) {
            const b = balloons[i];
            b.position.x -= b.userData.speed;
            
            if (b.position.distanceTo(avatar.position) < 2.5) {
                hit(b, i);
            } else if (b.position.x < -20) {
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
    
    boom(obj.position, obj.children[0].material.color);
    score += (obj.userData.type === 'special' ? 50 : 10);
    document.getElementById('score').innerText = score;
    
    showCard(data);
}

// --- 7. 发音与卡片 ---
const TTS = {
    utter: null,
    speak: function(text) {
        window.speechSynthesis.cancel();
        this.utter = new SpeechSynthesisUtterance(text);
        this.utter.lang = 'en-US';
        this.utter.rate = 0.9;
        window.speechSynthesis.speak(this.utter);
    }
};

function showCard(data) {
    isPaused = true;
    const card = document.getElementById('card-modal');
    document.getElementById('c-icon').innerText = data.i;
    document.getElementById('c-word').innerText = data.en;
    document.getElementById('c-cn').innerText = data.cn;
    
    card.classList.add('active');
    TTS.speak(data.en);
    
    setTimeout(() => {
        card.classList.remove('active');
        isPaused = false;
    }, 2000);
}

// --- 8. 手势识别 (使用循环手动处理 Video) ---
const hands = new window.Hands({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});
hands.setOptions({ maxNumHands: 1, minDetectionConfidence: 0.5 });

hands.onResults(res => {
    const radarCtx = document.getElementById('radar').getContext('2d');
    radarCtx.clearRect(0,0,100,100);
    
    if (res.multiHandLandmarks && res.multiHandLandmarks.length > 0) {
        const p = res.multiHandLandmarks[0][8]; // 食指
        
        // 雷达显示
        radarCtx.fillStyle = '#0f0'; radarCtx.beginPath();
        radarCtx.arc(p.x*100, p.y*100, 5, 0, Math.PI*2); radarCtx.fill();
        
        // 坐标转换 (适配手机比例)
        // 手机竖屏时，X轴移动范围小，Y轴大，需要调整
        const aspect = window.innerWidth / window.innerHeight;
        const rangeX = 30 * (aspect < 1 ? 0.8 : 1); // 竖屏缩小横向范围
        const rangeY = 20;

        handX = (0.5 - p.x) * rangeX * 1.5; // 镜像 + 放大
        handY = -(p.y - 0.5) * rangeY * 1.5;
    }
});

// 手动发送视频帧给 MediaPipe (解决 iOS Camera Utils 兼容性)
async function predictLoop() {
    if (videoElement.readyState >= 2) {
        await hands.send({image: videoElement});
    }
    requestAnimationFrame(predictLoop);
}

// --- 9. 全局启动 ---
window.startGame = async (cat) => {
    currentCategory = cat;
    refillBag(); // 初始化牌堆
    
    // 1. 尝试启动原生摄像头
    const success = await startNativeCamera();
    if (!success) return;

    // 2. 界面切换
    document.getElementById('lobby').style.display = 'none';
    document.getElementById('game-ui').style.display = 'block';
    
    // 3. 启动逻辑
    animate(); // 3D 渲染
    predictLoop(); // 手势识别
    setInterval(spawnBalloon, 1800);
    
    // 4. 音频解锁
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    ctx.resume();
    TTS.speak("Go");
};

// 窗口调整
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});