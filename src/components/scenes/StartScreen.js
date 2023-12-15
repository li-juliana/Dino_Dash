import dinoImage from './dinotest4.png';

// StartScreen.js
export default class StartScreen {
    constructor(startGameCallback) {
        this.active = true;
        this.style = null;
        this.startGameCallback = startGameCallback;
        this.container = document.createElement('div');
        this.container.id = 'start-screen';

        // Add image
        const imageElement = document.createElement('img');
        imageElement.src = dinoImage;

        this.container = document.createElement('div');
        this.container.id = 'start-screen';
        
        this.container.style.backgroundImage = `url(${dinoImage})`;
        this.container.style.backgroundSize = 'cover';
        this.container.style.backgroundRepeat = 'no-repeat';
        this.container.style.backgroundPosition = 'fixed';

        this.container.innerHTML = `
        <div class="row" style="max-width: 70vw;">
            <div class="col" id="title" style="font-family: Courier; text-align: left; position: fixed; top: 0vw; left: 2vw; max-width: 25vw; color: #e4e4e4;">
                <h2 style="font-size: 3vw">Dino Dash</h2>
            </div>
            <div class="col" id="instructions" style="font-family: Courier; text-align: left; position: fixed; bottom: 0vw; left: 2vw; max-width: 28vw; color: #e4e4e4;">
                <h2 style="font-size: 2vw">How to Play:</h2>
                <hr>
                <h3 style="font-size: 1.25vw">
                    1) Use A/D keys or the Left/Right arrow keys to move left and right.
                    <br>
                    <br>
                    2) Use the spacebar or the up arrow to jump up.
                    <br>
                    <br>
                    3) Avoid obstacles! There will be more obstacles as the game continues.
                    <br>
                    <br>
                    4) The game ends when you hit an obstacle.
                    <br>
                    <br>
                </h3>
                <h3 style="font-size: 1vw"> Select a player to get started! </h3>
            </div>
        </div>
        `;

        // Apply styles
        this.container.style.height = '100vh'; // ensures that container takes up full screen
        this.container.style.backgroundColor = "#abcabc";
        
        document.body.appendChild(this.container);

        // Add event listeners for the style buttons
        const originalButton = document.createElement('button');
        originalButton.innerText = 'Original';
        originalButton.style.margin = '20px';
        originalButton.addEventListener('click', () => this.handleStyleButtonClick('Original'));

        const cartoonButton = document.createElement('button');
        cartoonButton.innerText = 'Cartoon';
        cartoonButton.style.margin = '20px';
        cartoonButton.addEventListener('click', () => this.handleStyleButtonClick('Cartoon'));

        const realisticButton = document.createElement('button');
        realisticButton.innerText = 'Realistic';
        realisticButton.style.margin = '20px';
        realisticButton.addEventListener('click', () => this.handleStyleButtonClick('Realistic'));

        // Add buttons to the container
        const styleContainer = this.container.querySelector('#title');
        const styleContainer2 = this.container.querySelector('#instructions');
        styleContainer2.appendChild(originalButton);
        styleContainer2.appendChild(cartoonButton);
        styleContainer2.appendChild(realisticButton);
    }

    hide() {
        this.container.style.display = 'none';
    }

    show() {
        this.container.style.display = 'block';
    }

    handleStyleButtonClick(style) {
        this.style = style;
        this.startGameCallback();
    }
}


