// --- 0. 环境检查 ---
if (typeof THREE === 'undefined') { console.error("Three.js missed!"); }

// --- 1. 词库 (Emoji + 颜色) ---
const DATA = [
    { en: 'APPLE', cn: '苹果', icon: '🍎', color: 0xff6b6b }, // 红
    { en: 'BANANA', cn: '香蕉', icon: '🍌', color: 0xfeca57 }, // 黄
    { en: 'GRAPE', cn: '葡萄', icon: '🍇', color: 0xa29bfe }, // 紫
    { en: 'TREE', cn: '大树', icon: '🌳', color: 0x1dd1a1 }, // 绿
    { en: 'CAR', cn: '汽车', icon: '🚗', color: 0x54a0ff }, // 蓝
    { en: 'BEAR', cn: '小熊', icon: '🐻', color: 0xc8d6e5 }  // 白
];

// --- 2. 场景构建 ---
const canvas = document.getElementById('game-canvas');
const scene = new THREE.Scene();
// 注意：不设置 scene.background，让它透视到 CSS 的彩虹背景
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true }); // alpha: true 很关键
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
camera.position.z = 14;

// 灯光 (让颜色鲜艳)
scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

// --- 3. 辅助：Emoji 转 Sprite 贴图 ---
function createIconSprite(emoji) {
    const cvs = document.createElement('canvas');
    cvs.width = 256; cvs.height = 256;
    const ctx = cvs.getContext('2d');
    ctx.font = '200px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, 128, 140);
    const tex = new THREE.CanvasTexture(cvs);
    const mat = new THREE.SpriteMaterial({ map: tex });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(1.8, 1.8, 1); // 图标大一点
    return sprite;
}

// --- 4. 气球生成逻辑 ---
const balloons = [];
let isPaused = false;

function spawnBalloon() {
    if (isPaused) return;

    const item = DATA[Math.floor(Math.random() * DATA.length)];
    const group = new THREE.Group();

    // 气球本体：使用高亮 Phong 材质，像糖果
    const geo = new THREE.SphereGeometry(1.5, 32, 32);
    const mat = new THREE.MeshPhongMaterial({
        color: item.color,
        emissive: item.color,      // 自发光，防止变黑
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.8,              // 半透明，能看到里面
        shininess: 100
    });
    const sphere = new THREE.Mesh(geo, mat);
    group.add(sphere);

    // 内部图标 (Sprite)
    const icon = createIconSprite(item.icon);
    group.add(icon);

    // 气球绳子 (Line)
    const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,-1.5,0), new THREE.Vector3(0,-2.5,0)]);
    const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff });
    const line = new THREE.Line(lineGeo, lineMat);
    group.add(line);

    // 初始位置 (屏幕下方飞上来，或者右边飞过来，这里选右边飞)
    group.position.set(15, (Math.random()-0.5)*8, 0);
    group.userData = { word: item, speed: 0.05 + Math.random()*0.05 };

    scene.add(group);
    balloons.push(group);
}

// --- 5. 手势光标 (改成可爱的大手) ---
const cursorGroup = new THREE.Group();
// 光标本体
const handIcon = createIconSprite('🖐️'); // 使用手掌 Emoji
handIcon.scale.set(2, 2, 1);
cursorGroup.add(handIcon);

// 彩虹拖尾 (简单的圆圈跟随)
const trails = [];
for(let i=0; i<5; i++) {
    const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.2 - i*0.03, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff }) // 彩色在动画里变
    );
    scene.add(mesh);
    trails.push(mesh);
}
scene.add(cursorGroup);

// --- 6. 打击乐音效 (Web Audio API) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playMarimba(noteFreq) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(noteFreq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5); // 快速衰减，像敲击
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
}

