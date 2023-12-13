import * as Dat from 'dat.gui';
import * as THREE from 'three';
import { Scene, Color, Fog} from 'three';
import { Land, Land2 } from 'objects';
// Game Assets
import { Bird_Cartoon, Bird_Original, Bird_Realistic } from 'objects'; // Birds
import { Trex_Cartoon, Trex_Original, Trex_Realistic } from 'objects'; // Dinosaurs
import { Cloud, Tree1, PalmTree, Rock1, Rock2, Grass2, Bush1, Cactus1 } from 'objects'; // Scenery
import { BasicLights } from 'lights';

class SeedScene extends Scene {
     /*
     * Load initial scene and intiial settings
     */
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
            alive: true,
        };

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
        var player_style = this.state.gui.add(this.state, 'style', ["Original", "Cartoon", "Realistic"]).name('Style');

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Add available scenery options
        this.state.scenery_options = ["Tree1", "Tree4",  "Rock1",  "Rock2", "Grass2", "Bush1", "Cactus1"];

        this.state.speed = 0.5;

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

    /**
     * Loads in a singular cloud into the scene at some random position.
     * Adds cloud to scene and adds new cloud to this.state.clouds array
     * @param {!int} additional offset along the z-axis
     */
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

    /**
     * Loads in a random scenery item (tree1, tree4, rock1, rock2, 
     * grass2, bush1, or cactus1) at a random position on either the
     * left or right side of the scene. Adds new scenery item to 
     * scene and to either this.state.scenery_left or 
     * this.state.scenery_right array
     * @param {!string} side is either "left" or "right"
     * @param {!int} additional offset along the z-axis
     */
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

        // Adjust position and add to respective array
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

    /**
     * Removes a background item from the scene and update arrays if the
     * item has left the scene. If an item is removed, a new item is 
     * added further along in the scene to create a continuous scene.
     * Call this function in the update function.
     * @param {!array} Array to be modified. Specify if this.state.clouds,
     * this.state.scenery_left or this.state.scenery_right
     * @param {!string} type of object being added. Specify if "scenery"
     * or "clouds"
     * @param {!string} "left" or "right" side if adding a scenery item
     * @param {!int} additional z-offset
     */
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
                if (this.state.alive){
                    window.alert("Game Over");
                    this.state.alive = false;
                    parent.window.location.reload(true);
                }
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

        /*********** Remove items and add new items to scene **********/
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

    /**
     * Returns true if the bounding boxes defined by the vectors intersect 
     * @param {!THREE.Vector3} min1 (dinosaur min bounding box vector)
     * @param {!THREE.Vector3} max1 (dinosaur max bounding box vector)
     * @param {!THREE.Vector3} min2 (obstacle min bounding box vector)
     * @param {!THREE.Vector3} max2 (obstacle min bounding box vector)
     */
    checkBoxIntersect(min1, max1, min2, max2){
        if ((max1.x <= min2.x || max2.x <= min1.x) || (max1.y <= min2.y || max2.y <= min1.y) || (max1.z <= min2.z || max2.z <= min1.z)){
            return false;
        }
        else{
            return true;
        }
    }

    /**
     * Returns true if there was a collision between player and obstacle 
     * @param {!mesh obj} player (dinosaur)
     * @param {!mesh obj} obstacle (bird or cactus)
     * @return {!boolean} whether or not there was a collision between player
     * and obstacle
     */
    detectCollision(player, obstacle){
        const player_box = player.state.box;
        const player_pos = player.position;
        const offset_amount_bird = {x: 0.7, y:0.3, z:0.2};
        if (player_box != null && player_pos != null){
            const object_pos = obstacle.position;
            const min_vec_p = new THREE.Vector3(player_box.min.x + player_pos.x, player_box.min.y + player_pos.y, player_box.min.z + player_pos.z);
            const max_vec_p = new THREE.Vector3(player_box.max.x + player_pos.x, player_box.max.y + player_pos.y, player_box.max.z + player_pos.z);
            const min_vec_o = new THREE.Vector3(-offset_amount_bird.x + object_pos.x, -offset_amount_bird.y + object_pos.y, -offset_amount_bird.z + object_pos.z);
            const max_vec_o = new THREE.Vector3(offset_amount_bird.x + object_pos.x, offset_amount_bird.y + object_pos.y, offset_amount_bird.z + object_pos.z);
            return this.checkBoxIntersect(min_vec_p, max_vec_p, min_vec_o, max_vec_o);

        }
    }

    
}

export default SeedScene;
