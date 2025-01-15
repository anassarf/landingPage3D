
import * as THREE from 'three';
import { gsap } from 'gsap'; // Importer GSAP
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import ScrollTrigger from 'gsap/ScrollTrigger';
// import Lenis from '@studio-freight/lenis';
import SplitType from 'split-type';

console.log("ok")

const modelPath = "src/models/black_chair.glb";
const PI = Math.PI;

// Lenis SmoothTrigger
const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);


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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadow;
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2.5;
document.querySelector(".model").appendChild(renderer.domElement);

// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
scene.add(ambientLight);

// Main Light
const mainLight = new THREE.DirectionalLight(0xffffff, 7.5);
mainLight.position.set(0.5, 7.5, 2.5);
scene.add(mainLight);

//fill Light
const fillLight = new THREE.DirectionalLight(0xffffff, 2.5);
fillLight.position.set(-15, 0, -5);
scene.add(fillLight);

//hemiLight
const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.5);
hemiLight.position.set(0, 0, 0);
scene.add(hemiLight);


// Animate Fonction
function basicAnimate(){
    renderer.render(scene, camera);
    requestAnimationFrame(basicAnimate);
}
basicAnimate();

// loader Model
let model;
const loader = new GLTFLoader(); 
loader.load(modelPath, function(gltf) {
    model = gltf.scene;
    model.traverse((node) => {
        if(node.isMesh){
            if(node.material){
                node.material.metaless = 2;
                node.material.roughness = 3;
                node.material.envMapIntensity = 5;
            }
            node.cashSadow = true;
            node.receiveShadow = true;
        }
    });
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
    scene.add(model);

    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    camera.position.z = maxDim * 1.75;

    model.rotation.set(0, 0, 0.2);
    model.scale.set(0, 0, 0);
    model.position.y =1.5;
    playIntialAnimation();
    cancelAnimationFrame(basicAnimate);
    animate();

});

const floatAmplitude = 0.05;
const floatSpeed = 1.5;
const rotationSpeed = 0.3;
let  isFloating = true;
let currentScroll = 0;

const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;

function playIntialAnimation() {
    if (model) {
        const timeline = gsap.timeline();

        // Animation de mise à l'échelle
        timeline.to(model.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 1,
            ease: "power2.out"
        });

        // Animation de rotation 360° (après le scale)
        timeline.to(model.rotation, {
            y: PI * 2, // Rotation 360° autour de l'axe Y
            duration: 1,
            ease: "power2.out"
        });
    }
}

lenis.on("scroll", (e) => {
    currentScroll = e.scroll;
});

function animate(){
    if(model){
        if(isFloating){
            const floatOffset = Math.sin(Date.now() * 0.001 * floatSpeed) * floatAmplitude;
            model.position.y = floatOffset;
            
        }

        const scrollProgress = Math.min(currentScroll / totalScrollHeight , 1);

        // console.log(scrollProgress);

        const baseTilt = 0.5;
        model.rotation.x = scrollProgress * PI * 4 + baseTilt;
    }

    renderer.render(scene,camera);
    requestAnimationFrame(animate);
}


