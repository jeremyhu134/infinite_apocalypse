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
        gameState.character = this.physics.add.sprite(window.innerWidth/2-16,window.innerHeight/2+16,'character').setOrigin(0,0);
        
        
        /*this.physics.add.collider(gameState.player, gameState.barriers,(hero,barrier)=>{
            
        });*/
        
        gameState.input=this.input;
        gameState.mouse=this.input.mousePointer;
        //this.input.mouse.disableContextMenu();
        gameState.cursors = this.input.keyboard.createCursorKeys();
        gameState.keys = this.input.keyboard.addKeys('W,S,A,D,R,SPACE,SHIFT,ONE,TWO');
        gameState.bullets = this.physics.add.group();
        
        gameState.zombies = this.physics.add.group();
        
        this.time.addEvent({
            delay: 3000,
            callback: ()=>{
                gameState.spawnZombie(this,gameState.zombie1Stats);
                gameState.spawnZombie(this,gameState.zombie1Stats);
                gameState.spawnZombie(this,gameState.zombie1Stats);
                gameState.spawnZombie(this,gameState.zombie1Stats);
            },  
            startAt: 0,
            timeScale: 1,
            repeat: -1
        }); 
        
    }
    update(){
        gameState.character.body.checkWorldBounds();
        if(gameState.character.body.velocity.x == 0){
            gameState.character.anims.play('characterIdle',true);
        }
        if(gameState.keys.W.isDown){
            gameState.character.anims.play('characterWalk',true);
            gameState.character.setVelocityY(-gameState.characterStats.speed);
        }
        else if(gameState.keys.S.isDown){
            gameState.character.anims.play('characterWalk',true);
            gameState.character.setVelocityY(gameState.characterStats.speed);
        }
        else {
            gameState.character.setVelocityY(0);
        }
        if(gameState.keys.A.isDown){
            gameState.character.flipX = true;
            gameState.character.anims.play('characterWalk',true);
            gameState.character.setVelocityX(-gameState.characterStats.speed);
        }
        else if(gameState.keys.D.isDown){
            gameState.character.flipX = false;
            gameState.character.anims.play('characterWalk',true);
            gameState.character.setVelocityX(gameState.characterStats.speed);
        }
        else {
            gameState.character.setVelocityX(0);
        }
    }
}