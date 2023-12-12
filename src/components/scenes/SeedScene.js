import * as Dat from 'dat.gui';
import * as THREE from 'three';
import { Scene, Color, FogExp2} from 'three';
import { Land, Land2 } from 'objects';
// Game Assets
import { Bird_Cartoon, Bird_Original, Bird_Realistic } from 'objects'; // Birds
import { Trex_Cartoon, Trex_Original, Trex_Realistic } from 'objects'; // Dinosaurs
import { Cloud, Tree1, PalmTree, Rock1, Rock2, Grass2, Bush1, Cactus1 } from 'objects'; // Scenery
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
            style: "Original",
            current_style: "Original",
            player_options: [],
            available_obstacles: [],
            obstacles: [],
            scenery_left: [],
            scenery_right: [],
            scenery_options: null,
            clouds: [],
            speed: null,
        };

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
        var player_style = this.state.gui.add(this.state, 'style', ["Original", "Cartoon", "Realistic"]).name('Style');

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Add available scenery options
        this.state.scenery_options = ["Tree1", "Tree4",  "Rock1",  "Rock2", "Grass2", "Bush1", "Cactus1"];

        this.state.speed = 1;

        /******************** Add Meshes to Scene *********************/
        player_style.onChange((value) => this.switchStyles(value));

        // Add floor and lights
        const lights = new BasicLights();
        var floor = new Land2();
        this.add(lights, floor);

        // Add scene right and left
        var scene_right = new Land();
        scene_right.position.x = -175;
        var scene_left = new Land();
        scene_left.position.x = 175;
        this.add(scene_right, scene_left);

        // Add items to scene right
        for (var j = 0; j < 100; j++){
            this.loadScenery("right", 0);
            this.loadScenery("left", 0);
        }

        // Add clouds to sky
        for (var i = 0; i < 250; i++){
            this.loadCloud(0);
        }

        // Add dinosaur
        var dino_original = new Trex_Original(this);
        var dino_cartoon = new Trex_Cartoon(this);
        var dino_realistic = new Trex_Realistic(this);
        this.state.player_options.push(dino_original, dino_cartoon, dino_realistic);
        this.add(dino_original)

        // Add bird dinosaur obstacles
        const bird_original = new Bird_Original(this);
        const bird_cartoon = new Bird_Cartoon(this);
        const bird_realistic = new Bird_Realistic(this);
        this.state.available_obstacles.push(bird_original, bird_cartoon, bird_realistic);
        this.add(bird_original);
        this.state.obstacles.push(bird_original);
    }

    loadCloud(offset){
        var cloud = new Cloud();
        var scale = (Math.random() * 1.5) + 0.25;
        cloud.scale.multiplyScalar(scale);
        cloud.position.x = (Math.random() * 500) - 250;
        cloud.position.y += (Math.random() * 15) - 10;
        cloud.position.z = (Math.random() * 1000) - 100 + offset;
        this.state.clouds.push(cloud);
        this.add(cloud);
    }

    loadScenery(side, offset){
        var select = Math.floor(Math.random() * 7);
        let item;
        switch(this.state.scenery_options[select]) {
            case "Tree1":
                item = new Tree1();
                break;
            case "Tree4":
                item = new PalmTree();
                break;
            case "Rock1":
                item = new Rock1();
                break;
            case "Rock2":
                item = new Rock2();
                break;
            case "Grass2":
                item = new Grass2();
                break;
            case "Bush1":
                item = new Bush1();
                break;
            case "Cactus1":
                item = new Cactus1();
                break;
        }

        // Adjust position and add to respective list
        item.position.z = (Math.random() * 1000) - 100 + offset;
        if (side == "left"){
            item.position.x = (Math.random() * 200) + 5;
            this.state.scenery_left.push(item);
        } else {
            item.position.x = (Math.random() * -200) - 5;
            this.state.scenery_right.push(item);
        }
        // Add item to scene
        this.add(item);
    }

    loadNewScenery(array_obj, type, side, offset){
        // Remove from update array once object has moved out of scene enough
        if (array_obj != null){
            var count_removed = 0;
            for (var i = array_obj.length - 1; i >= 0; i--) {
                // Dinosaur player is located at z = -4
                if (array_obj[i].position.z < -50) {
                    // Remove from scene
                    this.remove(array_obj[i]);
                    array_obj.splice(i, 1);
                    count_removed += 1;
                }
            }

            for (var i = 0; i < count_removed; i++){
                if (type == "clouds"){
                    this.loadCloud(offset);
                } else {
                    if (side == "left"){
                        this.loadScenery("left", offset);
                    } else {
                        this.loadScenery("right", offset);
                    }
                }
            }
        }
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

        var player = this.getObjectByName("Trex_" + this.state.style);
        // Add obstacles to the scene
        for (var obstacle of this.state.obstacles){
            if (this.detectCollision(player, obstacle)){
                console.log("Collision");
            }
        }

        /********************* Move Scene Forward *********************/
        // Move obstacles forward
        for (var obstacle of this.state.obstacles){
            obstacle.position.z -= this.state.speed;
        }
        // Move clouds forward
        for (var cloud of this.state.clouds){
            cloud.position.z -= (this.state.speed);
        }
        // Move scenery left forward
        for (var item of this.state.scenery_left){
            item.position.z -= (this.state.speed);
        }
        // Move scenery right forward
        for (var item of this.state.scenery_right){
            item.position.z -= (this.state.speed);
        }

        /***************** Add new items to scene *********************/
        this.loadNewScenery(this.state.clouds, "clouds", null, 50);
        this.loadNewScenery(this.state.scenery_left, "scenery", "left", 50);
        this.loadNewScenery(this.state.scenery_right, "scenery", "right", 50);
    }

    switchStyles(style){
        var desired_player = "Trex_" + style;
        var current_player = "Trex_" + this.state.current_style;

        var desired_obstacle = "Bird_" + style;
        var current_obstacle = "Bird_" + this.state.current_style;

        // TODO: Need to add and remove cactus styles after adding cactus to game

        let remove_player;
        let remove_obstacle;
        this.children.forEach(element => {
            // Find the current dinosaur from the scene to remove
            if (element.name == current_player) {
                remove_player = element;
            }
            // Find the current bird obstacle from the scene to remove
            if (element.name == current_obstacle){
                remove_obstacle = element;
            }
        });
        if (remove_player != null){
            this.remove(remove_player);
        }
        if (remove_obstacle != null){
            this.remove(remove_obstacle);
        }
        
        // Add desired player to scene
        this.state.player_options.forEach(element => {
            if (element.name == desired_player){
                this.add(element);
            }
        });

        // Add desired bird obstacle to scene
        this.state.available_obstacles.forEach(element => {
            if (element.name == desired_obstacle){
                this.add(element);
            }
        });
        
        this.state.current_style = style;
    }

    detectCollision(player, obstacle){
        const player_box = player.state.box;
        if (player_box != null){
            return player_box.containsPoint(obstacle.position);
        }
    }
}

export default SeedScene;
