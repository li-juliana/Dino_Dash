// StartScreen.js
export default class StartScreen {
    constructor(startGameCallback) {
        this.startGameCallback = startGameCallback;
        this.container = document.createElement('div');
        this.container.id = 'start-screen';
        this.container.innerHTML = `
        <div class="row">
            <div class="col" style="font-family: Papyrus; text-align: center; padding: 200px;">
                <h1>Dino Dash</h1>
                <p style="font-family: Arial;">No wifi? No problem! Take a trip back to the dark ages with Dino Dash. Press Enter to get started!</p>
            </div>
            <div class="col" style="text-align: center">
            </div>
        </div>
        `;

        // Apply styles
        this.container.style.height = '100vh'; // ensures that container takes up full screen
        this.container.style.backgroundColor = "#abcabc";
        
        document.body.appendChild(this.container);

        // Add event listener for the "Enter" key
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
    }

    hide() {
        this.container.style.display = 'none';
    }

    show() {
        this.container.style.display = 'block';
    }

    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.startGameCallback();
        }
    }
}


