// Three.js Scene Setup
let scene, camera, renderer, controls;

function init() {
    // Create a scene
    scene = new THREE.Scene();

    // Set up camera (Perspective Camera)
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 0.1); // Slightly inside the sphere

    // Set up renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Load 360 Image as a texture
    let textureLoader = new THREE.TextureLoader();
    let texture = textureLoader.load("images/0002000.jpg"); // Ensure the image is in the "public" folder

    // Create a sphere and invert it (to view from inside)
    let geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // Invert the sphere to be viewed from inside
    let material = new THREE.MeshBasicMaterial({ map: texture });
    let sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Orbit Controls for rotation
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false; // Disable zoom to prevent breaking effect
    controls.enablePan = false; // Disable panning
    controls.enableDamping = true; // Smooth rotation
    controls.dampingFactor = 0.03; // Smooth rotation factor

    // Handle Window Resizing
    window.addEventListener("resize", () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    animate();
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Initialize the viewer
init();
