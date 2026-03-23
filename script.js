import * as THREE from 'https://unpkg.com/three@0.162.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.162.0/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xcfeeff, 18, 42);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 4.8, 11);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('app').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 2.4, 0);
controls.minDistance = 7;
controls.maxDistance = 18;
controls.maxPolarAngle = Math.PI / 2.05;

const sky = new THREE.Mesh(
  new THREE.SphereGeometry(60, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xdaf2ff, side: THREE.BackSide })
);
scene.add(sky);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8db172, 1.4);
scene.add(hemiLight);

const sun = new THREE.DirectionalLight(0xffffff, 1.25);
sun.position.set(8, 14, 10);
sun.castShadow = true;
sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;
sun.shadow.camera.left = -20;
sun.shadow.camera.right = 20;
sun.shadow.camera.top = 20;
sun.shadow.camera.bottom = -20;
scene.add(sun);

const roadGroup = new THREE.Group();
scene.add(roadGroup);

const grass = new THREE.Mesh(
  new THREE.CircleGeometry(26, 80),
  new THREE.MeshStandardMaterial({ color: 0x8fcb6a })
);
grass.rotation.x = -Math.PI / 2;
grass.receiveShadow = true;
roadGroup.add(grass);

const road = new THREE.Mesh(
  new THREE.PlaneGeometry(28, 7),
  new THREE.MeshStandardMaterial({ color: 0x3f4752, roughness: 0.92 })
);
road.rotation.x = -Math.PI / 2;
road.position.y = 0.02;
road.receiveShadow = true;
roadGroup.add(road);

const centerLineMaterial = new THREE.MeshStandardMaterial({
  color: 0xfff2a8,
  emissive: 0x665400,
  emissiveIntensity: 0.15
});

for (let i = -10; i <= 10; i += 4) {
  const stripe = new THREE.Mesh(new THREE.PlaneGeometry(2, 0.18), centerLineMaterial);
  stripe.rotation.x = -Math.PI / 2;
  stripe.position.set(i, 0.04, 0);
  roadGroup.add(stripe);
}

for (let i = -3; i <= 3; i += 2) {
  const bush = new THREE.Mesh(
    new THREE.SphereGeometry(0.9, 20, 20),
    new THREE.MeshStandardMaterial({ color: 0x4d9f44 })
  );
  bush.position.set(7 + Math.random() * 1.2, 0.8, i + (Math.random() - 0.5) * 0.9);
  bush.castShadow = true;
  roadGroup.add(bush);

  const bush2 = bush.clone();
  bush2.position.x *= -1;
  roadGroup.add(bush2);
}

function createTree(x, z) {
  const tree = new THREE.Group();

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.22, 2.2, 12),
    new THREE.MeshStandardMaterial({ color: 0x7b4e2b })
  );
  trunk.position.y = 1.1;
  trunk.castShadow = true;
  tree.add(trunk);

  const crown = new THREE.Mesh(
    new THREE.SphereGeometry(1.2, 20, 20),
    new THREE.MeshStandardMaterial({ color: 0x5fae4e })
  );
  crown.position.y = 2.7;
  crown.castShadow = true;
  tree.add(crown);

  tree.position.set(x, 0, z);
  scene.add(tree);
}

createTree(-9, -4);
createTree(-10, 4);
createTree(9, -4.5);
createTree(10, 3.5);

const bikeColors = [0xff4d6d, 0x00b894, 0x3b82f6, 0xf59e0b, 0x8b5cf6, 0xef4444];
let colorIndex = 0;

const clickTargets = [];
const animatedParts = [];

const bike = new THREE.Group();
scene.add(bike);

const metalMaterial = new THREE.MeshStandardMaterial({
  color: bikeColors[colorIndex],
  metalness: 0.45,
  roughness: 0.42
});
const tireMaterial = new THREE.MeshStandardMaterial({ color: 0x1d1d1d, roughness: 0.95 });
const rimMaterial = new THREE.MeshStandardMaterial({
  color: 0xe8edf5,
  metalness: 0.8,
  roughness: 0.18
});
const seatMaterial = new THREE.MeshStandardMaterial({ color: 0x242424, roughness: 0.9 });

function buildWheel(x) {
  const wheel = new THREE.Group();

  const tire = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.11, 16, 42), tireMaterial);
  tire.rotation.y = Math.PI / 2;
  tire.castShadow = true;
  wheel.add(tire);

  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.05, 12, 38), rimMaterial);
  rim.rotation.y = Math.PI / 2;
  rim.castShadow = true;
  wheel.add(rim);

  for (let i = 0; i < 8; i++) {
    const spoke = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 1.85, 8),
      new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.9, roughness: 0.25 })
    );
    spoke.rotation.z = Math.PI / 2;
    spoke.rotation.x = (Math.PI / 8) * i;
    wheel.add(spoke);
  }

  wheel.position.set(x, 1.15, 0);
  bike.add(wheel);
  clickTargets.push(tire, rim);
  animatedParts.push(wheel);
  return wheel;
}

buildWheel(-2.2);
buildWheel(2.2);

function tube(length, x, y, z, rx, ry, rz) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, length, 12),
    metalMaterial
  );
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, ry, rz);
  mesh.castShadow = true;
  bike.add(mesh);
  clickTargets.push(mesh);
  return mesh;
}

tube(2.7, -0.4, 2.2, 0, 0, 0, Math.PI / 2.65);
tube(2.0, 0.62, 2.28, 0, 0, 0, -Math.PI / 1.95);
tube(1.75, 1.45, 2.9, 0, 0, 0, Math.PI / 8);
tube(1.9, -1.46, 2.15, 0, 0, 0, -Math.PI / 1.92);
tube(3.1, 0, 1.15, 0, 0, 0, Math.PI / 2);
tube(1.25, -0.2, 3.2, 0, 0, 0, Math.PI / 2);

