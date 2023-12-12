import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './Land2.glb';

class Land2 extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'Land2';

        // Init state
        this.state = {
            ground_y: null,
        };

        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });

        // Set dimensions of land
        this.ground_y = -1;
        this.scale.x = 2;
        this.scale.z = 1000;

        this.position.y = -1;
        this.position.z = 0;
    }
}

export default Land2;
