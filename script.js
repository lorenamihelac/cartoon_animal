document.querySelector('a-scene').addEventListener('loaded', function () {

  const bike = document.querySelector('#bikeModel');
  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'];
  let colorIndex = 0;

  let positionX = 0;

  // 🎨 Klik za barvo
  bike.addEventListener('click', function () {
    const nextColor = colors[colorIndex % colors.length];
    colorIndex++;

    bike.object3D.traverse((node) => {
      if (node.isMesh) {
        node.material.color.set(nextColor);
      }
    });
  });

  // ⬅️➡️ premikanje
  window.addEventListener('keydown', (e) => {

    if (e.key === 'ArrowLeft') {
      positionX -= 0.5;
    }

    if (e.key === 'ArrowRight') {
      positionX += 0.5;
    }

    bike.setAttribute('position', `${positionX} 0 -3`);
  });

  // 🎯 animacija glede na pozicijo
  function animate() {
    requestAnimationFrame(animate);

    // sredina (OK)
    if (Math.abs(positionX) < 0.5) {
      bike.object3D.rotation.z = 0;
    }

    // levo
    else if (positionX < -0.5) {
      bike.object3D.rotation.z = 0.3;
    }

    // desno
    else if (positionX > 0.5) {
      bike.object3D.rotation.z = -0.3;
    }

    // če gre s ceste → “kaznovanje”
    if (Math.abs(positionX) > 2) {
      bike.object3D.position.y = 0.5; // poskok
    } else {
      bike.object3D.position.y = 0;
    }
  }

  animate();
});
