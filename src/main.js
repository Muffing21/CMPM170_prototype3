
class GridCell {
    constructor(scene, x, y, texture) {
        this.sprite = scene.add.sprite(x, y, texture)
        .setOrigin(0, 0)
        .setScale(0.4, 0.2);
        this.hasLandMine = false;
        this.hasTreasure = false;
    }

    addLandMine() {
        
        this.hasLandMine = true;
    }

    explode(){
        this.sprite.setTint(0xFF0000);
        this.hasLandMine = false;    
    }

    addTreasure(){
        // this.sprite.setTint(0x0000FF);
        this.hasTreasure = true;
    }

    gotTreasure(){
        this.sprite.setTint(0x0000FF);
        this.hasTreasure = false;
    }

    toString() {
        return `hasLandMine = ${this.hasLandMine}`;
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
            case 'KeyQ':
                this.purchaseReveal();
                break;
        }
    }

    moveLeft() {
        if (this.currentCell.x > 0) {
            this.currentCell.x--;
            this.updatePosition();
            this.checkCollision();
            this.checkCollisionTreasure();
        }
    }

    moveRight() {
        if (this.currentCell.x < this.gridSizeX - 1) {
            this.currentCell.x++;
            this.updatePosition();
            this.checkCollision();
            this.checkCollisionTreasure();
        }
    }

    moveUp() {
        if (this.currentCell.y > 0) {
            this.currentCell.y--;
            this.updatePosition();
            this.checkCollision();
            this.checkCollisionTreasure();
        }
    }

    moveDown() {
        if (this.currentCell.y < this.gridSizeY - 1) {
            this.currentCell.y++;
            this.updatePosition();
            this.checkCollision();
            this.checkCollisionTreasure();
        }
    }

    purchaseReveal() {
        if(this.scene.soulCounter >= 5){
            console.log('You made a purchase');
            this.scene.tweens.addCounter({
                from: 0.4,
                to: 1,
                duration: 1000,
                yoyo: true,
                repeat: -1
            }).setCallback("onUpdate", (tween) => {
                let intensity = 255 * tween.getValue();
                treasureLocation.sprite.tint = Phaser.Display.Color.GetColor(intensity, intensity, intensity);
            });

            this.scene.soulCounter -= 5;
            this.scene.soulText.setText(`👻Soul Collection💀: ${this.scene.soulCounter}`);
        }
    }

    updatePosition() {
        const cellSizeX = 80;
        const cellSizeY = 60;
        this.sprite.x = this.currentCell.x * cellSizeX;
        this.sprite.y = this.currentCell.y * cellSizeY;
    }

    checkCollision() {
        const currentCell = this.scene.grid[this.currentCell.x][this.currentCell.y];
        // console.log(`On cell (${this.currentCell.x}, ${this.currentCell.y})\nCell info: ${currentCell}`);
        if (currentCell.hasLandMine) {
            console.log('You stepped on a landmine.');
            this.scene.soulCounter++;
            currentCell.explode();
            this.currentCell = {x:0, y:0};
            this.updatePosition();
            this.scene.soulText.setText(`👻Soul Collection💀: ${this.scene.soulCounter}`); 
        }
    }
    checkCollisionTreasure(){
        const currentCell = this.scene.grid[this.currentCell.x][this.currentCell.y];
        if(currentCell.hasTreasure){
            console.log('you found the treasure');
            currentCell.gotTreasure();
        }
    }
}

class Shrine {
    constructor(scene, x, y, img){
        this.sprite = scene.add.sprite(x, y, img)
        .setScale(1);
    }
    
}


const gridSizeX = 10;
const gridSizeY = 8;

let treasureLocation;

class PrototypeScene extends Phaser.Scene {
    constructor() {
        super();
        this.soulCounter = 0;
        this.shrine;
    }

    preload() {
        this.load.path = 'assets/';
        this.load.image('temp_player', 'temp_player.png');
        this.load.image('tile', 'tile.png');
        //image by Eva Brozini pexels.com
        this.load.image('shrine', 'shrine.png');
        this.load.image('shrine2', 'shrine.png');

    }

    create() {
        this.soulText = this.add.text(0, 550, `👻Soul Collection💀: ${this.soulCounter}`);

        // Create a 2D array to represent the grid
        this.grid = [];
        for (let i = 0; i < gridSizeX; i++) {
            this.grid[i] = [];
            for (let j = 0; j < gridSizeY; j++) {
                this.grid[i][j] = new GridCell(this, i * 80, j * 60, 'tile');
            }
        }

        Phaser.Actions.GridAlign(this.grid.flat(), {
            width: gridSizeX,
            height: gridSizeY,
            cellWidth: 80,
            cellHeight: 60,
            x: 0,
            y: 0
        });

        placeLandMines(this.grid, gridSizeX, gridSizeY, 18);
        placeTreasure(this.grid, gridSizeX, gridSizeY);
        
        this.player = new Player(this, 0, 0, gridSizeX, gridSizeY);
        this.shrine = new Shrine(this, gameConfig.scale.width/2, 550, 'shrine');
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

function placeTreasure(grid, gridSizeX, gridSizeY){
    let randomX;
    let randomY;
    do {
        randomX = Phaser.Math.Between(1, gridSizeX - 1);
        randomY = Phaser.Math.Between(5, gridSizeY - 1);
    } while(grid[randomX][randomY].hasLandMine);
    treasureLocation = grid[randomX][randomY];
    grid[randomX][randomY].addTreasure();
    console.log(`treasure has been placed at: ${randomX},${randomY}`);
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
    backgroundColor: '#2A2A2A',
    scene: PrototypeScene,
    title: "CMPM 170 Prototype 3"
};

const game = new Phaser.Game(gameConfig);