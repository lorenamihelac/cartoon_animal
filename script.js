// ---------- GLOBALNE SPREMENLJIVKE ----------
let score = 0;
let gameStarted = false;
let audioAllowed = false;

// Zvok za točko
const dingSound = new Audio('https://www.soundjay.com/button/beep-07.wav'); // uporabi svoj zvok ali online

// Za premikanje kocke
const cube = document.querySelector('#bikeModel');

// Element za prikaz točk
const scoreDisplay = document.createElement('div');
scoreDisplay.style.position = 'absolute';
scoreDisplay.style.top = '10px';
scoreDisplay.style.left = '10px';
scoreDisplay.style.padding = '8px 12px';
scoreDisplay.style.background = 'rgba(255,255,255,0.8)';
scoreDisplay.style.fontSize = '18px';
scoreDisplay.style.fontFamily = 'sans-serif';
scoreDisplay.style.borderRadius = '8px';
scoreDisplay.innerText = "TOČKE: 0";
document.body.appendChild(scoreDisplay);

// ---------- DOVOLITEV ZVOKA ----------
document.addEventListener('click', () => {
  audioAllowed = true;
  gameStarted = true; // igra se začne ob prvem kliku
});

// ---------- PREMIKANJE KOCKE ----------
let moveX = 0;
document.addEventListener('mousemove', (event) => {
  const width = window.innerWidth;
  const normalized = (event.clientX / width) * 2 - 1; // -1 do 1
  moveX = normalized * 2; // omejitev gibanja
  cube.setAttribute('position', { x: moveX, y: 1, z: -3 });
});

// ---------- RESET TOČK OB NOVI IGRI ----------
function resetScore() {
  score = 0;
  scoreDisplay.innerText = "TOČKE: 0";
}

// ---------- TOČKE ----------
setInterval(() => {
  if (gameStarted) {
    const pos = cube.getAttribute('position');
    // če je kocka približno na sredini
    if (Math.abs(pos.x) < 0.5) {
      score++;
      scoreDisplay.innerText = "TOČKE: " + score;

      if (audioAllowed) {
        dingSound.currentTime = 0;
        dingSound.play();
      }

      if (score >= 20) {
        alert("Čestitke! Dosegel si 20 točk!");
        resetScore();
      }
    }
  }
}, 1000);
