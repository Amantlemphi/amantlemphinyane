// ============================================
// THREE.JS SCENE
// ============================================

const canvas = document.querySelector("#scene");

const scene = new THREE.Scene();

scene.fog = new THREE.FogExp2(
    0x050816,
    0.02
);

// ============================================
// CAMERA
// ============================================

const camera = new THREE.PerspectiveCamera(

    60,

    window.innerWidth / window.innerHeight,

    0.1,

    1000

);

camera.position.set(0,0,12);

scene.add(camera);

// ============================================
// RENDERER
// ============================================

const renderer = new THREE.WebGLRenderer({

    canvas,

    antialias:true,

    alpha:true

});

renderer.setPixelRatio(

    Math.min(window.devicePixelRatio,2)

);

renderer.setSize(

    window.innerWidth,

    window.innerHeight

);

renderer.outputEncoding = THREE.sRGBEncoding;

renderer.shadowMap.enabled = true;

renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// ============================================
// LIGHTS
// ============================================

const ambientLight = new THREE.AmbientLight(

    0xffffff,

    0.45

);

scene.add(ambientLight);

const blueLight = new THREE.PointLight(

    0x4f8cff,

    6,

    60

);

blueLight.position.set(

    8,

    5,

    6

);

scene.add(blueLight);

const cyanLight = new THREE.PointLight(

    0x00e5ff,

    5,

    60

);

cyanLight.position.set(

    -8,

    -4,

    5

);

scene.add(cyanLight);

const purpleLight = new THREE.PointLight(

    0x8b5cf6,

    5,

    60

);

purpleLight.position.set(

    0,

    8,

    -5

);

scene.add(purpleLight);

// ============================================
// STAR MATERIAL
// ============================================

const starMaterial = new THREE.PointsMaterial({

    color:0xffffff,

    size:0.05,

    transparent:true,

    opacity:0.9

});

// ============================================
// CLOCK
// ============================================

const clock = new THREE.Clock();

// ============================================
// MOUSE
// ============================================

const mouse = {

    x:0,

    y:0

};

window.addEventListener("mousemove",(e)=>{

    mouse.x =

        (e.clientX/window.innerWidth)*2-1;

    mouse.y =

        -(e.clientY/window.innerHeight)*2+1;

});

// ============================================
// GROUPS
// ============================================

const galaxyGroup = new THREE.Group();

const objectsGroup = new THREE.Group();

scene.add(galaxyGroup);

scene.add(objectsGroup);

// ============================================
// RESIZE
// ============================================

window.addEventListener("resize",()=>{

    camera.aspect =

        window.innerWidth/

        window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(

        window.innerWidth,

        window.innerHeight

    );

    renderer.setPixelRatio(

        Math.min(window.devicePixelRatio,2)

    );

});

// ============================================
// ANIMATION LOOP
// ============================================

function animate(){

    requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();

    // Galaxy rotation
    galaxyGroup.rotation.y += 0.0008;

    // Floating objects
    objectsGroup.rotation.y += 0.001;

    objectsGroup.rotation.x =
        Math.sin(elapsed*0.25)*0.08;

    // Camera movement
    camera.position.x +=
        ((mouse.x*1.5)-camera.position.x)
        *0.04;

    camera.position.y +=
        ((mouse.y*1.2)-camera.position.y)
        *0.04;

    camera.lookAt(scene.position);

    renderer.render(scene,camera);

}

animate();