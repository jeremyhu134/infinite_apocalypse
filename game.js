const config = {
    type: Phaser.AUTO,
    width : window.innerWidth-10,
    height: window.innerHeight-10,
    backgroundColor: "#999999",
    audio: {
        disableWebAudio: true
      },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            enableBody: true,
            //debug: true
        }
    },
    scene:[MenuScene,ShopScene,ArenaScene,ChooseHeroScene],
    scale: {
        zoom: 1
    }
};

const game = new Phaser.Game(config);

let gameState = {
    characterStats: {
        speed : 200
    },
    zombieBehavior: function(scene,zombie,zombieStats){
        scene.time.addEvent({
            delay: 1,
            callback: ()=> { 
                if(zombie.x > gameState.character.x){
                    zombie.flipX = true;
                    zombie.anims.play('zombie1Walk',true);
                    zombie.setVelocityX(-zombieStats.speed);
                }
                else if(zombie.x < gameState.character.x){
                    zombie.flipX = false;
                    zombie.anims.play('zombie1Walk',true);
                    zombie.setVelocityX(zombieStats.speed);
                }
                if(zombie.y > gameState.character.y){
                    zombie.anims.play('zombie1Walk',true);
                    zombie.setVelocityY(-zombieStats.speed);
                }
                else if(zombie.y < gameState.character.y){
                    zombie.anims.play('zombie1Walk',true);
                    zombie.setVelocityY(zombieStats.speed);
                }
            },  
            startAt: 0,
            timeScale: 1,
            repeat: -1
        }); 
    },
    spawnZombie: function(scene,zombieStats){
        var zombie = gameState.zombies.create(Math.random()*11,Math.random()*window.innerHeight,`${zombieStats.imageName}`).setOrigin(0,0)
        zombie.anims.play(`${zombieStats.spawnImageName}`);
        scene.time.addEvent({
            delay: 1310,
            callback: ()=>{
                gameState.zombieBehavior(scene,zombie,zombieStats);
            },  
            startAt: 0,
            timeScale: 1
        }); 
    },
    
    zombie1Stats:{
        imageName: "zombie1",
        spawnImageName: 'zombie1Spawn',
        speed: 40
        
    }
}
