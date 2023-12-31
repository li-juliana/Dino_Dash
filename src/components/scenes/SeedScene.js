import * as Dat from 'dat.gui';
import * as THREE from 'three';
import { Scene, Color} from 'three';
import { Land, Land2 } from 'objects';
// Game Assets
import { Bird_Cartoon, Bird_Original, Bird_Realistic } from 'objects'; // Birds
import { Trex_Cartoon, Trex_Original, Trex_Realistic } from 'objects'; // Dinosaurs
import { Cloud, Tree1, PalmTree, Rock1, Rock2, Grass2, Bush1, Cactus1, Flower } from 'objects'; // Scenery
import { BasicLights } from 'lights';

class SeedScene extends Scene {
     /*
     * Load initial scene and intiial settings
     */
    constructor(style) {
        // Call parent Scene() constructor
        super();

        // Init state of game
        this.state = {
            frames: 0,
            gui: new Dat.GUI(), // Create GUI for scene
            updateList: [],
            prev_timestamp: null,
            style: style,
            current_player: null,
            player_options: [],
            obstacle_options: [],
            obstacles: [],
            scenery_left: [],
            scenery_right: [],
            scenery_options: null,
            clouds: [],
            speed: null,
            in_game: false,
            gamePaused: false,
            spawn_rate: 70,
            score: "00000",
            score_speed: 800,
            high_score: "00000",
            start_adj: 0,
            pause_start: 0
        };
        
        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Add available scenery options
        this.state.scenery_options = ["Tree1", "Tree4",  "Rock1",  "Rock2", "Grass2", "Bush1", "Flower"];
        this.state.speed = 0.5;
        this.createScoreboard();


        /******************** Add Meshes to Scene *********************/
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

        // Add dinosaur and bird obstacle
        var dino_original = new Trex_Original(this);
        var dino_cartoon = new Trex_Cartoon(this);
        var dino_realistic = new Trex_Realistic(this);
        this.state.player_options.push(dino_original, dino_cartoon, dino_realistic);
        const bird_original = new Bird_Original(this);
        const bird_cartoon = new Bird_Cartoon(this);
        const bird_realistic = new Bird_Realistic(this);
        this.state.obstacle_options.push(bird_original, bird_cartoon, bird_realistic);
        this.selectCorrectPlayer();

        // Add event listener for the "keydown" event to detect "Esc" key
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    loadObstacle(type, offset){
        let obstacle;
        if (type == "Cactus1"){
            obstacle = new Cactus1();
            obstacle.scale.x = 1;
            obstacle.scale.y = 1;
            obstacle.scale.z = 1;

            obstacle.position.x = Math.floor(Math.random() * 7) - 3;
            obstacle.position.z = 175 + offset;
            this.add(obstacle);
            this.state.obstacles.push(obstacle);
            if (Math.random() > 0.5){
                let num_cluster = Math.floor(Math.random()*10)+3;
                for (var i = 0; i < num_cluster; i++){
                    let obj = new Cactus1();
                    obj.scale.x = 1;
                    obj.scale.y = 1;
                    obj.scale.z = 1;
                    obj.position.x = obstacle.position.x + Math.floor(Math.random()*4)+1;
                    if (obj.position.x > -4 && obj.position.x < 4){
                        obj.position.z = obstacle.position.z + Math.floor(Math.random()*2)+1;
                        this.add(obj);
                        this.state.obstacles.push(obj);
                    }
                }
            }

        } else {
            switch(type) {
                case "Bird_Original":
                    obstacle = new Bird_Original(this);
                    break;
                case "Bird_Cartoon":
                    obstacle = new Bird_Cartoon(this);
                    break;
                case "Bird_Realistic":
                    obstacle = new Bird_Realistic(this);
                    break;
            }
            obstacle.position.x = Math.floor(Math.random() * 7) - 3;
            obstacle.position.z = 175 + offset;
            this.add(obstacle);
            this.state.obstacles.push(obstacle);
        }
       
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
            case "Flower":
                item = new Flower();
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

    removeObstacles(array_obj){
        if (array_obj != null){
            for (var i = array_obj.length - 1; i >= 0; i--) {
                // Dinosaur player is located at z = -4
                if (array_obj[i].position.z < -50) {
                    // Remove from scene
                    this.remove(array_obj[i]);
                    array_obj.splice(i, 1);
                }
            }
        }
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
        if (this.state.gamePaused){
            if (this.state.pause_start == 0){
                this.state.pause_start = timeStamp;
            }
            return;
        }
        else if (!this.state.in_game){
            return;
        }
        else{
            if (this.state.start_adj == 0){
                this.state.start_adj = timeStamp;
            }
            if (this.state.pause_start != 0){
                this.state.start_adj += timeStamp-this.state.pause_start;
                this.state.pause_start = 0;
            }
            const { updateList } = this.state;
            this.state.frames += 1;
            // Call update for each object in the updateList
            for (const obj of updateList) {
                obj.update(timeStamp);
            }

            var player = this.state.current_player;
            // Add obstacles to the scene
            if (this.state.frames % this.state.spawn_rate == 0){
                let select;
                if (this.state.score < 50){
                    select = 0;
                } else {
                    select = Math.floor(Math.random() * 2);
                }
                if (select == 0){
                    this.loadObstacle("Cactus1", 0);
                } else {
                    this.loadObstacle("Bird_" + this.state.style, 0);
                }
            }

            // Check if there has been a collision
            for (var obstacle of this.state.obstacles){
                if (this.detectCollision(player, obstacle)){
                    if (this.state.in_game){
                        this.state.paused = true;
                        this.state.in_game = false;
                        this.showGameOver();
                        let restart_button = document.getElementById('restart')
                        if (restart_button != null){
                            restart_button.addEventListener('click', function() {
                                parent.window.location.reload(true);
                            }, false);
                        }
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

            // Remove obstacles behind dinosaur
            this.removeObstacles(this.state.obstacles);
            
            /*********** Remove items and add new items to scene **********/
            this.loadNewScenery(this.state.clouds, "clouds", null, 50);
            this.loadNewScenery(this.state.scenery_left, "scenery", "left", 50);
            this.loadNewScenery(this.state.scenery_right, "scenery", "right", 50);

            /*********** Update the score displayed **********/
            this.updateScore((timeStamp-this.state.start_adj));
            // changes the score speed to increase at a slower rate the longer the
            // game is played
            this.state.score_speed = 800 + ((timeStamp-this.state.start_adj)/1000);
        }
    }

    selectCorrectPlayer(){
        var desired_player = "Trex_" + this.state.style;

        // Add desired player to scene
        this.state.player_options.forEach(element => {
            if (element.name == desired_player){
                this.add(element);
                this.state.current_player = element;
            }
        });
    }

    /**
     * Returns true if the bounding boxes defined by the vectors intersect 
     * @param {!THREE.Vector3} min1 (dinosaur min bounding box vector)
     * @param {!THREE.Vector3} max1 (dinosaur max bounding box vector)
     * @param {!THREE.Vector3} min2 (obstacle min bounding box vector)
     * @param {!THREE.Vector3} max2 (obstacle min bounding box vector)
     */
    checkBoxIntersect(min1, max1, min2, max2){
        if ((max1.x < min2.x || max2.x < min1.x) || (max1.y < min2.y || max2.y < min1.y) || (max1.z < min2.z || max2.z < min1.z)){
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
        let offset_amount_player;
        let offset_amount;

        if (this.state.style == "Original"){
            offset_amount_player = {x_min: -0.3, y_min:-0.35, z_min:-0.2, x_max: 0.3, y_max:0.35, z_max:0.2};
            if (obstacle.name[0] == "C"){
                offset_amount = {x_min: -0.45, y_min:-0.35, z_min:-0.2, x_max: 0.45, y_max:0.35, z_max:0.2};
            }
            else if (obstacle.name[0] == "B"){
                offset_amount = {x_min: -0.7, y_min:-0.2, z_min:-0.35, x_max: 0.7, y_max:0.2, z_max:0.35};
            }
        }
        else if (this.state.style == "Cartoon"){
            offset_amount_player = {x_min: -0.4, y_min:-0.4, z_min:-0.2, x_max: 0.4, y_max:0.4, z_max:0.2};
            if (obstacle.name[0] == "C"){
                offset_amount = {x_min: -0.4, y_min:-0.35, z_min:-0.2, x_max: 0.45, y_max:0.35, z_max:0.2};
            }
            else if (obstacle.name[0] == "B"){
                offset_amount = {x_min: -0.55, y_min:-0.4, z_min:-0.3, x_max: 0.55, y_max:0.2, z_max:0.3};
            }
        }
        else{
            offset_amount_player = {x_min: -0.45, y_min:-0.6, z_min:-0.2, x_max: 0.45, y_max:0.6, z_max:0.35};
            if (obstacle.name[0] == "C"){
                offset_amount = {x_min: -0.4, y_min:-0.35, z_min:-0.2, x_max: 0.45, y_max:0.35, z_max:0.2};
            }
            else if (obstacle.name[0] == "B"){
                offset_amount = {x_min: -0.55, y_min:-0.4, z_min:-0.3, x_max: 0.55, y_max:0.2, z_max:0.3};
            }
        }

        if (player_box != null && player_pos != null){
            const object_pos = obstacle.position;
            const min_vec_p = new THREE.Vector3(offset_amount_player.x_min + player_pos.x, offset_amount_player.y_min + player_pos.y, offset_amount_player.z_min + player_pos.z);
            const max_vec_p = new THREE.Vector3(offset_amount_player.x_max + player_pos.x, offset_amount_player.y_max + player_pos.y, offset_amount_player.z_max + player_pos.z);
            const min_vec_o = new THREE.Vector3(offset_amount.x_min + object_pos.x, offset_amount.y_min + object_pos.y, offset_amount.z_min + object_pos.z);
            const max_vec_o = new THREE.Vector3(offset_amount.x_max + object_pos.x, offset_amount.y_max + object_pos.y, offset_amount.z_max + object_pos.z);
            return this.checkBoxIntersect(min_vec_p, max_vec_p, min_vec_o, max_vec_o);

        }
    }

    /**
     * Displays the html box for when the game ends due to a collision 
     */
    showGameOver(){
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'overlay';
        document.body.appendChild(overlay);
    
        // Create and show the pause modal
        const modal = document.createElement('div');
        modal.id = 'game-over-popup';
        modal.innerHTML = `
        <div class="col" style="font-family: Courier;">
            <h1> Game Over</h1>
            <button id="restart">Play Again!</button>
        </div>`;
        document.body.appendChild(modal);

        // Add styles
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999;
        `;

        modal.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 30%;
        height: 30%;
        transform: translate(-50%, -50%);
        background: #7ec0ee;
        color: rgba(199,252,105,1);
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        border-width: 10px;
        border-style: solid;
        border-color: rgba(255,255,170,1);
        text-align: center;
        z-index: 999;
        `;

        let restart_button = document.getElementById('restart');
        restart_button.style.cssText = `
        background-color: #C7FC69;
        border-width: 5px;
        font-family: Courier;
        border-radius:10px;
        color: #7EC0EE;
        padding: 10px 25px;
        text-align: center;
        font-size: 16px;
        border-color: #FFFFAA;
        font-weight: bold;
            `;

        if (Number(this.state.score) > this.state.high_score){
            window.localStorage.setItem("high_score", Number(this.state.score));
        }
    }

    /**
     * Creates the initial top left scoreboard that's displayed
     */
    createScoreboard(){
        const score_overlay = document.createElement('div');
        score_overlay.id = 'score_overlay';
        document.body.appendChild(score_overlay);
    
        const panel_modal = document.createElement('div');
        panel_modal.id = 'score-panel';
        panel_modal.innerHTML = `
        <div class="col" style="font-family: Courier;">
            <h2 id = "score-text" style="color:#36454F;"></h2>
            <h2 id = "high-score-text" style="color:#36454F"></h2>
        </div>`;
        document.body.appendChild(panel_modal);
        // Add styles
        panel_modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 80%;
            height: 20%;
            background: rgba(200,200,200,0);
            display: flex;
            justify-content: left;
            align-items: right;
            margin: 0px 30px;
            text-align: center;
            font-size: 15px;
            z-index: 999;
        `;

        const saved_score = window.localStorage.getItem("high_score");
        if (saved_score != null){
            if (saved_score > Number(this.state.high_score)){
                let append_string = String(saved_score);
                while (append_string.length < 5){
                    append_string = "0" + append_string;
                }
                this.state.high_score = append_string;
            }
        }
        document.getElementById("score-text").innerText = this.state.score;
        document.getElementById("high-score-text").innerText = "High Score  " + this.state.high_score;
    }

    /**
     * Start the game by setting the in_game flag to true.
     */
    startGame() {
        this.state.in_game = true;
    }

    handleKeyDown(event) {
        if (event.key === 'Escape') {
            this.togglePause();
        }

        // ignore button clicks when game paused
        if (this.state.gamePaused && event.key !== 'Escape') {
            return;
        }
    }

    togglePause() {
        // Only pause the game if the game is currently running
        if (this.state.in_game){
            // Toggle the game pause state
            this.state.gamePaused = !this.state.gamePaused;
            // Show or hide the pause popup
            if (this.state.gamePaused) {
                this.showPausePopup();
            } else {
                this.hidePausePopup();
            }
        }
    }

    showPausePopup() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'overlay';
        document.body.appendChild(overlay);
    
        // Create and show the pause modal
        const modal = document.createElement('div');
        modal.id = 'pause-popup';
        modal.innerHTML = `
        <div class="col" style="font-family: Courier;">
            <h1> Game Paused</h1>
            <p>Press Esc to keep playing!</p>
            <button id="returnHome"> Return to Homepage </button>
        </div>
        `;
        document.body.appendChild(modal);
        let returnHome = document.getElementById('returnHome');
        if (returnHome != null){
            returnHome.addEventListener('click', function() {
                parent.window.location.reload(true);
            }, false);
        }

        returnHome.style.cssText = `
        background-color: #C7FC69;
        border-width: 5px;
        font-family: Courier;
        border-radius:10px;
        color: #7EC0EE;
        padding: 10px 25px;
        text-align: center;
        font-size: 16px;
        border-color: #FFFFAA;
        font-weight: bold;
        `

        // Add styles
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999;
        `;

        modal.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 30%;
            height: 30%;
            transform: translate(-50%, -50%);
            background: #7ec0ee;
            color: rgba(199,252,105,1);
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 10px;
            border-width: 10px;
            border-style: solid;
            border-color: rgba(255,255,170,1);
            text-align: center;
            z-index: 999;
        `;
    }

    hidePausePopup() {
        // Remove the overlay and the pause modal
        const overlay = document.getElementById('overlay');
        const modal = document.getElementById('pause-popup');
        
        if (modal) {
            document.body.removeChild(modal);
        }

        if (overlay) {
            document.body.removeChild(overlay);
        }
    }
    
    
    /**
     * Updates the score to increase the longer a player stays in the game
     */
    updateScore(timeStamp){
        var value = Number(this.state.score);
        value = timeStamp/(this.state.score_speed);
        var changed = Math.round(value);
        if (Number(this.state.score) != changed){
            let append_string = String(changed);
            while (append_string.length < 5){
                append_string = "0" + append_string;
            }

            this.state.score = append_string;
            document.getElementById("score-text").innerText = this.state.score;
            if (this.state.score > 0 && this.state.score % 50 == 0){
                if (this.state.spawn_rate > 45){
                    this.state.spawn_rate -= 10;
                }
            }
        }
    }
    

    
}

export default SeedScene;