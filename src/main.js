
class GridCell {
    constructor(scene, texture) {
        this.sprite = scene.add.sprite(0, 0, texture)
        .setOrigin(0, 0)
        .setScale(1);
    }

}

class Player {
    gridSizeX = 10;
    gridSizeY = 8;
    constructor(scene, x, y) {
        this.sprite = scene.add.sprite(x, y, 'temp_player');
        this.sprite.setOrigin(0, 0);
        this.currentCell = { x: 0, y: 0 };
        scene.input.keyboard.on('keydown', this.handleKeyDown, this);
    }

    handleKeyDown(event) {
        switch (event.code) {
            case 'ArrowLeft':
                this.moveLeft();
                break;
            case 'ArrowRight':
                this.moveRight();
                break;
            case 'ArrowUp':
                this.moveUp();
                break;
            case 'ArrowDown':
                this.moveDown();
                break;
        }
    }

    moveLeft() {
        if (this.currentCell.x > 0) {
            this.currentCell.x--;
            this.updatePosition();
        }
    }

    moveRight() {
        const gridSizeX = 10;
        if (this.currentCell.x < gridSizeX - 1) {
            this.currentCell.x++;
            this.updatePosition();
        }
    }

    moveUp() {
        if (this.currentCell.y > 0) {
            this.currentCell.y--;
            this.updatePosition();
        }
    }

    moveDown() {
        const gridSizeY = 8
        if (this.currentCell.y < gridSizeY - 1) {
            this.currentCell.y++;
            this.updatePosition();
        }
    }

    updatePosition() {
        const cellSizeX = 80;
        const cellSizeY = 60;
        this.sprite.x = this.currentCell.x * cellSizeX;
        this.sprite.y = this.currentCell.y * cellSizeY;
    }
}

class PrototypeScene extends Phaser.Scene {
    preload() {
        this.load.path = 'assets/';
        this.load.image('temp_player', 'temp_player.png')
        this.load.image('tile', 'tile.png')
    }



    create() {
        const gridSizeX = 10;
        const gridSizeY = 8;

        const player = new Player(this, 0, 0);

        // Create a 2D array to represent the grid
        const grid = [];
        for (let i = 0; i < gridSizeX; i++) {
            grid[i] = [];
            for (let j = 0; j < gridSizeY; j++) {
                // Create a new GridCell for each grid cell
                grid[i][j] = new GridCell(this, i * 80, j * 60, 'tile');
            }
        }

        Phaser.Actions.GridAlign(grid.flat(), {
            width: gridSizeX,
            height: gridSizeY,
            cellWidth: 80,
            cellHeight: 60,
            x: 0,
            y: 0
        });
        
    }

    update() {
        

    }
}

let gameConfig = {
    scale: {
       mode: Phaser.Scale.ScaleModes.NONE,
       autoCenter: Phaser.Scale.CENTER_BOTH,
       width: 800,
       height: 600
    },
    physics: {
       default: 'arcade', // Change this to Ninja or P2 you find that either is a better fit
       arcade: {

       }
    },
    pixelArt: true,
    backgroundColor: '#79a7c9',
    scene: PrototypeScene,
    title: "CMPM 170 Prototype 3"
};

const game = new Phaser.Game(gameConfig);