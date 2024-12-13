import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';
import { DragControls } from 'three/addons/controls/DragControls.js';
import { gsap } from 'gsap'; 

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8ff618);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });  
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('threejs-container').appendChild(renderer.domElement);

// Define modal content for each cartoon
const cartoonModalContents = [
    {
        title: "Lionel Messi",
        content: "Lionel Messi is an Argentine professional footballer.",
        details: [
            "Position: Forward",
            "Club: Inter Miami CF",
            "Nationality: Argentine"
        ]
    },
  
    {
        title: "Bruno Fernandes",
        content: "Bruno Fernandes is a Portuguese professional footballer.",
        details: [
            "Position: Attacking Midfielder",
            "Club: Manchester United",
            "Nationality: Portuguese"
        ]
    },
    {
        title: "Harry Kane",
        content: "Harry Kane is an English professional footballer.",
        details: [
            "Position: Striker",
            "Club: Bayern Munich",
            "Nationality: English"
        ]
    },
    {
        title: "Son Heung-min",
        content: "Son Heung-min is a South Korean professional footballer.",
        details: [
            "Position: Forward",
            "Club: Tottenham Hotspur",
            "Nationality: South Korean"
        ]
    },
    {
        title: "Kylian Mbappe",
        content: "Kylian Mbappe is a France professional footballer.",
        details: [
            "Position: Forward",
            "Club: Real Madrid",
            "Nationality: France"
        ]
    }
];

// Updated modal styles
const modalStyles = `
    .cartoon-modal {
        position: absolute;
        background-color: white;
        border: 2px solid #333;
        border-radius: 10px;
        padding: 20px;
        z-index: 1000;
        display: none;
        max-width: 350px;
        width: 100%;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .cartoon-modal h2 {
        margin-top: 0;
        color: #333;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
    }
    .cartoon-modal p {
        color: #666;
        margin-bottom: 15px;
    }
    .cartoon-modal ul {
        list-style-type: disc;
        padding-left: 20px;
        color: #555;
    }
    .close-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #999;
        transition: color 0.3s ease;
    }
`;

const styleElement = document.createElement('style');
styleElement.textContent = modalStyles;
document.head.appendChild(styleElement);

// Create modal element with more flexible content structure
const modal = document.createElement('div');
modal.classList.add('cartoon-modal');
modal.innerHTML = `
    <button class="close-btn">&times;</button>
    <h2>Player Details</h2>
    <p></p>
    <ul></ul>
`;

document.body.appendChild(modal);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);

// Spheres setup
const spheres = [];
const colors = [
    0xff6347,  
    0x4169e1,   
    0x32cd32,   
    0xff4500,  
    0x9370DB,  
    0x20B2AA  
];

// More spread out screen positioning
const spherePositions = [
    { x: -window.innerWidth/1.7, y: window.innerHeight/2, z: -300 }, 
    { x: 0, y: window.innerHeight/1.5, z: -300 }, 
    { x: window.innerWidth/1.5, y: window.innerHeight/3, z: -300 }, 
    { x: -window.innerWidth/1.5, y: -window.innerHeight/1.5, z: -300 }, 
    { x: 0, y: -window.innerHeight/2, z: -300 },       
    { x: window.innerWidth/1.4, y: -window.innerHeight/1.5, z: -300 } 
];

function createAndPositionSpheres() {
    for (let i = 0; i < colors.length; i++) {
        const geometry = new THREE.SphereGeometry(120, 64, 64);
        
        // Create a glowing material with blur effect
        const material = new THREE.MeshStandardMaterial({ 
            color: colors[i],
            emissive: colors[i], 
            emissiveIntensity: 0.5, 
            opacity: 0.8,  
            transparent: true,
            roughness: 0.2,  
            metalness: 0.11   
        });

        const sphere = new THREE.Mesh(geometry, material);
        
        // Set fixed position with more spread
        sphere.position.set(
            spherePositions[i].x, 
            spherePositions[i].y, 
            spherePositions[i].z
        );

        sphere.castShadow = true;
        sphere.receiveShadow = true;

        sphere.userData = {
            originalY: sphere.position.y,
            bouncingSpeed: 1 + Math.random(), // Unique bouncing speed
            bouncingAmplitude: 20 + Math.random(), // Unique bouncing amplitude
            phaseOffset: Math.random() * Math.PI * 2 // Unique phase offset
        };

        scene.add(sphere);
        spheres.push(sphere);
    }
}

createAndPositionSpheres();

// Create cartoon images
const textureLoader = new THREE.TextureLoader();
const cartoonImages = [
    'assets/[CITYPNG.COM]Leo Messi Football Player Pixar Character - 2000x2000.png',
    'assets/[CITYPNG.COM]Bruno Fernandes Pixar Football Character - 2000x2000.png',
    'assets/[CITYPNG.COM]Harry Kane Footballer Chibi Character Player - 2000x2000.png',
    'assets/[CITYPNG.COM]Son Tottenham FC Football Player Chibi Character - 2000x2000.png',
    'assets/[CITYPNG.COM]Kylian Mbappé Chibi France Football Player - 2000x2000.png',
];

