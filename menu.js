class MenuScene extends Phaser.Scene {
    constructor() {
		super({ key: 'MenuScene' })
	}
    preload(){
        this.load.spritesheet('character','images/character.png',{frameWidth: 32,frameHeight:32});
        this.load.spritesheet('zombie1','images/zombie1.png',{frameWidth: 32,frameHeight:32.1});
    }
    create() {
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
        this.scene.start('ArenaScene');
	}
    update(){
        
    }
}