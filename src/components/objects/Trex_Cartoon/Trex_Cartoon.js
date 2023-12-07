import { Group, AnimationMixer, AnimationClip, Box3} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './Trex_Cartoon.glb';

class Trex_Cartoon extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            mixer: null,
            prev_timestamp: null,
            box: null,
        };

        this.name = 'Trex_Cartoon';

        // Load object
        const loader = new GLTFLoader();
        // dinosaur walking by Drakonas15 from SketchFab and
        // is licensed under Creative Commons Attribution
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
            this.state.box = new Box3().setFromObject(gltf.scene);
            const mixer = new AnimationMixer(gltf.scene);
            var dino_walk = AnimationClip.findByName(gltf.animations, 'animation_0');
            const action = mixer.clipAction(dino_walk);
            action.play();

            this.state.mixer = mixer;
        });

        // TODO: Adjust positioning and renderer.camera position to be 
        // better suited for playing
        this.position.y = -0.4;

        // Adjust size of dinosaur
        this.scale.x = 0.35;
        this.scale.y = 0.35;
        this.scale.z = 0.5;

        // Rotate dinosaur to face forward
        this.rotation.y = 90 * Math.PI / 180;

        // Add self to parent's update list (for animation each frame)
        parent.addToUpdateList(this);
    }

    update(timeStamp) {
        if (this.state.prev_timestamp == null){
            this.state.prev_timestamp = timeStamp;
        }

        // Advance tween animations (jumping)
        // TWEEN.update();

        // Update animation
        var delta = (timeStamp - this.state.prev_timestamp) / 180;
        if (this.state.mixer){
            this.state.mixer.update(delta);
        }
        this.state.prev_timestamp = timeStamp;
    }
}

export default Trex_Cartoon;