// Predefined cartoon positions
const cartoonPositions = [
    { x: -window.innerWidth / 4, y: window.innerHeight / 9, z: 100 }, 
    { x: 0, y: window.innerHeight / 5, z: 100 }, 
    { x: window.innerWidth / 3, y: window.innerHeight / 10, z: 100 }, //top right
    { x: window.innerWidth /7, y: -window.innerHeight / 9, z: 100 }, //bottom behind
    { x: -window.innerWidth / 7, y: -window.innerHeight /5, z: 100 } 
];

// Enhanced cartoon creation with fixed positioning
function createCartoonMeshes(scene, textureLoader) {
    const cartoons = [];
    cartoonImages.forEach((imagePath, i) => {
        const texture = textureLoader.load(imagePath);
        
        const material = new THREE.MeshBasicMaterial({ 
            map: texture,
            transparent: true,
        });

        const geometry = new THREE.PlaneGeometry(250, 250);
        const cartoon = new THREE.Mesh(geometry, material);

        cartoon.renderOrder = 1000;  
        cartoon.scale.set(1, 1, 1);

        // Use predefined position
        const position = cartoonPositions[i];
        cartoon.position.set(position.x, position.y, position.z);

        scene.add(cartoon);
        cartoons.push(cartoon);
    });

    return cartoons;
}

// Create cartoon meshes
const cartoons = createCartoonMeshes(scene, textureLoader);

// Raycaster for click interactions
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// Track dragging state
let isDragging = false;

// Close modal function
function closeModal() {
    modal.style.display = 'none';
    
    // Reset any focused cartoon
    cartoons.forEach(cartoon => {
        if (cartoon.userData.isFocused) {
            // Reset cartoon
            gsap.to(cartoon.scale, {
                x: 1,
                y: 1,
                duration: 0.5,
                ease: "power2.inOut"
            });
            
            // Reset opacity for other cartoons and spheres
            cartoons.forEach(c => {
                gsap.to(c.material, {
                    opacity: 1,
                    duration: 0.5
                });
            });
            
            spheres.forEach(sphere => {
                gsap.to(sphere.material, {
                    opacity: 0.8,
                    duration: 0.5
                });
            });
            
            cartoon.userData.isFocused = false;
        }
    });

    // Reset camera
    gsap.to(camera.position, {
        x: 0,
        y: 0,
        z: 600,
        duration: 0.5,
        ease: "power2.inOut"
    });

    // Re-enable drag controls
    dragControls.enabled = true;
}

// Function to convert Three.js world coordinates to screen coordinates
function worldToScreen(position) {
    const vector = position.clone().project(camera);
    vector.x = (vector.x + 1) / 2 * window.innerWidth;
    vector.y = -(vector.y - 1) / 2 * window.innerHeight;
    return vector;
}

// Enhanced modal positioning function
function positionModal(selectedCartoon) {
    // Calculate screen position of the clicked cartoon
    const screenPos = worldToScreen(selectedCartoon.position);

    // Get modal dimensions
    const modalWidth = 350; 
    const modalHeight = 300; 

    // Calculate screen boundaries
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Determine modal positioning
    let left, top;

    // Horizontal positioning
    if (screenPos.x + modalWidth > screenWidth) {
        left = screenPos.x - modalWidth - 20;
    } else {
        left = screenPos.x + 260;
    }

    // Vertical positioning
    if (screenPos.y + modalHeight > screenHeight) {
        top = screenPos.y - modalHeight - 20;
    } else {
        top = screenPos.y - 50;
    }

    // Ensure modal stays within screen boundaries
    left = Math.max(0, Math.min(left, screenWidth - modalWidth));
    top = Math.max(0, Math.min(top, screenHeight - modalHeight));

    modal.style.display = 'block';
    modal.style.left = `${left}px`;
    modal.style.top = `${top}px`;
}

