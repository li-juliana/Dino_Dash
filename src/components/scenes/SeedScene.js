import * as THREE from "three";
import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Flower, Land, Parrot, Trex, Cactus1, Cactus2} from 'objects';
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
        };

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        /******************** Add Meshes to Scene *********************/
        
        // Add dinosaur and lights
        const lights = new BasicLights();
        var dinosaur = new Trex(this);
        this.add(lights, dinosaur);

        // Add floor
        var floor = new Land();
        this.add(floor);

        // Add parrot
        // const parrot = new Parrot(this);
        // this.add(parrot)

        // Add in an obstacle for now
        var cactus1 = new Cactus1(this);
        cactus1.position.z = 5;
        this.add(cactus1);

        var cactus2 = new Cactus2(this);
        cactus2.position.z = 5;
        this.add(cactus2);
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
