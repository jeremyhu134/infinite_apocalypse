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
            enableBody: true
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
    money : 200,
    wave: 1,
    characterStats: {
        speed : 150,
        health: 100
    },
    invisibleTarget : null,
    
    chracterControls : function(scene){
        if(gameState.characterStats.health > 0){
            gameState.healthText.setText(`${gameState.characterStats.health}`);
            gameState.character.depth = gameState.character.y+16;
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
            scene.time.addEvent({
                delay: 3000,
                callback: ()=>{
                    scene.scene.stop('ArenaScene');
                    scene.scene.start('MenuScene');
                },  
                startAt: 0,
                timeScale: 1
            });
        }
    },
    
    updateMoney:function(){
        gameState.moneyText.setText(`${gameState.money}`);
    },
    createIcons: function (scene){
        scene.add.image(window.innerWidth-200,10,'moneySign').setOrigin(0,0).setDepth(window.innerHeight+3);
        gameState.moneyText = scene.add.text( window.innerWidth - 160, 5, `${gameState.money}`, {
            fill: '#OOOOOO', 
            fontSize: '30px',
            fontFamily: 'Qahiri',
            strokeThickness: 10,
        }).setDepth(window.innerHeight+3);
        scene.add.image(window.innerWidth-320,10,'healthSign').setOrigin(0,0).setDepth(window.innerHeight+3);
        gameState.healthText = scene.add.text( window.innerWidth - 285, 5, `${gameState.characterStats.health}`, {
            fill: '#OOOOOO', 
            fontSize: '30px',
            fontFamily: 'Qahiri',
            strokeThickness: 10,
        }).setDepth(window.innerHeight+3);
        scene.add.image(window.innerWidth-440,10,'waveSign').setOrigin(0,0).setDepth(window.innerHeight+3);
        gameState.waveText = scene.add.text( window.innerWidth - 390, 5, `${gameState.wave}`, {
            fill: '#OOOOOO', 
            fontSize: '30px',
            fontFamily: 'Qahiri',
            strokeThickness: 10,
        }).setDepth(window.innerHeight+3);
    },
    
    blueprint:{
        active: false,
        button: null,
        building: null,
        overLap: 1,
        toggleOff:function(blueprintSprite){
            gameState.blueprint.active = false;
            gameState.blueprintSprite.destroy();
            gameState.blueprint.button.destroy();
        },
        create: function(scene,towerSprite,towerStats){
            gameState.blueprint.active = true;
            gameState.blueprintSprite = scene.physics.add.sprite(scene.input.x,scene.input.y,`${towerSprite}`).setInteractive().setDepth(1);
            gameState.blueprint.building = towerStats;
            gameState.blueprint.button = gameState.blueprintSprite.on('pointerdown', function(pointer){
                if(gameState.money >= towerStats.cost && gameState.blueprint.overLap >10){
                    gameState.blueprint.building.spawnTower(gameState.globalScene);
                    gameState.money -= towerStats.cost;
                    gameState.updateMoney();
                }
            });
            gameState.blueprintOverlapCheck = scene.physics.add.collider(gameState.blueprintSprite, gameState.buildings,()=>{
                gameState.blueprint.overLap = 0;
            });
            gameState.blueprintOverlapCheck1 = scene.physics.add.collider(gameState.blueprintSprite, gameState.zombies,()=>{
                gameState.blueprint.overLap = 0;
            });
            gameState.blueprintOverlapCheck2 = scene.physics.add.collider(gameState.blueprintSprite, gameState.character,()=>{
                gameState.blueprint.overLap = 0;
            });
        },
        checkControls: function (scene){
            if(gameState.blueprint.active == true){
                gameState.blueprint.overLap += 1;
                gameState.blueprintSprite.x = scene.input.x;
                gameState.blueprintSprite.y = scene.input.y;
                //scene.physics.moveToObject(gameState.blueprintSprite,scene.input,60,100);
            }
            if(gameState.keys.ESC.isDown && gameState.blueprint.active == true){
                gameState.blueprint.toggleOff(gameState.blueprintSprite);
                gameState.blueprintOverlapCheck.destroy();
                gameState.blueprintOverlapCheck1.destroy();
                gameState.blueprintOverlapCheck2.destroy();
            }
            else if(gameState.keys.ONE.isDown && gameState.blueprint.active == false){
                gameState.blueprint.create(scene,'factory',gameState.factoryStats);
            }
            else if(gameState.keys.TWO.isDown && gameState.blueprint.active == false){
                gameState.blueprint.create(scene,'gatlingTower',gameState.gatlingTowerStats);
            }
            else if(gameState.keys.THREE.isDown && gameState.blueprint.active == false){
                gameState.blueprint.create(scene,'woodWall',gameState.woodWallStats);
                gameState.blueprintSprite.body.offset.y = 15;
                gameState.blueprintSprite.body.height = 15;
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
        spawnZombie: function(scene,x,y){
            var zombie = gameState.zombies.create(x,y,`zombie1`).setDepth(1);
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
            zombie.anims.play('zombie1Walk',true);
            if(target.x > zombie.x){
                zombie.flipX = false;
            }
            else if(target.x < zombie.x){
                zombie.flipX = true;
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
            zombie.health = gameState.zombie1Stats.health;
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
            var bLoop = scene.time.addEvent({
                delay: 1,
                callback: ()=>{
                    if(zombie.health > 0){
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
                    }
                    else {
                        bLoop.destroy();
                        loop.destroy();
                        zombie.anims.play('zombie1Death',true);
                        zombie.setVelocityX(0);
                        zombie.setVelocityY(0);
                        scene.time.addEvent({
                            delay: 400,
                            callback: ()=>{
                            zombie.destroy(); 
                            },  
                            startAt: 0,
                            timeScale: 1
                        }); 
                    }
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
        }
    },
    
    zombieWizardStats:{
        name: "Zombie Wizard",
        speed: 10,
        health: 1000,
        damage: 20,
        attackRange: 250,
        attackSpeed: 3000,
        spawnZombie: function(scene){
            var zombie = gameState.zombies.create(Math.random()*11,Math.random()*window.innerHeight-32,`zombieWizard`).setDepth(1);
            zombie.anims.play(`zombieWizardSpawn`);
            scene.time.addEvent({
                delay: 1310,
                callback: ()=>{
                    gameState.zombieWizardStats.behaviourLoop(scene,zombie);
                },  
                startAt: 0,
                timeScale: 1
            }); 
        },
        movement: function (scene,zombie,target){
            scene.physics.moveTo(zombie,target.x, target.y,gameState.zombieWizardStats.speed);
            zombie.anims.play('zombieWizardWalk',true);
            if(target.x > zombie.x){
                zombie.flipX = false;
            }
            else if(target.x < zombie.x){
                zombie.flipX = true;
            }
        },
        attack: function (scene, target,zombie){
            var bullet = gameState.bullets.create(zombie.x,zombie.y,'zombieWizardBall');
            gameState.angle=Phaser.Math.Angle.Between(zombie.x,zombie.y,target.x,target.y);
            bullet.setRotation(gameState.angle); 
            scene.physics.moveTo(bullet,target.x,target.y,300);
            var bulletLoop = scene.time.addEvent({
                delay: 10000,
                callback: ()=>{
                    bullet.destroy();
                },  
                startAt: 0,
                timeScale: 1
            });
            scene.physics.add.overlap(bullet, gameState.buildings,(bull, targ)=>{
                bulletLoop.destroy();
                bull.destroy();
                targ.health -= gameState.zombieWizardStats.damage;
            });
            scene.physics.add.overlap(bullet, gameState.character,(bull, targ)=>{
                bulletLoop.destroy();
                bull.destroy();
                gameState.characterStats.health -= gameState.zombieWizardStats.damage;
            });
        },
        findTarget: function(scene,zombie){
            var dist;
            var closest = 10000;
            var target = gameState.character;
            if( gameState.buildings.getChildren().length > 0){
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
            zombie.health = gameState.zombieWizardStats.health;
            var target = gameState.zombieWizardStats.findTarget(scene,zombie);
            var dist = Phaser.Math.Distance.BetweenPoints(target, zombie);
            var spawnLoop = scene.time.addEvent({
                delay: 10000,
                callback: ()=>{
                    scene.time.addEvent({
                        delay: 1,
                        callback: ()=>{
                            gameState.zombie1Stats.spawnZombie(scene,zombie.x+(Math.random()*200-100),zombie.y+(Math.random()*200-100));
                        },  
                        startAt: 0,
                        timeScale: 1,
                        repeat: 3
                    });
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
            var loop = scene.time.addEvent({
                delay: gameState.zombieWizardStats.attackSpeed,
                callback: ()=>{
                    gameState.zombieWizardStats.attack(scene,target,zombie);
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
            loop.paused = true;
            var bLoop = scene.time.addEvent({
                delay: 1,
                callback: ()=>{
                    if(zombie.health > 0){
                        target = gameState.zombieWizardStats.findTarget(scene,zombie);
                        dist = Phaser.Math.Distance.BetweenPoints(target, zombie);
                        if(dist < gameState.zombieWizardStats.attackRange){
                            zombie.setVelocityX(0);
                            zombie.setVelocityY(0);
                            loop.paused = false;
                        }
                        else {
                            loop.paused = true;
                            gameState.zombieWizardStats.movement(scene,zombie,target);
                        }
                    }
                    else {
                        bLoop.destroy();
                        loop.destroy();
                        spawnLoop.destroy();
                        //zombie.anims.play('zombieWizardDeath',true);
                        zombie.setVelocityX(0);
                        zombie.setVelocityY(0);
                        scene.time.addEvent({
                            delay: 400,
                            callback: ()=>{
                                zombie.destroy(); 
                            },  
                            startAt: 0,
                            timeScale: 1
                        }); 
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
        moneyProduce: 20,
        count: 0,
        maxCount: 20,
        spawnTower: function(scene){
            if(gameState.factoryStats.count < 20){
                gameState.factoryStats.count ++;
                var tower = gameState.buildings.create(gameState.blueprintSprite.x,gameState.blueprintSprite.y,'factory').setDepth(scene.input.y).setImmovable();
                tower.health = gameState.factoryStats.health;
                gameState.factoryStats.action(scene,tower);
            }else {
                gameState.money += 200;
                gameState.updateMoney();
            }
        },
        action: function(scene,building){
            building.anims.play('factoryAction',true);
            var loop = scene.time.addEvent({
                delay: 5000,
                callback: ()=>{
                    if(building.health >0){
                        gameState.money += gameState.factoryStats.moneyProduce;
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
        cost: 50,
        damage: 10,
        health: 25,
        attackRange: 150,
        attackSpeed: 200,
        spawnTower: function(scene){
            var tower = gameState.buildings.create(gameState.blueprintSprite.x,gameState.blueprintSprite.y,'gatlingTower').setDepth(scene.input.y).setImmovable();
            tower.health = gameState.gatlingTowerStats.health;
            gameState.gatlingTowerStats.action(scene,tower);
        },
        findTarget: function(scene,building){
            var dist;
            var closest = 10000;
            var target = gameState.invisibleTarget;
            if(gameState.zombies.getChildren().length > 0){
                for (var i = 0; i < gameState.zombies.getChildren().length; i++){ 
                    dist = Phaser.Math.Distance.BetweenPoints(gameState.zombies.getChildren()[i], building);
                    if(dist<closest){
                        closest = dist;
                        target = gameState.zombies.getChildren()[i];
                    }
                }
            }
            return target;
        },
        action: function(scene,building){
            var target = gameState.gatlingTowerStats.findTarget(scene,building);
            var dist = Phaser.Math.Distance.BetweenPoints(target, building);
            var loop = scene.time.addEvent({
                delay: gameState.gatlingTowerStats.attackSpeed,
                callback: ()=>{
                    var bullet = gameState.bullets.create(building.x,building.y,'bullet');
                    gameState.angle=Phaser.Math.Angle.Between(building.x,building.y,target.x,target.y);
                    bullet.setRotation(gameState.angle); 
                    scene.physics.moveTo(bullet,target.x +(Math.random()*6-10),target.y +(Math.random()*6-10),800);
                    var bulletLoop = scene.time.addEvent({
                        delay: 8000,
                        callback: ()=>{
                            bullet.destroy();
                        },  
                        startAt: 0,
                        timeScale: 1
                    });
                    scene.physics.add.overlap(bullet, gameState.zombies,(bull, targ)=>{
                        bulletLoop.destroy();
                        bull.destroy();
                        targ.health -= gameState.gatlingTowerStats.damage;
                    });
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
            loop.paused = true;
            var loop1 = scene.time.addEvent({
                delay: 1,
                callback: ()=>{
                    if(building.health <=0){
                        gameState.createExplosion(scene,building.x,building.y);
                        building.destroy();
                        loop.destroy();
                        loop1.destroy();
                    }
                    else {
                        gameState.gatlingTowerStats.findTarget(scene,building)
                    }
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            });
            var bLoop = scene.time.addEvent({
                delay: 1,
                callback: ()=>{
                    if(building.health > 0){
                        target = gameState.gatlingTowerStats.findTarget(scene,building);
                        dist = Phaser.Math.Distance.BetweenPoints(target, building);
                        if(dist < gameState.gatlingTowerStats.attackRange){
                            if(target.x < building.x){
                                building.flipX = true;
                            }else {
                                building.flipX = false;
                            }
                            building.anims.play('gatlingTowerAction',true);
                            loop.paused = false;
                        }
                        else {
                            loop.paused = true;
                            building.anims.play('gatlingTowerIdle',true);
                        }
                    }
                    else {
                        bLoop.destroy();
                        loop.destroy();
                        loop1.destroy();
                        building.destroy(); 
                    }
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            });  
        }
    },
    
    woodWallStats:{
        cost: 50,
        health: 50,
        count: 0,
        spawnTower: function(scene){
            var tower = gameState.buildings.create(gameState.blueprintSprite.x,gameState.blueprintSprite.y,'woodWall').setDepth(scene.input.y).setImmovable();
            tower.body.offset.y = 15;
            tower.body.height = 15;
            tower.health = gameState.woodWallStats.health;
            gameState.woodWallStats.action(scene,tower);
        },
        action: function(scene,building){
            var loop1 = scene.time.addEvent({
                delay: 1,
                callback: ()=>{
                    if(building.health <=0){
                        gameState.createExplosion(scene,building.x,building.y);
                        building.destroy();
                        loop1.destroy();
                    }
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
        }
    }
}

let save = gameState
