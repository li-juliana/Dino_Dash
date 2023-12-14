import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';

const EPS = 0.00001;
const keys = {
    left:{
        pressed: false
    },
    right: {
        pressed: false
    },
    down: {
        pressed: false
    },
    up:{
        pressed: false
    },
    jump: {
        pressed: false
    },
};

/******************** Handle Keyboard Controls ************************/
export function handleKeyDown(event){
    // Ignore keypresses typed into a text box
    if (event.target.tagName === "INPUT") {
        return;
    }
    switch(event.code) {
        // Left
        case 'KeyA':
        case 'ArrowLeft':
            keys.left.pressed = true;
            break;
        // Right
        case 'KeyD':
        case 'ArrowRight':
            keys.right.pressed = true;
            break;
        // Down
        case 'KeyS':
        case 'ArrowDown':
            keys.down.pressed = true;
            break;
        // Jump
        case 'ArrowUp':
            keys.jump.pressed = true;
            break;
        case 'Space':
            keys.jump.pressed = true;
            break;
    }
}

export function handleKeyUp(event){
    // Ignore keypresses typed into a text box
    if (event.target.tagName === "INPUT") {
        return;
    }
    switch(event.code) {
        // Left
        case 'KeyA':
        case 'ArrowLeft':
            keys.left.pressed = false;
            break;
        // Right
        case 'KeyD':
        case 'ArrowRight':
            keys.right.pressed = false;
            break;
        // Down
        case 'KeyS':
        case 'ArrowDown':
            keys.down.pressed = false;
            break;
        // Jump
        case 'ArrowUp':
            keys.jump.pressed = false;
            break;
        case 'Space':
            keys.jump.pressed = false;
            break;
    }
}

/******************** Handle Character Movements **********************/
export function handleMovement(scene){
    var player_name = "Trex_" + scene.state.style;
    const player = scene.getObjectByName(player_name);
    let land = scene.getObjectByName("Land2");
    let offset = 1;

    var floor_y = land.position.y;
    // TODO: Modify transition objects and jump height to allow dino to jump over obstacles
    const jumpUp = new TWEEN.Tween(player.position).to({ y: floor_y + 3 }, 200 ).easing(TWEEN.Easing.Quadratic.Out);
    const fallDown = new TWEEN.Tween(player.position).to({ y: floor_y}, 400).easing(TWEEN.Easing.Quadratic.In);
    const jumpUpCartoon = new TWEEN.Tween(player.position).to({ y: -0.4 + 3 }, 200 ).easing(TWEEN.Easing.Quadratic.Out);
    const fallDownCartoon = new TWEEN.Tween(player.position).to({ y: -0.4}, 400).easing(TWEEN.Easing.Quadratic.In);
    
    // Movement along the x-axis
    if(keys.left.pressed && !scene.state.gamePaused && scene.state.in_game){
        // Only move left if still on the land
        if (player.position.x + 0.05 <= land.scale.x + offset){
            if (scene.state.style == "Realistic"){
                player.position.x += 0.1
            } else {
                player.position.x += 0.05;
            }
        }
    } else if (keys.right.pressed && !scene.state.gamePaused && scene.state.in_game){
        // Only move right if still on the land
        if (player.position.x - 0.05 >= -1 * land.scale.x - offset){
            if (scene.state.style == "Realistic"){
                player.position.x -= 0.1
            } else {
                player.position.x -= 0.05;
            } 
        }
    } 
    
    // Movement along the y-axis
    // Only jump if the dinosaur is on floor (prevents floating)
    if (keys.jump.pressed && player.position.y == floor_y && !scene.state.gamePaused && scene.state.in_game){
        jumpUp.onComplete(() => fallDown.start());
        jumpUp.start();
    } else if (player.name == "Trex_Cartoon" && keys.jump.pressed && Math.abs(player.position.y + 0.4) <= EPS && !scene.state.gamePaused && scene.state.in_game) {
        jumpUpCartoon.onComplete(() => fallDownCartoon.start());
        jumpUpCartoon.start();
    }
    else if (keys.down.pressed){
        // TODO: make dinosaur fall down faster when down key is pressed
    }
}