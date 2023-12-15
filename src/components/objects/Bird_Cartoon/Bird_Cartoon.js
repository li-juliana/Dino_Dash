import { Group, AnimationMixer, AnimationClip} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './Bird_Cartoon.glb';

class Bird_Cartoon extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            mixer: null,
            prev_timestamp: null,
        };

        this.name = 'Bird_Cartoon';

        // Load object
        const loader = new GLTFLoader();
        // Model from THREE.js
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
            const mixer = new AnimationMixer(gltf.scene);
            var bird_fly = AnimationClip.findByName(gltf.animations, 'parrot_A_');
            const action = mixer.clipAction(bird_fly);
            action.play();

            this.state.mixer = mixer;
        });

        // Adjust size of bird
        this.scale.x = 0.02;
        this.scale.y = 0.02;
        this.scale.z = 0.02;

        // TODO: Fix positioning
        this.position.z = 5;
        this.position.y = 0;

        // Rotate the bird to face the dinosaur
        this.rotation.y = 180 * Math.PI / 180;

        // Add self to parent's update list (for animation each frame)
        parent.addToUpdateList(this);
    }

    update(timeStamp) {
        if (this.state.prev_timestamp == null){
            this.state.prev_timestamp = timeStamp;
        }

        // Update animation
        var delta = (timeStamp - this.state.prev_timestamp) / 750;
        if (this.state.mixer){
            this.state.mixer.update(delta);
        }
        this.state.prev_timestamp = timeStamp;
    }
}

export default Bird_Cartoon;
