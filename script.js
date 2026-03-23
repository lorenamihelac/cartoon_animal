import * as THREE from 'https://unpkg.com/three@0.162.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.162.0/examples/jsm/controls/OrbitControls.js';

// --- Scene & Camera ---
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

// --- Controls ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 2.4, 0);
controls.minDistance = 7;
controls.maxDistance = 18;
controls.maxPolarAngle = Math.PI / 2.05;

// --- Lights ---
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8db172, 1.4);
scene.add(hemiLight);

const sun = new THREE.DirectionalLight(0xffffff, 1.25);
sun.position.set(8, 14, 10);
sun.castShadow = true;
scene.add(sun);

// --- Ground ---
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(28, 28),
  new THREE.MeshStandardMaterial({ color: 0x8fcb6a })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// --- Simple Bike Placeholder ---
const bike = new THREE.Mesh(
  new THREE.BoxGeometry(3, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0xff4d6d })
);
bike.position.y = 1.15;
scene.add(bike);

const bikeColors = [0xff4d6d, 0x00b894, 0x3b82f6, 0xf59e0b, 0x8b5cf6, 0xef4444];
let colorIndex = 0;

document.getElementById('colorButton').addEventListener('click', () => {
  colorIndex = (colorIndex + 1) % bikeColors.length;
  bike.material.color.setHex(bikeColors[colorIndex]);
});

// --- Resize ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Animate ---
function animate() {
  requestAnimationFrame(animate);
  bike.rotation.y += 0.01; // zavrti kolo za demo
  controls.update();
  renderer.render(scene, camera);
}
animate();
