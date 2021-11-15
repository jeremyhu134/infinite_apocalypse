class ChooseHeroScene extends Phaser.Scene {
    constructor() {
		super({ key: 'ChooseHeroScene' })
	}
    preload(){
        //this.load.image('menubg','tf2arenaimages/menubg.png');
        
        //this.load.spritesheet('redscout','tf2arenaimages/redscout.png',{frameWidth: 33,frameHeight:53});
    }
    create(){
        
    }
    update(){
        
    }
}

class ArenaScene extends Phaser.Scene {
    constructor() {
		super({ key: 'ArenaScene' })
	}
    preload(){
        //this.load.image('menubg','tf2arenaimages/menubg.png');
        
        //this.load.spritesheet('redscout','tf2arenaimages/redscout.png',{frameWidth: 33,frameHeight:53});
    }
    create(){
        gameState.createBackground(this);
        gameState.globalScene = this;
        gameState.character = this.physics.add.sprite(window.innerWidth/2-16,window.innerHeight/2+16,'character');
        gameState.character.body.offset.y = 16;
        gameState.character.body.height = 16;
        
        /*this.physics.add.collider(gameState.player, gameState.barriers,(hero,barrier)=>{
            
        });*/
        gameState.input=this.input;
        gameState.mouse=this.input.mousePointer;
        //this.input.mouse.disableContextMenu();
        gameState.cursors = this.input.keyboard.createCursorKeys();
        gameState.keys = this.input.keyboard.addKeys('W,S,A,D,R,SPACE,SHIFT,ONE,TWO,THREE,FOUR,FIVE,SIX,SEVEN,EIGHT,ESC');
        gameState.bullets = this.physics.add.group();
        
        gameState.buildings = this.physics.add.group();
        gameState.invisibleTarget = this.physics.add.sprite(-1000,-1000,'bullet');
        
        gameState.createBuildMenu(this);
        gameState.zombies = this.physics.add.group();
        gameState.spawnCount = 5;
        gameState.commenceWaves(this);
        gameState.createIcons(this);
        this.physics.add.collider(gameState.character, gameState.buildings);
        //this.physics.add.overlap(gameState.blueprint, gameState.buildings)
    }
    update(){
        gameState.chracterControls(this,gameState.character,gameState.characterStats);
        gameState.blueprint.checkControls(this);
    }
}