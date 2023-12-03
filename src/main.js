class Character {
    
    constructor(scene, x, y) {
        this.sprite = scene.physics.add.sprite(x, y, "temp_player")
            //.setOrigin(0,5, 0.5)
            .setInteractive()
            .setCollideWorldBounds(true, 1, 1, true)
            
        this.x = x;
        this.y = y;
    }
}


class PrototypeScene extends Phaser.Scene {
    preload() {
        this.load.path = 'assets/';
        this.load.image('temp_player', 'temp_player.png')
    }



    create() {
        this.player = new Character(this, 0, 0);

        // this.player.displayWidth = (gameConfig.scale.width/10);
        // this.player.displayHidth = (gameConfig.scale.height/10);

        console.log(this.player.x, this.player.y);

        this.physics.world.on('worldbounds', (body, up, down, left, right) => {
            //insert what happens when the balloon touches the edges here
            if(up){
                console.log("up test");
            }
            if(down){
                console.log("down test");
            }
            if(left){
                console.log("left test");
            }
            if(right){
                console.log("right test");
            }
        });
        this.cursors = this.input.keyboard.createCursorKeys();
        this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.left))
        {   
            this.player.x -= 72;
            this.player.sprite.setPosition(this.player.x, this.player.y);
            
        }
        else if (Phaser.Input.Keyboard.JustDown(this.right))
        {
            this.player.x += 72;
            this.player.sprite.setPosition(this.player.x, this.player.y);

        }

        else if (Phaser.Input.Keyboard.JustDown(this.up))
        {
            this.player.y -= 36;
            this.player.sprite.setPosition(this.player.x, this.player.y);

        }
        else if (Phaser.Input.Keyboard.JustDown(this.down))
        {
            this.player.y += 36;
            this.player.sprite.setPosition(this.player.x, this.player.y);

        }

    }
}

let gameConfig = {
    scale: {
       mode: Phaser.Scale.ScaleModes.NONE,
       autoCenter: Phaser.Scale.CENTER_BOTH,
       width: 720,
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