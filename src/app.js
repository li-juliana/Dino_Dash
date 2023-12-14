/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene } from 'scenes';
import * as event_handlers from './js/EventHandlers.js';
import StartScreen from './components/scenes/StartScreen.js';

/********************* Initialize Start Screen **************************/
const startScreen = new StartScreen(startGame);

/*********************** Start Game Function ***************************/
let scene = null; 

function startGame() {
    startScreen.hide();
    scene = new SeedScene();
    scene.startGame()    
}

/***************** Initialize core ThreeJS components *****************/
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });

/********************* Set Up Camera **********************************/
camera.position.set(-3, 3, -10);
camera.lookAt(new Vector3(0, 0, 5));

/*********** Set up renderer, canvas, and minor CSS adjustments *******/
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

/********************* Set Up Controls ********************************/
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = 16;
controls.update();

/*********************** Render loop **********************************/
const onAnimationFrameHandler = (timeStamp) => {
    controls.update();
    if (scene) { // Check if SeedScene has been initialized
        renderer.render(scene, camera);
        scene.update && scene.update(timeStamp);
        event_handlers.handleMovement(scene);
    }
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);
/*********************** Resize Handler *******************************/
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();

/*********************** Event Handlers *******************************/
window.addEventListener('resize', windowResizeHandler, false);
window.addEventListener('keydown', event_handlers.handleKeyDown, false);
window.addEventListener('keyup', event_handlers.handleKeyUp, false);
