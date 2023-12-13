import { Group, AnimationMixer, AnimationClip, Box3} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './Trex_Realistic.glb';

class Trex_Realistic extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            mixer: null,
            prev_timestamp: null,
            box: null,
        };

        this.name = 'Trex_Realistic';

        // Load object
        const loader = new GLTFLoader();
        // Animated Tyrannosaurus Rex Dinosaur Running Loop by LasquetiSpice found on SketchFab
        // and licensed under Creative Commons Attribution
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
            this.state.box = new Box3().setFromObject(gltf.scene);
            const mixer = new AnimationMixer(gltf.scene);
            var dino_walk = AnimationClip.findByName(gltf.animations, 'run');
            const action = mixer.clipAction(dino_walk);
            action.play();

            this.state.mixer = mixer;
        });

        this.position.y = -1;
        this.position.z = -4;

        // Adjust size of dinosaur
        this.scale.x = 0.5;
        this.scale.y = 0.5;
        this.scale.z = 0.5;

        // Add self to parent's update list (for animation each frame)
        parent.addToUpdateList(this);
    }

    update(timeStamp) {
        if (this.state.prev_timestamp == null){
            this.state.prev_timestamp = timeStamp;
        }

        // Advance tween animations (jumping)
        TWEEN.update();

        // Update animation
        var delta = (timeStamp - this.state.prev_timestamp) / 400;
        if (this.state.mixer){
            this.state.mixer.update(delta);
        }
        this.state.prev_timestamp = timeStamp;
    }
}

export default Trex_Realistic;
