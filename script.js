/* =============================================
   PROPOSAL WEBSITE — script.js
   ============================================= */

// ── Romantic quotes that rotate in the letter
const quotes = [
  "\"I would rather spend one lifetime with you, than face all the ages of this world alone.\"",
  "\"In all the world, there is no heart for me like yours.\" — Maya Angelou",
  "\"You are my sun, my moon, and all of my stars.\" — E.E. Cummings",
  "\"I am yours. Don't give myself back to me.\" — Rumi",
  "\"Whatever our souls are made of, his and mine are the same.\" — Emily Brontë",
  "\"I carry your heart with me — I carry it in my heart.\" — E.E. Cummings",
  "\"You are the finest, loveliest, tenderest thing I have ever known.\" — F. Scott Fitzgerald",
];

// ── DOM references
const envelope      = document.getElementById('envelope');
const screen1       = document.getElementById('screen1');
const screen2       = document.getElementById('screen2');
const screen3       = document.getElementById('screen3');
const screen4       = document.getElementById('screen4');
const yesBtn        = document.getElementById('yesBtn');
const noBtn         = document.getElementById('noBtn');
const restartBtn    = document.getElementById('restartBtn');
const tryAgainBtn   = document.getElementById('tryAgainBtn');
const rotatingQuote = document.getElementById('rotatingQuote');
const starsEl       = document.getElementById('stars');
const petalsEl      = document.getElementById('petalsContainer');
const quoteCarousel = document.getElementById('quoteCarousel');

// ── Utility: show a screen, hide others
function showScreen(targetId) {
  [screen1, screen2, screen3, screen4].forEach(s => s.classList.remove('active'));
  document.getElementById(targetId).classList.add('active');
}

// ── Generate twinkling stars
function createStars(n) {
  for (let i = 0; i < n; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2.5 + 0.5;
    star.style.cssText = `
      width:${size}px; height:${size}px;
      top:${Math.random() * 100}%;
      left:${Math.random() * 100}%;
      --dur:${(Math.random() * 3 + 1.5).toFixed(2)}s;
      animation-delay:${(Math.random() * 4).toFixed(2)}s;
    `;
    starsEl.appendChild(star);
  }
}

// ── Generate falling petals
const petalEmojis = ['🌸', '🌺', '❤️', '🌹', '💕', '✨', '💗'];

function createPetal() {
  const petal = document.createElement('div');
  petal.className = 'petal';
  petal.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
  petal.style.left = Math.random() * 100 + 'vw';
  const dur = (Math.random() * 6 + 5).toFixed(1);
  petal.style.animationDuration = dur + 's';
  petal.style.animationDelay    = (Math.random() * 4).toFixed(1) + 's';
  petal.style.fontSize           = (Math.random() * 16 + 12) + 'px';
  petalsEl.appendChild(petal);
  // Remove after animation ends to keep DOM clean
  setTimeout(() => petal.remove(), (parseFloat(dur) + 4) * 1000);
}

function startPetalShower() {
  // Initial burst
  for (let i = 0; i < 12; i++) createPetal();
  // Continuous drizzle
  setInterval(createPetal, 700);
}

// ── Envelope click → open → go to letter
envelope.addEventListener('click', () => {
  envelope.classList.add('open');
  setTimeout(() => {
    showScreen('screen2');
    startQuoteRotation();
  }, 700);
});

// ── Rotate the letter's inline quote every 4s
let quoteIndex = 0;
function startQuoteRotation() {
  setInterval(() => {
    quoteIndex = (quoteIndex + 1) % quotes.length;
    rotatingQuote.style.opacity = '0';
    rotatingQuote.style.transition = 'opacity 0.5s';
    setTimeout(() => {
      rotatingQuote.textContent = quotes[quoteIndex];
      rotatingQuote.style.opacity = '1';
    }, 500);
  }, 4000);
}

// ── YES button
yesBtn.addEventListener('click', () => {
  showScreen('screen3');
  launchConfetti();
  startCarousel();
});

// ── NO button — runs away!
let noMoveCount = 0;
noBtn.addEventListener('mouseover', moveNoButton);
noBtn.addEventListener('click', moveNoButton);   // for touch devices

function moveNoButton() {
  noMoveCount++;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const btnW = noBtn.offsetWidth;
  const btnH = noBtn.offsetHeight;

  // Random position within viewport (with padding)
  const x = Math.random() * (vw - btnW - 40) + 20;
  const y = Math.random() * (vh - btnH - 40) + 20;

  noBtn.style.position  = 'fixed';
  noBtn.style.left      = x + 'px';
  noBtn.style.top       = y + 'px';
  noBtn.style.zIndex    = '200';
  noBtn.style.transition = 'left 0.3s ease, top 0.3s ease';

  // After 6 escapes, give up and show "no" screen
  if (noMoveCount >= 6) {
    noBtn.removeEventListener('mouseover', moveNoButton);
    setTimeout(() => showScreen('screen4'), 300);
  }
}

// ── Restart / Try Again
restartBtn.addEventListener('click', resetAll);
tryAgainBtn.addEventListener('click', resetAll);

function resetAll() {
  noMoveCount = 0;
  noBtn.style.position   = '';
  noBtn.style.left       = '';
  noBtn.style.top        = '';
  noBtn.style.transition = '';
  noBtn.addEventListener('mouseover', moveNoButton);
  envelope.classList.remove('open');
  showScreen('screen1');
}

// ── Confetti burst on YES
const confettiItems = ['💖', '💝', '💗', '✨', '🌸', '🌺', '💕', '❤️', '🥂'];

function launchConfetti() {
  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'confetti-heart';
      el.textContent = confettiItems[Math.floor(Math.random() * confettiItems.length)];
      el.style.left   = Math.random() * 100 + 'vw';
      el.style.top    = '-50px';
      el.style.fontSize = (Math.random() * 20 + 12) + 'px';
      el.style.animationDuration = (Math.random() * 1.5 + 1.5) + 's';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3500);
    }, i * 60);
  }
}

// ── Quote carousel on YES screen
function startCarousel() {
  const items = quoteCarousel.querySelectorAll('.carousel-quote');
  let idx = 0;

  // Reset
  items.forEach((el, i) => {
    el.classList.remove('active');
    el.style.position = i === 0 ? 'relative' : 'absolute';
  });
  items[0].classList.add('active');

  setInterval(() => {
    items[idx].classList.remove('active');
    items[idx].style.position = 'absolute';
    idx = (idx + 1) % items.length;
    items[idx].style.position = 'relative';
    items[idx].classList.add('active');
  }, 3500);
}

// ── Init
createStars(160);
startPetalShower();
showScreen('screen1');
