// script.js

// --- 1. Audio Control ---
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
let isMusicPlaying = false;

musicToggle.addEventListener('click', () => {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicToggle.innerHTML = '<span class="icon">🔇</span>';
    } else {
        bgMusic.play().catch(e => console.log("Audio play failed:", e));
        musicToggle.innerHTML = '<span class="icon">🎶</span>';
    }
    isMusicPlaying = !isMusicPlaying;
});

// Try to auto-play when user clicks first button
function initAudio() {
    if (!isMusicPlaying) {
        bgMusic.volume = 0.5;
        bgMusic.play().catch(() => {
            // Autoplay prevented, wait for toggle
            console.log("Autoplay prevented");
        });
        isMusicPlaying = true;
        musicToggle.innerHTML = '<span class="icon">🎶</span>';
    }
}

// --- 2. Floating Particles Generation ---
const particlesContainer = document.getElementById('particles-container');
function createParticles() {
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Randomize
        const size = Math.random() * 8 + 2;
        const left = Math.random() * 100;
        const delay = Math.random() * 10;
        const duration = Math.random() * 10 + 10;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}vw`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;

        particlesContainer.appendChild(particle);
    }
}
createParticles();


// --- 3. Scene Management ---
let currentScene = 1;
const totalScenes = 8;

function nextScene(sceneNumber, startAudio = false) {
    if (startAudio) {
        initAudio();
    }

    // Hide current
    const currentEl = document.getElementById(`scene-${currentScene}`);
    if (currentEl) {
        currentEl.classList.remove('active');
    }

    // Show next
    currentScene = sceneNumber;
    const nextEl = document.getElementById(`scene-${currentScene}`);
    if (nextEl) {
        nextEl.classList.add('active');

        // Trigger specific scene animations
        if (currentScene === 2) {
            startTypewriter();
        } else if (currentScene === 4) {
            triggerTimeline();
        } else if (currentScene === 6) {
            triggerAppreciation();
        }
    }
}


// --- 4. Typewriter Effect (Scene 2) ---
const textToType = "I don’t always say things properly…and you already know that.But this time, I didn’t want to mess it up.So I made this…not just as a gift,but as something that holds everything I couldn’t say out loud.Don’t rush this, okay?This… is us💌";
const typewriterEl = document.getElementById('typewriter-text');
const btnScene2 = document.getElementById('btn-scene-2');
let i = 0;

function startTypewriter() {
    if (i > 0) return; // Prevent restart
    typewriterEl.innerHTML = "";
    btnScene2.style.opacity = '0';

    function type() {
        if (i < textToType.length) {
            typewriterEl.innerHTML += textToType.charAt(i);
            i++;
            setTimeout(type, 40); // typing speed
        } else {
            setTimeout(() => {
                btnScene2.style.opacity = '1';
                btnScene2.style.pointerEvents = 'all';
            }, 500);
        }
    }
    setTimeout(type, 800); // initial delay
}


// --- 5. Timeline Animation (Scene 4) ---
function triggerTimeline() {
    const items = document.querySelectorAll('.timeline-item');
    items.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('show');
        }, 600 + (index * 800));
    });
}

// --- 6. Appreciation Animation (Scene 5) ---
function triggerAppreciation() {
    const list = document.querySelector('.appreciation-list');
    const items = document.querySelectorAll('.app-item');
    const btn = document.querySelector('.app-btn');

    setTimeout(() => {
        list.classList.add('show');
    }, 500);

    items.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 800 + (index * 1200));
    });

    setTimeout(() => {
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'all';
    }, 800 + (items.length * 1200) + 500);
}


// --- 7. Gift Box & Confetti (Scene 6) ---
const giftBox = document.getElementById('gift-box');
const surpriseMsg = document.getElementById('surprise-message');
let giftOpened = false;

window.openGift = function () {
    if (giftOpened) return;
    giftOpened = true;

    giftBox.classList.add('gift-opened');

    setTimeout(() => {
        giftBox.classList.add('hidden');
        document.querySelector('.click-hint').classList.add('hidden');

        surpriseMsg.classList.remove('hidden');

        // Small delay before showing element text
        setTimeout(() => {
            surpriseMsg.classList.add('show');
            shootConfetti();
        }, 100);

    }, 800);
}

// Custom Confetti System on Canvas
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const colors = ['#ff8fab', '#ffb3c6', '#ffd6e0', '#ffffff'];

function shootConfetti() {
    for (let i = 0; i < 150; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2 + 50,
            r: Math.random() * 6 + 2,
            dx: Math.random() * 20 - 10,
            dy: Math.random() * -20 - 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.random() * 10
        });
    }
    requestAnimationFrame(updateConfetti);
}

function updateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;

    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.dy += 0.5; // gravity
        p.x += p.dx;
        p.y += p.dy;
        p.tilt += 0.1;

        if (p.y < canvas.height) active = true;

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt);
        ctx.stroke();
    }

    if (active) {
        requestAnimationFrame(updateConfetti);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles = [];
    }
}
