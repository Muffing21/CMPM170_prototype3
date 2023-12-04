
class GridCell {
    constructor(scene, x, y, texture) {
        this.sprite = scene.add.sprite(x, y, texture)
        .setOrigin(0, 0)
        .setScale(0.4, 0.2);
        this.hasLandMine = false;
    }

    addLandMine() {
        this.hasLandMine = true;
        this.sprite.setTint(0xFF0000);    
    }

    explode(){
        
    }
}

class Player {
    constructor(scene, x, y, gridSizeX, gridSizeY) {
        this.sprite = scene.add.sprite(x, y, 'temp_player');
        this.sprite.setOrigin(0, 0);
        this.currentCell = { x: 0, y: 0 };
        this.gridSizeX = gridSizeX;
        this.gridSizeY = gridSizeY;
        this.scene = scene;
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
        if (this.currentCell.x < this.gridSizeX - 1) {
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
        if (this.currentCell.y < this.gridSizeY - 1) {
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

    checkCollision() {
        const currentCell = grid[this.currentCell.x][this.currentCell.y];
        if (currentCell.hasLandmine) {
            alert('You stepped on a landmine.');
        }
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
        let soulCounter = 0;
        this.add.text(0, 550, `👻💀 Collection: ${soulCounter}`);
        

        // Create a 2D array to represent the grid
        const grid = [];
        for (let i = 0; i < gridSizeX; i++) {
            grid[i] = [];
            for (let j = 0; j < gridSizeY; j++) {
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

        placeLandMines(grid, gridSizeX, gridSizeY, 15);
        
        const player = new Player(this, 0, 0, gridSizeX, gridSizeY);

    }

    update() {
        
        
    }
}

function placeLandMines(grid, gridSizeX, gridSizeY, numLandmines) {
    for (let i = 0; i < numLandmines; i++) {
        const randomX = Phaser.Math.Between(1, gridSizeX - 1);
        const randomY = Phaser.Math.Between(1, gridSizeY - 1);
        grid[randomX][randomY].addLandMine();
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
       default: 'arcade', 
       arcade: {

       }
    },
    pixelArt: true,
    backgroundColor: '#79a7c9',
    scene: PrototypeScene,
    title: "CMPM 170 Prototype 3"
};

const game = new Phaser.Game(gameConfig);