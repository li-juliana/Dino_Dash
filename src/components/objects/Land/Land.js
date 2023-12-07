import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './land.gltf';

class Land extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'Land';

        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });

        this.scale.x = 2;
        this.scale.z = 100;

        this.position.y = -1;
        this.position.z = 10;
    }
}

export default Land;
