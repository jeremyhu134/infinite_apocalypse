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
    updateMoney:function(){
        gameState.moneyText.setText(`${gameState.money}`);
    },
    
    blueprint:{
        active: false,
        button: null,
        building: null,
        toggleOff:function(blueprintSprite){
            gameState.blueprint.active = false;
            gameState.blueprintSprite.destroy();
            gameState.blueprint.button.destroy();
        },
        create: function(scene,towerSprite,towerStats){
            gameState.blueprint.active = true;
            gameState.blueprintSprite = scene.physics.add.sprite(scene.input.x,scene.input.y,`${towerSprite}`).setInteractive();
            gameState.blueprint.building = towerStats;
            gameState.blueprint.button = gameState.blueprintSprite.on('pointerdown', function(pointer){
                if(gameState.money>= towerStats.cost){
                    gameState.blueprint.building.spawnTower(gameState.globalScene);
                    gameState.money -= towerStats.cost;
                    gameState.updateMoney();
                }
            });
        },
        checkControls: function (scene){
            if(gameState.keys.ESC.isDown && gameState.blueprint.active == true){
                gameState.blueprint.toggleOff(gameState.blueprintSprite);
            }
            else if(gameState.keys.ONE.isDown && gameState.blueprint.active == false){
                gameState.blueprint.create(scene,'factory',gameState.factoryStats);
            }
        }
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
            scene.physics.moveTo(zombie,target.x, target.y,gameState.zombie1Stats.speed);
            if(target.x > zombie.x){
                zombie.flipX = false;
                zombie.anims.play('zombie1Walk',true);
            }
            else if(target.x < zombie.x){
                zombie.flipX = true;
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
        findTarget: function(scene,zombie,closest){
            var dist;
            var closest = 10000;
            var target = gameState.character;
            if( gameState.buildings.getChildren().length >0){
                for (var i = 0; i < gameState.buildings.getChildren().length; i++){ 
                    dist = Phaser.Math.Distance.BetweenPoints(gameState.buildings.getChildren()[i], zombie);
                    if(dist<closest){
                        closest = dist;
                        target = gameState.buildings.getChildren()[i];
                    }
                }
            }
            if(Phaser.Math.Distance.BetweenPoints(gameState.character, zombie) < closest){
                target = gameState.character;
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
    
    createExplosion: function(scene,x,y){
        var explode = scene.physics.add.sprite(x,y,`buildingExplosion`);
        explode.anims.play('explode',true);
        scene.time.addEvent({
            delay: 1000,
            callback: ()=>{
                explode.destroy();
            },  
            startAt: 0,
            timeScale: 1
        }); 
    },
    
    factoryStats:{
        cost: 200,
        damage: 0,
        health: 200,
        attackRange: 0,
        sightRange: 0,
        attackSpeed: 0,
        spawnTower: function(scene){
            var tower = gameState.buildings.create(scene.input.x,scene.input.y,'factory').setDepth(0).setImmovable();
            tower.health = gameState.factoryStats.health;
            gameState.factoryStats.action(scene,tower);
        },
        action: function(scene,building){
            building.anims.play('factoryAction',true);
            var loop = scene.time.addEvent({
                delay: 5000,
                callback: ()=>{
                    if(building.health >0){
                        gameState.money += 10;
                        gameState.updateMoney();
                    }
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
            var loop1 = scene.time.addEvent({
                delay: 1,
                callback: ()=>{
                    if(building.health <=0){
                        gameState.createExplosion(scene,building.x,building.y);
                        building.destroy();
                        loop.destroy();
                        loop1.destroy();
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
    }
}
