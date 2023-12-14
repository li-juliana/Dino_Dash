// StartScreen.js
export default class StartScreen {
    constructor(startGameCallback, selectStyleCallback) {
        this.startGameCallback = startGameCallback;
        this.selectStyleCallback = selectStyleCallback;
        this.container = document.createElement('div');
        this.container.id = 'start-screen';
        this.container.innerHTML = `
        <div class="row">
            <div class="col" style="font-family: Papyrus; text-align: center; padding: 200px;">
                <h1>Dino Dash</h1>
                <p style="font-family: Arial;">No wifi? No problem! Take a trip back to the dark ages with Dino Dash. Press Enter to get started!</p>
            </div>
        </div>
        `;

        // Apply styles
        this.container.style.height = '100vh'; // ensures that the container takes up the full screen
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
        this.selectStyleCallback(style);
        this.startGameCallback();
    }
}


