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
        speed : 200,
        health: 100
    },
    chracterControls : function(scene){
        if(gameState.characterStats.health > 0){
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
        else {
            gameState.character.destroy();
            scene.physics.pause();
        }
    },
    
    spawnTower: function(scene,towerStats){
        var tower = gameState.buildings.create(500,500,'gatlingTower').setOrigin(0,0).setDepth(0);
        tower.health = towerStats.health;
        //tower.anims.play(`${zombieStats.spawnImageName}`);
        gameState.gatlingTowerStats.action(scene,tower,towerStats);
    },
    
    zombie1Stats:{
        name: "Zombie",
        speed: 20,
        health: 100,
        damage: 5,
        attackRange: 20,
        sightRange: 200,
        attackSpeed: 1000,
        spawnZombie: function(scene){
            var zombie = gameState.zombies.create(Math.random()*11,Math.random()*window.innerHeight-32,`zombie1`).setOrigin(0,0).setDepth(1);
            zombie.anims.play(`zombie1Spawn`);
            scene.time.addEvent({
                delay: 1310,
                callback: ()=>{
                    gameState.zombie1Stats.behaviourLoop(scene,zombie);
                },  
                startAt: 0,
                timeScale: 1
            }); 
        },
        movement: function (scene,zombie,target){
            if(target.x > zombie.x){
                zombie.setVelocityX(gameState.zombie1Stats.speed);
                zombie.flipX = false;
                zombie.anims.play('zombie1Walk',true);
            }
            else if(target.x < zombie.x){
                zombie.setVelocityX(-gameState.zombie1Stats.speed);
                zombie.flipX = true;
                zombie.anims.play('zombie1Walk',true);
            }
            if(target.y > zombie.y){
                zombie.setVelocityY(gameState.zombie1Stats.speed);
                zombie.anims.play('zombie1Walk',true);
            }
            else if(target.y < zombie.y){
                zombie.setVelocityY(-gameState.zombie1Stats.speed);
                zombie.anims.play('zombie1Walk',true);
            } 
        },
        attack: function (scene, target){
            if(target == gameState.character){
                gameState.characterStats.health -= gameState.zombie1Stats.damage;
            }
            else {
                target.health -= gameState.zombie1Stats.damage;
            }
        },
        findTarget: function(scene,zombie){
            var dist;
            var target = gameState.character;
            if( gameState.buildings.getChildren().length >0){
                for (var i = 0; i < gameState.buildings.getChildren().length; i++){ 
                    dist = Phaser.Math.Distance.BetweenPoints(gameState.buildings.getChildren()[i], zombie);
                    if(dist<gameState.zombie1Stats.sightRange){
                        target = gameState.buildings.getChildren()[i];
                    }
                }
            }
            return target;
        },
        behaviourLoop: function (scene,zombie){
            var target = gameState.zombie1Stats.findTarget(scene,zombie);
            var dist = Phaser.Math.Distance.BetweenPoints(target, zombie);
            var loop = scene.time.addEvent({
                delay: gameState.zombie1Stats.attackSpeed,
                callback: ()=>{
                    gameState.zombie1Stats.attack(scene,target);
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
            loop.paused = true;
            scene.time.addEvent({
                delay: 1,
                callback: ()=>{
                    target = gameState.zombie1Stats.findTarget(scene,zombie);
                    dist = Phaser.Math.Distance.BetweenPoints(target, zombie);
                    if(dist < gameState.zombie1Stats.attackRange){
                        zombie.setVelocityX(0);
                        zombie.setVelocityY(0);
                        loop.paused = false;
                    }
                    else {
                        loop.paused = true;
                        gameState.zombie1Stats.movement(scene,zombie,target);
                    }
                    
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
        }
    },
    gatlingTowerStats:{
        damage: 25,
        health: 25,
        attackRange: 50,
        sightRange: 200,
        attackSpeed: 1000,
        action: function(scene,building,towerStats){
            var target;
            for (var i = 0; i < gameState.zombies.getChildren().length; i++){ 
                dist = Phaser.Math.Distance.BetweenPoints(gameState.zombies.getChildren()[i], building);
                if(dist<towerStats.range){
                    target = gameState.zombies.getChildren()[i];
                }
            }
            var dist;
            var loopAction = scene.time.addEvent({
                delay: gameState.gatlingTowerStats.attackSpeed,
                callback: ()=>{ 
                    var dist1 = Phaser.Math.Distance.BetweenPoints(target, building);
                    if(dist1>building.range){
                        target = null;
                    }
                    else {
                        var bullet = gameState.bullets.create(building.x, building.y, 'bullet');
                        gameState.angle=Phaser.Math.Angle.Between(bullet.x,bullet.y,target.x,target.y);
                        bullet.setRotation(gameState.angle); 
                        scene.physics.moveTo(bullet,target.x, target.y,600);
                        scene.physics.add.overlap(bullet,target,(bull,targ)=>{
                            targ.health -= gameState.gatlingTowerStats.damage;
                            bull.destroy();
                        });
                    }
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
            loopAction.paused = true;
            scene.time.addEvent({
                delay: 1,
                callback: ()=>{
                    if(building.health > 0){
                        if(!target){
                            for (var i = 0; i < gameState.zombies.getChildren().length; i++){
                                
                                dist = Phaser.Math.Distance.BetweenPoints(gameState.zombies.getChildren()[i], building);
                                if(dist<towerStats.range){
                                    target = gameState.zombies.getChildren()[i];
                                }
                            }
                        }
                        if(target && dist<towerStats.range){
                            loopAction.paused = false;
                        }
                        else {
                            loopAction.paused = true;
                        }
                    }
                    else {
                        building.destroy();
                    }
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
        }
    }
}
