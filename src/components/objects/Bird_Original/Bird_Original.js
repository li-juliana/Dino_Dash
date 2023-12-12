import { Group, AnimationMixer, AnimationClip} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './Bird_Original.gltf';

class Bird_Original extends Group {
    // CODE BASED OFF OF FLOWER CODE. NEED TO MODIFY
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            mixer: null,
            prev_timestamp: null,
        };

        this.name = 'Bird_Original';

        // Load object
        const loader = new GLTFLoader();
        // chrome Pteranodon by the_goobadooba is found on Sketchfab 
        // and is licensed under Creative Commons Attribution
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
            const mixer = new AnimationMixer(gltf.scene);
            var bird_fly = AnimationClip.findByName(gltf.animations, 'pteranodon flying');
            const action = mixer.clipAction(bird_fly);
            action.play();

            this.state.mixer = mixer;
        });

        // Adjust size of bird
        this.scale.x = 1;
        this.scale.y = 1;
        this.scale.z = 1;

        // TODO: Fix positioning
        this.position.z = 5;
        this.position.y = -1;

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

export default Bird_Original;