// Modify the focusOnCartoon function to update modal content
function focusOnCartoon(selectedCartoon) {
    // Check if this cartoon is already focused
    if (selectedCartoon.userData.isFocused) {
        return;
    }

    // Reset any previously focused cartoon
    cartoons.forEach(cartoon => {
        if (cartoon.userData.isFocused) {
            cartoon.userData.isFocused = false;
            gsap.to(cartoon.scale, {
                x: 1,
                y: 1,
                duration: 0.5
            });
        }
    });

    // Disable other interactions during focus
    dragControls.enabled = false;

    // Mark this cartoon as focused
    selectedCartoon.userData.isFocused = true;

    // Find the index of the selected cartoon
    const cartoonIndex = cartoons.indexOf(selectedCartoon);
    const modalContent = cartoonModalContents[cartoonIndex];

    // Update modal content dynamically
    const modalTitle = modal.querySelector('h2');
    modalTitle.textContent = modalContent.title;

    // Create or update content paragraph
    let contentParagraph = modal.querySelector('p');
    contentParagraph.textContent = modalContent.content;

    // Create or update details list
    let detailsList = modal.querySelector('ul');
    detailsList.innerHTML = ''; // Clear previous details
    modalContent.details.forEach(detail => {
        const li = document.createElement('li');
        li.textContent = detail;
        detailsList.appendChild(li);
    });

    // Animate cartoon with less extreme scaling (smaller zoom)
    gsap.to(selectedCartoon.scale, {
        x: 1.2,  // Reduced scale
        y: 1.2,  // Reduced scale
        duration: 0.5,
        ease: "power2.inOut"
    });

    // Dim other cartoons
    cartoons.forEach(cartoon => {
        if (cartoon !== selectedCartoon) {
            gsap.to(cartoon.material, {
                opacity: 0.3,
                duration: 0.5
            });
        }
    });

    // Dim spheres
    spheres.forEach(sphere => {
        gsap.to(sphere.material, {
            opacity: 0.2,
            duration: 0.5
        });
    });

    // Position and show modal
    positionModal(selectedCartoon);

    // Slight camera movement towards the cartoon
    gsap.to(camera.position, {
        x: selectedCartoon.position.x * 0.5,
        y: selectedCartoon.position.y * 0.5,
        z: 550,  
        duration: 0.5,
        ease: "power2.inOut"
    });
}

// Helper function to get image data
function getImageData(image) {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, image.width, image.height);
    return ctx.getImageData(0, 0, image.width, image.height);
}

function isPixelTransparent(imageData, uv) {
    const x = Math.floor(uv.x * imageData.width);
    const y = Math.floor(uv.y * imageData.height);
    const index = (y * imageData.width + x) * 4 + 3; 
    return imageData.data[index] < 10; 
}

// Click event for showing modal
function onMouseClick(event) {
    // Prevent modal during drag
    if (isDragging) {
        isDragging = false;
        return;
    }

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(cartoons);

    if (intersects.length > 0) {
        const selectedCartoon = intersects[0].object;
        const uv = intersects[0].uv;
        const texture = selectedCartoon.material.map;
        
        if (texture) {
            const imageData = getImageData(texture.image);
            if (isPixelTransparent(imageData, uv)) {
                return; 
            }
        }
        
        // Use focus function
        focusOnCartoon(selectedCartoon);
    }
}


renderer.domElement.addEventListener('click', onMouseClick, false);

// Close modal when clicking outside
function handleOutsideClick(event) {
    // Check if the click is outside the modal and not on a cartoon
    if (modal.style.display === 'block') {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(cartoons);

        // Close modal if not clicking on a cartoon and not clicking inside the modal
        if (intersects.length === 0 && !modal.contains(event.target)) {
            closeModal();
        }
    }
}

document.addEventListener('click', handleOutsideClick, false);

// Add close button functionality to modal
const closeButton = modal.querySelector('.close-btn');
closeButton.addEventListener('click', closeModal);

// Enhanced Drag Controls specifically for cartoons
const dragControls = new DragControls(cartoons, camera, renderer.domElement);
dragControls.addEventListener('dragstart', function (event) {
    event.object.renderOrder = 2000; 
    renderer.domElement.style.cursor = 'grabbing';
    modal.style.display = 'none';
});

dragControls.addEventListener('dragend', function (event) {
    event.object.renderOrder = 1000;
    renderer.domElement.style.cursor = 'default';
});

// Allow camera to continue tracking dragged objects
dragControls.addEventListener('drag', function (event) {
    event.object.position.z = 100; 
});

// Camera positioning
camera.position.z = 600;

// Responsive handling
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);

// Animate loop with unique bouncing spheres
let clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);

    // Unique bouncing for each sphere
    spheres.forEach((sphere, index) => {
        // Unique bouncing motion
        const userData = sphere.userData;
        const elapsedTime = clock.getElapsedTime();
        
        // Calculate vertical position with unique parameters
        const verticalOffset = Math.sin(elapsedTime * userData.bouncingSpeed + userData.phaseOffset) 
                                * userData.bouncingAmplitude;
        
        sphere.position.y = userData.originalY + verticalOffset;
    });

    cartoons.forEach((cartoon, index) => {
        cartoon.position.y += Math.sin(clock.getElapsedTime() + index) * 0.3;
    });

    renderer.render(scene, camera);
}

// Continue button functionality
document.getElementById('continue-btn').addEventListener('click', function() {
    window.location.href = 'page1.html';
});

animate();