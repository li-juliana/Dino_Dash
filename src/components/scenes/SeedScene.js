import * as Dat from 'dat.gui';
import * as THREE from 'three';
import { Scene, Color, FogExp2} from 'three';
import { Land, Land2 } from 'objects';
// Game Assets
import { Bird_Cartoon, Bird_Original, Bird_Realistic } from 'objects'; // Birds
import { Trex_Cartoon, Trex_Original, Trex_Realistic } from 'objects'; // Dinosaurs
import { Cloud, Tree1, Tree4, Rock1, Grass2, Grass3, Bush1, Bush2 } from 'objects'; // Scenery
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
            available_players: [],
            available_obstacles: [],
            obstacles: [],
            scenery: [],
            available_scenery: null,
            clouds: [],
            speed: null,
        };

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
        var player_style = this.state.gui.add(this.state, 'style', ["Original", "Cartoon", "Realistic"]).name('Style');

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Add available scenery options
        this.state.available_scenery = ["Tree1", "Tree4", "Rock1", "Grass2", "Grass3", "Bush1", "Bush2"];

        this.state.speed = 0.1;

        /******************** Add Meshes to Scene *********************/
        player_style.onChange((value) => this.switchStyles(value));

        // Add floor and lights
        const lights = new BasicLights();
        var floor = new Land2();
        this.add(lights, floor);

        this.createScenery();

        // Add dinosaur
        var dino_original = new Trex_Original(this);
        var dino_cartoon = new Trex_Cartoon(this);
        var dino_realistic = new Trex_Realistic(this);
        this.state.available_players.push(dino_original, dino_cartoon, dino_realistic);
        this.add(dino_original)

        // Add bird dinosaur obstacles
        const bird_original = new Bird_Original(this);
        const bird_cartoon = new Bird_Cartoon(this);
        const bird_realistic = new Bird_Realistic(this);
        this.state.available_obstacles.push(bird_original, bird_cartoon, bird_realistic);
        this.add(bird_original);
        this.state.obstacles.push(bird_original);
    }

    createScenery(){
        // Add scene right
        var scene_right = new Land();
        scene_right.position.x = -175;
        this.add(scene_right);

        // Add items to scene right
        for (var j = 0; j < 125; j++){
            var select = Math.floor(Math.random() * 7);
            let item;
            switch(this.state.available_scenery[select]) {
                case "Tree1":
                    item = new Tree1();
                    break;
                case "Tree4":
                    item = new Tree4();
                    break;
                case "Rock1":
                    item = new Rock1();
                    break;
                case "Grass2":
                    item = new Grass2();
                    break;
                case "Grass3":
                    item = new Grass3();
                    break;
                case "Bush1":
                    item = new Bush1();
                    break;
                case "Bush2":
                    item = new Bush2();
                    break;
            }
            item.position.x = (Math.random() * -100) - 5;
            item.position.z = (Math.random() * 1000) - 500;
            this.add(item);
            this.state.scenery.push(item);
        }

        // Add scene left
        var scene_left = new Land();
        scene_left.position.x = 175;
        this.add(scene_left);

        // Add items to scene left
        for (var j = 0; j < 125; j++){
            var select = Math.floor(Math.random() * 7);
            let item;
            switch(this.state.available_scenery[select]) {
                case "Tree1":
                    item = new Tree1();
                    break;
                case "Tree4":
                    item = new Tree4();
                    break;
                case "Rock1":
                    item = new Rock1();
                    break;
                case "Grass2":
                    item = new Grass2();
                    break;
                case "Grass3":
                    item = new Grass3();
                    break;
                case "Bush1":
                    item = new Bush1();
                    break;
                case "Bush2":
                    item = new Bush2();
                    break;
            }
            item.position.x = (Math.random() * 100) + 6;
            item.position.z = (Math.random() * 1000) - 500;
            this.add(item);
            this.state.scenery.push(item);
        }

        // Add clouds to sky
        for (var i = 0; i < 500; i++){
            var cloud = new Cloud();
            var scale = (Math.random() * 1.5) + 0.25;
            cloud.scale.multiplyScalar(scale);
            cloud.position.x = (Math.random() * 500) - 250;
            cloud.position.y += (Math.random() * 15) - 10;
            cloud.position.z = (Math.random() * 1000) - 500;
            this.state.clouds.push(cloud);
            this.add(cloud);
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
            cloud.position.z -= (this.state.speed * 2);
        }
        // Move scenery forward
        for (var item of this.state.scenery){
            item.position.z -= (this.state.speed * 2);
        }
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
        this.state.available_players.forEach(element => {
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
