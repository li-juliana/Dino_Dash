import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './PalmTree.glb';

class PalmTree extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'PalmTree';

        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });

        this.position.y = -1;
        this.scale.x = 4;
        this.scale.y = 4;
        this.scale.z = 4;
        this.rotation.y = -Math.PI / 2;
    }
}

export default PalmTree;