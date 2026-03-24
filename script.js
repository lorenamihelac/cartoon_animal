// ČIST, KOMPLETNI SCRIPT.JS

document.addEventListener('DOMContentLoaded', () => {
  // ======== GAME STATE ========
  let score = 0;
  let gameStarted = false;

  // Zvok ob kliku / točki
  const dingSound = new Audio('https://cdn.aframe.io/basic-guide/audio/click.ogg');

  // Barve kocke
  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'];
  let colorIndex = 0;

  // Kocka
  const cube = document.querySelector('#bikeModel');

  // ======== SCORE DISPLAY ========
  const scoreDisplay = document.createElement('div');
  scoreDisplay.style.position = 'absolute';
  scoreDisplay.style.top = '10px';
  scoreDisplay.style.right = '10px';
  scoreDisplay.style.color = 'black';
  scoreDisplay.style.fontSize = '24px';
  scoreDisplay.style.fontWeight = 'bold';
  scoreDisplay.innerText = "TOČKE: 0";
  document.body.appendChild(scoreDisplay);

  // ======== START GAME OB KLIKU KOCKE ========
  cube.addEventListener('click', () => {
    if (!gameStarted) gameStarted = true;

    // Menjava barve kocke
    const nextColor = colors[colorIndex % colors.length];
    colorIndex++;
    cube.setAttribute('color', nextColor);

    // Zvok
    dingSound.currentTime = 0;
    dingSound.play();
  });

  // ======== PREMIKANJE KOCKE S KURZORJEM ========
  let mouseX = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 4; // obseg -2 do 2
    cube.setAttribute('position', { x: mouseX, y: 1, z: -3 });
  });

  // ======== TOČKE ========
  setInterval(() => {
    if (gameStarted) {
      const pos = cube.getAttribute('position');
      if (Math.abs(pos.x) < 0.5) {
        score++;
        scoreDisplay.innerText = "TOČKE: " + score;

        // Zvok za točko
        dingSound.currentTime = 0;
        dingSound.play();

        // Cilj 20 točk
        if (score >= 20) {
          alert("Čestitke! Dosegel si 20 točk!");
          score = 0;
          scoreDisplay.innerText = "TOČKE: 0";
        }
      }
    }
  }, 1000);

  // ======== RESET TOČK OB R ========
  document.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') {
      score = 0;
      scoreDisplay.innerText = "TOČKE: 0";
    }
  });
});
