window.addEventListener('load', () => {

  const soundDing = document.querySelector('#soundDing');
  const soundWin = document.querySelector('#soundWin');
  const bike = document.querySelector('#bikeModel');
  const scoreText = document.querySelector('#scoreText');

  let positionX = 0;
  let score = 0;
  let gameStarted = false;

  //  PREMIKANJE + START + RESET
  window.addEventListener('keydown', (e) => {

    if (e.key === 'ArrowLeft') {
      positionX -= 0.5;
      gameStarted = true;
    }

    if (e.key === 'ArrowRight') {
      positionX += 0.5;
      gameStarted = true;
    }

    //  RESET
    if (e.key === 'r') {
      score = 0;
      positionX = 0;
      gameStarted = false;

      bike.setAttribute('position', '0 1 -3');
      scoreText.setAttribute('value', 'Točke: 0');

      console.log("RESET!");
    }

    bike.setAttribute('position', `${positionX} 1 -3`);
  });

  //  KLIK → MENJAVA BARVE
  const colors = ['red', 'green', 'blue', 'yellow', 'purple'];
  let index = 0;

  bike.addEventListener('click', () => {
    bike.setAttribute('color', colors[index % colors.length]);
    index++;
  });

  //  TOČKE (vsako sekundo)
  setInterval(() => {
    if (gameStarted && Math.abs(positionX) < 0.5) {
      score++;
      scoreText.setAttribute('value', 'Točke: ' + score);
    }
  }, 1000);

});
