import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './Parrot.glb';

class Parrot extends Group {
    // CODE BASED OFF OF FLOWER CODE. NEED TO MODIFY
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Load object
        const loader = new GLTFLoader();

        this.name = 'Parrot';
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });

        // Adjust size of bird
        this.scale.x = 0.03;
        this.scale.y = 0.03;
        this.scale.z = 0.03;

        // Move bird out of site for now
        this.position.z = 5; // TODO: Fix positioning
    }
}

export default Parrot;
