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
        gameState.globalScene = this;
        gameState.character = this.physics.add.sprite(window.innerWidth/2-16,window.innerHeight/2+16,'character').setOrigin(0,0);
        
        /*this.physics.add.collider(gameState.player, gameState.barriers,(hero,barrier)=>{
            
        });*/
        
        gameState.input=this.input;
        gameState.mouse=this.input.mousePointer;
        //this.input.mouse.disableContextMenu();
        gameState.cursors = this.input.keyboard.createCursorKeys();
        gameState.keys = this.input.keyboard.addKeys('W,S,A,D,R,SPACE,SHIFT,ONE,TWO,ESC');
        gameState.bullets = this.physics.add.group();
        
        gameState.buildings = this.physics.add.group();
        
        gameState.zombies = this.physics.add.group();
        gameState.spawnCount = 5;
        this.time.addEvent({
            delay: 30000,
            callback: ()=>{
                this.time.addEvent({
                    delay: 1,
                    callback: ()=>{
                        gameState.zombie1Stats.spawnZombie(this);
                    },  
                    startAt: 0,
                    timeScale: 1,
                    repeat: gameState.spawnCount -1
                });
                if(gameState.spawnCount+1 <30){
                    gameState.spawnCount += 5;
                }
                else if (gameState.spawnCount >=30 && gameState.spawnCount <50){
                    gameState.zombie1Stats.speed += 5;
                }
                else {
                    gameState.spawnCount += 5;
                }
            },  
            startAt: 0,
            timeScale: 1,
            repeat: -1
        }); 
        this.add.image(window.innerWidth-200,10,'moneySign').setOrigin(0,0).setDepth(5);
        gameState.moneyText = this.add.text( window.innerWidth - 160, 5, `${gameState.money}`, {
            fill: '#OOOOOO', 
            fontSize: '30px',
            fontFamily: 'Qahiri',
            strokeThickness: 10,
        }).setDepth(5);
        this.physics.add.collider(gameState.character, gameState.buildings);
        //this.physics.add.overlap(gameState.blueprint, gameState.buildings)
    }
    update(){
        gameState.chracterControls(this,gameState.character,gameState.characterStats);
        if(gameState.blueprint.active == true){
            gameState.blueprintSprite.x = this.input.x;
            gameState.blueprintSprite.y = this.input.y;
        }
        gameState.blueprint.checkControls(this);
    }
}