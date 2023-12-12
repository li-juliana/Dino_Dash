import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './Rock2.glb';

class Rock2 extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'Rock2';

        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });

        this.position.y = -1;

        // Randomize rock size
        var scale = (Math.random() * 2) + 3;
        this.scale.x = scale;
        this.scale.y = scale;
        this.scale.z = scale;
    }
}

export default Rock2;