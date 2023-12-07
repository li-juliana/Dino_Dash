import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { Flower, Land} from 'objects';
// Game Assets
import { Bird_Cartoon, Bird_Original, Bird_Realistic} from 'objects'; // Birds
import { Trex_Cartoon, Trex_Original, Trex_Realistic} from 'objects'; // dinosaurs
import { BasicLights } from 'lights';

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 0, // TODO: change back to 1 later
            updateList: [],
            prev_timestamp: null,
        };

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        /******************** Add Meshes to Scene *********************/
        
        // Add dinosaur and lights
        const lights = new BasicLights();
        // var dino_original = new Trex_Original(this);
        var dino_realistic = new Trex_Realistic(this);
        var dino_original = new Trex_Original(this);
        var dino_cartoon = new Trex_Cartoon(this);
        this.add(lights, dino_original);

        // Add bird dinosaur
        const bird_cartoon = new Bird_Cartoon(this);
        const bird_original = new Bird_Original(this);
        const bird_realistic = new Bird_Realistic(this);
        this.add(bird_original);

        // Add floor
        var floor = new Land();
        this.add(lights, floor);

        // Add in an obstacle for now
        // var cactus1 = new Cactus1(this);
        // cactus1.position.z = 5;
        // this.add(cactus1);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        this.rotation.y = (rotationSpeed * timeStamp) / 10000;
        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }
}

export default SeedScene;
