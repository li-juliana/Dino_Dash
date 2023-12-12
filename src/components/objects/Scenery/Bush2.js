import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './Bush2.glb';

class Bush2 extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'Bush2';

        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });

        this.position.y = -1;
        this.scale.y = 2;
        this.scale.x = 2;
        this.scale.z = 2;
    }
}

export default Bush2;
