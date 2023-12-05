import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './Cactus1.glb';

class Cactus1 extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Load object
        const loader = new GLTFLoader();

        this.name = 'Cactus1';
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });

        // Add self to parent's update list
        parent.addToUpdateList(this);

        this.position.x = 1;
        this.position.y = -1;
    }

    // TODO: Add jump
    // Keep code here for reference (animations)
    // spin() {
    //     // Add a simple twirl
    //     this.state.twirl += 6 * Math.PI;

    //     // Use timing library for more precice "bounce" animation
    //     // TweenJS guide: http://learningthreejs.com/blog/2011/08/17/tweenjs-for-smooth-animation/
    //     // Possible easings: http://sole.github.io/tween.js/examples/03_graphs.html
    //     const jumpUp = new TWEEN.Tween(this.position)
    //         .to({ y: this.position.y + 1 }, 300)
    //         .easing(TWEEN.Easing.Quadratic.Out);
    //     const fallDown = new TWEEN.Tween(this.position)
    //         .to({ y: 0 }, 300)
    //         .easing(TWEEN.Easing.Quadratic.In);

    //     // Fall down after jumping up
    //     jumpUp.onComplete(() => fallDown.start());

    //     // Start animation
    //     jumpUp.start();
    // }

    update(timeStamp) {
        // Advance tween animations, if any exist
        TWEEN.update();
    }
}

export default Cactus1;
