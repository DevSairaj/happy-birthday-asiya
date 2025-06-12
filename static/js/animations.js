// Floating emojis with physics-like random movement & speed
const symbols = ['🎈', '✨', '⭐', '💖', '💝', '🌹', '🌻', '🌷', '💐'];
const maxEmojis = 15;
let currentEmojis = 0;

function createFloatingElement() {
  if (currentEmojis >= maxEmojis) return;

  const el = document.createElement('span');
  el.className = 'floating-element';
  el.innerText = symbols[Math.floor(Math.random() * symbols.length)];

  const size = Math.random() * 1.2 + 0.8;
  el.style.fontSize = `${size}rem`;

  const edge = ['top', 'left', 'right', 'bottom'][Math.floor(Math.random() * 4)];
  switch (edge) {
    case 'top':
      el.style.top = '-3rem';
      el.style.left = `${Math.random() * 100}vw`;
      break;
    case 'bottom':
      el.style.top = '103vh';
      el.style.left = `${Math.random() * 100}vw`;
      break;
    case 'left':
      el.style.left = '-3rem';
      el.style.top = `${Math.random() * 100}vh`;
      break;
    case 'right':
      el.style.left = '103vw';
      el.style.top = `${Math.random() * 100}vh`;
      break;
  }

  el.style.position = 'fixed';
  el.style.opacity = '0';

  document.body.appendChild(el);
  currentEmojis++;

  const velocityX = (Math.random() - 0.5) * 40;
  const velocityY = (Math.random() - 0.5) * 40;

  let start = null;
  const lifespan = 15000 + Math.random() * 10000;

  function animate(timestamp) {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;

    if (elapsed < lifespan) {
      const pxX = el._posX ?? (window.innerWidth * (parseFloat(el.style.left) / 100));
      const pxY = el._posY ?? (window.innerHeight * (parseFloat(el.style.top) / 100));
      if (el._posX === undefined) el._posX = pxX;
      if (el._posY === undefined) el._posY = pxY;

      el._posX += velocityX * (16 / 1000);
      el._posY += velocityY * (16 / 1000);

      el.style.left = el._posX + 'px';
      el.style.top = el._posY + 'px';

      if (elapsed < 2000) {
        el.style.opacity = (elapsed / 2000).toFixed(2);
      } else if (elapsed > lifespan - 2000) {
        el.style.opacity = ((lifespan - elapsed) / 2000).toFixed(2);
      } else {
        el.style.opacity = '1';
      }

      requestAnimationFrame(animate);
    } else {
      el.remove();
      currentEmojis--;
    }
  }
  requestAnimationFrame(animate);
}

setInterval(createFloatingElement, 1200);
for (let i = 0; i < 7; i++) {
  setTimeout(createFloatingElement, i * 800);
}

window.toggleFlip = function(card) {
  card.classList.toggle('flipped');
  const pressed = card.getAttribute('aria-pressed') === 'true';
  card.setAttribute('aria-pressed', String(!pressed));
};

const messages = [
  "Wishing you a day filled with love, sparkles, and unforgettable joy 💫",
  "Your light makes the world brighter. Thank you for being YOU 🌸",
  "From your best friend always — Sairaj ❤️"
];

let typingEl = null;
let msgIndex = 0;
let charIndex = 0;

function typeMessage() {
  if (!typingEl) return;
  if (msgIndex >= messages.length) {
    msgIndex = 0;
  }

  if (charIndex < messages[msgIndex].length) {
    typingEl.textContent += messages[msgIndex].charAt(charIndex);
    charIndex++;
    setTimeout(typeMessage, 70);
  } else {
    charIndex = 0;
    msgIndex++;
    typingEl.textContent += "\n\n";
    setTimeout(typeMessage, 2500);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  typingEl = document.getElementById('typing-message');
  typeMessage();

  const confettiBtn = document.getElementById('confetti-btn');
  if (confettiBtn) {
    confettiBtn.addEventListener('click', () => {
      launchConfetti();
    });
  }

  setTimeout(() => {
    launchConfetti();
  }, 1000);
});

function launchConfetti() {
  if (window.confettiRunning) return;
  window.confettiRunning = true;

  const colors = ['#a97ce5', '#f6d365', '#fda085', '#3e1f47', '#ff6699'];
  const count = 150;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '10';

  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const W = canvas.width = window.innerWidth;
  const H = canvas.height = window.innerHeight;

  let particles = [];

  function randomRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  for (let i = 0; i < count; i++) {
    particles.push({
      x: randomRange(0, W),
      y: randomRange(-H, 0),
      size: randomRange(5, 10),
      speedX: randomRange(-3, 3),
      speedY: randomRange(2, 6),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: randomRange(0, 360),
      rotationSpeed: randomRange(-10, 10)
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.4);
      ctx.restore();
    });
  }

  function update() {
    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;

      if (p.y > H) {
        p.x = randomRange(0, W);
        p.y = randomRange(-20, 0);
        p.speedX = randomRange(-3, 3);
        p.speedY = randomRange(2, 6);
        p.rotation = randomRange(0, 360);
        p.rotationSpeed = randomRange(-10, 10);
      }
    });
  }

  function loop() {
    update();
    draw();
    if (Date.now() - start < 5000) {
      requestAnimationFrame(loop);
    } else {
      document.body.removeChild(canvas);
      window.confettiRunning = false;
    }
  }

  const start = Date.now();
  loop();
}

// --- THREE.js 3D Heart (fixed upright rotation) ---

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 7;

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('heart-background'),
  alpha: true,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);

function createHeartShape() {
  const x = 0, y = 0;
  const shape = new THREE.Shape();
  shape.moveTo(x, y);
  shape.bezierCurveTo(x, y + 3.5, x - 3, y + 3.5, x - 3, y + 1.5);
  shape.bezierCurveTo(x - 3, y - 0.5, x, y - 1.5, x, y - 3);
  shape.bezierCurveTo(x, y - 1.5, x + 3, y - 0.5, x + 3, y + 1.5);
  shape.bezierCurveTo(x + 3, y + 3.5, x, y + 3.5, x, y);
  return shape;
}

const geometry = new THREE.ExtrudeGeometry(createHeartShape(), {
  steps: 2,
  depth: 0.5,
  bevelEnabled: true,
  bevelThickness: 0.15,
  bevelSize: 0.25,
  bevelSegments: 5,
});

const material = new THREE.MeshPhongMaterial({
  color: 0xe03e60,
  shininess: 90,
  specular: 0xffaabb,
  flatShading: false,
  transparent: true,
  opacity: 0.35,
});

const heartMesh = new THREE.Mesh(geometry, material);
heartMesh.rotation.x = 0;
heartMesh.rotation.y = 0;
heartMesh.position.set(0, -0.9, 0);
heartMesh.scale.set(0.4, 0.4, 0.4); // Slightly smaller so it's fully visible

scene.add(heartMesh);
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

const light1 = new THREE.DirectionalLight(0xff6688, 0.9);
light1.position.set(5, 5, 5);
scene.add(light1);

const light2 = new THREE.DirectionalLight(0xff4466, 0.4);
light2.position.set(-3, -2, 3);
scene.add(light2);

function animateHeart() {
  requestAnimationFrame(animateHeart);
  heartMesh.rotation.y += 0.003; // smooth clockwise rotation
  renderer.render(scene, camera);
}

animateHeart();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
