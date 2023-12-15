import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './Cactus1.glb';

class Cactus1 extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'Cactus1';
        // Model by Quaternius and found at Quaternius.com is licensed under 
        // Creative Commons Attribution
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });

        this.position.y = -1;
        this.scale.y = 2;
        this.scale.x = 2;
        this.scale.z = 2;

        this.rotation.y = -Math.PI/2;
    }
}

export default Cactus1;
