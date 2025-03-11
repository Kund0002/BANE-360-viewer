let scene, camera, renderer, controls;
let sphereMaterial;

// Initialize the 360 Viewer
function initViewer(initialImage) {
    // Create a scene
    scene = new THREE.Scene();

    // Set up camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 0.1);

    // Set up renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("viewer-container").appendChild(renderer.domElement);

    // Load initial image
    let textureLoader = new THREE.TextureLoader();
    textureLoader.load(
        `images/${initialImage}`,
        function (texture) {
            // Create a sphere and invert it
            let geometry = new THREE.SphereGeometry(500, 60, 40);
            geometry.scale(-1, 1, 1);
            sphereMaterial = new THREE.MeshBasicMaterial({ map: texture });
            let sphere = new THREE.Mesh(geometry, sphereMaterial);
            scene.add(sphere);

            // Add Orbit Controls
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableZoom = false;
            controls.enablePan = false;
            controls.enableDamping = true; // Smooth rotation
            controls.dampingFactor = 0.03; // Smooth rotation factor

            // Handle Window Resizing
            window.addEventListener("resize", () => {
                renderer.setSize(window.innerWidth, window.innerHeight);
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
            });

            animate();
        },
        undefined,
        function (err) {
            console.error('An error occurred loading the texture:', err);
        }
    );
}

// Function to update the 360 image
function updateViewer(newImage) {
    let textureLoader = new THREE.TextureLoader();
    textureLoader.load(
        `images/${newImage}`,
        function (texture) {
            sphereMaterial.map = texture;
            sphereMaterial.needsUpdate = true;
        },
        undefined,
        function (err) {
            console.error('An error occurred loading the texture:', err);
        }
    );
}

// Fetch and display available images in the sidebar
function loadSidebarImages() {
    fetch("/api/images")
        .then(response => response.json())
        .then(images => {
            const sidebar = document.getElementById("sidebar");

            // Load the first image in the viewer
            if (images.length > 0) {
                initViewer(images[0]);
            }

            // Add images to the sidebar
            images.forEach(image => {
                let imgElement = document.createElement("img");
                imgElement.src = `images/${image}`;
                imgElement.className = "thumbnail";
                imgElement.addEventListener("click", () => updateViewer(image));
                sidebar.appendChild(imgElement);
            });
        })
        .catch(error => console.error("Error loading images:", error));
}

// Load images into the sidebar
loadSidebarImages();

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
