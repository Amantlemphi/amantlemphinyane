// ============================================
// THREE.JS ABSTRACT 3D BACKGROUND — NAVY BLUE THEME
// ============================================

const canvas = document.querySelector("#scene");

const scene = new THREE.Scene();

scene.fog = new THREE.FogExp2(0x040a1a, 0.018);

// ============================================
// CAMERA
// ============================================

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 0, 14);

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
// LIGHTS
// ============================================

scene.add(new THREE.AmbientLight(0x3a5fc9, 0.5));

const blueLight = new THREE.PointLight(0x2f6fed, 6, 70);
blueLight.position.set(9, 5, 6);
scene.add(blueLight);

const cyanLight = new THREE.PointLight(0x38d9ff, 5, 70);
cyanLight.position.set(-8, -4, 5);
scene.add(cyanLight);

const indigoLight = new THREE.PointLight(0x1b3a8a, 5, 70);
indigoLight.position.set(0, 8, -6);
scene.add(indigoLight);

// ============================================
// GROUPS
// ============================================

const galaxyGroup = new THREE.Group();
const objectsGroup = new THREE.Group();

scene.add(galaxyGroup);
scene.add(objectsGroup);

// ============================================
// STARFIELD
// ============================================

const starCount = 2600;
const starPositions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount; i++) {
    const radius = 40 + Math.random() * 60;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    starPositions[i * 3 + 2] = radius * Math.cos(phi);
}

const starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));

const starMaterial = new THREE.PointsMaterial({
    color: 0x9fc6ff,
    size: 0.09,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true
});

galaxyGroup.add(new THREE.Points(starGeometry, starMaterial));

// ============================================
// ABSTRACT FLOATING SHAPES
// ============================================

const shapeMaterials = [
    new THREE.MeshBasicMaterial({ color: 0x38d9ff, wireframe: true, transparent: true, opacity: 0.16 }),
    new THREE.MeshBasicMaterial({ color: 0x2f6fed, wireframe: true, transparent: true, opacity: 0.14 }),
    new THREE.MeshBasicMaterial({ color: 0x7dd3fc, wireframe: true, transparent: true, opacity: 0.12 })
];

const geometries = [
    new THREE.IcosahedronGeometry(1.6, 0),
    new THREE.TorusGeometry(1.3, 0.4, 8, 24),
    new THREE.OctahedronGeometry(1.5, 0),
    new THREE.TorusKnotGeometry(1, 0.3, 64, 8)
];

// Shapes are ringed around the outer edge of the viewport (avoiding the
// centered content column) and pushed back in Z so they read as soft
// ambient motion rather than competing with foreground text.
const floatingShapes = [];
const shapeCount = 7;

for (let i = 0; i < shapeCount; i++) {

    const geometry = geometries[i % geometries.length];
    const material = shapeMaterials[i % shapeMaterials.length];
    const mesh = new THREE.Mesh(geometry, material);

    const angle = (i / shapeCount) * Math.PI * 2 + Math.random() * 0.5;
    const dist = 15 + Math.random() * 9;

    mesh.position.set(
        Math.cos(angle) * dist,
        Math.sin(angle) * dist * 0.55,
        -14 - Math.random() * 16
    );

    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

    const scale = 0.4 + Math.random() * 0.5;
    mesh.scale.set(scale, scale, scale);

    mesh.userData.spinSpeed = {
        x: (Math.random() - 0.5) * 0.004,
        y: (Math.random() - 0.5) * 0.004
    };

    mesh.userData.floatOffset = Math.random() * Math.PI * 2;

    floatingShapes.push(mesh);
    objectsGroup.add(mesh);

}

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

    galaxyGroup.rotation.y += 0.0006;

    objectsGroup.rotation.y += 0.0006;
    objectsGroup.rotation.x = Math.sin(elapsed * 0.2) * 0.06;

    floatingShapes.forEach((mesh) => {
        mesh.rotation.x += mesh.userData.spinSpeed.x;
        mesh.rotation.y += mesh.userData.spinSpeed.y;
        mesh.position.y += Math.sin(elapsed * 0.6 + mesh.userData.floatOffset) * 0.003;
    });

    camera.position.x += ((mouse.x * 1.5) - camera.position.x) * 0.04;
    camera.position.y += ((mouse.y * 1.2) - camera.position.y) * 0.04;

    camera.lookAt(scene.position);

    renderer.render(scene, camera);

}

animate();