// --- 7. 动画循环 ---
const clock = new THREE.Clock();
let handPos = new THREE.Vector3(12, 0, 0); // 初始在屏幕外

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // 1. 光标跟随 (Lerp 平滑)
    cursorGroup.position.lerp(handPos, 0.2);
    
    // 2. 拖尾特效
    for(let i=0; i<trails.length; i++) {
        // 滞后跟随
        trails[i].position.lerp(cursorGroup.position, 0.1 * (i+1));
        // 变色
        trails[i].material.color.setHSL((time * 0.5 + i * 0.1) % 1, 1, 0.5);
    }

    // 3. 气球逻辑
    if (!isPaused) {
        for (let i = balloons.length - 1; i >= 0; i--) {
            const b = balloons[i];
            
            // 移动
            b.position.x -= b.userData.speed;
            b.position.y += Math.sin(time * 3 + b.userData.speed * 100) * 0.02; // 上下浮动
            b.rotation.z = Math.sin(time * 2) * 0.1; // 左右摇摆

            // 碰撞检测
            if (b.position.distanceTo(cursorGroup.position) < 2.0) {
                popBalloon(b, i);
            }
            
            // 出界
            if (b.position.x < -15) {
                scene.remove(b);
                balloons.splice(i, 1);
            }
        }
    }
    renderer.render(scene, camera);
}

// 击破气球
function popBalloon(obj, index) {
    const data = obj.userData.word;
    
    // 移除
    scene.remove(obj);
    balloons.splice(index, 1);

    // 播放打击乐 (根据颜色算频率，让声音有变化)
    playMarimba(300 + (data.color % 500)); 

    // 粒子特效 (50个碎片)
    for(let k=0; k<30; k++) {
        const p = new THREE.Mesh(
            new THREE.PlaneGeometry(0.2, 0.2),
            new THREE.MeshBasicMaterial({ color: data.color, side: THREE.DoubleSide })
        );
        p.position.copy(obj.position);
        p.rotation.set(Math.random()*3, Math.random()*3, Math.random()*3);
        scene.add(p);
        
        // 炸开动画
        gsap.to(p.position, {
            x: p.position.x + (Math.random()-0.5)*5,
            y: p.position.y + (Math.random()-0.5)*5,
            duration: 0.8,
            ease: "power2.out"
        });
        gsap.to(p.scale, { x: 0, y: 0, duration: 0.8, onComplete: () => scene.remove(p) });
    }

    showCard(data);
}

// 显示卡片
let score = 0;
function showCard(data) {
    isPaused = true;
    score += 10;
    document.getElementById('score').innerText = score;

    // UI 更新
    document.getElementById('c-icon').innerText = data.icon;
    document.getElementById('c-word').innerText = data.en;
    document.getElementById('c-cn').innerText = data.cn;

    const modal = document.getElementById('card-modal');
    modal.classList.add('show');

    // 发音
    const u = new SpeechSynthesisUtterance(data.en);
    u.rate = 0.8; 
    window.speechSynthesis.speak(u);

    setTimeout(() => {
        modal.classList.remove('show');
        isPaused = false;
    }, 2500);
}

// --- 8. 手势识别 ---
const hands = new window.Hands({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});
hands.setOptions({ maxNumHands: 1, minDetectionConfidence: 0.7 });
hands.onResults(res => {
    if (res.multiHandLandmarks && res.multiHandLandmarks.length > 0) {
        const p = res.multiHandLandmarks[0][8]; // 食指
        // 映射坐标 (把 0~1 映射到 WebGL 坐标系)
        const x = (p.x - 0.5) * 25;
        const y = -(p.y - 0.5) * 15;
        handPos.set(x, y, 0);
    }
});

// --- 9. 启动按钮 ---
const videoElement = document.getElementById('cam-preview');
const cameraUtils = new window.Camera(videoElement, {
    onFrame: async () => { await hands.send({image: videoElement}); },
    width: 640, height: 480
});

document.getElementById('btn-start').onclick = () => {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('hud').style.display = 'block';
    
    // 启动音频
    audioCtx.resume();
    
    cameraUtils.start();
    animate();
    
    // 开始生成气球
    setInterval(spawnBalloon, 2000);
};

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});