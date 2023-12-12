import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './Cloud.glb';

class Cloud extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'Cloud';

        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });

        this.position.y = 20;
    }
}

export default Cloud;
