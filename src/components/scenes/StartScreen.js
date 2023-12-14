import dinoImage from './dinotest.jpg';

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

        this.container.innerHTML = `
        <div class="row">
            <div class="col" style="font-family: Courier; text-align: center; padding: 200px;">
                <h1>Dino Dash</h1>
                <p>No wifi? No problem! Take a trip back to the dark ages with Dino Dash.</p>
                <hr>
                <p>How to play:</p>
                <p>
                    1) Use a or d keys or the left and right arrow keys to move left and right
                    <br>
                    2) Use the spacebar or the up arrow to jump up
                    <br>
                    3) Avoid obstacles. The game ends when you land on an obstacle.
                    <br>
                <p> Select a player to get started! </p>
            </div>
            <div class="col" style="text-align: center">
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
        originalButton.addEventListener('click', () => this.handleStyleButtonClick('Original'));

        const cartoonButton = document.createElement('button');
        cartoonButton.innerText = 'Cartoon';
        cartoonButton.addEventListener('click', () => this.handleStyleButtonClick('Cartoon'));

        const realisticButton = document.createElement('button');
        realisticButton.innerText = 'Realistic';
        realisticButton.addEventListener('click', () => this.handleStyleButtonClick('Realistic'));

        // Add buttons to the container
        const styleContainer = this.container.querySelector('.col');
        styleContainer.appendChild(originalButton);
        styleContainer.appendChild(cartoonButton);
        styleContainer.appendChild(realisticButton);
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