const handleBar = new THREE.Mesh(
  new THREE.CylinderGeometry(0.06, 0.06, 1.1, 12),
  new THREE.MeshStandardMaterial({ color: 0xcdd6e0, metalness: 0.9, roughness: 0.18 })
);
handleBar.position.set(2.15, 3.5, 0);
handleBar.rotation.z = Math.PI / 2;
handleBar.castShadow = true;
bike.add(handleBar);
clickTargets.push(handleBar);

const seat = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.16, 0.4), seatMaterial);
seat.position.set(-0.65, 3.08, 0);
seat.castShadow = true;
bike.add(seat);

const pedalHub = new THREE.Mesh(
  new THREE.CylinderGeometry(0.16, 0.16, 0.32, 16),
  new THREE.MeshStandardMaterial({ color: 0xcdd6e0, metalness: 0.8, roughness: 0.2 })
);
pedalHub.rotation.z = Math.PI / 2;
pedalHub.position.set(0, 1.2, 0);
pedalHub.castShadow = true;
bike.add(pedalHub);

for (const side of [-0.28, 0.28]) {
  const crank = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.08, 0.08),
    new THREE.MeshStandardMaterial({ color: 0xa3adb8, metalness: 0.7, roughness: 0.25 })
  );
  crank.position.set(0, 1.2, side);
  bike.add(crank);

  const pedal = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.08, 0.18),
    new THREE.MeshStandardMaterial({ color: 0x262626 })
  );
  pedal.position.set(side > 0 ? 0.55 : -0.55, 1.2, side);
  bike.add(pedal);
}

const animal = new THREE.Group();
scene.add(animal);

const fur = new THREE.MeshStandardMaterial({ color: 0xc98f4e, roughness: 0.95 });
const belly = new THREE.MeshStandardMaterial({ color: 0xf2d3a5, roughness: 0.95 });
const dark = new THREE.MeshStandardMaterial({ color: 0x49311f, roughness: 0.9 });

const body = new THREE.Mesh(new THREE.SphereGeometry(1.15, 24, 24), fur);
body.scale.set(1.2, 1.0, 0.95);
body.position.set(-0.2, 4.2, 0);
body.castShadow = true;
animal.add(body);

const bellyPatch = new THREE.Mesh(new THREE.SphereGeometry(0.72, 20, 20), belly);
bellyPatch.scale.set(1.0, 1.12, 0.7);
bellyPatch.position.set(-0.1, 3.95, 0.55);
bellyPatch.castShadow = true;
animal.add(bellyPatch);

const head = new THREE.Mesh(new THREE.SphereGeometry(0.78, 22, 22), fur);
head.position.set(1.0, 5.08, 0);
head.castShadow = true;
animal.add(head);

for (const z of [-0.35, 0.35]) {
  const ear = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), fur);
  ear.scale.set(0.95, 1.2, 0.8);
  ear.position.set(1.18, 5.75, z);
  ear.castShadow = true;
  animal.add(ear);

  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), dark);
  eye.position.set(1.55, 5.12, z);
  animal.add(eye);
}

const snout = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), belly);
snout.scale.set(1.18, 0.8, 0.92);
snout.position.set(1.62, 4.9, 0);
animal.add(snout);

const nose = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), dark);
nose.position.set(1.82, 4.92, 0);
animal.add(nose);

function makeLimb(radius, length, x, y, z, rotationZ = 0) {
  const limb = new THREE.Mesh(new THREE.CapsuleGeometry(radius, length, 8, 16), fur);
  limb.position.set(x, y, z);
  limb.rotation.z = rotationZ;
  limb.castShadow = true;
  animal.add(limb);
  return limb;
}

const backLegA = makeLimb(0.16, 0.85, -0.92, 3.1, -0.25, -0.35);
const backLegB = makeLimb(0.16, 0.85, -0.92, 3.1, 0.25, -0.35);
const frontArmA = makeLimb(0.13, 0.72, 1.65, 4.15, -0.23, 1.05);
const frontArmB = makeLimb(0.13, 0.72, 1.65, 4.15, 0.23, 1.05);

const tail = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.8, 4, 12), fur);
tail.position.set(-1.8, 4.45, 0);
tail.rotation.z = -1.1;
tail.castShadow = true;
animal.add(tail);

animal.position.y = -0.25;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function updateBikeColor() {
  colorIndex = (colorIndex + 1) % bikeColors.length;
  metalMaterial.color.setHex(bikeColors[colorIndex]);
}

document.getElementById('colorButton').addEventListener('click', updateBikeColor);

function onPointerDown(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObjects(clickTargets, false);
  if (hit.length > 0) {
    updateBikeColor();
  }
}

window.addEventListener('pointerdown', onPointerDown);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const elapsed = clock.getElapsedTime();

  animatedParts.forEach((wheel) => {
    wheel.rotation.z = elapsed * 2.8;
  });

  bike.position.y = Math.sin(elapsed * 2.3) * 0.03;
  animal.position.y = -0.25 + Math.sin(elapsed * 2.3) * 0.03;
  animal.rotation.z = Math.sin(elapsed * 2.3) * 0.015;
  tail.rotation.y = Math.sin(elapsed * 3.5) * 0.22;
  backLegA.rotation.z = -0.35 + Math.sin(elapsed * 2.8) * 0.18;
  backLegB.rotation.z = -0.35 - Math.sin(elapsed * 2.8) * 0.18;
  frontArmA.rotation.z = 1.05 + Math.sin(elapsed * 2.8) * 0.12;
  frontArmB.rotation.z = 1.05 - Math.sin(elapsed * 2.8) * 0.12;

  controls.update();
  renderer.render(scene, camera);
}

animate();
