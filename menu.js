class MenuScene extends Phaser.Scene {
    constructor() {
		super({ key: 'MenuScene' })
	}
    preload(){
        this.load.spritesheet('character','images/character.png',{frameWidth: 32,frameHeight:32});
        this.load.spritesheet('zombie1','images/zombie1.png',{frameWidth: 32,frameHeight:32.1});
        this.load.spritesheet('gatlingTower','images/gatlingTower.png',{frameWidth: 60,frameHeight:55});
        this.load.spritesheet('factory','images/factory.png',{frameWidth: 50,frameHeight:50});
        this.load.spritesheet('buildingExplosion','images/buildingExplosion.png',{frameWidth: 75,frameHeight:75});
        this.load.image('bullet','images/bullet.png');
        this.load.image('title','images/title.png');
        this.load.image('moneySign','images/moneySign.png');
        this.load.image('startButton','images/startButton.png');
    }
    create() {
        gameState.money = 50;
        gameState.characterStats.health = 100;
        //character Animations
        this.anims.create({
            key: 'characterIdle',
            frameRate: 1,
            repeat: -1,
            frames:this.anims.generateFrameNames('character',{start: 0,end: 0})
        });
        this.anims.create({
            key: 'characterWalk',
            frameRate: 25,
            repeat: -1,
            frames:this.anims.generateFrameNames('character',{start: 0,end: 11})
        });
        this.anims.create({
            key: 'zombie1Spawn',
            frameRate: 13,
            frames:this.anims.generateFrameNames('zombie1',{start: 0,end: 16})
        });
        this.anims.create({
            key: 'zombie1Idle',
            frameRate: 25,
            repeat: -1,
            frames:this.anims.generateFrameNames('zombie1',{start: 17,end: 17})
        });
        this.anims.create({
            key: 'zombie1Walk',
            frameRate: 13,
            repeat: -1,
            frames:this.anims.generateFrameNames('zombie1',{start: 17,end: 28})
        });
        this.anims.create({
            key: 'zombie1Death',
            frameRate: 10,
            frames:this.anims.generateFrameNames('zombie1',{start: 29,end: 33})
        });
        this.anims.create({
            key: 'explode',
            frameRate: 7,
            frames:this.anims.generateFrameNames('buildingExplosion',{start: 0,end: 7})
        });
        this.anims.create({
            key: 'gatlingTowerIdle',
            frameRate: 13,
            frames:this.anims.generateFrameNames('galtingTower',{start: 0,end: 0})
        });
        this.anims.create({
            key: 'gatlingTowerBuild',
            frameRate: 16,
            frames:this.anims.generateFrameNames('galtingTower',{start: 1,end: 6})
        });
        this.anims.create({
            key: 'gatlingTowerAction',
            frameRate: 6,
            repeat: -1,
            frames:this.anims.generateFrameNames('galtingTower',{start: 7,end: 8})
        });
        this.anims.create({
            key: 'factoryIdle',
            frameRate: 6,
            frames:this.anims.generateFrameNames('factory',{start: 0,end: 0})
        });
        this.anims.create({
            key: 'factoryAction',
            frameRate: 7,
            repeat: -1,
            frames:this.anims.generateFrameNames('factory',{start: 1,end: 2})
        });
        this.add.image(window.innerWidth/2,100,'title');
        this.add.image(200,window.innerHeight/2,'zombie1').setScale(10);
        this.add.image(window.innerWidth-200,window.innerHeight/2,'character').setScale(10);
        var button = this.add.image(window.innerWidth/2,window.innerHeight/2,'startButton').setInteractive();
        gameState.globalScene = this;
        button.on('pointerdown', function(pointer){
            gameState.globalScene.scene.start('ArenaScene');
        });
	}
    update(){
        
    }
}