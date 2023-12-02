class PrototypeScene extends Phaser.Scene {
    preload() {
        
    }

    create() {
        
    }

    update() {
        // Add to this function as needed
    }
}

let gameConfig = {
    scale: {
       mode: Phaser.Scale.FIT,
       autoCenter: Phaser.Scale.CENTER_BOTH,
       width: 640,
       height: 360
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