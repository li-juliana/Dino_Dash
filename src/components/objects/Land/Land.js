import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './land.gltf';

class Land extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'Land';

        // Init state
        this.state = {
            ground_x_left_bound: null,
            ground_x_right_bound: null,
            ground_y: null,
        };

        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });

        // Set dimensions of land
        this.ground_x_left_bound = -1.5;
        this.ground_x_right_bound = 1.5;
        this.ground_y = -1;
        this.scale.x = Math.abs(this.ground_x_left_bound - this.ground_x_right_bound);
        this.scale.z = 100;

        this.position.y = -1;
        this.position.z = 10;
    }
}

export default Land;
