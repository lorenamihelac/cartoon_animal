document.addEventListener('DOMContentLoaded', () => {

  const bike = document.querySelector('#bikeModel');

  let positionX = 0;

  // ⬅️➡️ premikanje
  window.addEventListener('keydown', (e) => {

    if (e.key === 'ArrowLeft') {
      positionX -= 0.5;
    }

    if (e.key === 'ArrowRight') {
      positionX += 0.5;
    }

    // premakni kocko
    bike.setAttribute('position', `${positionX} 1 -3`);
  });

  // 🎨 klik → menjava barve
  const colors = ['red', 'green', 'blue', 'yellow', 'purple'];
  let colorIndex = 0;

  bike.addEventListener('click', () => {
    bike.setAttribute('color', colors[colorIndex % colors.length]);
    colorIndex++;
  });

});
