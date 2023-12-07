import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';

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
        case 'Space':
            keys.jump.pressed = false;
            break;
    }
}

/******************** Handle Character Movements **********************/
export function handleMovement(scene){
    // const player = scene.getObjectByName("Trex_Original");
    // // const player = scene.getObjectByName("Trex_Realistic");
    // // const player = scene.getObjectByName("Trex_Cartoon");
    // const floor_y = scene.getObjectByName("Land").position.y;
    // // TODO: Modify transition objects and jump height to allow dino to jump over obstacles
    // const jumpUp = new TWEEN.Tween(player.position).to({ y: floor_y + 3 }, 250 ).easing(TWEEN.Easing.Quadratic.Out);
    // const fallDown = new TWEEN.Tween(player.position).to({ y: floor_y}, 400).easing(TWEEN.Easing.Quadratic.In);
    
    // // Movement along the x-axis
    // if(keys.left.pressed){
    //     player.position.x += 0.03;
    // } else if (keys.right.pressed){
    //     player.position.x -= 0.03;
    // } 
    
    // // Movement along the y-axis
    // // Only jump if the dinosaur is on floor (prevents floating)
    // if (keys.jump.pressed && player.position.y == floor_y){
    //     // jumpUp.onComplete(() => fallDown.start());
    //     // jumpUp.start();
    //     // player.update();
    // } else if (keys.down.pressed){
    //     // TODO: make dinosaur fall down faster when down key is pressed
    // }
}
