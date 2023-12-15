import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './Cloud.glb';

class Cloud extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'Cloud';

        // Model by Jiří Kuba and found at Sketchfab is licensed under 
        // Creative Commons Attribution
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });

        this.position.y = 20;
    }
}

export default Cloud;
