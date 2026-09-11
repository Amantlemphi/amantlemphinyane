// ============================================
// THREE.JS BACKGROUND — AURORA NEBULA
// A soft, glowing, cinematic deep-space scene: drifting
// magic dust, slow-breathing nebula clouds, and a gentle
// autonomous camera drift layered under mouse parallax.
// ============================================

const canvas = document.querySelector("#scene");

const scene = new THREE.Scene();

scene.fog = new THREE.FogExp2(0x07040f, 0.012);

// ============================================
// CAMERA
// ============================================

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 0, 16);

scene.add(camera);

// ============================================
// RENDERER
// ============================================

const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;

// ============================================
// SOFT GLOW SPRITE TEXTURE (generated once, reused)
// ============================================

function makeGlowTexture() {

    const size = 128;
    const canvas2d = document.createElement("canvas");
    canvas2d.width = canvas2d.height = size;
    const ctx = canvas2d.getContext("2d");

    const gradient = ctx.createRadialGradient(
        size / 2, size / 2, 0,
        size / 2, size / 2, size / 2
    );

    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.4, "rgba(255,255,255,.6)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas2d);
    texture.needsUpdate = true;
    return texture;

}

const glowTexture = makeGlowTexture();

// ============================================
// GROUPS
// ============================================

const starGroup = new THREE.Group();
const dustGroup = new THREE.Group();
const cloudGroup = new THREE.Group();

scene.add(starGroup);
scene.add(dustGroup);
scene.add(cloudGroup);

// ============================================
// DISTANT STARFIELD (subtle, cool white/violet)
// ============================================

const starCount = 1400;
const starPositions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount; i++) {
    const radius = 60 + Math.random() * 90;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    starPositions[i * 3 + 2] = radius * Math.cos(phi);
}

const starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));

const starMaterial = new THREE.PointsMaterial({
    color: 0xcabbff,
    size: 0.7,
    map: glowTexture,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
    depthWrite: false
});

starGroup.add(new THREE.Points(starGeometry, starMaterial));

// ============================================
// MAGIC DUST — aurora-coloured glowing particles
// ============================================

const dustCount = 850;
const dustPositions = new Float32Array(dustCount * 3);
const dustColors = new Float32Array(dustCount * 3);
const dustSizes = new Float32Array(dustCount);

const palette = [
    new THREE.Color(0x8b5cf6), // violet
    new THREE.Color(0xf472b6), // magenta
    new THREE.Color(0x5eead4), // aurora teal
    new THREE.Color(0xffd580)  // rare gold spark
];

for (let i = 0; i < dustCount; i++) {

    const radius = 6 + Math.random() * 42;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    dustPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    dustPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.6;
    dustPositions[i * 3 + 2] = radius * Math.cos(phi) - 10;

    const isGold = Math.random() < 0.05;
    const color = isGold ? palette[3] : palette[Math.floor(Math.random() * 3)];

    dustColors[i * 3] = color.r;
    dustColors[i * 3 + 1] = color.g;
    dustColors[i * 3 + 2] = color.b;

    dustSizes[i] = 0.5 + Math.random() * 1.4;

}

const dustGeometry = new THREE.BufferGeometry();
dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
dustGeometry.setAttribute("color", new THREE.BufferAttribute(dustColors, 3));

const dustMaterial = new THREE.PointsMaterial({
    size: 1.1,
    map: glowTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
});

const dustPoints = new THREE.Points(dustGeometry, dustMaterial);
dustGroup.add(dustPoints);

// ============================================
// NEBULA CLOUDS — large, very soft drifting glows
// ============================================

const cloudSpecs = [
    { color: 0x8b5cf6, x: -22, y: 8, z: -30, scale: 46 },
    { color: 0xf472b6, x: 24, y: -6, z: -25, scale: 40 },
    { color: 0x5eead4, x: 10, y: 16, z: -40, scale: 34 },
    { color: 0x6d28d9, x: -14, y: -14, z: -35, scale: 38 },
    { color: 0xf472b6, x: 0, y: 0, z: -55, scale: 55 }
];

const nebulaClouds = [];

cloudSpecs.forEach((spec, i) => {

    const material = new THREE.SpriteMaterial({
        map: glowTexture,
        color: spec.color,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const sprite = new THREE.Sprite(material);
    sprite.position.set(spec.x, spec.y, spec.z);
    sprite.scale.set(spec.scale, spec.scale, 1);
    sprite.userData.floatOffset = i * 1.7;
    sprite.userData.baseY = spec.y;
    sprite.userData.baseX = spec.x;

    nebulaClouds.push(sprite);
    cloudGroup.add(sprite);

});

// ============================================
// CLOCK & MOUSE
// ============================================

const clock = new THREE.Clock();

const mouse = { x: 0, y: 0 };

window.addEventListener("mousemove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// ============================================
// RESIZE
// ============================================

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// ============================================
// ANIMATION LOOP
// ============================================

function animate() {

    requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();

    starGroup.rotation.y += 0.0003;

    dustGroup.rotation.y += 0.0008;
    dustGroup.rotation.x = Math.sin(elapsed * 0.05) * 0.05;

    nebulaClouds.forEach((sprite, i) => {
        sprite.position.y = sprite.userData.baseY + Math.sin(elapsed * 0.08 + sprite.userData.floatOffset) * 2.5;
        sprite.position.x = sprite.userData.baseX + Math.cos(elapsed * 0.06 + sprite.userData.floatOffset) * 2;
        sprite.material.opacity = 0.12 + Math.sin(elapsed * 0.15 + i) * 0.05;
    });

    // gentle autonomous drift, layered under mouse parallax
    const driftX = Math.sin(elapsed * 0.06) * 1.4;
    const driftY = Math.cos(elapsed * 0.05) * 0.9;

    camera.position.x += ((mouse.x * 1.6 + driftX) - camera.position.x) * 0.025;
    camera.position.y += ((mouse.y * 1.1 + driftY) - camera.position.y) * 0.025;

    camera.lookAt(scene.position);

    renderer.render(scene, camera);

}

animate();
