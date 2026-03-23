// Wait for the scene to load
document.querySelector('a-scene').addEventListener('loaded', function () {
  const bikeEntity = document.querySelector('#bikeModel');
  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'];
  let colorIndex = 0;

  bikeEntity.addEventListener('click', function () {
    // Cycle through colors
    const nextColor = colors[colorIndex % colors.length];
    colorIndex++;

    // Apply color to the mesh
    // Note: This assumes the bicycle frame is part of the GLTF mesh
    bikeEntity.object3D.traverse((node) => {
      if (node.isMesh && node.name.toLowerCase().includes('bike')) {
        node.material.color.set(nextColor);
      }
    });
    
    console.log("Bicycle color changed to: " + nextColor);
  });
});
