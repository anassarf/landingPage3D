import * as THREE from 'three';
import { gsap } from 'gsap'; // Importer GSAP
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger); // Enregistrer ScrollTrigger avec GSAP

const modelPath = "src/models/alexander_the_great_erbach_type.glb";
const PI = Math.PI;

// Scene 
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setClearColor(0x000000, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.querySelector(".model").appendChild(renderer.domElement);

// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
scene.add(ambientLight);

// Main Light
const mainLight = new THREE.DirectionalLight(0xffffff, 7.5);
mainLight.position.set(0.5, 7.5, 2.5);
scene.add(mainLight);

// Loader Model
let model;
const loader = new GLTFLoader();
loader.load(modelPath, function(gltf) {
    model = gltf.scene;
    model.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });

    scene.add(model);

    // Centrer et ajuster la position de la caméra
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    camera.position.z = maxDim * 1.75;

    // Initialisation
    animate();
    setupAnimations();
    
});

// Fonction d'animation
function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}


// Configuration des animations de section
function setupAnimations() {
    if (model) {
        // Section 1 : Zoom (Intro)
        gsap.timeline({
            scrollTrigger: {
                trigger: '.intro',
                start: 'top center',
                end: 'bottom center',
                scrub: true,
            }
        })
        .to(model.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 2 }); // Zoom avant

        // Section 2 : Rotation verticale (Archive)
        gsap.timeline({
            scrollTrigger: {
                trigger: '.archive',
                start: 'top center',
                end: 'bottom center',
                scrub: true,
            }
        })
        .to(model.rotation, { x: Math.PI, duration: 2 }); // Rotation sur l'axe X

        // Section 3 : Rotation à 90° (Outro)
        gsap.timeline({
            scrollTrigger: {
                trigger: '.outro',
                start: 'top center',
                end: 'bottom center',
                scrub: true,
            }
        })
        .to(model.rotation, { y: Math.PI * 4, duration: 2 }); // Rotation sur l'axe Y à 90°
    }
}

