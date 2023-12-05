const keys = {
    left:{
        pressed: false
    },
    right: {
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
        // Jump
        case 'Space':
            keys.jump.pressed = false;
            break;
    }
}

/******************** Handle Character Movements **********************/
export function handleMovement(scene){
    var player = scene.getObjectByName("flower");
    // Movement along the x-axis
    if(keys.left.pressed){
        player.position.x += 0.1;
    } else if (keys.right.pressed){
        player.position.x -= 0.1;
    } 
    
    // Movement along the y-axis
    if (keys.jump.pressed){
        console.log("jump");
    }
}
