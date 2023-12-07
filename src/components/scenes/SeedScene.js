import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
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
            style: "Original",
            current_style: "Original",
            land: null,
            available_players: [],
            available_obstacles: [],
            obstacles: [],
        };

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
        var player_style = this.state.gui.add(this.state, 'style', ["Original", "Cartoon", "Realistic"]).name('Style');

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        /******************** Add Meshes to Scene *********************/
        player_style.onChange((value) => this.switchStyles(value));

        // Add floor and lights
        const lights = new BasicLights();
        var floor = new Land();
        this.land = floor;
        this.add(lights, floor);

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

        // Move obstacles forward
        for (var obstacle of this.state.obstacles){
            obstacle.position.z -= 0.05;
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
